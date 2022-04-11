# API Firewall changelog

This page describes new releases of Wallarm API Firewall.

## v0.6.8 (2022-04-11)

### New features

* Ability to specify the URL address of the OpenAPI 3.0 specification instead of mounting the specification file into the Docker container (via the environment variable [`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs)).
* Ability to use the custom `Content-Type` header when sending requests to the token introspection service (via the environment variable [`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](installation-guides/docker-container.md#apifw-server-oauth-introspection-content-type)).
* [Support for the authentication token denylists](installation-guides/docker-container.md#blocking-requests-with-compromised-authentication-tokens).

## v0.6.7 (2022-01-25)

Wallarm API Firewall is now open source. There are the following related changes in [this release](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7):

* API Firewall source code and related open source license are published
* GitHub workflow for binary, Helm chart and Docker image building is implemented

## v0.6.6 (2021-12-09)

### New features

* Support for [OAuth 2.0 token validation](installation-guides/docker-container.md#validation-of-request-authentication-tokens).
* [Connection](installation-guides/docker-container.md#protected-application-ssltls-settings) to the servers signed with the custom CA certificates and support for insecure connection flag.

### Bug fixes

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### New features

* Configuration of the maximum number of the fasthttp clients (via the environment variable `APIFW_SERVER_CLIENT_POOL_CAPACITY`).
* Health checks on the 9667 port of the API Firewall container (the port can be changed via the environment variable `HEALTH_HOST`).

[Instructions on running the API Firewall with new environment variables](installation-guides/docker-container.md)

### Bug fixes

* https://github.com/wallarm/api-firewall/issues/15
* Some other bugs

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
