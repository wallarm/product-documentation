```markdown
"Debian 11.x (bullseye)"について
```bash
sudo apt -y install dirmngr
curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
"Ubuntu 18.04 LTS (bionic)"について
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
"Ubuntu 20.04 LTS (focal)"について
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
"Ubuntu 22.04 LTS (jammy)"について
```bash
curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
sudo apt update
```
"CentOS 7.x"について
```bash
sudo yum install -y epel-release
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
```
"Amazon Linux 2.0.2021x および低いバージョン"について
```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
```
"AlmaLinux、Rocky Linux、および Oracle Linux 8.x"について
```bash
sudo yum install -y epel-release
sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
```
```