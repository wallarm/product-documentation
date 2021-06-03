# Running API Firewall on Docker

This guide walks through downloading, installing, and starting Wallarm API Firewall on Docker.

## Requirements

* [Installed and configured Docker](https://docs.docker.com/get-docker/)
* [OpenAPI 3.0 specification](https://swagger.io/specification/) developed for the REST API of the application that should be protected with Wallarm API Firewall


## Step 1. Create the Docker network

To allow the containerized application and API Firewall communication without manual linking, create a separate [Docker network](https://docs.docker.com/network/) by using the command `docker network create`. The application and API Firewall containers will be linked to this network.

For example, to create the Docker network named `api-firewall-network`:

```bash
docker network create api-firewall-network
```

## Step 2. Start the containerized application

Start the containerized application that should be protected with API Firewall by using the command `docker run` and passing the created network name in the option `--network`.

For example, to start the [kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) Docker container connected to the `api-firewall-network` and assigned with the `backend` [network alias](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) on the port 8090:

```bash
docker run --rm -it --network api-firewall-network \
    --network-alias backend -p 8090:8090 kennethreitz/httpbin
```

## Step 3. Pull the Docker image of API Firewall

Pull the following API Firewall Docker image:

```bash
docker pull wallarm/api-firewall
```

## Step 4. Start API Firewall

Start the pulled API Firewall image by using the command `docker run` and passing API Firewall configuration in the environment variables as described below.

For example, to start API Firewall connected to the `api-firewall-network` [network](https://docs.docker.com/network/) and assigned with the `api-firewall` [network alias](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) on the port 8088:

```bash
docker run --rm -it --network api-firewall-network --network-alias api-firewall \
    -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
    -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
    -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
    -p 8088:8088 wallarm/api-firewall
```

**With the `-v` option**, please mount the [OpenAPI 3.0 specification](https://swagger.io/specification/) to the API Firewall container directory:
    
* `HOST_PATH_TO_SPEC`: the path to the OpenAPI 3.0 specification for your application REST API located on the host machine. The accepted file formats are YAML and JSON (`.yaml`, `.yml`, `.json` file extensions). For example: `/opt/my-api/openapi3/swagger.json`.
* `<CONTAINER_PATH_TO_SPEC>`: the path to the container directory to mount the OpenAPI 3.0 specification to. For example: `/api-firewall/resources/swagger.json`.

**With the `-e` option**, please set the API Firewall configuration through the following environment variables:

| Environment variable              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Required? |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| **Main settings**                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |           |
| `APIFW_API_SPECS`                 | Path to the OpenAPI 3.0 specification mounted to the container. For example: `/api-firewall/resources/swagger.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Yes       |
| `APIFW_URL`                       | URL for API Firewall. For example: `http://0.0.0.0:8088/`. The port value should correspond to the container port published to the host.<br><br>If API Firewall listens to the HTTPS protocol, please mount the generated SSL/TLS certificate and private key to the container, and pass to the container the **API Firewall SSL/TLS settings** described below.                                                                                                                                                                                                                                                   | Yes       |
| `APIFW_SERVER_URL`                | URL of the application described in the mounted OpenAPI specification that should be protected with API Firewall. For example: `http://backend:80`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Yes       |
| `APIFW_REQUEST_VALIDATION`        | API Firewall mode when validating requests sent to the application URL:<ul><li>`BLOCK` to block and log the requests that do not match the schema provided in the mounted OpenAPI 3.0 specification (the `403 Forbidden` response will be returned to the blocked requests).</li><li>`LOG_ONLY` to log but not block the requests that do not match the schema provided in the mounted OpenAPI 3.0 specification.</li><li>`DISABLE` to disable request validation.</li></ul>                                                                                                                           | Yes       |
| `APIFW_RESPONSE_VALIDATION`       | API Firewall mode when validating application responses to incoming requests:<ul><li>`BLOCK` to block and log the request if the application response to this request does not match the schema provided in the mounted OpenAPI 3.0 specification. This request will be proxied to the application URL but the client will receive the `403 Forbidden` response.</li><li>`LOG_ONLY` to log but not block the request if the application response to this request does not match the schema provided in the mounted OpenAPI 3.0 specification.</li><li>`DISABLE` to disable request validation.</li></ul> | Yes       |
| `APIFW_LOG_LEVEL`                 | API Firewall logging level. Possible values:<ul><li>`DEBUG` to log events of any type (INFO, ERROR, WARNING, and DEBUG).</li><li>`INFO` to log events of the INFO, WARNING, and ERROR types.</li><li>`WARNING` to log events of the WARNING and ERROR types.</li><li>`ERROR` to log events of only the ERROR type.</li></ul> Default value is `DEBUG`. Logs on requests and responses that do not match the provied schema have the ERROR type.                                                                                                                                                                                                                                       | No        |
| **API Firewall SSL/TLS settings** |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |           |
| `APIFW_TLS_CERTS_PATH`            | The path to the container directory with the mounted certificate and private key generated for API Firewall.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | No        |
| `APIFW_TLS_CERT_FILE`             | The name of the file with the SSL/TLS certificate generated for API Firewall and located in the directory specified in `APIFW_TLS_CERTS_PATH`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | No        |
| `APIFW_TLS_CERT_KEY`              | The name of the file with the SSL/TLS private key generated for API Firewall and located in the directory specified in `APIFW_TLS_CERTS_PATH`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | No        |
| **Timeout settings**              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |           |
| `APIFW_READ_TIMEOUT`              | The timeout for API Firewall to read the full request (including body) sent to the application URL. The default value is `5s`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | No        |
| `APIFW_WRITE_TIMEOUT`             | The timeout for API Firewall to return the response to the request sent to the application URL. The default value is `5s`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | No        |
| `APIFW_SERVER_MAX_CONNS_PER_HOST` | The maximum number of connections that API Firewall can handle simultaneously. The default value is `512`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | No        |
| `APIFW_SERVER_READ_TIMEOUT`       | The timeout for API Firewall to read the full response (including body) returned to the request by the application. The default value is `5s`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | No        |
| `APIFW_SERVER_WRITE_TIMEOUT`      | The timeout for API Firewall to write the full request (including body) to the application. The default value is `5s`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | No        |
| `APIFW_SERVER_DIAL_TIMEOUT`       | The timeout for API Firewall to connect to the application. The default value is `200ms`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | No        |

## Step 5. Test API Firewall operation

To test API Firewall operation, send the request that does not match the mounted Open API 3.0 specification to the API Firewall Docker container address. For example, you can pass the string value in the parameter that requires the integer value.

If the request does not match the providded API schema, the appropriate ERROR message will be added to the API Firewall Docker container logs.

## Step 6. Enable traffic on API Firewall

To finalize the API Firewall configuration, please enable incoming traffic on API Firewall by updating your application deployment scheme configuration. For example, this would require updating the Ingress, NGINX, or load balancer settings.
