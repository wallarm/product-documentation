!!! info "لو بتعتمد على عدة عقد من Wallarm"
    كل العقد من Wallarm اللي بتتعتمد في بيئتك لازم تكون بـ **نفس الإصدارات**. وكمان الأجهزة المثبت عليها موديولز البريداتليتكس اللي على خوادم منفصلة لازم تكون بـ **نفس الإصدارات**.

    قبل تركيب عقدة إضافية، لو سمحت تأكد إن إصدارها يطابق إصدار الموديولات المعتمدة مسبقاً. لو إصدار الموديول المعتمد ده [هيختفي قريب أو كده (`4.0` أو أقل)][versioning-policy]، قم بتحديث كل الموديولات لآخر إصدار.

    علشان تتأكد من إصدار عقدة الفلترة وموديول البريداتليتكس المعتمد على نفس الخادم:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    علشان تتأكد من إصدار عقدة الفلترة وموديول البريداتليتكس المعتمد على خوادم مختلفة:

    === "Debian"
        ```bash
        # تنفذ من على الخادم اللي عليه عقدة فلترة Wallarm مثبتة
        apt list wallarm-node-nginx
        # تنفذ من على الخادم اللي عليه بوستانالتيكس مثبت
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # تنفذ من على الخادم اللي عليه عقدة فلترة Wallarm مثبتة
        yum list wallarm-node-nginx
        # تنفذ من على الخادم اللي عليه بوستانالتيكس مثبت
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # تنفذ من على الخادم اللي عليه عقدة فلترة Wallarm مثبتة
        yum list wallarm-node-nginx
        # تنفذ من على الخادم اللي عليه بوستانالتيكس مثبت
        yum list wallarm-node-tarantool
        ```