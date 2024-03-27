# اعتبارات توفر عالي (متحكم دخول مبني على NGINX)

هذه المقالة تقدم توصيات لضبط متحكم الدخول Wallarm ليكون عالي التوفر ومحميًا من التوقف.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## توصيات الضبط

التوصيات التالية تخص البيئات التي يعتبر فيها توقف التطبيق عن العمل شيئا خطيرا (بيئات الإنتاج).

* استخدم أكثر من نسخة مثيل لمتحكم الدخول. يتم التحكم في السلوك باستخدام الصفة `controller.replicaCount` في ملف `values.yaml`. على سبيل المثال:
    ```
    controller:
      replicaCount: 2
    ```
* اجبر تجمع Kubernetes على وضع مثيلات متحكم الدخول على عقد مختلفة: هذا سيزيد من مقاومة خدمة الدخول في حال فشل عقدة. يتم التحكم في هذا السلوك باستخدام ميزة مضاد التوافقية لـ pod في Kubernetes، والتي يتم ضبطها في ملف `values.yaml`. على سبيل المثال:
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
* في التجمعات التي قد تتعرض لزيادات مفاجئة في الحركة أو ظروف أخرى قد تبرر استخدام ميزة [التوسع الأفقي لـ pod في Kubernetes (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) يمكن تفعيلها في ملف `values.yaml` باستخدام المثال التالي:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* تشغيل على الأقل نسختين من خدمة تحليلات ما بعد البيانات Wallarm على أساس قاعدة البيانات Tarantool. هذه المثيلات تتضمن `ingress-controller-wallarm-tarantool` في الاسم. يتم التحكم في السلوك في ملف `values.yaml` باستخدام الصفة `controller.wallarm.tarantool.replicaCount`. على سبيل المثال: 
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## إجراءات الضبط

يُنصح باستخدام الخيار `--set` من الأوامر `helm install` و `helm upgrade` لتكوين الإعدادات المذكورة، على سبيل المثال:

=== "تنصيب متحكم الدخول"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    هناك أيضًا [معايير أخرى](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتنصيب متحكم الدخول بشكل صحيح. الرجاء إدخالهم في الخيار `--set` كذلك.
=== "تحديث معايير متحكم الدخول"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```