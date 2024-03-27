# Fluentd

[Fluentd](https://www.fluentd.org/) هو أداة برمجية مفتوحة المصدر لجمع البيانات تعمل كآلية مجمعة وخفيفة الوزن لنقل البيانات. يمكنك ضبط Wallarm لإرسال إخطارات بالأحداث المكتشفة إلى Fluentd من خلال إنشاء تكامل مناسب في لوحة التحكم Wallarm.

## تنسيق الإخطار

ترسل Wallarm الإخطارات إلى Fluentd عبر **الويبهوكس** بتنسيق JSON. تعتمد مجموعة كائنات JSON على الحدث الذي تُخطر به Wallarm.

مثال على إخطار بالضربة الجديدة المكتشفة:

```json
[
    {
        "summary": "[Wallarm] تم اكتشاف ضربة جديدة",
        "details": {
        "client_name": "شركةالاختبار",
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

## الشروط

يجب أن تفي إعدادات Fluentd بالشروط التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* أن يكون لها URL عام

مثال على تكوين Fluentd:

```bash linenums="1"
<source>
  @type http # إضافة الإدخال لحركة المرور HTTP و HTTPS
  port 9880 # منفذ للطلبات الواردة
  <transport tls> # تكوين لمعالجة الاتصالات
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # إضافة الخرج لطباعة سجلات Fluentd في سطر الأوامر
     output_type json # تنسيق السجلات المطبوعة على سطر الأوامر
  </store>
</match>
```

ستجد مزيدًا من التفاصيل في [الوثائق الرسمية لFluentd](https://docs.datadoghq.com/integrations/fluentd).

## إعداد التكامل

1. انتقل إلى إعداد تكامل Fluentd في Wallarm Console → **Integrations** → **Fluentd**.
1. أدخل اسم التكامل.
1. حدد URL Fluentd الهدف (URL الويبهوك).
1. إذا لزم الأمر، اConfigure الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتفعيل الإخطارات.

    ![تكامل Fluentd](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    تفاصيل عن الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. اضغط على **Test integration** لفحص صحة التكوين، توافر Wallarm Cloud، وتنسيق الإخطار.

    سجل اختبار Fluentd:

    ```json
    [
        {
            summary:"[رسالة اختبار] [شريك الاختبار(US)] تم اكتشاف ثغرة أمنية جديدة",
            description:"نوع الإخطار: vuln

                        تم اكتشاف ثغرة أمنية جديدة في نظامك.

                        ID: 
                        العنوان: اختبار
                        المجال: example.com
                        الطريق: 
                        الطريقة: 
                        اكتشف بواسطة: 
                        الباراميتر: 
                        النوع: معلومات
                        التهديد: متوسط

                        المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                        العميل: شركةالاختبار
                        السحابة: US
                        ",
            details:{
                client_name:"شركةالاختبار",
                cloud:"US",
                notification_type:"vuln",
                vuln_link:"https://us1.my.wallarm.com/object/555",
                vuln:{
                    domain:"example.com",
                    id:null,
                    method:null,
                    parameter:null,
                    path:null,
                    title:"اختبار",
                    discovered_by:null,
                    threat:"متوسط",
                    type:"معلومات"
                }
            }
        }
    ]
    ```

1. اضغط على **Add integration**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## استخدام Fluentd كمجمّع بيانات وسيط

--8<-- "../include/integrations/webhook-examples/overview.md"

على سبيل المثال:

![تدفق الويبهوك](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

لتسجيل أحداث Wallarm باستخدام هذا المخطط:

1. قم بتكوين مجمع البيانات لقراءة الويبهوكس الواردة وتوجيه السجلات إلى النظام التالي. ترسل Wallarm الأحداث إلى مجمعي البيانات عبر الويبهوكس.
1. قم بتكوين نظام SIEM للحصول على السجلات وقراءتها من مجمع البيانات.
1. قم بتكوين Wallarm لإرسال السجلات إلى مجمع البيانات.

    يمكن لـ Wallarm إرسال السجلات إلى أي مجمع بيانات عبر الويبهوكس.

    لتكامل Wallarm مع Fluentd أو Logstash، يمكنك استخدام بطاقات التكامل المقابلة في واجهة مستخدم Wallarm Console.

    لدمج Wallarm مع جامعي بيانات آخرين، يمكنك استخدام بطاقة التكامل [webhook](webhook.md) في واجهة مستخدم Wallarm Console.

لقد وصفنا بعض الأمثلة على كيفية تكوين التكامل مع جامعي البيانات الشائعين الذين يقومون بتوجيه السجلات إلى أنظمة SIEM:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    كما تدعم Wallarm [التكامل الأصلي مع Datadog عبر واجهة برمجة تطبيقات Datadog](datadog.md). لا يتطلب التكامل الأصلي استخدام مجمع بيانات وسيط.

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توافر النظام وأخطاء في معلمات التكامل

--8<-- "../include/integrations/integration-not-working.md"