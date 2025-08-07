# Access to Wallarm API via Proxy

These instructions describe the steps to configure access to Wallarm API via the proxy server.

* `https://api.wallarm.com/` for the EU Cloud
* `https://us1.api.wallarm.com/` for the US Cloud

## Access during and after installation

You need to configure access:

* Before node installation - in the `/etc/environment` file; this will allow node installation process itself to access required resources via the proxy.
* After node installation - in the `/opt/wallarm/env.list` file; this will allow the already installed node access to Wallarm API via the proxy. This file does not exist until node is installed. 

In both cases, to configure access, please assign new values to the environment variables defining the proxy server:

* `https_proxy` to define a proxy for the HTTPS protocol
* `http_proxy` to define a proxy for the HTTP protocol
* `no_proxy` to define the list of the resources proxy should not be used for

## https_proxy and http_proxy values

Assign the `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` string values to the `https_proxy` and `http_proxy` variables:

* `<scheme>` defines the protocol used. It should match the protocol that the current environment variable sets up proxy for
* `<proxy_user>` defines the username for proxy authorization
* `<proxy_pass>` defines the password for proxy authorization
* `<host>` defines a host of the proxy server
* `<port>` defines a port of the proxy server

## no_proxy value

To the `no_proxy` variable, assign the array of IP addresses and/or domains of the resources which proxy should not be used for:

* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` and `localhost` for correct Wallarm node operation
* additional addresses in the format: `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` where `<res_1>`, `<res_2>`, `<res_3>`, and `<res_4>` are the IP addresses and/or domains

## Example of configuration files

An example of the `/etc/environment` and `/opt/wallarm/env.list` files below demonstrates the following configuration:

* HTTPS and HTTP requests are proxied to the `1.2.3.4` host with the `1234` port, using the `admin` username and the `01234` password for authorization on the proxy server.
* Proxying is disabled for the requests sent to `127.0.0.1`, `127.0.0.8`, `127.0.0.9`, and `localhost`.

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```

## Running the all-in-one script

When installing a filtering node with the [all-in-one](../../installation/nginx/all-in-one.md) installer, ensure to append the `--preserve-env=https_proxy,no_proxy` flag to the command executing the script, e.g.:

```
sudo --preserve-env=https_proxy,no_proxy env WALLARM_LABELS='group=<GROUP>' sh wallarm-<VERSION>.<ARCH>-glibc.sh
```

This guarantees the correct application of proxy settings (`https_proxy`, `no_proxy`) during the installation process.

## Access after installation

As soon as the node installed, you need to configure its access to Wallarm API via proxy in the `/opt/wallarm/env.list` file. The variables and values are the same as were used during installation.

!!! info "Configuration file availability"
    the `/opt/wallarm/env.list` file does not exist until node is installed.

After changing configuration file, restart wallarm service:

```
sudo systemctl restart wallarm
```
