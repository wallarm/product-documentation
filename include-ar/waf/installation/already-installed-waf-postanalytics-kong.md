!!! info "لو كنت بتثبت أكتر من عقدة Wallarm"
    كل العقد من Wallarm اللي بتتثبت في البيئة بتاعتك لازم تكون بـ **نفس الإصدارات**. وحدات postanalytics اللي مُثبتة على خوادم منفصلة لازم تكون كمان بـ **نفس الإصدارات**.

    قبل ما تثبت عقدة إضافية، لو سمحت اتأكد إن الإصدار بتاعها مطابق لإصدار الوحدات اللي اتثبتت قبل كده. لو الإصدار بتاع الوحدة اللي اتثبتت [قديم أو هيبقى قديم قريب ("4.0" أو أقل)][versioning-policy]، عليك تحديث كل الوحدات لآخر إصدار.

    للتحقق من إصدار عقدة الفلترة ووحدة postanalytics اللي مُثبتة على نفس الخادم:

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

    للتحقق من إصدار عقدة الفلترة ووحدة postanalytics اللي مُثبتة على خوادم مختلفة:

    === "Debian"
        ```bash
        # شغّل من على الخادم اللي عليه عقدة فلترة Wallarm مُثبتة
        apt list wallarm-node-nginx
        # شغّل من على الخادم اللي عليه وحدة postanalytics مُثبتة
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # شغّل من على الخادم اللي عليه عقدة فلترة Wallarm مُثبتة
        apt list wallarm-node-nginx
        # شغّل من على الخادم اللي عليه وحدة postanalytics مُثبتة
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # شغّل من على الخادم اللي عليه عقدة فلترة Wallarm مُثبتة
        yum list wallarm-node-nginx
        # شغّل من على الخادم اللي عليه وحدة postanalytics مُثبتة
        yum list wallarm-node-tarantool
        ```