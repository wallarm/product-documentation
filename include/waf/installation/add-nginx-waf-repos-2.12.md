=== "Debian 8.x (jessie)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node jessie/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node trusty/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 6.x"
    ```bash
    sudo yum install --enablerepo=extras -y epel-release centos-release-SCL
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/x86_64/Packages/wallarm-node-repo-1-3.el6.noarch.rpm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/x86_64/Packages/wallarm-node-repo-1-3.el7.noarch.rpm
    ```
