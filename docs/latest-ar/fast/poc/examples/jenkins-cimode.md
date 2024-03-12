[jenkins-config-pipeline]:      https://jenkins.io/doc/book/pipeline
[fast-node-token]:              ../../operations/create-node.md
[jenkins-parameterized-build]:  https://wiki.jenkins.io/display/JENKINS/Parameterized+Build
[jenkins-example-env-var]:     ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-add-token-example.png
[fast-example-jenkins-result]:  ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-result-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

# دمج FAST مع Jenkins

يتم تكوين دمج FAST في وضع CI مع سير عمل Jenkins من خلال ملف `Jenkinsfile`. تتوفر المزيد من التفاصيل حول تكوين سير عمل Jenkins في [وثائق Jenkins الرسمية][jenkins-config-pipeline].

## تمرير Token Node لـ FAST

لكي تستخدم [رمز نود FAST][fast-node-token] بأمان، امرر قيمته في [متغير البيئة في إعدادات مشروعك][jenkins-parameterized-build].

![تمرير متغير بيئة Jenkins][jenkins-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## إضافة خطوة تسجيل الطلبات

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "مثال على خطوة الاختبار الأوتوماتيكي مع تشغيل نود FAST في وضع التسجيل"
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

    يشمل المثال الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل نود FAST في وضع التسجيل على الشبكة `my-network`.
    3. تشغيل أداة الاختبار الأوتوماتيكي Selenium باستخدام نود FAST كوكيل على الشبكة `my-network`.
    4. تشغيل التطبيق الاختباري والاختبارات الأوتوماتيكية.
    5. إيقاف Selenium ونود FAST.
    6. حذف شبكة `my-network`.

## إضافة خطوة الاختبار الأمني

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "مثال على خطوة الاختبار الأمني"

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

    يتضمن المثال الخطوات التالية:

    1. إنشاء شبكة Docker `my-network`.
    2. تشغيل التطبيق الاختباري على شبكة `my-network`.
    3. تشغيل نود FAST في وضع الاختبار على شبكة `my-network`. تم تجاهل متغير `TEST_RECORD_ID` لأنه تم إنشاء مجموعة الطلبات الأساسية في pipeline الحالي وهي آخر ما تم تسجيله. سيتم إيقاف نود FAST تلقائيًا عندما يتم الانتهاء من الاختبار.
    4. إيقاف التطبيق الاختباري.
    5. حذف شبكة `my-network`.

## الحصول على نتيجة الاختبار

سيتم عرض نتيجة الاختبار الأمني على واجهة Jenkins.

![نتيجة تشغيل نود FAST في وضع الاختبار][fast-example-jenkins-result]

## المزيد من الأمثلة

يمكنك إيجاد أمثلة لدمج FAST مع سير عمل Jenkins على [GitHub][fast-examples-github] الخاص بنا.

!!! info "لمزيد من الاستفسارات"
    إذا كان لديك أي أسئلة تتعلق بدمج FAST، يرجى [التواصل معنا][mail-to-us].