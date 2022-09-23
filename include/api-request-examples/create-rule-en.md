=== "US cloud"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"action\": [ {\"type\":\"equal\",\"value\":\"my\",\"point\":[\"path\",0]}, {\"type\":\"equal\",\"value\":\"api\",\"point\":[\"path\",1]}, {\"type\":\"equal\",\"value\":\"endpoint\",\"point\":[\"header\",\"2\"]}], \"validated\": false, \"point\": [ [ \"header\", \"HOST\" ] ], \"attack_type\": \"any\"}"
    ```
=== "EU cloud"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"action\": [ {\"type\":\"equal\",\"value\":\"my\",\"point\":[\"path\",0]}, {\"type\":\"equal\",\"value\":\"api\",\"point\":[\"path\",1]}, {\"type\":\"equal\",\"value\":\"endpoint\",\"point\":[\"header\",\"2\"]}], \"validated\": false, \"point\": [ [ \"header\", \"HOST\" ] ], \"attack_type\": \"any\"}"
    ```
