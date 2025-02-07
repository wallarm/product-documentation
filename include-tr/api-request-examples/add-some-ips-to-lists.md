To add particular IPs or subnets to the IP list, send the following request for each IP/subnet:
IP listesine belirli IP'leri veya alt ağları eklemek için, her IP/alt ağ için aşağıdaki isteği gönderin:

=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>","pools":[<ARRAY_OF_APP_IDS>],"expired_at":<TIMESTAMP_REMOVE_DATE>,"rule_type":"ip_range","subnet":"<IP_OR_SUBNET>"}}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<TYPE_OF_IP_LIST>","reason":"<REASON_TO_ADD_ENTRIES_TO_LIST>","pools":[<ARRAY_OF_APP_IDS>],"expired_at":<TIMESTAMP_REMOVE_DATE>,"rule_type":"ip_range","subnet":"<IP_OR_SUBNET>"}}'
    ```