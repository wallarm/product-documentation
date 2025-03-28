[ptrav-attack-docs]: ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../../images/admin-guides/test-attacks-quickstart.png
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# ترقية عقدة العميل متعددة التواجد EOL

وتتضمن هذه التعليمات الخطوات لترقية عقدة النهاية المتعددة (الإصدار 3.6 وأقل) إلى 4.10.

## المتطلبات

* تنفيذ الأوامر التالية من قبل المستخدم بدور حالة المسؤول العام المضافة تحت [حساب المستأجر التقني](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* الوصول إلى `https://us1.api.wallarm.com` إذا كنت تعمل مع Wallarm Cloud الأمريكية أو إلى `https://api.wallarm.com` إذا كنت تعمل مع Wallarm Cloud الأوروبية. يرجى التأكد من أن الوصول لا يتم حظره من قبل جدار الحماية

## الخطوة 1: تواصل مع فريق دعم Wallarm

اطلب من [فريق دعم Wallarm](mailto:support@wallarm.com) المساعدة للحصول على أحدث إصدار من ميزة [بناء القواعد المخصصة](../../user-guides/rules/rules.md#ruleset-lifecycle) أثناء ترقية عقدة العميل متعددة التواجد.

!!! info "تحديث محظور"
    قد يؤدي استخدام نسخة غير صحيحة من ميزة بناء المجموعة القاعدية المخصصة إلى حصر عملية الترقية. 

سيساعدك الفريق الدعم أيضًا في الإجابة على جميع الأسئلة المتعلقة بترقية عقدة العميل متعددة التواجد والإعادة التكوين اللازمة.

## الخطوة 2: اتبع إجراء الترقية القياسي

تشمل الإجراءات القياسية ما يلي:

* [ترقية وحدات Wallarm NGINX](nginx-modules.md)
* [ترقية وحدة postanalytics](separate-postanalytics.md)
* [ترقية صورة Wallarm Docker NGINX- أو Envoy-based](docker-container.md)
* [ترقية NGINX Ingress controller مع وحدات Wallarm المتكاملة](ingress-controller.md)
* [ترقية صورة العقدة السحابية](cloud-image.md)

!!! warning "إنشاء العقد العميل متعدد التواجد"
    أثناء إنشاء العقدة Wallarm ، يرجى اختيار خيار العقدة متعددة التواجد:

    ![إنشاء العقد العميل متعدد التواجد](../../images/user-guides/nodes/create-multi-tenant-node.png)

## الخطوة 3: إعادة تكوين العدد المتعدد

أعاد كتابة تكوين كيفية ربط الترافيك بعملائك وتطبيقاتهم. قم بالنظر في المثال أدناه. في المثال:

* المستأجر هو عبارة عن عميل الشريك. ولدى الشريك عميلان.
* يجب أن يتم ربط حركة المرور المستهدفة `tenant1.com` و `tenant1-1.com` مع العميل 1.
* يجب أن يتم ربط حركة المرور المستهدفة `tenant2.com` مع العميل 2.
* لدى العميل 1 أيضًا ثلاثة تطبيقات:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    يجب على حركة المرور المستهدفة هذه الـ3 مسارات أن تتم ربطها بالتطبيق المتناظر؛ ويجب اعتبار ما تبقى أنه ترافيك عام من العميل 1.

### درس تكوين الإصدار السابق الخاص بك

 في 3.6، يمكن تكوين ذلك على النحو التالي:

``` 
 server {
   server_name  tenant1.com;
   wallarm_application 20;
   ...
   location /login {
      wallarm_application 21;
      ...
   }
   location /users {
      wallarm_application 22;
      ...
   }

 server {
   server_name  tenant1-1.com;
   wallarm_application 23;
   ...
 }

 server {
   server_name  tenant2.com;
   wallarm_application 24;
   ...
 }
 ...
 } 
``` 

ملاحظات بشأن التكوين أعلاه:

* حركة المرور المستهدفة `tenant1.com` و `tenant1-1.com` مربوطة مع العميل 1 عبر القيم `20` و `23`,  ربطت مع هذا العميل عبر ال[طلب API](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account).
* يجب أن يتم إرسال نفس طلبات API لربط التطبيقات الأخرى مع المستأجرين.
* المستأجرين والتطبيقات هي كيانات منفصلة، لذا فمن المنطقي تكوينهم بالأوامر المختلفة. أيضًا، سيكون من الجدير بالتنويه تجنب طلبات API إضافية. سيكون من الجدير بالتنويه تحديد العلاقات بين المستأجرين والتطبيقات عبر التكوين نفسه. كل هذا مفقود في التكوين الحالي ولكن سيصبح متاحًا في النهج 4.x الجديد الموصوف أدناه.

### درس النهج 4.x

في الإصدار 4.x، UUID هو الطريقة لتحديد المستأجر في تكوين العقدة.

لإعادة كتابة التكوين، قم بما يلي:

1. الحصول على UUIDs كل مستأجر.
1. قم بتضمين المستأجرين وتعيين تطبيقاتهم في ملف تكوين NGINX.

### الحصول على UUIDs المستأجر الخاص بك

للحصول على قائمة المستأجرين، أرسل طلبات متوثقة إلى Wallarm API. النهج المصادقة هو نفسه أحد الذي [يتم استخدامه لإنشاء المستأجر](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. الحصول على `clientid(s)` بعد ذلك العثور على UUIDs مرتبطة بها:

    === "عبر Wallarm Console"

        نسخ `clientid(s)` من العمود**ID** في واجهة مستخدم وحدة التحكم Wallarm:
        
        ![معايرة المستأجرين في وحدة التحكم Wallarm](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "من خلال إرسال طلب لAPI"
        1. إرسال طلب GET للطريق `/v2/partner_client`:

            !!! info "مثال على الطلب المرسل من العميل الخاص بك"
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            حيث `PARTNER_ID` هو الواحد المحصل في [**الخطوة 2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation) من اجراء انشاء المستأجر.

            مثال الرد:

            ```
            {
            "body": [
                {
                    "id": 1,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_1_ID>,
                    "params": null
                },
                {
                    "id": 3,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_2_ID>,
                    "params": null
                }
            ]
            }
            ```

       1. نسخ `clientid(s)` من الرد.
1. للحصول على UUID لكل مستأجر، ارسل طلب POST للطريق `v1/objects/client`:

    !!! info "مثال على الطلب المرسل من العميل الخاص بك"
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        

    مثال الرد:

    ```
    {
    "status": 200,
    "body": [
        {
            "id": <CLIENT_1_ID>,
            "name": "<CLIENT_1_NAME>",
            ...
            "uuid": "11111111-1111-1111-1111-111111111111",
            ...
        },
        {
            "id": <CLIENT_2_ID>,
            "name": "<CLIENT_2_NAME>",
            ...
            "uuid": "22222222-2222-2222-2222-222222222222",
            ...
        }
    ]
    }
    ```

1. من الرد، نسخ `uuid(s)`.

### تضمين المستأجرين وتعيين تطبيقاتهم في ملف تكوين NGINX

في ملف تكوين NGINX:

1. حدد UUIDs المستأجرين المستلمة أعلاه في توجيهات [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
1. اضبط معرفات التطبيق المحمي في [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) التوجيهات.

    إذا كان التكوين NGINX الذي استُخدم للعقدة 3.6 أو أقل ينطوي على تكوين التطبيق، فقط حدد UUIDs المستأجر واحتفظ بتكوين التطبيق دون تغيير.

مثال:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

في التكوين أعلاه:

* المستأجرين والتطبيقات يتم تكوينهم بواسطة توجيهات مختلفة.
* علاقات بين المستأجرين والتطبيقات تتم تعريفها عبر توجيهات `wallarm_application` في الكتل المطابقة من ملف تكوين NGINX.

## الخطوة 4: اختبار عمل العقدة Wallarm  متعددة التواجد

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"
