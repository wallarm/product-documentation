=== "ABD Bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```
=== "Avrupa Bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID] }, \"offset\": 0, \"limit\": 1000}"
    ```