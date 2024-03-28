[img-influxdb-query-graphical]:     ../../images/monitoring/grafana-influx-1.png
[img-influxdb-query-plaintext]:     ../../images/monitoring/grafana-influx-2.png
[img-query-visualization]:          ../../images/monitoring/grafana-query-visualization.png
[img-grafana-0-attacks]:            ../../images/monitoring/grafana-0-attacks.png
[img-grafana-16-attacks]:           ../../images/monitoring/grafana-16-attacks.png

[link-grafana]:                     https://grafana.com/

[doc-network-plugin-influxdb]:      network-plugin-influxdb.md
[doc-network-plugin-graphite]:      write-plugin-graphite.md
[doc-gauge-abnormal]:                available-metrics.md#number-of-requests
[doc-available-metrics]:            available-metrics.md

[anchor-query]:                     #fetching-the-required-metrics-from-the-data-source
[anchor-verify-monitoring]:         #verifying-monitoring

#   العمل مع مقاييس عقدة الفلتر في Grafana

إذا قمت بتكوين تصدير المقاييس في InfluxDB أو Graphite، فيمكنك تصور المقاييس باستخدام [Grafana][link-grafana].

!!! info "بعض الافتراضات"
    يفترض هذا المستند أنك قمت بنشر Grafana بجانب [InfluxDB][doc-network-plugin-influxdb] أو [Graphite][doc-network-plugin-graphite].
    
    يُستخدم مقياس [`curl_json-wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal]، الذي يُظهر عدد الطلبات التي تمت معالجتها بواسطة عقدة الفلتر `node.example.local`، كمثال.
    
    ومع ذلك، يمكنك مراقبة أي [مقياس مدعوم][doc-available-metrics]. 

في متصفحك، اذهب إلى `http://10.0.30.30:3000` لفتح وحدة تحكم ويب Grafana، ثم قم بتسجيل الدخول إلى الوحدة باستخدام اسم المستخدم الافتراضي (`admin`) وكلمة المرور (`admin`). 

لمراقبة عقدة فلتر باستخدام Grafana، ستحتاج إلى
1.  ربط مصدر بيانات.
2.  جلب المقاييس المطلوبة من مصدر البيانات.
3.  إعداد تصور المقياس.

يفترض أنك تستخدم واحدًا من مصادر البيانات التالية:
*   InfluxDB
*   Graphite

##  ربط مصدر بيانات

### InfluxDB

لتوصيل خادم InfluxDB كمصدر للبيانات اتبع الخطوات التالية:
1.  انقر على زر *إضافة مصدر بيانات* في الصفحة الرئيسية لوحدة التحكم Grafana.
2.  اختر "InfluxDB" كنوع لمصدر البيانات.
3.  املأ البارامترات المطلوبة:
    *   الاسم: InfluxDB
    *   العنوان: `http://influxdb:8086`
    *   قاعدة البيانات: `collectd`
    *   المستخدم: `root`
    *   كلمة المرور: `root`
4.  انقر على زر *حفظ واختبار*.

### Graphite

لتوصيل خادم Graphite كمصدر للبيانات اتبع الخطوات التالية:
1.  انقر على زر *إضافة مصدر بيانات* في الصفحة الرئيسية لوحدة التحكم Grafana.
2.  اختر "Graphite" كنوع لمصدر البيانات.
3.  املأ البارامترات المطلوبة:
    *   الاسم: Graphite
    *   العنوان: `http://graphite:8080`.
    *   الإصدار: اختر أحدث إصدار متاح من القائمة المنسدلة.
4.  انقر على زر *حفظ واختبار*.

!!! info "التحقق من حالة مصدر البيانات"
    إذا تم ربط مصدر البيانات بنجاح، يجب أن تظهر رسالة "مصدر البيانات يعمل".

### الخطوات التالية

قم بتنفيذ الإجراءات التالية لتمكين Grafana من مراقبة المقاييس:
1.  اضغط على أيقونة *Grafana* في الزاوية العلوية اليسرى من الوحدة للعودة إلى الصفحة الرئيسية.
2.  أنشئ لوحة تحكم جديدة بالنقر على زر *لوحة تحكم جديدة*. ثم [أضف استعلامًا][anchor-query] لجلب مقياس إلى لوحة التحكم بالنقر على زر *إضافة استعلام*.

##  جلب المقاييس المطلوبة من مصدر البيانات

### InfluxDB

لجلب مقياس من مصدر بيانات InfluxDB قم بما يلي:
1.  اختر مصدر البيانات "InfluxDB" الذي تم إنشاؤه حديثًا من القائمة المنسدلة *Query*.
2.  صمم استعلامًا لـ InfluxDB
    *   إما باستخدام أداة تصميم الاستعلام الرسومية،

        ![أداة تصميم الاستعلام الرسومية][img-influxdb-query-graphical]

    *   أو بملء استعلام يدويًا بنص عادي (للقيام بذلك، انقر على زر *تبديل تحرير النص*، المُبرز في الصورة أدناه).

        ![أداة تصميم الاستعلام بالنص العادي][img-influxdb-query-plaintext]

استعلام لجلب مقياس `curl_json-wallarm_nginx/gauge-abnormal` هو:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```

### Graphite

لجلب مقياس من مصدر بيانات Graphite قم بما يلي:

1.  اختر مصدر البيانات "Graphite" الذي تم إنشاؤه حديثًا من القائمة المنسدلة *Query*.
2.  اختر عناصر المقياس المطلوب تسلسليًا بالنقر على زر *اختيار المقياس* لعنصر المقياس في خط *Series*.

    تتمثل عناصر مقياس `curl_json-wallarm_nginx/gauge-abnormal` فيما يلي:

    1.  اسم المضيف، كما تم تعيينه في ملف تكوين الإضافة `write_graphite`.
   
        يعمل حرف `_` كمحدد بشكل افتراضي في هذه الإضافة؛ ولذلك، سيتم تمثيل اسم النطاق `node.example.local` كـ `node_example_local` في الاستعلام.
   
    2.  اسم إضافة `collectd` التي توفر قيمة محددة. بالنسبة لهذا المقياس، الإضافة هي `curl_json`.
    3.  اسم نموذج الإضافة. لهذا المقياس، الاسم هو `wallarm_nginx`.
    4.  نوع القيمة. بالنسبة لهذا المقياس، النوع هو `gauge`.
    5.  اسم القيمة. لهذا المقياس، الاسم هو `abnormal`.

### الخطوات التالية

بعد إنشاء الاستعلام، قم بإعداد تصور للمقياس المقابل.

##  إعداد تصور المقياس

انتقل من علامة التبويب *Query* إلى علامة التبويب *Visualization*، واختر التصور المطلوب للمقياس.

لمقياس `curl_json-wallarm_nginx/gauge-abnormal`، نوصي باستخدام تصور "Gauge":
*   اختر خيار *Calc: Last* لعرض القيمة الحالية للمقياس.
*   إذا لزم الأمر، يمكنك تكوين العتبات والمعايير الأخرى.

![تكوين التصور][img-query-visualization]

### الخطوات التالية

بعد تهيئة التصور قم باتخاذ الخطوات التالية:
*   أكمل تكوين الاستعلام بالنقر على زر *“←”* في الزاوية العلوية اليسرى من الوحدة.  
*   حفظ أي تغييرات تم إجراؤها على لوحة التحكم.
*   التحقق والتأكد من أن Grafana تقوم بمراقبة المقياس بنجاح.

##  التحقق من المراقبة

بعد أن قمت بتوصيل أحد مصادر البيانات وقمت بتكوين الاستعلام والتصور لمقياس `curl_json-wallarm_nginx/gauge-abnormal`، تحقق من عملية المراقبة:
1.  قم بتمكين تحديثات المقاييس تلقائيًا كل خمس ثوانٍ (اختر قيمة من القائمة المنسدلة في الزاوية العلوية اليمنى من وحدة التحكم Grafana).
2.  تأكد من أن عدد الطلبات الحالي على لوحة تحكم Grafana يتطابق مع الإخراج من `wallarm-status` على عقدة الفلتر:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
    
    ![التحقق من عداد الهجمات][img-grafana-0-attacks]
    
3.  قم بإجراء هجوم اختباري على تطبيق محمي بواسطة عقدة الفلتر. للقيام بذلك، يمكنك إرسال طلب ضار إلى التطبيق إما باستخدام أداة `curl` أو المتصفح.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
4.  تأكد من أن عداد الطلبات قد زاد كلًا في إخراج `wallarm-status` وعلى لوحة تحكم Grafana:

    --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

    ![التحقق من عداد الهجمات][img-grafana-16-attacks]

تعرض لوحة تحكم Grafana الآن قيم مقياس `curl_json-wallarm_nginx/gauge-abnormal` لعقدة الفلتر `node.example.local`.