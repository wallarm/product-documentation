بمجرد قيامك بتنزيل السكريبت الشامل، يمكنك الحصول على المساعدة عليه باستخدام:

```
sudo sh ./wallarm-4.10.1.x86_64-glibc.sh -- -h
```

الذي يعيد:

```
...
الاستخدام: setup.sh [الخيارات]... [المعاملات]... [التصفية/ما بعد التحليلات]

الخيار                     الوصف
-b, --batch                وضع الدفعة، التثبيت غير التفاعلي.
    --install-only         يبدأ المرحلة الأولى من المثبت الشامل في وضع الدفعة. ينسخ الإعدادات الأساسية، بما في ذلك الملفات والثنائيات، ويقيم NGINX لتثبيت العقدة، متجاوزًا تسجيل السحاب والتنشيط. يتطلب --batch.
    --skip-ngx-config      يتجنب التعديلات التلقائية لتكوين NGINX التي تحدث أثناء مرحلة --install-only في وضع الدفعة، مناسب للمستخدمين الذين يفضلون التعديلات اليدوية لاحقًا. عند استخدامه مع --install-only، يضمن فقط نسخ الإعدادات الأساسية دون تغيير إعدادات NGINX. يتطلب --batch.
    --register-only        يبدأ المرحلة الثانية من المثبت الشامل في وضع الدفعة، مكملًا الإعداد بتسجيل العقدة في السحاب وبدء خدمتها. يتطلب --batch.
-t, --token TOKEN          رمز العقدة، مطلوب في وضع الدفعة.
-c, --cloud CLOUD          سحاب Wallarm، واحد من US/EU، الافتراضي هو EU، يستخدم فقط في وضع الدفعة.
-H, --host HOST            عنوان API من Wallarm، على سبيل المثال، api.wallarm.com أو us1.api.wallarm.com، يستخدم فقط في وضع الدفعة.
-P, --port PORT            منفذ API من Wallarm، على سبيل المثال، 443.
    --no-ssl               تعطيل SSL للوصول إلى API من Wallarm.
    --no-verify            تعطيل التحقق من شهادات SSL.
-f, --force                إذا كانت هناك عقدة بنفس الاسم، إنشاء نسخة جديدة.
-h, --help
    --version
```

### وضع الدفعة

الخيار `--batch` يفعل **وضع الدفعة (غير التفاعلي)**، حيث يطلب السكريبت خيارات التكوين عبر علامات `--token` و `--cloud`، جنبًا إلى جنب مع متغير البيئة `WALLARM_LABELS` إذا لزم الأمر. في هذا الوضع، لا يطالب السكريبت المستخدم بإدخال البيانات خطوة بخطوة كما في الوضع الافتراضي؛ بدلاً من ذلك، يتطلب أوامر صريحة للتفاعل.

فيما يلي أمثلة على الأوامر لتشغيل السكريبت في وضع الدفعة لتثبيت العقدة، مع الافتراض أن السكريبت قد تم [تنزيله][download-aio-step] بالفعل:

=== "سحاب US"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # إذا كنت تستخدم الإصدار ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "سحاب EU"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN>

    # إذا كنت تستخدم الإصدار ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### تنفيذ مراحل تثبيت العقدة بشكل منفصل

عند تحضير صورة الجهاز الخاصة بك باستخدام المثبت الشامل للبنية التحتية للسحاب، قد لا تكون عملية التثبيت القياسية الموضحة في هذا المقال كافية. بدلاً من ذلك، ستحتاج إلى تنفيذ مراحل محددة من المثبت الشامل بشكل منفصل لتلبية متطلبات إنشاء ونشر صورة الجهاز:

1. بناء صورة الجهاز: في هذه المرحلة، من الضروري تنزيل الثنائيات، والمكتبات، وملفات التكوين لعقدة التصفية وإنشاء صورة الجهاز على أساسها. باستخدام العلامة `--install-only`، ينسخ السكريبت الملفات المطلوبة ويعدل تكوينات NGINX لتشغيل العقدة. إذا كنت ترغب في إجراء تعديلات يدوية، يمكنك اختيار تجاوز تعديل ملف NGINX بالاستعانة بالعلامة `--skip-ngx-config`.
1. تهيئة نسخة سحابية مع cloud-init: خلال تهيئة النسخة، يمكن تنفيذ مرحلة التشغيل (تسجيل السحاب وبدء الخدمة) باستخدام سكريبتات cloud-init. يمكن تشغيل هذه المرحلة بشكل مستقل عن مرحلة البناء بتطبيق العلامة `--register-only` على سكريبت `/opt/wallarm/setup.sh` الذي تم نسخه خلال مرحلة البناء.

هذه الوظيفة مدعومة ابتداءً من الإصدار 4.10.0 من المثبت الشامل في وضع الدفعة. الأوامر أدناه تمكن من التنفيذ التسلسلي للخطوات المذكورة:

=== "سحاب US"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.x86_64-glibc.sh
    sudo sh wallarm-4.10.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # إذا كنت تستخدم الإصدار ARM64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.aarch64-glibc.sh
    sudo sh wallarm-4.10.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "سحاب EU"
    ```
    # إذا كنت تستخدم الإصدار x86_64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.x86_64-glibc.sh
    sudo sh wallarm-4.10.1.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # إذا كنت تستخدم الإصدار ARM64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.1.aarch64-glibc.sh
    sudo sh wallarm-4.10.1.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

وأخيرًا، لإكمال التثبيت، تحتاج إلى [تمكين Wallarm لتحليل حركة المرور][enable-traffic-analysis-step] و [إعادة تشغيل NGINX][restart-nginx-step].

### التثبيت المنفصل لعقد التصفية وما بعد التحليلات

يوفر مفتاح التصفية/ما بعد التحليلات الخيار لتثبيت وحدة ما بعد التحليلات [بشكل منفصل][separate-postanalytics-installation-aio]. بدون هذا المفتاح، يتم تثبيت كلا من مكونات التصفية وما بعد التحليلات معًا بشكل افتراضي.