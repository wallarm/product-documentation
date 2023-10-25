=== "US Bulut"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <SİZİN_TOKENUNUZ>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<SİZİN_CLIENT_IDNIZ>,"id":[<SİLİNACAK_OBJEKT_ID>]}}'
    ```
=== "EU Bulut"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <SİZİN_TOKENUNUZ>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<SİZİN_CLIENT_IDNIZ>,"id":[<SİLİNACAK_OBJEKT_ID>]}}'
    ```