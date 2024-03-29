!!! info "إذا قمت بنشر عدة وحدات Wallarm"
    يجب أن تكون جميع وحدات Wallarm المنشورة في بيئتك من **نفس الإصدارات**. يجب أن تكون وحدات ما بعد التحليل المثبتة على خوادم مفصولة من **نفس الإصدارات** أيضًا.

    قبل تثبيت الوحدة الإضافية، يرجى التأكد من أن إصدارها يتطابق مع إصدار الوحدات المنشورة بالفعل. إذا كانت نسخة الوحدة المنشورة [مهملة أو ستُهمل قريبًا (`4.0` أو أقل)][versioning-policy]، قم بترقية جميع الوحدات إلى أحدث إصدار.

    للتحقق من الإصدار المثبت لوحدة التصفية وما بعد التحليل المثبتة على نفس الخادم:

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
للتحقق من إصدارات وحدة التصفية وما بعد التحليل المثبتة على خوادم مختلفة:

    === "Debian"
       ```bash
       # يتم تنفيذه من الخادم الذي به وحدة تصفية Wallarm مثبتة
       apt list wallarm-node-nginx
       # يتم تنفيذه من الخادم الذي به ما بعد التحليل مثبت
       apt list wallarm-node-tarantool
       ```
    === "Ubuntu"
       ```bash
       # يتم تنفيذه من الخادم الذي به وحدة تصفية Wallarm مثبتة
       apt list wallarm-node-nginx
       # يتم تنفيذه من الخادم الذي به ما بعد التحليل مثبت
       apt list wallarm-node-tarantool
       ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
       ```bash
       # يتم تنفيذه من الخادم الذي به وحدة تصفية Wallarm مثبتة
       yum list wallarm-node-nginx
       # يتم تنفيذه من الخادم الذي به ما بعد التحليل مثبت
       yum list wallarm-node-tarantool
       ```