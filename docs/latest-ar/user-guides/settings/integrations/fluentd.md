# Fluentd

[Fluentd](https://www.fluentd.org/) هو أداة برمجية مفتوحة المصدر لجمع البيانات تعمل كآلية متعددة الاستخدامات وخفيفة الوزن لتجميع ونقل البيانات. يمكنك إعداد Wallarm لإرسال إشعارات عن الأحداث المكتشفة إلى Fluentd من خلال إنشاء تكامل مناسب في وحدة تحكم Wallarm.

## صيغة الإشعار

ترسل Wallarm الإشعارات إلى Fluentd عبر **الواب هوك** بصيغة JSON. يعتمد مجموع الكائنات JSON على الحدث الذي تقوم Wallarm بإشعارك به.

مثال على إشعار الاكتشاف الجديد:

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

يجب أن تلبي تكوينات Fluentd المتطلبات التالية:

* تقبل طلبات POST أو PUT
* تقبل الطلبات HTTPS
* تمتلك URL عامّ

مثال على تكوين Fluentd:

```bash linenums="1"
<source>
  @type http # إضافة الإدخال لحركة المرور HTTP وHTTPS
  port 9880 # المنفذ للطلبات الواردة
  <transport tls> # تكوين لمعالجة الاتصالات
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # إضافة الخروج لطباعة سجلات Fluentd في خط الأوامر
     output_type json # صيغة السجلات المطبوعة في خط الأوامر
  </store>
</match>
```

يمكنك العثور على المزيد من التفاصيل في [الوثائق رسمية Fluentd](https://docs.datadoghq.com/integrations/fluentd).

## إعداد التكامل

1. انتقل إلى إعداد تكامل Fluentd في وحدة تحكّم Wallarm → **التكاملات** → **Fluentd**.
1. أدخل اسم التكامل.
1. حدد URL Fluentd الهدف (URL الواب هوك).
1. إذا لزم الأمر، قم بتكوين الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![تكامل Fluentd](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    التفاصيل على الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر على **اختبار التكامل** للتحقق من صحة التكوين، توافر وحدة تحكم Wallarm وصيغة الإشعار.

    سجل الاختبار Fluentd:

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

1. انقر على **إضافة التكامل**.

## إعداد التنبيهات الإضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## استخدام Fluentd كجامع بيانات وسيط

--8<-- "../include/integrations/webhook-examples/overview.md"

على سبيل المثال:

![مخطط الواب هوك](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

لتسجيل أحداث Wallarm باستخدام هذا المخطط:

1. تكوين جامع البيانات لقراءة الواب هوكات الواردة وتوجيه السجلات إلى النظام التالي. ترسل Wallarm الأحداث إلى جامعي البيانات عبر الواب هوك.
1. تكوين نظام SIEM للحصول على السجلات وقراءتها من جامع البيانات.
1. تكوين Wallarm لإرسال السجلات إلى جامع البيانات.

    يمكن لـ Wallarm إرسال السجلات إلى أي جامع بيانات عبر الواب هوك.

    للدمج مع Fluentd أو Logstash، يمكنك استخدام بطاقات التكامل المقابلة في واجهة مستخدم Wallarm Console.

    للدمج مع جامعات البيانات الأخرى، يمكنك استخدام [بطاقة التكامل الواب هوك](webhook.md) في واجهة مستخدم Wallarm Console.

وصفنا بعض الأمثلة على كيفية تهيئة الاندماج مع جامعات البيانات الشهيرة التي تنقل السجلات إلى أنظمة SIEM:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarm تدعم أيضًا [الاندماج الأصلي مع Datadog عبر API Datadog](datadog.md). لا يتطلب الاندماج الأصلي استخدام جامع البيانات الوسيط.

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توافر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"