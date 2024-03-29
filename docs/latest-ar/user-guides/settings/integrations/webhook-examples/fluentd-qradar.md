# IBM QRadar عبر Fluentd

توفر لك هذه التعليمات مثالاً للتكامل بين Wallarm وجامع البيانات Fluentd لإعادة توجيه الأحداث إلى نظام إدارة أحداث ومعلومات الأمان QRadar.

--8<-- "../include/integrations/webhook-examples/overview.md"

![سير عمل Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## الموارد المستخدمة

* [Fluentd](#fluentd-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://fluentd-example-domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) مُثبت على Linux Red Hat ومتوفر بعنوان IP `https://109.111.35.11:514`
* الوصول الإداري إلى وحدة التحكم Wallarm في [السحابة الأوروبية](https://my.wallarm.com) لـ [تهيئة تكامل Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط المشار إليها لخدمات Fluentd وQRadar هي مثالية، فإنها لا تستجيب.

### تهيئة Fluentd

بما أن Wallarm يرسل السجلات إلى جامع البيانات المتوسط Fluentd عبر webhooks، يجب أن تلبي تهيئة Fluentd المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* امتلاك عنوان URL عام
* إعادة توجيه السجلات إلى IBM Qradar، ويستخدم هذا المثال الإضافة `remote_syslog` لإعادة توجيه السجلات

يتم تهيئة Fluentd في ملف `td-agent.conf`:

* يتم تهيئة معالجة الويب هوك الواردة في توجيه `source`:
    * يتم إرسال الحركة إلى المنفذ 9880
    * Fluentd مُهيأ لقبول الاتصالات HTTPS فقط
    * شهادة TLS Fluentd الموقعة من قبل CA موثوق بها علنًا توجد ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * يوجد المفتاح الخاص لشهادة TLS ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تهيئة إعادة توجيه السجلات إلى QRadar وإخراج السجل في توجيه `match`:
    * يتم نسخ جميع سجلات الأحداث من Fluentd وإعادة توجيهها إلى QRadar على عنوان IP `https://109.111.35.11:514`
    * يتم إعادة توجيه السجلات من Fluentd إلى QRadar بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال بـ QRadar عبر TCP
    * يتم طباعة سجلات Fluentd إضافياً على سطر الأوامر بتنسيق JSON (الأسطر 19-22 من الكود). يُستخدم الإعداد للتحقق من تسجيل الأحداث عبر Fluentd

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # output plugin to forward logs from Fluentd via Syslog
      host 109.111.35.11 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol tcp # connection protocol
    <format>
      @type json # format of forwarded logs
    </format>
  </store>
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

يتوفر وصف أكثر تفصيلاً لملفات التهيئة في [الوثائق الرسمية لـ Fluentd](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تهيئة Fluentd"
    للتحقق من تكوين سجلات Fluentd وإعادة توجيهها إلى QRadar، يمكن إرسال طلب PUT أو POST إلى Fluentd.

    **مثال على الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات في Fluentd:**
    ![السجلات في Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **سجلات في QRadar:**
    ![السجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **عبء سجل QRadar:**
    ![عبء السجل في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### تهيئة QRadar (اختياري)

في QRadar، يتم تهيئة مصدر السجل. يساعد ذلك في العثور بسهولة على سجلات Fluentd في قائمة جميع السجلات في QRadar، ويمكن استخدامه أيضًا لتصفية السجلات بشكل أكبر. يتم تهيئة مصدر السجل كما يلي:

* **اسم مصدر السجل**: `Fluentd`
* **وصف مصدر السجل**: `سجلات من Fluentd`
* **نوع مصدر السجل**: نوع مُحلل السجلات الواردة المستخدم مع معيار Syslog `Universal LEEF`
* **تهيئة البروتوكول**: معيار إعادة توجيه السجلات `Syslog`
* **معرف مصدر السجل**: عنوان IP لـ Fluentd
* إعدادات افتراضية أخرى

يتوفر وصف أكثر تفصيلاً لإعداد مصدر سجل QRadar في [الوثائق الرسمية لـ IBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![إعداد مصدر السجل QRadar لـ Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### تهيئة التكامل مع Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![تكامل Webhook مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[المزيد من التفاصيل حول تهيئة التكامل مع Fluentd](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

ستسجل Fluentd الحدث على النحو التالي:

![سجل حول مستخدم جديد في QRadar من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

سيتم عرض البيانات التالية بتنسيق JSON في عبء سجل QRadar:

![بطاقة المستخدم الجديد في QRadar من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)