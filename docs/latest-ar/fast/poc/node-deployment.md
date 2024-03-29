[anchor-node]:                      #deployment-of-the-docker-container-with-the-fast-node
[anchor-testrun]:                   #obtaining-a-test-run
[anchor-testrun-creation]:          #creating-a-test-run
[anchor-testrun-copying]:           #copying-a-test-run

[doc-limit-requests]:               ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-prepare-a-file-containing-the-necessary-environment-variables
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-docker-run-fast]:              ../qsg/deployment.md#4-deploy-the-fast-node-docker-container
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-run
[doc-testrecord]:                   ../operations/internals.md#test-record
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#clean-up---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   تشغيل عقدة FAST عبر واجهة برمجة تطبيقات Wallarm

!!! info "متطلبات الفصل"
    لاتباع الخطوات الموصوفة في هذا الفصل، يجب الحصول على [رمز][doc-get-token].
    
    القيم التالية تُستخدم كأمثلة طوال هذا الفصل:
    
    * `token_Qwe12345` كرمز.
    * `tr_1234` كمعرف لتشغيل اختبار.
    * `rec_0001` كمعرف لتسجيل اختبار.

تشمل عملية تشغيل وتكوين عقدة FAST الخطوات التالية:
1.  [نشر حاوية Docker مع عقدة FAST.][anchor-node]
2.  [الحصول على تشغيل اختبار.][anchor-testrun]

##  نشر حاوية Docker مع عقدة FAST

!!! warning "منح الوصول إلى خوادم واجهة برمجة تطبيقات Wallarm"
    من الضروري للعمل السليم لعقدة FAST أن يكون لديها وصول إلى خوادم واجهة برمجة تطبيقات Wallarm `us1.api.wallarm.com` أو `api.wallarm.com` عبر بروتوكول HTTPS (`TCP/443`).
    
    تأكد من عدم تقييد جدار الحماية الخاص بك لمضيف Docker من الوصول إلى خوادم واجهة برمجة تطبيقات Wallarm.

قبل تشغيل حاوية Docker مع عقدة FAST، تتطلب بعض التهئية. لتكوين العقدة، ضع الرمز في الحاوية باستخدام متغير البيئة `WALLARM_API_TOKEN`. بالإضافة إلى ذلك، يمكنك استخدام متغير `ALLOWED_HOSTS` إذا كنت بحاجة [لتحديد عدد الطلبات المسجلة][doc-limit-requests].

لتمرير متغيرات البيئة إلى الحاوية، ضع المتغيرات في ملف نصي وحدد مسار الملف باستخدام المُعامل [`--env-file`][link-docker-envfile] لأمر [`docker run`][link-docker-run] (راجع [التعليمات][doc-docker-run-fast] في دليل "البدء السريع").

نفذ الأمر التالي لتشغيل حاوية مع عقدة FAST:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

يفترض هذا الدليل أن الحاوية تعمل مرة واحدة فقط للوظيفة CI/CD المعطاة ويتم إزالتها عند انتهاء الوظيفة. لذلك، تم إضافة المُعامل [`--rm`][link-docker-rm] إلى الأمر المذكور أعلاه.

يرجى الرجوع إلى دليل "البدء السريع" للحصول على [وصف مفصل][doc-docker-run-fast] لمعاملات الأمر.

??? info "مثال"
    يُفترض في هذا المثال أن عقدة FAST تستخدم الرمز `token_Qwe12345` ومُعدة لتسجيل جميع الطلبات الأساسية الواردة التي تحتوي `example.local` كجزء من قيمة رأسية الـ `Host`.  

    يُظهر المثال التالي محتوى ملف مع متغيرات البيئة:

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    يُشغل الأمر أدناه حاوية Docker باسم `fast-poc-demo` بالسلوك التالي:
    
    * يتم إزالة الحاوية بعد انتهاء عملها.
    * يتم تمرير متغيرات البيئة إلى الحاوية باستخدام ملف `fast.cfg`. 
    * يتم نشر منفذ `8080` للحاوية إلى منفذ `9090` لمضيف Docker.

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

إذا كان نشر عقدة FAST ناجحًا، ستحتوي وحدة التحكم في الحاوية وملف السجل على الرسائل الإعلامية التالية:

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

الآن عقدة FAST تستمع إلى عنوان IP لمضيف Docker، والمنفذ الذي حددته سابقًا باستخدام المُعامل `-p` لأمر `docker run`.

##  الحصول على تشغيل اختبار

تحتاج إما إلى [إنشاء][anchor-testrun-creation] تشغيل اختبار أو [نسخ][anchor-testrun-copying] واحد. تعتمد الاختيار على [سيناريو إنشاء تشغيل الاختبار][doc-testing-scenarios] المناسب لك.

### الحصول على معرف سياسة الاختبار

إذا كنت تخطط لاستخدام [سياسة اختبار][doc-testpolicy] خاصة بك، فقم [بإنشاء واحدة][link-wl-portal-new-policy] واحصل على معرف السياسة. بعد ذلك، قم بتمرير المعرف إلى معامل `policy_id` عند إجراء استدعاء لواجهة برمجة تطبيقات لإنشاء أو نسخ تشغيل الاختبار. 

وإلا، إذا اخترت استخدام سياسة الاختبار الافتراضية، فيجب حذف معامل `policy_id` من استدعاء واجهة برمجة التطبيقات.

!!! info "مثال على سياسة الاختبار"
    يحتوي دليل "البدء السريع" على [تعليمات خطوة بخطوة][doc-testpolicy-creation-example] حول كيفية إنشاء سياسة اختبار نموذجية.

### إنشاء تشغيل اختبار

عند إنشاء تشغيل اختبار، يتم أيضًا إنشاء [تسجيل اختبار][doc-testrecord] جديد.

يجب استخدام هذه الطريقة لإنشاء تشغيل الاختبار إذا كان مطلوبًا اختبار تطبيق الهدف مع تسجيل الطلبات الأساسية.

!!! info "كيفية إنشاء تشغيل اختبار"
    يتم وصف هذه العملية بالتفصيل [هنا][doc-create-testrun].

تحتاج عقدة FAST إلى كمية معينة من الوقت بعد إنشاء تشغيل الاختبار لتسجيل الطلبات.

تأكد من جاهزية عقدة FAST لتسجيل الطلبات قبل إرسال أي طلبات إلى تطبيق الهدف باستخدام أداة الاختبار.

للقيام بذلك، تحقق بشكل دوري من حالة تشغيل الاختبار عن طريق إرسال طلب GET إلى العنوان `https://us1.api.wallarm.com/v1/test_run/test_run_id`:

--8<-- "../include/fast/poc/api-check-testrun-status-recording.md"

إذا كان الطلب إلى خادم واجهة برمجة التطبيقات ناجحًا، ستُقدم لك استجابة الخادم. توفر هذه الاستجابة معلومات مفيدة، بما في ذلك حالة عملية التسجيل (قيمة معامل `ready_for_recording`).

إذا كانت قيمة المعامل `true`، فإن عقدة FAST جاهزة للتسجيل ويمكنك تشغيل أداة الاختبار لبدء إرسال الطلبات إلى تطبيق الهدف.

وإلا، أصدر نفس استدعاء واجهة برمجة التطبيقات بشكل متكرر حتى تكون العقدة جاهزة.


### نسخ تشغيل اختبار

عند نسخ تشغيل اختبار، يتم إعادة استخدام [تسجيل اختبار][doc-testrecord] موجود.

يجب استخدام هذه الطريقة لإنشاء تشغيل الاختبار إذا كان مطلوبًا اختبار تطبيق الهدف باستخدام طلبات أساسية مُسجلة مُسبقًا.

!!! info "كيفية نسخ تشغيل اختبار"
    يتم وصف هذه العملية بالتفصيل [هنا][doc-copy-testrun].

بمجرد إنشاء تشغيل اختبار بنجاح، تبدأ عقدة FAST الاختبار على الفور. لا حاجة لاتخاذ أي إجراءات إضافية.

## الخطوات التالية

قد يستغرق عملية الاختبار الكثير من الوقت لاكتمال. استخدم المعلومات من [هذا الوثيقة][doc-waiting-for-tests] لتحديد ما إذا كان قد انتهى الاختبار الأمني مع FAST.

 يمكنك الرجوع إلى وثائق [“النشر عبر واجهة برمجة التطبيقات”][doc-integration-overview-api] أو [“سير عمل CI/CD مع FAST”][doc-integration-overview] إذا لزم الأمر.  