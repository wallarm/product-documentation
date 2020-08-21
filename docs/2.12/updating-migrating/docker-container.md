# Updating the Docker Container

To update the Wallarm modules installed inside the Docker container, you need to:

1. Download the updated image.
2. Stop the running container.
3. Start the container on the new image.

## 1. Download the Updated Image

Run the command:

``` bash
docker pull wallarm/node:2.12
```

## 2. Stop the Running Container

Run the command:

``` bash
docker stop <container name>
```

## 3. Start the Container on the New Image.

Run the command:

``` bash
docker run -d -v /path/to/license.key:/etc/wallarm/license.key -v /path/to/node.yaml:/etc/wallarm/node.yaml -e NGINX_BACKEND=93.184.216.34 wallarm/node:2.12
```

!!! info "See also"
    [Deploying with Docker](../admin-en/installation-docker-en.md)
