=== "Debian 10.x (buster)"
```bash
sudo apt install dirmngr
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/2.18/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
=== "Ubuntu 16.04 LTS (xenial)"
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node xenial/2.18/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
=== "Ubuntu 18.04 LTS (bionic)"
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/2.18/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
=== "Ubuntu 20.04 LTS (focal)"
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/2.18/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
=== "CentOS 7.x"
```bash
sudo yum install -y epel-release
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.18/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
```
=== "Amazon Linux 2.0.2021xおよびそれ以下"
```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.18/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
```
=== "CentOS 8.x"
```bash
sudo yum install -y epel-release
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/2.18/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
```