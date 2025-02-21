=== "ABD bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"action\": [ {\"type\":\"equal\",\"value\":\"my\",\"point\":[\"path\",0]}, {\"type\":\"equal\",\"value\":\"api\",\"point\":[\"path\",1]}], \"validated\": false, \"point\": [ [ \"header\", \"HOST\" ] ], \"attack_type\": \"any\"}"
    ```
=== "AB bulutu"
    ```{.bash .wrapped-code}
    curl -v -X POST "https://api.wallarm.com/v1/objects/hint/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": YOUR_CLIENT_ID, \"type\": \"vpatch\", \"action\": [ {\"type\":\"equal\",\"value\":\"my\",\"point\":[\"path\",0]}, {\"type\":\"equal\",\"value\":\"api\",\"point\":[\"path\",1]}], \"validated\": false, \"point\": [ [ \"header\", \"HOST\" ] ], \"attack_type\": \"any\"}"
    ```