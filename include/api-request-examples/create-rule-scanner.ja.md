以下は、Wallarmのドキュメントを英語から日本語に翻訳したものです：
					=== "USクラウド"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"regex\",\"action\":[{\"point\":[\"header\",\"HOST\"],\"type\":\"equal\",\"value\":\"MY.DOMAIN.NAME\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"comment\":\"comment\",\"point\":[[\"header\",\"X-FORWARDED-FOR\"]],\"attack_type\":\"scanner\",\"regex\":\"^\(~\(44[.]33[.]22[.]11\)\)$\"}"
    ```
=== "EUクラウド"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"regex\",\"action\":[{\"point\":[\"header\",\"HOST\"],\"type\":\"equal\",\"value\":\"MY.DOMAIN.NAME\"}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"comment\":\"comment\",\"point\":[[\"header\",\"X-FORWARDED-FOR\"]],\"attack_type\":\"scanner\",\"regex\":\"^\(~\(44[.]33[.]22[.]11\)\)$\"}"
    ```