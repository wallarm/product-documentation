=== "ABD Bulutu"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<YOUR_CLIENT_ID>,"id":[<OBJECT_ID_TO_DELETE>]}}'
    ```
=== "AB Bulutu"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -X 'DELETE' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H 'accept: application/json' \
      -H 'content-type: application/json' \
      --data-raw '{"filter":{"clientid":<YOUR_CLIENT_ID>,"id":[<OBJECT_ID_TO_DELETE>]}}'
    ```