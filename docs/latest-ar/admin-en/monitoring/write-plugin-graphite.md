[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

#   تصدير المقاييس إلى Graphite عبر إضافة `collectd` للكتابة

توفر هذه الوثيقة مثالاً على استخدام إضافة `write_graphite` لتصدير المقاييس إلى Graphite.

##  سير عمل مثالي

--8<-- "../include/monitoring/metric-example.md"

![سير العمل المثالي][img-write-plugin-graphite]

يستخدم المخطط التالي في هذه الوثيقة:
*   يتم نشر عقدة تصفية Wallarm على مضيف يمكن الوصول إليه عبر عنوان IP `10.0.30.5` واسم المجال المؤهل بالكامل `node.example.local`.

    تم تكوين إضافة `write_graphite` لـ `collectd` على عقدة التصفية كما يلي:

      *   يتم إرسال جميع المقاييس إلى الخادم `10.0.30.30` الذي يستمع على المنفذ `2003/TCP`.
      *   تدعم بعض إضافات `collectd` الخاصة بـ Wallarm [حالات][link-collectd-naming] متعددة، لذلك تحتوي إضافة `write_graphite` على معامل `SeparateInstances` مضبوط على `true`. القيمة `true` تعني أن الإضافة يمكن أن تعمل مع عدة حالات.
    
    قائمة كاملة بخيارات الإضافة متوفرة [هنا][link-write-plugin].
    
*   تم نشر خدمتي `graphite` و`grafana` كحاويات Docker على مضيف منفصل بعنوان IP `10.0.30.30`.
    
    يتم تكوين خدمة `graphite` مع Graphite كما يلي:

      *   تستمع للاتصالات الواردة على المنفذ `2003/TCP`، الذي سيُرسل إليه `collectd` المقاييس من عقدة التصفية.
      *   تستمع للاتصالات الواردة على المنفذ `8080/TCP`، الذي ستحدث من خلاله التواصل مع Grafana.
      *   تشارك الخدمة شبكة Docker `sample-net` مع خدمة `grafana`.

    يتم تكوين خدمة `grafana` مع Grafana كما يلي:

      *   واجهة ويب Grafana متاحة على `http://10.0.30.30:3000`.
      *   تشارك الخدمة شبكة Docker `sample-net` مع خدمة `graphite`.

##  تكوين تصدير المقاييس إلى Graphite

--8<-- "../include/monitoring/docker-prerequisites.md"

### نشر Graphite وGrafana

نشر Graphite وGrafana على مضيف Docker:
1.  إنشاء ملف `docker-compose.yaml` بالمحتوى التالي:
    
    ```
    version: "3"
    
    services:
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
      graphite:
        image: graphiteapp/graphite-statsd
        container_name: graphite
        restart: always
        ports:
          - 8080:8080
          - 2003:2003
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```
    
2.  بناء الخدمات بتنفيذ أمر `docker-compose build`.
    
3.  تشغيل الخدمات بتنفيذ أمر `docker-compose up -d graphite grafana`.
    
في هذه المرحلة، يجب أن يكون Graphite قيد التشغيل وجاهزًا لاستقبال المقاييس من `collectd`، وGrafana جاهزًا لمراقبة البيانات وتصورها المخزنة في Graphite.

### تكوين `collectd`

تكوين `collectd` لتحميل المقاييس إلى Graphite:
1.  الاتصال بعقدة التصفية (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من تسجيل الدخول كـ `root` أو حساب آخر بصلاحيات المدير.
2.  إنشاء ملف بالاسم `/etc/collectd/collectd.conf.d/export-to-graphite.conf` بالمحتوى التالي:
    
    ```
    LoadPlugin write_graphite
    
    <Plugin write_graphite>
     <Node "node.example.local">
       Host "10.0.30.30"
       Port "2003"
       Protocol "tcp"
       SeparateInstances true
     </Node>
    </Plugin>
    ```
    
    الكيانات المكونة هنا:
    
    1.  اسم المضيف الذي يتم منه جمع المقاييس (`node.example.local`).
    2.  الخادم الذي ينبغي أرسال المقاييس إليه (`10.0.30.30`).
    3.  منفذ الخادم (`2003`) والبروتوكول (`tcp`).
    4.  منطق نقل البيانات: تفصل بيانات حالة إضافة عن بيانات حالة أُخرى (`SeparateInstances true`).
    
3.  إعادة تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

الآن سيتلقى Graphite جميع مقاييس عقدة التصفية. يمكنك تصور المقاييس التي تهمك، ومراقبتها [مع Grafana][doc-grafana].