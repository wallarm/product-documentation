لتنفيذ تسجيل الطلبات، طبق الإعدادات التالية على خطوة اختبار التطبيق الأوتوماتيكي:

1. أضِف الأمر الذي يشغل حاوية دوكر FAST في وضع `CI_MODE=recording` مع غيره من [المتغيرات](../ci-mode-recording.md#environment-variables-in-recording-mode) المطلوبة __قبل__ تشغيل الأمر الذي يجري اختبارات أوتوماتيكية. على سبيل المثال:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. قم بتكوين الإعداد الوكيل للاختبارات الأوتوماتيكية عبر عقدة FAST. على سبيل المثال:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! تحذير "شبكة دوكر"
    قبل تسجيل الطلبات، تأكد من أن عقدة FAST وأداة الاختبار الأوتوماتيكية تعملان على نفس الشبكة.