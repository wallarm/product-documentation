=== "Nuvem dos EUA"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<SEU_ID_DO_CLIENTE>,"id":[<ID_DO_OBJETO_PARA_DELETAR>]}}'
    ```
=== "Nuvem da UE"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<SEU_ID_DO_CLIENTE>,"id":[<ID_DO_OBJETO_PARA_DELETAR>]}}'
    ```