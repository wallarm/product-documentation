=== "ABD bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/vuln" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"limit\":50, \"offset\":0, \"filter\":{\"clientid\":[YOUR_CLIENT_ID], \"testrun_id\":null, \"validated\":true, \"time\":[[TIMESTAMP, null]]}}"
    ```
=== "AB üyesi bulut"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/vuln" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"limit\":50, \"offset\":0, \"filter\":{\"clientid\":[YOUR_CLIENT_ID], \"testrun_id\":null, \"validated\":true, \"time\":[[TIMESTAMP, null]]}}"
    ```