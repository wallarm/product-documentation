# إعداد التطبيقات

إذا كانت شركتك تملك عدة تطبيقات، قد تجد أنه من المناسب ليس فقط مشاهدة إحصائيات حركة المرور للشركة بأكملها ولكن أيضًا مشاهدة الإحصائيات بشكل منفصل لكل تطبيق. لفصل حركة المرور حسب التطبيقات، يمكنك استخدام كيان "التطبيق" في نظام Wallarm.

!!! warning "دعم تهيئة التطبيق لعقدة CDN"
    لتهيئة التطبيقات لـ [عقد Wallarm CDN](../../installation/cdn-node.md)، يرجى طلب ذلك من [فريق دعم Wallarm](mailto:support@wallarm.com).

يتيح لك استخدام التطبيقات:

* مشاهدة الأحداث والإحصائيات بشكل منفصل لكل تطبيق
* تهيئة [المشغلات](../triggers/triggers.md)، [القواعد](../rules/rules.md) وميزات Wallarm الأخرى لتطبيقات معينة
* [تهيئة Wallarm في بيئات منفصلة](../../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy)

لكي يتعرف Wallarm على تطبيقاتك، يلزم تعيين معرفات فريدة لها عبر الأمر المناسب في تهيئة العقدة. يمكن تعيين المعرفات لكل من نطاقات التطبيق ومسارات النطاق.

بشكل افتراضي، يعتبر Wallarm كل تطبيق هو تطبيق `الافتراضي` بالمعرف (ID) `-1`.

## إضافة تطبيق

1. (اختياري) أضف تطبيقًا في لوحة تحكم Wallarm → **الإعدادات** → **التطبيقات**.

    ![إضافة تطبيق](../../images/user-guides/settings/configure-app.png)

    !!! warning "الوصول الإداري"
        فقط المستخدمون بدور **المدير** يمكنهم الوصول إلى القسم **الإعدادات** → **التطبيقات**.
2. قم بتعيين معرف فريد للتطبيق في تكوين العقدة عبر:

    * الأمر [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) إذا تم تثبيت Wallarm كوحدة NGINX، صورة سوق السحاب، حاوية Docker المستندة إلى NGINX بملف تكوين مُثبَت، حاوية جانبية.
    * [المتغير البيئي](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION` إذا تم تثبيت Wallarm كحاوية Docker المستندة إلى NGINX.
    * [تعليق Ingress](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` إذا تم تثبيت Wallarm كمتحكم Ingress.
    * البارامتر [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) إذا تم تثبيت Wallarm كحاوية Docker المستندة إلى Envoy بملف تكوين مُثبَت.

    يمكن أن تكون القيمة عددًا صحيحًا موجبًا عدا `0`.

    إذا لم يتم إضافة التطبيق مع المعرف المحدد في لوحة تحكم Wallarm → **الإعدادات** → **التطبيقات**، فسيتم إضافته تلقائيًا إلى القائمة. سيتم توليد اسم التطبيق تلقائيًا بناءً على المعرف المحدد (مثل `التطبيق #1` للتطبيق بالمعرف `-1`). يمكن تغيير الاسم عبر لوحة تحكم Wallarm لاحقًا.

إذا تم تهيئة التطبيق بشكل صحيح، سيتم عرض اسمه في تفاصيل الهجمات الموجهة نحو هذا التطبيق. لاختبار تهيئة التطبيق، يمكنك إرسال [الهجوم الاختباري](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) إلى عنوان التطبيق.

## التعرف التلقائي على التطبيقات

يمكنك تهيئة التعرف التلقائي على التطبيقات استنادًا إلى:

* رؤوس طلبات محددة
* جزء معين من رؤوس الطلبات أو من عناوين URLs باستخدام أمر `map` الخاص بـ NGINX

!!! info "NGINX فقط"
    النهج المذكورة تنطبق فقط على نشر عقدة مبنية على NGINX.

### التعرف على التطبيق استنادًا إلى رؤوس طلبات محددة

يشمل هذا النهج خطوتين:

1. تهيئة شبكتك بحيث يتم إضافة رأس بمعرف التطبيق إلى كل طلب.
2. استخدم قيمة هذا الرأس كقيمة للأمر `wallarm_application`. انظر المثال أدناه.

مثال على ملف تكوين NGINX:

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

مثال على طلب هجوم:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

هذا الطلب سيتم:

* اعتباره هجومًا وإضافته إلى قسم **الهجمات**.
* ربطه بالتطبيق بالمعرف `222`.
* إذا لم يكن التطبيق المقابل موجودًا، سيتم إضافته إلى **الإعدادات** → **التطبيقات** وتسميته تلقائيًا `التطبيق #222`.

![إضافة تطبيق استنادًا إلى طلب الرأس](../../images/user-guides/settings/configure-app-auto-header.png)

### التعرف على التطبيق استنادًا إلى رأس طلب محدد أو جزء من URLs باستخدام أمر `map` الخاص بـ NGINX

يمكنك إضافة التطبيقات استنادًا إلى رأس طلبات محدد أو جزء من عناوين النقاط النهائية، باستخدام أمر `map` الخاص بـ NGINX. راجع الشرح التفصيلي للأمر في [الوثائق](https://nginx.org/en/docs/http/ngx_http_map_module.html#map) الخاصة بـ NGINX.

## حذف التطبيق

لحذف التطبيق من نظام Wallarm، احذف الأمر المناسب من ملف تكوين العقدة. إذا تم حذف التطبيق فقط من القسم **الإعدادات** → **التطبيقات**، سيتم استعادته في القائمة.