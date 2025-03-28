[link-wallarm-health-check]:        ../../../admin-en/uat-checklist-en.md

# تشغيل صورة Docker المبنية على Envoy لـ Wallarm

تصف هذه التعليمات الخطوات لتشغيل صورة Docker الخاصة بـ Wallarm والمبنية على [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). تحتوي الصورة على كل الأنظمة المطلوبة لتشغيل عقدة Wallarm بشكل صحيح:

* خدمات الوكيل Envoy مع وحدة Wallarm المدمجة
* وحدات Tarantool للتحليلات بعد الحدث
* خدمات وسكربتات أخرى

تم تصميم وحدة Wallarm كفلتر HTTP لـ Envoy لتوكيل الطلبات.

!!! تحذير "المعلمات التكوينية المدعومة"
    يرجى العلم بأن معظم [المديريات][nginx-directives-docs] الخاصة بتكوين عقدة التصفية المبنية على NGINX غير مدعومة لتكوين عقدة التصفية المبنية على Envoy. ونتيجة لذلك، [تحديد المعدل][rate-limit-docs] و[كشف استخدام الاعتمادات المكررة][cred-stuffing-docs] غير متاحين في هذه الطريقة للتوزيع.
    
    اطلع على قائمة المعلمات المتاحة لـ [تكوين عقدة التصفية المبنية على Envoy →][docker-envoy-configuration-docs]

## حالات الاستخدام

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## الخيارات لتشغيل الحاوية

يمكن تمرير معلمات تكوين عقدة التصفية إلى أمر `docker run` بالطرق التالية:

* **في متغيرات البيئة**. هذا الخيار يسمح بتكوين معلمات عقدة التصفية الأساسية فقط، فلا يمكن تغيير أغلب [المعلمات][docker-envoy-configuration-docs] عبر متغيرات البيئة.
* **في ملف التكوين المركب**. هذا الخيار يسمح بتكوين كل [المعلمات][docker-envoy-configuration-docs] لعقدة التصفية.

## تشغيل الحاوية مع تمرير متغيرات البيئة

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية مع العقدة:

    === "السحابة الأمريكية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "السحابة الأوروبية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

يمكنك تمرير الإعدادات الأساسية التالية لعقدة التصفية إلى الحاوية عبر الخيار `-e`:

متغير البيئة | الوصف| مطلوب
--- | ---- | ----
`WALLARM_API_TOKEN` | رمز عقدة أو API الخاص بـ Wallarm. | نعم
`ENVOY_BACKEND` | نطاق أو عنوان IP للمورد المراد حمايته بواسطة حل Wallarm. | نعم
`WALLARM_API_HOST` | خادم API Wallarm:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>الافتراضي: `api.wallarm.com`. | لا
`WALLARM_MODE` | وضع العقدة:<ul><li>`block` لحجب الطلبات الخبيثة</li><li>`safe_blocking` لحجب الطلبات الخبيثة الصادرة من [عناوين IP في القائمة الرمادية][graylist-docs] فقط</li><li>`monitoring` لتحليل الطلبات دون حجبها</li><li>`off` لتعطيل تحليل ومعالجة الحركة</li></ul>الافتراضي: `monitoring`.<br>[وصف مفصل لأوضاع التصفية →][wallarm-mode-docs] | لا
`WALLARM_LABELS` | <p>متاح بدءًا من العقدة 4.6. يعمل فقط إذا تم ضبط `WALLARM_API_TOKEN` على [رمز API][api-tokens-docs] بدور `التوزيع`. يضبط تصنيف `group` لتجميع نماذج عقدة، على سبيل المثال:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...سيضع نموذج العقدة في مجموعة النماذج `<GROUP>` (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها).</p> | نعم (لرموز API)
`TARANTOOL_MEMORY_GB` | [كمية الذاكرة][allocate-resources-for-wallarm-docs] المخصصة لـ Tarantool. يمكن أن تكون القيمة عددًا صحيحًا أو عائمًا (النقطة <code>.</code> هي فاصلة عشرية). بشكل افتراضي: 0.2 غيغابايت. | لا

الأمر يقوم بما يلي:

* ينشئ ملف `envoy.yaml` بتكوين Envoy الأدنى في دليل `/etc/envoy` الخاص بالحاوية.
* ينشئ ملفات بأوراق اعتماد عقدة التصفية للوصول إلى سحابة Wallarm في دليل `/etc/wallarm` الخاص بالحاوية:
    * `node.yaml` بـ UUID العقدة ومفتاح السر.
    * `private.key` بمفتاح Wallarm الخاص.
* يحمي المورد `http://ENVOY_BACKEND:80`.

## تشغيل الحاوية بتركيب envoy.yaml

يمكنك تركيب ملف `envoy.yaml` الجاهز إلى حاوية Docker عبر الخيار `-v`. يجب أن يحتوي الملف على الإعدادات التالية:

* إعدادات عقدة التصفية كما هو موضح في [التعليمات][docker-envoy-configuration-docs]
* إعدادات Envoy كما هو موضح في [تعليمات Envoy](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية مع العقدة:

    === "السحابة الأمريكية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "السحابة الأوروبية"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * الخيار `-e` يمرر المتغيرات البيئية المطلوبة التالية إلى الحاوية:

    متغير البيئة | الوصف| مطلوب
    --- | ---- | ----
    `WALLARM_API_TOKEN` | رمز عقدة Wallarm.<br><div class="admonition info"> <p class="admonition-title">استخدام رمز واحد لعدة تثبيتات</p> <p>يمكنك استخدام رمز واحد في عدة تثبيتات بغض النظر عن النظام الأساسي المختار [platform][supported-deployments]. يسمح ذلك بتجميع منطقي لنماذج العقد في واجهة استخدام Wallarm. مثال: تقوم بنشر عدة عقد Wallarm في بيئة تطوير، كل عقدة على جهاز خاص بمطور معين.</p></div> | نعم
    `WALLARM_API_HOST` | خادم API Wallarm:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>الافتراضي: `api.wallarm.com`. | لا

    * الخيار `-v` يركب دليل الملف التكويني `envoy.yaml` إلى دليل `/etc/envoy` الخاص بالحاوية.

الأمر يقوم بما يلي:

* يركب ملف `envoy.yaml` إلى دليل `/etc/envoy` الخاص بالحاوية.
* ينشئ ملفات بأوراق اعتماد عقدة التصفية للولوج إلى سحابة Wallarm في دليل `/etc/wallarm` الخاص بالحاوية:
    * `node.yaml` بـ UUID العقدة ومفتاح السر.
    * `private.key` بمفتاح Wallarm الخاص.
* يحمي المورد المحدد في ملف التكوين المركب.

## تكوين الدوران الخاص بملفات السجل (اختياري)

تم تكوين دوران ملف السجل مسبقًا وهو ممكّن بشكل افتراضي. يمكنك تعديل إعدادات الدوران إذا لزم الأمر. تقع هذه الإعدادات في دليل `/etc/logrotate.d` الخاص بالحاوية.

## اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"