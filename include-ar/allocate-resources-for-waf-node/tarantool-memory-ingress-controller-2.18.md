تم تكوين ذاكرة Tarantool للوحدة `ingress-controller-wallarm-tarantool` باستخدام الأقسام التالية في الملف `values.yaml`:

* لضبط الذاكرة بالجيجابايت:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* لضبط الذاكرة بالCPU:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 1000m
              memory: 1640Mi
            requests:
              cpu: 1000m
              memory: 1640Mi
    ```

تُضبط البارامترات المذكورة باستخدام خيار `--set` في أوامر `helm install` و `helm upgrade`، على سبيل المثال:

=== "تثبيت Ingress controller"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    هناك أيضا [بارامترات أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت Ingress controller بشكل صحيح. يُرجى إرسالها أيضًا في خيار `--set`.
=== "تحديث بارامترات Ingress controller"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```