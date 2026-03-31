FROM python:3.14.0 AS build

WORKDIR /tmp
COPY requirements.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /docs
COPY . .

# Copy images into each docs_dir before build (zensical doesn't follow symlinks)
RUN cp -R images/ docs/6.x/images/ && zensical build -f mkdocs-6.x.yml && rm -rf docs/6.x/images/
RUN cp -R images/ docs/7.x/images/ && zensical build -f mkdocs-7.x.yml && rm -rf docs/7.x/images/
RUN cp -R images/ docs/5.0/images/ && zensical build -f mkdocs-5.0.yml && rm -rf docs/5.0/images/
RUN cp -R images/ docs/deprecated/images/ && zensical build -f mkdocs-deprecated.yml && rm -rf docs/deprecated/images/
RUN cp -R images/ docs/ja/images/ && zensical build -f mkdocs-ja-6.x.yml && rm -rf docs/ja/images/
RUN cp -R images/ docs/tr/images/ && zensical build -f mkdocs-tr-6.x.yml && rm -rf docs/tr/images/
RUN cp -R images/ docs/pt-BR/images/ && zensical build -f mkdocs-pt-BR-4.8.yml && rm -rf docs/pt-BR/images/
RUN cp -R images/ docs/ar/images/ && zensical build -f mkdocs-ar-4.10.yml && rm -rf docs/ar/images/

FROM nginx:1.18-alpine AS prod
COPY --from=build /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
