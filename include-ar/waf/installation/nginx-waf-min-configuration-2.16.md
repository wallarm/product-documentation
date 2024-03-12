ملفات التكوين الرئيسية لـ NGINX وعقدة تصفية Wallarm موجودة في المسارات:

* `/etc/nginx/conf.d/default.conf` مع إعدادات NGINX
* `/etc/nginx/conf.d/wallarm.conf` مع إعدادات عقدة التصفية العالمية

    يُستخدم الملف للإعدادات المطبقة على جميع النطاقات. لتطبيق إعدادات مختلفة لمجموعات النطاقات المختلفة، استخدم الملف `default.conf` أو انشئ ملفات تكوين جديدة لكل مجموعة نطاقات (مثلاً، `example.com.conf` و `test.com.conf`). المزيد من المعلومات التفصيلية حول ملفات تكوين NGINX متاحة في [التوثيق الرسمي لـ NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` مع إعدادات مراقبة عقدة Wallarm. الوصف التفصيلي متاح ضمن [الرابط][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` أو `/etc/sysconfig/wallarm-tarantool` مع إعدادات قاعدة بيانات Tarantool

#### وضع تصفية الطلبات

بشكل افتراضي، عقدة التصفية في وضع `off` ولا تحلل الطلبات الواردة. لتفعيل تحليل الطلبات، الرجاء اتباع الخطوات:

1. افتح الملف `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. أضف السطر `wallarm_mode monitoring;` إلى كتلة `https`، `server` أو `location`:

??? note "مثال على الملف `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # المنفذ الذي يتم تصفية الطلبات عليه
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

عند العمل في وضع `monitoring`، تبحث عقدة التصفية عن علامات الهجوم في الطلبات ولكن لا تحظر الهجمات المكتشفة. نوصي بالإبقاء على تدفق الحركة عبر عقدة التصفية في وضع `monitoring` لعدة أيام بعد نشر عقدة التصفية ثم تفعيل وضع `block`. [تعرف على التوصيات بشأن إعداد وضع تشغيل عقدة التصفية →][waf-mode-recommendations]

#### الذاكرة

!!! info "وحدة postanalytics على خادم منفصل"
    إذا تم تثبيت وحدة postanalytics على خادم منفصل، فتجاهل هذه الخطوة لأنك لديك الوحدة مكونة بالفعل.

تستخدم عقدة Wallarm الذاكرة المؤقتة Tarantool. تعرف أكثر على كمية الموارد المطلوبة [هنا][memory-instr]. لاحظ أنه يمكن تخصيص موارد أقل لبيئات الاختبار مقارنةً بالبيئات الإنتاجية.

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
2. حدد حجم الذاكرة بالجيجابايت في توجيه `SLAB_ALLOC_ARENA`. يمكن أن تكون القيمة عدداً صحيحاً أو عدداً عشرياً (نقطة `.` هي فاصلة العشرية).

    التوصيات التفصيلية حول تخصيص الذاكرة لـ Tarantool موصوفة في هذه [التعليمات][memory-instr]. 
3. لتطبيق التغييرات، أعد تشغيل Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### عنوان خادم postanalytics المنفصل

!!! info "NGINX-Wallarm وpostanalytics على نفس الخادم"
    إذا تم تثبيت وحدات NGINX-Wallarm وpostanalytics على نفس الخادم، فتجاهل هذه الخطوة.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### التكوينات الأخرى

لتحديث تكوينات NGINX وعقدة Wallarm الأخرى، استخدم التوثيق NGINX وقائمة [التوجيهات المتاحة لعقدة Wallarm][waf-directives-instr].