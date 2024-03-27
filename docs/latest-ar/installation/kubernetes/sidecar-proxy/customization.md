# تخصيص Wallarm Sidecar

توجهك هذه المقالة على التخصيص الآمن والفعال لـ [حل Wallarm Kubernetes Sidecar](deployment.md) مع تقديم أمثلة لبعض سيناريوهات التخصيص الشائعة.

## منطقة التكوين

يعتمد حل Wallarm Sidecar على مكونات Kubernetes القياسية ، وبالتالي فإن تكوين الحل يشبه إلى حد كبير تكوين مكدس Kubernetes. يمكنك تكوين حل Wallarm Sidecar على مستوى العالمي عبر `values.yaml` وعلى أساس كل تطبيق كبسولات عبر التعليقات التوضيحية.

### الإعدادات العالمية

تنطبق خيارات التكوين العالمية على جميع موارد الجانبية التي تم إنشاؤها بواسطة تحكم Wallarm ويتم تعيينها في [القيم الافتراضية لرسم الخرائط Helm](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml). يمكنك تجاوزهم خلال `helm install` أو `helm upgrade` عن طريق تقديم `values.yaml` مخصصة.

عدد خيارات التكوين العالمية المتاحة غير محدود. يجب توخي الحذر عند تخصيص الحل لأنه يتيح تغيير كامل لبود الناتج ووظيفة الحل غير السليمة نتيجة لذلك. يرجى الاعتماد على توثيق Helm و Kubernetes عند تغيير الإعدادات العالمية.

[هناك قائمة بقيم الرسم البياني الخاصة بـ Wallarm](helm-chart-for-wallarm.md)

### إعدادات الكبسولات لكل مستخدم

تسمح إعدادات الكبسولات لكل مستخدم باختصار سلوك الحل لتطبيقات معينة.

يتم تعيين إعدادات تطبيق الكبسولات عبر التعليقات التوضيحية لـ Pods التطبيق. تأخذ التعليقات التوضيحية الأفضلية على الإعدادات العالمية. إذا تم تحديد الخيار نفسه على مستوى العالم وعبر التعليق التوضيحي ، سيتم تطبيق القيمة من التعليق التوضيحي.

يقتصر مجموع التعليقات التوضيحية المدعوم على حد ما ، ولكن تعليقات التوضيح الخاصة بـ `nginx-*-include` و `nginx-*-snippet` تسمح باستخدام أي [تكوين NGINX مخصص يستخدمه الحل](#using-custom-nginx-configuration).

[هناك قائمة بتعليقات التوضيح الخاصة بـ per-pod المدعومة](pod-annotations.md)

## سيناريوهات استخدام التكوين

كما ذكرنا من قبل ، يمكنك تخصيص الحل بطرق متعددة لتناسب بنية التحتية الخاصة بك والمتطلبات المتعلقة بحل الأمان. لتسهيل تنفيذ أكثر خيارات التخصيص شيوعًا ، وصفناها بالنظر في أفضل الممارسات ذات الصلة.

### واحد وتقسيم الإرسال من الحاويات

تقدم Wallarm خيارين لإرسال حاويات Wallarm إلى كبسولة:

* النشر الفردي (بشكل افتراضي)
* نشر مقسم

![الحاويات المفردة والمقسمة] [single-split-containers-img]

يمكنك تعيين خيارات نشر الحاويات على مستوى العالم ولكل كبسولة على:

* عالميًا من خلال تعيين قيمة رسم الخرائط Helm `config.injectionStrategy.schema` إلى `single` (افتراضي) أو `split`.
* على أساس الكبسولة لكل مستخدم عن طريق تعيين التعليق التوضيحي لتطبيق الكبسولة المناسب `sidecar.wallarm.io/sidecar-injection-schema` إلى `"single"` أو `"split"`.

!!! معلومات "وحدة Postanalytics"
    يرجى ملاحظة أن حاوية وحدة postanalytics تعمل [بشكل منفصل](deployment.md#solution-architecture) ، فإن خيارات النشر الموصوفة متعلقة فقط بالحاويات الأخرى.

#### النشر الفردي (بشكل افتراضي)

مع النشر الفردي لحاويات Wallarm ، ستعمل حاوية واحدة فقط في كبسولة ، بخلاف الحاوية الاختيارية الأولية مع **iptables**.

نتيجة لذلك ، هناك حاويتان تعملان:

* `sidecar-init-iptables` هي الحاوية الأولية التي تعمل iptables. بشكل افتراضي ، يبدأ هذا الحاوي ولكن يمكنك [تعطيله](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy` يعمل بروكسي NGINX مع وحدات Wallarm وبعض خدمات المساعدة. يتم تشغيل جميع هذه العمليات وإدارتها بواسطة [supervisord](http://supervisord.org/).

#### الانشاء المقسم

مع التقسيم في نشر حاويات Wallarm ، ستعمل حاويتان إضافيتان في كبسولة ، بخلاف حاويتي الأولى.

ينقل هذا الخيار جميع خدمات المساعدة من الحاوية `sidecar-proxy` ويظل فقط خدمات NGINX التي يتم بدء تشغيلها بواسطة الحاوية.

توفر نشر الحاوية المقسمة تحكمًا أكثر تفصيلاً في الموارد التي يستهلكها NGINX وخدمات المساعدة. هو الخيار الموصى به للتطبيقات المحملة ذات الحمولة الكبيرة حيث يكون تقسيم أسماء المساحة المستخدمة بين CPU / Memory / Storage بين Wallarm والحاويات المساعدة ضروريًا.

نتيجة لذلك ، هناك أربع حاويات تعمل:

* `sidecar-init-iptables` هي الحاوية الأولية التي تعمل iptables. بشكل افتراضي ، يبدأ هذا الحاوي ولكن يمكنك [تعطيله](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper` هو الحاوية الأولية مع خدمات المساعدة المكلفة بتوصيل العقدة Wallarm بـ Wallarm Cloud.
* `sidecar-proxy` هو الحاوية مع خدمات NGINX.
* `sidecar-helper` هو الحاوية مع بعض خدمات المساعدة الأخرى.

### الكشف التلقائي عن منفذ الحاوية التطبيقية

يمكن تكوين منفذ التطبيق المحمي بطرق عديدة. للتعامل مع حركة المرور القادمة بشكل صحيح وإعادة توجيهها ، يجب أن يكون جانبي Wallarm على علم بمنفذ TCP الذي يقبل الكبسولة التطبيقية الطلبات الواردة.

بشكل افتراضي ، يكتشف تحكم الجانب الجانبي تلقائيًا المنفذ ضمن الترتيب حسب الأفضلية التالية:

1. إذا تم تعريف المنفذ عن طريق التعليق التوضيحي `sidecar.wallarm.io/application-port` لكبسولة التطبيق ، يستخدم تحكم Wallarm هذه القيمة.
1. إذا كان هناك منفذ محدد تحت إعداد الكبسولة التطبيقية `name:http` ، يستخدم تحكم Wallarm هذه القيمة.
1. إذا لم يكن هناك منفذ معرف تحت إعداد `name: http` ، يستخدم تحكم Wallarm قيمة المنفذ التي تم العثور عليها أولاً في إعدادات الكبسولة التطبيقية.
1. إذا لم تكن هناك منافذ معرفة في إعدادات الكبسولة التطبيقية ، يستخدم تحكم Wallarm قيمة `config.nginx.applicationPort` من رسم الخرائط الهلم لـ Wallarm.

إذا لم يكن الكشف التلقائي لمنفذ الكبسولة التطبيقية يعمل كما هو متوقع ، فقم بتحديد المنفذ بوضوح باستخدام الخيار الأول أو الرابع.

### التقاط حركة المرور الواردة (توجيه المنافذ)

بشكل افتراضي ، يعالج تحكم جانبي Wallarm حركة المرور على النحو التالي:

1. التقاط حركة المرور الواردة التي تأتي إلى الكبسولة المرتبطة بـ IP ومنفذ الكبسولة التطبيقي.
1. إعادة توجيه هذه الحركة إلى الحاوية الجانبية باستخدام ميزات iptables المدمجة.
1. يخفف الجانب من التهديدات غير المشروعة ويعيد توجيه حركة المرور الشرعية إلى الكابسولة التطبيقية.

يتم تنفيذ التقاط حركة المرور الواردة باستخدام الحاوية الأولية التي تعمل iptables والتي تعد أفضل ممارسة لتوجيه المنافذ التلقائي. يتم تشغيل هذا الحاوي كمتحصن ، مع قدرة `NET_ADMIN`.

![توجيه المنافذ الافتراضي مع iptables][port-forwarding-with-iptables-img]

ومع ذلك ، هذا النهج غير متوافق مع شبكة service mesh مثل Istio حيث أن Istio لديها بالفعل التقاط حركة المرور القائم على iptables مطبقة. في هذه الحالة ، يمكنك تعطيل iptables وستعمل توجيه المنافذ على النحو التالي:

![توجيه المنافذ بدون iptables][port-forwarding-without-iptables-img]

!!! معلومات "كبسولة التطبيق غير المحمية"
    إذا تم تعطيل iptables ، فستكون الكبسولة التطبيقية المعرضة غير محمية بواسطة Wallarm. نتيجة لذلك ، قد يصل حركة المرور الشرق-الغرب الخبيثة إلى الكبسولة التطبيقية إذا كان عنوان IP الخاص بها والمنفذ معروفة للمهاجم.

    يعد حركة المرور الشرق / الغرب حركة المرور التي تتدفق حول مجموعة Kubernetes (مثل الخدمة إلى الخدمة).

يمكنك تغيير السلوك الافتراضي على النحو التالي:

1. تعطيل iptables بأحد الطرق التالية:

    * على مستوى العالم عن طريق تعيين قيمة رسم الخرائط Helm `config.injectionStrategy.iptablesEnable` إلى `"false"`
    * على أساس كبسولات لكل مستخدم عن طريق تعيين تعليق كبسولة `sidecar.wallarm.io/sidecar-injection-iptables-enable` إلى `"false"`
2. تحديث إعداد `spec.ports.targetPort` في أداء الخدمة للإشارة إلى منفذ `proxy`.

    إذا تم تعطيل التقاط حركة المرور القائمة على iptables ، فستنشر الكابسولة الجانبية منفذًا باسم `proxy`. لكي تأتي حركة المرور الواردة من الخدمة Kubernetes إلى منفذ `proxy` ، يجب أن يشير إعداد `spec.ports.targetPort` في مانيفست الخدمة إلى هذا المنفذ:

```yaml hl_lines="16-17 34"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
  namespace: default
spec:
  ports:
    - port: 80
      targetPort: proxy
      protocol: TCP
      name: http
  selector:
    app: myapp
```

### SSL/TLS الاقناع

افتراضياً ، يقبل الحل Sidecar حركة المرور HTTP فقط ويعيد توجيه حركة المرور HTTP العادية إلى كبسولات التطبيق. يتم التصور أنه يتم تنفيذ اقناع SSL/TLS بواسطة مكون البنية التحتية الواقعة قبل الحل الجانبي (مثل Ingress / Application Gateway) ، مما يتيح للحل الجانبي معالجة HTTP العادية.

ومع ذلك ، قد تكون هناك حالات حيث لا تدعم البنية التحتية القائمة اقناع SSL/TLS. في مثل هذه الحالات ، يمكنك تمكين اقناع SSL/TLS على مستوى الجانب الجانبي لـ Wallarm. يتم دعم هذه الميزة بدءًا من رسم الخرائط Helm 4.6.1.

!!! تحذير "الحل الجانبي يدعم إما معالجة حركة المرور SSL أو HTTP العادية"
    يدعم الحل الجانبي Wallarm إما معالجة حركة المرور SSL/TLS أو معالجة حركة المرور HTTP العادية. تمكين اقناع SSL/TLS يعني أن الحل الجانبي لن يعالج حركة المرور HTTP العادية ، بينما سيؤدي تعطيل اقناع SSL/TLS إلى معالجة حركة المرور HTTPS فقط.

لتمكين اقناع SSL/TLS:

1. احصل على الشهادة (المفتاح العام) والمفتاح الخاص المرتبطان بالخادم الذي سيتم اقناع SSL/TLS بواسطة Sidecar.
1. في نطاق الكبسولة التطبيقية ، قم بإنشاء [سري TLS](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) يحتوي على الشهادة الخادم والمفتاح الخاص.
1. في الملف `values.yaml` ، أضف قسم `config.profiles` لتثبيت السر. يظهر البرنامج التالي ضبط تثبيت شهادة متعددة.

    قم بتخصيص الكود استنادًا إلى التعليقات لتلبية احتياجاتك. قم بإزالة أي تكوينات تثبيت شهادة غير ضرورية إذا كنت بحاجة فقط إلى تثبيت شهادة واحدة.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # أو سلسلة فارغة إذا كنت تستخدم EU Cloud
        # Other Wallarm settings https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # حدد أي اسم ملف تعريف TLS مطلوب هنا
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # اسم الحجم الذي يحتوي على مفاتيح example.com
                mountPath: /etc/nginx/certs/example.com # مسار لتركيب مفاتيح example.com في الحاوية
                readOnly: true
              - name: nginx-certs-example-io # اسم الحجم الذي يحتوي على مفاتيح example.io
                mountPath: /etc/nginx/certs/example.io # مسار لتركيب مفاتيح example.io في الحاوية
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # اسم الحجم الذي يحتوي على مفاتيح example.com
                secret:
                  secretName: example-com-certs # اسم السري المنشأ للنسخ الاحتياطي example.com ، يحتوي على المفاتيح العامة والخاصة
              - name: nginx-certs-example-io # اسم الحجم الذي يحتوي على مفاتيح example.io
                secret:
                  secretName: example-io-certs # اسم السري المنشأ للنسخ الاحتياطي example.io ، يحتوي على المفاتيح العامة والخاصة
          nginx:
            # تكوين نموذج NGINX SSL خاص بإجراء اقناع TLS/SSL الخاص بك.
            # أشر إلى https://nginx.org/en/docs/http/ngx_http_ssl_module.html.
            # هذا التكوين مطلوب لتنفيذ اقناع حركة المرور من قبل الجانب.
            servers:
              - listen: "ssl http2"
                include:
                  - "server_name example.com www.example.com"
                  - "ssl_protocols TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.com/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.com/tls.key"
                  - "ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384"
                  - "ssl_conf_command Ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
              - listen: "ssl"
                include:
                  - "server_name example.io www.example.io"
                  - "ssl_protocols TLSv1.2 TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.io/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.io/tls.key"
    ```
1. طبق التغييرات من `values.yaml` إلى الحل الجانبي باستخدام الأمر التالي:

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. [طبق](pod-annotations.md#how-to-use-annotations) التعليق التوضيحي `sidecar.wallarm.io/profile: tls-profile` على الكبسولة التطبيقية.
1. بمجرد تطبيق التكوين ، يمكنك اختبار الحل من خلال اتباع الخطوات الموصوفة [هنا](deployment.md#step-4-test-the-wallarm-sidecar-proxy-operation) ، بتبديل البروتوكول HTTP بـ HTTPS.

سوف يقبل الحل الجانبي حركة المرور TLS/SSL ، وينهيها ، ويعيد توجيه حركة المرور HTTP العادية إلى الكبسولة التطبيقية.

### تمكين وحدات NGINX الإضافية

يتم توزيع صورة Docker الخاصة بـ Wallarm sidecar مع الوحدات الإضافية الآتية NGINX معطلة بشكل افتراضي:

* [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)
* [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
* [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
* [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)

يمكنك تمكين الوحدات النمطية الإضافية فقط على أساس الكبسولة لكل مستخدم عن طريق تعيين التعليق التوضيحي لكبسولة `sidecar.wallarm.io/nginx-extra-modules`.

تنسيق قيمة التعليق يكون مصفوفة. مثال مع تمكين الوحدات النمطية الإضافية:

```yaml hl_lines="16-17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/nginx-extra-modules: "['ngx_http_brotli_filter_module.so','ngx_http_brotli_static_module.so', 'ngx_http_opentracing_module.so']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### استخدام تكوين NGINX مخصص

إذا لم تكن هناك [تعليقات توضيحية للكبسولات](pod-annotations.md) مخصصة لبعض إعدادات NGINX ، يمكنك تحديدها عبر **القصاصات** و **المحتويات** لكل كبسولة.

#### كتيبات

الكتيبات هي طريقة مريحة لإضافة تغييرات أحادية في التكوين NGINX . للتغييرات أكثر تعقيداً ، [include](#include) هو الخيار الموصى به.

لتحديد الإعدادات المخصصة عبر الكتيبات ، استخدم التعليقات التوضيحية الخاصة بـ pods  التالية:

| قسم تكوين NGINX | التعليق التوضيحي                            |
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

مثال على التعليق التوضيحي يغير قيمة التوجيه [disable_acl][disable-acl-directive-docs] NGINX  :

```yaml hl_lines="18"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/nginx-location-snippet: "disable_acl on"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

لتحديد أكثر من توجيه ، استخدم الرمز `;` ، على سبيل المثال:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### تتضمن

لتوصيل ملف التكوين NGINX الإضافي إلى حاوية Wallarm sidecar ، يمكنك [إنشاء ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) أو [توريد سري](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) من هذا الملف واستخدام المورد في الحاوية.

بمجرد إنشاء المورد ConfigMap أو Secret ، يمكنك توصيله إلى الحاوية عبر [مكونات المجلد و توصيل المجلد](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) عن طريق استخدام التعليقات التوضيحية لـ pods التالية:

| العنصر          | التعليق التوضيحي                                    | نوع القيمة |
|---------------|------------------------------------------------|-------------|
| المجلدات       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON |
| توصيل المجلدات | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON |

بمجرد توصيل المورد إلى الحاوية ، حدد سياق NGINX لإضافة التكوين عن طريق تمرير المسار إلى الملف الموصول في التعليق التوضيحي المقابل:

| قسم تكوين NGINX | التعليق التوضيحي                                  | نوع القيمة |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | Array  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | Array  |
| location             | `sidecar.wallarm.io/nginx-location-include` | Array  |

فيما يلي مثال مع توصيل ملف التكوين الموضوع وتضمينه على المستوى `http` لتكوين NGINX. يفترض هذا البرنامج أن ConfigMap `nginx-http-include-cm` قد تم إنشاؤها مسبقاً وتحتوي على توجيهات تكوين NGINX صالحة.

```yaml hl_lines="16-19"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/proxy-extra-volumes: '[{"name": "nginx-http-extra-config", "configMap": {"name": "nginx-http-include-cm"}}]'
        sidecar.wallarm.io/proxy-extra-volume-mounts: '[{"name": "nginx-http-extra-config", "mountPath": "/nginx_include/http.conf", "subPath": "http.conf"}]'
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### تكوين وظائف Wallarm

بالإضافة إلى الإعدادات العامة الخاصة بالحل المدرجة ، نوصيك أيضًا بالاطلاع على [أفضل الممارسات لمنع الهجمات مع Wallarm][wallarm-attack-prevention-best-practices-docs].

يتم تنفيذ هذا التكوين عبر [التعليقات التوضيحية](pod-annotations.md) وواجهة المستخدم التحكم Wallarm.

## التكوينات الأخرى عبر التعليقات التوضيحية

بالإضافة إلى حالات الاستخدام التكوين المدرجة ، يمكنك التنقيح في تحسين صحة حل Wallarm sidecar لكبسولات التطبيق باستخدام العديد من التعليقات التوضيحية الأخرى.

[هناك قائمة بتعليقات التوضيح المدعومة لكل كبسولة](pod-annotations.md)