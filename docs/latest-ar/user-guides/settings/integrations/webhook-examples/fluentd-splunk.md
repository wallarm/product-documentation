[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# إعداد Splunk Enterprise عن طريق Fluentd

تقدم هذه التعليمات لكم مثال على دمج Wallarm مع جمّاع البيانات Fluentd لإعادة توجيه الأحداث إلى نظام Splunk SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![مخطط Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## الموارد المستخدمة

* [Splunk Enterprise](#splunk-enterprise-configuration) مع عنوان WEB `https://109.111.35.11:8000` وعنوان API `https://109.111.35.11:8088`
* [Fluentd](#fluentd-configuration) مثبت على Debian 11.x (bullseye) ومتاح على `https://fluentd-example-domain.com`
* وصول مدير إلى واجهة Wallarm Console في [سحابة الاتحاد الأوروبي](https://my.wallarm.com) لـ [تكوين دمج Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط لخدمات Splunk Enterprise وFluentd مذكورة كأمثلة، فإنها لا تستجيب.

### إعداد Splunk Enterprise

تُرسل سجلات Fluentd إلى متحكم أحداث HTTP في Splunk باسم `سجلات Wallarm Fluentd` وإعدادات افتراضية أخرى:

![تكوين متحكم الحدث HTTP](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

للوصول إلى متحكم الحدث HTTP، سيتم استخدام الرمز المُنشأ `f44b3179-91aa-44f5-a6f7-202265e10475`.

وصف أكثر تفصيلًا لإعداد متحكم الحدث HTTP في Splunk متوفر في [الوثائق الرسمية لـ Splunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### إعداد Fluentd

بما أن Wallarm ترسل السجلات إلى جمّاع البيانات Fluentd الوسيط عبر webhooks، فينبغي أن يلبي إعداد Fluentd المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* وجود URL عام
* إعادة توجيه السجلات إلى Splunk Enterprise، يستخدم هذا المثال الإضافة `splunk_hec` لإعادة التوجيه

يتم تكوين Fluentd في ملف `td-agent.conf`:

* يتم تكوين معالجة webhook الوارد في توجيه `source`:
    * يتم إرسال الحركة إلى المنفذ 9880
    * Fluentd مُعد لقبول اتصالات HTTPS فقط
    * شهادة TLS لـ Fluentd الموقعة من CA موثوق به علنًا تقع ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * المفتاح الخاص لشهادة TLS يقع ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تكوين إعادة توجيه السجلات إلى Splunk وإخراج السجل في توجيه `match`:
    * يتم نسخ جميع سجلات الأحداث من Fluentd وإعادة توجيهها إلى متحكم أحداث HTTP في Splunk عبر الإضافة الخارجة [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)
    * تُطبع سجلات Fluentd أيضًا على سطر الأوامر بتنسيق JSON (أسطر الكود 19-22). يتم استخدام الإعداد للتحقق من أن الأحداث يتم تسجيلها عبر Fluentd

```bash linenums="1"
<source>
  @type http # إضافة الإدخال لحركة HTTP وHTTPS
  port 9880 # منفذ للطلبات الواردة
  <transport tls> # تكوين لمعالجة الاتصالات
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # إضافة الإخراج fluent-plugin-splunk-hec لتوجيه السجلات إلى واجهة Splunk API عبر متحكم أحداث HTTP
      hec_host 109.111.35.11 # مضيف Splunk
      hec_port 8088 # منفذ API Splunk
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # رمز متحكم الحدث HTTP
    <format>
      @type json # تنسيق السجلات الموجهة
    </format>
  </store>
  <store>
     @type stdout # إضافة الإخراج لطباعة سجلات Fluentd على سطر الأوامر
     output_type json # تنسيق السجلات المطبوعة على سطر الأوامر
  </store>
</match>
```

وصف أكثر تفصيلًا لملفات التكوين متوفر في [الوثائق الرسمية لـ Fluentd](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تكوين Fluentd"
    للتحقق من أن السجلات في Fluentd يتم إنشاؤها وتوجيهها إلى Splunk، يمكن إرسال طلب PUT أو POST إلى Fluentd.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات Fluentd:**
    ![سجلات في Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **سجلات Splunk:**
    ![سجلات في Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### تكوين دمج Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![دمج Webhook مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[مزيد من التفاصيل حول تكوين دمج Fluentd](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيسجل Fluentd الحدث كما يلي:

![سجل عن مستخدم جديد في Splunk من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

سيتم عرض الإدخال التالي في أحداث Splunk:

![بطاقة المستخدم الجديد في Splunk من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## تنظيم الأحداث في Splunk Enterprise في لوحة معلومات

--8<-- "../include/integrations/application-for-splunk.md"