# مايكرو فوكس آركسايت لوجر من خلال فلونتد

تزودك هذه التعليمات بمثال عن دمج وولآرم مع جامع البيانات فلونتد لإعادة توجيه الأحداث إلى نظام آركسايت لوجر.

--8<-- "../include/integrations/webhook-examples/overview.md"

![مسار الويب هوك](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "الدمج مع نسخة الشركات من آركسايت إي إس إم"
    لتكوين إعادة توجيه السجلات من فلونتد إلى نسخة الشركات من آركسايت إي إس إم، يُنصح بتكوين موصل السيسلوج على جانب آركسايت ثم إعادة توجيه السجلات من فلونتد إلى منفذ الموصل. للحصول على وصف أكثر تفصيلاً للموصلات، يُرجى تنزيل **دليل مستخدم سمارتكونيكتور** من [التوثيق الرسمي لسمارتكونيكتور آركسايت](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs).

## الموارد المستخدمة

* [آركسايت لوجر 7.1](#arcsight-logger-configuration) مثبت على CentOS 7.8 مع عنوان الويب `https://192.168.1.73:443`
* [فلونتد](#fluentd-configuration) مثبت على Debian 11.x (bullseye) ومتاح على `https://fluentd-example-domain.com`
* وصول المدير إلى وحدة تحكم وولآرم في [سحابة الاتحاد الأوروبي](https://my.wallarm.com) لـ [تكوين دمج فلونتد](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط إلى خدمات آركسايت لوجر وفلونتد مذكورة كأمثلة، فهي لا تستجيب.

###Configuration

آركسايت لوجر قد تم تكوينه لاستقبال السجلات `سجلات وولآرم فلونتد` كما يلي:

* استقبال السجلات عبر UDP (`نوع = مستقبل UDP`)
* المنفذ المستمع هو `514`
* الأحداث تُحلل بواسطة محلل السيسلوج
* إعدادات افتراضية أخرى

![تكوين المستقبل في آركسايت لوجر](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

للحصول على وصف أكثر تفصيلاً لتكوين المستقبل، يُرجى تنزيل **دليل تثبيت اللوجر** للإصدار المناسب من [التوثيق الرسمي لآركسايت لوجر](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc).

### تكوين فلونتد

بما أن وولآرم ترسل السجلات إلى جامع البيانات الوسيط فلونتد عبر الويب هوك، يجب أن يفي تكوين فلونتد بما يلي:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* إعادة توجيه السجلات إلى آركسايت لوجر، يستخدم هذا المثال الإضافة `remote_syslog` لإعادة توجيه السجلات

يتم تكوين فلونتد في ملف `td-agent.conf`:

* يتم تكوين معالجة ويب هوك الوارد في توجيه `source`:
    * يتم إرسال حركة المرور إلى المنفذ 9880
    * فلونتد مكون لقبول الاتصالات HTTPS فقط
    * شهادة TLS فلونتد الموقعة من قبل CA موثوق بها علنًا موجودة ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * المفتاح الخاص لشهادة TLS موجود ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تكوين إعادة توجيه السجلات إلى آركسايت لوجر وإخراج السجل في توجيه `match`:
    * يتم نسخ جميع سجلات الأحداث من فلونتد وإعادة توجيهها إلى آركسايت لوجر عند عنوان IP `https://192.168.1.73:514`
    * يتم إعادة توجيه السجلات من فلونتد إلى آركسايت لوجر بتنسيق JSON وفقًا للمعيار [السيسلوج](https://en.wikipedia.org/wiki/Syslog)
    * يتم إنشاء الاتصال مع آركسايت لوجر عبر UDP
    * يتم طباعة سجلات فلونتد بالإضافة إلى ذلك على سطر الأوامر بتنسيق JSON (أسطر الكود 19-22). يتم استخدام الإعداد للتحقق من أن الأحداث يتم تسجيلها عبر فلونتد

```bash linenums="1"
<source>
  @type http # الإضافة الواردة لحركة المرور HTTP و HTTPS
  port 9880 # المنفذ للطلبات الواردة
  <transport tls> # تكوين لمعالجة الاتصالات
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # الإضافة الصادرة لإعادة توجيه السجلات من فلونتد عبر سيسلوج
      host 192.168.1.73 # عنوان IP لإعادة توجيه السجلات إليه
      port 514 # المنفذ لإعادة توجيه السجلات إليه
      protocol udp # بروتوكول الاتصال
    <format>
      @type json # تنسيق السجلات المعاد توجيهها
    </format>
  </store>
  <store>
     @type stdout # الإضافة الصادرة لطباعة سجلات فلونتد على سطر الأوامر
     output_type json # تنسيق السجلات المطبوعة على سطر الأوامر
  </store>
</match>
```

وصف أكثر تفصيلاً لملفات التكوين متاح في [التوثيق الرسمي لفلونتد](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تكوين فلونتد"
    للتحقق من أن سجلات فلونتد تم إنشاؤها وإعادة توجيهها إلى آركسايت لوجر، يمكن إرسال طلب POST أو PUT إلى فلونتد.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات فلونتد:**
    ![سجلات في فلونتد](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **الحدث في آركسايت لوجر:**
    ![سجلات في آركسايت لوجر](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### تكوين دمج فلونتد

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![دمج الويب هوك مع فلونتد](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[المزيد من التفاصيل حول تكوين دمج فلونتد](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيسجل فلونتد الحدث كما يلي:

![سجل فلونتد عن مستخدم جديد](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

سيتم عرض الإدخال التالي في أحداث آركسايت لوجر:

![أحداث في آركسايت لوجر](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)