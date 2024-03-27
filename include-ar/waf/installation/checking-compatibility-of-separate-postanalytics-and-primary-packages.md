!!! info "نسخة حزمة `wallarm-node-tarantool`"
    يجب أن تكون حزمة `wallarm-node-tarantool` من نفس النسخة أو أعلى من نسخ حزم وحدات NGINX-Wallarm الأساسية المُثبتة على خادم منفصل.

    للتحقق من النسخ:

    === "Debian"
        ```bash
        # تشغيل من الخادم بوحدة NGINX-Wallarm الأساسية
        apt list wallarm-node-nginx
        # تشغيل من الخادم بوحدة postanalytics
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # تشغيل من الخادم بوحدة NGINX-Wallarm الأساسية
        apt list wallarm-node-nginx
        # تشغيل من الخادم بوحدة postanalytics
        apt list wallarm-node-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ```bash
        # تشغيل من الخادم بوحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # تشغيل من الخادم بوحدة postanalytics
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        # تشغيل من الخادم بوحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # تشغيل من الخادم بوحدة postanalytics
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # تشغيل من الخادم بوحدة NGINX-Wallarm الأساسية
        yum list wallarm-node-nginx
        # تشغيل من الخادم بوحدة postanalytics
        yum list wallarm-node-tarantool
        ```