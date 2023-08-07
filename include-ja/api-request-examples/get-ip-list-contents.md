					=== "USクラウド"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<あなたのクライアントID>&filter%5Blist%5D=<IPリストの種類>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <あなたのトークン>'
    ```
=== "EUクラウド"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules?filter%5Bclientid%5D=<あなたのクライアントID>&filter%5Blist%5D=<IPリストの種類>&offset=0&limit=50' \
          -H 'X-WallarmApi-Token: <あなたのトークン>'
    ```