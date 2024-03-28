ملفات التكوين الرئيسية لـ NGINX وعقدة تصفية Wallarm تقع في الدلائل:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم ملف `default.conf` أو قم بإنشاء ملفات تكوين جديدة لكل مجموعة نطاق (على سبيل المثال، `example.com.conf` و `test.com.conf`). يتوفر معلومات أكثر تفصيلاً عن ملفات تكوين NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع تصفية الطلبات

افتراضيًا، تكون عقدة التصفية في الحالة `off` ولا تقوم بتحليل الطلبات الواردة. لتمكين تحليل الطلبات، الرجاء اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى كتلة `https`، `server` أو `location`:

??? note "مثال على الملف `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # المنفذ الذي تُصفى عليه الطلبات
        listen       80;
        # نطاق الذي تُصفى عليه الطلبات
        server_name  localhost;
        # وضع عقدة التصفية
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

عند العمل في وضع `monitoring`، تبحث عقدة التصفية عن علامات الهجوم في الطلبات لكنها لا تمنع الهجمات المكتشفة. نوصي بإبقاء حركة المرور عبر عقدة التصفية في وضع `monitoring` لعدة أيام بعد نشر عقدة التصفية ومن ثم تمكين وضع `block`. [تعرف على التوصيات بخصوص إعداد وضع عمل عقدة التصفية →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة Postanalytics على خادم منفصل"
    إذا قمت بتثبيت وحدة postanalytics على خادم منفصل، فتخطى هذه الخطوة لأن لديك الوحدة مُعدة بالفعل.

تستخدم عقدة Wallarm التخزين في الذاكرة Tarantool. تعرف على المزيد حول كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه للبيئات التجريبية يمكنك تخصيص موارد أقل من تلك المخصصة للبيئات الإنتاجية.

لتخصيص الذاكرة لـ Tarantool:

1. افتح ملف تكوين Tarantool في وضع التحرير:

    === "ديبيان"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "أوبونتو"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وما دون"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. حدد حجم الذاكرة بالجيجابايت في توجيه `SLAB_ALLOC_ARENA`. يمكن أن يكون القيمة عددًا صحيحًا أو عددًا عشريًا (نقطة `.` هي فاصلة العشرية).

    يتم وصف التوصيات التفصيلية حول تخصيص الذاكرة لـ Tarantool في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان خادم postanalytics المنفصل

!!! info "NGINX-Wallarm وpostanalytics على نفس الخادم"
    إذا تم تثبيت وحدات NGINX-Wallarm وpostanalytics على نفس الخادم، فتخطى هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### إعدادات أخرى

لتحديث إعدادات NGINX وعقدة Wallarm الأخرى، استخدم توثيق NGINX وقائمة [التوجيهات المتوفرة لعقدة Wallarm][waf-directives-instr].