FROM python:3.14.0 AS build

WORKDIR /tmp
COPY requirements.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /docs
COPY . .

RUN zensical build -f mkdocs-6.x.yml
RUN zensical build -f mkdocs-7.x.yml
RUN zensical build -f mkdocs-5.0.yml
RUN zensical build -f mkdocs-deprecated.yml
RUN zensical build -f mkdocs-ja-6.x.yml
RUN zensical build -f mkdocs-tr-6.x.yml
RUN zensical build -f mkdocs-pt-BR-4.8.yml
RUN zensical build -f mkdocs-ar-4.10.yml

FROM nginx:1.18-alpine AS prod
COPY --from=build /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]