!!! info "نسخة حزمة `wallarm-node-tarantool`"
    يجب أن تكون نسخة حزمة `wallarm-node-tarantool` متطابقة أو أحدث من حزم وحدات NGINX-Wallarm الأساسية المثبتة على خادم منفصل.

    للتحقق من النسخ:

    === "Debian"
        ```bash
        # نفذ من الخادم الذي يحتوي على وحدة NGINX-Wallarm الأساسية
        apt list wallarm-node-nginx
        # نفذ من الخادم الذي يحتوي على وحدة التحليلات اللاحقة
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # نفذ من الخادم الذي يحتوي على وحدة NGINX-Wallarm الأساسية
        apt list wallarm-node-nginx
        # نفذ من الخادم الذي يحتوي على وحدة التحليلات اللاحقة
        apt list wallarm-node-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وما دون"
        ```bash
        # نفذ من الخادم الذي يحتوي على وحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # نفذ من الخادم الذي يحتوي على وحدة التحليلات اللاحقة
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        # نفذ من الخادم الذي يحتوي على وحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # نفذ من الخادم الذي يحتوي على وحدة التحليلات اللاحقة
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # نفذ من الخادم الذي يحتوي على وحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # نفذ من الخادم الذي يحتوي على وحدة التحليلات اللاحقة
        yum list wallarm-node-tarantool
        ```