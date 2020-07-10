=== "Debian 8.x (jessie-backports)"
    ``` bash
    apt-get install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | apt-key add -
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/ignore-release-date
    echo 'deb http://archive.debian.org/debian jessie-backports main' > /etc/apt/sources.list.d/jessie-backports.list
    echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie/2.14/' > /etc/apt/sources.list.d/wallarm.list
    echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie-backports/2.14/' >> /etc/apt/sources.list.d/wallarm.list
    apt-get update
    ```
=== "Debian 9.x (stretch)"
    ``` bash
    apt-get install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.14/' >/etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "Debian 9.x (stretch-backports)"
    ``` bash
    apt-get install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.14/' >/etc/apt/sources.list.d/wallarm.list"
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/2.14/' >> /etc/apt/sources.list.d/wallarm.list"

    # [warning][IMPORTANT]uncomment the following line in /etc/apt/sources.list:
    #deb http://deb.debian.org/debian stretch-backports main contrib non-free
    
    apt-get update
    ```
=== "Debian 10.x (buster)"
    ``` bash
    apt-get install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/2.14/' > /etc/apt/sources.list.d/wallarm.list"
    apt-get update
    ```
=== "CentOS 6.x"
    ```bash
    yum install --enablerepo=extras -y epel-release centos-release-SCL
    rpm -i https://repo.wallarm.com/centos/wallarm-node/6/2.14/x86_64/Packages/wallarm-node-repo-1-5.el6.noarch.rpm
    ```
=== "CentOS 7.x"
    ```bash
    yum install -y epel-release
    rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/Packages/wallarm-node-repo-1-5.el7.noarch.rpm
    ```
