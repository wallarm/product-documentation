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

يتم تكوين دمج FAST في وضع CI داخل سير العمل في GitLab CI/CD عن طريق ملف `~/.gitlab-ci.yml`. التفاصيل المفصلة عن تكوين سير عمل GitLab CI/CD متوفرة في [الوثائق الرسمية ل GitLab][gitlabcicd-config-yaml].

## تمرير رمز عقدة FAST

للاستخدام الآمن ل[رمز عقدة FAST][fast-node-token]، قم بتمرير قيمته في [متغير البيئة في إعدادات مشروعك][gitlabci-set-env-var].

![تمرير متغير بيئة GitLab CI/CD][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلب

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع التسجيل"
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

    يتضمن المثال الخطوات التالية:

    1. إنشاء الشبكة Docker `my-network`.
    2. تشغيل عقدة FAST في وضع التسجيل على الشبكة `my-network`.
    3. تشغيل أداة الاختبار الآلي Selenium مع عقدة FAST كبروكسي على الشبكة `my-network`.
    4. تشغيل التطبيق التجريبي والاختبارات الآلية على الشبكة `my-network`.
    5. إيقاف Selenium وعقدة FAST.

## إضافة خطوة اختبار الأمان

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "مثال على خطوة اختبار الأمان"
    1. أضف `security_test` إلى قائمة `stages`.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. تحديد جسم المرحلة الجديدة `security_test`.

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

    يتضمن المثال الخطوات التالية:

    1. إنشاء الشبكة Docker `my-network`.
    2. تشغيل التطبيق التجريبي على الشبكة `my-network`.
    3. تشغيل عقدة FAST في وضع الاختبار على الشبكة `my-network`. تم حذف متغير `TEST_RECORD_ID` نظرًا لأن مجموعة الطلبات الأساسية تم إنشاؤها في العملية الحالية وهي الأخيرة المسجلة. سيتم إيقاف تشغيل عقدة FAST تلقائيًا عند الانتهاء من الاختبار.
    4. إيقاف التطبيق التجريبي.

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة اختبار الأمان في واجهة GitLab CI/CD.

![نتيجة تشغيل عقدة FAST في وضع الاختبار][fast-example-gitlab-result]

## مزيد من الأمثلة

يمكنك العثور على أمثلة لدمج FAST في سير عمل GitLab CI/CD على [GitHub][fast-examples-github] و[GitLab][fast-example-gitlab-cicd].

!!! info "الأسئلة الإضافية"
    إذا كانت لديك أسئلة متعلقة بدمج FAST، يرجى [الاتصال بنا][mail-to-us].

## فيديوهات توضيحية

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>