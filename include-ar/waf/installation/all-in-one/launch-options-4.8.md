فور تحميل السكريبت المتكامل، يمكنك الحصول على المساعدة به باستخدام:

```
sudo sh ./wallarm-4.8.9.x86_64-glibc.sh -- -h
```

الذي يعيد:

```
...
الاستخدام: setup.sh [خيارات]... [وسيطات]... [تصفية/بعدالتحليل]

الخيار                      الوصف
-b, --batch                 الوضع الدفعي، تثبيت غير تفاعلي.
    --install-only          يبدأ المرحلة الأولى من المثبت المتكامل في الوضع الدفعي. ينسخ الإعدادات الأساسية، بما في ذلك الملفات والثنائيات، ويقوم بإعداد NGINX لتثبيت العقدة، متخطيًا تسجيل وتنشيط السحابة. يتطلب --batch.
    --skip-ngx-config       يتجنب التغييرات التلقائية في تكوين NGINX التي تحدث أثناء مرحلة --install-only في الوضع الدفعي، مناسب للمستخدمين الذين يفضلون التعديلات اليدوية لاحقًا. عند استخدامه مع --install-only، يضمن فقط نسخ الإعدادات الأساسية دون تغيير إعدادات NGINX. يتطلب --batch.
    --register-only         يبدأ المرحلة الثانية من المثبت المتكامل في الوضع الدفعي، مكملاً الإعداد بتسجيل العقدة في السحابة وبدء خدمتها. يتطلب --batch.
-t, --token TOKEN           رمز العقدة، مطلوب في وضع الدفعي.
-c, --cloud CLOUD           سحابة Wallarm، أحد الخيارين US/EU، الافتراضي هو EU، يُستخدم فقط في الوضع الدفعي.
-H, --host HOST             عنوان واجهة برمجة تطبيقات Wallarm، على سبيل المثال، api.wallarm.com أو us1.api.wallarm.com، يُستخدم فقط في الوضع الدفعي.
-P, --port PORT             منفذ واجهة برمجة تطبيقات Wallarm، على سبيل المثال، 443.
    --no-ssl                تعطيل SSL لوصول واجهة برمجة تطبيقات Wallarm.
    --no-verify             تعطيل التحقق من شهادات SSL.
-f, --force                 إذا كانت هناك عقدة بنفس الاسم، قم بإنشاء نسخة جديدة.
-h, --help
    --version
```

### الوضع الدفعي

يتسبب خيار `--batch` بتشغيل الوضع **الدفعي (غير التفاعلي)**، حيث يتطلب السكريبت خيارات الإعداد عبر العلامات `--token` و`--cloud`، إلى جانب متغير البيئة `WALLARM_LABELS` إذا لزم الأمر. في هذا الوضع، لا يطلب السكريبت من المستخدم إدخال البيانات خطوة بخطوة كما في الوضع الافتراضي؛ بل يتطلب أوامر صريحة للتفاعل.

أدناه أمثلة لأوامر تشغيل السكريبت في الوضع الدفعي لتثبيت العقدة، بفرض أن السكريبت قد تم [تحميله][download-aio-step] بالفعل:

=== "سحابة US"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "سحابة EU"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh -- --batch -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### تنفيذ مراحل تثبيت العقدة بشكل منفصل

عند إعداد صورة جهازك الخاص باستخدام المثبت المتكامل لبنية السحابة، قد لا يكفي عملية التثبيت القياسية الموضحة في هذا المقال. بدلاً من ذلك، ستحتاج إلى تنفيذ مراحل معينة من المثبت المتكامل بشكل منفصل للتناسب مع متطلبات إنشاء ونشر صورة جهاز:

1. بناء صورة الجهاز: في هذه المرحلة، من الضروري تحميل الثنائيات، المكتبات، وملفات التكوين لعقدة التصفية وإنشاء صورة جهاز بناءً عليها. باستخدام علامة `--install-only`، يقوم السكريبت بنسخ الملفات المطلوبة وتعديل تكوينات NGINX لتشغيل العقدة. إذا كنت ترغب في إجراء تعديلات يدوية، يمكنك اختيار تجاوز تعديل ملف NGINX عن طريق استخدام علامة `--skip-ngx-config`.
1. تهيئة نسخة سحابية مع cloud-init: خلال تهيئة النسخة، يمكن تنفيذ مرحلة الإعداد الأولي (تسجيل السحابة وبدء الخدمة) باستخدام سكريبتات cloud-init. يمكن تشغيل هذه المرحلة بشكل مستقل عن مرحلة البناء بتطبيق علامة `--register-only` على السكريبت `/opt/wallarm/setup.sh` المنسوخة خلال مرحلة البناء.

هذه الوظيفة مدعومة ابتداءً من الإصدار 4.8.8 للمثبت المتكامل في الوضع الدفعي. الأوامر أدناه تمكن التنفيذ المتتالي للخطوات الموضحة:

=== "سحابة US"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.x86_64-glibc.sh
    sudo sh wallarm-4.8.9.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # إذا كنت تستخدم النسخة ARM64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.aarch64-glibc.sh
    sudo sh wallarm-4.8.9.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "سحابة EU"
    ```
    # إذا كنت تستخدم النسخة x86_64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.x86_64-glibc.sh
    sudo ش wallarm-4.8.9.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.aarch64-glibc.sh
    sudo ش wallarm-4.8.9.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

وأخيرًا، لإكمال التثبيت، تحتاج إلى [تفعيل Wallarm لتحليل الحركة][enable-traffic-analysis-step] و[إعادة تشغيل NGINX][restart-nginx-step].

### تثبيت مكونات التصفية وبعدالتحليل بشكل منفصل

توفر خيارات التبديل للتصفية/بعدالتحليل الخيار لتثبيت وحدة بعدالتحليل [بشكل منفصل][separate-postanalytics-installation-aio]. بدون هذا الخيار، يتم تثبيت كل من مكونات التصفية وبعدالتحليل معًا بشكل افتراضي.