[gitlabcicd-config-yaml]:       https://docs.gitlab.com/ee/ci
[fast-node-token]:              ../../operations/create-node.md
[gitlabci-set-env-var]:         https://docs.gitlab.com/ee/ci/variables/
[gitlabci-example-env-var]:     ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-env-var-example.png
[fast-example-gitlab-result]:   ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-gitlab-cicd]:     https://gitlab.com/wallarm/fast-example-gitlab-dvwa-integration

# دمج FAST مع GitLab CI/CD

يتم تكوين دمج FAST في وضع CI في سير عمل GitLab CI/CD عبر ملف `~/.gitlab-ci.yml`. المزيد من التفاصيل حول تكوين سير عمل GitLab CI/CD متوفرة في [التوثيق الرسمي لـ GitLab][gitlabcicd-config-yaml].

## إمرار رمز نقطة التفتيش لـ FAST

للاستخدام الآمن لـ [رمز نقطة التفتيش لـ FAST][fast-node-token]، يجب إمرار قيمته في [المتغير البيئي في إعدادات مشروعك][gitlabci-set-env-var].

![إمرار متغير بيئة GitLab CI/CD][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلبات

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الآلي مع تشغيل نقطة التفتيش لـ FAST في وضع التسجيل"
    ```
    test:
      stage: test
      script:
        - docker network create my-network 
        - docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network --rm wallarm/fast 
        - docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest 
        - docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb 
        - docker stop selenium fast
        - docker network rm my-network
    ```

    المثال يتضمن الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل نقطة التفتيش لـ FAST في وضع التسجيل على الشبكة `my-network`.
    3. تشغيل أداة الاختبار الآلي Selenium بنقطة التفتيش لـ FAST كوكيل على الشبكة `my-network`.
    4. تشغيل التطبيق الاختباري والاختبارات الآلية على الشبكة `my-network`.
    5. إيقاف Selenium ونقطة التفتيش لـ FAST.

## إضافة خطوة اختبار الأمان

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "مثال على خطوة اختبار الأمان"
    1. إضافة `security_test` إلى قائمة `stages`.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. تعريف جسم المرحلة الجديدة `security_test`.

        ```
          security_test:
            stage: security_test
            script:
              - docker network create my-network 
              - docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test
              - sleep 5 
              - docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast 
              - docker stop app-test
        ```

    المثال يتضمن الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل التطبيق الاختباري على الشبكة `my-network`.
    3. تشغيل نقطة التفتيش لـ FAST في وضع الاختبار على الشبكة `my-network`. تم تجاهل متغير `TEST_RECORD_ID` لأن مجموعة الطلبات الأساسية تم إنشاؤها في سير العمل الحالي وهي الأحدث المسجلة. سيتم إيقاف تشغيل نقطة التفتيش لـ FAST تلقائيًا عند انتهاء الاختبار.
    4. إيقاف التطبيق الاختباري.

## الحصول على نتائج الاختبار

سيتم عرض نتيجة اختبار الأمان على واجهة GitLab CI/CD.

![نتيجة تشغيل نقطة التفتيش لـ FAST في وضع الاختبار][fast-example-gitlab-result]

## المزيد من الأمثلة

يمكنك العثور على أمثلة على دمج FAST مع سير عمل GitLab CI/CD على [GitHub][fast-examples-github] و[GitLab][fast-example-gitlab-cicd].

!!! info "للأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، يرجى [الاتصال بنا][mail-to-us].

## مقاطع الفيديو التوضيحية

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>