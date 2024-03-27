=== "السحابة الأمريكية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```
=== "السحابة الأوروبية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```