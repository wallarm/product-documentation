=== "Nuvem dos EUA"
    ```bash
    #!/bin/bash

    UUID="<SEU_UUID>"
    SECRET="<SUA_CHAVE_SECRETA>"
    CLIENT="<SEU_ID_CLIENTE>"
    LIST="<TIPO_DE_LISTA_IP>"
    PATH_TO_CSV_FILE="<CAMINHO_PARA_ARQUIVO_CSV>" # caminho para o arquivo CSV com IPs ou subnets
    APPLICATIONS="<IDs_DO_APP_ATRAVES_DE_VIRGULA>"
    REMOVE_DATE="DATA_TIMESTAMP_REMOVER"
    REASON='<MOTIVO>'
    API="us1.api.wallarm.com"


    index=0
    while read line; do
        subnets[$index]="$line"
        index=$(($index+1))
    done < "$PATH_TO_CSV_FILE"


    for i in ${subnets[@]}; do
        currentDate=`date -u +%s`
        time=$REMOVE_DATE
        remove_date=$(($currentDate+$time))

    curl -X POST \
    https://$API/v4/ip_rules \
    -H "Content-Type: application/json" \
    -H "X-WallarmApi-Token: <SEU_TOKEN>"  \
    -d '{
    "clientid": '$CLIENT',
    "ip_rule": {
        "list": "'$LIST'",
        "rule_type": "ip_range",
        "subnet": "'$i'",
        "expired_at": '$remove_date',
        "pools": [
            '$APPLICATIONS'
        ],
        "reason": "'"$REASON"'"
    },
    "force": false
    }'

    done
    ```
=== "Nuvem da UE"
    ```bash
    #!/bin/bash

    UUID="<SEU_UUID>"
    SECRET="<SUA_CHAVE_SECRETA>"
    CLIENT="<SEU_ID_CLIENTE>"
    LIST="<TIPO_DE_LISTA_IP>"
    PATH_TO_CSV_FILE="<CAMINHO_PARA_ARQUIVO_CSV>" # caminho para o arquivo CSV com IPs ou subnets
    APPLICATIONS="<IDs_DO_APP_ATRAVES_DE_VIRGULA>"
    REMOVE_DATE="DATA_TIMESTAMP_REMOVER"
    REASON='<MOTIVO>'
    API="api.wallarm.com"


    index=0
    while read line; do
        subnets[$index]="$line"
        index=$(($index+1))
    done < "$PATH_TO_CSV_FILE"


    for i in ${subnets[@]}; do
        currentDate=`date -u +%s`
        time=$REMOVE_DATE
        remove_date=$(($currentDate+$time))

    curl -X POST \
    https://$API/v4/ip_rules \
    -H "Content-Type: application/json" \
    -H "X-WallarmApi-Token: <SEU_TOKEN>"  \
    -d '{
    "clientid": '$CLIENT',
    "ip_rule": {
        "list": "'$LIST'",
        "rule_type": "ip_range",
        "subnet": "'$i'",
        "expired_at": '$remove_date',
        "pools": [
            '$APPLICATIONS'
        ],
        "reason": "'"$REASON"'"
    },
    "force": false
    }'

    done
    ```
