[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise عن طريق Logstash

توفر لك هذه التعليمات مثالًا على تكامل Wallarm مع جامع البيانات Logstash لإعادة توجيه الأحداث إلى نظام SIEM الخاص بـ Splunk.

--8<-- "../include/integrations/webhook-examples/overview.md"

![سير عمل Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## الموارد المستخدمة

* [Splunk Enterprise](#splunk-enterprise-configuration) بعنوان WEB URL `https://109.111.35.11:8000` و API URL `https://109.111.35.11:8088`
* [Logstash 7.7.0](#logstash-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://logstash.example.domain.com`
* وصول إداري إلى وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) لـ [تكوين تكامل Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط إلى خدمات Splunk Enterprise وLogstash تُذكر كأمثلة، فهي لا تستجيب.

### تكوين Splunk Enterprise

تُرسل سجلات Logstash إلى Splunk HTTP Event Controller باسم `سجلات Wallarm Logstash` وإعدادات افتراضية أخرى:

![تكوين HTTP Event Collector](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

للوصول إلى HTTP Event Collector، سيتم استخدام الرمز المُولّد `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb`.

وصف أكثر تفصيلاً لإعداد Splunk HTTP Event Collector متاح في [الوثائق الرسمية لـ Splunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### تكوين Logstash

بما أن Wallarm تُرسل السجلات إلى جامع البيانات الوسيط Logstash عبر الويب هوكس، فينبغي أن يلبي تكوين Logstash المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* إعادة توجيه السجلات إلى Splunk Enterprise، يستخدم هذا المثال البرنامج المساعد `http` لإعادة توجيه السجلات

يتم تكوين Logstash في ملف `logstash-sample.conf`:

* يتم تكوين معالجة الويب هوك الوارد في قسم `input`:
    * يتم إرسال الحركة إلى المنفذ 5044
    * يتم تكوين Logstash لقبول الاتصالات HTTPS فقط
    * شهادة TLS لـ Logstash موقعة من CA موثوق به عامةً موجودة ضمن الملف `/etc/server.crt`
    * المفتاح الخاص لشهادة TLS موجود ضمن الملف `/etc/server.key`
* يتم تكوين إعادة توجيه السجلات إلى Splunk وإخراج السجل في قسم `output`:
    * يتم إعادة توجيه السجلات من Logstash إلى Splunk بتنسيق JSON
    * يتم إعادة توجيه كل سجلات الأحداث من Logstash إلى نقطة النهاية API لـ Splunk `https://109.111.35.11:8088/services/collector/raw` عبر طلبات POST. لتفويض الطلبات، يتم استخدام رمز HTTPS Event Collector
    * يتم طباعة سجلات Logstash إضافيًا على سطر الأوامر (السطر الخامس عشر من الرمز). يتم استخدام الإعداد للتحقق من أن الأحداث يتم تسجيلها عبر Logstash

```bash linenums="1"
input {
  http { # البرنامج المساعد لحركة HTTP و HTTPS
    port => 5044 # المنفذ للطلبات الواردة
    ssl => true # معالجة حركة HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  http { # البرنامج المساعد لإعادة توجيه السجلات من Logstash عبر بروتوكول HTTP/HTTPS
    format => "json" # تنسيق السجلات المعاد توجيهها
    http_method => "post" # طريقة HTTP المستخدمة لإعادة توجيه السجلات
    url => "https://109.111.35.11:8088/services/collector/raw" # نقطة النهاية لإعادة توجيه السجلات إليها
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # رؤوس HTTP لتفويض الطلبات
  }
  stdout {} # البرنامج المساعد لطباعة سجلات Logstash على سطر الأوامر
}
```

يتوفر وصف أكثر تفصيلاً لملفات التكوين في [الوثائق الرسمية لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! معلومات "اختبار تكوين Logstash"
    للتحقق من أن سجلات Logstash يتم إنشاؤها وإعادة توجيهها إلى Splunk، يمكن إرسال طلب POST إلى Logstash.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![سجلات Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **حدث في Splunk:**
    ![أحداث في Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### تكوين تكامل Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![تكامل Webhook مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[المزيد من التفاصيل حول تكوين التكامل لـ Logstash](../logstash.md)

## اختبار الأمثلة

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيقوم Logstash بتسجيل الحدث كما يلي:

![سجل عن مستخدم جديد في Splunk من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

سيتم عرض الإدخال التالي في أحداث Splunk:

![بطاقة مستخدم جديد في Splunk من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## تنظيم الأحداث في لوحة القيادة

--8<-- "../include/integrations/application-for-splunk.md"