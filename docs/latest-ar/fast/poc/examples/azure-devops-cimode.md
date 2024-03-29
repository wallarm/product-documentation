# دمج FAST مع Azure DevOps

يتم تكوين دمج FAST في وضع CI داخل سير عمل Azure DevOps من خلال ملف `azure-pipelines.yml`. يوصف المخطط التفصيلي لملف `azure-pipelines.yml` في [الوثائق الرسمية لـ Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema).

!!! info "سير العمل المكون"
    تتطلب التعليمات الإضافية سير عمل مكون مسبقًا يتوافق مع أحد النقاط التالية:

    * تم تنفيذ أتمتة الاختبار. في هذه الحالة، يجب إدخال [رمز عقدة FAST](#passing-fast-node-token) وإضافة خطوات [تسجيل الطلب](#adding-the-step-of-request-recording) و[اختبار الأمان](#adding-the-step-of-security-testing).
    * تم تسجيل مجموعة الطلبات الأساسية مسبقًا. في هذه الحالة، يجب إدخال [رمز عقدة FAST](#passing-fast-node-token) وإضافة خطوة [اختبار الأمان](#adding-the-step-of-security-testing).

## إدخال رمز عقدة FAST

للاستخدام الآمن لـ[رمز عقدة FAST](../../operations/create-node.md)، قم بفتح إعدادات سير عملك الحالي وأدخل قيمة الرمز في [متغير بيئة Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables).

![إدخال متغير بيئة Azure DevOps](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## إضافة خطوة تسجيل الطلب

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع التسجيل"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'إنشاء شبكتي الخاصة'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'تشغيل تطبيق الاختبار على شبكتي الخاصة'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'تشغيل عقدة FAST في وضع التسجيل على شبكتي الخاصة'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'تشغيل Selenium مع عقدة FAST كوكيل على شبكتي الخاصة'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'تشغيل الاختبارات الآلية على شبكتي الخاصة'
      - script: docker stop selenium fast
        displayName: 'إيقاف Selenium وعقدة FAST في وضع التسجيل'
    ```

## إضافة خطوة اختبار الأمان

تعتمد طريقة إعداد اختبار الأمان على طريقة المصادقة المستخدمة في تطبيق الاختبار:

* إذا كانت المصادقة مطلوبة، أضف خطوة اختبار الأمان إلى نفس الوظيفة كخطوة تسجيل الطلب.
* إذا لم تكن المصادقة مطلوبة، أضف خطوة اختبار الأمان كوظيفة مستقلة إلى سير عملك.

لتنفيذ اختبار الأمان، اتبع التعليمات:

1. تأكد من تشغيل تطبيق الاختبار. إذا لزم الأمر، أضف الأمر لتشغيل التطبيق.
2. أضف الأمر لتشغيل حاوية FAST بالدوكر في وضع `CI_MODE=testing` مع [المتغيرات](../ci-mode-testing.md#environment-variables-in-testing-mode) الأخرى المطلوبة __بعد__ تشغيل الأمر للتطبيق.

    !!! info "استخدام مجموعة الطلبات الأساسية المسجلة"
        إذا تم تسجيل مجموعة الطلبات الأساسية في سير عمل آخر، حدد معرف السجل في متغير [TEST_RECORD_ID](../ci-mode-testing.md#переменные-в-режиме-тестирования). وإلا، سيتم استخدام آخر مجموعة مسجلة.

    مثال على الأمر:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "شبكة الدوكر"
    قبل اختبار الأمان، تأكد من تشغيل عقدة FAST وتطبيق الاختبار على نفس الشبكة.

??? info "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع الاختبار"
    نظرًا لأن المثال أدناه يختبر التطبيق DVWA الذي يتطلب المصادقة، يتم إضافة خطوة اختبار الأمان إلى نفس الوظيفة كخطوة تسجيل الطلب.

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'إنشاء شبكتي الخاصة'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'تشغيل تطبيق الاختبار على شبكتي الخاصة'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'تشغيل عقدة FAST في وضع التسجيل على شبكتي الخاصة'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'تشغيل Selenium مع عقدة FAST كوكيل على شبكتي الخاصة'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'تشغيل الاختبارات الآلية على شبكتي الخاصة'
        - script: docker stop selenium fast
          displayName: 'إيقاف Selenium وعقدة FAST في وضع التسجيل'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'تشغيل عقدة FAST في وضع الاختبار على شبكتي الخاصة'
        - script: docker stop dvwa
          displayName: 'إيقاف تطبيق الاختبار'
        - script: docker network rm my-network
          displayName: 'حذف شبكتي الخاصة'
    ```

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة اختبار الأمان على واجهة Azure DevOps.

![نتيجة تشغيل عقدة FAST في وضع الاختبار](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## المزيد من الأمثلة

يمكنك العثور على أمثلة لدمج FAST مع سير عمل Azure DevOps على [GitHub](https://github.com/wallarm/fast-examples).

!!! info "للأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، الرجاء [الاتصال بنا](mailto:support@wallarm.com).