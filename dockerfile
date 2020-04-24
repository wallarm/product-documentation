FROM python:3.7.0
COPY ./product-docs-en/ /product-docs-en/
WORKDIR /product-docs-en/
RUN pip install mkdocs
CMD ["mkdocs", "build"]