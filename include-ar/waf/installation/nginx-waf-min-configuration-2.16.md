تقع ملفات التهيئة الرئيسية لـ NGINX وعقدة الفلترة Wallarm في المجلدات:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة الفلترة العامة

    يُستخدم الملف للإعدادات المطبقة على جميع المجالات. لتطبيق إعدادات مختلفة على مجموعات المجالات المختلفة، استخدم الملف `default.conf` أو انشئ ملفات تهيئة جديدة لكل مجموعة من المجالات (على سبيل المثال، `example.com.conf` و`test.com.conf`). المعلومات المفصلة حول ملفات تهيئة NGINX متوفرة في [الوثائق الرسمية لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف المفصل متوفر ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع فلترة الطلبات

بشكل افتراضي، تكون عقدة الفلترة في وضع `off` ولا تحلل الطلبات الواردة. لتمكين تحليل الطلبات، يُرجى اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى كتلة `https`, `server` أو `location`:

??? note "مثال على الملف `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # منفذ تصفية الطلبات
        listen       80;
        # مجال تصفية الطلبات
        server_name  localhost;
        # وضع عقدة الفلترة
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

عند العمل في وضع `monitoring`، تبحث عقدة الفلترة عن علامات الهجمات في الطلبات لكن لا تحظر الهجمات المكتشفة. نوصي بالإبقاء على تدفق الحركة عبر عقدة الفلترة في وضع `monitoring` لعدة أيام بعد نشر عقدة الفلترة وبعد ذلك فقط تفعيل وضع `block`. [تعلم التوصيات حول إعداد وضع عمل عقدة الفلترة →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة التحليلات في الوقت الفعلي على خادم منفصل"
    إذا كانت وحدة التحليلات بعد الأحداث مثبتة على خادم منفصل، فتخطى هذه الخطوة لأنك تملك الوحدة مهيأة بالفعل.

تستخدم عقدة Wallarm التخزين في الذاكرة Tarantool. اعرف المزيد حول كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه يمكن تخصيص موارد أقل للبيئات التجريبية مقارنة بتلك الخاصة بالإنتاج.

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
2. حدد حجم الذاكرة بالجيجابايت في توجيه `SLAB_ALLOC_ARENA`. يمكن أن تكون القيمة عددًا صحيحًا أو عشريًا (نقطة `.` هي فاصل عشري).

    توصيات مفصلة حول تخصيص الذاكرة لـ Tarantool موصوفة في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان خادم التحليلات بعد الأحداث المنفصل

!!! info "NGINX-Wallarm ووحدة التحليلات بعد الأحداث على نفس الخادم"
    إذا تم تثبيت وحدتي NGINX-Wallarm والتحليلات في الوقت الفعلي على نفس الخادم، فتخطى هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### التكوينات الأخرى

لتحديث التكوينات الأخرى لـ NGINX وعقدة Wallarm، استخدم الوثائق الخاصة بـ NGINX وقائمة [توجيهات عقدة Wallarm المتاحة][waf-directives-instr].