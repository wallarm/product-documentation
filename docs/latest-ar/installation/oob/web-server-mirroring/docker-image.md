[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
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
[api-policy-enf-docs]:              ../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../admin-en/uat-checklist-en.md

# تجهيز Wallarm OOB من الصورة المستخدمة Docker

تقدم هذه المقالة تعليمات حول تجهيز [Wallarm OOB](overview.md) بالاستفادة من الصورة المستخدمة [NGINX-based Docker](https://hub.docker.com/r/wallarm/node). التحليل الوارد هنا صمم لتحليل حركة المرور المتكررة التي يوفرها الويب الخادم الأولي أو الخادم الوكيل.

## سيناريوهات الاستخدام

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## 1. تكوين تكرار حركة المرور

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 2. إعداد ملف تكوين لتحليل حركة المرور المكررة وأكثر

لتمكين عقدات Wallarm من تحليل حركة المرور المتكررة، يجب عليك تكوين الإعدادات الإضافية في ملف منفصل وتوصيله بحاوية Docker. الملف التكوين الافتراضي الذي يحتاج إلى تعديل موجود في `/etc/nginx/sites-enabled/default` ضمن الصورة المستخدمة Docker.

في هذا الملف، يجب عليك تحديد تكوين عقدة Wallarm لمعالجة حركة المرور المتكررة وأي إعدادات أخرى مطلوبة. اتبع هذه التعليمات للقيام بذلك:

1. قم بإنشاء ملف التكوين NGINX المحلي المسمى `default` بالمحتوى التالي:

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
            # Change 222.222.222.22 to the address of the mirroring server
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

    * توجب وجود التوجيهات `set_real_ip_from` و `real_ip_header` لتعريض عناوين IP للمهاجمين في منصة [Wallarm Console][proxy-balancer-instr].
    * يتطلب توجيه `wallarm_force_response_*` تعطيل تحليل كل الطلبات باستثاء النسخ المتلقاة من حركة المرور المتكررة.
    * التوجيه `wallarm_mode` هو [وضع[a][waf-mode-instr] تحليل حركة المرور. منذ أن الطلبات الخبيثة لا يمكن[a][oob-advantages-limitations] حظرها, الوضع الوحيد الذي يقبله Wallarm هو المراقبة. لتجهيزها بشكل خطي, أيضاً هناك أوضاع آمنة للحظر ووضع حظر ولكن حتى ان قمت بتحديد التوجيه `wallarm_mode` لقيمة مختلفة عن المراقبة, سوف يستمر العقد في مراقبة حركة المرور وتسجيل فقط حركة   
 المرور الخبيثة (باستثناء الوضع المحدد للإيقاف).
1. حدد أي توجيهات Wallarm مطلوبة أخرى. يمكنك الرجوع لتوثيق [معلمات تكوين Wallarm](../../../admin-en/configure-parameters-en.md) و [استخدام السيناريوهات](#configuring-the-use-cases) لفهم أي إعدادات قد تكون مفيدة لك.
1. إذا كان ذلك ضرورياً، قم بتعديل إعدادات NGINX الأخرى لتخصيص سلوكها. استشر [توثيق NGINX](https://nginx.org/en/docs/beginners_guide.html) للمساعدة.

يمكنك أيضاً توصيل الملفات الأخرى إلى الدلائل الاستعدادية التالية للحاوية إذا تطلب الأمر:

* `/etc/nginx/conf.d` — الإعدادات المشتركة
* `/etc/nginx/sites-enabled` — إعدادات المضيف الافتراضي 
* `/opt/wallarm/usr/share/nginx/html` — الملفات الثابتة

## 3. احصل على رمز لتوصيل العقدة بالسحابة

احصل على رمز Wallarm من ال[نوع المناسب][wallarm-token-types]:

=== "رمز ال API"

    1. افتح  واجهة Wallarm → **الإعدادات** → ** رموز ال API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور مصدر `Deploy`.
    1. انسخ هذا الرمز.

=== "رمز العقدة"

    1. افتح واجهة Wallarm → **العقدات** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. قم بإحدى التالي: 
        * أنشئ عقدة من نوع **Wallarm node** وانسخ الرمز الناتج.
        * استخدم مجموعة العقدة الحالية - انسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.

## 4. تشغيل حاوية Docker مع العقدة

تشغيل حاوية Docker مع العقدة [mounting](https://docs.docker.com/storage/volumes/) الملف التكوين الذي أنشأته للتو.

=== "السحابة الأمريكية"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.4-1
    ```
=== "السحابة الأوروبية"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.10.4-1
    ```

ينبغي تمرير المتغيرات البيئية التالية للحاوية:

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## تكوين السجل

السجل مفعل بشكل افتراضي. الدلائل السجلية هي:

* `/var/log/nginx` — سجلات NGINX
* `/opt/wallarm/var/log/wallarm` — [سجلات عقدة Wallarm][logging-instr]

## تكوين سيناريو الاستخدام

يجب أن يصف الملف التكوين الذي يمت للحاوية Docker توصيف عقدة التصفية في [التوجيهات المتاحة](../../../admin-en/configure-parameters-en.md). فيما يلي بعض الخيارات المشتركة لتوصيف عقدة التصفية:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"
