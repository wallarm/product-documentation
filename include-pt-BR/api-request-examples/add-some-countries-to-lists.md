=== "Nuvem EUA"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_CLIENTE>,"ip_rule":{"list":"<TIPO_DE_LISTA_IP>","rule_type":"country","source_values":[<ARRAY_DE_PAÍSES_REGIÕES>],"pools":[<ARRAY_DE_IDS_APP>],"expired_at":"<TIMESTAMP_DATA_REMOÇÃO>","reason":"<RAZÃO_PARA_ADICIONAR_ENTRADAS_À_LISTA>"},"force":false}'
    ```
=== "Nuvem UE"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_CLIENTE>,"ip_rule":{"list":"<TIPO_DE_LISTA_IP>","rule_type":"country","source_values":[<ARRAY_DE_PAÍSES_REGIÕES>],"pools":[<ARRAY_DE_IDS_APP>],"expired_at":"<TIMESTAMP_DATA_REMOÇÃO>","reason":"<RAZÃO_PARA_ADICIONAR_ENTRADAS_À_LISTA>"},"force":false}'
    ```