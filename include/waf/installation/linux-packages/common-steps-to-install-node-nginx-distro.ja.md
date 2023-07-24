## 1. Debian/CentOSリポジトリを追加します

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

## 2. WallarmパッケージつきのNGINXをインストールします

このコマンドは次のパッケージをインストールします：

* NGINXのための`nginx`
* NGINX-Wallarmモジュールのための`libnginx-mod-http-wallarm`または`nginx-mod-http-wallarm`
* [postanalytics][install-postanalytics-docs]モジュール、Tarantoolデータベース、そして追加のNGINX-Wallarmパッケージ用の`wallarm-node`

=== "Debian 10.x (buster)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install --no-install-recommends nginx wallarm-node libnginx-mod-http-wallarm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo yum install -y nginx wallarm-node nginx-mod-http-wallarm
    ```

## 3. Wallarmモジュールを接続します

システムセットアップ用の設定ファイルをコピーします：

=== "Debian"
    ```bash
    sudo cp /usr/share/doc/libnginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "CentOS"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```
=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
    ```bash
    sudo cp /usr/share/doc/nginx-mod-http-wallarm/examples/*conf /etc/nginx/conf.d/
    ```

## 4. フィルタリングノードをWallarmクラウドに接続します

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"