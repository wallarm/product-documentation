[doc-wallarm-mode]:     configure-parameters-en.md#wallarm_mode

#   Disabling IP Address Blocking for the Wallarm Scanner

Note that if you use the blocking mode of the filter node (the [`wallarm_mode`][doc-wallarm-mode] directive) by default when detecting malicious requests, you must explicitly specify for the Wallarm scanner a list of IP addresses from which requests should not be blocked.

Suppose the following blocking settings are set in the NGINX configuration file:

```
geo $wallarm_mode_real {
    default block;          # Default blocking mode enabled
    1.1.1.1/24 monitoring;  # Monitoring mode (cancels blocking)
    2.2.2.2 off;            # Blocking mode for the address disabled
    ...
}
...
wallarm_mode $wallarm_mode_real;
...
```

The `off` directive is used keep each IP address reserved for the Wallarm scanner from being blocked.

!!! info "The Wallarm Scanner IP Addresses"
    Lists of the IP addresses for the scanner:
    
    * [for the EU cloud](scanner-address-en.md)
    * [for the US cloud](scanner-address-us-en.md).

To avoid overloading the NGINX configuration file, you can make a list of the IP addresses for the scanner in a separate file and then add its contents to the configuration file using the `include` directive.

For example, create the `/etc/nginx/scanner-ip-list` file:

``` bash
# The list of the Wallarm scanner IP addresses
3.3.3.3 off;
4.4.4.4 off;
5.5.5.5 off;
...
# Add all the required IP addresses here
```

Now use the `include` directive to include this list in the required block of the configuration file:

```
geo $wallarm_mode_real {
    default block;
    1.1.1.1/24 monitoring;
    2.2.2.2 off;
    include /etc/nginx/scanner-ip-list;
}
...
wallarm_mode $wallarm_mode_real;
```

!!! warning "Using Additional Traffic Filtering Facilities"
    Note that if you use additional facilities (software or hardware) to automatically filter and block traffic, it is also recommended that you configure a whitelist with the IP addresses for the Wallarm scanner.