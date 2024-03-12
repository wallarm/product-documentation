# Datadog عن طريق Fluentd/Logstash

يمكنك إعداد Wallarm لإرسال إشعارات بالأحداث المكتشفة إلى Datadog من خلال جامع البيانات الوسيط Fluentd أو Logstash.

--8<-- "../include/integrations/webhook-examples/overview.md"

![إرسال الإشعارات من Wallarm إلى Datadog عبر جامع البيانات](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "التكامل الأصلي مع Datadog"
    Wallarm يدعم أيضًا [التكامل الأصلي مع Datadog عبر واجهة برمجة تطبيقات Datadog](../datadog.md). التكامل الأصلي لا يتطلب استخدام جامع البيانات الوسيط.

## الموارد المستخدمة

* خدمة Fluentd أو Logstash متوفرة على URL عام
* خدمة Datadog متوفرة على URL عام
* حق الوصول كمدير إلى واجهة Wallarm Console في [السحابة الأوروبية](https://my.wallarm.com) لـ [تكوين التكامل مع Fluentd/Logstash](#setting-up-integration-with-fluentd-or-logstash)

--8<-- "../include/cloud-ip-by-request.md"

## المتطلبات

بما أن Wallarm يرسل السجلات إلى جامع البيانات الوسيط عبر webhooks، يجب أن يلبي تكوين Fluentd أو Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* إعادة توجيه السجلات إلى Datadog عبر إضافة `datadog_logs` لـLogstash أو إضافة `fluent-plugin-datadog` لـ Fluentd

=== "مثال تكوين Logstash"
    1. [تثبيت إضافة `datadog_logs`](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it) لإعادة توجيه السجلات إلى Datadog.
    1. تكوين Logstash لقراءة الطلبات الواردة وإعادة توجيه السجلات إلى Datadog.

    مثال ملف التكوين `logstash-sample.conf`:

    ```bash linenums="1"
    input {
      http { # إضافة الإدخال لمعالجة حركة البيانات HTTP و HTTPS
        port => 5044 # منفذ للطلبات الواردة
        ssl => true # معالجة حركة البيانات HTTPS
        ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
        ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # تغيير الفلتر لإضافة حقل المصدر إلى سجل البيانات في Datadog لتصفية سجلات Wallarm لاحقًا
        }
      }
    }
    output {
      stdout {} # إضافة الإخراج لطباعة سجلات Logstash على سطر الأوامر
      datadog_logs { # إضافة الإخراج لإعادة توجيه سجلات Logstash إلى Datadog
          api_key => "XXXX" # مفتاح API المُنشأ للمنظمة في Datadog
          host => "http-intake.logs.datadoghq.eu" # نقطة النهاية Datadog (تعتمد على منطقة التسجيل)
      }
    }
    ```

    * [التوثيق على بنية ملف التكوين لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [التوثيق على إضافة `datadog_logs`](https://docs.datadoghq.com/integrations/logstash/)
=== "مثال تكوين Fluentd"
    1. [تثبيت إضافة `fluent-plugin-datadog`](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements) لإعادة توجيه السجلات إلى Datadog.
    1. تكوين Fluentd لقراءة الطلبات الواردة وإعادة توجيه السجلات إلى Datadog.

    مثال ملف التكوين `td-agent.conf`:

    ```bash linenums="1"
    <source>
      @type http # إضافة الإدخال لمعالجة حركة البيانات HTTP و HTTPS
      port 9880 # منفذ للطلبات الواردة
      <transport tls> # التكوين لمعالجة الاتصالات
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # إضافة الإخراج لإعادة توجيه السجلات من Fluentd إلى Datadog
      @id awesome_agent
      api_key XXXX # مفتاح API المُنشأ للمنظمة في Datadog
      host 'http-intake.logs.datadoghq.eu' # نقطة النهاية Datadog (تعتمد على منطقة التسجيل)
    
      # اختياري
      include_tag_key true
      tag_key 'tag'
    
      # علامات اختيارية
      dd_source 'wallarm' # إضافة حقل المصدر إلى سجل البيانات في Datadog لتصفية سجلات Wallarm لاحقًا
      dd_tags 'integration:fluentd'
    
      <buffer>
              @type memory
              flush_thread_count 4
              flush_interval 3s
              chunk_limit_size 5m
              chunk_limit_records 500
      </buffer>
    </match>
    ```

    * [التوثيق على بنية ملف التكوين لـ Fluentd](https://docs.fluentd.org/configuration/config-file)
    * [التوثيق على إضافة `fluent-plugin-datadog`](https://docs.datadoghq.com/integrations/fluentd)

## إعداد التكامل مع Fluentd أو Logstash

1. انتقل إلى إعداد التكامل مع Datadog في واجهة Wallarm Console → **Integrations** → **Fluentd**/**Logstash**.
1. أدخل اسم التكامل.
1. حدد URL Fluentd أو Logstash الهدف (Webhook URL).
1. إذا لزم الأمر، قم بتهيئة الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتشغيل إرسال الإشعارات إلى العنوان المحدد. إذا لم يتم اختيار الأحداث، فلن يتم إرسال الإشعارات.
1. [اختبر التكامل](#testing-integration) وتأكد من صحة الإعدادات.
1. انقر على **إضافة التكامل**.

مثال تكامل Fluentd:

![إضافة التكامل مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## اختبار التكامل

--8<-- "../include/integrations/test-integration-advanced-data.md"

سجل الاختبار في جامع البيانات الوسيط Fluentd أو Logstash:

```json
[
    {
        summary:"[رسالة اختبار] [شريك الاختبار(US)] اكتشاف ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم اكتشاف ثغرة جديدة في نظامك.

                    الرقم التعريفي: 
                    العنوان: اختبار
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    المكتشف بواسطة: 
                    العامل: 
                    النوع: معلومات
                    التهديد: متوسط

                    المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                    العميل: TestCompany
                    السحابة: US
                    ",
        details:{
            client_name:"TestCompany",
            cloud:"US",
            notification_type:"ثغرة",
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

سجل الاختبار في Datadog:

![سجل الاختبار في Datadog](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

للعثور على سجلات Wallarm بين سجلات أخرى، يمكنك استخدام علامة البحث `source:wallarm_cloud` في خدمة Datadog Logs.