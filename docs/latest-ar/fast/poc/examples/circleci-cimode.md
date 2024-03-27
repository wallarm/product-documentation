# دمج FAST مع CircleCI

يتم تكوين دمج FAST في وضع CI مع سير عمل CircleCI من خلال ملف `~/.circleci/config.yml`. تتوفر المزيد من التفاصيل حول تكوين سير العمل في CircleCI في [الوثائق الرسمية لـ CircleCI][circleci-config-yaml].

## تمرير رمز العقدة FAST

لكي تستخدم قيمة [رمز العقدة FAST][fast-node-token] بأمان، قم بتمرير قيمته في [متغير البيئة في إعدادات مشروعك][circleci-set-env-var].

![تمرير متغير البيئة CircleCI][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلب

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع التسجيل"
    ```
    - run:
          name: بدء الاختبارات وتسجيل FAST
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    يشمل المثال الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل عقدة FAST في وضع التسجيل على شبكة `my-network`.
    3. تشغيل أداة الاختبار الآلي Selenium مع عقدة FAST كوكيل على شبكة `my-network`.
    4. تشغيل تطبيق الاختبار والاختبارات الآلية على شبكة `my-network`.
    5. إيقاف أداة الاختبار الآلي Selenium وعقدة FAST في وضع التسجيل.

## إضافة خطوة الاختبارات الأمنية

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "مثال على خطوة الاختبارات الأمنية"
    ```
    - run:
        name: بدء اختبارات FAST
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    يتضمن المثال الخطوات التالية:

    1. تشغيل تطبيق الاختبار على شبكة `my-network`.
    2. تشغيل عقدة FAST في وضع الاختبار على الشبكة `my-network`. لم يتم إضافة متغير `TEST_RECORD_ID` لأن مجموعة الطلبات الأساسية تم إنشاؤها في خط الأنابيب الحالي وهو آخر ما تم تسجيله. سيتم إيقاف تشغيل عقدة FAST تلقائيًا عند انتهاء الاختبار.
    3. إيقاف تطبيق الاختبار.

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة الاختبار الأمني في واجهة CircleCI.

![نتيجة تشغيل عقدة FAST في وضع الاختبار][fast-example-result]

## مزيد من الأمثلة

يمكنك العثور على أمثلة لتكامل FAST مع سير عمل CircleCI في [GitHub][fast-examples-github] و[CirceCI][fast-example-circleci].

!!! info "لأية أسئلة إضافية"
    إذا كان لديك أسئلة متعلقة بدمج FAST، يرجى [الاتصال بنا][mail-to-us].