لتنفيذ تسجيل الطلبات، طبق الإعدادات التالية على خطوة اختبار التطبيق الآلي:

1. أضف الأمر الذي يقوم بتشغيل حاوية FAST في وضع `CI_MODE=recording` مع [المتغيرات](../ci-mode-recording.md#environment-variables-in-recording-mode) الأخرى المطلوبة __قبل__ الأمر الذي يقوم بتشغيل الاختبارات الآلية. على سبيل المثال:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. ضبط توجيه اختبارات الآلي عبر عقدة FAST. على سبيل المثال:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! warning "شبكة Docker"
    قبل تسجيل الطلبات، تأكد من أن عقدة FAST وأداة الاختبار الآلي تعملان على نفس الشبكة.