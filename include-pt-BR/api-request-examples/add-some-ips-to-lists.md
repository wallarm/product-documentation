Para adicionar IPs específicos ou sub-redes à lista de IPs, envie a seguinte solicitação para cada IP/sub-rede:

=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_DE_CLIENTE>,"force":false,"ip_rule":{"list":"<TIPO_DE_LISTA_DE_IP>","reason":"<MOTIVO_PARA_ADICIONAR_ENTRIES_A_LISTA>","pools":[<ARRAY_DE_IDS_DE_APLICATIVOS>],"expired_at":<DATA_DE_REMOÇÃO_TIMESTAMP>,"rule_type":"ip_range","subnet":"<IP_OU_SUB-REDE>"}}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <SEU_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<SEU_ID_DE_CLIENTE>,"force":false,"ip_rule":{"list":"<TIPO_DE_LISTA_DE_IP>","reason":"<MOTIVO_PARA_ADICIONAR_ENTRIES_A_LISTA>","pools":[<ARRAY_DE_IDS_DE_APLICATIVOS>],"expired_at":<DATA_DE_REMOÇÃO_TIMESTAMP>,"rule_type":"ip_range","subnet":"<IP_OU_SUB-REDE>"}}'
    ```