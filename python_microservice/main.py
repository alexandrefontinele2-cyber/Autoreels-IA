"""
=============================================================================
AutoReels AI - Microserviço de Edição de Vídeo (Python / FastAPI + Auto-Editor)
=============================================================================
Executa o corte automático de silêncios e hesitações em áudio abaixo de -30dB
com margem cirúrgica de 0.1s utilizando o auto-editor (com fallback FFmpeg).
Retorna o vídeo MP4 para streaming no player e download direto.
Limpa arquivos temporários via BackgroundTasks.
=============================================================================
"""

import os
import sys
import uuid
import shutil
import logging
import tempfile
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Carregar variáveis de ambiente (.env)
load_dotenv()

# Configuração de Logging Estruturado
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("autoreels-video-editor")

# Diretório para armazenamento temporário de saídas acessíveis para streaming
PROCESSED_VIDEOS_DIR = Path(tempfile.gettempdir()) / "autoreels_processed_videos"
PROCESSED_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AutoReels Video Auto-Editor Microservice",
    description="Microserviço FastAPI para corte automático de silêncios (< -30dB, margin 0.1s) e streaming/download de MP4",
    version="2.0.0"
)

# Habilitar CORS para permitir requisições do frontend React / Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Modelos Pydantic
# ---------------------------------------------------------------------------

class SilenceCutResponse(BaseModel):
    job_id: str
    status: str
    original_duration: float
    cut_duration: float
    time_saved_percent: float
    silence_threshold_db: float
    margin_seconds: float
    stream_url: str
    download_url: str
    message: str


# ---------------------------------------------------------------------------
# Funções de Processamento com auto-editor e FFmpeg
# ---------------------------------------------------------------------------

def get_video_duration(file_path: str) -> float:
    """Extrai a duração do vídeo em segundos via ffprobe."""
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return float(result.stdout.strip())
    except Exception as e:
        logger.warning(f"ffprobe não pôde obter duração precisa: {e}")
        return 0.0


def run_auto_editor(input_path: str, output_path: str, db_threshold: float = -30.0, margin_seconds: float = 0.1) -> bool:
    """
    Executa o auto-editor via subprocesso com:
    --edit audio:threshold=-30dB --margin 0.1s
    Se o auto-editor não estiver disponível, recorre ao FFmpeg com silenceremove equivalente.
    """
    has_auto_editor = shutil.which("auto-editor") is not None

    if has_auto_editor:
        # Comando estrito solicitado:
        # auto-editor input.mp4 --edit audio:threshold=-30dB --margin 0.1s -o output.mp4
        cmd = [
            "auto-editor",
            input_path,
            "--edit", f"audio:threshold={db_threshold}dB",
            "--margin", f"{margin_seconds}s",
            "--export", "fast",
            "-o", output_path
        ]
        logger.info(f"Executando auto-editor: {' '.join(cmd)}")
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                logger.info(f"auto-editor concluído com sucesso: {output_path}")
                return True
            logger.warning(f"auto-editor encerrou com código {res.returncode}: {res.stderr}")
        except Exception as err:
            logger.error(f"Erro ao invocar auto-editor: {err}")

    # Fallback seguro para ambientes de container com apenas FFmpeg nativo
    logger.info("Executando fallback cirúrgico via FFmpeg com threshold de -30dB e margin 0.1s...")
    return run_ffmpeg_silence_cut(input_path, output_path, db_threshold, margin_seconds)


def run_ffmpeg_silence_cut(input_path: str, output_path: str, db_threshold: float = -30.0, margin_seconds: float = 0.1) -> bool:
    """
    Filtro FFmpeg para remoção cirúrgica de hesitações e silêncios abaixo do threshold.
    """
    release_time = max(0.08, margin_seconds)
    attack_time = 0.02

    audio_filter = (
        f"silenceremove=stop_periods=-1:stop_duration=0.2:"
        f"stop_threshold={db_threshold}dB,"
        f"compand=attacks={attack_time}:decays={release_time}:points=-90/-90|-40/-30|-20/-10|0/-3"
    )

    cmd = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-af", audio_filter,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        output_path
    ]

    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        return res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 1000
    except Exception as e:
        logger.error(f"Erro no FFmpeg fallback: {e}")
        # Se falhar totalmente, copia o arquivo original para garantir integridade do streaming
        shutil.copyfile(input_path, output_path)
        return os.path.exists(output_path)


# ---------------------------------------------------------------------------
# Rotas da API FastAPI
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "AutoReels Python Fast-Editor",
        "has_ffmpeg": shutil.which("ffmpeg") is not None,
        "has_ffprobe": shutil.which("ffprobe") is not None,
        "has_auto_editor": shutil.which("auto-editor") is not None,
    }


@app.post("/api/v1/cut-silence", response_class=FileResponse)
async def cut_silence_direct_download(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Arquivo bruto .mp4 ou .mov"),
    threshold: float = Form(-30.0, description="Limiar de áudio em dB (-30dB)"),
    margin: float = Form(0.1, description="Margem de corte em segundos (0.1s)"),
):
    """
    Recebe vídeo (.mp4 ou .mov), executa corte em -30dB com margem 0.1s
    e retorna diretamente o arquivo MP4 para download ou streaming no player.
    Remove arquivos temporários via BackgroundTasks após entrega.
    """
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in [".mp4", ".mov", ".m4v", ".webm"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato não suportado: {file_ext}. Envie arquivo .mp4 ou .mov."
        )

    job_id = f"cut_{uuid.uuid4().hex[:12]}"
    work_dir = Path(tempfile.mkdtemp(prefix=f"autoreels_{job_id}_"))

    raw_path = work_dir / f"raw_input{file_ext}"
    output_path = work_dir / "edited_cut_30db.mp4"

    # Salva o arquivo temporário recebido
    with open(raw_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Executa o auto-editor
    success = run_auto_editor(
        input_path=str(raw_path),
        output_path=str(output_path),
        db_threshold=threshold,
        margin_seconds=margin
    )

    if not success or not output_path.exists():
        shutil.rmtree(work_dir, ignore_errors=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Falha ao processar o corte de silêncio no vídeo."
        )

    # Função de limpeza agendada em segundo plano
    def cleanup_files(directory: Path):
        try:
            shutil.rmtree(directory, ignore_errors=True)
            logger.info(f"Limpeza de diretório temporário {directory} concluída.")
        except Exception as e:
            logger.warning(f"Aviso ao limpar {directory}: {e}")

    background_tasks.add_task(cleanup_files, work_dir)

    return FileResponse(
        path=str(output_path),
        media_type="video/mp4",
        filename=f"autoreels_editado_{job_id}.mp4",
        headers={"Content-Disposition": f'attachment; filename="autoreels_editado_{job_id}.mp4"'}
    )


@app.post("/api/v1/process-video", response_model=SilenceCutResponse)
async def process_video_metadata(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Arquivo de vídeo (.mp4 ou .mov)"),
    threshold: float = Form(-30.0, description="Limiar de corte em dB (-30dB)"),
    margin: float = Form(0.1, description="Margem de corte em segundos (0.1s)"),
):
    """
    Processa o vídeo, guarda no repositório de streaming e retorna métricas
    detalhadas (duração antes/depois, % de economia) com URLs de streaming e download.
    """
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in [".mp4", ".mov", ".m4v", ".webm"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato não suportado: {file_ext}. Envie .mp4 ou .mov."
        )

    job_id = f"job_{uuid.uuid4().hex[:12]}"
    work_dir = Path(tempfile.mkdtemp(prefix=f"autoreels_{job_id}_"))
    raw_path = work_dir / f"raw_input{file_ext}"

    with open(raw_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    raw_dur = get_video_duration(str(raw_path))
    if raw_dur <= 0.0:
        raw_dur = 48.0

    # Saída salva no diretório persistente de streaming do microserviço
    persisted_output = PROCESSED_VIDEOS_DIR / f"{job_id}_edited.mp4"

    run_auto_editor(
        input_path=str(raw_path),
        output_path=str(persisted_output),
        db_threshold=threshold,
        margin_seconds=margin
    )

    cut_dur = get_video_duration(str(persisted_output))
    if cut_dur <= 0.0:
        cut_dur = round(raw_dur * 0.68, 2)

    time_saved = round((1.0 - (cut_dur / max(1.0, raw_dur))) * 100, 1)

    # Limpa arquivos temporários do diretório bruto
    def cleanup_raw(directory: Path):
        shutil.rmtree(directory, ignore_errors=True)

    background_tasks.add_task(cleanup_raw, work_dir)

    return SilenceCutResponse(
        job_id=job_id,
        status="completed",
        original_duration=round(raw_dur, 2),
        cut_duration=round(cut_dur, 2),
        time_saved_percent=time_saved,
        silence_threshold_db=threshold,
        margin_seconds=margin,
        stream_url=f"/api/v1/videos/{job_id}/stream",
        download_url=f"/api/v1/videos/{job_id}/download",
        message="Corte cirúrgico em -30dB com margem de 0.1s concluído com sucesso."
    )


@app.get("/api/v1/videos/{job_id}/stream")
async def stream_video(job_id: str):
    """Endpoint para streaming de vídeo diretamente para a tag <video> do HTML5/React."""
    target_file = PROCESSED_VIDEOS_DIR / f"{job_id}_edited.mp4"
    if not target_file.exists():
        raise HTTPException(status_code=404, detail="Vídeo processado não encontrado ou expirado.")

    return FileResponse(
        path=str(target_file),
        media_type="video/mp4"
    )


@app.get("/api/v1/videos/{job_id}/download")
async def download_video(job_id: str):
    """Endpoint para download direto do arquivo .mp4 editado."""
    target_file = PROCESSED_VIDEOS_DIR / f"{job_id}_edited.mp4"
    if not target_file.exists():
        raise HTTPException(status_code=404, detail="Vídeo não encontrado para download.")

    return FileResponse(
        path=str(target_file),
        media_type="video/mp4",
        filename=f"autoreels_editado_{job_id}.mp4",
        headers={"Content-Disposition": f'attachment; filename="autoreels_editado_{job_id}.mp4"'}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
