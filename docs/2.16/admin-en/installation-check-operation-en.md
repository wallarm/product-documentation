# Checking the Filter Node Operation

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

If everything is configured correctly, Wallarm filters the requests and proxies
the filtered requests in accordance with the configuration file settings.

To check the correct operation, you must:

1. Execute the `wallarm-status` request.
2. Run a test attack.

    
## 1. Execute the `wallarm-status` Request

You can get filter node operation statistics by requesting the `/wallarm-status` URL.

Run the command:

```
curl http://127.0.0.8/wallarm-status
```

The output will be like:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"lom_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

This means that the filter node statistics service is running and working properly.

!!! info "The Statistics Service"
    You can read more about the statistics service and how to configure it [here][doc-stat-service].

## 2. Run a Test Attack

To check if Wallarm correctly detects attacks, send an invalid request to the
protected resource.

For example:

```
http://<resource_URL>/?id='or+1=1--a-<script>prompt(1)</script>'
```

Wallarm must detect in the request the following:

* [SQLI](../attacks-vulns-list.md#sql-injection)
* [XSS](../attacks-vulns-list.md#cross-site-scripting-xss)

Now the counter of the number of attacks will increase when a request for `wallarm-status` is executed, which means that the filter node is operating normally.

To learn more about the Wallarm filter node settings, see the [Configuration Options][doc-configure-parameters] chapter.