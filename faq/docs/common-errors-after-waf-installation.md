# Errors after Wallarm WAF installation

## File Download Scenarios Fail

If your file download scenarios fail after installing a filter node, the issue is in the request size exceeding the limit set in the `client_max_body_size` directive in the Wallarm configuration file.

Change the value in `client_max_body_size` in the directive `location` for the address that accepts the file uploads. Changing only the `location` value protects the main page from getting large requests.

Change the value in `client_max_body_size`:

1. Open for editing the configuration file in the `/etc/nginx-wallarm` directory.
2. Put in the new value:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` is the address that accepts the file uploads.

Detailed directive description is available in the [official NGINX documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).
