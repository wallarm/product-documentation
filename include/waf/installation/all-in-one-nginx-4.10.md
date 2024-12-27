Install the latest NGINX version of:

* **NGINX `stable`** - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Mainline** (the latest supported version is v1.25.5) - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Plus** (the latest supported version is NGINX Plus R32) - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/).
* **Distribution-Provided NGINX** - to install, use the following commands:

    === "Debian"
        ```bash
        sudo apt update 
        sudo apt -y install --no-install-recommends nginx
        ```
    === "Ubuntu"
        ```bash
        sudo apt-get update
        sudo apt-get install nginx
        ```
    === "CentOS"
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