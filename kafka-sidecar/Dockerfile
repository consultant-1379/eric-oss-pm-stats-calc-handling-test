FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python3", "main.py"]
