# التكامل بين مُسجل Micro Focus ArcSight و Logstash

توفر هذه التعليمات مثالاً لتكامل Wallarm مع جامع بيانات Logstash لتوجيه الأحداث لاحقًا إلى نظام مُسجل ArcSight.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "التكامل مع نسخة المؤسسات من ArcSight ESM"
    لتكوين توجيه السجلات من Logstash إلى نسخة المؤسسات من ArcSight ESM، يُنصح بتكوين موصل Syslog على جانب ArcSight ثم توجيه السجلات من Logstash إلى منفذ الموصل. للحصول على وصف أكثر تفصيلاً للموصلات، يُرجى تنزيل **دليل مستخدم SmartConnector** من [وثائق ArcSight SmartConnector الرسمية](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## الموارد المستخدمة

* [مُسجل ArcSight 7.1](#arcsight-logger-configuration) مُثبت على CentOS 7.8 بعنوان WEB URL `https://192.168.1.73:443`
* [Logstash 7.7.0](#logstash-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://logstash.example.domain.com`
* حق الوصول كمدير إلى وحدة تحكم Wallarm في [سحابة الاتحاد الأوروبي](https://my.wallarm.com) لـ [تكوين تكامل Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط لخدمات مُسجل ArcSight وLogstash مذكورة كأمثلة، فهي لا تُستجيب.

### تكوين مُسجل ArcSight

تم تكوين مُسجل ArcSight لاستقبال السجلات `سجلات Logstash من Wallarm` على النحو التالي:

* يتم استقبال السجلات عبر UDP (`النوع = مستقبل UDP`)
* المنفذ المستمع هو `514`
* يتم تحليل الأحداث بمُحلل syslog
* إعدادات أخرى افتراضية

![تكوين المُستقبل في مُسجل ArcSight](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

للحصول على وصف أكثر تفصيلاً لتكوين المُستقبل، يُرجى تنزيل **دليل تثبيت المُسجل** للإصدار المناسب من [وثائق مُسجل ArcSight الرسمية](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### تكوين Logstash

بما أن Wallarm يُرسل السجلات إلى جامع البيانات الوسيط Logstash عبر webhooks، يجب أن يلبي تكوين Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عامة
* توجيه السجلات إلى مُسجل ArcSight، هذا المثال يستخدم الإضافة `syslog` لتوجيه السجلات

تم تكوين Logstash في ملف `logstash-sample.conf`:

* تم تكوين معالجة webhook الواردة في قسم `input`:
    * يتم إرسال حركة المرور إلى المنفذ 5044
    * تم تكوين Logstash لقبول الاتصالات HTTPS فقط
    * شهادة TLS الخاصة بـ Logstash والموقعة من CA موثوق به علنًا تقع ضمن الملف `/etc/server.crt`
    * المفتاح الخاص بشهادة TLS يقع ضمن الملف `/etc/server.key`
* تم تكوين توجيه السجلات إلى مُسجل ArcSight وإخراج السجل في قسم `output`:
    * يتم توجيه جميع سجلات الأحداث من Logstash إلى مُسجل ArcSight على عنوان IP `https://192.168.1.73:514`
    * يتم توجيه السجلات من Logstash إلى مُسجل ArcSight بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع مُسجل ArcSight عبر UDP
    * يتم طباعة سجلات Logstash إضافيًا على سطر الأوامر (السطر 15 من الكود). يُستخدم الإعداد للتحقق من تسجيل الأحداث عبر Logstash

```bash linenums="1"
input {
  http { # إضافة المدخلات لحركة المرور HTTP وHTTPS
    port => 5044 # منفذ للطلبات الواردة
    ssl => true # معالجة حركة المرور HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS الخاصة بـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص بشهادة TLS
  }
}
output {
  syslog { # إضافة المخرجات لتوجيه السجلات من Logstash عبر Syslog
    host => "192.168.1.73" # عنوان IP لتوجيه السجلات إليه
    port => "514" # المنفذ لتوجيه السجلات إليه
    protocol => "udp" # بروتوكول الاتصال
    codec => json # تنسيق السجلات الموجهة
  }
  stdout {} # إضافة المخرجات لطباعة سجلات Logstash على سطر الأوامر
}
```

الوصف التفصيلي أكثر لملفات التكوين متاح في [وثائق Logstash الرسمية](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "اختبار تكوين Logstash"
    للتحقق من إنشاء سجلات Logstash وتوجيهها إلى مُسجل ArcSight، يمكن إرسال طلب POST إلى Logstash.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![سجلات Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **الحدث في مُسجل ArcSight:**
    ![حدث مُسجل ArcSight](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### تكوين تكامل Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![تكامل Webhook مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[المزيد من التفاصيل حول تكوين تكامل Logstash](../logstash.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيسجل Logstash الحدث كما يلي:

![سجل حول مستخدم جديد في مُسجل ArcSight من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

سيتم عرض الإدخال التالي في أحداث مُسجل ArcSight:

![بطاقة المستخدم الجديد في مُسجل ArcSight من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)