1. Get the WAF node statistics:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    The request will return statistics about analyzed requests. Response format is provided below, more detailed description of parameters is available by the [link][wallarm-status-instr].
    ```
    { "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
    "requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,
    "lom_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
    "stalled_workers_count":0,"stalled_workers":[] }
    ```
2. Send the request with test [SQLI][sqli-attack-desc] and [XSS][xss-attack-desc] attacks to the application address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>''
    ```

    WAF node will block the request and the code `403 Forbidden` will be returned in the response to the request.
3. Send the request to `wallarm-status` and ensure the values of parameters `requests` and `attacks` increased:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```
4. Open Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface][img-test-attacks-in-ui]
