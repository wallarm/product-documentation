=== "ABD bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID],\"actionid\": YOUR_CONDITION_ID},\"limit\": 1000,\"offset\": 0}"
    ```
=== "AB bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\": [YOUR_CLIENT_ID],\"actionid\": YOUR_CONDITION_ID},\"limit\": 1000,\"offset\": 0}"
    ```