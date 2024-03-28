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

!!! info "اصطلاحات الفصل"
    تستخدم قيمة الرمزية التالية كقيمة مثالية طوال الفصل: `token_Qwe12345`.

مشروع عينة [fast-example-api-circleci-rails-integration][link-example-project] متاح على GitHub الخاص بـ Wallarm. الهدف منه هو توضيح كيفية تنفيذ تكامل FAST في عمليات CI / CD الحالية. يتبع هذا المثال السيناريو ["التوزيع عبر الواجهة البرمجية عند تسجيل طلبات الأساس"][link-api-recoding-mode].

يحتوي هذا المستند على القطع التالية من المعلومات:
1. [توضيح كيفية عمل تطبيق العينة.][anchor-project-description]
2. [وصف مفصل خطوة بخطوة لتكامل FAST.][anchor-cci-integration-description]
3. [عرض توضيحي لتكامل FAST في العمل.][anchor-cci-integration-demo]

##  كيف تعمل التطبيق النموذجي

التطبيق النموذجي هو تطبيق ويب يتيح لك نشر المنشورات على مدونة والقدرة على إدارة مشاركات المدونة.

![التطبيق النموذجي][img-demo-app]

كتب التطبيق في Ruby on Rails وتم توزيعه كحاوية Docker.

بالإضافة إلى ذلك ، تم إنشاء اختبارات التكامل [RSpec][link-rspec] للتطبيق. يستخدم RSpec [Capybara][link-capybara] للتفاعل مع التطبيق على الويب ويستخدم Capybara [Selenium][link-selenium] لإرسال طلبات HTTP إلى التطبيق:

![تدفق الاختبار][img-testing-flow]

تنفذ RSpec بعض اختبارات التكامل لاختبار السيناريوهات التالية:
* التنقل إلى صفحة المشاركات
* إنشاء منشور جديد
* تحديث وظيفة موجودة
* حذف منشور موجود

تساعد Capybara و Selenium في تحويل هذه الاختبارات إلى مجموعة من طلبات HTTP إلى التطبيق.

!!! info "موقع الاختبارات"
    يتم وصف الاختبارات الشاملة المذكورة في ملف `spec/features/posts_spec.rb`.

##  كيف يتكامل FAST مع RSpec و CircleCI

هنا ستجد نظرة عامة على تكامل FAST مع RSpec و CircleCI للمشروع العينة.

يدعم RSpec خطافات قبل الاختبار وبعد الاختبار:

```
config.before :context, type: :feature do
    # الإجراءات التي يجب اتخاذها قبل تنفيذ اختبارات RSpec
  end
    # تنفيذ اختبارات RSpec
  config.after :context, type: :feature do
    # الإجراءات التي يجب اتخاذها بعد تنفيذ اختبارات RSpec
  end
```

هذا يعني في الأساس أنه يمكن توسيع الخطوات التي يتخذها RSpec لاختبار التطبيق بخطوات تتضمن اختبارات الأمن FAST.

يمكننا توجيه خادم Selenium إلى خادم بروكسي باستخدام متغير البيئة `HTTP_PROXY`. وبالتالي ، سيتم توجيه طلبات HTTP إلى التطبيق. استخدام آلية البروكسي يتيح لك تمرير الطلبات التي أصدرتها اختبارات التكامل من خلال عقدة FAST بتدخل أدنى في تدفق الاختبار الحالي:

![تدفق الاختبار مع FAST][img-testing-flow-fast]

تم بناء وظيفة CircleCI بالأخذ في الاعتبار كل الحقائق السابقة الذكر. تتألف الوظيفة من الخطوات التالية (انظر الملف `.circleci/config.yml`):

1.  الاستعدادات اللازمة:

     أنت بحاجة إلى [الحصول على رمز تعريفي][doc-get-token] ، وتمرير القيمة إلى مشروع CircleCI عبر متغير البيئة `TOKEN`.
بعد وجود وظيفة CI جديدة ، يتم تمرير قيمة المتغير إلى حاوية Docker، حيث يتم تنفيذ الوظيفة.
   
     ![تمرير الرمز إلى CircleCI][img-cci-pass-token]
    
2.  بناء الخدمات
    
    في هذه المرحلة يتم بناء بضع حاويات Docker لمجموعة من الخدمات. تتم وضع الحاويات في شبكة Docker المشتركة. ولذا، يمكن أن يتواصلوا مع بعضها البعض باستخدام عناوين IP بالإضافة إلى أسماء الحاويات.
   
    الخدمات الآتية هي التي تم بناؤها (انظر الملف `docker-compose.yaml`):
   
    * `app-test`: خدمة للتطبيق الهدف وأداة الاختبار.
       
        تتألف صورة Docker للخدمة من الأجزاء التالية:
       
        * التطبيق الهدف (يمكن الوصول إليه عبر HTTP على `app-test:3000` بعد النشر).
       
        * أداة اختبار RSpec المرتبطة بـ Capybara؛ تحتوي الأداة على جميع الوظائف المطلوبة لتشغيل اختبارات الأمان FAST.
       
        * Capybara: معدة لإرسال طلبات HTTP إلى التطبيق الهدف `app-test:3000` بإستخدام خادم Selenium `selenium:4444` (انظر الملف `spec/support/capybara_settings.rb`).
       
        يتم تمرير الرمز إلى حاوية الخدمة بواسطة متغير البيئة `WALLARM_API_TOKEN=$TOKEN`. يتم استخدام الرمز بواسطة الوظائف، التي تم وصفها في الأقسام `config.before` و `config.after` (انظر الملف `spec/support/fast-helper.rb`)، لإجراء التلاعب بنجرة الاختبار.
   
    * `fast`: خدمة لعقدة FAST.
       
        هذه العقدة يمكن الوصول إليها عبر HTTP عند `fast:8080` بعد النشر. 
       
        يتم تمرير الرمز إلى حاوية الخدمة بواسطة متغير البيئة `WALLARM_API_TOKEN=$TOKEN`. هذا الرمز مطلوب للعملية FAST الصحيحة.
       
        !!! info "ملاحظة على طلبات الأساس"
            لا يستخدم المثال المقدم متغير البيئة `ALLOWED_HOSTS` [doc-env-variables]. لذا، تتعرف عقدة FAST على كل الطلبات الواردة بأنها طلبات أساسية.
    
    * `selenium`: خدمة لخادم Selenium. تستخدم Capybara من حاوية `app-test` الخادم لعملها.
        
        يتم تمرير متغير البيئة `HTTP_PROXY=http://fast:8080` إلى حاوية الخدمة لتمكين وكيل الطلبات من خلال عقدة FAST.
        
        يمكن الوصول إلى الخدمة عبر HTTP على `selenium:4444` بعد النشر.
        
    جميع الخدمات تشكل علاقات بينها كالتالي:
    
    ![العلاقات بين الخدمات][img-services-relations]
    
3.  بسبب العلاقات المذكورة أعلاه، يجب نشر الخدمات بترتيب صارم كما يلي:
    1.  `fast`.
    2.  `selenium`.
    3.  `app-test`.
    
    يتم نشر الخدمات `fast` و `selenium` بطريقة تتسلسل عن طريق إصدار الأمر `docker-compose up -d fast selenium`.
    
4.  بعد النشر الناجح لخادم Selenium وعقدة FAST، حان الوقت لنشر الخدمة `app-test` وتنفيذ اختبارات RSpec.
    
    للقيام بذلك، يتم إصدار الأمر التالي:
    
    `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
    يتم إظهار تدفق الاختبار وتدفق HTTP في الصورة:
    
    ![تدفق الاختبار و HTTP][img-test-traffic-flow]
    
    وفقًا لل [سيناريو][link-api-recoding-mode]، تتضمن اختبارات RSpec جميع الخطوات المطلوبة لتشغيل اختبارات الأمان FAST (انظر الملف 'spec/support/fast_hooks.rb'):
    
    1.  يتم [إنشاء نجرة الاختبار][doc-testrun-creation] قبل تنفيذ اختبارات RSpec.
        
        بعد ذلك، يتم [اصدار دعوة الواجهة البرمجية][doc-node-ready-for-recording] للتحقق مما إذا كانت عقدة FAST جاهزة لتسجيل طلبات الأساس. لا يتم بدء عملية تنفيذ الاختبارات الحالية حتى تكون العقدة جاهزة.
        
        !!! info "سياسة الاختبار قيد الاستعمال"
            يستخدم هذا المثال سياسة الاختبار الافتراضية.
        
    2.  يتم تنفيذ اختبارات RSpec.
    3.  يتم أداء الإجراءات التالية بعد انتهاء اختبارات RSpec:
        1.  يتم التوقف عن عملية تسجيل طلبات الأساس [يتوقف][doc-stopping-recording]؛ 
        2.  حالة نجرة الاختبار [يجرى الرصد بشكل دوري][doc-waiting-for-tests]:
            * في حالة إ完成 اختبارات الأمان FAST بنجاح (تكون حالة نجرة الاختبار `state: passed`)، يتم إرجاع رمز الخروج `0` إلى RSpec.
            * في حالة إكمال اختبارات الأمان FAST بشكل غير ناجح (تم الكشف عن بعض الثغرات الأمنية و حالة نجرة الاختبار هي `state: failed`)، يتم إرجاع رمز الخروج `1` إلى RSpec.
    
5.  يتم الحصول على نتيجة الاختبار:
    
    يتم تمرير رمز الخروج الخاص بعملية RSpec إلى عملية `docker-compose run` ومن ثم إلى CircleCI.    
    
    ![نتيجة الوظيفة في CircleCI][img-cci-pass-results]

الوظيفة CircleCI الموصوفة تتبع بسرور الخطوات المدرجة [من قبل][link-api-recoding-mode]:

![وظيفة CircleCI بالتفصيل][img-cci-workflow]

##  عرض توضيحي لتكامل FAST

1.  [إنشاء عقدة FAST][doc-get-token] في سحابة Wallarm وانسخ الرمز المقدم.
2.  انسخ ملفات [المشروع العينة][link-example-project] إلى مستودع GitHub الخاص بك.
3.  أضف مستودع GitHub الخاص بك إلى [CircleCI][link-circleci] (اضغط على الزر "Follow Project" في CircleCI) بحيث يتم تشغيل وظيفة CI في كل مرة تقوم فيها بتغيير محتوى المستودع. يسمى المستودع "مشروع" في مصطلحات CircleCI.
4.  أضف متغير بيئة `TOKEN` إلى مشروع CircleCI الخاص بك. يمكنك فعل ذلك في إعدادات المشروع. قم بتمرير الرمز FAST كقيمة لهذا المتغير:
    
    ![تمرير الرمز إلى المشروع][img-cci-demo-pass-token]
    
5.  قم بالدفع إلى المستودع لبداية الوظيفة CI. تأكد من أن اختبارات التكامل RSpec اكتملت بنجاح (انظر خرج وحدة التحكم للوظيفة):
    
    ![تم تجاوز اختبارات RSpec][img-cci-demo-rspec-tests]
    
6.  تأكد أن نجرة الاختبار قيد التنفيذ.
    
    يمكنك تسجيل الدخول إلى [بوابة Wallarm][link-wl-portal] باستخدام معلومات حساب Wallarm الخاصة بك والتنقل إلى [علامة التبويب "Testruns"][link-wl-portal-testrun-tab] لمشاهدة عملية اختبار التطبيق ضد الثغرات الأمنية في الوقت الفعلي:
    
    ![تنفيذ نجرة الاختبار][img-cci-demo-testrun]
    
7.  يمكنك مشاهدة حالة الوظيفة CI التي تم الإبلاغ عنها باعتبارها "فشل" بعد الانتهاء من عملية الاختبار:
    
    ![إكمال الوظيفة CI][img-cci-demo-tests-failed]
    
    بالنظر الى أن هناك تطبيق Wallarm demo تحت الاختبار، يمثل الحقل CI فشل الثغرات الأمنية التي اكتشفتها FAST في التطبيق (يجب أن يظهر الرسالة "اختبارات FAST فشلت" في ملفات سجل البناء). الفشل في هذه الحالة لا يتم إثارته من خلال أي مشاكل تقنية مرتبطة بالبناء.
    
    !!! info "رسالة خطأ"
        يتم إنتاج رسالة الخطأ "اختبارات FAST فشلت" بواسطة طريقة `wait_test_run_finish` التي تقع في الملف `spec/support/fast_helper.rb`، وهي قبل إنهاء رمز الخروج `1`.

8.  لا توجد معلومات عن الثغرات الأمنية المكتشفة تظهر في وحدة تحكم CircleCI أثناء عملية التجربة. 

    يمكنك استكشاف الثغرات الأمنية بالتفصيل على بوابة Wallarm. للقيام بذلك، التنقل إلى رابط نجرة الاختبار. يتم عرض الرابط كجزء من رسالة FAST التوضيحية في وحدة تحكم CircleCI.
    
    يجب أن يبدو هذا الرابط كما يلي:
    `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
    على سبيل المثال، يمكنك إلقاء نظرة على نجرة الاختبار المكتملة لاكتشاف أنه تم العثور على بعض الثغرات XSS في التطبيق العينة:
    
    ![معلومات مفصلة عن الثغرة][img-cci-demo-vuln-details]
    
للختام، تم التوضيح أن FAST لديها قدرات قوية للتكامل في عمليات CI / CD الحالية بالإضافة إلى العثور على الثغرات الأمنية في التطبيق حتى عندما يتم تمرير اختبارات التكامل بدون أي أخطاء.