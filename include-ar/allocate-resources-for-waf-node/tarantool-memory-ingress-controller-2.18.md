يتم تكوين ذاكرة Tarantool للقطعة `ingress-controller-wallarm-tarantool` باستخدام الأقسام التالية في ملف `values.yaml`:

* لضبط الذاكرة بالجيجابايت:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* لضبط الذاكرة بالـ CPU:
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

تُضبط القيم المذكورة باستخدام خيار `--set` في أوامر `helm install` و`helm upgrade`، على سبيل المثال:

=== "تثبيت جهاز التحكم بالوارد"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    هناك أيضاً [معايير أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت جهاز التحكم بالوارد بشكل صحيح. يُرجى إدخالها في خيار `--set` أيضاً.
=== "تحديث معايير جهاز التحكم بالوارد"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```