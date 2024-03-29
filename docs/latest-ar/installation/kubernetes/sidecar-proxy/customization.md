# تخصيص Wallarm Sidecar

توجه هذه المقالة لك حول تخصيص حل [Wallarm Kubernetes Sidecar](deployment.md) بطريقة آمنة وفعالة مع توفير أمثلة لبعض الحالات الشائعة للتخصيص.

## المنطقة التكوينية

حل Wallarm Sidecar يعتمد على مكونات Kubernetes القياسية ، وبالتالي فإن التكوين الخاص بالحل يشبه إلى حد كبير تكوين مكدس Kubernetes. يمكنك تكوين حل Wallarm Sidecar على مستوى عام عبر `values.yaml` وعلى أساس الحاوية المطبقة وفقًا للتعليمات البرمجية.

### الإعدادات العامة

تنطبق خيارات التكوين العام على جميع موارد الوحدة الجانبية التي تم إنشاؤها بواسطة المتحكم Wallarm وتتم تعيينها في [القيم الافتراضية لرسم حلم](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml). يمكنك تجاوزها أثناء `helm install` أو `helm upgrade` عن طريق تقديم القيم الخاصة `values.yaml`.

ليس لديها العديد من الخيارات التكوينية العامة المتاحة حد. يجب أن يُولى العناية عند تخصيص الحل لأنه يسمح بتغيير كامل لPod الناتج ووظيفة الحل غير الصحيحة كنتيجة. يرجى الاعتماد على توثيق Helm وKubernetes عند تغيير الإعدادات العالمية.

[هنا قائمة بقيم الرسوم البيانية المحددة من Wallarm](helm-chart-for-wallarm.md)

### إعدادات الحاويات الفردية

تتيح الإعدادات لكل حاوية تخصيص سلوك الحل لتطبيقات معينة.

تتم تعيين إعدادات الحاويات المطبقة على أساس الحاويات عبر التعليمات البرمجية لحاوية التطبيق. تتقدم التعليمات البرمجية على الإعدادات العامة. إذا تم تحديد نفس الخيار على مستوى عام وعبر العلامة التوضيحية ، سيتم تطبيق القيمة من التعليمة البرمجية.

مجموعة التعليمات البرمجية المدعومة محدودة ، لكن التعليمات البرمجية `nginx-*-include` و`nginx-*-snippet` تتيح أي [تكوين مخصص لـ NGINX يمكن استخدامه من قبل الحل](#using-custom-nginx-configuration).

[هنا قائمة بالتعليمات البرمجية المدعومة لكل حاوية](pod-annotations.md)

## حالات استخدام التكوين

كما ذكرنا أعلاه ، يمكنك تخصيص الحل بالعديد من الطرق لتناسب بنيتك التحتية ومتطلباتك المتعلقة بحل الأمان. لجعل الخيارات التخصيص الأكثر شيوعا أسهل في التنفيذ ، لقد وصفناها مع الأخذ بعين الاعتبار أفضل الممارسات ذات الصلة.

### التجهيز الفردي والانقسام للحاويات

توفر Wallarm خيارين لتجهيز حاويات Wallarm في حاوية:

* التجهيز الفردي (بشكل افتراضي)
* تجهيز الانقسام

![حاويات فردية ومنفصلة][single-split-containers-img]

يمكنك تعيين خيارات تجهيز الحاوية على أساس عام ولكل حاوية:

* على مستوى عام من خلال تعيين قيمة حلم الرسم البياني `config.injectionStrategy.schema` إلى `single` (الافتراضي) أو `split`.
* على أساس حاوية واحدة عن طريق تعيين التعليمة البرمجية المناسبة لحاوية التطبيق `sidecar.wallarm.io/sidecar-injection-schema` إلى `"single"` أو `"split"`.

!!! info "وحدة Postanalytics"
    يرجى ملاحظة أن حاوية وحدة الما بعد التحليل تعمل [على حدة](deployment.md#solution-architecture)، الخيارات التجهيز الموصوفة هي ذات الصلة فقط بالحاويات الأخرى.

#### التجهيز الفردي (بشكل افتراضي)

مع التجهيز الفردي لحاويات Wallarm ، ستعمل حاوية واحدة فقط في الحاوية ، وبصرف النظر عن الحاوية الابتدائية الاختيارية مع **iptables**.

نتج عن ذلك هناك حاويتين تعملان:

* `sidecar-init-iptables` هو الحاوية الابتدائية التي تعمل iptables. بشكل افتراضي ، تبدأ هذه الحاوية لكن يمكنك[تعطيله](#capturing-incoming-traffic-port-forwarding).
* `sidecar-proxy` يعمل خادم الوكيل NGINX مع وحدات Wallarm وبعض خدمات المساعدة. يتم تشغيل جميع هذه العمليات وإدارتها بواسطة [supervisord](http://supervisord.org/).

#### التجهيز المنفصل

مع التجهيز المنفصل لحاويات Wallarm ، ستعمل حاويتين إضافيتين في الحاوية ، وبصرف النظر عن حاويتين ابتدائيتين.

تنقل هذا الخيار جميع خدمات المساعده من الحاوية `sidecar-proxy` وتبقى فقط خدمات NGINX لتبدأ بواسطة الحاوية.

يوفر تجهيز الحاوية المنفصلة التحكم الأكثر دقة في الموارد التي يستهلكها NGINX وخدمات المساعدة. هذا هو الخيار الموصى به للتطبيقات الثقيلة حيث تكون الفرق مناسبة بين الفضاء الحر للمعالجة/الذاكرة/التخزين بين Wallarm والحاويات المساعدة ضرورية.

نتج عن ذلك هناك أربع حاويات تعملان:

* `sidecar-init-iptables` هو الحاوية الابتدائية التي تعمل iptables. بشكل افتراضي ، تبدأ هذه الحاوية لكن يمكنك [تعطيله](#capturing-incoming-traffic-port-forwarding).
* `sidecar-init-helper` هو الحاوية الابتدائية مع خدمات المساعدة المكلفة بربط العقدة Wallarm بـ Wallarm Cloud.
* `sidecar-proxy` هو الحاوية مع خدمات NGINX.
* `sidecar-helper` هي الحاوية مع بعض خدمات المساعدة الأخرى.

### اكتشاف المنفذ الخاص بالتطبيق الحاوية تلقائياً

يمكن تكوين منفذ التطبيق المحمي بطرق كثيرة. للتعامل مع الترافيك الوارد وتوجيهه بشكل صحيح ، يجب أن يكون جانب العربة Wallarm على بينة من المنفذ المتعدد التضافر الذي يقبل منفذ التطبيق الوارد.

بشكل افتراضي ، يكتشف جانب العربة التحكم المنفذ تلقائيًا بالترتيب الأولوية التالي:

1. إذا تم تعريف المنفذ عبر اعلام الحاوية `sidecar.wallarm.io/application-port`، يستخدم جانب العربة هذه القيمة.
1. إذا كان هناك منفذ معرف تحت ضبط الحاوية التطبيقية `name: http`، يستخدم جانب العربة هذه القيمة.
1. إذا لم يكن هناك منفذ معرف تحت ضبط `name: http`، يستخدم جانب العربة قيمة المنفذ التي وجدت أولاً في ضبط الحاوية التطبيقية.
1. إذا لم تكن هناك منافذ محددة في ضبط الحاوية التطبيقية ، يستخدم جانب العربة قيمة `config.nginx.applicationPort` من حلم Wallarm.

إذا لم يكن اكتشاف منفذ الحاوية التطبيقية يعمل كما هو متوقع ، حدد المنفذ بوضوح باستخدام الخيار الأول أو الخيار الرابع.

### التقاط الترافيك الوارد (توجيه المنفذ)

بشكل افتراضي ، يقوم جانب العربة بتوجيه الترافيك كما يلي:

1. يلتقط الترافيك الوارد القادم إلى عنوان IP المرتبط بالحاوية ومنفذ الحاوية التطبيقية.
1. يعيد توجيه هذا الترافيك إلى جانب العربة باستخدام ميزات iptables المدمجة.
1. يلتقط الجانب الترفيك الخبيث ويوجه الترافيك المشروع إلى الحاوية التطبيقية.

يتم تنفيذ التقاط الترافيك الوارد باستخدام حاوية التهيئة التي تعمل iptables والتي تُعد أفضل الممارسات لتوجيه المنفذ التلقائي. تعمل هذه الحاوية كحاوية متميزة، مع القدرة `NET_ADMIN`.

![توجيه المنافذ الافتراضي باستخدام iptables][port-forwarding-with-iptables-img]

ومع ذلك ، هذا النهج غير متوافق مع شبكة الخدمة مثل Istio حيث يوجد لدى Istio بالفعل أداء التقاط الترافيك القائم على iptables. في هذه الحالة ، يمكنك تعطيل iptables وسوف يعمل توجيه المنفذ كما يلي:

![توجيه المنفذ بدون iptables][port-forwarding-without-iptables-img]

!!! info "الخادم التطبيقية غير المحمية"
    إذا تم تعطيل iptables، فإن الخادم التطبيقية المكشوفة لن تكون محمية من قبل Wallarm. نتيجة لذلك ، قد يصل الترافيك "من الشرق إلى الغرب" الخبيث إلى الخادم التطبيقية إذا كان عنوان IP 
    التطبيق والمنفذ معروف للمهاجم.

   تعتبر الترافيك القادمة من الشرق الغرب هي الترافيك المتدفق حول مجموعة Kubernetes (مثل الخدمة التي تُبذل للخدمة).

يمكنك تغيير السلوك الافتراضي على النحو التالي:

1. تعطيل iptables بأحد الطرق:

    * على مستوى عام بتعيين قيمة حلم الرسم البياني `config.injectionStrategy.iptablesEnable` إلى `"false"`
    * على أساس حاوية باستخدام التعليمات البرمجية الموجودة في حاوية `sidecar.wallarm.io/sidecar-injection-iptables-enable` إلى `"false"`
2. حدث إعداد `spec.ports.targetPort` في بيانك لخدمة لتشير إلى المنفذ `proxy`.

    إذا تم تعطيل التقاط الترافيك القائم على iptables وستُنشر الحاوية الجانبية Wallarm منفذ باسم `proxy`. لكي يأتي الترافيك الوارد من خدمة Kubernetes إلى منفذ `proxy`، يجب أن يشير إعداد `spec.ports.targetPort` في بيان الخدمة إلى هذا المنفذ:

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

### قطع SSL/TLS

بشكل افتراضي ، الحل الوحدة الجانبية يقبل فقط الترافيك HTTP ويعيد توجيه الترافيك HTTP العادي لحاويات التطبيقات. يفترض أن يتم قطع SSL/TLS بواسطة مكون التحتية الذي يقع قبل الحل الجانب (مثل Ingress / Application Gateway) ، مما يتيح للحل الجانب تقديم HTTP عادي.

ومع ذلك ، قد يكون هناك حالات في حيث لا يدعم التحتية الحالي قطع SSL/TLS. في هذه الحالات يمكنك تمكين قطع SSL/TLS على مستوى جانب العربة Wallarm. يتم دعم هذه الميزة بدءًا من خريطة حلم الرسم 4.6.1.

!!! warning "الحل الجانب يدعم إما معالجة الترافيك SSL أو HTTP العادي"
    حل Wallarm Sidecar يدعم إما استثمار SSL/TLS أو معالجة الترافيك HTTP العادي. تمكين قطع SSL/TLS يعني أن الحل الجانب لن يعالج الترافيك HTTP العادي ، بينما سيؤدي تعطيل قطع SSL/TLS إلى معالجة الترافيك HTTPS فقط.

لتمكين قطع SSL/TLS:

1. احصل على شهادة الخادم (المفتاح العام) والمفتاح الخاص المرتبط بالخادم الذي سوف تقوم الوحدة الجانبية بقطع SSL/TLS.
1. أنشئ في فضاء التطبيق حاوية [سرية TLS](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) تحتوي على شهادة الخادم والمفتاح الخاص.
1. في ملف `values.yaml`، أضف قسم `config.profiles` لتركيب السري. تعرض الأمثلة أدناه التكوينات المتعددة لتركيب الشهادة.

   قم بتخصيص الرمز على أساس التعليقات لتلبية احتياجاتك. أزل أي تكوينات تركيب غير ضرورية إذا كنت تحتاج فقط إلى شهادة واحدة.

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # أو سلسلة فارغة إذا كنت تستخدم السحابة الأوروبية
        # إعدادات Wallarm الأخرى https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # حدد أي اسم للملف الشخصي TLS هنا
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # اسم المجلد الذي يحتوي على مفاتيح example.com
                mountPath: /etc/nginx/certs/example.com # مسار لتثبيت مفاتيح example.com في الحاوية
                readOnly: true
              - name: nginx-certs-example-io # اسم المجلد الذي يحتوي على مفاتيح example.io
                mountPath: /etc/nginx/certs/example.io # مسار لتثبيت مفاتيح example.io في الحاوية
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # اسم المجلد الذي يحتوي على مفاتيح example.com
                secret:
                  secretName: example-com-certs # اسم السر الذي تم إنشاؤه لـ example.com، ويحتوي على المفاتيح العامة والخاصة.
              - name: nginx-certs-example-io # اسم المجلد الذي يحتوي على مفاتيح example.io
                secret:
                  secretName: example-io-certs # اسم السر الذي تم إنشاؤه لـ example.io، ويحتوي على المفاتيح العامة والخاصة
          nginx:
            # تكوين وحدة SSL NGINX خاص بإجراءات قطع TLS/SSL.
            # أرجع إلى https://nginx.org/en/docs/http/ngx_http_ssl_module.html.
            # هذا التكوين مطلوب للوحدة الجانبية لمعالجة قطع الترافيك.
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
  1. ضع التغييرات من `values.yaml` على الحل الجانب باستخدام الأمر التالي:

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. قم بتطبيق التعليمة البرمجية `sidecar.wallarm.io/profile: tls-profile` على حاوية التطبيق.
1. بمجرد تطبيق التكوين ، يمكنك اختبار الحل باتباع الخطوات الموصوفة [هنا](deployment.md#step-4-test-the-wallarm-sidecar-proxy-operation)، مع استبدال بروتوكول HTTP بـ HTTPS.

سوف تقبل الحل الجانبية الترافيك TLS/SSL، تعيش ذلك، وتوجه الترافيك العادي HTTP إلى حاوية التطبيق.

### تمكين وحدات NGINX الإضافية

يتم توزيع صورة Docker لـ جانب العربة Wallarm مع وحدات NGINX الاضافية الاتية معطلة بشكل افتراضي:

* [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)
* [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
* [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
* [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)

يمكنك تمكين الوحدات الإضافية فقط على أساس حاوية عن طريق تعيين التعليمة البرمجية للحاوية `sidecar.wallarm.io/nginx-extra-modules`.

نموذج قيمة التعليمة البرمجية هو مصفوفة. مثال على تمكين الوحدات الإضافية:

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

### استخدام تكوين NGINX المخصص

إذا لم يكن هناك [التعليمات البرمجية للحاوية](pod-annotations.md) مكرسة لبعض الإعدادات NGINX، يمكن تحديدها عبر **القصاصات** و**يتضمن** لكل حاوية.

#### قطعة

القصاصات هي طريقة مريحة لإضافة تغييرات في سطر واحد إلى التكوين NGINX. للتغييرات الأكثر تعقيدً، يعد الخيار [يضمن](#include) الخيار الموصى به.

لتحديد إعدادات مخصصة عبر القصاصات ، استخدم التعليمات البرمجية الخاصة بكل حاوية التالية:

| قسم التكوين NGINX  | التعليمة البرمجية |
|------------------------- |-----------------------------|
| http                          | `sidecar.wallarm.io/nginx-http-snippet` |
| server                        | `sidecar.wallarm.io/nginx-server-snippet` |
| location                      | `sidecar.wallarm.io/nginx-location-snippet` |

مثال على التعليمة البرمجية تغيير قيمة المديرية NGINX [`disable_acl`][disable-acl-directive-docs]:

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

لتحديد أكثر من توجيه واحد ، استخدم الرمز `;`، على سبيل المثال :

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### تضمين

لاجراء إلتصاق ملف تكوين NGINX إضافي إلى جانب العربة، يمكنك [إنشاء ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) أو [Secret](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) من هذا الملف واستخدم المورد المنشأ في الحاوية.

بمجرد أن تم إنشاء المورد ConfigMap أو Secret، يمكنك تثبيته في الحاوية عن طريق [Volume و VolumeMounts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) باستخدام التعليمات البرمجية المتعلقة بكل حاوية التالية:

| العنصر       | التعليمة البرمجية |
|------------|-------------------------|
| Volumes    | `sidecar.wallarm.io/proxy-extra-volumes` |
| مثبت الأقراص   | `sidecar.wallarm.io/proxy-extra-volume-mounts` |

بمجرد أن تم تثبيت المورد في الحاوية ، حدد السياق NGINX لإضافة التكوين بتمرير المسار إلى الملف المثبت في التعليمة البرمجية المقابلة:

| قسم تكوين NGINX  | التعليمة البرمجية |
|------------------------- | --------------------- |
| http                           | `sidecar.wallarm.io/nginx-http-include` |
| server                         | `sidecar.wallarm.io/nginx-server-include` |
| location                       | `sidecar.wallarm.io/nginx-location-include` |
      
أدناه مثال يضمن ملف التكوين المثبت على مستوى `http` في تكوين NGINX. يفترض هذا المثال أن تم إنشاء ConfigMap `nginx-http-include-cm` مسبقًا ويحتوي على توجيهات تكوين NGINX صالحة.

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

### تكوين Wallarm الميزات

بالإضافة إلى الإعدادات العامة للحل المدرجة ، ننصحك أيضًا بتعلم [أفضل الممارسات للوقاية من الهجمات مع Wallarm][wallarm-attack-prevention-best-practices-docs].

يتم اجراء هذا التكوين عبر التعليمات البرمجية(pod-annotations.md) وواجهة المستخدم الخاصة بـ Wallarm Console.

## تكوينات أخرى عبر التعليمات البرمجية

بالإضافة لحالة الاستخدام التكوين المدرجة يمكنك التحكم في حل Wallarm Sidecar لحاويات المطبقات باستخدام عديد الاعلام البرمجية الأخرى.

[هنا قائمة بالتعليمات البرمجية لكل حاوية](pod-annotations.md)
