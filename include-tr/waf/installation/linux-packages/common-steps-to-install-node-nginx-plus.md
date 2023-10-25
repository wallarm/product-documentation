## 1. NGINX Plus ve Bağımlılıkların Yüklenmesi

NGINX Plus ve bağımlılıklarını, bu [resmi NGINX talimatlarını](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/) kullanarak yükleyin.

!!! info "Amazon Linux 2.0.2021x ve daha düşük sürümlerine yükleme"
    NGINX Plus'ı Amazon Linux 2.0.2021x ve daha düşük sürümlere yüklemek için CentOS 7 talimatlarını kullanın.

## 2. Wallarm Depolarının Eklenmesi

Wallarm düğümü, Wallarm depolarından yüklenir ve güncellenir. Depoları eklemek için platformunuz için geçerli komutları kullanın:

=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x ve daha düşük sürümler"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

## 3. Wallarm Paketlerinin Yüklenmesi

Aşağıdaki paketler gereklidir:

* NGINX Plus-Wallarm modülü için `nginx-plus-module-wallarm`
* [postanalytics][install-postanalytics-instr] modülü, Tarantool veritabanı ve ek NGINX Plus-Wallarm paketleri için `wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOS veya Amazon Linux 2.0.2021x ve daha düşük sürümler"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```

## 4. Wallarm Modülünün Bağlanması

1. `/etc/nginx/nginx.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. `worker_processes` direktifi hemen ardına aşağıdaki direktifi ekleyin:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    Eklenen direktifli yapılandırma örneği:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

3. Sistem kurulumu için yapılandırma dosyalarını kopyalayın:

    ``` bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. Filtreleme Düğümünü Wallarm Cloud'a Bağlama

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"