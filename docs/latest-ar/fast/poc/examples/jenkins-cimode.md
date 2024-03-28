# دمج FAST مع Jenkins

يتم ضبط دمج FAST في وضع CI مع سير عمل Jenkins عبر ملف `Jenkinsfile`. المزيد من التفاصيل حول ضبط سير عمل Jenkins متاحة في [التوثيق الرسمي لـ Jenkins][jenkins-config-pipeline].

## تمرير رمز عقدة FAST

للاستخدام الآمن لرمز [عقدة FAST][fast-node-token]، يتم تمرير قيمته في [متغير البيئة ضمن إعدادات مشروعك][jenkins-parameterized-build].

![تمرير متغير بيئة Jenkins][jenkins-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلبات

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الآلي مع تشغيل عقدة FAST في وضع التسجيل"
    ```
    stage('Run autotests with recording FAST node') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'run fast with recording', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'run selenium', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'run application', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'stop selenium', script: 'docker stop selenium'
             sh label: 'stop fast', script: 'docker stop fast'
             sh label: 'remove network', script: 'docker network rm my-network'
          }
       }
    ```

    يشتمل المثال على الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل عقدة FAST في وضع التسجيل على الشبكة `my-network`.
    3. تشغيل أداة الاختبار الآلي Selenium بعقدة FAST كوكيل على الشبكة `my-network`.
    4. تشغيل تطبيق الاختبار والاختبارات الآلية.
    5. إيقاف Selenium وعقدة FAST.
    6. حذف شبكة `my-network`.

## إضافة خطوة اختبار الأمان

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "مثال على خطوة اختبار الأمان"

    ```
    stage('Run security tests') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'start application', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'run fast in testing mode', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'stop application', script: ' docker stop app-test '
            sh label: 'remove network', script: ' docker network rm my-network '
          }
       }
    ```

    يشتمل المثال على الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل تطبيق الاختبار على الشبكة `my-network`.
    3. تشغيل عقدة FAST في وضع الاختبار على الشبكة `my-network`. يتم حذف متغير `TEST_RECORD_ID` لأنه تم إنشاء مجموعة الطلبات الأساسية في سير العمل الحالي وهي آخر ما تم تسجيله. سيتم إيقاف عقدة FAST تلقائيًا عند انتهاء الاختبار.
    4. إيقاف تطبيق الاختبار.
    5. حذف شبكة `my-network`.

## الحصول على نتيجة الاختبار

ستُعرض نتيجة اختبار الأمان على واجهة Jenkins.

![نتيجة تشغيل عقدة FAST في وضع الاختبار][fast-example-jenkins-result]

## مزيد من الأمثلة

يمكنك العثور على أمثلة لدمج FAST مع سير عمل Jenkins على [GitHub][fast-examples-github].

!!! info "للأسئلة الإضافية"
    إذا كان لديك أسئلة متعلقة بدمج FAST، يرجى [التواصل معنا][mail-to-us].