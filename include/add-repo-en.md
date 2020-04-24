=== "Debian 8.x (jessie)"
    ```bash
    apt-get install dirmngr
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Debian 9.x (stretch)"
    ```bash
    apt-get install dirmngr
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Debian 10.x (buster)"
    ```bash
    apt-get install dirmngr
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ```bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node trusty/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ```bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    apt-key adv --keyserver keys.gnupg.net --recv-keys 72B865FD
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "CentOS 6.x"
    ```bash
    yum install --enablerepo=extras -y epel-release centos-release-SCL
    rpm -i https://repo.wallarm.com/centos/wallarm-node/6/2.14/x86_64/Packages/wallarm-node-repo-1-4.el6.noarch.rpm
    ```
=== "CentOS 7.x"
    ```bash
    yum install -y epel-release
    rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/Packages/wallarm-node-repo-1-4.el7.noarch.rpm
    ```
=== "Amazon Linux 2"
    ```bash
    yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/Packages/wallarm-node-repo-1-4.el7.noarch.rpm
    ```