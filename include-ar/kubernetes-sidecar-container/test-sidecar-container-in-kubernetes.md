1. استخدم الأمر التالي للحصول على قائمة الحاويات:

    ```
    kubectl get pods
    ```

    يجب أن يزداد عدد الحاويات داخل الحاوية،ويجب أن يكون حالة الحاوية **جاري التشغيل**.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     جاري التشغيل   0          3m48s
    ```
2. اذهب إلى لوحة تحكم Wallarm → **العقد** عبر الرابط أدناه وتأكد من عرض عقدة جديدة. تُستخدم هذه العقدة المُنشأة لتصفية الطلبات الموجهة إلى تطبيقك.
    * https://us1.my.wallarm.com/nodes/ لـ[السحابة الأمريكية](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/nodes/ لـ[السحابة الأوروبية](../../../about-wallarm/overview.md#eu-cloud)
3. أرسل طلباً تجريبياً ضاراً للتطبيق كما هو موضح في هذه [التعليمات](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack).
4. اذهب إلى لوحة تحكم Wallarm → **الهجمات** عبر الرابط أدناه وتأكد من عرض هجوم في القائمة:
    * https://us1.my.wallarm.com/attacks/ لـ[السحابة الأمريكية](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/attacks/ لـ[السحابة الأوروبية](../../../about-wallarm/overview.md#eu-cloud)