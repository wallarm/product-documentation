[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# دمج أقراص Wallarm FAST مع CircleCI

تصف هذه التعليمات الطريقة لدمج FAST مع سير عمل CircleCI عبر [أقراص Wallarm FAST (البرنامج الإضافي)][circleci-fast-plugin]. يتم إجراء إعداد الدمج في ملف التهيئة `~/.circleci/config.yml`. المزيد من التفاصيل حول أقراص CircleCI متوفرة في [وثائق CircleCI الرسمية][circleci-using-orbs].

!!! warning "المتطلبات"

    * الإصدار 2.1 من CircleCI
    * تم تهيئة سير عمل CircleCI مع مجموعة [مسجلة من الطلبات الأساسية][recording-mode]
    
    إذا كنت تعمل مع إصدار آخر من CircleCI أو تحتاج إلى إضافة خطوة تسجيل الطلبات، فيرجى الاطلاع على [مثال الدمج مع CircleCI عبر عقدة FAST][fast-jenkins-cimode].

## الخطوة 1: تمرير رمز عقدة FAST

قم بتمرير قيمة [رمز عقدة FAST][fast-node-token] في متغير البيئة `WALLARM_API_TOKEN` في إعدادات مشروع CircleCI. طريقة إعداد متغيرات البيئة موصوفة في [وثائق CircleCI][circleci-set-env-var].

![تمرير متغير بيئة CircleCI][circleci-example-env-var]

## الخطوة 2: ربط أقراص Wallarm FAST

لربط أقراص Wallarm FAST، قم بتعيين الإعدادات التالية في ملف `~/.circleci/config.yml`:

1. تأكد من تحديد الإصدار 2.1 من CircleCI في الملف:

    ```
    version: 2.1
    ```
2. قم بتهيئة البرنامج الإضافي Wallarm FAST في قسم `orbs`:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## الخطوة 3: تكوين خطوة اختبار الأمان

لتكوين اختبار الأمان، أضف الخطوة المنفصلة `fast/run_security_tests` إلى سير عمل CircleCI وحدد المعاملات المذكورة أدناه:

| المعامل | الوصف | مطلوب |
| ---------| ---------|--------------- |
| test_record_id| معرف سجل الاختبار. يتوافق مع [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>القيمة الافتراضية هي آخر سجل اختبار أنشأته عقدة FAST المستخدمة. | نعم|
| app_host | عنوان تطبيق الاختبار. يمكن أن تكون القيمة عنوان IP أو اسم نطاق.<br>القيمة الافتراضية هي IP داخلي. | لا |
| app_port | منفذ تطبيق الاختبار.<br>القيمة الافتراضية هي 80. | لا |
| policy_id | معرف [سياسة الاختبار](../operations/test-policy/overview.md).<br>القيمة الافتراضية هي `[null]`-`سياسة الاختبار الافتراضية`. | لا |
| stop_on_first_fail | مؤشر لإيقاف الاختبار عند حدوث خطأ. | لا |
| test_run_name | اسم جولة الاختبار.<br>افتراضيًا، سيتم إنشاء القيمة تلقائيًا من تاريخ إنشاء جولة الاختبار. | لا |
| test_run_desc | وصف جولة الاختبار. | لا |
| test_run_rps | حد عدد طلبات الاختبار (*RPS*, *طلبات في الثانية*) المرسلة إلى تطبيق الهدف.<br>القيمة الدنيا: `1`.<br>القيمة القصوى: `1000`.<br>القيمة الافتراضية: `null` (RPS غير محدود). | لا |
| wallarm_api_host | عنوان خادم API Wallarm. <br>القيم المسموح بها: <br>`us1.api.wallarm.com` للخادم في سحابة Wallarm الأمريكية و<br>`api.wallarm.com` للخادم في سحابة Wallarm الأوروبية<br>القيمة الافتراضية هي `us1.api.wallarm.com`. | لا|
| wallarm_fast_port | منفذ عقدة FAST.<br>القيمة الافتراضية هي 8080. | لا |
| wallarm_version | إصدار أقراص Wallarm FAST المستخدمة.<br>قائمة الإصدارات متاحة بالنقر على [الرابط][circleci-fast-plugin].<br>القيمة الافتراضية هي الأحدث.| لا|

??? info "مثال على ~/.circleci/config.yml"
    ```
    version: 2.1
    jobs:
      build:
        machine:
          image: 'ubuntu-1604:201903-01'
        steps:
          - checkout
          - run:
              command: >
                docker run -d --name app-test -p 3000:3000
                wallarm/fast-example-rails
              name: Run application
          - fast/run_security_tests:
              app_port: '3000'
              test_record_id: '9058'
    orbs:
      fast: 'wallarm/fast@dev:1.1.0'
    ```

    يمكنك العثور على المزيد من أمثلة دمج FAST إلى سير عمل CircleCI في [GitHub](https://github.com/wallarm/fast-examples) و [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration).

!!! info "الأسئلة الإضافية"
    إذا كانت لديك أسئلة تتعلق بدمج FAST، يرجى [التواصل معنا][mail-to-us].