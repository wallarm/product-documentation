!!! info "إذا نشرت عدة عقد Wallarm"
    يجب أن تكون جميع عقد Wallarm المنشورة في بيئتك من **نفس الإصدارات**. يجب أن تكون وحدات التحليلات بعد الحدث المثبتة على الخوادم المنفصلة من **نفس الإصدارات** أيضًا.

    قبل تثبيت العقدة الإضافية، يرجى التأكد من أن إصدارها يتطابق مع إصدار الوحدات المنشورة بالفعل. إذا كان إصدار الوحدة المنشورة قد [أصبح قديمًا أو سيصبح قديمًا قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى الإصدار الأخير.

    لفحص إصدار عقدة الترشيح ووحدة التحليلات بعد الحدث المثبتة على نفس الخادم:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    لفحص إصدار عقدة الترشيح ووحدة التحليلات بعد الحدث المثبتة على خوادم مختلفة:

    === "Debian"
        ```bash
        # يتم التشغيل من الخادم الذي تم تثبيت عقدة ترشيح Wallarm عليه
        apt list wallarm-node-nginx
        # يتم التشغيل من الخادم الذي تم تثبيت التحليلات بعد الحدث عليه
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # يتم التشغيل من الخادم الذي تم تثبيت عقدة ترشيح Wallarm عليه
        apt list wallarm-node-nginx
        # يتم التشغيل من الخادم الذي تم تثبيت التحليلات بعد الحدث عليه
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # يتم التشغيل من الخادم الذي تم تثبيت عقدة ترشيح Wallarm عليه
        yum list wallarm-node-nginx
        # يتم التشغيل من الخادم الذي تم تثبيت التحليلات بعد الحدث عليه
        yum list wallarm-node-tarantool
        ```