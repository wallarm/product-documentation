[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Mulesoft مع سياسة Wallarm

[MuleSoft] (https://www.mulesoft.com/) هي منصة تكامل تتيح التواصل المتكامل وتكامل البيانات بين الخدمات مع بوابة API تعمل كنقطة دخول للتطبيقات العميلة للوصول إلى الواجهات البرمجية. باستخدام Wallarm، يمكنك تأمين الواجهات البرمجية (APIs) على منصة Mulesoft Anypoint باستخدام سياسة Wallarm. هذه المقالة تشرح كيفية إرفاق السياسة واستخدامها.

تدعم سياسة Wallarm لـ MuleSoft كلاً من الحالتين [in-line](../inline/overview.md) و [out-of-band](../oob/overview.md). الرسوم البيانية أدناه توضح تدفق المرور للواجهات البرمجية (APIs) على منصة MuleSoft Anypoint مع تطبيق سياسة Wallarm.

=== "تدفق المرور بشكل متصل"

    إذا تم تكوين Wallarm لمنع النشاط الخبيث:

    ![Mulesoft مع سياسة Wallarm](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)
=== "تدفق المرور خارج الأشرطة"
    ![Mulesoft مع سياسة Wallarm](../../images/waf-installation/gateways/mulesoft/traffic-flow-oob.png)

الحل يتضمن إطلاق العقدة Wallarm خارجيًا وحقن الشفرة البرمجية الخاصة أو السياسات في النظام الأساسي المحدد. هذا يتيح توجيه حركة المرور إلى العقدة الخارجية Wallarm للتحليل والحماية ضد التهديدات المحتملة. يشار إلى هذا الأسلوب باسم موصلات Wallarm، حيث يعملون كرابط أساسي بين الأنظمة الأساسية مثل Azion Edge و Akamai Edge و Mulesoft و Apigee و AWS Lambda، والعقدة الخارجية Wallarm. تضمن هذه الطريقة التكامل السلس، وتحليل حركة المرور الآمن، وتقليل المخاطر، والأمان الشامل للمنصة.

## الاستخدامات المقترحة

من بين جميع خيارات نشر Wallarm المعتمدة (../supported-deployment-options.md)، يُنصح بهذا الحل للحالات الاستخدام التالية:

* تأمين الواجهات البرمجية (APIs) المنشورة على منصة MuleSoft Anypoint بسياسة واحدة فقط.
* في حالة الحاجة إلى حل الأمان الذي يقدم مراقبة الهجمات الشاملة، والتقارير، والحظر الفوري للطلبات الخبيثة (في الوضع المتصل).

## القيود

لا تسمح الدمج مع MuleSoft للعقدة Wallarm بتحليل الردود بالكامل، الأمر الذي يخلق بعض القيود:

* في بعض البيئات، قد يُنشئ [اكتشاف Wallarm API](../../api-discovery/overview.md) نقاط نهاية إضافية. استشر [دعم Wallarm](mailto:support@wallarm.com) لخيارات التكوين.
* يتطلب الردود من الخادم لـ [اكتشاف الضعف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection).
* [الحماية من التصفح المفروض](../../admin-en/configuration-guides/protecting-against-bruteforce.md).

عند تطبيق سياسة لتحليل حركة المرور خارج النطاق، على العلم بأن هذه الطريقة لها قيود معينة، يتم تطبيقها أيضا على سياسة. يمكن العثور على المزيد من التفاصيل في الرابط المقدم (../oob/overview.md#advantages-and-limitations).

## المتطلبات

للمتابعة مع التنفيذ، تأكد من تلبية المتطلبات التالية:

* فهم منصة Mulesoft.
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 أو إصدار أقدم مثبت. قد تواجه الإصدارات الأعلى من Maven مشكلات التوافق مع البرنامج المساعد Mule.
* لقد تم تعيينك بدور مساهم Mulesoft Exchange، مما يتيح لك تحميل القطع الفنية إلى حساب منظمتك في منصة Mulesoft Anypoint.
* تم تحديد [بيانات اعتماد Mulesoft Exchange (اسم المستخدم وكلمة المرور)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) في الملف `<MAVEN_DIRECTORY>/conf/settings.xml`.
* التطبيق والواجهة البرمجية (API) مرتبطين ويعملان على Mulesoft.

## التنفيذ

لتأمين الواجهات البرمجية (APIs) على منصة Mulesoft Anypoint باستخدام سياسة Wallarm، اتبع هذه الخطوات:

1. قم بتطبيق عقدة Wallarm باستخدام واحدة من خيارات التنفيذ المتوفرة.
1. الحصول على سياسة Wallarm وتحميلها إلى Mulesoft Exchange.
1. اعتمد سياسة Wallarm على الواجهة البرمجية (API) الخاصة بك.

### 1. تطبيق عقدة Wallarm

1. اختر أحد حلول تطبيق العقدة Wallarm المدعومة أو القطع الفنية لـ [تطبيق العقدة](../supported-deployment-options.md#in-line) واتبع التعليمات التي تم توفيرها.
1. قم بتكوين العقدة المنفذة باستخدام النموذج التالي:

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name yourdomain-for-wallarm-node.tld;

        ### SSL configuration here

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }


    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    يرجى التأكد من الانتباه للتكوينات التالية:

    * شهادات TLS/SSL لحركة المرور HTTPS: لتمكين العقدة Wallarm من التعامل مع حركة المرور HTTPS الآمنة، قم بتهيئة شهادات TLS/SSL وفقا لذلك. ستعتمد التكوينات المحددة على طريقة التنفيذ المختارة. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الرجوع إلى [مقالته](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على التوجيه.
    * [تهيئة وضع التشغيل Wallarm](../../admin-en/configure-wallarm-mode.md).
    
        عند استخدام تحليل حركة المرور خارج النطاق، يمكن لـ Wallarm أن تعمل فقط في وضع المراقبة لأنها لا تستطيع حظر الطلبات الخبيثة. بغض النظر عن إعداد التوجيه `wallarm_mode`، باستثناء `off`، ستستمر العقدة في مراقبة وتسجيل الحركة المرور الخبيثة فقط.

1. بمجرد اكتمال التنفيذ، اقم بملاحظة IP العقدة لأنك ستحتاجه لاحقًا لتعيين عنوان للطلبات الواردة.

### 2. الحصول على سياسة Wallarm ورفعها إلى Mulesoft Exchange

للحصول على سياسة Wallarm و[رفعها](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) إلى Mulesoft Exchange، قم باتباع الخطوات التالية:

1. تواصل مع [support@wallarm.com](mailto:support@wallarm.com) للحصول على سياسة Wallarm الخاصة بـ Mulesoft.
1. استخرج أرشيف السياسة بمجرد تلقيه.
1. انتقل إلى دليل السياسة:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. في ملف `pom.xml` → من-> `معلمة groupId` في أعلى الملف، حدد معرف الجماعة التجارية Mulesoft الخاصة بك.

    يمكنك العثور على معرف المنظمة عن طريق التنقل إلى Mulesoft Anypoint Platform → **Access Management** → **Business Groups** → اختر منظمتك → نسخ معرفها.
1. في دليل Maven `.m2` الخاص بك، قم بتحديث ملف `settings.xml` ببيانات اعتمادك لـ Exchange:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <servers>
        <server>
          <id>exchange-server</id>
          <username>myusername</username>
          <password>mypassword</password>
        </server>
      </servers>
    </settings>
    ```
1. قم بتطبيق السياسة على Mulesoft باستخدام الأمر التالي:

    ```
    mvn clean deploy
    ```

سياستك الخاصة متاحة الآن في بورصة منصة Mulesoft Anypoint الخاصة بك.

![عقدة Mulesoft مع Wallarm](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. اعتماد سياسة Wallarm على الواجهة البرمجية (API)

يمكنك اعتماد سياسة Wallarm على جميع الواجهات البرمجية (APIs) أو الواجهة البرمجية الفردية.

#### اعتماد السياسة على جميع الواجهات البرمجية (APIs)

لتطبيق سياسة Wallarm على جميع الواجهات البرمجية (APIs) باستخدام [خيار سياسة Mulesoft المؤتمتة](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying)، اتبع الخطوات التالية:

1. في منصة Anypoint الخاصة بك، انتقل إلى **API Manager** → **Automated Policies**.
1. انقر على **Add automated policy** ثم حدد سياسة Wallarm من Exchange.
1. حدد `WLRM REPORTING ENDPOINT` والذي هو عنوان IP على [نموذج العقدة Wallarm](#1-deploy-a-wallarm-node) بما في ذلك `http://` أو `https://`.
1. عند الحاجة، قم بتعديل الوقت الأقصى المسموح به لـ Wallarm للتعامل مع طلب واحد عن طريق تغيير قيمة `WALLARM NODE REQUEST TIMEOUT`.
1. طبق السياسة.

![سياسة Wallarm](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### اعتماد السياسة على واجهة برمجية فردية

لتأمين واجهة برمجية فردية باستخدام سياسة Wallarm، اتبع الخطوات التالية:

1. في منصة Anypoint الخاصة بك، انتقل إلى **API Manager** واختر الواجهة البرمجية المطلوبة.
1. نقل إلى **Policies** → **Add policy** واختر سياسة Wallarm.
1. حدد `WLRM REPORTING ENDPOINT` والذي هو عنوان IP على [نموذج العقدة Wallarm](#1-deploy-a-wallarm-node) بما في ذلك `http://` أو `https://`.
1. عند الحاجة، قم بتعديل الوقت الأقصى المسموح به لـ Wallarm للتعامل مع طلب واحد عن طريق تغيير قيمة `WALLARM NODE REQUEST TIMEOUT`.
1. طبق السياسة.

![سياسة Wallarm](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## الاختبار

لاختبار وظائف السياسة المنفذة، اتبع الخطوات التالية:

1. أرسل الطلب مع الاختبار [هجوم التنقل لاختبار المسار](ptrav-attack-docs) إلى الواجهة البرمجية (API) الخاصة بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح واجهة Wallarm → القسم **Attacks** في [US Cloud](https://us1.my.wallarm.com/attacks) أو [EU Cloud](https://my.wallarm.com/attacks) وتأكد من أن الهجوم يظهر في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا كان وضع العقدة Wallarm مضبوطًا على الحظر وتدفق حركة المرور في الطريق المتصل، سيتم حظر الطلب أيضًا.

إذا لم يقم الحل بالأداء المتوقع، راجع سجلات الواجهة البرمجية الخاصة بك عبر الذهاب إلى Mulesoft Anypoint Platform → **Runtime Manager** → التطبيق الخاص بك → **Logs**.

يمكنك أيضًا التحقق من تطبيق السياسة على الواجهة البرمجية (API) من خلال التنقل إلى الواجهة البرمجية (API) الخاصة بك في **API Manager** ومراجعة السياسات المطبقة على علامة التبويب **Policies**. للسياسات المؤتمتة، يمكنك استخدام خيار **See covered APIs** لمشاهدة الواجهات البرمجية (APIs) المغطاة وأسباب أي استبعادات.

## التحديث وإلغاء التثبيت

لتحديث سياسة Wallarm المنفذة، اتبع الخطوات التالية:

1. قم بإزالة سياسة Wallarm المنفذة حاليًا باستخدام خيار **Remove policy** في إما القائمة السياسة المؤتمتة أو في قائمة السياسات المطبقة على واجهة برمجية فردية.
1. أضف السياسة الجديدة متبعًا الخطوات 2-3 أعلاه.
1. أعد تشغيل التطبيقات المرتبطة في **Runtime Manager** لتطبيق السياسة الجديدة.

لإلغاء تثبيت السياسة، قم فقط بتنفيذ الخطوة الأولى من عملية التحديث.

## الحاجة لمساعدة؟

إذا واجهت أي مشكلات أو بحاجة إلى مساعدة في عملية التنفيذ الموصوفة لسياسة Wallarm بالتعاون مع MuleSoft، يمكنك الاتصال بفريق [دعم Wallarm](mailto:support@wallarm.com). فهم متاحون لتقديم الإرشادات ومساعدتك في حل أي مشاكل قد تواجهك خلال عملية التطبيق.