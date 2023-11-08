=== "Nuvem dos EUA"
    ```bash
    curl 'https://us1.api.wallarm.com/v1/objects/hint/create' -H 'X-WallarmApi-Token: <YOUR_TOKEN>' -H "aceita: application/json" -H "Tipo de conteúdo: application/json" --data-raw '{"clientid":<YOUR_CLIENT_ID>,"type":"wallarm_mode","mode":"monitoring","validated":false,"action":[{"point":["instance"],"type":"equal","value":"3"}]}'
    ```
=== "Nuvem da UE"
    ```bash
    curl 'https://api.wallarm.com/v1/objects/hint/create' -H 'X-WallarmApi-Token: <YOUR_TOKEN>' -H "aceita: application/json" -H "Tipo de conteúdo: application/json" --data-raw '{"clientid":<YOUR_CLIENT_ID>,"type":"wallarm_mode","mode":"monitoring","validated":false,"action":[{"point":["instance"],"type":"equal","value":"3"}]}'
    ```