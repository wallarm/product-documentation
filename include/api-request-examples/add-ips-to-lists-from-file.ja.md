以下は、Wallarmのドキュメントの英語から日本語への変換です。

						=== "米国クラウド"
    ```bash
    #!/bin/bash

    UUID="<YOUR_UUID>"
    SECRET="<YOUR_SECRET_KEY>"
    CLIENT="<YOUR_CLIENT_ID>"
    LIST="<TYPE_OF_IP_LIST>"
    PATH_TO_CSV_FILE="<PATH_TO_CSV_FILE>" # IPアドレスまたはサブネットが記載されているCSVファイルへのパス
    APPLICATIONS="<APP_IDS_THROUGH_COMMA>"
    REMOVE_DATE="TIMESTAMP_REMOVE_DATE"
    REASON='<REASON>'
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
    -H "X-WallarmAPI-Secret: $SECRET"  \
    -H "X-WallarmAPI-UUID: $UUID" \
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
=== "EU クラウド"
    ```bash
    #!/bin/bash

    UUID="<YOUR_UUID>"
    SECRET="<YOUR_SECRET_KEY>"
    CLIENT="<YOUR_CLIENT_ID>"
    LIST="<TYPE_OF_IP_LIST>"
    PATH_TO_CSV_FILE="<PATH_TO_CSV_FILE>" # IPアドレスまたはサブネットが記載されているCSVファイルへのパス
    APPLICATIONS="<APP_IDS_THROUGH_COMMA>"
    REMOVE_DATE="TIMESTAMP_REMOVE_DATE"
    REASON='<REASON>'
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
    -H "X-WallarmAPI-Secret: $SECRET"  \
    -H "X-WallarmAPI-UUID: $UUID" \
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
