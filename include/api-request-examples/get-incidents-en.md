=== "EU cloud"
    ```bash
    curl -v -X POST "https://api.wallarm.com/v1/objects/attack" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID], \"\!vulnid\": null, \"time\": [[TIMESTAMP, null]] }, \"offset\": 0, \"limit\": 50, \"order_by\": \"last_time\", \"order_desc\": true}"
    ```
=== "US cloud"
    ```bash
    curl -v -X POST "https://us1.api.wallarm.com/v1/objects/attack" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json"  -H "Content-Type: application/json" -d "{ \"filter\": { \"clientid\": [YOUR_CLIENT_ID], \"\!vulnid\": null, \"time\": [[TIMESTAMP, null]] }, \"offset\": 0, \"limit\": 50, \"order_by\": \"last_time\", \"order_desc\": true}"
    ```
