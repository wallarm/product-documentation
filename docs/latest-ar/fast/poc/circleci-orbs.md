# دمج كرات Wallarm FAST مع CircleCI

هذه التعليمات توضح الطريقة لدمج FAST مع سير عمل CircleCI عبر [كرات Wallarm FAST (الإضافة)][circleci-fast-plugin]. يتم إجراء إعداد الدمج في ملف التكوين `~/.circleci/config.yml`. يتوفر المزيد من التفاصيل حول كرات CircleCI في [التوثيق الرسمي لCircleCI][circleci-using-orbs].

!!! تحذير "المتطلبات"

    * نسخة CircleCI 2.1
    * تم تكوين سير عمل CircleCI مع [مجموعة مسجلة مسبقًا من الطلبات الأساسية][recording-mode]
    
    إذا كنت تعمل مع نسخة أخرى من CircleCI أو تحتاج إلى إضافة خطوة تسجيل الطلبات، فالرجاء الاطلاع على [مثال الدمج مع CircleCI عبر عقدة FAST][fast-jenkins-cimode].

## الخطوة 1: تمرير رمز عقدة FAST

قم بتمرير قيمة [رمز عقدة FAST][fast-node-token] في متغير البيئة `WALLARM_API_TOKEN` في إعدادات مشروع CircleCI. يتم وصف طريقة إعداد متغيرات البيئة في [توثيق CircleCI][circleci-set-env-var].

![تمرير متغير بيئة CircleCI][circleci-example-env-var]

## الخطوة 2: ربط كرات Wallarm FAST

لربط كرات Wallarm FAST، ضبط الإعدادات التالية في ملف `~/.circleci/config.yml`:

1. تأكد من تحديد نسخة CircleCI 2.1 في الملف:

    ```
    version: 2.1
    ```
2. تهيئة إضافة Wallarm FAST في قسم `orbs`:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## الخطوة 3: تكوين خطوة اختبار الأمان

لتكوين اختبار الأمان، اضف الخطوة المنفصلة `fast/run_security_tests` إلى سير عمل CircleCI وحدد المعايير المدرجة أدناه:

| المعامل | الوصف | مطلوب |
| ---------| ---------|--------------- |
| test_record_id| رقم تسجيل الاختبار. يقابل [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>القيمة الافتراضية هي آخر رقم اختبار تم إنشاؤه بواسطة عقدة FAST المستخدمة. | نعم|
| app_host | عنوان تطبيق الاختبار. يمكن أن تكون قيمة عنوان IP أو اسم نطاق.<br>القيمة الافتراضية هي العنوان الداخلي IP. | لا |
| app_port | منفذ تطبيق الاختبار.<br>القيمة الافتراضية هي 80. | لا |
| policy_id | [سياسة الاختبار](../operations/test-policy/overview.md) رقم الهوية.<br>القيمة الافتراضية هي `[null]` - `سياسة الاختبار الافتراضية`. | لا |
| stop_on_first_fail | المؤشر لوقف الاختبار عند حدوث خطأ. | لا |
| test_run_name | اسم جولة الاختبار.<br>بشكل افتراضي، سيتم توليد القيمة تلقائيًا من تاريخ إنشاء جولة الاختبار. | لا |
| test_run_desc | وصف جولة الاختبار. | لا |
| test_run_rps | حد عدد طلبات الاختبار (*RPS*, *الطلبات لكل ثانية*) التي سيتم إرسالها إلى تطبيق الهدف.<br>القيمة الدنيا: `1`.<br>القيمة القصوى: `1000`.<br>القيمة الافتراضية: `null` (RPS غير محدود). | لا |
| wallarm_api_host | عنوان خادم واجهة برمجة التطبيقات Wallarm. <br>القيم المسموح بها: <br>`us1.api.wallarm.com` للخادم في سحابة Wallarm الأمريكية و<br>`api.wallarm.com` للخادم في سحابة Wallarm الأوروبية<br>القيمة الافتراضية هي `us1.api.wallarm.com`. | لا|
| wallarm_fast_port | منفذ عقدة FAST.<br>القيمة الافتراضية هي 8080. | لا |
| wallarm_version | نسخة كرات Wallarm FAST المستخدمة.<br>قائمة النسخ متاحة بالنقر على [الرابط][circleci-fast-plugin].<br>القيمة الافتراضية هي الأحدث.| لا|

??? معلومات "مثال لـ ~/.circleci/config.yml"
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

    يمكنك إيجاد المزيد من أمثال لدمج FAST في سير عمل CircleCI في [GitHub](https://github.com/wallarm/fast-examples) و[CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration).

!!! معلومات "لمزيد من الاستفسارات"
    إذا كان لديك أسئلة متعلقة بدمج FAST، الرجاء [التواصل معنا][mail-to-us].