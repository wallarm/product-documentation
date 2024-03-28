# تكامل Micro Focus ArcSight Logger عبر Logstash

تزودك هذه التعليمات بمثال على تكامل Wallarm مع جمّاع البيانات Logstash لإعادة توجيه الأحداث إلى نظام ArcSight Logger.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق الويب هوك](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "التكامل مع نسخة Enterprise من ArcSight ESM"
    لتهيئة إعادة توجيه السجلات من Logstash إلى نسخة Enterprise من ArcSight ESM، يُوصى بتكوين الرابط Syslog على جانب ArcSight ثم إعادة توجيه السجلات من Logstash إلى منفذ الرابط. للحصول على وصف أكثر تفصيلًا للروابط، يُرجى تحميل **دليل مستخدم SmartConnector** من [التوثيق الرسمي لـ ArcSight SmartConnector](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## الموارد المستخدمة

* [ArcSight Logger 7.1](#arcsight-logger-configuration) مثبّت على CentOS 7.8 بعنوان ويب `https://192.168.1.73:443`
* [Logstash 7.7.0](#logstash-configuration) مثبّت على Debian 11.x (bullseye) ومتاح على `https://logstash.example.domain.com`
* وصول المدير إلى وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) لـ [تهيئة تكامل Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

نظرًا لأن الروابط إلى خدمات ArcSight Logger وLogstash مذكورة كأمثلة، فإنها لا تستجيب.

### تهيئة ArcSight Logger

تم تكوين مستقبل السجلات في ArcSight Logger `سجلات Wallarm Logstash` على النحو التالي:

* يتم استلام السجلات عبر UDP (`النوع = مستقبل UDP`)
* منفذ الاستماع هو `514`
* يتم تحليل الأحداث بمحلل syslog
* الإعدادات الافتراضية الأخرى

![تهيئة المستقبل في ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

للحصول على وصف أكثر تفصيلًا لتهيئة المستقبل، يُرجى تحميل **دليل تثبيت Logger** للنسخة المناسبة من [التوثيق الرسمي لـ ArcSight Logger](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### تهيئة Logstash

بما أن Wallarm يرسل السجلات إلى جمّاع البيانات Logstash الوسيط عبر الويب هوك، يجب أن تلبي تهيئة Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* امتلاك عنوان URL عام
* إعادة توجيه السجلات إلى ArcSight Logger، يستخدم هذا المثال البرنامج المساعد `syslog` لإعادة توجيه السجلات

تمت تهيئة Logstash في ملف `logstash-sample.conf`:

* تمت تهيئة معالجة ويب هوك الوارد في قسم `input`:
    * يتم إرسال الحركة إلى المنفذ 5044
    * Logstash مهيأ لقبول الاتصالات HTTPS فقط
    * شهادة TLS Logstash الموقعة من CA ذات ثقة عامة موجودة ضمن الملف `/etc/server.crt`
    * المفتاح الخاص لشهادة TLS موجود ضمن الملف `/etc/server.key`
* تمت تهيئة إعادة توجيه السجلات إلى ArcSight Logger وإخراج السجل في قسم `output`:
    * يتم إعادة توجيه جميع سجلات الأحداث من Logstash إلى ArcSight Logger على عنوان IP `https://192.168.1.73:514`
    * يتم إعادة توجيه السجلات من Logstash إلى ArcSight Logger بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع ArcSight Logger عبر UDP
    * يتم طباعة سجلات Logstash إضافيًا على سطر الأوامر (السطر الكودي 15). الإعداد مستخدم للتحقق من أن الأحداث تُسجل عبر Logstash

```bash linenums="1"
input {
  http { # البرنامج المساعد لحركة البيانات HTTP و HTTPS
    port => 5044 # منفذ الطلبات الواردة
    ssl => true # معالجة حركة البيانات HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  syslog { # البرنامج المساعد لإعادة توجيه السجلات من Logstash عبر Syslog
    host => "192.168.1.73" # عنوان IP لإعادة توجيه السجلات إليه
    port => "514" # المنفذ لإعادة توجيه السجلات إليه
    protocol => "udp" # بروتوكول الاتصال
    codec => json # تنسيق السجلات المعاد توجيهها
  }
  stdout {} # البرنامج المساعد لطباعة سجلات Logstash على سطر الأوامر
}
```

وصف أكثر تفصيلًا لملفات التهيئة متاح في [التوثيق الرسمي لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "اختبار تهيئة Logstash"
    للتحقق من أن سجلات Logstash يتم إنشاؤها وإعادة توجيهها إلى ArcSight Logger، يمكن إرسال طلب POST إلى Logstash.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![سجلات Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **الحدث في ArcSight Logger:**
    ![حدث ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### تهيئة تكامل Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![تكامل الويب هوك مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[المزيد من التفاصيل حول تهيئة تكامل Logstash](../logstash.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيُسجل Logstash الحدث على النحو التالي:

![سجل عن المستخدم الجديد في ArcSight Logger من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

سيتم عرض الإدخال التالي في أحداث ArcSight Logger:

![بطاقة المستخدم الجديد في ArcSight Logger من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)