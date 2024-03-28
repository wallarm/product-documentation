تقع ملفات الضبط الرئيسية لـ NGINX وعقدة تصفية Wallarm في المجلدات:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو قم بإنشاء ملفات ضبط جديدة لكل مجموعة من النطاقات (مثل `example.com.conf` و`test.com.conf`). تتوفر معلومات أكثر تفصيلاً حول ملفات ضبط NGINX في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع فلترة الطلبات

بشكل افتراضي، تكون عقدة التصفية في الحالة `off` ولا تقوم بتحليل الطلبات الواردة. لتمكين تحليل الطلبات، يُرجى اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى الكتلة `https`, `server` أو `location`:

??? note "مثال على الملف `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # المنفذ الذي يتم تصفية الطلبات له
        listen       80;
        # النطاق الذي يتم تصفية الطلبات له
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
عند التشغيل في وضع `monitoring`، تبحث عقدة التصفية عن علامات الهجوم في الطلبات لكن لا تحجب الهجمات المكتشفة. ننصح بالسماح بمرور الحركة عبر عقدة التصفية في وضع `monitoring` لعدة أيام بعد نشر عقدة التصفية ومن ثم تمكين وضع `block`. [تعرف على التوصيات بشأن إعداد وضع عقدة التصفية →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة postanalytics على الخادم المنفصل"
    إذا قمت بتثبيت وحدة postanalytics على خادم منفصل، فتجاوز هذه الخطوة لأن لديك الوحدة مضبوطة بالفعل.

تستخدم عقدة Wallarm التخزين بالذاكرة Tarantool. تعرف على المزيد حول كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه بالنسبة لبيئات الاختبار، يمكنك تخصيص موارد أقل مما هو للبيئات الإنتاجية.

لتخصيص الذاكرة لـ Tarantool:

1. افتح ملف ضبط Tarantool في وضع التحرير:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. حدد حجم الذاكرة بالجيجابايت في التوجيه `SLAB_ALLOC_ARENA`. يمكن أن تكون القيمة عددًا صحيحًا أو عشريًا (نقطة `.` هي فاصل عشري).

    الوصف التفصيلي للتوصيات حول تخصيص الذاكرة لـ Tarantool موضح في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان الخادم postanalytics المنفصل

!!! info "NGINX-Wallarm وpostanalytics على نفس الخادم"
    إذا تم تثبيت وحدات NGINX-Wallarm وpostanalytics على نفس الخادم، فتجاوز هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### التكوينات الأخرى

لتحديث تكوينات NGINX وعقدة Wallarm الأخرى، استخدم التوثيق الخاص بـ NGINX وقائمة [توجيهات عقدة Wallarm المتاحة][waf-directives-instr].