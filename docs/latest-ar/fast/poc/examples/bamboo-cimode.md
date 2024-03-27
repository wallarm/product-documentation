# دمج FAST مع Bamboo

يمكن تهيئة دمج FAST في وضع CI MODE مع سير عمل Bamboo باستخدام إحدى الطرق التالية:

* من خلال [مواصفات YAML](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)
* من خلال [مواصفات JAVA](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)
* من خلال [واجهة مستخدم Bamboo](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)

المثال أدناه يستخدم مواصفات YAML لتهيئة الدمج.

## تمرير رمز عقدة FAST

للاستخدام الآمن لـ [رمز عقدة FAST](../../operations/create-node.md)، قم بتمرير قيمته في [متغير عام Bamboo](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html).

![تمرير متغير عام Bamboo](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلبات

لتنفيذ تسجيل الطلبات، طبق الإعدادات التالية على وظيفة الاختبار التلقائي للتطبيق:

1. أضف الأمر الذي يشغل حاوية Docker لـ FAST في وضع `CI_MODE=recording` مع [المتغيرات](../ci-mode-recording.md#environment-variables-in-recording-mode) المطلوبة الأخرى __قبل__ الأمر الذي يشغل الاختبارات التلقائية. على سبيل المثال:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. تهيئة الاختبارات التلقائية للتوجيه عبر عقدة FAST. على سبيل المثال:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! تحذير "شبكة Docker"
    قبل تسجيل الطلبات، تأكد من أن عقدة FAST وأداة الاختبار التلقائي تعملان على نفس الشبكة.

??? معلومات "مثال خطوة الاختبار التلقائي مع تشغيل عقدة FAST في وضع التسجيل"
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

    يشمل المثال الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل تطبيق الاختبار `dvwa` على شبكة `my-network`.
    3. تشغيل عقدة FAST في وضع التسجيل على شبكة `my-network`.
    4. تشغيل أداة الاختبار التلقائي Selenium مع عقدة FAST كوكيل على شبكة `my-network`.
    5. تشغيل الاختبارات التلقائية على شبكة `my-network`.
    6. إيقاف أداة الاختبار التلقائي Selenium وعقدة FAST في وضع التسجيل.

## إضافة خطوة اختبار الأمان

لتنفيذ اختبار الأمان، أضف الخطوة المنفصلة المطابقة إلى سير العمل الخاص بك وفقًا للتعليمات:

1. إذا لم يكن تطبيق الاختبار يعمل، فأضف الأمر لتشغيل التطبيق.
2. أضف الأمر الذي يشغل حاوية Docker لـ FAST في وضع `CI_MODE=testing` مع [المتغيرات](../ci-mode-testing.md#environment-variables-in-testing-mode) المطلوبة الأخرى __بعد__ الأمر الذي يشغل التطبيق.

    !!! معلومات "استخدام مجموعة أساسية من الطلبات المسجلة"
        إذا تم تسجيل مجموعة الطلبات الأساسية في خط أنابيب آخر، حدد معرف السجل في متغير [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode). وإلا، سيتم استخدام آخر مجموعة مسجلة.

    مثال الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! تحذير "شبكة Docker"
    قبل اختبار الأمان، تأكد من أن عقدة FAST وتطبيق الاختبار يعملان على نفس الشبكة.

??? معلومات "مثال خطوة اختبار الأمان"
    الأوامر تعمل على شبكة `my-network` التي تم إنشاؤها في خطوة تسجيل الطلب. تطبيق الاختبار، `app-test`، يعمل أيضًا في خطوة تسجيل الطلب.

    1. أضف `security_testing` إلى قائمة `stages`. في المثال، هذه الخطوة تنهي سير العمل.

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

    يشمل المثال الخطوات التالية:

    1. تشغيل عقدة FAST في وضع الاختبار على شبكة `my-network`. متغير `TEST_RECORD_ID` مُهمل لأن مجموعة الطلبات الأساسية تم إنشاؤها في خط أنابيب الحالي وهي آخر ما تم تسجيله. سيتم إيقاف تشغيل عقدة FAST تلقائيًا عند انتهاء الاختبار.
    2. إيقاف تطبيق الاختبار `dvwa`.
    3. حذف شبكة `my-network`.

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة اختبار الأمان في سجلات البناء في واجهة مستخدم Bamboo. كما يسمح Bamboo بتنزيل ملف `.log` بالكامل.

![نتيجة تشغيل عقدة FAST في وضع الاختبار](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## المزيد من الأمثلة

يمكنك العثور على المزيد من الأمثلة لدمج FAST مع سير عمل Bamboo على [GitHub](https://github.com/wallarm/fast-examples).

!!! معلومات "للأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، يرجى [التواصل معنا](mailto:support@wallarm.com).