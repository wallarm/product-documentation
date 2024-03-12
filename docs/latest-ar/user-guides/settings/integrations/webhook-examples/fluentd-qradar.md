# IBM QRadar عبر Fluentd

تُقدم لك هذه التعليمات مثالًا عن تكامل Wallarm مع جامع البيانات Fluentd لإرسال الأحداث بعد ذلك إلى نظام QRadar SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## الموارد المستخدمة

* [Fluentd](#fluentd-configuration) مُثبت على Debian 11.x (bullseye) ومتاح على `https://fluentd-example-domain.com`
* [QRadar V7.3.3](#qradar-configuration-optional) مُثبت على Linux Red Hat ومتاح بعنوان IP `https://109.111.35.11:514`
* حق الوصول كمدير إلى واجهة Wallarm Console في [السحابة الأوروبية](https://my.wallarm.com) لـ [تكوين تكامل Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط لخدمات Fluentd وQRadar مذكورة كأمثلة، فهي لا تستجيب.

### تكوين Fluentd

بما أن Wallarm يرسل السجلات إلى جامع البيانات الوسيط Fluentd عبر webhooks، يجب أن يلبي تكوين Fluentd المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* توجيه السجلات إلى IBM Qradar، يستخدم هذا المثال إضافة `remote_syslog` لتوجيه السجلات

يتم تكوين Fluentd في ملف `td-agent.conf`:

* يتم تكوين معالجة ال webhook الوارد في التوجيه `source`:
    * يتم إرسال الحركة إلى المنفذ 9880
    * Fluentd مكوّن لقبول الاتصالات HTTPS فقط
    * يقع شهادة TLS لـ Fluentd ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * يقع المفتاح الخاص لشهادة TLS ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تكوين توجيه السجلات إلى QRadar وإخراج السجل في التوجيه `match`:
    * يتم نسخ جميع سجلات الأحداث من Fluentd وتوجيهها إلى QRadar عند عنوان IP `https://109.111.35.11:514`
    * يتم توجيه السجلات من Fluentd إلى QRadar بتنسيق JSON وفقًا لمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء اتصال مع QRadar عبر TCP
    * يتم طباعة سجلات Fluentd إضافيًا على السطر الأمر بتنسيق JSON (أسطر الكود 19-22). يُستخدم الإعداد للتحقق من أن الأحداث يتم تسجيلها عبر Fluentd

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

يمكن العثور على وصف أكثر تفصيلًا لملفات التكوين في [الوثائق الرسمية لـ Fluentd](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تكوين Fluentd"
    للتحقق من أن سجلات Fluentd يتم إنشاؤها وتوجيهها إلى QRadar، يمكن إرسال طلب PUT أو POST إلى Fluentd.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Fluentd:**
    ![سجلات في Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **سجلات QRadar:**
    ![سجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **محتوى سجل QRadar:**
    ![سجلات في QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### تكوين QRadar (اختياري)

في QRadar، يتم تكوين مصدر السجل. يساعد ذلك في العثور بسهولة على سجلات Fluentd ضمن قائمة جميع السجلات في QRadar، ويمكن أيضًا استخدامها لتصفية السجلات بشكل أفضل. يتم تكوين مصدر السجل كما يلي:

* **اسم مصدر السجل**: `Fluentd`
* **وصف مصدر السجل**: `سجلات من Fluentd`
* **نوع مصدر السجل**: نوع محلل السجلات الواردة المستخدم مع معيار Syslog `Universal LEEF`
* **تكوين البروتوكول**: معيار توجيه السجلات `Syslog`
* **معرف مصدر السجل**: عنوان IP لـ Fluentd
* إعدادات افتراضية أخرى

يمكن العثور على وصف أكثر تفصيلًا لإعداد مصدر السجل في QRadar في [الوثائق الرسمية لـ IBM](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf).

![إعداد مصدر السجل QRadar لـ Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### تكوين تكامل Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![تكامل Webhook مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[المزيد من التفاصيل حول تكوين تكامل Fluentd](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيسجل Fluentd الحدث كما يلي:

![سجل حول مستخدم جديد في QRadar من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

سيتم عرض البيانات التالية بتنسيق JSON في محتوى سجل QRadar:

![بطاقة المستخدم الجديد في QRadar من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)