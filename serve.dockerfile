FROM python:3.9.0

WORKDIR /tmp

# Plugin for image zoom
RUN git clone https://github.com/g-provost/lightgallery-markdown.git .
RUN python setup.py install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory
WORKDIR /docs
VOLUME /docs
RUN rm -rf docs

EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000", "--config-file=mkdocs.yml"]