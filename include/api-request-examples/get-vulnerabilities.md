=== "EU cloud"
    ```bash
    curl -v -X POST "https://api.wallarm.com/v1/objects/vuln" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"limit\":50, \"offset\":0, \"filter\":{\"clientid\":[YOUR_CLIENT_ID], \"testrun_id\":null, \"validated\":true, \"time\":[[TIMESTAMP]]}}"
    ```
=== "US cloud"
    ```bash
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/vuln" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"limit\":50, \"offset\":0, \"filter\":{\"clientid\":[YOUR_CLIENT_ID], \"testrun_id\":null, \"validated\":true, \"time\":[[TIMESTAMP]]}}"
    ```
