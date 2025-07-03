1. Register the request inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. Register the response inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

In most cases, the `configured-gateway-service` name is `datapower-api-gateway`.
