# IBM QRadar عبر Logstash

توفر لك هذه التعليمات مثالًا على تكامل Wallarm مع جامع بيانات Logstash لإعادة توجيه الأحداث إلى نظام QRadar SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![سير عمل الويب هوك](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## الموارد المستخدمة

* [Logstash 7.7.0](#logstash-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://logstash.example.domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) مُثبت على Linux Red Hat ومتاح مع عنوان IP `https://109.111.35.11:514`
* وصول المسؤول إلى لوحة تحكم Wallarm في [سحابة EU](https://my.wallarm.com) لـ [تكوين تكامل Logstash](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط لخدمات Logstash وQRadar مستشهد بها كأمثلة، فإنها لا تستجيب.

### تكوين Logstash

بما أن Wallarm يرسل السجلات إلى جمع البيانات الوسيط Logstash عبر الويب هوك، يجب أن يفي تكوين Logstash بالمتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* إعادة توجيه السجلات إلى IBM Qradar، هذا المثال يستخدم إضافة `syslog` لإعادة توجيه السجلات

يتم تكوين Logstash في ملف `logstash-sample.conf`:

* يتم تكوين معالجة ويب هوك الوارد في قسم `input`:
    * يتم إرسال الحركة إلى المنفذ 5044
    * Logstash مُكوّن لقبول الاتصالات HTTPS فقط
    * شهادة TLS الخاصة بLogstash موقّعة من قِبل CA موثوق بها علنًا تقع ضمن الملف `/etc/server.crt`
    * المفتاح الخاص لشهادة TLS يقع ضمن الملف `/etc/server.key`
* يتم تكوين إعادة توجيه السجلات إلى QRadar وإخراج السجل في قسم `output`:
    * يتم إعادة توجيه كل سجلات الأحداث من Logstash إلى QRadar عن طريق عنوان IP `https://109.111.35.11:514`
    * يتم إعادة توجيه السجلات من Logstash إلى QRadar بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع QRadar عبر TCP
    * يتم طباعة سجلات Logstash أيضًا على سطر الأوامر (السطر الخامس عشر). يتم استخدام الإعداد للتحقق من تسجيل الأحداث عبر Logstash

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  syslog { # output plugin to forward logs from Logstash via Syslog
    host => "109.111.35.11" # IP address to forward logs to
    port => "514" # port to forward logs to
    protocol => "tcp" # connection protocol
    codec => json # format of forwarded logs
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

يتوفر وصف أكثر تفصيلًا لملفات التكوين في [وثائق Logstash الرسمية](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

!!! info "اختبار تكوين Logstash"
    للتحقق من أن سجلات Logstash يتم إنشاؤها وإعادة توجيهها إلى QRadar، يمكن إرسال طلب POST إلى Logstash.

    **مثال على الطلب:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Logstash:**
    ![السجلات في Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **سجلات QRadar:**
    ![السجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **بيانات سجل QRadar:**
    ![بطاقة مستخدم جديد في QRadar من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### تكوين QRadar (اختياري)

في QRadar، يتم تكوين مصدر السجل. يساعد ذلك في العثور بسهولة على سجلات Logstash في قائمة جميع السجلات في QRadar، ويمكن أيضًا استخدامه لتصفية السجلات مستقبلاً. يتم تكوين مصدر السجل على النحو التالي:

* **اسم مصدر السجل**: `Logstash`
* **وصف مصدر السجل**: `سجلات من Logstash`
* **نوع مصدر السجل**: نوع محلل سجلات الوارد المستخدم مع معيار Syslog `Universal LEEF`
* **تكوين البروتوكول**: معيار إعادة توجيه السجلات `Syslog`
* **مُعرف مصدر السجل**: عنوان IP لـLogstash
* الإعدادات الافتراضية الأخرى

يتوفر وصف أكثر تفصيلًا لإعداد مصدر السجل في QRadar في [الوثائق الرسمية لIBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![إعداد مصدر السجل QRadar لـLogstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### تكوين تكامل Logstash

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![تكامل ويب هوك مع Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[مزيد من التفاصيل حول تكوين تكامل Logstash](../logstash.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيقوم Logstash بتسجيل الحدث على النحو التالي:

![سجل عن المستخدم الجديد في QRadar من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

سيتم عرض البيانات التالية بتنسيق JSON في بيانات سجل QRadar:

![بطاقة مستخدم جديد في QRadar من Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)