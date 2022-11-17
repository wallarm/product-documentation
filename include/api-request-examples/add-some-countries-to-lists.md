=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","rule_type":"country","source_values":[<ARRAY_OF_COUNTRIES_REGIONS>],"pools":[<ARRAY_OF_APP_IDS>],"expired_at":"<TIMESTAMP_REMOVE_DATE>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>"},"force":false}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
      -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","rule_type":"country","source_values":[<ARRAY_OF_COUNTRIES_REGIONS>],"pools":[<ARRAY_OF_APP_IDS>],"expired_at":"<TIMESTAMP_REMOVE_DATE>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>"},"force":false}'
    ```
