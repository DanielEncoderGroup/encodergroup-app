FROM python:3.10-slim

# Configuración para el entorno de Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias de sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar solo la aplicación FastAPI (ignorando la implementación Node.js)
COPY app/ ./app/
COPY .env .env.example ./

# Puerto para FastAPI
EXPOSE 5000

# Comando para iniciar la aplicación FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]