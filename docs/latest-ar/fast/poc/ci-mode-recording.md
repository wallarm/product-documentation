[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

# تشغيل عقدة FAST في وضع التسجيل

في هذا الوضع، تعمل عقدة FAST قبل اختبار تطبيق الهدف.

يتم ضبط مصدر الطلبات لاستخدام عقدة FAST كخادم وكيل وترسل طلبات HTTP أو HTTPS إلى تطبيق الهدف.

تحدد عقدة FAST الطلبات الأساسية من بين المحولة وتضعها في سجل اختبار.

!!! info "متطلبات الفصل"
    لمتابعة الخطوات الموضحة في هذا الفصل، يجب عليك الحصول على [رمز][doc-get-token].
    
    تستخدم القيم التالية كأمثلة طوال هذا الفصل:

    * `token_Qwe12345` كرمز.
    * `rec_0001` كمعرف لسجل الاختبار.

!!! info "تثبيت `docker-compose`"
    سيتم استخدام أداة [`docker-compose`][link-docker-compose] في جميع أنحاء هذا الفصل لتوضيح كيفية تشغيل عقدة FAST في وضع التسجيل.
    
    تتوفر تعليمات التثبيت لهذه الأداة [هنا][link-docker-compose-install].

## المتغيرات البيئية في وضع التسجيل

يتم تكوين عقدة FAST من خلال المتغيرات البيئية. الجدول أدناه يحتوي على جميع المتغيرات البيئية التي يمكن استخدامها لتكوين عقدة FAST في وضع التسجيل.

| المتغير البيئي                 | القيمة  | مطلوب؟ |
|-----------------	| -------	| -------	|
| `WALLARM_API_TOKEN`  	| رمز لعقدة. | نعم |
| `WALLARM_API_HOST`   	| اسم النطاق لخادم API Wallarm المراد استخدامه. <br>القيم المسموح بها: <br>`us1.api.wallarm.com` للاستخدام مع السحابة الأمريكية؛<br>`api.wallarm.com` للاستخدام مع سحابة الاتحاد الأوروبي.| نعم |
| `CI_MODE`            	| وضع تشغيل عقدة FAST. <br>القيمة المطلوبة: `recording`. | نعم |
| `TEST_RECORD_NAME`   	| اسم سجل الاختبار الجديد الذي سيتم إنشاؤه. <br>القيمة الافتراضية بتنسيق مشابه: “TestRecord Oct 08 12:18 UTC”. | لا |
| `INACTIVITY_TIMEOUT` 	| إذا لم تصل الطلبات الأساسية إلى عقدة FAST خلال فترة `INACTIVITY_TIMEOUT`، فيتم إيقاف عملية التسجيل مع عقدة FAST.<br>نطاق القيم المسموح به: من 1 إلى 691200 ثانية (أسبوع واحد)<br>القيمة الافتراضية: 600 ثانية (10 دقائق). | لا |
| `ALLOWED_HOSTS`       | ستسجل عقدة FAST تلك الطلبات التي تستهدف أي مضيف مدرج في المتغير البيئي. <br>القيمة الافتراضية: سلسلة فارغة (سيتم تسجيل جميع الطلبات الواردة). راجع [هذا][doc-allowed-hosts] المستند للتفاصيل.| لا |
| `BUILD_ID` | معرف عملية CI/CD. يسمح هذا المعرف لعدة عقد FAST بالعمل بشكل متزامن باستخدام نفس العقدة السحابية FAST. راجع [هذا][doc-concurrent-pipelines] المستند للتفاصيل.| لا |

!!! info "انظر أيضًا"
    وصف المتغيرات البيئية التي ليست محددة لوضع تشغيل عقدة FAST معين متوفر [هنا][doc-env-variables].

## نشر عقدة FAST في وضع التسجيل

سيتم استخدام ملف تكوين `docker-compose.yaml` كمثال لتوضيح كيفية عمل FAST في وضع التسجيل (لاحظ قيمة المتغير البيئي `CI_MODE`):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # حدد قيمة الرمز هنا
        WALLARM_API_HOST: us1.api.wallarm.com    # يتم هنا استخدام خادم API السحابة الأمريكية. استخدم api.wallarm.com لخادم API السحابة الأوروبية.
        CI_MODE: recording
      ports:
        - '8080:8080'                              
      networks:
        main:
          aliases:
            - fast

networks:
  main:
```

لتشغيل حاوية Docker مع عقدة FAST، انتقل إلى الدليل الذي يحتوي على ملف `docker-compose.yaml` ونفذ الأمر `docker-compose up fast`.

إذا تم تنفيذ الأمر بنجاح، سيتم توليد إخراج للوحة التحكم مشابه للموضح هنا:

```
  __      __    _ _
  \ \    / /_ _| | |__ _ _ _ _ __
   \ \/\/ / _` | | / _` | '_| '  \
    \_/\_/\__,_|_|_\__,_|_| |_|_|_|
             ___ _   ___ _____
            | __/_\ / __|_   _|
            | _/ _ \\__ \ | |
            |_/_/ \_\___/ |_|
 
 Loading...
 [info] Node connected to Wallarm Cloud
 [info] Loaded 0 custom extensions for fast scanner
 [info] Loaded 44 default extensions for fast scanner
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC starts to record

```

هذا الإخراج يبلغنا بأن عقدة FAST قد تم توصيلها بنجاح بسحابة Wallarm وأنشأت سجل اختبار بمعرف `rec_0001` واسم `TestRecord Oct 01 01:01 UTC.` وهي جاهزة لتلقي الطلبات وتسجيل الطلبات الأساسية.

!!! info "ملاحظة حول أسماء سجلات الاختبار"
    لتغيير اسم سجل الاختبار الافتراضي، تحتاج إلى إرسال القيمة اللازمة عبر المتغير البيئي `TEST_RECORD_NAME` عند بدء تشغيل حاوية Docker لعقدة FAST.

!!! warning "تنفيذ الاختبار"
    حان الوقت الآن لإجراء الاختبارات القائمة لتطبيق الهدف. ستسجل FAST الطلبات الأساسية وتملأ سجل الاختبار بها.

## إيقاف وإزالة حاوية Docker مع عقدة FAST في وضع التسجيل

عند تسجيل جميع الطلبات الأساسية اللازمة، سيتم إيقاف عقدة FAST بواسطة أداة CI/CD وتعيد رمز الخروج.

إذا لم تواجه عقدة FAST أية أخطاء وانتهى عملية تسجيل الأساس بنجاح، فإن الرمز `0` للخروج يُعاد.

إذا واجهت عقدة FAST بعض الأخطاء أو تم إيقاف عملية تسجيل الأساس بسبب انتهاء الوقت (انظر وصف المتغير البيئي [`INACTIVITY_TIMEOUT`][anchor-recording-variables])، فإن عقدة FAST تتوقف تلقائيًا ويرجع رمز الخروج `1`.

عندما تنهي عقدة FAST عملها، يجب إيقاف وإزالة حاوية Docker المقابلة.

إذا لم تتوقف عقدة FAST تلقائيًا برمز الخروج `1` وتم تسجيل جميع الطلبات الأساسية المطلوبة، يمكنك إيقاف حاوية Docker لعقدة FAST بتنفيذ الأمر `docker-compose stop <اسم الحاوية>`:

```
docker-compose stop fast
```

لإزالة حاوية عقدة FAST، نفذ الأمر `docker-compose rm <اسم الحاوية>`:

```
docker-compose rm fast
```

في الأمثلة الواردة أعلاه، يستخدم `fast` كاسم لحاوية Docker للإيقاف أو الإزالة.

كبديل، يمكن استخدام الأمر `docker-compose down`، الذي يوقف ويزيل الحاويات لجميع الخدمات الموصوفة في ملف `docker-compose.yaml`.