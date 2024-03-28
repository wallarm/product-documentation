!!! info "إذا قمت بتوظيف عدة عقد Wallarm"
    يجب أن تكون جميع عقد Wallarm الموظفة في بيئتك من **الإصدارات نفسها**. يجب أن تكون وحدات ما بعد التحليل المثبتة على الخوادم المنفصلة من **الإصدارات نفسها** أيضًا.

    قبل تثبيت العقدة الإضافية، يرجى التأكد من أن إصدارها يتطابق مع إصدار الوحدات الموظفة بالفعل. إذا كان إصدار الوحدة الموظفة [مهملاً أو سيتم إهماله قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى أحدث إصدار.

    لفحص إصدار عقدة التصفية ووحدة ما بعد التحليل الموظفة على الخادم نفسه:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    لفحص إصدار عقدة التصفية ووحدة ما بعد التحليل الموظفة على خوادم مختلفة:

    === "Debian"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة تصفية Wallarm عليه
        apt list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت ما بعد التحليل عليه
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة تصفية Wallarm عليه
        yum list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت ما بعد التحليل عليه
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ```bash
        # تشغيل من الخادم الذي تم تثبيت عقدة تصفية Wallarm عليه
        yum list wallarm-node-nginx
        # تشغيل من الخادم الذي تم تثبيت ما بعد التحليل عليه
        yum list wallarm-node-tarantool
        ```