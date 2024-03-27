لتنفيذ اختبارات الأمان، أضف الخطوة المنفصلة المقابلة إلى سير العمل الخاص بك اتباعًا لهذه التعليمات:

1. إذا كان التطبيق الاختباري غير قيد التشغيل، أضف الأمر لتشغيل التطبيق.
2. أضف أمر تشغيل حاوية دوكر FAST في وضع `CI_MODE=testing` مع [المتغيرات](../ci-mode-testing.md#environment-variables-in-testing-mode) الأخرى المطلوبة __بعد__ أمر تشغيل التطبيق.

    !!! info "استخدام مجموعة الطلبات الأساسية المسجلة"
        إذا تم تسجيل مجموعة الطلبات الأساسية في سير عمل آخر، حدد معرف التسجيل في متغير [TEST_RECORD_ID][fast-ci-mode-test]. وإلا، سيتم استخدام آخر مجموعة مسجلة.

    مثال على الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "شبكة دوكر"
    قبل إجراء اختبارات الأمان، تأكد من تشغيل عقدة FAST والتطبيق الاختباري على نفس الشبكة.