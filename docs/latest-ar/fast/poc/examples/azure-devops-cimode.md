# دمج FAST مع Azure DevOps

يتم تكوين دمج FAST في الوضع CI داخل خطوط إنتاج Azure DevOps من خلال ملف `azure-pipelines.yml`. يتم وصف مخطط ملف `azure-pipelines.yml` بالتفصيل في [وثائق Azure DevOps الرسمية](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema).

!!! info "سير العمل المكون"
    تتطلب التعليمات التالية سير عمل مكون بالفعل يتوافق مع إحدى النقاط التالية:

    * يتم تنفيذ أتمتة الاختبار. في هذه الحالة، يجب أن يتم [إرسال](#passing-fast-node-token) رمز العقدة FAST ويجب إضافة خطوات [تسجيل الطلب](#adding-the-step-of-request-recording) و[اختبار الأمان](#adding-the-step-of-security-testing).
    * تم تسجيل مجموعة الطلبات الأساسية بالفعل. في هذه الحالة، يجب أن يتم [إرسال](#passing-fast-node-token) رمز العقدة FAST ويجب إضافة خطوة [اختبار الأمان](#adding-the-step-of-security-testing).

## إرسال رمز العقدة FAST

للاستخدام الآمن لـ[رمز العقدة FAST](../../operations/create-node.md)، افتح إعدادات خط الإنتاج الحالي الخاص بك وقم بإرسال قيمة الرمز في [متغير بيئة Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables).

![إرسال متغير بيئة Azure DevOps](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## إضافة خطوة تسجيل الطلب

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة اختبار الأتمتة مع تشغيل عقدة FAST في وضع التسجيل"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'إنشاء my-network'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'تشغيل تطبيق الاختبار على my-network'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'تشغيل عقدة FAST في وضع التسجيل على my-network'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'تشغيل Selenium مع عقدة FAST كوكيل على my-network'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'تشغيل الاختبارات الأتوماتيكية على my-network'
      - script: docker stop selenium fast
        displayName: 'إيقاف Selenium وعقدة FAST في وضع التسجيل'
    ```

## إضافة خطوة اختبار الأمان

طريقة إعداد اختبار الأمان تعتمد على طريقة التوثيق المستخدمة في تطبيق الاختبار:

* إذا كان التوثيق مطلوبًا، أضف خطوة اختبار الأمان إلى نفس الوظيفة كخطوة تسجيل الطلب.
* إذا لم يكن التوثيق مطلوبًا، أضف خطوة اختبار الأمان كوظيفة منفصلة إلى خط الإنتاج الخاص بك.

لتنفيذ اختبار الأمان، اتبع التعليمات:

1. تأكد من تشغيل تطبيق الاختبار. إذا لزم الأمر، أضف الأمر لتشغيل التطبيق.
2. أضف الأمر الذي يشغل حاوية Docker الخاصة بـ FAST في وضع `CI_MODE=testing` مع المتغيرات الأخرى المطلوبة [في](../ci-mode-testing.md#environment-variables-in-testing-mode) __بعد__ الأمر الذي يشغل التطبيق.

    !!! info "استخدام مجموعة الطلبات الأساسية المسجلة"
        في حال كانت مجموعة الطلبات الأساسية قد تم تسجيلها في خط إنتاج آخر، حدد هوية السجل في متغير [TEST_RECORD_ID](../ci-mode-testing.md#переменные-в-режиме-тестирования). وإلا، سيتم استخدام آخر مجموعة مسجلة.

    مثال على الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "شبكة Docker"
    قبل اختبار الأمان، تأكد من أن عقدة FAST وتطبيق الاختبار يعملان على نفس الشبكة.

??? info "مثال على خطوة اختبار الأتمتة مع تشغيل عقدة FAST في وضع الاختبار"
    نظرًا لأن المثال أدناه يختبر تطبيق DVWA الذي يتطلب التوثيق، تمت إضافة خطوة اختبار الأمان إلى نفس الوظيفة كخطوة تسجيل الطلب.

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'إنشاء my-network'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'تشغيل تطبيق الاختبار على my-network'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'تشغيل عقدة FAST في وضع التسجيل على my-network'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'تشغيل Selenium مع عقدة FAST كوكيل على my-network'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'تشغيل الاختبارات الأتوماتيكية على my-network'
        - script: docker stop selenium fast
          displayName: 'إيقاف Selenium وعقدة FAST في وضع التسجيل'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'تشغيل عقدة FAST في وضع الاختبار على my-network'
        - script: docker stop dvwa
          displayName: 'إيقاف تطبيق الاختبار'
        - script: docker network rm my-network
          displayName: 'حذف my-network'
    ```

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة اختبار الأمان على واجهة Azure DevOps.

![نتيجة تشغيل عقدة FAST في وضع الاختبار](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## المزيد من الأمثلة

يمكنك العثور على أمثلة لدمج FAST في سير عمل Azure DevOps على [GitHub](https://github.com/wallarm/fast-examples).

!!! info "الأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، الرجاء [الاتصال بنا](mailto:support@wallarm.com).