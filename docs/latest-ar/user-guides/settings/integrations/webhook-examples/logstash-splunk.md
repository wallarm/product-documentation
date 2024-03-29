[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise عبر Logstash

توفر لك هذه التعليمات مثالاً على دمج Wallarm مع جامع البيانات Logstash لإعادة توجيه الأحداث إلى نظام Splunk SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## الموارد المستخدمة

* [Splunk Enterprise](#splunk-enterprise-configuration) مع WEB URL `https://109.111.35.11:8000` و API URL `https://109.111.35.11:8088`
* [Logstash 7.7.0](#logstash-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://logstash.example.domain.com`
* الوصول بصلاحيات المدير إلى وحدة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) ل[تكوين دمج Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

نظرًا لكون الروابط المشار إليها لخدمات Splunk Enterprise وLogstash مثالية، فهي لا تستجيب.

### تكوين Splunk Enterprise

يتم إرسال سجلات Logstash إلى Splunk HTTP Event Controller بالاسم `Wallarm Logstash logs` وإعدادات افتراضية أخرى:

![تكوين HTTP Event Collector](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

للوصول إلى HTTP Event Controller، سيتم استخدام الرمز المولد `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb`.

تتوفر وصف أكثر تفصيلاً لإعداد HTTP Event Controller لـ Splunk في [الوثائق الرسمية لـ Splunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### تكوين Logstash

نظرًا لأن Wallarm ترسل السجلات إلى جامع البيانات المتوسط Logstash عبر webhooks، يجب أن يفي تكوين Logstash بالمتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* توجيه السجلات إلى Splunk Enterprise، هذا المثال يستخدم الإضافة `http` لتوجيه السجلات

يتم تكوين Logstash في ملف `logstash-sample.conf`:

* يتم تكوين معالجة webhook الواردة في قسم `input`:
    * يتم إرسال الحركة إلى المنفذ 5044
    * Logstash مُكون لقبول الاتصالات HTTPS فقط
    * شهادة TLS لـ Logstash الموقعة من قِبل CA موثوق بها علنًا توجد ضمن الملف `/etc/server.crt`
    * المفتاح الخاص لشهادة TLS يوجد ضمن الملف `/etc/server.key`
* يتم تكوين توجيه السجلات إلى Splunk وإخراج السجل في قسم `output`:
    * تتم إعادة توجيه السجلات من Logstash إلى Splunk بتنسيق JSON
    * يتم توجيه جميع سجلات الأحداث من Logstash إلى نقطة النهاية لـ API Splunk `https://109.111.35.11:8088/services/collector/raw` عبر طلبات POST. لتفويض الطلبات، يُستخدم رمز HTTPS Event Collector
    * بالإضافة إلى ذلك، يتم طباعة سجلات Logstash على سطر الأوامر (السطر 15 من الكود). يُستخدم الإعداد للتحقق من تسجيل الأحداث عبر Logstash

```bash linenums="1"
input {
  http { # إضافة مدخلات لحركة HTTP وHTTPS
    port => 5044 # المنفذ للطلبات الواردة
    ssl => true # معالجة حركة HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS لـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  http { # إضافة مخرجات لإعادة توجيه السجلات من Logstash عبر بروتوكول HTTP/HTTPS
    format => "json" # تنسيق السجلات المعاد توجيهها
    http_method => "post" # الطريقة الHTTP المستخدمة لإعادة توجيه السجلات
    url => "https://109.111.35.11:8088/services/collector/raw" # نقطة النهاية لإعادة توجيه السجلات إليها
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # رؤوس HTTP لتفويض الطلبات
  }
  stdout {} # إضافة مخرجات لطباعة سجلات Logstash على سطر الأوامر
}
```

تتوفر وصف أكثر تفصيلاً لملفات التكوين في [الوثائق الرسمية لـ Logstash](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "اختبار تكوين Logstash"
    للتحقق من أن سجلات Logstash تم إنشاؤها وإرسالها إلى Splunk، يمكن إرسال طلب POST إلى Logstash.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![سجلات Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **حدث Splunk:**
    ![أحداث Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### تكوين دمج Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![دمج Webhook مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[المزيد من التفاصيل عن تكوين دمج Logstash](../logstash.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيقوم Logstash بتسجيل الحدث كما يلي:

![سجل عن مستخدم جديد في Splunk من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

سيتم عرض السجل التالي في أحداث Splunk:

![بطاقة المستخدم الجديد في Splunk من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## تنظيم الأحداث في لوحة بيانات

--8<-- "../include/integrations/application-for-splunk.md"