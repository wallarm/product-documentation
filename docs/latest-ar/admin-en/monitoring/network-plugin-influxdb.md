![صورة خطة العمل المثالية][img-network-plugin-influxdb]

المخطط التالي يُستخدم في هذا المستند:
* يُنشر عُقدة تصفية Wallarm على مضيف يمكن الوصول إليه عبر عنوان الـ IP `10.0.30.5` واسم المجال المؤهل بالكامل `node.example.local`.

    يُهيئ الـ `network` plugin لـ `collectd` على عقدة التصفية بطريقة تجعل جميع المقاييس تُرسل إلى خادم InfluxDB على الـ port `25826/UDP`.

    !!! معلومة "ميزات الـ network plugin"
        يُرجى ملاحظة أن الـ plugin يعمل عبر UDP (انظر [استخدام الأمثلة][link-collectd-networking] و[التوثيق][link-network-plugin] الخاص بـ الـ`network` plugin).
    
    
* يتم نشر خدمات `influxdb` وgrafana كحاويات Docker على مضيف منفصل بعنوان IP `10.0.30.30`.

    خدمة `influxdb` مع قاعدة بيانات InfluxDB مُهيئة كالتالي:

      * تم إنشاء مصدر بيانات `collectd` (الإدخال `collectd` وفقًا لمصطلحات InfluxDB)، يستمع على الـ port `25826/UDP` ويكتب المقاييس الواردة إلى قاعدة بيانات تُسمى `collectd`.
      * يحدث التواصل مع واجهة برنامج تطبيق InfluxDB عبر الـ port `8086/TCP`.
      * الخدمة تشارك شبكة Docker `sample-net` مع خدمة `grafana`.
    
    
    
    خدمة `grafana` مع Grafana مُهيأة كالتالي:
    
      * واجهة ويب Grafana متاحة على `http://10.0.30.30:3000`.
      * الخدمة تشارك الشبكة `sample-net` Docker مع خدمة `influxdb`.

### نشر InfluxDB وGrafana

نشر InfluxDB وGrafana على مضيف Docker:
1. إنشاء دليل عمل، على سبيل المثال، `/tmp/influxdb-grafana`، والانتقال إليه:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2. لعمل مصدر بيانات InfluxDB، ستحتاج إلى ملف يُسمى `types.db` يحتوي على أنواع قيم `collectd`.
    
    هذا الملف يصف مواصفات مجموعات البيانات المُستخدمة بواسطة `collectd`. مثل هذه المجموعات تشمل تعريفات أنواع القياسات. معلومات مفصلة عن هذا الملف متاحة [هنا][link-typesdb].
    
    [قم بتحميل ملف `types.db`][link-typesdb-file] من مستودع `collectd` على GitHub وضعه في الدليل العملي.
    
3. احصل على ملف التهيئة الأساسي InfluxDB بتنفيذ الأمر التالي: 
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4. قم بتفعيل مصدر بيانات `collectd` في ملف تهيئة InfluxDB `influxdb.conf` بتغيير قيمة الـ parameter `enabled` في القسم `[[collectd]]` من `false` إلى `true`.
    
    اترك باقي الـ parameters دون تغيير.
   
    يجب أن يكون القسم كالتالي:
   
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
    
5. إنشاء ملف `docker-compose.yaml` في الدليل العملي بالمحتوى التالي:
   
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

    وفقًا للإعدادات في `volumes:`، سيستخدم InfluxDB
    1. الدليل العملي كتخزين لقاعدة البيانات.
    2. ملف التهيئة `influxdb.conf` الذي يقع في الدليل العملي.
    3. ملف `types.db` بأنواع القيم القابلة للقياس الموجود في الدليل العملي.  
    
6. بناء الخدمات بتنفيذ الأمر `docker-compose build`.
    
7. تشغيل الخدمات بتنفيذ الأمر `docker-compose up -d influxdb grafana`.
    
8. إنشاء قاعدة بيانات تُسمى `collectd` لمصدر بيانات InfluxDB المُناظر بتنفيذ الأمر التالي:
   
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    يجب أن يعود خادم InfluxDB برد مشابه لـ:
   
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
    
في هذه النقطة، يجب أن يكون InfluxDB يعمل، جاهزًا لتلقي المقاييس من `collectd`، ويجب أن تكون Grafana جاهزة لمراقبة وتصوير البيانات المخزنة في InfluxDB.

### تهيئة `collectd`

تهيئة `collectd` لتصدير المقاييس إلى InfluxDB:
1. الاتصال بعقدة التصفية (على سبيل المثال، باستخدام بروتوكول SSH). تأكد من تسجيل الدخول كمستخدم root أو أي حساب آخر بصلاحيات المشرف.
2. إنشاء ملف يُسمى `/etc/collectd/collectd.conf.d/export-to-influxdb.conf` بالمحتوى التالي:
   
    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
    تُهيأ الكائنات التالية هنا:

    1. الخادم، لإرسال المقاييس إليه (`10.0.30.30`)
    2. الـ port الذي يستمع عليه الخادم (`25826/UDP`)
    
3. إعادة تشغيل خدمة `collectd` بتنفيذ الأمر المناسب:

    --8<-- "../include/monitoring/collectd-restart-2.16.md"

الآن، InfluxDB يتلقى جميع المقاييس لعقدة التصفية. يمكنك تصوير المقاييس التي تهمك ومراقبتها [باستخدام Grafana][doc-grafana].