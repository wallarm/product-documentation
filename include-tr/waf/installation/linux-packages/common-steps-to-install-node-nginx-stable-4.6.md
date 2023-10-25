## 1. NGINX stable ve bağımlılıklarını yükleyin

NGINX `stable`'ı NGINX havuzundan kurmanın aşağıdaki yöntemleri bulunmaktadır:

* Derlenmiş paketten kurulum

    === "Debian"
        ```bash
        sudo apt -y install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fSsL https://nginx.org/keys/nginx_signing.key | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/nginx.gpg --import
        sudo chmod 644 /etc/apt/trusted.gpg.d/nginx.gpg
        sudo apt update
        sudo apt -y install nginx
        ```

    === "Ubuntu"
        1. NGINX stable için gereken bağımlılıkları kurun:

            ```bash
            sudo apt -y install curl gnupg2 ca-certificates lsb-release
            ```

        2. NGINX stable'ı kurun:

            ```bash
            echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
            curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
            sudo apt update
            sudo apt -y install nginx
            ```

    === "CentOS ya da Amazon Linux 2.0.2021x ve aşağısı"
        
        1. Eğer CentOS 7.x'te bir EPEL havuzu varsa, bu havuzdan NGINX stable kurulumunu `exclude=nginx*` dosyasına ekleyerek devre dışı bırakın `/etc/yum.repos.d/epel.repo`.

            Değiştirilmiş dosyanın `/etc/yum.repos.d/epel.repo` örneği:

            ```bash
            [epel]
            name=Extra Packages for Enterprise Linux 7 - $basearch
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=$basearch
            failovermethod=priority
            enabled=1
            gpgcheck=1
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            exclude=nginx*

            [epel-debuginfo]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Debug
            #baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch/debug
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1

            [epel-source]
            name=Extra Packages for Enterprise Linux 7 - $basearch - Source
            #baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
            metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=$basearch
            failovermethod=priority
            enabled=0
            gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
            gpgcheck=1
            ```

        2. Resmi havuzdan NGINX stable kurun:

            ```bash
            echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
            sudo yum install -y nginx
            ```

    === "RHEL 8.x"
        ```bash
        echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
        sudo yum install -y nginx
        ```

* Kaynak kodun [NGINX havuzu](https://hg.nginx.org/pkg-oss/branches) `stable` dalından derlenmesi ve aynı seçeneklerle kurulum.

    !!! bilgi "AlmaLinux, Rocky Linux veya Oracle Linux 8.x için NGINX"
        NGINX'i AlmaLinux, Rocky Linux veya Oracle Linux 8.x'e kurmanın tek yolu budur.

NGINX kurulumu hakkında daha detaylı bilgi [resmi NGINX belgelerinde](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) bulunmaktadır.

## 2. Wallarm havuzlarını ekleyin

Wallarm düğümü, Wallarm havuzlarından kurulur ve güncellenir. Havuzları eklemek için platformunuz için komutları kullanın:

=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.6/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x ve aşağısı"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```

## 3. Wallarm paketlerini kurun

Aşağıdaki paketler gereklidir:

* NGINX-Wallarm modülü için `nginx-module-wallarm`
* [postanalytics][install-postanalytics-docs] modülü, Tarantool veritabanı ve ek NGINX-Wallarm paketleri için `wallarm-node`

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-module-wallarm
    ```
=== "CentOS veya Amazon Linux 2.0.2021x ve aşağısı"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-module-wallarm
    ```

## 4. Wallarm modülünü bağlayın

1. `/etc/nginx/nginx.conf` dosyasını açın:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. `include /etc/nginx/conf.d/*;` satırının dosyaya eklendiğinden emin olun. Böyle bir satır yoksa, ekleyin.
3. Aşağıdaki yönergeyi `worker_processes` yönergesinin hemen ardına ekleyin:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    Eklenen yönerge ile yapılandırma örneği:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. Sistem kurulumu için yapılandırma dosyalarını kopyalayın:

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. Filtreleme düğümünü Wallarm Bulutuna bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"