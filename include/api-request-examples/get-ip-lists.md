=== "US Cloud"
    ```bash
    curl -X GET 'https://us1.api.wallarm.com/v4/ip_rules?offset=<YOUR_OFFSET>&limit=<YOUR_LIMIT>&filter%5Bclientid%5D=<YOUR_CLIENT_ID>' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json"
    ```
=== "EU Cloud"
    ```bash
    curl -X GET 'https://api.wallarm.com/v4/ip_rules?offset=<YOUR_OFFSET>&limit=<YOUR_LIMIT>&filter%5Bclientid%5D=<YOUR_CLIENT_ID>' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json"
    ```

Note that the API responses are paginated, with a limit of 300 items per request. You can specify the offset to fetch subsequent sets of data. For example, an offset of 600 with a limit of 300 will retrieve results 600 to 900.