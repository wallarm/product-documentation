# اعتبارات توفر عالي (وحدة تحكم الدخول المبنية على NGINX)

توفر هذه المقالة توصيات لتكوين وحدة تحكم الدخول الخاصة بـ Wallarm لكي تكون ذات توفر عالٍ ومحمية من أوقات التوقف.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## توصيات التكوين

التوصيات التالية ذات صلة بالبيئات الحرجة (الإنتاجية).

* استخدم أكثر من نموذج لوحدات حاويات وحدة التحكم في الدخول. يتم التحكم في السلوك باستخدام الخاصية `controller.replicaCount` في ملف `values.yaml`. على سبيل المثال:
    ```
    controller:
      replicaCount: 2
    ```
* اجبر تجمع Kubernetes على وضع وحدات حاويات وحدة التحكم في الدخول على عقد مختلفة: هذا سيزيد من مرونة خدمة الدخول في حال حدوث فشل في أحد العقد. يتم التحكم في هذا السلوك باستخدام ميزة مكافحة التماثل لوحدات حاويات Kubernetes، والتي يتم تكوينها في ملف `values.yaml`. على سبيل المثال:
    ```
    controller:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - nginx-ingress
            topologyKey: "kubernetes.io/hostname"
    ```
* في التجمعات الخاضعة لزيادات مفاجئة في الحركة أو ظروف أخرى قد تبرر استخدام ميزة [توسيع الحاويات الأفقي (HPA) في Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)، يمكن تفعيلها في ملف `values.yaml` باستخدام المثال التالي:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* تشغيل ما لا يقل عن نموذجين من خدمة postanalytics الخاصة بـ Wallarm، المبنية على قاعدة بيانات Tarantool. تتضمن هذه الحاويات `ingress-controller-wallarm-tarantool` في الاسم. يتم التحكم في السلوك في ملف `values.yaml` باستخدام الخاصية `controller.wallarm.tarantool.replicaCount`. على سبيل المثال:
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## إجراء التكوين

لتعيين التكوينات المذكورة، يُنصح باستخدام خيار `--set` من أوامر `helm install` و `helm upgrade`، على سبيل المثال:

=== "تثبيت وحدة التحكم في الدخول"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    هناك أيضًا [معايير أخرى](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت وحدة التحكم في الدخول بشكل صحيح. الرجاء تمريرها أيضًا في خيار `--set`.
=== "تحديث معايير وحدة التحكم في الدخول"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```