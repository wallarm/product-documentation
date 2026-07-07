# Custom NGINX Packages

If you require Wallarm for an NGINX version that is different from the versions supported by [all-in-one installation](../../installation/nginx/all-in-one.md), such as stable version, mainline NGINX Plus, or the distributive version, you can request a custom Wallarm build by following these instructions.

The Wallarm module can be integrated with a custom build of NGINX, including NGINX `mainline`, by rebuilding the Wallarm packages. To rebuild the packages, please contact the [Wallarm technical support](mailto:support@wallarm.com) team and provide the following information:

* Linux kernel version: `uname -a`
* Linux distribution: `cat /etc/*release`
* NGINX version:

    * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX custom build: `<path to nginx>/nginx -V`

* Compatibility signature:
  
      * [NGINX official build](https://nginx.org/en/linux_packages.html): `grep -aoE '.,.,.,[01]{34}' /usr/sbin/nginx`
      * NGINX custom build: `grep -aoE '.,.,.,[01]{34}' <path to nginx>/nginx`

* The user (and the user's group) who is running the NGINX worker processes: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`
* Source patches that are used to build NGINX, if any
