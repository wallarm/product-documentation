Install the latest NGINX version of:

* **NGINX `stable`** - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Mainline** (the latest supported version is v1.25.5) - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Plus** - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/).
* **Distribution-Provided NGINX** - to install, use the following commands:

    === "Debian 10.x (buster)"
        ```bash
        sudo apt-get update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        sudo apt update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "Ubuntu LTS 20.04, 22.04"
        ```bash
        sudo apt-get update
        sudo apt-get install nginx
        ```
    === "CentOS 7.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum -y update 
        sudo yum install -y nginx
        ```