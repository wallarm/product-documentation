[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# سلسلة والآرم وكونترولرات Ingress إضافية في نفس كلاستر Kubernetes

تقدم لك هذه التعليمات الخطوات لنشر والآرم Ingress كونترولر في كلاستر K8s الخاص بك وربطه بكونترولرات أخرى تعمل بالفعل في بيئتك.

## المشكلة التي تعالجها الحلول

تقدم والآرم برنامج العقد الخاص بها في تنسيقات مختلفة، بما في ذلك [Ingress كونترولر المبني على أساس Ingress NGINX كونترولر المجتمع](installation-kubernetes-en.md).

إذا كنت تستخدم بالفعل كونترولر Ingress، قد يكون من الصعب استبدال كونترولر Ingress الحالي بكونترولر والآرم (مثلاً، إذا كنت تستخدم AWS ALB Ingress كونترولر). في هذه الحالة، يمكنك استكشاف [حلول والآرم Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md) ولكن إذا لم يكن مناسبًا أيضًا لبنيتك التحتية، فمن الممكن سلسلة عدة كونترولرات Ingress.

تمكنك سلسلة كونترولرات Ingress من استخدام كونترولر موجود للحصول على طلبات المستخدم النهائي إلى الكلاستر، ونشر والآرم Ingress كونترولر إضافي لتوفير الحماية الضرورية للتطبيق.

## المتطلبات

* إصدار منصة Kubernetes 1.24-1.27
* [Helm](https://helm.sh/) مدير الحزم
* الوصول إلى الحساب بدور **المسؤول** والتوثيق الثنائي معطل في وحدة التحكم والآرم لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة والآرم الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة والآرم الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة مخططات Helm والآرم. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى مستودعات والآرم على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى عناوين IP لتخزين Google Cloud المدرجة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عند [قائمة السماح، قائمة الحظر، أو قائمة الرمادي](../user-guides/ip-lists/overview.md) للبلدان، المناطق، أو مراكز البيانات بدلاً من عناوين IP الفردية، يسترد عقد والآرم عناوين IP الدقيقة المتعلقة بالمدخلات في القوائم IP من قاعدة البيانات المجمعة المستضافة على Google Storage
* تم نشر كلاستر Kubernetes يعمل على كونترولر Ingress

## نشر والآرم Ingress كونترولر وسلسلته مع كونترولر Ingress إضافي

لنشر والآرم Ingress كونترولر وسلسلته مع كونترولرات إضافية:

1. نشر مخطط Helm الرسمي لكونترولر والآرم باستخدام قيمة فئة Ingress مختلفة عن كونترولر Ingress الحالي.
1. إنشاء كائن Ingress محدد لوالآرم مع:

    * نفس `ingressClass` كما هو محدد في `values.yaml` لمخطط Helm Ingress والآرم.
    * قواعد توجيه طلبات كونترولر Ingress مكونة بنفس الطريقة كما هو الحال مع كونترولر Ingress الحالي.

    !!! معلومات "لن يتم عرض كونترولر Ingress والآرم خارج الكلاستر"
        الرجاء ملاحظة أن كونترولر Ingress والآرم يستخدم `ClusterIP` لخدمته، مما يعني أنه لن يتم عرضه خارج الكلاستر.
1. إعادة تكوين كونترولر Ingress الحالي لتوجيه الطلبات الواردة إلى كونترولر Ingress والآرم الجديد بدلاً من خدمات التطبيق.
1. اختبار تشغيل كونترولر Ingress والآرم.

### الخطوة 1: نشر والآرم Ingress كونترولر

1. توليد رمز عقدة تصفية من [النوع المناسب][node-token-types]:

    === "API token (مخطط Helm 4.6.8 وما فوق)"
        1. افتح وحدة تحكم والآرم → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
        1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
        1. انسخ هذا الرمز.
    === "Node token"
        1. افتح وحدة التحكم والآرم → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
        1. أنشئ عقدة تصفية بنوع **عقدة والآرم** وانسخ الرمز المتولد.
            
            ![إنشاء عقدة والآرم][nginx-ing-create-node-img]
1. أضف [مخططات Helm والآرم](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. أنشئ ملف `values.yaml` بالتكوين والآرم التالي:

    === "السحابة الأمريكية"
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
    === "السحابة الأوروبية"
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
    
    * `<NODE_TOKEN>` هو رمز عقدة والآرم.
    * عند استخدام رمز API، حدد اسم مجموعة العقد في معلمة `nodeGroup`. سيتم تعيين عقدتك لهذه المجموعة، المعروضة في قسم **العقد** بوحدة تحكم والآرم. اسم المجموعة الافتراضي هو `defaultIngressGroup`.

    لمعرفة المزيد من خيارات التكوين، يرجى استخدام [الرابط](configure-kubernetes-en.md).
1. قم بتثبيت مخطط Helm Ingress والآرم:
    ``` bash
    helm install --version 4.10.2 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` هو اسم إصدار Helm
    * `values.yaml` هو ملف YAML بقيم Helm التي تم إنشاؤها في الخطوة السابقة
    * `wallarm-ingress` هو الفضاء الاسمي حيث سيتم تثبيت مخطط Helm (سيتم إنشاؤه)
1. التحقق من أن كونترولر Ingress والآرم يعمل:

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    يجب أن يكون حالة كل حاوية **STATUS: Running** أو **READY: N/N**. على سبيل المثال:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### الخطوة 2: إنشاء كائن Ingress بـ `ingressClassName` محدد لوالآرم

أنشئ كائن Ingress بنفس اسم `ingressClass` كما هو مكون في `values.yaml` في الخطوة السابقة.

يجب أن يكون كائن Ingress في نفس الفضاء الاسمي حيث يتم نشر تطبيقك، على سبيل المثال:

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

### الخطوة 3: إعادة تكوين كونترولر Ingress الحالي لتوجيه الطلبات إلى والآرم

أعد تكوين كونترولر Ingress الحالي لتوجيه الطلبات الواردة إلى كونترولر Ingress والآرم الجديد بدلاً من خدمات التطبيق كما يلي:

* أنشئ كائن Ingress بـ `ingressClass` بالاسم `nginx`. يرجى ملاحظة أنه القيمة الافتراضية، يمكنك استبدالها بقيمتك الخاصة إذا كانت مختلفة. 
* يجب أن يكون كائن Ingress في نفس الفضاء الاسمي كمخطط Helm Ingress والآرم، والذي هو `wallarm-ingress` في مثالنا.
* يجب أن تكون قيمة `spec.rules[0].http.paths[0].backend.service.name` هي اسم خدمة كونترولر Ingress والآرم الذي يتكون من اسم إصدار Helm و`.Values.nameOverride`.

    للحصول على الاسم، يمكنك استخدام الأمر التالي:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    في مثالنا الاسم هو `internal-ingress-wallarm-ingress-controller`.

التكوين النهائي المثال:

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

### الخطوة 4: اختبار تشغيل كونترولر Ingress والآرم

احصل على IP العام لموازنة الحمل لكونترولر Ingress الخارجي الحالي، على سبيل المثال، لنفترض أنه مُنشر في فضاء الاسم `ingress-nginx`:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

أرسل طلب اختبار إلى عنوان كونترولر Ingress الحالي وتحقق من أن النظام يعمل كما هو متوقع:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```