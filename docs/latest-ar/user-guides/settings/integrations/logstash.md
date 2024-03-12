# Logstash

[Logstash](https://www.elastic.co/logstash) هو أداة مفتوحة المصدر لمعالجة البيانات وإدارة السجلات تم تطويرها بواسطة Elastic. يمكنك ضبط Wallarm لإرسال إشعارات الأحداث المكتشفة إلى Logstash.

## تنسيق الإشعار

Wallarm يرسل الإشعارات إلى Logstash عبر **webhooks** بتنسيق JSON. مجموعة الكائنات JSON تعتمد على الحدث الذي يقوم Wallarm بالإشعار به.

مثال على إشعار بكشف ضربة جديدة:

```json
[
    {
        "summary": "[Wallarm] تم كشف ضربة جديدة",
        "details": {
        "client_name": "TestCompany",
        "cloud": "EU",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "SOME_value",
            "path": "/news/some_path",
            "payloads": [
                "say ni"
            ],
            "point": [
                "post"
            ],
            "probability": 0.01,
            "remote_country": "PL",
            "remote_port": 0,
            "remote_addr4": "8.8.8.8",
            "remote_addr6": "",
            "tor": "none",
            "request_time": 1603834606,
            "create_time": 1603834608,
            "response_len": 14,
            "response_status": 200,
            "response_time": 5,
            "stamps": [
                1111
            ],
            "regex": [],
            "stamps_hash": -22222,
            "regex_hash": -33333,
            "type": "sqli",
            "block_status": "monitored",
            "id": [
                "hits_production_999_202010_v_1",
                "c2dd33831a13be0d_AC9"
            ],
            "object_type": "hit",
            "anomaly": 0
            }
        }
    }
]
```

## المتطلبات

يجب أن تلبي تكوينة Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام

مثال على تكوينة Logstash:

```bash linenums="1"
input {
  http { # إضافة الإدخال لحركة البيانات HTTP و HTTPS
    port => 5044 # منفذ للطلبات الواردة
    ssl => true # معالجة حركة البيانات HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  stdout {} # إضافة الإخراج لطباعة سجلات Logstash على سطر الأوامر
  ...
}
```

ستجد المزيد من التفاصيل في [الوثائق الرسمية لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

## ضبط الاندماج

1. انتقل إلى ضبط الاندماج مع Logstash في وحدة تحكم Wallarm → **الاندماجات** → **Logstash**.
1. أدخل اسم الاندماج.
1. حدد URL Logstash المستهدف (URL Webhook).
1. إذا لزم الأمر، قم بتكوين الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![اندماج Logstash](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    التفاصيل على الأحداث المتوفرة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر **اختبر الاندماج** للتحقق من صحة التكوين، توفر سحابة Wallarm، وتنسيق الإشعار.

    سجل Logstash الاختباري:

    ```json
    [
        {
            summary:"[رسالة اختبار] [شريك الاختبار(US)] تم كشف ثغرة أمنية جديدة",
            description:"نوع الإشعار: vuln

                        تم كشف ثغرة أمنية جديدة في نظامك.

                        الرقم التعريفي: 
                        العنوان: Test
                        النطاق: example.com
                        المسار: 
                        الطريقة: 
                        اكتشف بواسطة: 
                        المعامل: 
                        النوع: Info
                        الخطر: متوسط

                        المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                        العميل: TestCompany
                        السحابة: US
                        ",
            details:{
                client_name:"TestCompany",
                cloud:"US",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"example.com",
                    id:null,
                    method:null,
                    parameter:null,
                    path:null,
                    title:"Test",
                    discovered_by:null,
                    threat:"متوسط",
                    type:"Info"
                }
            }
        }
    ]
    ```

1. انقر **أضف الاندماج**.

## ضبط إشعارات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## استخدام Logstash كجامع بيانات وسيط

--8<-- "../include/integrations/webhook-examples/overview.md"

على سبيل المثال:

![تدفق Webhook](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

لتسجيل أحداث Wallarm باستخدام هذا المخطط:

1. قم بتكوين جامع البيانات لقراءة webhooks الواردة وإعادة توجيه السجلات إلى النظام التالي. Wallarm يرسل الأحداث إلى جامعي البيانات عبر webhooks.
1. قم بتكوين نظام SIEM للحصول على السجلات من جامع البيانات وقراءتها.
1. قم بضبط Wallarm لإرسال السجلات إلى جامع البيانات.

    يمكن لـ Wallarm إرسال السجلات إلى أي جامع بيانات عبر webhooks.

    للاندماج مع Fluentd أو Logstash، يمكنك استخدام بطاقات الاندماج المناسبة في واجهة مستخدم Wallarm Console.

    للاندماج مع جامعي بيانات آخرين، يمكنك استخدام [بطاقة الاندماج webhook](webhook.md) في واجهة مستخدم Wallarm Console.

قمنا بوصف بعض الأمثلة حول كيفية ضبط الاندماج مع جامعي البيانات الشهيرة التي تعيد توجيه السجلات إلى أنظمة SIEM:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm يدعم أيضًا [الاندماج الأصلي مع Datadog عبر واجهة برمجة تطبيقات Datadog](datadog.md). لا يتطلب الاندماج الأصلي استخدام جامع بيانات وسيط.

## تعطيل وحذف اندماج

--8<-- "../include/integrations/integrations-disable-delete.md"