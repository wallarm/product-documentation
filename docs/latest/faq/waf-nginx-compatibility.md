# Compatibility of Wallarm WAF with NGINX versions

## Is Wallarm WAF compatible with NGINX mainline?

No, Wallarm WAF is incompatible with NGINX `mainline`. You can install Wallarm WAF in the following ways:

* connect to the official open source NGINX `stable` following these [instructions](../waf-installation/nginx/dynamic-module.md)
* connect to NGINX installed from Debian/CentOS repositories following these [instructions](../waf-installation/nginx/dynamic-module-from-distr.md)
* connect to the official commercial NGINX Plus following these [instructions](../waf-installation/nginx-plus.md)

## Is Wallarm WAF compatible with the custom build of NGINX?

Yes, Wallarm WAF module can be connected to the custom build of NGINX after rebuilding WAF packages. To rebuild the packages, please contact [Wallarm technical support team](mailto:support@wallarm.com) and send the following data:

* Linux kernel version: `uname -a`
* Linux distributive: `cat /etc/*release`
* NGINX version:

    * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX custom build: `<path to nginx>/nginx -V`

* Compatibility signature:
  
      * [NGINX official build](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX custom build: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* The user (and the user's group) who is running the NGINX worker processes: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`
