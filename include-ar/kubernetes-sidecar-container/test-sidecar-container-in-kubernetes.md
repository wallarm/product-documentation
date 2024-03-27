1. استخدم الأمر التالي للحصول على قائمة الحاويات:

    ```
    kubectl get pods
    ```

    يجب أن يزيد عدد الحاويات في الحاوية، ويجب أن يكون حالة الحاوية **جاري التشغيل**.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. اذهب إلى لوحة تحكم Wallarm → **العقد** عبر الرابط أدناه وتأكد من ظهور عقدة جديدة. هذه العقدة الجديدة تستخدم لتصفية الطلبات الموجهة لتطبيقك.
    * https://us1.my.wallarm.com/nodes/ لـ [السحابة الأمريكية](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/nodes/ لـ [السحابة الأوروبية](../../../about-wallarm/overview.md#eu-cloud)
3. أرسل طلباً ضاراً للاختبار إلى التطبيق كما هو موضح في هذه [التعليمات](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack).
4. اذهب إلى لوحة تحكم Wallarm → **الهجمات** عبر الرابط أدناه وتأكد من ظهور هجوم في القائمة:
    * https://us1.my.wallarm.com/attacks/ لـ [السحابة الأمريكية](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/attacks/ لـ [السحابة الأوروبية](../../../about-wallarm/overview.md#eu-cloud)