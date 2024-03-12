[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# نشر وتكوين عقد متعددة العملاء

العقدة [متعددة العملاء](overview.md) تحمي عدة بنيات تحتية لشركات مستقلة أو بيئات معزولة في نفس الوقت.

## خيارات نشر العقدة متعددة العملاء

اختر خيار نشر العقدة متعددة العملاء بناءً على بنيتك التحتية والمشكلة المعالجة:

* نشر عقدة Wallarm واحدة لتصفية حركة المرور لجميع العملاء أو البيئات المعزولة كما يلي:

    ![مخطط العقدة الشريكة](../../images/partner-waf-node/partner-traffic-processing-4.0.png)

    * عقدة Wallarm واحدة تعالج حركة المرور لعدة مستأجرين (المستأجر 1، المستأجر 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * تحدد عقدة Wallarm المستأجر الذي يتلقى حركة المرور بواسطة معرف المستأجر الفريد ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) أو [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node) في تثبيت Envoy).
    * للنطاقات `https://tenant1.com` و `https://tenant2.com`، يتم تكوين سجلات DNS A مع عنوان IP الشريك أو العميل `225.130.128.241`. هذا الإعداد معروض كمثال، يمكن استخدام إعداد مختلف على جانب الشريك والمستأجر.
    * على جانب الشريك، يتم تكوين توجيه الطلبات المشروعة إلى عناوين المستأجرين المستأجر 1 (`http://upstream1:8080`) والمستأجر 2 (`http://upstream2:8080`). هذا الإعداد معروض كمثال، يمكن استخدام إعداد مختلف على جانب الشريك والمستأجر.

    !!! تحذير "إذا كانت عقدة Wallarm من نوع CDN"
        نظرًا لأن إعداد `wallarm_application` غير مدعوم بواسطة [عقدة Wallarm CDN](../cdn-node.md)، لا يدعم هذا الخيار من خيارات النشر نوع العقدة CDN أيضًا. إذا كان النوع المستخدم هو CDN، يرجى نشر عدة عقد كل منها يصفي حركة المرور لمستأجر معين.

* نشر عدة عقد Wallarm كل منها تصفي حركة المرور لمستأجر معين كما يلي:

    ![مخطط عدة عقد للعملاء](../../images/partner-waf-node/client-several-nodes.png)

    * عدة عقد Wallarm كل منها تصفي حركة المرور لمستأجر معين (المستأجر 1، المستأجر 2).
    * للنطاق https://tenant1.com، يتم تكوين السجل ال DNS مع عنوان IP للعميل 225.130.128.241.
    * للنطاق https://tenant2.com، يتم تكوين السجل ال DNS مع عنوان IP للعميل 225.130.128.242.
    * كل عقدة توجه الطلبات المشروعة إلى عناوين مستأجرها:
        * العقدة 1 إلى المستأجر 1 (`http://upstream1:8080`).
        * العقدة 2 إلى المستأجر 2 (`http://upstream2:8080`).

## خصائص العقدة متعددة العملاء

العقدة متعددة العملاء:

* يمكن تثبيتها على نفس [المنصات](../../installation/supported-deployment-options.md) ووفقًا لنفس التعليمات كعقدة تصفية عادية.
* يمكن تثبيتها على مستوى **المستأجر التقني** أو **المستأجر**. إذا كنت ترغب في منح المستأجر الوصول إلى وحدة التحكم Wallarm، يجب تثبيت العقدة التصفية على مستوى المستأجر المناسب.
* يمكن تكوينها وفقًا لنفس التعليمات كعقدة تصفية عادية.
* يتم استخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) لتقسيم حركة المرور حسب المستأجرين.
* يتم استخدام التوجيه [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) لتقسيم الإعدادات حسب التطبيقات.

## متطلبات النشر

* [حسابات المستأجرين المكونة](configure-accounts.md)
* تنفيذ الأوامر التالية من قبل المستخدم بدور **المسؤول العالمي** المضاف تحت [حساب المستأجر التقني](configure-accounts.md#tenant-account-structure)
* [منصة مدعومة لتثبيت عقدة التصفية](../../installation/supported-deployment-options.md)

## توصيات لنشر العقدة متعددة العملاء

* إذا كان مطلوبًا للمستأجر الوصول إلى وحدة تحكم Wallarm، قم بإنشاء العقدة التصفية ضمن حساب المستأجر المناسب.
* قم بتكوين العقدة التصفية عبر ملف تكوين NGINX الخاص بالمستأجر.

## إجراء لنشر العقدة متعددة العملاء

1. في وحدة التحكم Wallarm → **العقد**، انقر على **إنشاء عقدة** واختر **عقدة Wallarm**.

    !!! معلومات "تحويل عقدة Wallarm موجودة إلى وضع متعدد العملاء"
        إذا كنت ترغب في تحويل عقدة Wallarm موجودة إلى وضع متعدد العملاء، استخدم خيار **جعلها متعددة العملاء** من قائمة العقدة المطلوبة في قسم **العقد**.

        بمجرد التحويل والتأكيد، تابع إلى الخطوة الرابعة.
1. حدد خيار **العقدة متعددة العملاء**.

    ![إنشاء عقدة متعددة العملاء](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. اضبط اسم العقدة وانقر على **إنشاء**.
1. انسخ رمز العقدة التصفية.
1. بناءً على شكل نشر العقدة التصفية، نفذ الخطوات من [التعليمات المناسبة](../../installation/supported-deployment-options.md).
1. قم بتقسيم حركة المرور بين المستأجرين باستخدام معرفاتهم الفريدة.

    === "NGINX و NGINX Plus"
        افتح ملف تكوين NGINX الخاص بالمستأجر وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). راجع المثال أدناه.
    === "متحكم Ingress NGINX"
        استخدم [تعليقات](../../admin-en/configure-kubernetes-en.md#ingress-annotations) Ingress `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` لتعيين معرف UUID لكل مستأجر لكل مورد Ingress. كل مورد مرتبط بمستأجر واحد:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "صورة Docker NGINX‑based"
        1. افتح ملف تكوين NGINX وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). راجع المثال أدناه.
        1. قم بتشغيل حاوية docker [التركيب ملف التكوين](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "صورة Docker Envoy‑based"
        1. افتح ملف تكوين `envoy.yaml` وقم بتقسيم حركة المرور بين المستأجرين باستخدام البارامتر [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param).
        1. قم بتشغيل حاوية docker [التركيب `envoy.yaml`] المعدة(../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml).
    === "Kubernetes Sidecar"
        1. افتح ملف تكوين NGINX وقم بتقسيم حركة المرور بين المستأجرين باستخدام التوجيه [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
        1. قم بتركيب ملف تكوين NGINX إلى [حاوية Wallarm sidecar](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration).

    مثال على ملف تكوين NGINX للعقدة التصفية التي تعالج حركة المرور لعميلين:

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

    * على جانب المستأجر، يتم تكوين سجلات DNS A مع عنوان IP الشريك
    * على جانب الشريك، يتم تكوين توجيه الطلبات إلى عناوين المستأجرين (`http://upstream1:8080` للمستأجر ب `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` و `http://upstream2:8080` للمستأجر ب `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`)
    * يتم معالجة جميع الطلبات الواردة على عنوان الشريك، يتم توجيه الطلبات المشروعة إلى `http://upstream1:8080` للمستأجر ب `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` وإلى `http://upstream2:8080` للمستأجر ب `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

1. إذا لزم الأمر، حدد معرفات تطبيقات المستأجر باستخدام التوجيه [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application).

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

    تطبيقان ينتميان إلى المستأجر `11111111-1111-1111-1111-111111111111`:
    
    * `tenant1.com/login` هو التطبيق `21`
    * `tenant1.com/users` هو التطبيق `22`

## تكوين العقدة متعددة العملاء

لتخصيص إعدادات العقدة التصفية، استخدم [التوجيهات المتاحة](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"