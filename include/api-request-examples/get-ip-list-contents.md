=== "US Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<YOUR_CLIENT_ID>&filter%5Blist%5D=<TYPE_OF_IP_LIST>&offset=0&limit=50' \
        -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
        -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>'
    ```
=== "EU Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<YOUR_CLIENT_ID>&filter%5Blist%5D=<TYPE_OF_IP_LIST>&offset=0&limit=50' \
        -H 'X-WallarmAPI-UUID: <YOUR_UUID>' \
        -H 'X-WallarmAPI-Secret: <YOUR_SECRET_KEY>'
    ```
