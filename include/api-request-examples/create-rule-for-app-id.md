=== "US cloud"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"vpatch\",\"action\":[{\"point\":[\"instance\"],\"type\":\"equal\",\"value\":\"-1\",\"weight\":102},{\"point\":[\"path\",0],\"type\":\"equal\",\"value\":\"my\",\"weight\":72},{\"point\":[\"path\",1],\"type\":\"equal\",\"value\":\"api\",\"weight\":72},{\"point\":[\"header\",\"2\"],\"type\":\"equal\",\"value\":\"endpoint\",\"weight\":42}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"point\":[[\"header\",\"HOST\"]],\"attack_type\":\"any\"}"
    ```
=== "EU cloud"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"type\":\"vpatch\",\"action\":[{\"point\":[\"instance\"],\"type\":\"equal\",\"value\":\"-1\",\"weight\":102},{\"point\":[\"path\",0],\"type\":\"equal\",\"value\":\"my\",\"weight\":72},{\"point\":[\"path\",1],\"type\":\"equal\",\"value\":\"api\",\"weight\":72},{\"point\":[\"header\",\"2\"],\"type\":\"equal\",\"value\":\"endpoint\",\"weight\":42}],\"clientid\":YOUR_CLIENT_ID,\"validated\":false,\"point\":[[\"header\",\"HOST\"]],\"attack_type\":\"any\"}"
    ```
