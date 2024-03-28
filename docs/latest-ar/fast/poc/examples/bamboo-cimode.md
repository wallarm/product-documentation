# دمج FAST مع Bamboo

يمكن تهيئة دمج FAST في وضع CI MODE مع تدفق عمل Bamboo باستخدام إحدى الطرق التالية:

* عبر [مواصفات YAML](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)
* عبر [مواصفات JAVA](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)
* عبر [واجهة مستخدم Bamboo](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)

تستخدم الأمثلة أدناه مواصفات YAML لتهيئة الدمج.

## إرسال رمز عقدة FAST

للاستخدام الآمن لـ[رمز عقدة FAST](../../operations/create-node.md)، يجب إرسال قيمته في [متغير عالمي في Bamboo](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html).

![إرسال متغير عالمي في Bamboo](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلبات

لتطبيق تسجيل الطلبات، طبق الإعدادات التالية على وظيفة اختبار التطبيقات الأوتوماتيكية:

1. أضف الأمر الذي يشغل حاوية Docker لـ FAST في وضع `CI_MODE=recording` مع متغيرات أخرى مطلوبة [variables](../ci-mode-recording.md#environment-variables-in-recording-mode) __قبل__ أمر تشغيل الاختبارات الآلية. على سبيل المثال:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. قم بتهيئة توجيه اختبارات الآلية عبر عقدة FAST. على سبيل المثال:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! تحذير "شبكة Docker"
    قبل تسجيل الطلبات، تأكد من أن عقدة FAST وأداة اختبار الآلية تعملان على نفس الشبكة.

??? معلومات "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع التسجيل"
    ```
    test:
    key: TST
    tasks:
        - script:
            interpreter: /bin/sh
            scripts:
            - docker network create my-network
            - docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
            - docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
            - docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
            - docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
            - docker stop selenium fast
    ```

    يتضمن المثال الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل التطبيق التجريبي `dvwa` على شبكة `my-network`.
    3. تشغيل عقدة FAST في وضع التسجيل على الشبكة `my-network`.
    4. تشغيل أداة الاختبار الآلية Selenium مع عقدة FAST كبروكسي على الشبكة `my-network`.
    5. تشغيل الاختبارات الآلية على الشبكة `my-network`.
    6. إيقاف أداة الاختبار الآلية Selenium وعقدة FAST في وضع التسجيل.

## إضافة خطوة اختبار الأمان

لتنفيذ اختبار الأمان، أضف خطوة منفصلة مقابلة إلى سير عملك باتباع التعليمات:

1. إذا لم يكن التطبيق التجريبي قيد التشغيل، فأضف الأمر لتشغيل التطبيق.
2. أضف الأمر الذي يشغل حاوية Docker لـ FAST في وضع `CI_MODE=testing` مع متغيرات أخرى مطلوبة [variables](../ci-mode-testing.md#environment-variables-in-testing-mode) __بعد__ أمر تشغيل التطبيق.

    !!! معلومات "استخدام مجموعة المراجع الأساسية المسجلة"
        إذا تم تسجيل مجموعة المراجع الأساسية في قناة أخرى، حدد معرّف التسجيل في متغير [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode). خلاف ذلك، سيتم استخدام آخر مجموعة مسجلة.

    مثال الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! تحذير "شبكة Docker"
    قبل إجراء اختبار الأمان، تأكد من أن عقدة FAST والتطبيق التجريبي يعملان على نفس الشبكة.

??? معلومات "مثال على خطوة اختبار الأمان"
    تتم تشغيل الأوامر على الشبكة `my-network` التي تم إنشاؤها في خطوة تسجيل الطلب. التطبيق التجريبي، `app-test`، أيضًا يعمل في خطوة تسجيل الطلب.

    1. أضف `security_testing` إلى قائمة `stages`. في المثال، تعتبر هذه الخطوة نهائية لسير العمل.

        ```
        stages:
        - testing:
            manual: false
            jobs:
                - test
        - security_testing:
            final: true
            jobs:
                - security_test
        ```
    2. حدد جسم الوظيفة الجديدة `security_test`.

        ```
        security_test:
        key: SCTST
        tasks:
            - script:
                interpreter: /bin/sh
                scripts:
                - docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
                - docker stop dvwa
                - docker network rm my-network
        ```

    يتضمن المثال الخطوات التالية:

    1. تشغيل عقدة FAST في وضع الاختبار على شبكة `my-network`. يتم حذف المتغير `TEST_RECORD_ID` لأن مجموعة المراجع الأساسية تم إنشاؤها في القناة الحالية وهي الأخيرة المسجلة. سيتم إيقاف عقدة FAST تلقائيًا عند انتهاء الاختبار.
    2. إيقاف التطبيق التجريبي `dvwa`.
    3. حذف شبكة `my-network`.

## الحصول على نتائج الاختبار

سيتم عرض نتائج اختبارات الأمان في سجلات البناء في واجهة مستخدم Bamboo. كما يتيح Bamboo تنزيل الملف `.log` كاملًا.

![نتيجة تشغيل عقدة FAST في وضع الاختبار](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## المزيد من الأمثلة

يمكنك العثور على المزيد من أمثلة دمج FAST مع سير عمل Bamboo على [GitHub](https://github.com/wallarm/fast-examples) الخاص بنا.

!!! معلومات "للأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، الرجاء [التواصل معنا](mailto:support@wallarm.com).