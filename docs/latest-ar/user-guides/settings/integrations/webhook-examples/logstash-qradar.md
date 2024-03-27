# IBM QRadar عن طريق Logstash

هذه التعليمات تزودك بمثال لتكامل Wallarm مع جامع بيانات Logstash لتوجيه الأحداث إلى نظام QRadar SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## الموارد المستخدمة

* [Logstash 7.7.0](#logstash-configuration) مثبت على Debian 11.x (bullseye) ومتاح عبر `https://logstash.example.domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) مثبت على Linux Red Hat ومتاح بعنوان IP `https://109.111.35.11:514`
* الوصول كمدير إلى لوحة تحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) لـ [تكوين تكامل Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

نظرًا لأن الروابط إلى خدمات Logstash وQRadar مذكورة كأمثلة، لا تستجيب.

### تكوين Logstash

بما أن Wallarm ترسل السجلات إلى جامع البيانات الوسيط Logstash عبر الواجهات البرمجية للويب، يجب أن يفي تكوين Logstash بالمتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* امتلاك رابط URL عام
* توجيه السجلات إلى IBM Qradar، يستخدم هذا المثال مكوّن الإضافي `syslog` لتوجيه السجلات

يتم تكوين Logstash في ملف `logstash-sample.conf`:

* يتم تكوين معالجة الواجهة البرمجية للويب الواردة في قسم `input`:
    * يتم إرسال الحركة إلى المنفذ 5044
    * يتم تكوين Logstash لقبول الاتصالات HTTPS فقط
    * شهادة TLS الخاصة بـ Logstash موقعة من CA موثوق به عامة وموجودة ضمن الملف `/etc/server.crt`
    * المفتاح الخاص لشهادة TLS موجود ضمن الملف `/etc/server.key`
* يتم تكوين توجيه السجلات إلى QRadar وإخراج السجلات في قسم `output`:
    * يتم توجيه جميع سجلات الأحداث من Logstash إلى QRadar على عنوان IP `https://109.111.35.11:514`
    * يتم توجيه السجلات من Logstash إلى QRadar بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع QRadar عبر TCP
    * يتم طباعة سجلات Logstash إضافيًا على سطر الأوامر (السطر 15 من الكود). يتم استخدام الإعداد للتحقق من أن الأحداث يتم تسجيلها عبر Logstash

```bash linenums="1"
input {
  http { # مكون إضافي للمدخلات للمرور HTTP و HTTPS
    port => 5044 # ميناء للطلبات الواردة
    ssl => true # معالجة المرور HTTPS
    ssl_certificate => "/etc/server.crt" # شهادة TLS الخاصة بـ Logstash
    ssl_key => "/etc/server.key" # المفتاح الخاص لشهادة TLS
  }
}
output {
  syslog { # المكون الإضافي الناتج لتوجيه السجلات من Logstash عبر Syslog
    host => "109.111.35.11" # عنوان IP لتوجيه السجلات إليه
    port => "514" # ميناء لتوجيه السجلات إليه
    protocol => "tcp" # بروتوكول الاتصال
    codec => json # تنسيق السجلات الموجهة
  }
  stdout {} # مكون إضافي للناتج لطباعة سجلات Logstash على سطر الأوامر
}
```

يتوفر وصف أكثر تفصيلاً لملفات التكوين في [وثائق Logstash الرسمية](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "اختبار تكوين Logstash"
    للتحقق من أن سجلات Logstash يتم إنشاؤها وتوجيهها إلى QRadar، يمكن إرسال طلب POST إلى Logstash.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![السجلات في Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **سجلات QRadar:**
    ![السجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **بيانات سجل QRadar:**
    ![السجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### تكوين QRadar (اختياري)

في QRadar، يتم تكوين مصدر السجل. يساعد ذلك في العثور بسهولة على سجلات Logstash في قائمة جميع السجلات في QRadar، ويمكن أيضًا استخدامه لمزيد من التصفية للسجلات. يتم تكوين مصدر السجل كما يلي:

* **اسم مصدر السجل**: `Logstash`
* **وصف مصدر السجل**: `سجلات من Logstash`
* **نوع مصدر السجل**: نوع محلل سجلات الواردة المستخدم مع معيار Syslog `Universal LEEF`
* **تكوين البروتوكول**: معيار توجيه السجلات `Syslog`
* **معرّف مصدر السجل**: عنوان IP لـLogstash
* إعدادات افتراضية أخرى

يتوفر وصف أكثر تفصيلاً لإعداد مصدر السجل QRadar في [الوثائق الرسمية لـ IBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![إعداد مصدر سجل QRadar لـ Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### تكوين تكامل Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![تكامل Webhook مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[المزيد من التفاصيل حول تكوين تكامل Logstash](../logstash.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيسجل Logstash الحدث كما يلي:

![سجل عن مستخدم جديد في QRadar من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

سيتم عرض البيانات التالية بتنسيق JSON في بيانات سجل QRadar:

![بطاقة المستخدم الجديد في QRadar من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)