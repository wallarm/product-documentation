[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Mulesoft مع واجهة النهج Wallarm

[MuleSoft](https://www.mulesoft.com/) هي منصة التكامل التي تتيح التوصيل السلس والتكامل البيانات بين الخدمات وبوابة API تعمل كنقطة الدخول لتطبيقات العملاء للوصول إلى واجهات برمجة التطبيقات. مع Wallarm ، يمكنك تأمين واجهات برمجة التطبيقات على منصة Mulesoft Anypoint باستخدام السياسة Wallarm. يشرح هذا المقال كيفية إرفاق واستخدام السياسة.

تدعم سياسة Wallarm لـ MuleSoft كلا من [in-line](../inline/overview.md) و [out-of-band](../oob/overview.md) الأوضاع. توضح الرسوم البيانية أدناه تدفق المرور لواجهات برمجة التطبيقات على منصة MuleSoft Anypoint مع تطبيق سياسة Wallarm.

=== "تدفق المرور في السطر"

    إذا تم تكوين Wallarm لحجب النشاط الخبيث:

    ![Mulesoft مع النهج Wallarm](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)
=== "تدفق المرور خارج الفرقة"
    ![Mulesoft مع النهج Wallarm](../../images/waf-installation/gateways/mulesoft/traffic-flow-oob.png)

الحل ينطوي على نشر عقدة Wallarm في الخارج وحقن رموز أو سياسات مخصصة في المنصة المحددة. يمكن توجيه هذا الحركة إلى العقدة الخارجية لـ Wallarm للتحليل والحماية من التهديدات المحتملة. يشار إليها بموصلات Wallarm ، فهي تعمل كالرابط الأساسي بين منصات مثل Azion Edge و Akamai Edge و Mulesoft ، Apigee ، و AWS Lambda ، والعقدة الخارجية لـ Wallarm. تضمن هذه المنهجية التكامل السلس ، وتحليل الحركة الآمنة ، وتقليل المخاطر ، وأمان المنصة الشامل.

## الاستخدام المقصود

بين جميع خيارات نشر Wallarm الداعمة [Wallarm deployment options](../supported-deployment-options.md) ، هذا الحل هو الأنسب للاستخدامات التالية:

* تأمين واجهات برمجة التطبيقات المنشورة على منصة MuleSoft Anypoint بواسطة سياسة واحدة فقط.
* يتطلب حل أمني يوفر مراقبة شاملة للهجوم ، والإبلاغ ، وحجب فوري للطلبات الخبيثة (في الوضع الخطي).

## القيود

التكامل MuleSoft لا يسمح لعقدة Wallarm بتحليل الردود بالكامل ، مما ينشئ بعض القيود:

* في بعض البيئات ، قد تولد [Wallarm API Discovery](../../api-discovery/overview.md) نقاط نهاية إضافية. استشر [Wallarm support](mailto:support@wallarm.com) لخيارات التكوين.
* الردود على الخادم مطلوبة لـ [passive vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md#passive-detection).
* [Protection against forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md).

عند تطبيق السياسة لتحليل حركة مرور خارج النطاق ، كن على علم أن هذه الطريقة لديها بعض القيود ، التي تنطبق أيضًا على النهج. يمكن العثور على المزيد من التفاصيل في الرابط المقدم [link](../oob/overview.md#advantages-and-limitations).

## المتطلبات

للمتابعة مع النشر ، تأكد من تلبية المتطلبات التالية:

* فهم منصة Mulesoft.
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 أو إصدار أقدم مثبت. قد تواجه الإصدارات الأعلى من Maven مشكلات التوافق مع البرنامج المساعد Mule.
* لقد تم تعيينك دور Mulesoft Exchange المساهم ، مما يتيح لك تحميل المصنوعات إلى حساب منظمتك على منصة Mulesoft Anypoint.
* تم تحديد [Mulesoft Exchange التفويضات (اسم المستخدم وكلمة المرور)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) في الملف `<MAVEN_DIRECTORY>/conf/settings.xml`.
* تطبيقك وAPI الخاص بك مرتبط ويعمل على Mulesoft.

## النشر

لتأمين واجهات برمجة التطبيقات على منصة Mulesoft Anypoint باستخدام السياسة Wallarm ، اتبع هذه الخطوات:

1. نشر عقدة Wallarm باستخدام واحدة من خيارات النشر المتاحة.
1. الحصول على النهج Wallarm وتحميله إلى Mulesoft Exchange.
1. أرفق النهج Wallarm بـ API الخاص بك.

### 1. نشر عقدة Wallarm

1. اختر واحدة من حلول نشر عقدة Wallarm المدعومة أو العناصر الفنية لـ [in-line deployment](../supported-deployment-options.md#in-line) واتبع التعليمات المقدمة للنشر.
1. تكوين العقدة المنشورة باستخدام القالب التالي:

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

    الرجاء التأكد من الانتباه إلى التكوينات التالية:

    * شهادات TLS / SSL لحركة مرور HTTPS: لتمكين العقدة Wallarm من التعامل مع حركة مرور HTTPS الآمنة ، قم بتكوين شهادات TLS / SSL وفقًا لذلك. سيعتمد التكوين الخاص على طريقة النشر المختارة. على سبيل المثال ، إذا كنت تستخدم NGINX ، يمكنك الرجوع إلى [its article](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على الإرشادات.
    * [Wallarm operation mode](../../admin-en/configure-wallarm-mode.md) التكوين.
    
        عند استخدام تحليل حركة مرور خارج الحزمة ، يمكن لـ Wallarm أن يعمل فقط في وضع المراقبة لأنه لا يمكنه حجب الطلبات الخبيثة. بغض النظر عن وضع ‘wallarm_mode’، ما عدا ‘off’، ستظل العقدة تراقب وتسجل فقط المرور الخبيث.

1. بمجرد اكتمال النشر ، قم بتدوين IP على العقدة كما ستحتاجه لاحقًا لتعيين العنوان لتوجيه الطلبات الواردة.

### 2. الحصول وتحميل النهج Wallarm إلى Mulesoft Exchange

للحصول على و [upload](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) النهج Wallarm إلى Mulesoft Exchange ، اتبع هذه الخطوات:

1. التواصل مع [support@wallarm.com](mailto:support@wallarm.com) للحصول على نهج Mulesoft Wallarm.
1. استخرج أرشيف السياسة بمجرد تلقيه.
1. انتقل إلى دليل السياسة:

    ```
    cd <POLICY_DIRECTORY/wallarm
    ```
1. ضمن الملف `pom.xml` → الحقل `groupId` في أعلى الملف ، حدد Mulesoft Business Group ID الخاص بك.

    يمكنك العثور على معرّف المنظمة الخاصة بك عن طريق التنقل إلى Mulesoft Anypoint Platform → **Access Management** → **Business Groups** → اختر منظمتك → انسخ معرّفها.
1. في دليل Maven `.m2` الخاص بك ، حدث الملف `settings.xml` ببيانات التفويض الخاصة بك في Exchange:

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
1. نشر النهج إلى Mulesoft باستخدام الأمر التالي:

    ```
    mvn clean deploy
    ```

السياسة المخصصة الخاصة بك متاحة الآن في Exchange لمنظمتك على منصة Mulesoft Anypoint.

![Mulesoft مع النهج Wallarm](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. أرفق النهج Wallarm بـ API الخاص بك

يمكنك أن ترفق النهج Wallarm إلى جميع واجهات برمجة التطبيقات أو واجهة برمجة تطبيق واحدة.

#### ربط النهج بجميع واجهات برمجة التطبيقات

لتطبيق النهج Wallarm على جميع واجهات برمجة التطبيقات باستخدام [Mulesoft's Automated policy option](https://docs.mulesoft.com/gateway/1.4/policies-automated-applying) اتبع الخطوات التالية:

1. في Anypoint Platform الخاص بك ، انتقل إلى **API Manager** → **Automated Policies**.
1. النقر على **Add automated policy** واختر النهج Wallarm من Exchange.
1. حدد `WLRM REPORTING ENDPOINT` وهو عنوان IP على ال [Wallarm node instance](#1-deploy-a-wallarm-node) بما في ذلك `http://` أو `https://`.
1. إذا لزم الأمر ، قم بتعديل الفترة الزمنية القصوى لـ Wallarm لمعالجة طلب واحد عن طريق تغيير قيمة `WALLARM NODE REQUEST TIMEOUT`.
1. طبق النهج.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### ربط النهج بواجهة برمجة تطبيق واحدة

لتأمين واجهة برمجة التطبيقات الفردية مع النهج Wallarm اتبع هذه الخطوات:

1. في Anypoint Platform الخاص بك، انتقل إلى **API Manager** واختر واجهة برمجة التطبيقات المرغوبة.
1. انتقل إلى **Policies** → **Add policy** واختر النهج Wallarm.
1. حدد `WLRM REPORTING ENDPOINT` وهو عنوان IP على ال [Wallarm node instance](#1-deploy-a-wallarm-node) بما في ذلك `http://` أو `https://`.
1. إذا لزم الأمر ، قم بتعديل الفترة الزمنية القصوى لـ Wallarm لمعالجة طلب واحد بتغيير قيمة `WALLARM NODE REQUEST TIMEOUT`.
1. طبق النهج.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## الاختبار

لاختبار وظيفة النهج المنشور ، اتبع هذه الخطوات:

1. أرسل الطلب مع الاختبار [Path Traversal][ptrav-attack-docs] هجوم إلى API الخاص بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح Wallarm Console → قسم **Attacks** في ال [US Cloud](https://us1.my.wallarm.com/attacks) أو [EU Cloud](https://my.wallarm.com/attacks) وتأكد من عرض الهجوم في القائمة.
    
    ![الهجمات في واجهة الاستخدام][attacks-in-ui-image]

    إذا تم ضبط وضع العقدة Wallarm على الحجب وتدفق الحركة في السطر ، سيتم حجب الطلب أيضًا.

إذا لم تعمل الحلول وفقًا للتوقعات ، فرجع إلى سجلات API الخاصة بك عن طريق الوصول إلى Mulesoft Anypoint Platform → **Runtime Manager** → التطبيق الخاص بك → **Logs**.

يمكنك أيضًا التحقق مما إذا كانت السياسة مطبقة على API عن طريق التنقل إلى API الخاصة بك في **API Manager** ومراجعة السياسات المطبقة على العلامة التبويب **Policies**. بالنسبة للسياسات المؤتمتة ، يمكنك استخدام الخيار **See covered APIs** لعرض واجهات برمجة التطبيقات المغطاة وأسباب أي استثناءات.

## التحديث والإلغاء

لتحديث النهج المنشور من Wallarm ، اتبع هذه الخطوات:

1. أزل النهج Wallarm المنشور حاليًا باستخدام الخيار **Remove policy** في إما قائمة النهج المؤتمتة أو قائمة النهج المطبقة على واجهة برمجة تطبيق فردية.
1. أضف النهج الجديدة باتباع الخطوات 2-3 أعلاه.
1. أعِد بدء التطبيقات المرتبطة في	**Runtime Manager** لتطبيق النهج الجديد.

لإلغاء تثبيت النهج ، ببساطة قم بتنفيذ الخطوة الأولى من عملية التحديث.

## بحاجة لمساعدة؟

إذا واجهتك أي مشاكل أو في حاجة إلى مساعدة مع النشر الموصوف لـ Wallarm's policy بالتزامن مع MuleSoft الخاص بك ، يمكنك التواصل مع فريق الدعم في [Wallarm support](mailto:support@wallarm.com) team. حيث يسعدون بتوفير التوجيه ومساعدتك في حل أي مشاكل قد تواجهك أثناء عملية التنفيذ.