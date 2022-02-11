# build stage
FROM python:3.7.0 as build-stage

WORKDIR /tmp

# Plugin for image zoom
RUN git clone https://github.com/g-provost/lightgallery-markdown.git .
RUN python setup.py install

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory
WORKDIR /docs
COPY . .
RUN mkdocs build
RUN mkdocs build -f mkdocs-3.4.yml
RUN mkdocs build -f mkdocs-3.2.yml
RUN mkdocs build -f mkdocs-2.18.yml

# production stage
FROM nginx:1.18-alpine as production-stage
COPY --from=build-stage /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
