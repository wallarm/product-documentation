# Micro Focus ArcSight Logger عبر Fluentd

تزودكم هذه التعليمات بمثال على دمج Wallarm مع جامع البيانات Fluentd لإعادة توجيه الأحداث إلى نظام ArcSight Logger.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "الدمج مع نسخة Enterprise من ArcSight ESM"
    لتكوين إعادة توجيه السجلات من Fluentd إلى نسخة Enterprise لـ ArcSight ESM، يُنصح بتكوين موصل Syslog في جانب ArcSight ومن ثم إعادة توجيه السجلات من Fluentd إلى منفذ الموصل. للحصول على وصف أكثر تفصيلاً للموصلات، يُرجى تحميل **دليل مستخدم SmartConnector** من [وثائق ArcSight SmartConnector الرسمية](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## الموارد المستخدمة

* [ArcSight Logger 7.1](#arcsight-logger-configuration) مع عنوان WEB `https://192.168.1.73:443` مثبت على CentOS 7.8
* [Fluentd](#fluentd-configuration) مثبت على Debian 11.x (bullseye) ومتاح على `https://fluentd-example-domain.com`
* وصول المسؤول إلى وحدة تحكم Wallarm في [سحابة EU](https://my.wallarm.com) لـ [تكوين الدمج مع Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط إلى خدمات ArcSight Logger وFluentd مقتبسة كأمثلة، لا تكون متجاوبة.

### تكوين ArcSight Logger

تم تهيئة مستقبل السجلات في ArcSight Logger `سجلات Wallarm Fluentd` كما يلي:

* يتم استقبال السجلات عبر UDP (`نوع = مستقبل UDP`)
* منفذ الاستماع هو `514`
* يتم تحليل الأحداث بواسطة مُحلل ال syslog
* الإعدادات الافتراضية الأخرى

![تكوين المستقبل في ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

للحصول على وصف أكثر تفصيلاً لتكوين المستقبل، يُرجى تحميل **دليل تثبيت Logger** للنسخة المناسبة من [وثائق ArcSight Logger الرسمية](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### تكوين Fluentd

بما أن Wallarm ترسل السجلات إلى جامع البيانات الوسيط Fluentd عبر webhooks، يجب أن يفي تكوين Fluentd بالمتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود عنوان URL عام
* إعادة توجيه السجلات إلى ArcSight Logger، يستخدم هذا المثال الإضافة `remote_syslog` لإعادة توجيه السجلات

يتم تكوين Fluentd في ملف `td-agent.conf`:

* يتم تكوين معالجة webhook الوارد في وجهة `source`:
    * يتم إرسال حركة المرور إلى المنفذ 9880
    * يتم تكوين Fluentd لقبول الاتصالات الآمنة فقط
    * يقع شهادة TLS لـ Fluentd ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * يقع المفتاح الخاص لشهادة TLS ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تكوين إعادة توجيه السجلات إلى ArcSight Logger وإخراج السجل في وجهة `match`:
    * يتم نسخ جميع سجلات الأحداث من Fluentd وإعادة توجيهها إلى ArcSight Logger على عنوان IP `https://192.168.1.73:514`
    * يتم إعادة توجيه السجلات من Fluentd إلى ArcSight Logger بتنسيق JSON وفقًا للمعيار [Syslog](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع ArcSight Logger عبر UDP
    * يتم طباعة سجلات Fluentd بالإضافة إلى ذلك على سطر الأوامر بتنسيق JSON (الأسطر كود 19-22). يُستخدم الإعداد للتحقق من تسجيل الأحداث عبر Fluentd

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
      host 192.168.1.73 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol udp # connection protocol
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

يتوفر وصف أكثر تفصيلاً لملفات التكوين في [وثائق Fluentd الرسمية](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تكوين Fluentd"
    للتحقق من أن سجلات Fluentd يتم إنشاؤها وإعادة توجيهها إلى ArcSight Logger، يمكن إرسال طلب PUT أو POST إلى Fluentd.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Fluentd:**
    ![سجلات في Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **الحدث في ArcSight Logger:**
    ![سجلات في ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### تكوين الدمج مع Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![دمج Webhook مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[المزيد من التفاصيل حول تكوين الدمج مع Fluentd](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سوف يسجل Fluentd الحدث كما يلي:

![سجل Fluentd حول المستخدم الجديد](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

سيتم عرض الإدخال التالي في أحداث ArcSight Logger:

![أحداث في ArccSiight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)