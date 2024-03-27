يتم ضبط ذاكرة Tarantool لوحدة `ingress-controller-wallarm-tarantool` باستخدام الأقسام التالية في ملف `values.yaml`:

* لضبط الذاكرة بالجيجابايت:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* لضبط الذاكرة بالمعالج:
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

يتم تحديد الباراميترات المدرجة باستخدام خيار `--set` في أوامر `helm install` و `helm upgrade`، على سبيل المثال:

=== "تثبيت وحدة التحكم بالدخول"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    يوجد أيضًا [باراميترات أخرى](../configure-kubernetes-en.md#additional-settings-for-helm-chart) مطلوبة لتثبيت وحدة التحكم بالدخول بشكل صحيح. يُرجى تمريرها في خيار `--set` كذلك.
=== "تحديث باراميترات وحدة التحكم بالدخول"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```