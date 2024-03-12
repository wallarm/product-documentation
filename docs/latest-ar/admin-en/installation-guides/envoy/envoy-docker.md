# تشغيل صورة دوكر المبنية على Envoy

هذه التعليمات تصف الخطوات لتشغيل صورة دوكر الخاصة بـ Wallarm المبنية على [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). الصورة تحتوي على كل الأنظمة المطلوبة لتشغيل عقدة Wallarm بشكل صحيح:

* خدمات بروكسي Envoy مع وحدة Wallarm المدمجة
* وحدات Tarantool لتحليلات ما بعد الأحداث
* خدمات وسكربتات أخرى

تم تصميم وحدة Wallarm كفلتر HTTP في Envoy لإعادة توجيه الطلبات.

!!! تحذير "المعلمات التكوينية المدعومة"
    يرجى الملاحظة أن معظم [التوجيهات][nginx-directives-docs] لتكوين عقدة التصفية المبنية على NGINX لا تُدعم لتكوين عقدة التصفية المبنية على Envoy. نتيجة لذلك، [تحديد النسبة][rate-limit-docs] و [اكتشاف سرقة البيانات الاعتمادية][cred-stuffing-docs] غير متاح في هذه طريقة النشر.
    
    اطلع على قائمة المعاملات المتاحة لـ [تكوين عقدة التصفية المبنية على Envoy →][docker-envoy-configuration-docs]

## حالات الاستخدام

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## المتطلبات

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## خيارات تشغيل الحاوية

يمكن إرسال معاملات تكوين عقدة التصفية إلى أمر `docker run` بالطرق التالية:

* **في المتغيرات البيئية**. تتيح هذه الخيارة تكوين معاملات أساسية لعقدة التصفية فقط، ولا يمكن تغيير معظم [المعاملات][docker-envoy-configuration-docs] من خلال المتغيرات البيئية.
* **في ملف التكوين المتصل**. تتيح هذه الخيارة تكوين كل [المعاملات][docker-envoy-configuration-docs] لعقدة التصفية.

## تشغيل الحاوية مرورًا بالمتغيرات البيئية

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية بالعقدة:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

يمكنك إرسال الإعدادات الأساسية التالية لعقدة التصفية إلى الحاوية عبر الخيار `-e`:

متغير بيئي | الوصف| مطلوب
--- | ---- | ----
`WALLARM_API_TOKEN` | رمز عقدة Wallarm أو API. | نعم
`ENVOY_BACKEND` | نطاق أو عنوان IP للمورد المراد حمايته بحل Wallarm. | نعم
`WALLARM_API_HOST` | خادم Wallarm API:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>الافتراضي: `api.wallarm.com`. | لا
`WALLARM_MODE` | وضع العقدة:<ul><li>`block` لحظر الطلبات الخبيثة</li><li>`safe_blocking` لحظر الطلبات الخبيثة الواردة فقط من [عناوين IP في القائمة الرمادية][graylist-docs]</li><li>`monitoring` لتحليل الطلبات دون حظرها</li><li>`off` لتعطيل تحليل ومعالجة حركة المرور</li></ul>الافتراضي: `monitoring`.<br>[وصف مفصل لأوضاع التصفية →][wallarm-mode-docs] | لا
`WALLARM_LABELS` | <p>متاح بدءًا من العقدة 4.6. يعمل فقط إذا تم تعيين `WALLARM_API_TOKEN` إلى [رمز API][api-tokens-docs] بدور `Deploy`. يضبط تصنيف `group` لتجميع مثيلات العقدة، على سبيل المثال:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...سيضع مثال العقدة في مجموعة المثيلات `GROUP` (الموجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها).</p> | نعم (لرموز API)
`TARANTOOL_MEMORY_GB` | [كمية الذاكرة][allocate-resources-for-wallarm-docs] المخصصة لـ Tarantool. يمكن أن تكون القيمة عددًا صحيحًا أو عشريًا (نقطة <code>.</code> هي فاصل عشري). الافتراضي: 0.2 جيجابايت. | لا

الأمر يقوم بالتالي:

* ينشئ ملف `envoy.yaml` بتكوين Envoy الأدنى في دليل `/etc/envoy` في الحاوية.
* ينشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى سحابة Wallarm في دليل `/etc/wallarm` في الحاوية:
    * `node.yaml` ب UUID عقدة التصفية والمفتاح السري
    * `private.key` بالمفتاح الخاص بـ Wallarm
* يحمي المورد `http://ENVOY_BACKEND:80`.

## تشغيل الحاوية بتوصيل envoy.yaml

يمكنك توصيل الملف `envoy.yaml` المُعد مسبقًا إلى حاوية دوكر عبر الخيار `-v`. يجب أن يحتوي الملف على الإعدادات التالية:

* إعدادات عقدة التصفية كما هو موصوف في [التعليمات][docker-envoy-configuration-docs]
* إعدادات Envoy كما هو موصوف في [تعليمات Envoy](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

لتشغيل الحاوية:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. قم بتشغيل الحاوية بالعقدة:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * الخيار `-e` يرسل المتغيرات البيئية المطلوبة التالية إلى الحاوية:

    متغير بيئي | الوصف| مطلوب
    --- | ---- | ----
    `WALLARM_API_TOKEN` | رمز العقدة من Wallarm.<br><div class="admonition info"> <p class="admonition-title">استخدام رمز واحد لعدة تركيبات</p> <p>يمكنك استخدام رمز واحد في عدة تركيبات بغض النظر عن المنصة المختارة [platform][supported-deployments]. يسمح ذلك بتجميع مثيلات العقد منطقيًا في واجهة المستخدم لـ Wallarm Console. مثال: تنشر عدة عقد Wallarm في بيئة التطوير، كل عقدة على آلة خاصة بمطور معين.</p></div> | نعم
    `WALLARM_API_HOST` | خادم Wallarm API:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul>الافتراضي: `api.wallarm.com`. | لا

    * الخيار `-v` يوصل الدليل بملف التكوين `envoy.yaml` إلى دليل `/etc/envoy` في الحاوية.

الأمر يقوم بالتالي:

* يوصل ملف `envoy.yaml` إلى دليل `/etc/envoy` في الحاوية.
* ينشئ ملفات بمعلومات اعتماد عقدة التصفية للوصول إلى سحابة Wallarm في دليل `/etc/wallarm` في الحاوية:
    * `node.yaml` ب UUID عقدة التصفية والمفتاح السري
    * `private.key` بالمفتاح الخاص بـ Wallarm
* يحمي المورد المحدد في ملف التكوين المتصل.

## تكوين تدوير سجل النظام (اختياري)

تم تكوين تدوير سجل النظام مسبقًا وتفعيله بشكل افتراضي. يمكنك ضبط إعدادات التدوير إذا لزم الأمر. توجد هذه الإعدادات في دليل `/etc/logrotate.d` في الحاوية.

## اختبار تشغيل عقدة Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"