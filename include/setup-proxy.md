!!! info
    This setup step is intended for users who use their own proxy server for the operation of the protected web applications and APIs.
    
    If you do not use a proxy server, skip this step of the setup.

You need to assign new values to the environment variables, which define the proxy server used, to configure Wallarm node for using your proxy server.

Add new values of the environment variables to the `/etc/environment` file:
*   Add `https_proxy` to define a proxy for the https protocol.
*   Add `http_proxy` to define a proxy for the http protocol.
*   Add `no_proxy` to define the list of the resources proxy should not be used for.

Assign the `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` string values to the `https_proxy` and `http_proxy` variables.
* `<scheme>` defines the protocol used. It should match the protocol that the current environment variable sets up proxy for.
* `<proxy_user>` defines the username for proxy authorization.
* `<proxy_pass>` defines the password for proxy authorization.
* `<host>` defines a host of the proxy server.
* `<port>` defines a port of the proxy server.

Assign a `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` array value, where `<res_1>`, `<res_2>`, `<res_3>`, and `<res_4>` are the IP addresses and/or domains, to the `no_proxy` variable to define a list of the resources which proxy should not be used for. This array should consist of IP addresses and/or domains.

!!! warning "Resources that need to be addressed without a proxy"
    Add the following IP addresses and domain to the list of the resources that have to be addressed without a proxy for the system to operate correctly: `127.0.0.1`, `127.0.0.8`, `127.0.0.9`, and `localhost`.
    The `127.0.0.8` and `127.0.0.9` IP addresses are used for the operation of the Wallarm filtering node.

The example of the correct `/etc/environment` file contents below demonstrates the following configuration:
*   HTTPS and HTTP requests are proxied to the `1.2.3.4` host with the `1234` port, using the `admin` username and the `01234` password for authorization on the proxy server.
*   Proxying is disabled for the requests sent to `127.0.0.1`, `127.0.0.8`, `127.0.0.9`, and `localhost`.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```
