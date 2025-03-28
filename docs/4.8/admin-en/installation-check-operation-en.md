# Checking the filtering node operation

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

If everything is configured correctly, Wallarm filters the requests and proxies the filtered requests in accordance with the configuration file settings.

To check the correct operation, you must:

1. Execute the `wallarm-status` request.
2. Run a test attack.

    
## 1. Execute the `wallarm-status` request

You can get filtering node operation statistics by requesting the `/wallarm-status` URL.

Run the command:

```
curl http://127.0.0.8/wallarm-status
```

The output will be like:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

This means that the filtering node statistics service is running and working properly.

!!! info "The statistics service"
    You can read more about the statistics service and how to configure it [here][doc-stat-service].

## 2. Run a test attack

To check if Wallarm correctly detects attacks, send a malicious request to the protected resource.

For example:

```
http://<resource_URL>/etc/passwd
```

Wallarm must detect in the request [Path Traversal](../attacks-vulns-list.md#path-traversal).

Now the counter of the number of attacks will increase when a request for `wallarm-status` is executed, which means that the filtering node is operating normally.

To learn more about the Wallarm filtering node settings, see the [Configuration options][doc-configure-parameters] chapter.