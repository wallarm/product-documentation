FROM python:3.8.0

WORKDIR /tmp

# If you need to build the docs without mkdocs-material-insiders
COPY requirements-no-insiders.txt ./
RUN pip install --no-cache-dir -r requirements-no-insiders.txt

# If you have access to the mkdocs-material-insiders repo and need to build the docs with it
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt

# Set working directory
WORKDIR /docs
VOLUME /docs
RUN rm -rf docs

EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000", "--config-file=mkdocs-4.8.yml"]