!!! info "إذا نشرت عدة عقد Wallarm"
    يجب أن تكون جميع العقد Wallarm المنشورة في بيئتك من **نفس الإصدارات**. يجب أن تكون وحدات التحليل اللاحقة المثبتة على الخوادم المنفصلة من **نفس الإصدارات** أيضًا.

    قبل تثبيت العقدة الإضافية، يرجى التأكد من مطابقة إصدارها لإصدار الوحدات المنشورة مسبقًا. إذا كان إصدار الوحدة المنشورة [متقادمًا أو سيتقادم قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى الإصدار الأخير.

    للتحقق من الإصدار المثبت لعقدة التصفية والتحليل اللاحق على نفس الخادم:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    للتحقق من إصدارات عقدة التصفية والتحليل اللاحق المثبتة على خوادم مختلفة:

    === "Debian"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة التصفية Wallarm عليه
        apt list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت التحليل اللاحق عليه
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة التصفية Wallarm عليه
        apt list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت التحليل اللاحق عليه
        apt list wallarm-node-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة التصفية Wallarm عليه
        yum list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت التحليل اللاحق عليه
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة التصفية Wallarm عليه
        yum list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت التحليل اللاحق عليه
        yum list wallarm-node-tarantool
        ```