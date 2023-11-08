=== "Nuvem dos EUA"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<SEU_ID_DO_CLIENTE>&filter%5Blist%5D=<TIPO_DA_LISTA_IP>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <SEU_TOKEN>'
    ```
=== "Nuvem da UE"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<SEU_ID_DO_CLIENTE>&filter%5Blist%5D=<TIPO_DA_LISTA_IP>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <SEU_TOKEN>'
    ```