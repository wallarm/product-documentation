=== "Nuvem dos EUA"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <SEU_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [SEU_ID_DE_CLIENTE]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```
=== "Nuvem da UE"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <SEU_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [SEU_ID_DE_CLIENTE]},\"order_by\": \"updated_at\",\"order_desc\": true,\"limit\": 1000,\"offset\": 0}"
    ```
