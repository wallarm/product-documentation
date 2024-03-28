يتم تكوين ذاكرة Tarantool لوحدة `ingress-controller-wallarm-tarantool` باستخدام الأقسام التالية في ملف `values.yaml`:

* لضبط الذاكرة بالجيجابايت:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* لضبط الذاكرة بوحدات CPU:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 400m
              memory: 3280Mi
            requests:
              cpu: 200m
              memory: 1640Mi
    ```

يتم تعيين البارامترات المذكورة باستخدام خيار `--set` لأوامر `helm install` و`helm upgrade`، على سبيل المثال:

=== "تنصيب وحدة التحكم Ingress"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    هناك أيضًا [بارامترات أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتنصيب وحدة التحكم Ingress بشكل صحيح. يرجى إضافتها أيضًا في خيار `--set`.
=== "تحديث بارامترات وحدة التحكم Ingress"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```