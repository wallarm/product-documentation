!!! info "لو كنت هاتنشر أكتر من وحدة وولارم"
    كل الوحدات الخاصة بولارم اللي هاتتنشر في بيئتك لازم يكونوا بـ **نفس النسخ**. وحدات التحليلات البعدية اللي مُثبتة على سيرفرات مُنفصلة لازم تكون كمان بـ **نفس النسخ**.

    قبل ما تثبّت وحدة إضافية، تأكد من إن نسختها تُطابق نسخة الوحدات المُثبتة بالفعل. لو كانت نسخة الوحدة المُثبتة [هتبطل التدعيم أو قريب هتبطل (`4.0` أو أقل)][versioning-policy]، ارفع نسخة كل الوحدات لأحدث نسخة.

    علشان تشيك على نسخة وحدة التنقية والتحليلات البعدية المُثبتين على نفس السيرفر:
    
    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    علشان تشيك على نِسَخ وحدة التنقية والتحليلات البعدية المُثبتين على سيرفرات مختلفة:

    === "Debian"
        ```bash
        # شغّل ده من على السيرفر اللي عليه وحدة تنقية وولارم مُثبتة
        apt list wallarm-node-nginx
        # شغّل ده من على السيرفر اللي عليه التحليلات البعدية مُثبتة
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # شغّل ده من على السيرفر اللي عليه وحدة تنقية وولارم مُثبتة
        apt list wallarm-node-nginx
        # شغّل ده من على السيرفر اللي عليه التحليلات البعدية مُثبتة
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # شغّل ده من على السيرفر اللي عليه وحدة تنقية وولارم مُثبتة
        yum list wallarm-node-nginx
        # شغّل ده من على السيرفر اللي عليه التحليلات البعدية مُثبتة
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # شغّل ده من على السيرفر اللي عليه وحدة تنقية وولارم مُثبتة
        yum list wallarm-node-nginx
        # شغّل ده من على السيرفر اللي عليه التحليلات البعدية مُثبتة
        yum list wallarm-node-tarantool
        ```