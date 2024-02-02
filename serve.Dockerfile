FROM python:3.8.0

WORKDIR /tmp

# If you need to build the docs without mkdocs-material-insiders

COPY requirements-no-insiders.txt ./
RUN pip install --no-cache-dir -r requirements-no-insiders.txt

WORKDIR /docs
VOLUME /docs
RUN rm -rf docs

EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000", "--config-file=mkdocs-4.10.yml"]


# If you have a token to access the mkdocs-material-insiders repo and need to run the docs with it. Comment out the above section then and uncomment the below

# ARG CLONE_INSIDERS_TOKEN
# ENV CLONE_INSIDERS_TOKEN=${CLONE_INSIDERS_TOKEN}
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt
# RUN apt-get update && apt-get install -y pngquant

# WORKDIR /docs
# VOLUME /docs
# RUN rm -rf docs

# EXPOSE 8000

# ENTRYPOINT ["sh", "-c", "INSIDERS=true mkdocs serve --dev-addr=0.0.0.0:8000 --config-file=mkdocs-4.10.yml"]
