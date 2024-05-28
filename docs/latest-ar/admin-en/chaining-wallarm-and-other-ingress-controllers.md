[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# سلسلة كونترولرات Wallarm Ingress المضافة في نفس الكومة Kubernetes

تقدم هذه التعليمات الخطوات لنشر كونترولر Wallarm Ingress في كومتك Kubernetes وربطها بالكونترولرات الأخرى التي تعمل بالفعل في بيئتك.

## المشكلة التي يعالجها الحل

تقدم Wallarm برنامجها الأصلي في أشكال مختلفة ، بما في ذلك [كونترولر Ingress المبني على أساس كونترولر Ingress NGINX المجتمع](installation-kubernetes-en.md).

إذا كنت تستخدم بالفعل كونترولر Ingress ، قد يكون من التحدي أن تستبدل الكونترولر Ingress الحالي بكونترولر Wallarm (على سبيل المثال ، إذا كانت تستخدم AWS ALB Ingress Controller). في هذه الحالة ، يمكنك استكشاف [حل WallarmSidecar](../installation/kubernetes/sidecar-proxy/deployment.md) ولكن إذا لم يناسب بنيتك أيضا ، فمن الممكن ربط عدة كونترولرات Ingress فيما بينها.

تمكنك سلسلة كونترولرات Ingress من استخدام كونترولر موجود للحصول على طلبات المستخدمين النهائيين إلى الكومة ، ونشر كونترولر Ingress إضافي من Wallarm لتوفير الحماية الضرورية للتطبيق.

## المتطلبات

* نسخة Kubernetes من 1.24 إلى 1.27
* [Helm](https://helm.sh/) مدير الحزم
* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في Wallarm Console للـ [US Cloud](https://us1.my.wallarm.com/) أو [EU Cloud](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع US Wallarm Cloud أو إلى `https://api.wallarm.com` للعمل مع EU Wallarm Cloud
* الوصول إلى `https://charts.wallarm.com` لإضافة Wallarm Helm charts. تأكد من أن الوصول غير محظور بواسطة جدار الحماية
* الوصول إلى Wallarm repositories على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من أن الوصول غير محظور بواسطة جدار الحماية
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* نشر كومة Kubernetes تعمل على كونترولر Ingress

## نشر Wallarm Ingress كونترولر وربطه مع كونترولر Ingress إضافي

لنشر Wallarm Ingress كونترولر وربطها بالكونترولرات الإضافية :

1. قم بنشر الرسم البياني Helm الرسمي لكونترولر Wallarm باستخدام قيمة Ingress class مختلفة عن الكونترولر Ingress الحالي.
1. قم بإنشاء كائن Ingress الخاص بـ Wallarm مع:

    * نفس `ingressClass` كما هو محدد في `values.yaml` من رسم بياني Helm لـ Wallarm Ingress.
    * قواعد توجيه طلبات كونترولر Ingress مكونة بنفس الطريقة التي تم بها تكوين كونترولر Ingress الحالي.

    !!! info "لن يتعرض Wallarm Ingress كونترولر خارج الكومة"
        يرجى ملاحظة أن Wallarm Ingress كونترولر يستخدم `ClusterIP` كخدمة ، مما يعني أنه لن يتعرض خارج الكومة.
1. إعادة تكوين كونترولر Ingress الحالي لتوجيه الطلبات الواردة إلى الكونترولر Wallarm Ingress الجديد بدلاً من خدمات التطبيق.
1. اختبر تشغيل Wallarm Ingress كونترولر.

### الخطوة 1: نشر Wallarm Ingress كونترولر

1. قم بإنشاء رمز عقدة الترشيح من [النوع المناسب][node-token-types]:

    === "API token (Helm chart 4.6.8 وما فوق)"
        1. افتح Wallarm Console → **Settings** → **API tokens** في الـ [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) أو [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. ابحث عن أو قم بإنشاء رمز API مع دور المصدر `Deploy`.
        1. انسخ هذا الرمز.
    === "Node token"
        1. افتح Wallarm Console → **Nodes** في إما [US Cloud](https://us1.my.wallarm.com/nodes) أو [EU Cloud](https://my.wallarm.com/nodes).
        1. قم بإنشاء عقدة تصفية بنوع **Wallarm node** وانسخ الرمز المولد.
            
            ![إنشاء عقدة Wallarm][nginx-ing-create-node-img]
1. أضف مستودع [Wallarm Helm charts](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. قم بإنشاء الملف `values.yaml` مع التهيئة التالية لـ Wallarm:

    === "US Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"  
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: ClusterIP
        nameOverride: wallarm-ingress
        ```
    === "EU Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: "ClusterIP"
        nameOverride: wallarm-ingress
        ```    
    
    * `<NODE_TOKEN>` هو رمز العقدة Wallarm.
    * عند استخدام رمز API ، حدد اسم مجموعة العُقد في المعلمة `nodeGroup`. سيتم تعيين العقدة الخاصة بك لهذه المجموعة ، والتي تظهر في قسم **Nodes** من Wallarm Console. اسم المجموعة الافتراضي هو `defaultIngressGroup`.

    لمعرفة المزيد من خيارات التكوين ، يرجى استخدام [الرابط](configure-kubernetes-en.md).
1. قم بتثبيت رسم Wallarm Ingress Helm:
    ``` bash
    helm install --version 4.10.4 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` هو اسم إصدار Helm
    * `values.yaml` هو ملف YAML مع Helm values الذي تم إنشاؤه في الخطوة السابقة
    * `wallarm-ingress` هو الفضاء الاسمي حيث يتم تثبيت رسم Helm (سيتم إنشاؤه)
1. تأكد من أن Wallarm Ingress كونترولر يعمل حاليًا: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    يجب أن يكون حالة كل من العقد **STATUS: Running** أو **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### الخطوة 2: إنشاء كائن Ingress مع `ingressClassName` خاص بـ Wallarm

أنشئ كائن Ingress بنفس اسم `ingressClass` كما تم تكوينه في `values.yaml` في الخطوة السابقة.

يجب أن يكون الكائن Ingress في نفس الفضاء الاسمي حيث تم نشر التطبيق الخاص بك ، على سبيل المثال :

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-application: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
  name: myapp-internal
  namespace: myapp
spec:
  ingressClassName: wallarm-ingress
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### الخطوة 3: إعادة تكوين كونترولر Ingress الحالي لتوجيه الطلبات إلى Wallarm

قم بإعادة تكوين الكونترولر Ingress الحالي لتوجيه الطلبات الواردة إلى كونترولر Wallarm Ingress الجديد بدلاً من خدمات التطبيق على النحو التالي:

* قم بإنشاء الكائن Ingress باسم `ingressClass` ليكون `nginx`. يرجى ملاحظة أنها القيمة الافتراضية ، يمكنك استبدالها بقيمتك الخاصة إذا كانت مختلفة. 
* يجب أن يكون الكائن Ingress في نفس الفضاء الاسمي كما هو موجود في Wallarm Ingress Chart ، الذي هو `wallarm-ingress` في مثالنا.
* يجب أن تكون القيمة `spec.rules[0].http.paths[0].backend.service.name` هي اسم خدمة كونترولر Wallarm Ingress التي تتكون من اسم الإصدار Helm و `.Values.nameOverride`.

    يمكنك الحصول على الاسم باستخدام الأمر التالي :
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    في مثالنا التكوينية الناتجة هي `internal-ingress-wallarm-ingress-controller`.

التكوين النهائي للمثال:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-external
  namespace: wallarm-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: internal-ingress-wallarm-ingress-controller
                port:
                  number: 80
```

### الخطوة 4: اختبار تشغيل Wallarm Ingress كونترولر

احصل على IP العام Load Balancer لكونترولر Ingress الخارجي الحالي ، على سبيل المثال دعنا نفترض أنه تم نشره في الفضاء الاسمي `ingress-nginx`:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

أرسل طلب اختبار إلى عنوان الكونترولر Ingress الحالي وتحقق من أن النظام يعمل كما هو متوقع:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```