# الهجمات غير المرفوعة إلى سحابة Wallarm

إذا كنت تشك في أن الهجمات من المرور لا يتم رفعها إلى سحابة Wallarm وبنتيجة ذلك لا تظهر في واجهة مستخدم Wallarm Console، استخدم هذا المقال لتصويب المشكلة.

لتصويب المشكلة، قم بتنفيذ الخطوات التالية تباعاً:

1. قم بإنشاء بعض الحركة الضارة للقيام بعمليات تصويب لاحقة.
1. تحقق من وضع تشغيل عقدة الفلترة.
1. تأكد من أن لدى Tarantool موارد كافية لمعالجة الطلبات.
1. التقط السجلات وشاركها مع فريق دعم Wallarm.

## 1. قم بإنشاء بعض الحركة الضارة

للقيام بعمليات تصويب لاحقة على وحدات Wallarm:

1. أرسل الحركة الضارة التالية:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    استبدل `<FILTERING_NODE_IP>` بعنوان IP لعقدة الفلترة التي ترغب في التحقق منها. إذا لزم الأمر، أضف رأس `Host:` إلى الأمر.
1. انتظر حتى دقيقتين حتى تظهر الهجمات في Wallarm Console → **الهجمات**. إذا ظهرت كل الطلبات الـ 100، فإن عقدة الفلترة تعمل بشكل سليم.
1. اتصل بالخادم مع عقدة الفلترة المثبتة واحصل على [مقاييس العقدة](../admin-en/monitoring/intro.md):

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    سنشير فيما بعد إلى نتائج `wallarm-status`.

## 2. تحقق من وضع تشغيل عقدة الفلترة

تحقق من وضع تشغيل عقدة الفلترة كما يلي:

1. تأكد من أن [وضع](../admin-en/configure-wallarm-mode.md) عقدة الفلترة مختلف عن `off`. العقدة لا تعالج حركة المرور الواردة في وضع `off`.

    وضع `off` هو سبب شائع لعدم زيادة مقاييس `wallarm-status`.
1. أعد تشغيل NGINX للتأكد من تطبيق إعدادات عقدة Wallarm (إذا تم تثبيت العقدة من حزم DEB/RPM):

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. [قم بإنشاء](#1-generate-some-malicious-traffic) حركة ضارة مرة أخرى للتأكد من أن الهجمات لا يزال لا يتم رفعها إلى السحابة.

## 3. تأكد من أن لدى Tarantool موارد كافية لمعالجة الطلبات

تشير المقاييس الأساسية التالية لـ Tarantool إلى مشاكل في Tarantool متعلقة بتصدير الهجمات:

* `wallarm.stat.export_delay` هو تأخير في رفع الهجمات إلى سحابة Wallarm (بالثواني)
* `wallarm.stat.timeframe_size` هو الفاصل الزمني الذي يخزن Tarantool الطلبات فيه (بالثواني)
* `wallarm.stat.dropped_before_export` هو عدد الضربات التي لم يكن لديها وقت كافٍ ليتم رفعها إلى سحابة Wallarm

لعرض المقاييس:

1. اتصل بالخادم مع وحدة postanalytics (Tarantool).
1. نفذ الأوامر التالية:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

إذا كانت قيمة `wallarm.stat.dropped_before_export` مختلفة عن `0`:

* [زد](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) كمية الذاكرة المخصصة لـ Tarantool (إذا كان `wallarm.stat.timeframe_size` أقل من 10 دقائق).

    !!! info "الذاكرة الموصى بها"
        يوصى بتعديل الذاكرة المخصصة لـ Tarantool بحيث لا تقل مقاييس `wallarm.stat.timeframe_size` عن `300` ثانية خلال الأحمال القصوى.

* زد عدد مُعالجات `export_attacks` في `/etc/wallarm/node.yaml` → `export_attacks` (`/opt/wallarm/etc/wallarm/node.yaml` → `export_attacks` لصورة دوكر مستندة إلى NGINX، صور السحابة وباقة التثبيت الشاملة)، مثال:

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    إعدادات `export_attacks` هي كالتالي بشكل افتراضي:

    * `threads: 2`
    * `api_chunk: 10`

## 4. التقط السجلات وشاركها مع فريق دعم Wallarm

إذا لم تساعد الخطوات المذكورة أعلاه في حل المشكلة، يرجى التقاط سجلات العقدة ومشاركتها مع فريق دعم Wallarm على النحو التالي:

1. اتصل بالخادم مع عقدة Wallarm المثبتة.
1. احصل على نتائج `wallarm-status` كالتالي:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    انسخ النتيجة.
1. شغّل السيناريو التشخيصي الخاص بـ Wallarm:

    === "باقة التثبيت الشاملة، صورة AMI أو صورة GCP، صورة دوكر مستندة إلى NGINX"
        ```bash
        sudo /opt/wallarm/usr/share/wallarm-common/collect-info.sh
        ```
    === "خيارات التثبيت الأخرى"
        ```bash
        sudo /usr/share/wallarm-common/collect-info.sh
        ```

    احصل على الملف الذي تم إنشاؤه مع السجلات.
1. أرسل كل البيانات المجمعة إلى [فريق دعم Wallarm](mailto:support@wallarm.com) للتحقيق الإضافي.