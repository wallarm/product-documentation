[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#bruteforce-attack
[doc-postanalitycs]:        ../installation-postanalytics-en.md

[link-collectd-naming]:     https://collectd.org/wiki/index.php/Naming_schema
[link-data-source]:         https://collectd.org/wiki/index.php/Data_source
[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-influxdb]:            https://www.influxdata.com/products/influxdb-overview/
[link-grafana]:             https://grafana.com/
[link-graphite]:            https://github.com/graphite-project/graphite-web
[link-network-plugin]:      https://collectd.org/wiki/index.php/Plugin:Network
[link-write-plugins]:       https://collectd.org/wiki/index.php/Table_of_Plugins
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios]:              https://www.nagios.org/
[link-zabbix]:              https://www.zabbix.com/
[link-nagios-format]:       https://nagios-plugins.org/doc/guidelines.html#AEN200
[link-selinux]:             https://www.redhat.com/en/topics/linux/what-is-selinux

[doc-available-metrics]:    available-metrics.md
[doc-network-plugin]:       fetching-metrics.md#exporting-metrics-via-the-collectd-network-plugin
[doc-write-plugins]:        fetching-metrics.md#exporting-metrics-via-the-collectd-write-plugins
[doc-collectd-nagios]:      fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-collectd-notices]:     fetching-metrics.md#sending-notifications-from-collectd

[doc-selinux]:  ../configure-selinux.md

# مقدمة في مراقبة عقدة التصفية

يُمكنك مراقبة حالة عقدة التصفية باستخدام مقاييس العقدة المقدمة. هذا المقال يصف كيفية التعامل مع المقاييس المجموعة بواسطة خدمة [`collectd`][link-collectd] المُثبتة على كل عقدة تصفية في Wallarm. تُقدم خدمة `collectd` عِدة طُرق لنقل البيانات ويُمكن أن تكون مصدر للمقاييس لأنظمة مراقبة كثيرة، مما يمنحك السيطرة على حالة عقد التصفية.

بالإضافة إلى مقاييس `collectd`، Wallarm يُقدم لك شكل المقاييس المتوافقة مع Prometheus والمقاييس الأساسية بصيغة JSON. اقرأ عن هذه الأشكال في [المقال المنفصل](../configure-statistics-service.md).

!!! تحذير "دعم خدمة المراقبة على عقدة CDN"
    من فضلك، لاحظ أن خدمة `collectd` غير مدعومة بواسطة [عقد Wallarm CDN](../../installation/cdn-node.md).

##  الحاجة للمراقبة

الفشل أو العمل غير المستقر في وحدة Wallarm قد يؤدي إلى الرفض الكلي أو الجزئي لطلبات المستخدمين لتطبيق محمي بواسطة عقدة تصفية.

فشل أو عمل غير مستقر في وحدة التحليلات اللاحقة قد يؤدي إلى عدم إمكانية الوصول إلى الوظائف الآتية:
*   رفع بيانات الهجوم إلى سحابة Wallarm. نتيجة لذلك، الهجمات لن تظهر على بوابة Wallarm.
*   اكتشاف الهجمات السلوكية (انظر [هجمات القوة الغاشمة][av-bruteforce]).
*   الحصول على معلومات حول بنية التطبيق المحمي.

يمكنك مراقبة وحدة Wallarm ووحدة التحليلات اللاحقة حتى لو كان الأخير [مُثبت بشكل منفصل][doc-postanalitycs].


!!! معلومة "اتفاق المصطلحات"

    لمراقبة وحدة Wallarm ووحدة التحليلات اللاحقة، يتم استخدام نفس الأدوات والطُرق؛ لذا سيُشار إلى كلتا الوحدتين ك "عقدة تصفية" طوال هذا الدليل، إلا إذا ذُكر خلاف ذلك.
    
    كل الوثائق التي تصف كيفية إعداد المراقبة لعقدة تصفية مناسبة لـ

    *   وحدات Wallarm المنفصلة،
    *   وحدات التحليلات اللاحقة المنفصلة، و
    *   وحدات Wallarm والتحليلات اللاحقة المنشورة معًا.


##  المتطلبات الأساسية للمراقبة

لكي تعمل المراقبة، يلزم:

* NGINX يُعيد الإحصائيات إلى عقدة التصفية (`wallarm_status on`),
* وضع التصفية في [وضع](../configure-wallarm-mode.md#available-filtration-modes) `monitoring`/`safe_blocking`/`block`.
  
افتراضيًا، هذه الخدمة متاحة عبر `http://127.0.0.8/wallarm-status`. قد يختلف العنوان إذا قمت بتغييره [تغيير](../configure-statistics-service.md#changing-an-ip-address-andor-port-of-the-statistics-service).

##  كيف تبدو المقاييس

### كيف تبدو مقاييس `collectd`

المعرف الخاص بمقياس `collectd` له الشكل الآتي:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

حيث
*   `host`: الاسم المؤهل بالكامل للنطاق (FQDN) للمضيف الذي تم الحصول على المقياس من أجله
*   `plugin`: اسم الإضافة التي تم الحصول على المقياس بها،
*   `-plugin_instance`: نسخة الإضافة، إذا وجدت،
*   `type`: نوع قيمة المقياس. الأنواع المُتاحة:
    *   `counter`
    *   `derive`
    *   `gauge` 
    
    المعلومات التفصيلية حول أنواع القيم متاحة [هنا][link-data-source].

*   `-type_instance`: نسخة النوع، إذا وجدت. نوع النسخة مُكافئ للقيمة التي نريد الحصول على المقياس لها.

وصف كامل لأشكال المقاييس متاح [هنا][link-collectd-naming].

### كيف تبدو مقاييس `collectd` الخاصة بـ Wallarm

عقدة التصفية تستخدم `collectd` لجمع المقاييس الخاصة بـ Wallarm.

مقاييس NGINX بوحدة Wallarm لها الشكل الآتي:

```
host/curl_json-wallarm_nginx/type-type_instance
```

مقاييس وحدة التحليلات اللاحقة لها الشكل الآتي:

```
host/wallarm-tarantool/type-type_instance
```


!!! معلومة "أمثلة على المقاييس"
    لعقدة تصفية على المضيف `node.example.local`:

    * `node.example.local/curl_json-wallarm_nginx/gauge-abnormal` هو مقياس عدد الطلبات المُعالجة؛
    * `node.example.local/wallarm-tarantool/gauge-export_delay` هو مقياس التأخير في تصدير Tarantool بالثواني.
    
    قائمة كاملة بالمقاييس التي يُمكن مراقبتها متاحة [هنا][doc-available-metrics].


##  طرق جمع المقاييس

يمكنك جمع المقاييس من عقدة التصفية بعدة طرق:
*   عن طريق تصدير البيانات مباشرةً من خدمة `collectd`
    *   [عبر إضافة الشبكة لـ `collectd`][doc-network-plugin].
    
        تمكن هذه [الإضافة][link-network-plugin] `collectd` من تنزيل المقاييس من عقدة التصفية إلى خادم [`collectd`][link-collectd-networking] أو قاعدة بيانات [InfluxDB][link-influxdb].
        
        
        !!! معلومة "InfluxDB"
            يُمكن استخدام InfluxDB لتجميع المقاييس من `collectd` ومصادر بيانات أخرى مع تصوير لاحق لها (على سبيل المثال، نظام مراقبة [Grafana][link-grafana] لتصوير المقاييس المخزنة في InfluxDB).
        
    *   [عبر واحدة من إضافات الكتابة لـ `collectd`][doc-write-plugins].
  
        على سبيل المثال، يُمكنك تصدير البيانات المجمعة إلى [Graphite][link-graphite] باستخدام إضافة `write_graphite`.
  
        
        !!! معلومة "Graphite"
            يُمكن استخدام Graphite كمصدر بيانات لأنظمة المراقبة والتصوير (على سبيل المثال، [Grafana][link-grafana]).
        
  
    هذه الطريقة مناسبة لأنواع نشر عقدة التصفية التالية:

    *   في السحاب: Amazon AWS، Google Cloud؛
    *   على Linux لمنصات NGINX/NGINX Plus.

*   [عن طريق تصدير البيانات عبر `collectd-nagios`][doc-collectd-nagios].
  
    تستقبل هذه [الأداة][link-collectd-nagios] قيمة المقياس المُعطى من `collectd` وتعرضها بتنسيق [متوافق مع Nagios][link-nagios-format].
  
    يُمكنك تصدير المقاييس إلى أنظمة المراقبة [Nagios][link-nagios] أو [Zabbix][link-zabbix] باستخدام هذه الأداة.
  
    تدعم هذه الطريقة أي عقدة تصفية Wallarm، بغض النظر عن طريقة النشر.
  
*   [عن طريق إرسال الإخطارات من `collectd`][doc-collectd-notices] عندما تصل قيمة المقياس إلى حد مُعين.

    تدعم هذه الطريقة أي عقدة تصفية Wallarm، بغض النظر عن طريقة النشر.