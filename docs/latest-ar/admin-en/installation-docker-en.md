[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# تشغيل صورة Docker المبنية على NGINX

يمكن نشر عقدة التصفية المبنية على NGINX من Wallarm باستخدام [صورة Docker](https://hub.docker.com/r/wallarm/node). تدعم هذه العقدة أنظمة تشغيل المعالجات x86_64 وARM64، والتي يتم التعرف عليها تلقائيًا أثناء التثبيت. توفر هذه المقالة إرشادات حول كيفية تشغيل العقدة من صورة Docker.

## حالات الاستخدام

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## خيارات تشغيل الحاوية

--8<-- "../include/waf/installation/docker-running-options.md"

## تشغيل الحاوية مع إرسال المتغيرات البيئية

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. تشغيل الحاوية مع العقدة:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.10.4-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.10.4-1
        ```

يمكنك إرسال الإعدادات الأساسية لعقدة التصفية التالية إلى الحاوية عن طريق الخيار `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

تقوم الأمر بما يلي:

* يُنشئ ملف `default` بإعدادات NGINX الدنيا ويمرر تكوين عقدة التصفية في دليل الحاوية `/etc/nginx/sites-enabled`.
* يُنشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى سحابة Wallarm في دليل الحاوية `/opt/wallarm/etc/wallarm`:
    * `node.yaml` بمعرف عقدة التصفية UUID ومفتاح السر
    * `private.key` بمفتاح Wallarm الخاص
* يحمي المورد `http://NGINX_BACKEND:80`.

## تشغيل الحاوية مع تركيب ملف التكوين

يمكنك تركيب ملف التكوين المُحضر إلى الحاوية Docker عبر الخيار `-v`. يجب أن يحتوي الملف على الإعدادات التالية:

* [توجيهات عقدة التصفية][nginx-directives-docs]
* [إعدادات NGINX](https://nginx.org/en/docs/beginners_guide.html)

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. تشغيل الحاوية مع العقدة:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.4-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.4-1
        ```

    * خيار `-e` يمرر المتغيرات البيئية المطلوبة التالية إلى الحاوية:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * خيار `-v` يركب الدليل بملف التكوين `default` إلى دليل الحاوية `/etc/nginx/sites-enabled`.

        ??? info "شاهد مثالاً على الملف المركب بالإعدادات الدنيا"
            ```bash
            server {
                    listen 80 default_server;
                    listen [::]:80 default_server ipv6only=on;
                    #listen 443 ssl;

                    server_name localhost;

                    #ssl_certificate cert.pem;
                    #ssl_certificate_key cert.key;

                    root /usr/share/nginx/html;

                    index index.html index.htm;

                    wallarm_mode monitoring;

                    location / {
                            
                            proxy_pass http://example.com;
                            include proxy_params;
                    }
            }
            ```

        !!! info "تركيب ملفات تكوين أخرى"
            الدلائل التي يستخدمها NGINX في الحاوية:

            * `/etc/nginx/nginx.conf` - هو ملف إعدادات NGINX الرئيسي. إذا قررت تركيب هذا الملف، خطوات إضافية ضرورية لإعدادات Wallarm الصحيحة:

                1. تركيب ملف `/etc/nginx/conf.d/wallarm-status.conf`، مع التأكد من مطابقة محتوياته لـ[النموذج](https://github.com/wallarm/docker-wallarm-node/blob/stable/4.10/conf/nginx_templates/wallarm-status.conf.tmpl).
                1. ضمن ملفات تكوين NGINX، تعيين تكوين الخدمة `/wallarm-status` وفقًا لـ[النموذج](https://github.com/wallarm/docker-wallarm-node/blob/stable/4.10/conf/nginx_templates/default.conf.tmpl#L32).
            * `/etc/nginx/conf.d` — الإعدادات الشائعة
            * `/etc/nginx/sites-enabled` — إعدادات الاستضافة الافتراضية
            * `/opt/wallarm/usr/share/nginx/html` — الملفات الثابتة

            إذا لزم الأمر، يمكنك تركيب أي ملفات إلى دلائل الحاوية المذكورة. يجب وصف توجيهات عقدة التصفية في ملف `/etc/nginx/sites-enabled/default`.

تقوم الأمر بما يلي:

* يركب ملف `default` داخل دليل الحاوية `/etc/nginx/sites-enabled`.
* يُنشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى سحابة Wallarm في دليل الحاوية `/opt/wallarm/etc/wallarm`:
    * `node.yaml` بمعرف عقدة التصفية UUID ومفتاح السر
    * `private.key` بمفتاح Wallarm الخاص
* يحمي المورد `http://example.com`.

## تكوين التسجيل

يكون التسجيل مُفعلاً بشكل افتراضي. دلائل التسجيل هي:

* `/var/log/nginx` — سجلات NGINX
* `/opt/wallarm/var/log/wallarm` — [سجلات عقدة Wallarm][logging-instr]

## اختبار عمل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## تكوين حالات الاستخدام

يجب أن يصف ملف التكوين المركب إلى الحاوية Docker تكوين عقدة التصفية في [التوجيهات المتاحة][nginx-directives-docs]. فيما يلي بعض خيارات تكوين عقدة التصفية المُستخدمة بشكل شائع:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"