# Custom NGINX Packages

If you require Wallarm DEB/RPM packages for an NGINX version that is different from the stable version, NGINX Plus, or the distributive version, you can request a custom Wallarm build by following these instructions.

By default, Wallarm DEB/RPM packages are available for the following NGINX versions:

* Official open source NGINX `stable` - refer to the [installation instructions](../nginx/dynamic-module.md)
* Distribution-provided NGINX - refer to the [installation instructions](../nginx/dynamic-module-from-distr.md)
* Official commercial NGINX Plus - refer to the [installation instructions](../nginx-plus.md)

The Wallarm module can be integrated with a custom build of NGINX, including NGINX `mainline`, by rebuilding the Wallarm packages. To rebuild the packages, please contact the [Wallarm technical support](mailto:support@wallarm.com) team and provide the following information:

* Linux kernel version: `uname -a`
* Linux distributive: `cat /etc/*release`
* NGINX version:

    * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX custom build: `<path to nginx>/nginx -V`

* Compatibility signature:
  
      * [NGINX official build](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX custom build: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* The user (and the user's group) who is running the NGINX worker processes: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`