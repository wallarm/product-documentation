[img-demo-app]: ../../../images/fast/poc/common/examples/demo-app.png
[img-testing-flow]: ../../../images/fast/poc/en/examples/testing-flow.png
[img-testing-flow-fast]: ../../../images/fast/poc/en/examples/testing-flow-fast.png
[img-services-relations]: ../../../images/fast/poc/common/examples/api-services-relations.png
[img-test-traffic-flow]: ../../../images/fast/poc/en/examples/test-traffic-flow.png

[img-cci-pass-token]: ../../../images/fast/poc/common/examples/circleci/pass-token.png
[img-cci-pass-results]: ../../../images/fast/poc/common/examples/circleci/pass-results.png
[img-cci-workflow]: ../../../images/fast/poc/en/examples/circleci/api-workflow.png

[img-cci-demo-pass-token]: ../../../images/fast/poc/common/examples/circleci/demo-pass-token.png
[img-cci-demo-rspec-tests]: ../../../images/fast/poc/common/examples/circleci/api-demo-rspec-tests.png
[img-cci-demo-testrun]: ../../../images/fast/poc/common/examples/circleci/demo-testrun.png
[img-cci-demo-tests-failed]: ../../../images/fast/poc/common/examples/circleci/demo-tests-failed.png
[img-cci-demo-vuln-details]: ../../../images/fast/poc/common/examples/circleci/demo-vuln-details.png

[doc-env-variables]: ../../operations/env-variables.md
[doc-testrun-steps]: ../../operations/internals.md#test-run-execution-flow-baseline-requests-recording-takes-place
[doc-testrun-creation]: ../node-deployment.md#creating-a-test-run
[doc-get-token]: ../../operations/create-node.md
[doc-stopping-recording]: ../stopping-recording.md
[doc-waiting-for-tests]: ../waiting-for-tests.md
[doc-node-ready-for-recording]: ../node-deployment.md#do-one-time-check-of-test-run-state

[link-api-recoding-mode]: ../integration-overview-api.md#deployment-via-the-api-when-baseline-requests-recording-takes-place

[link-example-project]: https://github.com/wallarm/fast-example-api-circleci-rails-integration
[link-rspec]: https://rspec.info/
[link-capybara]: https://github.com/teamcapybara/capybara
[link-selenium]: https://www.seleniumhq.org/
[link-docker-compose-build]: https://docs.docker.com/compose/reference/build/
[link-circleci]: https://circleci.com/

[link-wl-portal]: https://us1.my.wallarm.com
[link-wl-portal-testrun-tab]: https://us1.my.wallarm.com/testing/?status=running

[anchor-project-description]: #how-the-sample-application-works
[anchor-cci-integration-description]: #how-fast-integrates-with-rspec-and-circleci
[anchor-cci-integration-demo]: #demo-of-the-fast-integration

# مثال على تكامل FAST في CI / CD

!!! info "أوثقة الفصل"
    يستخدم قيمة الرمز التالية كقيمة مثال طوال الفصل: `token_Qwe12345`.

مشروع عينة [fast-example-api-circleci-rails-integration][link-example-project] متاح على جيت هاب الخاص بوالارم. هدفه هو توضيح كيفية أداء تكامل FAST في العمليات المستمرة لـ CI / CD. يتبع هذا المثال سيناريو ["التنشيط من خلال API عند قيام التسجيل طلبات الخط الأساسي"][link-api-recoding-mode].

يحتوي هذا المستند على المعلومات التالية:
1. [تفسير لكيفية عمل تطبيق العينة.][anchor-project-description]
2. [شرح مفصل خطوة بخطوة لتكامل FAST.][anchor-cci-integration-description]
3. [عرض توضيحي لتكامل FAST في العمل.][anchor-cci-integration-demo]

## كيف يعمل التطبيق العينة

التطبيق العينة هو تطبيق ويب يسمح لك بنشر المنشورات على مدونة والقدرة على إدارة المشاركات في المدونة.

![التطبيق العينة][img-demo-app]

تم كتابة التطبيق بلغة Ruby on Rails وتم شحنه كحاوية Docker.

أيضًا، تم إنشاء اختبارات التكامل [RSpec][link-rspec] للتطبيق. يستخدم RSpec [Capybara][link-capybara] للتفاعل مع التطبيق الويب وتستخدم Capybara [Selenium][link-selenium] لإرسال طلبات HTTP إلى التطبيق:

![تدفق الاختبار][img-testing-flow]

تنفذ RSpec بعض الاختبارات التكاملية لاختبار السيناريوهات التالية:
* التنقل إلى الصفحة التي تحتوي على المشاركات
* إنشاء منشور جديد
* تحديث منشور موجود بالفعل
* حذف منشور موجود بالفعل

Capybara و Selenium تساعد في تحويل هذه الاختبارات إلى مجموعة من طلبات HTTP إلى التطبيق.

!!! info "موقع الاختبارات"
    تم توصيف الاختبارات التكاملية المذكورة أعلاه في ملف `spec/features/posts_spec.rb`.

## كيف يتكامل FAST مع RSpec و CircleCI

ستجد هنا نظرة عامة على تكامل FAST مع RSpec و CircleCI للمشروع العينة.

تدعم RSpec الروابط القبلية واللاحقية للتجربة:

```
config.before :context, type: :feature do
    # الإجراءات التي يجب اتخاذها قبل تنفيذ اختبارات RSpec
  end
    # تنفيذ اختبارات RSpec
  config.after :context, type: :feature do
    # الإجراءات التي يجب اتخاذها بعد تنفيذ اختبارات RSpec
  end
```

هذا يعني في الأساس أنه من الممكن زيادة الخطوات التي تتخذها RSpec لاختبار التطبيق مع الخطوات المتعلقة بالاختبارات الأمنية FAST.

يمكننا توجيه خادم Selenium إلى خادم وكيل باستخدام متغير البيئة `HTTP_PROXY`. وبالتالي، سيتم توخيم طلبات HTTP إلى التطبيق. يتيح استخدام آلية الوساطة لك تمرير الطلبات الصادرة عن الاختبارات التكاملية من خلال عقدة FAST مع التدخل الأدنى في تدفق الاختبار الحالي:

![تدفق الاختبار مع FAST][img-testing-flow-fast]

تم بناء وظيفة CircleCI مع الأخذ في الاعتبار كل الحقائق المذكورة أعلاه. تتألف الوظيفة من الخطوات التالية (راجع ملف `.circleci/config.yml`):

1. التحضيرات الضرورية:
    
    تحتاج إلى [الحصول على رمز][doc-get-token] وتمرير قيمته إلى المشروع CircleCI عبر متغير البيئة `TOKEN`.
بعد أن يكون وظيفة CI الجديدة في مكانها، يتم تمرير قيمة المتغير إلى حاوية Docker، حيث يتم تنفيذ الوظيفة.
    
    ![تمرير الرمز إلى CircleCI][img-cci-pass-token]
    
2. بناء الخدمات
    
    في هذه المرحلة يتعين بناء بعض حاويات Docker لمجموعة من الخدمات. يتم وضع الحاويات في شبكة Docker المشتركة. وبالتالي، يمكنهم التواصل مع بعضهم البعض باستخدام عناوين IP و أيضا اسماء الحاويات.
    
    تتم بناء الخدمات التالية (راجع ملف `docker-compose.yaml`):
    
    * `app-test`: خدمة للتطبيق الهدف وأداة الاختبار.
        
        تتألف صورة Docker للخدمة من المكونات التالية:
        
        * التطبيق الهدف (يمكن الوصول إليه عبر HTTP على `app-test:3000` بعد النشر).
        
        * أداة الاختبار RSpec المجتمعة مع Capybara؛ الأداة تحتوي على جميع الوظائف المطلوبة لتشغيل اختبارات الأمان FAST.
        
        * Capybara: مكونة لإرسال طلبات HTTP إلى التطبيق الهدف `app-test:3000` باستخدام خادم Selenium `selenium:4444` (راجع ملف `spec/support/capybara_settings.rb`).
        
        يتم تمرير الرمز إلى حاوية الخدمة بواسطة متغير البيئة `WALLARM_API_TOKEN=$TOKEN`. يتم استخدام الرمز بواسطة الوظائف، التي يتم وصفها في الأقسام `config.before` و `config.after` (راجع ملف `spec/support/fast-helper.rb`)، لأداء التلاعبات مع تشغيل الاختبار.
    
    * `fast`: خدمة لعقدة FAST.
        
        العقدة قابلة للوصول عبر HTTP على `fast:8080` بعد النشر. 
        
        يتم تمرير الرمز إلى حاوية الخدمة بواسطة متغير البيئة `WALLARM_API_TOKEN=$TOKEN`. الرمز مطلوب لتشغيل FAST بشكل صحيح.
        
        !!! info "ملاحظة على طلبات الخط الأساسي"
            النموذج المقدم لا يوظف متغير البيئة `ALLOWED_HOSTS`. لذلك، تتعرف العقدة FAST على جميع الطلبات الواردة كونها الأساسية.
    
    * `selenium`: خدمة لخادم Selenium. تستخدم Capybara من حاوية `app-test` الخادم لتشغيلها.
        
        يتم تمرير متغير البيئة `HTTP_PROXY=http://fast:8080` إلى حاوية الخدمة لتمكين وكيل الطلبات من خلال عقدة FAST.
        
        الخدمة قابلة للوصول عبر HTTP على `selenium:4444` بعد النشر.
        
    تشكل جميع الخدمات العلاقات التالية بينها:
    
    ![علاقات بين الخدمات][img-services-relations]
    
3. بسبب العلاقات المذكورة أعلاه، يجب نشر الخدمات بترتيب صارم على النحو التالي:
    1. `fast`.
    2. `selenium`.
    3. `app-test`.
    
    يتم نشر الخدمات `fast` و `selenium` بطريقة تسلسلية بإصدار الأمر `docker-compose up -d fast selenium`.

4. بعد نشر الخادم Selenium وعقدة FAST بنجاح، حان الوقت لنشر خدمة `app-test` وتنفيذ اختبارات RSpec.
    
    للقيام بذلك، يتم إصدار الأمر التالي:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    تظهر تدفقات اختبارات وحركة مرور HTTP في الصورة:
    
    ![تدفقات اختبارات وحركة مرور HTTP][img-test-traffic-flow]
    
    وفقًا لل[سيناريو][link-api-recoding-mode]، تتضمن اختبارات RSpec جميع الخطوات المطلوبة لتشغيل اختبارات الأمان FAST (راجع ملف `spec/support/fast_hooks.rb`):
    
    1. يتم [إنشاء عملية اختبار][doc-testrun-creation] قبل تنفيذ اختبارات RSpec.
        
        ثم يتم [إصدار طلب API][doc-node-ready-for-recording] للتحقق مما إذا كانت عقدة FAST جاهزة لتسجيل طلبات الأساس. لا يتم بدء عملية التنفيذ الخاصة بالاختبارات الحالية حتى يكون العقدة جاهزة.
        
        !!! info "سياسة الاختبار المستخدمة"
            يستخدم هذا المثال السياسة الافتراضية للاختبار.
        
    2. يتم تنفيذ اختبارات RSpec.
    3. يتم أداء الإجراءات التالية بعد الانتهاء من اختبارات RSpec:
        1. يتم [إيقاف عملية تسجيل الطلبات الأساسية][doc-stopping-recording]; 
        2. يتم [مراقبة حالة تشغيل الاختبار بشكل دوري][doc-waiting-for-tests]:
            * إذا اكتملت اختبارات الأمان FAST بنجاح (حالة تشغيل الاختبار هي `state: passed`)، فيتم إرجاع كود الخروج `0` إلى RSpec.
            * إذا لم تكتمل اختبارات الأمان FAST بنجاح (تم اكتشاف بعض الثغرات وحالة تشغيل الاختبار هي `state: failed`)، فيتم إرجاع كود الخروج `1` إلى RSpec.
    
5. يتم الحصول على نتيجة الاختبار:
    
    يتم تمرير كود الخروج لعملية RSpec إلى عملية `docker-compose run` ثم إلى CircleCI.     
    
    ![نتيجة الوظيفة في CircleCI][img-cci-pass-results]

تتبع وظيفة CircleCI الموصوفة الخطوات المدرجة [سابقًا][link-api-recoding-mode]:

![تفاصيل وظيفة CircleCI][img-cci-workflow]

## عرض توضيحي لتكامل FAST

1. [إنشاء عقدة FAST][doc-get-token] في سحابة Wallarm ونسخ الرمز المقدم.
2. نسخ [ملفات المشروع العينة][link-example-project] إلى مستودع GitHub الخاص بك.
3. أضف مستودع GitHub الخاص بك إلى [CircleCI][link-circleci] (اضغط على الزر "Follow Project" في CircleCI) بحيث تبدأ وظيفة CI كلما قمت بتغيير محتوى المستودع. يسمى المستودع "مشروع" في المصطلحات CircleCI.
4. أضف متغير بيئة `TOKEN` إلى مشروع CircleCI. يمكنك القيام بذلك في إعدادات المشروع. امرر الرمز FAST كقيمة لهذا المتغير:
    
    ![تمرير الرمز إلى المشروع][img-cci-demo-pass-token]
    
5. ادفع شيئا إلى المستودع لبدء وظيفة CI. تأكد من أن اختبارات التكامل RSpec انتهت بنجاح (راجع ناتج وحدة التحكم للوظيفة):
    
    ![اجتاز اختبارات RSpec][img-cci-demo-rspec-tests]
    
6. تأكد من أن عملية الاختبار قيد التنفيذ.
    
    يمكنك تسجيل الدخول إلى [بوابة Wallarm][link-wl-portal] باستخدام معلومات حساب Wallarm الخاص بك والانتقال إلى [علامة تبويب "Testruns"][link-wl-portal-testrun-tab] لمراقبة عملية اختبار التطبيق ضد الثغرات الأمنية في الوقت الحقيقي:
    
    ![تنفيذ تشغيل الاختبار][img-cci-demo-testrun]
    
7. يمكنك رؤية حالة وظيفة CI المبلغ بها ك "Failed" بعد الانتهاء من عملية الاختبار:
    
    ![الانتهاء من وظيفة CI][img-cci-demo-tests-failed]
    
    بناءً على أن التطبيق التجريبي للجدار الواقي يخضع للاختبار، فإن وظيفة CI الفاشلة تمثل الثغرات الأمنية التي اكتشفها FAST في التطبيق (يجب أن تظهر رسالة "اختبارات FAST فشلت" في ملفات سجل البناء). الفشل ليس ناجمًا عن أي مشكلات تقنية متعلقة بالبناء في هذه الحالة.
    
    !!! info "رسالة الخطأ"
        يتم إنتاج رسالة الخطأ "اختبارات FAST فشلت" بواسطة الأسلوب `wait_test_run_finish` الموجود في ملف `spec/support/fast_helper.rb`، والذي يكون قبل الإنهاء برمز الخروج `1`.

8. لا توجد معلومات عن الثغرات الأمنية التي تم اكتشافها تعرض في وحدة التحكم CircleCI خلال عملية الاختبار. 

    يمكنك استكشاف الثغرات الأمنية بتفصيل في بوابة Wallarm. للقيام بذلك، انتقل إلى رابط تشغيل الاختبار. يتم عرض الرابط كجزء من رسالة FAST الإعلامية في وحدة التحكم CircleCI.
    
    يجب أن يكون هذا الرابط ناجحًا:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    على سبيل المثال، يمكنك إلقاء نظرة على تشغيل الاختبار المكتمل لمعرفة أنه تم العثور على بعض الثغرات الأمنية XSS في التطبيق العينة:
    
     ![معلومات مفصلة عن الثغرة][img-cci-demo-vuln-details]
    
للختام، تم التوضيح أن FAST لديها قدرات قوية للتكامل في العمليات المستمرة لـ CI / CD بالإضافة إلى العثور على الثغرات الأمنية في التطبيق حتى عندما تمر اختبارات التكامل بدون أي أخطاء.