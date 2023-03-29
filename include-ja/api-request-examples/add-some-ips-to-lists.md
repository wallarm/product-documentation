特定のIPまたはサブネットをIPリストに追加するには、各IP/サブネットに対して以下のリクエストを送信してください：

=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>","pools":[<ARRAY_OF_APP_IDS>],"expired_at":<TIMESTAMP_REMOVE_DATE>,"rule_type":"ip_range","subnet":"<IP_OR_SUBNET>"}}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>","pools":[<ARRAY_OF_APP_IDS>],"expired_at":<TIMESTAMP_REMOVE_DATE>,"rule_type":"ip_range","subnet":"<IP_OR_SUBNET>"}}'
    ```