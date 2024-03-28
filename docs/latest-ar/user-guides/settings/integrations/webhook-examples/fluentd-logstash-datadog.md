# Datadog عبر Fluentd/Logstash

يمكنك تعيين Wallarm لإرسال إشعارات الأحداث المكتشفة إلى Datadog عبر Fluentd أو Logstash كمُجمِّع بيانات وسيط.

--8<-- "../include/integrations/webhook-examples/overview.md"

![إرسال الإشعارات من Wallarm إلى Datadog عبر مُجمِّع البيانات](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "التكامل المباشر مع Datadog"
    يدعم Wallarm أيضًا [التكامل المباشر مع Datadog عبر واجهة برمجة تطبيقات Datadog](../datadog.md). التكامل المباشر لا يتطلب استخدام مُجمِّع البيانات الوسيط.

## الموارد المستخدمة

* خدمة Fluentd أو Logstash متاحة على رابط URL عام
* خدمة Datadog متاحة على رابط URL عام
* وصول المدير إلى وحدة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) ل[تكوين التكامل مع Fluentd/Logstash](#setting-up-integration-with-fluentd-or-logstash)

--8<-- "../include/cloud-ip-by-request.md"

## المتطلبات

بما أن Wallarm ترسل السجلات إلى مُجمِّع البيانات الوسيط عبر الويبهوك، يجب أن تلبي تكوينات Fluentd أو Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* توفر رابط URL عام
* توجيه السجلات إلى Datadog عبر إضافة `datadog_logs` لLogstash أو إضافة `fluent-plugin-datadog` لFluentd

=== "مثال على تكوين Logstash"
    1. [تثبيت إضافة `datadog_logs`](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it) لتوجيه السجلات إلى Datadog.
    1. تكوين Logstash لقراءة الطلبات الواردة وتوجيه السجلات إلى Datadog.

    مثال ملف التكوين`logstash-sample.conf`:

    ```bash linenums="1"
    input {
      http { #  إضافة الإدخال للترافيك HTTP و HTTPS
        port => 5044 # منفذ للطلبات الواردة
        ssl => true # معالجة الترافيك HTTPS
        ssl_certificate => "/etc/server.crt" # شهادة TLS لLogstash
        ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # إضافة عنصر لمصدر السجل في Datadog لتصفية سجلات Wallarm
        }
      }
    }
    output {
      stdout {} # إضافة الإخراج لطباعة سجلات Logstash عبر الأمر
      datadog_logs { # إضافة الإخراج لتوجيه سجلات Logstash إلى Datadog
          api_key => "XXXX" # المفتاح البرمجي المولد للمنظمة في Datadog
          host => "http-intake.logs.datadoghq.eu" # نقطة النهاية في Datadog (تعتمد على منطقة التسجيل)
      }
    }
    ```

    * [وثائق على هيكل ملف تكوين Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [وثائق على إضافة`datadog_logs`](https://docs.datadoghq.com/integrations/logstash/)
=== "مثال على تكوين Fluentd"
    1. [تثبيت إضافة `fluent-plugin-datadog`](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements) لتوجيه السجلات إلى Datadog.
    1. تكوين Fluentd لقراءة الطلبات الواردة وتوجيه السجلات إلى Datadog.

    مثال ملف التكوين `td-agent.conf`:

    ```bash linenums="1"
    <source>
      @type http # إضافة الإدخال للترافيك HTTP و HTTPS
      port 9880 # منفذ للطلبات الواردة
      <transport tls> # تكوين لمعالجة الاتصالات
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # إضافة الإخراج لتوجيه السجلات من Fluentd إلى Datadog
      @id awesome_agent
      api_key XXXX # المفتاح البرمجي المولد للمنظمة في Datadog
      host 'http-intake.logs.datadoghq.eu' # نقطة النهاية في Datadog (تعتمد على منطقة التسجيل)
    
      # اختياري
      include_tag_key true
      tag_key 'tag'
    
      # علامات اختيارية
      dd_source 'wallarm' # إضافة عنصر المصدر إلى سجل Datadog لتصفية سجلات Wallarm
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

    * [وثائق على هيكل ملف تكوين Fluentd](https://docs.fluentd.org/configuration/config-file)
    * [وثائق على إضافة `fluent-plugin-datadog`](https://docs.datadoghq.com/integrations/fluentd)

## إعداد التكامل مع Fluentd أو Logstash

1. انتقل إلى إعداد التكامل مع Datadog في وحدة تحكم Wallarm → **التكاملات** → **Fluentd**/**Logstash**.
1. أدخل اسم التكامل.
1. حدد رابط URL لFluentd أو Logstash المستهدف (رابط الويبهوك).
1. إذا لزم الأمر، قم بتكوين الإعدادات المتقدمة:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. اختر أنواع الأحداث لتفعيل إرسال الإشعارات إلى الرابط المحدد. إذا لم يتم اختيار الأحداث، فلن يتم إرسال الإشعارات.
1. [اختبر التكامل](#testing-integration) وتأكد من صحة الإعدادات.
1. انقر على **إضافة التكامل**.

مثال على التكامل مع Fluentd:

![إضافة التكامل مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## اختبار التكامل

--8<-- "../include/integrations/test-integration-advanced-data.md"

السجل التجريبي في مُجمِّع البيانات الوسيط لFluentd أو Logstash:

```json
[
    {
        summary:"[رسالة تجريبية] [شريك تجريبي(US)] اكتشاف ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم اكتشاف ثغرة جديدة في نظامك.

                    معرّف: 
                    العنوان: تجريبي
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    المكتشف بواسطة: 
                    البارامتر: 
                    النوع: معلومات
                    التهديد: متوسط

                    المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                    العميل: شركة التجريب
                    السحابة: US
                    ",
        details:{
            client_name:"شركة التجريب",
            cloud:"US",
            notification_type:"ثغرة",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"example.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"تجريبي",
                discovered_by:null,
                threat:"متوسط",
                type:"معلومات"
            }
        }
    }
]
```

السجل التجريبي في Datadog:

![السجل التجريبي في Datadog](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

للعثور على سجلات Wallarm بين السجلات الأخرى، يمكن استخدام علامة البحث `source:wallarm_cloud` في خدمة سجلات Datadog.