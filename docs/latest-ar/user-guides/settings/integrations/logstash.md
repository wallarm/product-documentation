# Logstash

[Logstash](https://www.elastic.co/logstash) هو أداة مفتوحة المصدر لمعالجة البيانات وإدارة السجلات طورتها Elastic. يمكنك ضبط Wallarm لإرسال إشعارات بالأحداث المكتشفة إلى Logstash.

## تنسيق الإشعار

Wallarm يرسل الإشعارات إلى Logstash عبر **الويب هوك** بتنسيق JSON. يعتمد مجموعة الكائنات JSON على الحدث الذي يشعر عنه Wallarm.

مثال على إشعار الضربة الجديدة المكتشفة:

```json
[
    {
        "summary": "[Wallarm] New hit detected",
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

يجب أن تلبي تكوينات Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* امتلاك URL عام

مثال على تكوين Logstash:

```bash linenums="1"
input {
  http { # مكمل الإدخال لحركة HTTP وHTTPS
    port => 5044 # المنفذ للطلبات الواردة
    ssl => true # معالجة حركة HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  stdout {} # مكمل الإخراج لطباعة سجلات Logstash في سطر الأوامر
  ...
}
```

يمكنك العثور على المزيد من التفاصيل في [الوثائق الرسمية لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

## إعداد الاندماج

1. انتقل إلى إعداد اندماج Logstash في Wallarm Console → **Integrations** → **Logstash**.
1. أدخل اسم الاندماج.
1. حدد URL Logstash المستهدف (Webhook URL).
1. إذا لزم الأمر، قم بتهيئة الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![اندماج Logstash](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    التفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر **اختبر الاندماج** للتحقق من صحة التكوين، توافر Wallarm Cloud، وتنسيق الإشعار.

    سجل Logstash التجريبي:

    ```json
    [
        {
            summary:"[Test message] [Test partner(US)] New vulnerability detected",
            description:"Notification type: vuln

                        New vulnerability was detected in your system.

                        ID: 
                        Title: Test
                        Domain: example.com
                        Path: 
                        Method: 
                        Discovered by: 
                        Parameter: 
                        Type: Info
                        Threat: Medium

                        More details: https://us1.my.wallarm.com/object/555


                        Client: TestCompany
                        Cloud: US
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
                    threat:"Medium",
                    type:"Info"
                }
            }
        }
    ]
    ```

1. انقر **أضف اندماج**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## استخدام Logstash كمجمع بيانات وسيط

--8<-- "../include/integrations/webhook-examples/overview.md"

على سبيل المثال:

![تدفق الويب هوك](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

لتسجيل أحداث Wallarm باستخدام هذه الخطة:

1. قم بتكوين مجمع البيانات لقراءة الويب هوك الواردة ولإعادة توجيه السجلات إلى النظام التالي. Wallarm يرسل الأحداث إلى مجمعي البيانات عبر الويب هوك.
1. قم بتكوين نظام إدارة المعلومات الأمنية لاستقبال وقراءة السجلات من مجمع البيانات.
1. قم بتكوين Wallarm لإرسال السجلات إلى مجمع البيانات.

    يمكن لـ Wallarm إرسال السجلات إلى أي مجمع بيانات عبر الويب هوك.

    للاندماج مع Fluentd أو Logstash، يمكنك استخدام بطاقات الاندماج المقابلة في واجهة مستخدم Wallarm Console.

    للاندماج مع مجمعي بيانات آخرين، يمكنك استخدام [بطاقة الاندماج عبر الويب هوك](webhook.md) في واجهة مستخدم Wallarm Console.

وصفنا بعض الأمثلة على كيفية تكوين الاندماج مع مجمعي البيانات الشهيرة الموجهة لأنظمة إدارة المعلومات الأمنية:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    كما يدعم Wallarm [الاندماج الأصلي مع Datadog عبر واجهة برمجة تطبيقات Datadog](datadog.md). الاندماج الأصلي لا يتطلب استخدام مجمع بيانات وسيط.

## تعطيل وحذف اندماج

--8<-- "../include/integrations/integrations-disable-delete.md"