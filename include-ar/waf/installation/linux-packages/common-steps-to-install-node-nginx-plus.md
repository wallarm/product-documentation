## 1. تثبيت NGINX Plus والمتطلبات اللازمة

قم بتثبيت NGINX Plus والمتطلبات اللازمة باستخدام هذه [التعليمات الرسمية لـ NGINX](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/).

!!! info "التثبيت على الأمازون لينكس 2.0.2021 وما دون"
    لتثبيت NGINX Plus على الأمازون لينكس 2.0.2021 وما دون، استخدم تعليمات CentOS 7.

## 2. إضافة مستودعات Wallarm

تتم تثبيت وتحديث عقدة Wallarm من المستودعات Wallarm. لإضافة المستودعات، استخدم الأوامر لمنصتك:

=== "ديبيان 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "أوبونتو 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "أوبونتو 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "أوبونتو 22.04 LTS (jammy)"
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
=== "الأمازون لينكس 2.0.2021x وما دون"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
    ```

## 3. تثبيت حزم Wallarm

الحزم المطلوبة هي:

* `nginx-plus-module-wallarm` لوحدة NGINX Plus-Wallarm
* `wallarm-node` لوحدة [postanalytics][install-postanalytics-instr]، قاعدة بيانات تارانتول، وحزم NGINX Plus-Wallarm الإضافية

=== "ديبيان"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "أوبونتو"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOS أو الأمازون لينكس 2.0.2021x وما دون"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "ألما لينكس، روكي لينكس أو أوراكل لينكس 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```

## 4. ربط وحدة Wallarm

1. افتح الملف `/etc/nginx/nginx.conf`:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. أضف الأمر التالي مباشرة بعد أمر `worker_processes`:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    مثال التكوين مع إضافة الأمر:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

3. نسخ ملفات التكوين لإعداد النظام:

    ``` bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

## 5. ربط العقدة الفلترة بسحابة Wallarm

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"