[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# ترقية عقدة متعددة المستأجرين التي انتهت صلاحيتها

هذه التعليمات تصف خطوات ترقية عقدة متعددة المستأجرين التي انتهت صلاحيتها (الإصدار 3.6 وما دون) إلى الإصدار 4.10.

## الشروط

* تنفيذ الأوامر التالية من قبل المستخدم بدور **المدير العام** الذي تم إضافته تحت [حساب المستأجر التقني](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع Wallarm Cloud الأمريكي أو إلى `https://api.wallarm.com` عند العمل مع Wallarm Cloud الأوروبي. يرجى التأكد من عدم حجب الوصول بواسطة جدار حماية

## الخطوة الأولى: التواصل مع فريق دعم Wallarm

اطلب من [فريق دعم Wallarm](mailto:support@wallarm.com) المساعدة للحصول على أحدث نسخة من ميزة [بناء مجموعة القواعد المخصصة](../../user-guides/rules/rules.md#ruleset-lifecycle) أثناء ترقية عقدة متعددة المستأجرين.

!!! info "ترقية محجوبة"
    استخدام نسخة غير صحيحة من ميزة بناء مجموعة القواعد المخصصة قد يحجب عملية الترقية.

الفريق الداعم سيساعدك أيضًا في الإجابة عن جميع الأسئلة المتعلقة بترقية عقدة متعددة المستأجرين وإعادة التكوين اللازمة.

## الخطوة الثانية: اتباع إجراء الترقية القياسي

الإجراءات القياسية هي تلك المخصصة لـ:

* [ترقية وحدات NGINX في Wallarm](nginx-modules.md)
* [ترقية وحدة postanalytics](separate-postanalytics.md)
* [ترقية صورة Docker القائمة على NGINX أو Envoy من Wallarm](docker-container.md)
* [ترقية تحكم إدخال NGINX بوحدات Wallarm المدمجة](ingress-controller.md)
* [ترقية صورة العقدة السحابية](cloud-image.md)

!!! warning "إنشاء عقدة متعددة المستأجرين"
    أثناء إنشاء عقدة Wallarm، يرجى اختيار خيار **عقدة متعددة المستأجرين**:

    ![إنشاء عقدة متعددة المستأجرين](../../images/user-guides/nodes/create-multi-tenant-node.png)

## الخطوة الثالثة: إعادة تكوين المستأجرين المتعددين

أعد كتابة تكوين كيفية ارتباط حركة المرور بمستأجرينك وتطبيقاتهم. انظر المثال أدناه. في المثال:

* المستأجر يمثل عميل الشريك. للشريك عميلان.
* يجب ربط حركة المرور المستهدفة `tenant1.com` و `tenant1-1.com` بالعميل 1.
* يجب ربط حركة المرور المستهدفة `tenant2.com` بالعميل 2.
* للعميل 1 أيضًا ثلاثة تطبيقات:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    يجب ربط حركة المرور المستهدفة لهذه الـ 3 مسارات بالتطبيق المقابل؛ يجب اعتبار الباقي كحركة مرور عامة للعميل 1.

### دراسة تكوين الإصدار السابق

في الإصدار 3.6، يمكن تكوين ذلك كما يلي:

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

ملاحظات حول التكوين أعلاه:

* يرتبط حركة المرور المستهدفة `tenant1.com` و `tenant1-1.com` بالعميل 1 عبر القيم `20` و `23`، المرتبطة بهذا العميل عبر [طلب API](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account).
* كان ينبغي إرسال طلبات API مشابهة لربط التطبيقات الأخرى بالمستأجرين.
* المستأجرون والتطبيقات هم كيانات منفصلة، لذا من المنطقي تكوينهم بتوجيهات مختلفة. أيضًا، سيكون من الملائم تجنب طلبات API الإضافية. سيكون من المنطقي تعريف العلاقات بين المستأجرين والتطبيقات من خلال التكوين نفسه. كل هذا مفقود في التكوين الحالي لكن سيصبح متاحًا في النهج الجديد 4.x الموضح أدناه.

### دراسة نهج 4.x

في الإصدار 4.x، UUID هي الطريقة لتحديد المستأجر في تكوين العقدة.

لإعادة كتابة التكوين، قم بما يلي:

1. احصل على UUIDs لمستأجريك.
1. ادمج المستأجرين وحدد تطبيقاتهم في ملف تكوين NGINX.

### الحصول على UUIDs لمستأجريك

للحصول على قائمة المستأجرين، أرسل طلبات مصادقة إلى API Wallarm. نهج المصادقة هو نفسه الذي [استخدم لإنشاء المستأجر](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. احصل على `clientid`(s) للعثور على UUIDs المتعلقة بهم لاحقًا:

    === "عبر واجهة Wallarm Console"

        انسخ `clientid`(s) من عمود **المعرف** في واجهة مستخدم Wallarm Console:
        
        ![اختيار المستأجرين في واجهة Wallarm Console](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "بإرسال طلب إلى الAPI"
        1. أرسل طلب GET إلى المسار `/v2/partner_client`:

            !!! info "مثال على الطلب المرسل من عميلك الخاص"
                === "Cloud الأمريكي"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "Cloud الأوروبي"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            حيث `PARTNER_ID` هو الذي تم الحصول عليه في [**الخطوة 2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation) من إجراء إنشاء المستأجر.

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

        1. انسخ `clientid`(s) من الرد.
1. للحصول على UUID لكل مستأجر، أرسل طلب POST إلى المسار `v1/objects/client`:

    !!! info "مثال على الطلب المرسل من عميلك الخاص"
        === "Cloud الأمريكي"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "Cloud الأوروبي"
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

1. من الرد، انسخ `uuid`(s).

### دمج المستأجرين وتحديد تطبيقاتهم في ملف تكوين NGINX

في ملف تكوين NGINX:

1. حدد UUIDs المستأجرين التي تلقيتها أعلاه في توجيهات [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
1. حدد المعرفات للتطبيقات المحمية في توجيهات [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application).

    إذا تضمن التكوين لـ NGINX المستخدم للعقدة 3.6 أو أقل تكوين تطبيق، فقط حدد UUIDs المستأجرين واحتفظ بتكوين التطبيق دون تغيير.

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

* يتم تكوين المستأجرين والتطبيقات بتوجيهات مختلفة.
* يتم تعريف العلاقات بين المستأجرين والتطبيقات عبر توجيهات `wallarm_application` في الأقسام المقابلة من ملف تكوين NGINX.

## الخطوة الرابعة: اختبار تشغيل عقدة Wallarm متعددة المستأجرين

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"