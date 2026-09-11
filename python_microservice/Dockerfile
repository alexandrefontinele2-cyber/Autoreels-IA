# Dockerfile para o Microserviço de Edição de Vídeo (Python + FFmpeg + Auto-Editor)
FROM python:3.11-slim

# Evita buffers no stdout/stderr
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Instalação de dependências do sistema e FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalação de pacotes Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Cópia do código-fonte
COPY . .

# Porta padrão
EXPOSE 8000

# Execução com Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
