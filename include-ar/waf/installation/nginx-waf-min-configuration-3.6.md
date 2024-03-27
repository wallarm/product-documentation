ملفات تكوين الإعدادات الرئيسية لـ NGINX وعقدة تصفية Wallarm موجودة في الدلائل:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات العقدة العالمية للتصفية

    يُستخدم الملف للإعدادات المطبقة على جميع المجالات. لتطبيق إعدادات مختلفة على مجموعات مجالات مختلفة، استخدم الملف `default.conf` أو انشئ ملفات تكوين جديدة لكل مجموعة من المجالات (على سبيل المثال، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متاحة في [الوثائق الرسمية لـNGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع تصفية الطلبات

بشكل افتراضي، تكون عقدة التصفية في الحالة `off` ولا تُحلل الطلبات الواردة. لتمكين تحليل الطلبات، الرجاء اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى كتلة `https` أو `server` أو `location`:

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

عند التشغيل في وضع `monitoring`، تبحث عقدة التصفية عن علامات الهجوم في الطلبات لكنها لا تمنع الهجمات المكتشفة. نوصي بإبقاء حركة الزيارات عبر عقدة التصفية في وضع `monitoring` لعدة أيام بعد نشر عقدة التصفية ومن ثم تمكين وضع ال`block`. [تعرف على التوصيات بشأن إعداد وضع التشغيل لعقدة التصفية →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة ما بعد التحليل على خادم منفصل"
    إذا تم تثبيت وحدة ما بعد التحليل على خادم منفصل، فتجاهل هذه الخطوة حيث أنك قد قمت بالفعل بتكوين الوحدة.

تستخدم عقدة Wallarm ذاكرة التخزين المؤقت في الذاكرة Tarantool. تعرف أكثر على كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه بالنسبة لبيئات الاختبار يمكنك تخصيص موارد أقل مما هو مطلوب للبيئات الإنتاجية.

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
    === "CentOS أو Amazon Linux 2.0.2021x وأقل"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. حدد حجم الذاكرة بالجيجابايت في توجيه `SLAB_ALLOC_ARENA`. يمكن أن تكون القيمة عدد صحيح أو عشري (النقطة `.` هي فاصلة عشرية).

    التوصيات التفصيلية حول تخصيص الذاكرة لـ Tarantool موصوفة في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان الخادم المنفصل لما بعد التحليل

!!! info "NGINX-Wallarm وما بعد التحليل على نفس الخادم"
    إذا تم تثبيت وحدات NGINX-Wallarm وما بعد التحليل على نفس الخادم، فتجاهل هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### التكوينات الأخرى

لتحديث إعدادات تكوينات NGINX وعقدة Wallarm الأخرى، استخدم وثائق NGINX وقائمة [واجهة تكوينات عقدة Wallarm المتاحة][waf-directives-instr].