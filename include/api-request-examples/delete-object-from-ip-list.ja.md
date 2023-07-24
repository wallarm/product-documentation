```
===
"USクラウド"
   ```
   curl 'https://us1.api.wallarm.com/v4/ip_rules' \
     -X 'DELETE' \
     -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
     -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
     -H 'accept: application/json' \
     -H 'content-type: application/json' \
     --data-raw '{"filter":{"clientid":<YOUR_CLIENT_ID>,"id":[<OBJECT_ID_TO_DELETE>]}}'
   ```

"EUクラウド"
   ```
   curl 'https://api.wallarm.com/v4/ip_rules' \
     -X 'DELETE' \
     -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
     -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' \
     -H 'accept: application/json' \
     -H 'content-type: application/json' \
     --data-raw '{"filter":{"clientid":<YOUR_CLIENT_ID>,"id":[<OBJECT_ID_TO_DELETE>]}}'
   ```
```