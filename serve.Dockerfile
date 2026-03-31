FROM python:3.14.0

WORKDIR /tmp
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /docs
VOLUME /docs

EXPOSE 8000
ENTRYPOINT ["zensical"]
CMD ["serve", "--dev-addr=0.0.0.0:8000", "--config-file=mkdocs-6.x.yml"]
