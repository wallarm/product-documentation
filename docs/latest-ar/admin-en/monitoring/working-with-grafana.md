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

# التعامل مع مقاييس عقدة الفلترة في Grafana

إذا قمت بضبط تصدير المقاييس في InfluxDB أو Graphite، فيمكنك تصور هذه المقاييس باستخدام [Grafana][link-grafana].

!!! info "بضعة افتراضات"
    يفترض هذا الوثيقة أنك قمت بنشر Grafana بجانب [InfluxDB][doc-network-plugin-influxdb] أو [Graphite][doc-network-plugin-graphite].

    مقياس [`curl_json-wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal]، الذي يُظهر عدد الطلبات التي تمت معالجتها من قبل عقدة الفلترة `node.example.local`، يُستخدم كمثال.

    ومع ذلك، يمكنك مراقبة أي [مقياس مدعوم][doc-available-metrics].

في المتصفح الخاص بك، اذهب إلى `http://10.0.30.30:3000` لفتح وحدة تحكم ويب Grafana، ثم قم بتسجيل الدخول إلى الوحدة باستخدام اسم المستخدم القياسي (`admin`) وكلمة المرور (`admin`).

لمراقبة عقدة فلترة باستخدام Grafana، ستحتاج إلى:
1.  ربط مصدر بيانات.
2.  جلب المقاييس المطلوبة من مصدر البيانات.
3.  إعداد تصور المقياس.

من المفترض أنك تستخدم أحد مصادر البيانات التالية:
*   InfluxDB
*   Graphite

##  ربط مصدر بيانات

### InfluxDB

لربط خادم InfluxDB كمصدر للبيانات اتبع الخطوات التالية:
1.  في الصفحة الرئيسية لوحدة تحكم Grafana، انقر على زر *Add data source*.
2.  اختر "InfluxDB" كنوع لمصدر البيانات.
3.  أدخل البيانات المطلوبة:
    *   الاسم: InfluxDB
    *   العنوان: `http://influxdb:8086`
    *   قاعدة البيانات: `collectd`
    *   المستخدم: `root`
    *   كلمة المرور: `root`
4.  انقر على الزر *Save & Test*.


### Graphite

لربط خادم Graphite كمصدر للبيانات اتبع الخطوات التالية:
1.  في الصفحة الرئيسية لوحدة تحكم Grafana، انقر على زر *Add data source*.
2.  اختر "Graphite" كنوع لمصدر البيانات.
3.  أدخل البيانات المطلوبة:
    *   الاسم: Graphite
    *   العنوان: `http://graphite:8080`.
    *   النسخة: اختر أحدث نسخة متاحة من قائمة الخيارات المنسدلة.
4.  انقر على الزر *Save & Test*.


!!! info "فحص حالة مصدر البيانات"
    إذا تم الاتصال بمصدر البيانات بنجاح، يجب أن تظهر رسالة "Data source is working".

### الخطوات التالية

اتبع الخطوات التالية لتمكين Grafana من مراقبة المقاييس:
1.  اضغط على أيقونة *Grafana* في الزاوية العلوية اليسرى من الوحدة للعودة إلى الصفحة الرئيسية.
2.  أنشئ لوحة تحكم جديدة بالضغط على زر *New Dashboard*. ثم [أضف استعلام][anchor-query] لجلب مقياس إلى لوحة التحكم بالضغط على زر *Add Query*.

##  جلب المقاييس المطلوبة من مصدر البيانات

### InfluxDB

لجلب مقياس من مصدر بيانات InfluxDB اتبع ما يلي:
1.  اختر مصدر البيانات "InfluxDB" الذي تم إنشاؤه حديثًا من قائمة الاستعلام المنسدلة.
2.  صمم استعلامًا لـ InfluxDB
    *   إما باستخدام أداة تصميم الاستعلام البيانية،

        ![أداة تصميم الاستعلام البيانية][img-influxdb-query-graphical]

    *   أو بملء الاستعلام يدويًا بنص عادي (للقيام بذلك، انقر على زر *Toggle text edit*، والذي يظهر مُحددًا باللون في الصورة أدناه). 

        ![أداة تصميم الاستعلام بنص عادي][img-influxdb-query-plaintext]

الاستعلام لجلب مقياس `curl_json-wallarm_nginx/gauge-abnormal` هو:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```

### Graphite

لجلب مقياس من مصدر بيانات Graphite اتبع ما يلي:

1.  اختر مصدر البيانات "Graphite" الذي تم إنشاؤه حديثًا من قائمة الاستعلام المنسدلة.
2.  اختر عناصر المقياس المطلوب عن طريق النقر على زر *select metric* لعنصر المقياس في خط *Series*.

    عناصر مقياس `curl_json-wallarm_nginx/gauge-abnormal` كالتالي:

    1.  اسم المضيف، كما تم ضبطه في ملف تكوين الإضافة `write_graphite`.
   
        الحرف `_` يعمل كمحدد بشكل افتراضي في هذه الإضافة؛ وبالتالي، سيتم تمثيل اسم النطاق `node.example.local` بـ `node_example_local` في الاستعلام.
   
    2.  اسم الإضافة `collectd` التي توفر قيمة معيّنة. لهذا المقياس، الإضافة هي `curl_json`.
    3.  اسم نسخة الإضافة. لهذا المقياس، الاسم هو `wallarm_nginx`.
    4.  نوع القيمة. لهذا المقياس، النوع هو `gauge`.
    5.  اسم القيمة. لهذا المقياس، الاسم هو `abnormal`.

### الخطوات التالية

بعد إنشاء الاستعلام، اضبط تصورًا للمقياس الموافق.

##  إعداد تصور المقياس

قم بالتبديل من علامة التبويب *Query* إلى علامة التبويب *Visualization*، واختر التصور المطلوب للمقياس.

لمقياس `curl_json-wallarm_nginx/gauge-abnormal`، نوصي باستخدام تصور "Gauge":
*   اختر خيار *Calc: Last* لعرض قيمة المقياس الحالية.
*   إذا لزم الأمر، يمكنك تكوين العتبات والمعايير الأخرى.

![Configure visualization][img-query-visualization]

### الخطوات التالية

بعد تكوين التصور، قم بالخطوات التالية:
*   أكمل إعداد الاستعلام بالنقر على زر *“←”* في الزاوية العلوية اليسرى من الوحدة.
*   احفظ أي تغييرات تم إجراؤها على لوحة التحكم.
*   تحقق وأكد أن Grafana يقوم بمراقبة المقياس بنجاح.

##  التحقق من المراقبة

بعد أن قمت بربط أحد مصادر البيانات وضبط الاستعلام والتصور لمقياس `curl_json-wallarm_nginx/gauge-abnormal`، تحقق من عملية المراقبة:

1.  قم بتمكين تحديثات المقياس التلقائية كل خمس ثواني (اختر قيمة من القائمة المنسدلة في الزاوية العلوية اليمنى من وحدة تحكم Grafana).
2.  تأكد من أن عدد الطلبات الحالي على لوحة تحكم Grafana يتطابق مع الإخراج من `wallarm-status` على عقدة الفلترة:

    --8<-- "../include/monitoring/wallarm-status-check-latest.md"
    
    ![فحص عداد الهجمات][img-grafana-0-attacks]
    
3.  قم بتنفيذ هجوم اختباري على تطبيق محمي بواسطة عقدة الفلترة. للقيام بذلك، يمكنك إرسال طلب خبيث إلى التطبيق إما بواسطة أداة `curl` أو المتصفح.

    --8<-- "../include/monitoring/sample-malicious-request.md"
    
4.  تأكد من أن عداد الطلبات قد زاد في كل من إخراج `wallarm-status` وعلى لوحة تحكم Grafana:

    --8<-- "../include/monitoring/wallarm-status-output-padded-latest.md"

    ![فحص عداد الهجمات][img-grafana-16-attacks]

لوحة التحكم Grafana الآن تعرض قيم مقياس `curl_json-wallarm_nginx/gauge-abnormal` لعقدة الفلترة `node.example.local`.