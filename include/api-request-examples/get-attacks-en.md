=== "US cloud"
    ```{.bash .wrapped-code}
    curl -X POST "https://us1.api.wallarm.com/v1/client/YOUR_CLIENT_ID/attack-vectors/security-agg/query" -H "X-WallarmAPI-Token: YOUR_API_TOKEN" -H "Content-Type: application/json" -d '{"preset": "none", "select": ["attack_name", "attack_types", "hosts", "paths", "min_request_time", "status"], "time_range": "-24h", "limit": 50}'
    ```
=== "EU cloud"
    ```{.bash .wrapped-code}
    curl -X POST "https://api.wallarm.com/v1/client/YOUR_CLIENT_ID/attack-vectors/security-agg/query" -H "X-WallarmAPI-Token: YOUR_API_TOKEN" -H "Content-Type: application/json" -d '{"preset": "none", "select": ["attack_name", "attack_types", "hosts", "paths", "min_request_time", "status"], "time_range": "-24h", "limit": 50}'
    ```
