FROM python:3.10-slim


LABEL version="1.0"


WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000/tcp
EXPOSE 8000/udp
CMD ["python", "unicertverify/manage.py", "runserver"]