# تشغيل صورة دوكر القائمة على NGINX

يمكن نشر عقدة تصفية Wallarm القائمة على NGINX باستخدام [صورة دوكر](https://hub.docker.com/r/wallarm/node). تدعم هذه العقدة كل من أنظمة تشغيل المعالجات x86_64 و ARM64، والتي يتم التعرف عليها تلقائيًا أثناء التثبيت. يوفر هذا المقال إرشادات حول كيفية تشغيل العقدة من صورة دوكر.

## حالات الاستخدام

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## خيارات تشغيل الحاوية

--8<-- "../include/waf/installation/docker-running-options.md"

## تشغيل الحاوية مروراً بمتغيرات البيئة

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية مع العقدة:

    === "سحابة الولايات المتحدة"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.10.1-1
        ```
    === "سحابة الاتحاد الأوروبي"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.10.1-1
        ```

يمكنك تمرير الإعدادات الأساسية التالية لعقدة التصفية إلى الحاوية عبر الخيار `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

الأمر يقوم بما يلي:

* يُنشئ الملف `default` بإعدادات NGINX الأساسية ويمرر إعدادات عقدة التصفية في دليل الحاوية `/etc/nginx/sites-enabled`.
* ينشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى Wallarm Cloud في دليل الحاوية `/opt/wallarm/etc/wallarm`:
    * `node.yaml` بمعرف عقدة التصفية UUID ومفتاح السر
    * `private.key` بمفتاح Wallarm الخاص
* يحمي المورد `http://NGINX_BACKEND:80`.

## تشغيل الحاوية باستخدام ملف الإعدادات

يمكنك تركيب ملف الإعدادات المعدّ مسبقًا على حاوية دوكر عبر خيار `-v`. يجب أن يحتوي الملف على الإعدادات التالية:

* [تعليمات عقدة التصفية][nginx-directives-docs]
* [إعدادات NGINX](https://nginx.org/en/docs/beginners_guide.html)

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية مع العقدة:

    === "سحابة الولايات المتحدة"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.1-1
        ```
    === "سحابة الاتحاد الأوروبي"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.1-1
        ```

    * خيار `-e` يقوم بتمرير المتغيرات البيئية المطلوبة التالية إلى الحاوية:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * خيار `-v` يقوم بتركيب دليل مع ملف الإعدادات `default` إلى دليل الحاوية `/etc/nginx/sites-enabled`.

        ??? info "شاهد مثالًا على الملف المركب بإعدادات أساسية"
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

        !!! info "تركيب ملفات إعدادات أخرى"
            دلائل الحاوية المستخدمة بواسطة NGINX:

            * `/etc/nginx/nginx.conf` - هذا هو الملف الرئيسي لإعدادات NGINX. إذا قررت تركيب هذا الملف، خطوات إضافية ضرورية للوظيفة الصحيحة لـ Wallarm:

                1. قم بتركيب ملف `/etc/nginx/conf.d/wallarm-status.conf`، مع التأكد من مطابقة محتواه لـ [القالب](https://github.com/wallarm/docker-wallarm-node/blob/stable/4.10/conf/nginx_templates/wallarm-status.conf.tmpl).
                1. ضمن ملفات إعدادات NGINX، قم بضبط الإعدادات لخدمة [`/wallarm-status`][node-status-docs] وفقًا لـ [القالب](https://github.com/wallarm/docker-wallarm-node/blob/stable/4.10/conf/nginx_templates/default.conf.tmpl#L32).
            * `/etc/nginx/conf.d` — الإعدادات الشائعة
            * `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
            * `/opt/wallarm/usr/share/nginx/html` — الملفات الثابتة

            إذا لزم الأمر، يمكنك تركيب أي ملفات على دلائل الحاوية المذكورة. يجب وصف توجيهات عقدة التصفية في ملف `/etc/nginx/sites-enabled/default`.

الأمر يقوم بما يلي:

* يركب الملف `default` داخل دليل الحاوية `/etc/nginx/sites-enabled`.
* ينشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى Wallarm Cloud في دليل الحاوية `/opt/wallarm/etc/wallarm`:
    * `node.yaml` بمعرف عقدة التصفية UUID ومفتاح السر
    * `private.key` بمفتاح Wallarm الخاص
* يحمي المورد `http://example.com`.

## تكوين السجلات

تم تمكين السجلات بشكل افتراضي. دلائل السجلات هي:

* `/var/log/nginx` — سجلات NGINX
* `/opt/wallarm/var/log/wallarm` — [سجلات عقدة Wallarm][logging-instr]

## تكوين المراقبة

لمراقبة عقدة التصفية، هناك سكربتات متوافقة مع Nagios داخل الحاوية. انظر التفاصيل في [مراقبة عقدة التصفية][doc-monitoring].

مثال على تشغيل السكربتات:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` هو معرف حاوية دوكر Wallarm الجاري تشغيلها. للحصول على المعرف، قم بتشغيل `docker ps` وانسخ المعرف المناسب.

## اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## تكوين حالات الاستخدام

يجب أن يصف ملف الإعداد المركب على حاوية دوكر تكوين عقدة التصفية في [التوجيهات المتاحة][nginx-directives-docs]. فيما يلي بعض خيارات تكوين عقدة التصفية الشائعة الاستخدام:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"