# API Firewall changelog

This page describes new releases of Wallarm API Firewall.

## v0.6.4 (2021-08-18)

### New features

* Added monitoring for Shadow API endpoints. API Firewall operating in the `LOG_ONLY` mode for both the requests and responses marks all endpoints that are not included in the specification and are returning the code different from `404` as the shadow ones. You can exclude response codes indicating shadow endpoints using the environment variable `APIFW_SHADOW_API_EXCLUDE_LIST`.
* Configuration of the HTTP response status code returned by API Firewall to blocked requests (via the environment variable `APIFW_CUSTOM_BLOCK_STATUS_CODE`). 
* Ability to return the header containing the reason for the request blocking (via the environment variable `APIFW_ADD_VALIDATION_STATUS_HEADER`). This feature is **experimental**.
* Configuration of the API Firewall log format (via the environment variable `APIFW_LOG_FORMAT`).

[Instructions on running the API Firewall with new environment variables](installation-guides/docker-container.md)

### Optimizations

* Optimized validation of the OpenAPI 3.0 specification due to added `fastjson` parser.
* Added support for fasthttp.

## v0.6.2 (2021-06-22)

* The first release!
