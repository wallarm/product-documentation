# Errors after NGINX Wallarm node installation

If some errors occur after NGINX Wallarm node installation, check this troubleshooting guide to address them. If you did not find relevant details here, please contact [Wallarm technical support](mailto:support@wallarm.com).

## File Download Scenarios Fail

If your file download scenarios fail after installing a filter node, the issue is in the request size exceeding the limit set in the `client_max_body_size` directive in the Wallarm configuration file.

Change the value in `client_max_body_size` in the directive `location` for the address that accepts the file uploads. Changing only the `location` value protects the main page from getting large requests.

Change the value in `client_max_body_size`:

1. Open for editing the `/etc/nginx/sites-enabled/default` (`/etc/nginx/http.d/default.conf` if running the Docker container) file.
2. Put in the new value:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	`/file/upload` is the address that accepts the file uploads.

Detailed directive description is available in the [official NGINX documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## Why does not the filtering node block attacks when operating in blocking mode (`wallarm_mode block`)?

Using the `wallarm_mode` directive is only one of several methods of traffic filtration mode configuration. Some of these configuration methods have a higher priority than the `wallarm_mode` directive value.

If you have configured blocking mode via `wallarm_mode block` but Wallarm filtering node does not block attacks, please ensure that filtration mode is not overridden using other configuration methods:

* Using the [rule **Set filtration mode**](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
* In the [**General** section of Wallarm Console](../admin-en/configure-wallarm-mode.md#general-filtration-mode)

[More details on filtration mode configuration methods →](../admin-en/configure-parameters-en.md)
