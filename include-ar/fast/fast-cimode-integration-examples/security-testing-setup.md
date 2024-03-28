لتنفيذ اختبارات الأمان، أضف الخطوة المنفصلة المقابلة إلى سير عملك متبعًا هذه التعليمات:

1. إذا لم يكن التطبيق قيد الاختبار يعمل، أضف الأمر لتشغيل التطبيق.
2. أضف الأمر لتشغيل حاوية FAST Docker في وضع `CI_MODE=testing` مع المتغيرات المطلوبة [الأخرى](../ci-mode-testing.md#environment-variables-in-testing-mode) **بعد** الأمر الذي يقوم بتشغيل التطبيق.

    !!! info "استخدام مجموعة الطلبات الأساسية المسجلة"
        إذا تم تسجيل مجموعة الطلبات الأساسية في خط أنابيب آخر، حدد معرف التسجيل في متغير [TEST_RECORD_ID][fast-ci-mode-test]. وإلا، سيتم استخدام آخر مجموعة مسجلة.

    مثال على الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "شبكة Docker"
    قبل اختبارات الأمان، تأكد من أن عقدة FAST وتطبيق الاختبار يعملان على نفس الشبكة.