FROM python:3.8.0 as latest
EXPOSE 8000

WORKDIR /tmp

COPY requirements.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Set working directory
WORKDIR /docs
COPY . .

RUN mkdocs build -f mkdocs-4.6.yml
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000", "--config-file=mkdocs-4.6.yml"]

FROM latest as all
RUN mkdocs build -f mkdocs-4.8.yml
RUN mkdocs build -f mkdocs-ja-4.8.yml
RUN mkdocs build -f mkdocs-4.6.yml
RUN mkdocs build -f mkdocs-ja-4.6.yml
RUN mkdocs build -f mkdocs-4.4.yml
RUN mkdocs build -f mkdocs-deprecated.yml
RUN mkdocs build -f mkdocs-3.6.yml
RUN mkdocs build -f mkdocs-2.18.yml

# production stage
FROM nginx:1.18-alpine as prod
COPY --from=all /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
