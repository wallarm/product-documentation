=== "السحابة الأمريكية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"regex\",\"action\":[{\"point\":[\"header\",\"HOST\"],\"type\":\"equal\",\"value\":\"MY.DOMAIN.NAME\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"comment\":\"comment\",\"point\":[[\"header\",\"X-FORWARDED-FOR\"]],\"attack_type\":\"scanner\",\"regex\":\"^\(~\(44[.]33[.]22[.]11\)\)$\"}"
    ```
=== "السحابة الأوروبية"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"regex\",\"action\":[{\"point\":[\"header\",\"HOST\"],\"type\":\"equal\",\"value\":\"MY.DOMAIN.NAME\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"comment\":\"comment\",\"point\":[[\"header\",\"X-FORWARDED-FOR\"]],\"attack_type\":\"scanner\",\"regex\":\"^\(~\(44[.]33[.]22[.]11\)\)$\"}"
    ```