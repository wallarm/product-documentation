=== "Debian 8.x (jessie)"
    ``` bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie/' >/etc/apt/sources.list.d/wallarm.list
    apt-get update
    ```
=== "Debian 9.x (stretch)"
    ``` bash
    apt-get install dirmngr
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/' >/etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ``` bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node trusty/' >/etc/apt/sources.list.d/wallarm.list
    apt-get update
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ``` bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/' >/etc/apt/sources.list.d/wallarm.list
    apt-get update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ``` bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/' >/etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "CentOS 7.x"
    ``` bash
    yum install -y epel-release
    rpm -i https://repo.wallarm.com/centos/wallarm-node/7/x86_64/Packages/wallarm-node-repo-1-5.el7.centos.noarch.rpm
    ```
