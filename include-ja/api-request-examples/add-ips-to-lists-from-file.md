					=== "USクラウド"
    ```bash
    #!/bin/bash

    UUID="<あなたのUUID>"
    SECRET="<あなたのシークレットキー>"
    CLIENT="<あなたのクライアントID>"
    LIST="<IPリストのタイプ>"
    PATH_TO_CSV_FILE="<CSVファイルへのパス>" # IPアドレスまたはサブネットのCSVファイルへのパス
    APPLICATIONS="<カンマで区切ったAPP_ID>"
    REMOVE_DATE="<削除日時のタイムスタンプ>"
    REASON='<理由>'
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
    -H "X-WallarmApi-Token: <あなたのトークン>"  \
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
=== "EUクラウド"
    ```bash
    #!/bin/bash

    UUID="<あなたのUUID>"
    SECRET="<あなたのシークレットキー>"
    CLIENT="<あなたのクライアントID>"
    LIST="<IPリストのタイプ>"
    PATH_TO_CSV_FILE="<CSVファイルへのパス>" # IPアドレスまたはサブネットのCSVファイルへのパス
    APPLICATIONS="<カンマで区切ったAPP_ID>"
    REMOVE_DATE="<削除日時のタイムスタンプ>"
    REASON='<理由>'
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
    -H "X-WallarmApi-Token: <あなたのトークン>"  \
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