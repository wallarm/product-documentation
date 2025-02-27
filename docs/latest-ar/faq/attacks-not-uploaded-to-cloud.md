# الهجمات لا يتم تحميلها إلى سحابة Wallarm

إذا كنت تشك في أن الهجمات الصادرة عن حركة المرور لا يتم تحميلها إلى سحابة Wallarm ونتيجة لذلك، لا تظهر في واجهة مستخدم Wallarm Console، استخدم هذه المقالة لتصحيح هذه المشكلة.

لتصحيح المشكلة، قم بتنفيذ الخطوات التالية تباعًا:

1. توليد حركة مرور ضارة للمساعدة في تصحيح المشكلة لاحقًا.
1. التحقق من وضع تشغيل عقدة التصفية.
1. التأكد من أن Tarantool لديها ما يكفي من الموارد لمعالجة الطلبات.
1. التقاط السجلات ومشاركتها مع فريق دعم Wallarm.

## 1. توليد حركة مرور ضارة

لمزيد من تصحيح مشكلات وحدات Wallarm:

1. إرسال حركة مرور ضارة تالية:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    استبدل `<FILTERING_NODE_IP>` بعنوان IP لعقدة التصفية التي تريد التحقق منها. إذا لزم الأمر، أضف رأس `Host:` إلى الأمر.
1. انتظر حتى دقيقتين حتى تظهر الهجمات في Wallarm Console → **الهجمات**. إذا ظهرت جميع الـ100 طلب، تُعتبر عقدة التصفية تعمل بشكل جيد.
1. الاتصال بالخادم الذي تم تثبيت عقدة التصفية عليه والحصول على [مقاييس العقدة](../admin-en/configure-statistics-service.md):

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    سنشير لاحقًا إلى مخرجات `wallarm-status`.

## 2. التحقق من وضع تشغيل عقدة التصفية

تحقق من وضع تشغيل عقدة التصفية كما يلي:

1. التأكد من أن [وضع](../admin-en/configure-wallarm-mode.md) عقدة التصفية مختلف عن `off`. العقدة لا تعالج حركة المرور الواردة في وضع `off`.

    وضع `off` هو سبب شائع لعدم زيادة مقاييس `wallarm-status`.
1. إعادة تشغيل NGINX للتأكد من تطبيق إعدادات عقدة Wallarm (إذا تم تثبيت العقدة من حزم DEB/RPM):

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. [توليد](#1-generate-some-malicious-traffic) حركة مرور ضارة مرة أخرى للتأكد من أن الهجمات لا تزال غير محملة إلى السحابة.

## 3. التأكد من أن Tarantool لديها ما يكفي من الموارد لمعالجة الطلبات

تشير المقاييس الأساسية التالية لـ Tarantool إلى مشاكل مرتبطة بتصدير الهجمات:

* `wallarm.stat.export_delay` هو تأخير في تحميل الهجمات إلى سحابة Wallarm (بالثواني)
* `wallarm.stat.timeframe_size` هو الفترة الزمنية التي يخزن فيها Tarantool الطلبات (بالثواني)
* `wallarm.stat.dropped_before_export` هو عدد الطلبات التي لم يكن لديها ما يكفي من الوقت ليتم تحميلها إلى سحابة Wallarm

لعرض المقاييس:

1. الاتصال بالخادم الذي تم تثبيت وحدة postanalytics (Tarantool) عليه.
1. تنفيذ الأوامر التالية:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

إذا كانت قيمة `wallarm.stat.dropped_before_export` مختلفة عن `0`:

* [زيادة](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) كمية الذاكرة المخصصة لـ Tarantool (إذا كانت `wallarm.stat.timeframe_size` أقل من 10 دقائق).

    !!! info "الذاكرة الموصى بها"
        يوصى بضبط الذاكرة المخصصة لـ Tarantool بحيث لا تنخفض مقياس `wallarm.stat.timeframe_size` أقل من `300` ثانية خلال الأحمال الذروة.

* زيادة عدد معالجات `export_attacks` في `/etc/wallarm/node.yaml` → `export_attacks` (`/opt/wallarm/etc/wallarm/node.yaml` → `export_attacks` لصورة Docker المبنية على NGINX، صور السحابة والمثبت الشامل)، مثلاً:

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    إعدادات `export_attacks` بشكل افتراضي هي:

    * `threads: 2`
    * `api_chunk: 10`

## 4. التقاط السجلات ومشاركتها مع فريق دعم Wallarm

إذا لم تساعد الخطوات المذكورة أعلاه في حل المشكلة، يُرجى التقاط سجلات العقدة ومشاركتها مع فريق دعم Wallarm على النحو التالي:

1. الاتصال بالخادم الذي تم تثبيت عقدة Wallarm عليه.
1. الحصول على مخرجات `wallarm-status` كما يلي:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    نسخ المخرجات.
1. تشغيل سكربت تشخيص Wallarm:

    === "المثبت الشامل، صورة AMI أو GCP، صورة Docker المبنية على NGINX"
        ```bash
        sudo /opt/wallarm/usr/share/wallarm-common/collect-info.sh
        ```
    === "خيارات نشر أخرى"
        ```bash
        sudo /usr/share/wallarm-common/collect-info.sh
        ```

    الحصول على الملف المُنتج مع السجلات.
1. إرسال جميع البيانات المجمعة إلى [فريق دعم Wallarm](mailto:support@wallarm.com) للتحقيق فيها بشكل أكبر.
