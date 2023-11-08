=== "Nuvem dos EUA"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <SEU_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [SEU_ID_DE_CLIENTE] }, \"offset\": 0, \"limit\": 1000}"
    ```
=== "Nuvem da EU"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/action" -H "X-WallarmApi-Token: <SEU_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [SEU_ID_DE_CLIENTE] }, \"offset\": 0, \"limit\": 1000}"
    ```