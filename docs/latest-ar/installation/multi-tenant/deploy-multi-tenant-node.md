[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# تجهيز العقدة متعددة المستأجرين وتكوينها

تحمي [العقدة متعددة المستأجرين](overview.md) عدة بنى تحتية مستقلة للشركات أو بيئات معزولة في وقت واحد.

## خيارات تجهيز العقدة متعددة المستأجرين

اختر خيارات تجهيز العقدة متعددة المستأجرين بحسب البنية التحتية الخاصة بك والمشكلة المستهدفة:

* قم بتجهيز عقدة Wallarm واحدة لتصفية حركة مرور جميع العملاء أو البيئات المعزولة كما يلي:

    ![مخطط العقدة الشريكة](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * تعالج عقدة Wallarm الواحدة حركة مرور عدة مستأجرين (المستأجر 1، المستأجر 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * تحدد عقدة Wallarm المستأجر الذي يتلقى حركة المرور عن طريق المعرّف الفريد للمستأجر ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) أو [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node) في تثبيت Envoy).
    * بالنسبة للنطاقات `https://tenant1.com` و `https://tenant2.com`، يتم تكوين السجلات، النطاق A، بعناوين IP الشريك أو العميل `225.130.128.241`. يظهر هذا الإعداد كمثال، يمكن استخدام إعداد مختلف على جانب الشريك والمستأجر.
    * على جانب الشريك، يتم تكوين توجيه الطلبات الشرعية إلى عناوين المستأجر Tenant 1 (`http://upstream1:8080`) وTenant 2 (`http://upstream2:8080`). يظهر هذا الإعداد كمثال، يمكن استخدام إعداد مختلف على جانب الشريك والمستأجر.

    !!! تحذير "إذا كانت عقدة Wallarm من نوع CDN"
        حيث أنه لا يتم دعم تكوين `wallarm_application` بواسطة [عقدة Wallarm CDN](../cdn-node.md)، فإن خيار التجهيز هذا لا يتم دعمه أيضًا بواسطة نوع العقدة CDN. إذا كان نوع العقدة المستخدم هو CDN، يرجى تجهيز عدة عقد تصفي كل واحدة منها حركة مرور مستأجر محدد.

* قم بتجهيز عدة عقد Wallarm كل واحدة منها تصفي حركة مرور مستأجر محدد كما يلي:

    ![مخطط عقد العميل العديدة](../../images/partner-waf-node/client-several-nodes.png)

    * عقد Wallarm عديدة كل واحدة منها تصفي حركة مرور مستأجر معين (المستأجر 1، المستأجر 2).
    * بالنسبة للنطاق https://tenant1.com، يتم تكوين السجل النطاق مع عنوان IP العميل 225.130.128.241.
    * بالنسبة للنطاق https://tenant2.com، يتم تكوين السجل النطاق مع عنوان IP العميل 225.130.128.242.
    * يقوم كل عقدة بتوجيه الطلبات الشرعية إلى عوانين المستأجر الخاص بها:
        * العقدة 1 إلى المستأجر 1 (http://upstream1:8080).
        * العقدة 2 إلى المستأجر 2 (http://upstream2:8080).

## خصائص العقدة متعددة المستأجرين

العقدة متعددة المستأجرين:

* يمكن تثبيتها على نفس [المنصات](../../installation/supported-deployment-options.md) ووفقًا لنفس التعليمات كالعقدة الفلترة العادية.
* يمكن تثبيتها على مستوى **المستأجر التقني** أو **المستأجر**. إذا كنت ترغب في تزويد المستأجر بالوصول إلى واجهة Wallarm Console، يجب تثبيت العقدة الفلترة على مستوى المستأجر المناسب.
* يمكن تكوينها وفقًا لنفس التعليمات كالعقدة الفلترة العادية.
* يتم استخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) لتقسيم حركة المرور بواسطة المستأجرين.
* يتم استخدام التوجيه [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) لتقسيم الإعدادات بواسطة التطبيقات.

## متطلبات التجهيز

* [حسابات المستأجر المكونة](configure-accounts.md)
* تنفيذ الأوامر الأخرى بواسطة المستخدم ذي دور **المدير العام** المضاف تحت [حساب المستأجر التقني](configure-accounts.md#tenant-account-structure)
* [المنصة المدعومة لتثبيت العقدة الفلترة](../../installation/supported-deployment-options.md)

## التوصيات لتجهيز عقدة متعددة المستأجرين

* إذا كان مطلوبًا للمستأجر الوصول إلى واجهة Wallarm Console، أنشئ عقدة فلترة ضمن حساب المستأجر المناسب.
* قم بتكوين العقدة الفلترة عبر ملف تكوين NGINX للمستأجر.

## الإجراء لتجهيز عقدة متعددة المستأجرين

1. في واجهة Wallarm Console → **العُقد**، اضغط على **إنشاء عقدة** وحدد **عقدة Wallarm**.

    !!! معلومات "التبديل بين عقدة Wallarm موجودة ووضع متعدد المستأجرين"
        إذا كنت تريد التبديل بين عقدة Wallarm موجودة ووضع متعدد المستأجرين، استخدم الخيار **جعلها متعددة المستأجرين** من القائمة المطلوبة للعقدة في القسم **العقد**.

        بمجرد التبديل والتأكيد، انتقل إلى الخطوة الرابعة.
1. حدد الخيار **العقدة متعددة المستأجرين**.

    ![إنشاء عقدة متعددة المستأجرين](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. اضبط اسم العقدة واضغط على **إنشاء**.
1. انسخ الرمز المميز للعقدة الفلترة.
1. اعتمادًا على نموذج تجهيز العقدة الفلترة، قم بإجراء الخطوات من [التعليمات المناسبة](../../installation/supported-deployment-options.md).
1. قم بتقسيم حركة المرور بين المستأجرين باستخدام معرفاتهم الفريدة.

    === "NGINX و NGINX Plus"
        افتح ملف تكوين NGINX للمستأجر وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). انظر الأمثلة أدناه.
    === "NGINX Ingress Controller"
        استخدم [التعليقات التوضيحية لـ Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` لتعيين UUID للمستأجر لكل مورد Ingress. يتعلق المورد الواحد بالمستأجر الواحد:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "صورة Docker قائمة على NGINX"
        1. افتح ملف التهيئة لـ NGINX وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). انظر الأمثلة أدناه.
        1. قم بتشغيل الحاوية المستندة إلى Docker [بتحميل ملف التكوين](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "صورة Docker قائمة على Envoy"
        1. افتح ملف التكوين `envoy.yaml` وقم بتقسيم حركة المرور بين المستأجرين باستخدام العامل [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param).
        1. قم بتشغيل الحاوية المستندة إلى Docker [والتي تحمل `envoy.yaml` المعدّ مسبقًا](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml).
    === "البروكسي الجانبي لـ Kubernetes"
        1. افتح ملف التكوين NGINX وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
        1. قم بتحميل ملف التكوين NGINX إلى [العبوة الجانبية لـ Wallarm](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration).

    مثال على ملف تكوين NGINX للعقدة الفلترة التي تعالج حركة مرور عميلين:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * على جانب المستأجر، يتم تكوين السجلات النطاق A بعنوان IP الشريك
    * على جانب الشريك، يُكوِّن توجيه الطلبات إلى عناوين المستأجرين (`http://upstream1:8080` للمستأجر بـ `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` و `http://upstream2:8080` للمستأجر بـ `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`)
    * يتم معالجة جميع الطلبات الواردة على عنوان الشريك، ويتم توجيه الطلبات الشرعية إلى `http://upstream1:8080` للمستأجر بـ `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` وإلى `http://upstream2:8080` للمستأجر بـ `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

1. إذا لزم الأمر، حدد معرفات التطبيقات للمستأجر باستخدام التوجيه [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application).

    مثال:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }

        location /login {
            wallarm_application 21;
            ...
        }
        location /users {
            wallarm_application 22;
            ...
        }
    }
    ```

    ينتمي تطبيقان إلى المستأجر `11111111-1111-1111-1111-111111111111`:
    
    * `tenant1.com/login` هو التطبيق `21`
    * `tenant1.com/users` هو التطبيق `22`

## تكوين عقدة متعددة المستأجرين

لتخصيص إعدادات العقدة الفلترة، استخدم [التوجيهات المتاحة](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
