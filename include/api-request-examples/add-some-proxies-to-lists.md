=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","rule_type":"proxy_type","source_values":[<ARRAY_OF_PROXY_SERVICES>],"pools":[<ARRAY_OF_APP_IDS>],"expired_at":"<TIMESTAMP_REMOVE_DATE>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>"},"force":false}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","rule_type":"proxy_type","source_values":[<ARRAY_OF_PROXY_SERVICES>],"pools":[<ARRAY_OF_APP_IDS>],"expired_at":"<TIMESTAMP_REMOVE_DATE>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>"},"force":false}'
    ```
