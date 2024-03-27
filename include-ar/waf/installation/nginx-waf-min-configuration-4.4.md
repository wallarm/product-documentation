ملفات التكوين الرئيسية لـ NGINX وعقدة التصفية Wallarm موجودة في المسارات:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة على مجموعات نطاقات مختلفة، استخدم الملف `default.conf` أو قم بإنشاء ملفات تكوين جديدة لكل مجموعة نطاق (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متاحة في [وثائق NGINX الرسمية](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح في [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع تصفية الطلبات

بشكل افتراضي، تكون عقدة التصفية في حالة `off` ولا تقوم بتحليل الطلبات الواردة. لتفعيل تحليل الطلبات، يرجى اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى كتلة `https`، `server` أو `location`:

??? note "مثال على الملف `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # المنفذ الذي يتم فلترة الطلبات له
        listen       80;
        # النطاق الذي يتم فلترة الطلبات له
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

عند العمل في وضع `monitoring`، تبحث عقدة التصفية عن علامات الهجوم في الطلبات لكنها لا تحجب الهجمات المكتشفة. نوصي بالحفاظ على تدفق الحركة عبر عقدة التصفية في وضع `monitoring` لعدة أيام بعد نشر عقدة التصفية ومن ثم تفعيل وضع `block`. [تعلم التوصيات حول إعداد وضع تشغيل عقدة التصفية →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة Postanalytics على الخادم المنفصل"
    إذا تم تثبيت وحدة postanalytics على خادم منفصل، فتخطى هذه الخطوة لأن لديك بالفعل الوحدة مكونة.

تستخدم عقدة Wallarm التخزين في الذاكرة Tarantool. تعلم المزيد عن كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه يمكنك تخصيص موارد أقل للبيئات الاختبارية مقارنة بتلك المخصصة لبيئات الإنتاج.

لتخصيص الذاكرة لـ Tarantool:

1. افتح ملف تكوين Tarantool في وضع التحرير:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x وأقل"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux أو Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. حدد حجم الذاكرة بالجيجابايت في توجيه `SLAB_ALLOC_ARENA`. يمكن أن تكون القيمة رقم صحيح أو عشري (نقطة `.` كمفصل عشري).

    التوصيات التفصيلية حول تخصيص الذاكرة لـ Tarantool موصوفة في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان الخادم postanalytics المنفصل

!!! info "NGINX-Wallarm وpostanalytics على نفس الخادم"
    إذا تم تثبيت وحدتي NGINX-Wallarm وpostanalytics على نفس الخادم، فتخطى هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### التكوينات الأخرى

لتحديث تكوينات NGINX وعقدة Wallarm الأخرى، استخدم وثائق NGINX وقائمة [توجيهات عقدة Wallarm المتاحة][waf-directives-instr].