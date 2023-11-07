=== "Nuvem US"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_CLIENTE>,"ip_rule":{"list":"<TIPO_DA_LISTA_IP>","rule_type":"proxy_type","source_values":[<ARRAY_DE_SERVICOS_PROXY>],"pools":[<ARRAY_DE_IDS_APP>],"expired_at":"<TIMESTAMP_REMOVER_DATA>","reason":"<MOTIVO_PARA_ADICIONAR_ENTRADAS_A_LISTA>"},"force":false}'
    ```
=== "Nuvem EU"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_CLIENTE>,"ip_rule":{"list":"<TIPO_DA_LISTA_IP>","rule_type":"proxy_type","source_values":[<ARRAY_DE_SERVICOS_PROXY>],"pools":[<ARRAY_DE_IDS_APP>],"expired_at":"<TIMESTAMP_REMOVER_DATA>","reason":"<MOTIVO_PARA_ADICIONAR_ENTRADAS_A_LISTA>"},"force":false}'
    ```