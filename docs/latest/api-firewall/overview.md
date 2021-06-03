# Wallarm API Firewall overview

Light-weighted Wallarm API Firewall protects your API endpoints in cloud-native environments with API schema validation. Wallarm API Firewall relies on a positive security model allowing calls that match a predefined API specification, while rejecting everything else.

## API schema validation and positive security model

When starting API Firewall, you should provide the [OpenAPI 3.0 specification](https://swagger.io/specification/) of the application that should be protected with API Firewall. The started API Firewall will operate as a reverse proxy and validate whether requests and responses match the schema defined in the specification. The traffic that does not match the schema will be blocked or logged (depending on the configured API Firewall operation mode).

![!Attacks view](../images/api-firewall/firewall-as-proxy.png)

Provided API schema should be described using the [OpenAPI 3.0 specification](https://swagger.io/specification/) in the YAML or JSON file (`.yaml`, `.yml`, `.json` file extensions).

By allowing you to set the traffic requirements with the OpenAPI 3.0 specification, Wallarm API Firewall relies on a positive security model.

## Technical characteristics

API Firewall works as a reverse proxy with a built-in OpenAPI 3.0 request and response validator. The validator is written in Go and optimized for extreme performance and near-zero added latency.
