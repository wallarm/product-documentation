=== "السحابة الأمريكية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/delete" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\":[YOUR_CLIENT_ID],\"id\": YOUR_RULE_ID}}"
    ```
=== "السحابة الأوروبية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/delete" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"filter\":{\"clientid\":[YOUR_CLIENT_ID],\"id\": YOUR_RULE_ID}}"
    ```