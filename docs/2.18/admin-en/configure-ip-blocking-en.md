# Blocking by IP Address

Typically, blocking malicious requests on a request‑by‑request basis is preferable than blocking by IP addresses. However, in some cases, using IP blacklists is necessary.

IP blacklists should be used in the following cases:

* There is a need to reduce system load that was caused by the analysis of malicious requests.
* Traffic processing is performed asynchronously.
* There are extra resources that are not protected with Wallarm.

## Blocking Methods

All methods have advantages and disadvantages.

### Blocking with Wallarm Web Interface

This is the most intuitive method providing the user with a convenient graphical interface to view and modify the blacklist.

[Read more...](../user-guides/blacklist.md)

### Blocking with NGINX

This method is the most resource‑intensive one. However, it allows customizing the message that the user sees when the request is blocked.

[Read more...](configure-ip-blocking-nginx-en.md).

### Blocking by iptables

This method does not allow you to configure the error message, but it affects server performance less.

[Read more...](configure-ip-blocking-iptables-en.md).

### Blocking by External Firewall

This method does not create any load on the server but requires additional integration of blacklist and firewall. 

!!! warning "Exclude the IP Address Blocking of the Wallarm Scanner"
    Please note that if you use additional facilities (software or hardware) to automatically filter and block traffic, you should add the IP addresses for the scanner to the whitelist of the corresponding filtering facility in order for the Wallarm scanner to be able to freely check your resources for vulnerabilities.
    
    Lists of the IP addresses of the scanner:
    
    * [for the EU cloud](scanner-address-en.md)
    * [for the US cloud](scanner-address-us-en.md).