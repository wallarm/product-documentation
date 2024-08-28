[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

#   تصدير المقاييس إلى InfluxDB عبر الإضافة `network` لـ `collectd`

توفر هذه الوثيقة مثالًا عن استخدام إضافة الشبكة لتصدير المقاييس إلى قاعدة بيانات InfluxDB الزمنية. كذلك، ستُظهر كيفية تصور المقاييس المُجمعة في InfluxDB باستخدام Grafana.

##  سير العمل المثالي

--8<-- "../include/monitoring/metric-example.md"

![سير العمل المثالي][img-network-plugin-influxdb]

يُستخدم مخطط النشر التالي في هذه الوثيقة:
*   يُنشر عقد التصفية Wallarm على مضيف يُمكن الوصول إليه عبر عنوان الـ IP `10.0.30.5` واسم المجال المؤهل بالكامل `node.example.local`.
    
    يتم تكوين إضافة `network` لـ `collectd` على عقدة التصفية بحيث يتم إرسال كل المقاييس إلى خادم InfluxDB على العنوان `10.0.30.30` عبر المنفذ `25826/UDP`.
    
      
    !!! info "ميزات إضافة الشبكة"
        يُرجى ملاحظة أن الإضافة تعمل عبر UDP (راجع [أمثلة الاستخدام][link-collectd-networking] و[التوثيق][link-network-plugin] لإضافة الشبكة).
    
    
*   يتم نشر كل من خدمات `influxdb` وgrafana كحاويات Docker على مضيف منفصل بعنوان الـ IP `10.0.30.30`.

    يتم تكوين خدمة `influxdb` مع قاعدة بيانات InfluxDB على النحو التالي:

      * تم إنشاء مصدر بيانات `collectd` (وفقًا لمصطلحات InfluxDB، الإدخال `collectd`)، الذي يستمع على المنفذ `25826/UDP` ويكتب المقاييس الواردة إلى قاعدة بيانات تُسمى `collectd`.
      * تتم الاتصالات مع واجهة برمجة تطبيقات InfluxDB عبر المنفذ `8086/TCP`.
      * تشارك الخدمة شبكة Docker المُسماة `sample-net` مع خدمة `grafana`.
    
    
    
    تم تكوين خدمة `grafana` مع Grafana على النحو التالي:
    
      * واجهة ويب Grafana متاحة على `http://10.0.30.30:3000`.
      * تشارك الخدمة شبكة Docker المُسماة `sample-net` مع خدمة `influxdb`.

##  تكوين تصدير المقاييس إلى InfluxDB

--8<-- "../include/monitoring/docker-prerequisites.md"

### نشر InfluxDB و Grafana

نشر InfluxDB و Grafana على مضيف Docker:
1.  اصنع مجلدًا للعمل، على سبيل المثال، `/tmp/influxdb-grafana`، وانتقل إليه:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2.  لكي يعمل مصدر بيانات InfluxDB، ستحتاج إلى ملف يُسمى `types.db` يحتوي على أنواع قيم `collectd`.
    
    يصف هذا الملف مواصفات مجموعات البيانات الذي يستخدمها `collectd`. تتضمن مجموعات البيانات هذه تعريفات لأنواع القياس. متاحة المعلومات المفصلة حول هذا الملف [هنا][link-typesdb].
    
    [قم بتنزيل ملف `types.db`][link-typesdb-file] من مستودع مشروع `collectd` على GitHub وضعه في مجلد العمل.
    
3.  احصل على ملف تكوين InfluxDB الأساسي بتنفيذ الأمر التالي: 
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4.  قم بتمكين مصدر بيانات `collectd` في ملف تكوين `influxdb.conf` لـ InfluxDB بتغيير قيمة المعلمة `enabled` في قسم `[[collectd]]` من `false` إلى `true`.
    
    اترك باقي المعلمات كما هي.
   
    يجب أن يظهر القسم على هذا النحو:
   
    ```
    [[collectd]]
      enabled = true
      bind-address = ":25826"
      database = "collectd"
      retention-policy = ""
      batch-size = 5000
      batch-pending = 10
      batch-timeout = "10s"
      read-buffer = 0
      typesdb = "/usr/share/collectd/types.db"
      security-level = "none"
      auth-file = "/etc/collectd/auth_file"
      parse-multivalue-plugin = "split"  
    ```
    
5.  أنشئ ملفًا بإسم `docker-compose.yaml` في مجلد العمل بالمحتوى التالي:
   
    ```
    version: "3"
    
    services:
      influxdb:
        image: influxdb
        container_name: influxdb
        ports:
          - 8086:8086
          - 25826:25826/udp
        networks:
          - sample-net
        volumes:
          - ./:/var/lib/influxdb
          - ./influxdb.conf:/etc/influxdb/influxdb.conf:ro
          - ./types.db:/usr/share/collectd/types.db:ro
    
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```

    وفقًا للإعدادات في `volumes:`، ستستخدم InfluxDB
    1.  مجلد العمل كمخزن لقاعدة البيانات.
    2.  ملف التكوين `influxdb.conf` الموجود في مجلد العمل.
    3.  ملف `types.db` بأنواع القيم القابلة للقياس الموجود في مجلد العمل.  
    
6.  ابن الخدمات بتنفيذ أمر `docker-compose build`.
    
7.  قم بتشغيل الخدمات بتنفيذ أمر `docker-compose up -d influxdb grafana`.
    
8.  أنشئ قاعدة بيانات باسم `collectd` لمصدر بيانات InfluxDB المُقابل بتنفيذ الأمر التالي:
   
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    يجب أن يُرجع خادم InfluxDB استجابة مشابهة لـ:
   
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    Request-Id: 23604241-b086-11e9-8001-0242ac190002
    X-Influxdb-Build: OSS
    X-Influxdb-Version: 1.7.7
    X-Request-Id: 23604241-b086-11e9-8001-0242ac190002
    Date: Sat, 27 Jul 2019 15:49:37 GMT
    Transfer-Encoding: chunked
    
    {"results":[{"statement_id":0}]}
    ```
    
في هذه اللحظة، يجب أن يكون InfluxDB قيد التشغيل، جاهزًا لاستقبال المقاييس من `collectd`، ويجب أن تكون Grafana جاهزة لمراقبة وتصور البيانات المخزنة في InfluxDB.

### تكوين `collectd`

قم بتكوين `collectd` لتصدير المقاييس إلى InfluxDB:
1. توصل بعقدة التصفية (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من أنك مُسجل الدخول كمدير النظام أو أي حساب آخر بامتيازات المشرف.
2. أنشئ ملفًا باسم `/etc/collectd/collectd.conf.d/export-to-influxdb.conf` بالمحتوى التالي:
   
    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
    تتم هنا تكوين الكيانات التالية:

    1.  الخادم، لإرسال المقاييس إليه (`10.0.30.30`)
    2.  المنفذ الذي يستمع عليه الخادم (`25826/UDP`)
    
3. أعد تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

الآن، يتلقى InfluxDB كل مقاييس عقدة التصفية. يمكنك تصور المقاييس التي تهمك ومراقبتها [باستخدام Grafana][doc-grafana].