FROM python:3.9.10-slim

ENV MODEL chgk13/stablecode-completion-alpha-3b-4k-openvino-int8
ENV DEVICE cpu

WORKDIR /app

COPY requirements.txt /app/ 

RUN pip install -r requirements.txt  # Install dependencies

COPY . /app/

CMD python main.py --model $MODEL --device $DEVICE