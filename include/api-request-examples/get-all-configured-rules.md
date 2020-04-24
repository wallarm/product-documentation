=== "EU cloud"
    ```bash
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```
=== "US cloud"
    ```bash
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```
