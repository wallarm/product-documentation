# تعيين التطبيقات

إذا كانت شركتكم تمتلك عدة تطبيقات، قد تجدون أنه من المفيد ليس فقط مشاهدة إحصائيات حركة المرور الخاصة بالشركة بأكملها، ولكن أيضًا مشاهدة الإحصائيات بشكل منفصل لكل تطبيق. لفصل حركة المرور حسب التطبيقات، يمكنكم استخدام كيان "التطبيق" في نظام Wallarm.

!!! warning "دعم تكوين التطبيق لعقدة CDN"
    لتكوين التطبيقات لـ [عقد Wallarm CDN](../../installation/cdn-node.md)، يرجى طلب ذلك من [فريق دعم Wallarm](mailto:support@wallarm.com).

استخدام التطبيقات يمكنكم من:

* عرض الأحداث والإحصائيات بشكل منفصل لكل تطبيق
* تكوين [المُشغلات](../triggers/triggers.md)، [القواعد](../rules/rules.md) وميزات Wallarm الأخرى لتطبيقات معينة
* [تكوين Wallarm في بيئات منفصلة](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md)

لتحديد التطبيقات الخاصة بكم، يُشترط تعيينهم لمعرفات فريدة عبر الأمر المناسب في تكوين العقدة. يمكن تعيين المُعرّفات لكل من نطاقات التطبيق ومسارات النطاق.

افتراضيًا، Wallarm يعتبر كل تطبيق بأنه التطبيق `الافتراضي` بالمُعرّف (ID) `-1`.

## إضافة تطبيق

1. (اختياري) إضافة تطبيق في Wallarm Console → **الإعدادات** → **التطبيقات**.

    ![إضافة تطبيق](../../images/user-guides/settings/configure-app.png)

    !!! warning "الوصول للمدير"
        فقط المستخدمون بدور **المدير** يمكنهم الوصول إلى قسم **الإعدادات** → **التطبيقات**.
2. تعيين مُعرّف فريد للتطبيق في تكوين العقدة عبر:

    * الأمر [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) إذا تم تثبيت Wallarm كوحدة NGINX، صورة cloud marketplace، حاوية Docker تعتمد على NGINX بملف تكوين مثبت، حاوية sidecar.
    * [متغير البيئة](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION` إذا تم تثبيت Wallarm كحاوية Docker تعتمد على NGINX.
    * [توجيه Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` إذا تم تثبيت Wallarm كوحدة تحكم Ingress.
    * المُعامِل [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) إذا تم تثبيت Wallarm كحاوية Docker تعتمد على Envoy بملف تكوين مثبت.

    يمكن أن يكون القيمة عدد صحيح موجب باستثناء `0`.

    إذا لم يتم إضافة التطبيق بالمُعرّف المحدد في Wallarm Console → **الإعدادات** → **التطبيقات**، سيتم إضافته تلقائيًا إلى القائمة. سيتم توليد اسم التطبيق تلقائيًا استنادًا إلى المُعرّف المحدد (مثل `التطبيق #1` للتطبيق بالمُعرّف `-1`). يمكن تغيير الاسم عبر Wallarm Console فيما بعد.

إذا تم تكوين التطبيق بشكل صحيح، سيتم عرض اسمه في تفاصيل الهجمات الموجهة إلى هذا التطبيق. لاختبار تكوين التطبيق، يمكنكم إرسال [هجوم اختباري](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) إلى عنوان التطبيق.

## تحديد التطبيق تلقائيًا

يمكنكم تكوين التعرف التلقائي على التطبيق على أساس:

* رؤوس طلبات محددة
* رأس طلب محدد أو جزء من عناوين URL باستخدام أمر `map` NGINX

!!! info "NGINX فقط"
    الطرق المذكورة تنطبق فقط على تثبيتات العقدة التي تستند إلى NGINX.

### تحديد التطبيق على أساس رؤوس طلبات محددة

تشمل هذه الطريقة خطوتين:

1. تكوين شبكتكم بحيث يتم إضافة الرأس بمُعرّف التطبيق إلى كل طلب.
1. استخدام قيمة هذا الرأس كقيمة للأمر `wallarm_application`. انظروا المثال أدناه.

مثال لملف تكوين NGINX:

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

مثال طلب الهجوم:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

هذا الطلب سيكون:

* معتبر كهجوم ومُضاف إلى قسم **الهجمات**.
* مرتبط بالتطبيق بالمُعرّف `222`.
* إذا لم يكن التطبيق المقابل موجودًا، سيُضاف إلى **الإعدادات** → **التطبيقات** ويُسمى تلقائيًا `التطبيق #222`.

![إضافة تطبيق على أساس طلب الرأس](../../images/user-guides/settings/configure-app-auto-header.png)

### تحديد التطبيق على أساس رأس طلب محدد أو جزء من عناوين URL باستخدام أمر `map` NGINX 

يمكنكم إضافة التطبيقات على أساس رأس طلب محدد أو جزء من عناوين نقاط الطرف، باستخدام أمر `map` NGINX. انظروا الوصف التفصيلي للأمر في [الوثائق](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) NGINX.

## حذف التطبيق

لحذف التطبيق من نظام Wallarm، احذفوا الأمر المناسب من ملف تكوين العقدة. إذا تم حذف التطبيق من قسم **الإعدادات** → **التطبيقات** فقط، سيتم استعادته في القائمة.