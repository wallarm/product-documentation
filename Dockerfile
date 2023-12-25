FROM python:3.8.0 as latest
EXPOSE 8000

WORKDIR /tmp

# If you need to build the docs without mkdocs-material-insiders

COPY requirements-no-insiders.txt /tmp
RUN pip install --no-cache-dir -r /tmp/requirements-no-insiders.txt

WORKDIR /docs
COPY . .

FROM latest as all
RUN mkdocs build -f mkdocs-4.8.yml
RUN mkdocs build -f mkdocs-4.6.yml
RUN mkdocs build -f mkdocs-4.4.yml
RUN mkdocs build -f mkdocs-deprecated.yml
RUN mkdocs build -f mkdocs-3.6.yml
RUN mkdocs build -f mkdocs-2.18.yml
RUN mkdocs build -f mkdocs-ja-4.8.yml
RUN mkdocs build -f mkdocs-tr-4.8.yml
RUN mkdocs build -f mkdocs-pt-BR-4.8.yml

FROM nginx:1.18-alpine as prod
COPY --from=all /docs/site /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



# If you have a token to access the mkdocs-material-insiders repo and need to run the docs with it. Comment out the above section then and uncomment the below

# ARG CLONE_INSIDERS_TOKEN
# ENV CLONE_INSIDERS_TOKEN=${CLONE_INSIDERS_TOKEN}
# COPY requirements.txt /tmp
# RUN pip install --no-cache-dir -r /tmp/requirements.txt
# RUN apt-get update && apt-get install -y pngquant

# WORKDIR /docs
# COPY . .

# FROM latest as all
# RUN INSIDERS=true mkdocs build -f mkdocs-4.8.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-4.6.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-4.4.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-deprecated.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-3.6.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-2.18.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-ja-4.8.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-tr-4.8.yml
# RUN INSIDERS=true mkdocs build -f mkdocs-pt-BR-4.8.yml

# FROM nginx:1.18-alpine as prod
# COPY --from=all /docs/site /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]