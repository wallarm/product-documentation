حالما تقوم بتحميل السكريبت الشامل، يمكنك الحصول على المساعدة بخصوصه من خلال:

```
sudo sh ./wallarm-4.8.9.x86_64-glibc.sh -- -h
```

الذي يُظهر:

```
...
استخدام: setup.sh [خيارات]... [وسائط]... [تصفية/ما بعد التحليل]

الخيار                      الوصف
-b, --batch                 الوضع الدفعي، تثبيت غير تفاعلي.
    --install-only          يبدأ المرحلة الأولى من المُثبِت الشامل في وضع الدفعة. ينسخ التكوينات الأساسية، بما في ذلك الملفات والثنائيات، ويضبط NGINX لتثبيت العقدة، متجاوزا التسجيل والتفعيل في السحابة. يتطلب --batch.
    --skip-ngx-config       يتجنب التغييرات التلقائية في تكوين NGINX التي تحدث خلال مرحلة --install-only في وضع الدفعة، ملائم للمستخدمين الذين يفضلون التعديلات اليدوية لاحقا. عند استخدامه مع --install-only، يضمن نسخ التكوينات الأساسية فقط دون تغيير إعدادات NGINX. يتطلب --batch.
    --register-only         يبدأ المرحلة الثانية من المُثبِت الشامل في وضع الدفعة، ويكمل الإعداد بتسجيل العقدة في السحابة وبدء خدمتها. يتطلب --batch.
-t, --token TOKEN           رمز العقدة، مطلوب في وضع الدفعة.
-c, --cloud CLOUD           سحابة Wallarm، إحدى US/EU، الافتراضي هو EU، يُستخدم فقط في وضع الدفعة.
-H, --host HOST             عنوان API Wallarm، على سبيل المثال، api.wallarm.com أو us1.api.wallarm.com، يُستخدم فقط في وضع الدفعة.
-P, --port PORT             ميناء API Wallarm، على سبيل المثال، 443.
    --no-ssl                تعطيل SSL لوصول API Wallarm.
    --no-verify             تعطيل التحقق من شهادات SSL.
-f, --force                 إذا كان هناك عقدة بنفس الاسم، قم بإنشاء نسخة جديدة.
-h, --help
    --version
```

### وضع الدفعة

الخيار `--batch` يُطلق **الوضع الدفعي (غير التفاعلي)**، حيث يطلب السكريبت خيارات التكوين عبر الأعلام `--token` و `--cloud`، إلى جانب متغير البيئة `WALLARM_LABELS` إذا لزم الأمر. في هذا الوضع، لا يطلب السكريبت من المستخدم إدخال البيانات خطوة بخطوة كما في الوضع الافتراضي؛ بدلاً من ذلك، يتطلب أوامر صريحة للتفاعل.

أدناه مثال على أوامر تشغيل السكريبت في وضع الدفعة لتثبيت العقدة، بالافتراض أن السكريبت قد تم [تحميله][download-aio-step] بالفعل:

=== "US Cloud"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh -- --batch -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### تنفيذ مراحل تثبيت العقدة على حدة

عند التحضير لصورة الجهاز الخاصة بك باستخدام المُثبِت الشامل لبنية السحابة، قد لا يكفي عملية التثبيت القياسية الموضحة في هذا المقال. بدلاً من ذلك، ستحتاج إلى تنفيذ مراحل معينة من المُثبِت الشامل بشكل منفصل لتلبية متطلبات إنشاء ونشر صورة الجهاز:

1. إنشاء صورة الجهاز: في هذه المرحلة، من الضروري تحميل الثنائيات والمكتبات وملفات التكوين لعقدة التصفية وإنشاء صورة جهاز على أساسها. باستخدام العلم `--install-only`، ينسخ السكريبت الملفات المطلوبة ويعدل تكوينات NGINX لتشغيل العقدة. إذا كنت ترغب في إجراء تعديلات يدوية، يمكنك اختيار تجاوز تعديل ملف NGINX باستخدام العلم `--skip-ngx-config`.
1. تهيئة نموذج السحابة باستخدام cloud-init: خلال تهيئة النموذج، يمكن تنفيذ مرحلة البدء (تسجيل السحابة وبدء الخدمة) باستخدام سكربتات cloud-init. يمكن تشغيل هذه المرحلة بشكل مستقل عن مرحلة البناء باستخدام العلم `--register-only` في السكريبت `/opt/wallarm/setup.sh` الذي تم نسخه خلال مرحلة البناء.

هذه الوظيفة مدعومة بدءًا من الإصدار 4.8.8 من المُثبِت الشامل في وضع الدفعة. الأوامر أدناه تمكّن من التنفيذ العمودي للخطوات الموضحة:

=== "US Cloud"
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
=== "EU Cloud"
    ```
    # إذا كنت تستخدم النسخة x86_64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.x86_64-glibc.sh
    sudo sh wallarm-4.8.9.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.9.aarch64-glibc.sh
    sudo sh wallarm-4.8.9.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

أخيرًا، لإكمال التثبيت، تحتاج إلى [تفعيل Wallarm لتحليل الزيارات][enable-traffic-analysis-step] و[إعادة تشغيل NGINX][restart-nginx-step].

### تثبيت عقد التصفية وما بعد التحليل على حدة

يوفر مفتاح التحويل للتصفية/ما بعد التحليل الخيار لتثبيت وحدة ما بعد التحليل [على حدة][separate-postanalytics-installation-aio]. دون هذا المفتاح، يتم تثبيت كلا من مكونات التصفية وما بعد التحليل معًا بشكل افتراضي.