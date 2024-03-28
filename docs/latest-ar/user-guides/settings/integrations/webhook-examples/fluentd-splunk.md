[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk Enterprise عبر Fluentd

توفر لك هذه التعليمات مثالًا لدمج Wallarm مع جمع البيانات Fluentd لإعادة توجيه الأحداث إلى نظام Splunk SIEM.

--8<-- "../include/integrations/webhook-examples/overview.md"

![تدفق Webhook](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## الموارد المُستخدمة

* [Splunk Enterprise](#splunk-enterprise-configuration) مع العنوان الشبكي `https://109.111.35.11:8000` وعنوان API `https://109.111.35.11:8088`
* [Fluentd](#fluentd-configuration) مُثبت على Debian 11.x (bullseye) ومُتاح على العنوان `https://fluentd-example-domain.com`
* وصول المسؤول إلى وحدة التحكم Wallarm في [سحابة الاتحاد الأوروبي](https://my.wallarm.com) لـ[تكوين تكامل Fluentd](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

بما أن الروابط المشار إليها لخدمات Splunk Enterprise وFluentd هي أمثلة، فهي لا تستجيب.

### تكوين Splunk Enterprise

يتم إرسال سجلات Fluentd إلى Splunk HTTP Event Controller بالاسم `Wallarm Fluentd logs` والإعدادات الافتراضية الأخرى:

![تكوين HTTP Event Collector](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

للوصول إلى HTTP Event Controller، سيتم استخدام الرمز المُنشأ `f44b3179-91aa-44f5-a6f7-202265e10475`.

وصف أكثر تفصيلًا لإعداد Splunk HTTP Event Controller متوفر في [وثائق Splunk الرسمية](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector).

### تكوين Fluentd

بما أن Wallarm يرسل السجلات إلى جامع البيانات الوسيط Fluentd عبر webhooks، فيجب أن يلبي تكوين Fluentd المتطلبات التالية:

* قبول طلبات POST أو PUT
* قبول طلبات HTTPS
* الحصول على عنوان URL عام
* إعادة توجيه السجلات إلى Splunk Enterprise، يستخدم هذا المثال الإضافة `splunk_hec` لإعادة توجيه السجلات

يتم تكوين Fluentd في ملف `td-agent.conf`:

* يتم تكوين معالجة الويب الوارد في التوجيه `source`:
    * يتم إرسال الحركة إلى المنفذ 9880
    * يُكون Fluentd لقبول الاتصالات HTTPS فقط
    * شهادة TLS Fluentd الموقعة من قبل CA موثوق بها علنًا موجودة ضمن الملف `/etc/ssl/certs/fluentd.crt`
    * المفتاح الخاص لشهادة TLS موجود ضمن الملف `/etc/ssl/private/fluentd.key`
* يتم تكوين إعادة توجيه السجلات إلى Splunk وطباعة السجلات في التوجيه `match`:
    * جميع سجلات الأحداث يتم نسخها من Fluentd وإعادة توجيهها إلى Splunk HTTP Event Collector عبر إضافة الإخراج [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)
    * يتم طباعة سجلات Fluentd أيضًا على خط الأوامر بتنسيق JSON (أسطر الكود 19-22). يُستخدم الإعداد للتحقق من تسجيل الأحداث عبر Fluentd

```bash linenums="1"
<source>
  @type http # إضافة الإدخال لحركة HTTP وHTTPS
  port 9880 # منفذ الطلبات الواردة
  <transport tls> # تكوين لمعالجة الاتصالات
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # إضافة الإخراج fluent-plugin-splunk-hec لإعادة توجيه السجلات إلى Splunk API عبر HTTP Event Controller
      hec_host 109.111.35.11 # مضيف Splunk
      hec_port 8088 # منفذ Splunk API
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # رمز HTTP Event Controller
    <format>
      @type json # تنسيق السجلات المُعاد توجيهها
    </format>
  </store>
  <store>
     @type stdout # إضافة الإخراج لطباعة سجلات Fluentd على خط الأوامر
     output_type json # تنسيق السجلات المطبوعة على خط الأوامر
  </store>
</match>
```

وصف أكثر تفصيلًا لملفات التكوين متوفر في [وثائق Fluentd الرسمية](https://docs.fluentd.org/configuration/config-file).

!!! info "اختبار تكوين Fluentd"
    للتحقق من إنشاء سجلات Fluentd وإعادة توجيهها إلى Splunk، يمكن إرسال طلب PUT أو POST إلى Fluentd.

    **مثال الطلب:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **سجلات في Fluentd:**
    ![سجلات في Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **سجلات في Splunk:**
    ![سجلات في Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### تكوين دمج Fluentd

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![دمج Webhook مع Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[مزيد من التفاصيل حول تكوين دمج Fluentd](../fluentd.md)

## اختبار المثال

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

سيقوم Fluentd بتسجيل الحدث على النحو التالي:

![سجل عن مُستخدم جديد في Splunk من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

سيتم عرض الإدخال التالي في أحداث Splunk:

![بطاقة مُستخدم جديد في Splunk من Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## تنظيم الأحداث في Splunk Enterprise ضمن لوحة تحكم

--8<-- "../include/integrations/application-for-splunk.md"