FROM python:3.8.0 as latest
EXPOSE 8000

COPY requirements.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Set working directory
WORKDIR /docs
COPY . .

RUN mkdocs build -f docs/4.6/mkdocs.yml
CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000", "--config-file=docs/4.6/mkdocs.yml"]

FROM latest as all
RUN mkdocs build -f docs/4.4/mkdocs.yml
RUN mkdocs build -f docs/4.2/mkdocs.yml
RUN mkdocs build -f docs/3.6/mkdocs.yml
RUN mkdocs build -f docs/2.18/mkdocs.yml

# production stage
FROM nginx:1.18-alpine as prod
COPY --from=all /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
