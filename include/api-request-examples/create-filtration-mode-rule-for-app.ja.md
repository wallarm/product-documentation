Wallarmのドキュメントの一部を英語から日本語に翻訳してください：
					=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v1/objects/hint/create' -H 'X-WallarmAPI-UUID: <YOUR_UUID>' -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' -H "accept: application/json" -H "Content-Type: application/json" --data-raw '{"clientid":<YOUR_CLIENT_ID>,"type":"wallarm_mode","mode":"monitoring","validated":false,"action":[{"point":["instance"],"type":"equal","value":"3"}]}'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v1/objects/hint/create' -H 'X-WallarmAPI-UUID: <YOUR_UUID>' -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>' -H "accept: application/json" -H "Content-Type: application/json" --data-raw '{"clientid":<YOUR_CLIENT_ID>,"type":"wallarm_mode","mode":"monitoring","validated":false,"action":[{"point":["instance"],"type":"equal","value":"3"}]}'
    ```
