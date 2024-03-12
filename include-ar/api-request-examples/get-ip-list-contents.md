=== "السحابة الأمريكية"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<YOUR_CLIENT_ID>&filter%5Blist%5D=<TYPE_OF_IP_LIST>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <YOUR_TOKEN>'
    ```
=== "السحابة الأوروبية"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<YOUR_CLIENT_ID>&filter%5Blist%5D=<TYPE_OF_IP_LIST>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <YOUR_TOKEN>'
    ```