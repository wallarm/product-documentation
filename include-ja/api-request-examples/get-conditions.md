=== "USクラウド"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/action" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```
=== "EUクラウド"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/action" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```