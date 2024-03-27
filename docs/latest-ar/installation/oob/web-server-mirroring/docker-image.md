[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[aws-ecs-docs]:                     ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../cloud-platforms/alibaba-cloud/docker-container.md
[api-policy-enf-docs]:              ../../../api-policy-enforcement/overview.md

# نشر Wallarm OOB من صورة Docker

يوفر هذا المقال تعليمات لنشر [Wallarm OOB](overview.md) باستخدام [صورة Docker المبنية على NGINX](https://hub.docker.com/r/wallarm/node). الحل الموصوف هنا مصمم لتحليل حركة المرور المعكوسة بواسطة خادم الويب أو البروكسي.

## حالات الاستخدام

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## متطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## 1. تكوين عكس حركة المرور

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 2. إعداد ملف التكوين لتحليل حركة المرور المعكوسة والمزيد

لتمكين عقد Wallarm من تحليل حركة المرور المعكوسة، تحتاج إلى تكوين إعدادات إضافية في ملف منفصل وتحميله على الحاوية Docker. ملف التكوين الافتراضي الذي يحتاج إلى تعديل يقع في `/etc/nginx/sites-enabled/default` داخل صورة Docker.

في هذا الملف، تحتاج إلى تحديد تكوين عقدة Wallarm لمعالجة حركة المرور المعكوسة وأي إعدادات أخرى مطلوبة. اتبع هذه التعليمات للقيام بذلك:

1. قم بإنشاء ملف تكوين NGINX المحلي باسم `default` بالمحتويات التالية:

    ```
    server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;
            #listen 443 ssl;

            server_name localhost;

            #ssl_certificate cert.pem;
            #ssl_certificate_key cert.key;

            root /usr/share/nginx/html;

            index index.html index.htm;

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # قم بتغيير 222.222.222.22 إلى عنوان خادم المعكس
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
            real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;

            wallarm_mode monitoring;

            location / {
                    
                    proxy_pass http://example.com;
                    include proxy_params;
            }
    }
    ```

    * تتطلب التوجيهات `set_real_ip_from` و `real_ip_header` لعرض [عناوين IP للمهاجمين][proxy-balancer-instr] في لوحة تحكم Wallarm.
    * تتطلب التوجيهات `wallarm_force_response_*` لتعطيل تحليل كل الطلبات ما عدا النسخ المستلمة من حركة المرور المعكوسة.
    * التوجيه `wallarm_mode` هو [وضع][waf-mode-instr] تحليل حركة المرور. نظرًا لأنه لا يمكن [حجب][oob-advantages-limitations] الطلبات الضارة، الوضع الوحيد المقبول من Wallarm هو الرصد. بالنسبة للنشر في الخط، هناك أوضاع حجب آمنة وحجب أيضًا، ولكن حتى إذا قمت بتعيين التوجيه `wallarm_mode` إلى قيمة مختلفة عن الرصد، تستمر العقدة في مراقبة حركة المرور وتسجيل الحركة الضارة فقط (بصرف النظر عن الوضع المحدد للتعطيل).
1. حدد أي توجيهات Wallarm أخرى مطلوبة. يمكنك الرجوع إلى توثيق [معايير تكوين Wallarm](../../../admin-en/configure-parameters-en.md) و[حالات استخدام التكوين](#configuring-the-use-cases) لفهم الإعدادات التي قد تكون مفيدة لك.
1. إذا لزم الأمر، قم بتعديل إعدادات NGINX الأخرى لتخصيص سلوكه. استشر [توثيق NGINX](https://nginx.org/en/docs/beginners_guide.html) للحصول على مساعدة.

يمكنك أيضًا تحميل ملفات أخرى إلى الدلائل التالية للحاوية إذا لزم الأمر:

* `/etc/nginx/conf.d` — الإعدادات العامة
* `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي
* `/opt/wallarm/usr/share/nginx/html` — الملفات الثابتة

## 3. الحصول على رمز لربط العقدة بالسحاب

احصل على رمز Wallarm من [النوع المناسب][wallarm-token-types]:

=== "رمز API"

    1. افتح لوحة تحكم Wallarm → **الإعدادات** → **رموز API** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/settings/api-tokens).
    1. ابحث عن رمز API بدور المصدر `نشر` أو أنشئ واحدًا.
    1. انسخ هذا الرمز.

=== "رمز العقدة"

    1. افتح لوحة تحكم Wallarm → **العقد** في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/nodes) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/nodes).
    1. قم بإحدى الخطوات التالية: 
        * أنشئ عقدة من نوع **عقدة Wallarm** وانسخ الرمز الذي تم توليده.
        * استخدم مجموعة عقد موجودة - انسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.

## 4. تشغيل حاوية Docker مع العقدة

قم بتشغيل حاوية Docker مع العقدة [محمّلةً](https://docs.docker.com/storage/volumes/) بملف التكوين الذي قمت بإنشائه للتو.

=== "سحابة الولايات المتحدة"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.1-1
    ```
=== "سحابة الاتحاد الأوروبي"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.1-1
    ```

المتغيرات البيئية التالية يجب أن تُمرر إلى الحاوية:

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. تجريب عملية عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## تكوين السجلات

تم تفعيل السجلات بشكل افتراضي. دلائل السجلات هي:

* `/var/log/nginx` — سجلات NGINX
* `/opt/wallarm/var/log/wallarm` — [سجلات عقدة Wallarm][logging-instr]

## تكوين المراقبة

لمراقبة عقدة الفلترة، هناك سكريبتات متوافقة مع Nagios داخل الحاوية. انظر التفاصيل في [مراقبة عقدة الفلترة][doc-monitoring].

مثال على تشغيل السكريبتات:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` هو معرف حاوية Docker التي تعمل لعقدة Wallarm. للحصول على المعرف، قم بتشغيل `docker ps` وانسخ المعرف المناسب.

## تكوين حالات الاستخدام

يجب أن يصف ملف التكوين الذي تم تحميله على الحاوية Docker تكوين عقدة الفلترة في [التوجيهات المتاحة](../../../admin-en/configure-parameters-en.md). أدناه بعض خيارات تكوين عقدة الفلترة المستخدمة بشكل شائع:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"