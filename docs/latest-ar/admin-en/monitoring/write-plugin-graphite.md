[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://collectd.org/documentation/manpages/collectd.conf.5.shtml#plugin_write_graphite

#   تصدير المقاييس إلى Graphite عبر الإضافة `collectd` للكتابة

هذا المستند يقدم مثالًا على استخدام الإضافة `write_graphite` لتصدير المقاييس إلى Graphite.

##  مثال على سير العمل

--8<-- "../include/monitoring/metric-example.md"

![مثال على سير العمل][img-write-plugin-graphite]

المخطط التالي مستخدم في هذا المستند:
*   يتم نشر عقدة فلتر Wallarm على مضيف يمكن الوصول إليه عبر عنوان الـ IP `10.0.30.5` واسم النطاق المؤهل بالكامل `node.example.local`.

    إضافة `write_graphite` لـ `collectd` على عقدة الفلتر مُعدة كالتالي:

      *   جميع المقاييس يتم إرسالها إلى الخادم `10.0.30.30` الذي يستمع على المنفذ `2003/TCP`.
      *   بعض الإضافات الخاصة بـ Wallarm في `collectd` تدعم [النسخ المتعددة][link-collectd-naming]، لذا فإن الإضافة `write_graphite` تحتوي على المعامل `SeparateInstances` مُضبط على قيمة `true`. تعني القيمة `true` أن الإضافة يمكنها العمل مع عدة نسخ.
    
    قائمة كاملة بخيارات الإضافة متاحة [هنا][link-write-plugin].
    
*   كلا من خدمات `graphite` و `grafana` يتم نشرها كحاويات Docker على مضيف منفصل بعنوان الـ IP `10.0.30.30`.
    
    خدمة `graphite` مع Graphite مُعدة كالتالي:

      *   تستمع للاتصالات الواردة على المنفذ `2003/TCP`، والذي سوف يرسل إليه `collectd` مقاييس عقدة الفلتر.
      *   تستمع للاتصالات الواردة على المنفذ `8080/TCP`، من خلاله سوف تحدث الاتصالات مع Grafana.
      *   الخدمة تشارك الشبكة `sample-net` Docker مع خدمة `grafana`.

    خدمة `grafana` مع Grafana مُعدة كالتالي:

      *   واجهة ويب Grafana متاحة على `http://10.0.30.30:3000`.
      *   الخدمة تشارك الشبكة `sample-net` Docker مع خدمة `graphite`.

##  تكوين تصدير المقاييس إلى Graphite

--8<-- "../include/monitoring/docker-prerequisites.md"

### نشر Graphite و Grafana

نشر Graphite و Grafana على مضيف Docker:
1.  انشئ ملف `docker-compose.yaml` بالمحتوى التالي:
    
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
    
2.  قم ببناء الخدمات بتنفيذ أمر `docker-compose build`.
    
3.  قم بتشغيل الخدمات بتنفيذ أمر `docker-compose up -d graphite grafana`.
    
في هذه المرحلة، يجب أن يكون Graphite يعمل وجاهزًا لاستقبال المقاييس من `collectd`، و Grafana جاهزًا لمراقبة وتصور البيانات المخزنة في Graphite.

### تكوين `collectd`

قم بتكوين `collectd` لتنزيل المقاييس إلى Graphite:
1.  اتصل بعقدة الفلتر (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من تسجيل الدخول كـ `root` أو حساب آخر له صلاحيات المدير.
2.  قم بإنشاء ملف بالاسم `/etc/collectd/collectd.conf.d/export-to-graphite.conf` بالمحتوى التالي:
    
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
    
    الكائنات التالية مُكونة هنا:
    
    1.  اسم المضيف الذي منه يتم جمع المقاييس (`node.example.local`).
    2.  الخادم الذي يجب إرسال المقاييس إليه (`10.0.30.30`).
    3.  منفذ الخادم (`2003`) والبروتوكول (`tcp`).
    4.  منطق نقل البيانات: بيانات نسخة واحدة من الإضافة مفصولة عن بيانات نسخ أخرى (`SeparateInstances true`).
    
3.  أعد تشغيل خدمة `collectd` بتشغيل الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

الآن سوف يحصل Graphite على جميع مقاييس عقدة الفلتر. يمكنك تصور المقاييس التي تهمك، ومراقبتها [مع Grafana][doc-grafana].