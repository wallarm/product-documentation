بمجرد تحميل السكربت المتكامل، يمكنك الحصول على المساعدة عليه باستخدام:

```
sudo sh ./wallarm-4.10.2.x86_64-glibc.sh -- -h
```

الذي يعيد:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 الوضع دفعي، تثبيت غير تفاعلي.
    --install-only          يبدأ المرحلة الأولى من المثبت المتكامل في الوضع الدفعي. ينسخ الإعدادات الأساسية، بما في ذلك الملفات والثنائيات، ويقوم بإعداد NGINX لتثبيت العقدة، متجاوزاً تسجيل وتفعيل السحابة. يتطلب --batch.
    --skip-ngx-config       يتجنب التغييرات التلقائية في إعدادات NGINX التي تحدث أثناء مرحلة --install-only في الوضع الدفعي، مناسب للمستخدمين الذين يفضلون التعديلات اليدوية لاحقاً. عند استخدامه مع --install-only، يضمن نسخ الإعدادات الأساسية فقط بدون تغيير إعدادات NGINX. يتطلب --batch.
    --register-only         يبدأ المرحلة الثانية من المثبت المتكامل في الوضع الدفعي، مكملاً الإعداد بتسجيل العقدة في السحابة وبدء خدمتها. يتطلب --batch.
-t, --token TOKEN           رمز العقدة، مطلوب في الوضع الدفعي.
-c, --cloud CLOUD           سحابة Wallarm، إحدى US/EU، الافتراضي هو EU، يُستخدم فقط في الوضع الدفعي.
-H, --host HOST             عنوان واجهة برمجة تطبيقات Wallarm، على سبيل المثال، api.wallarm.com أو us1.api.wallarm.com، يُستخدم فقط في الوضع الدفعي.
-P, --port PORT             منفذ واجهة برمجة تطبيقات Wallarm، على سبيل المثال، 443.
    --no-ssl                تعطيل SSL للوصول إلى واجهة برمجة تطبيقات Wallarm.
    --no-verify             تعطيل التحقق من شهادات SSL.
-f, --force                 إذا كانت هناك عقدة بنفس الاسم، إنشاء نسخة جديدة.
-h, --help
    --version
```

### الوضع الدفعي

الخيار `--batch` يُفعّل الوضع **الدفعي (غير التفاعلي)**، حيث يتطلب السكربت خيارات الإعداد عبر العلامات `--token` و `--cloud`، بالإضافة إلى متغير البيئة `WALLARM_LABELS` إذا لزم الأمر. في هذا الوضع، لا يطلب السكربت من المستخدم إدخال البيانات خطوة بخطوة كما في الوضع الافتراضي؛ بدلاً من ذلك، يتطلب أوامر صريحة للتفاعل.

أدناه أمثلة لأوامر تشغيل السكربت في الوضع الدفعي لتثبيت العقدة، بالافتراض أن السكربت قد تم [تحميله][download-aio-step]:

=== "سحابة الولايات المتحدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "سحابة الاتحاد الأوروبي"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### تنفيذ مراحل تثبيت العقدة بشكل منفصل

عند تحضير صورة الجهاز الخاصة بك باستخدام المثبت المتكامل لبنية السحابة، قد لا يكفي عملية التثبيت القياسية الموضحة في هذا المقال. بدلاً من ذلك، سيكون عليك تنفيذ مراحل محددة من المثبت المتكامل بشكل منفصل لتلبية متطلبات إنشاء ونشر صورة الجهاز:

1. بناء صورة الجهاز: في هذه المرحلة، من الضروري تحميل الثنائيات والمكتبات وملفات التكوين لعقدة التصفية وإنشاء صورة الجهاز استناداً إليها. باستخدام العلم `--install-only`، يقوم السكربت بنسخ الملفات المطلوبة وتعديل إعدادات NGINX لتشغيل العقدة. إذا كنت ترغب في إجراء تعديلات يدوية، يمكنك اختيار تجاوز تعديل ملف NGINX باستخدام العلم `--skip-ngx-config`.
1. تهيئة نسخة سحابية باستخدام cloud-init: خلال تهيئة النسخة، يمكن تنفيذ مرحلة التمهيد (تسجيل السحابة وبدء الخدمة) باستخدام سكربتات cloud-init. يمكن تشغيل هذه المرحلة بشكل مستقل عن مرحلة البناء باستخدام العلم `--register-only` على السكربت `/opt/wallarm/setup.sh` المنسوخ خلال مرحلة البناء.

هذه الوظيفة مدعومة بدءاً من الإصدار 4.10.0 من المثبت المتكامل في الوضع الدفعي. تُمكّن الأوامر أدناه من تنفيذ الخطوات الموضحة بتسلسل:

=== "سحابة الولايات المتحدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.x86_64-glibc.sh
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # إذا كنت تستخدم النسخة ARM64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.aarch64-glibc.sh
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "سحابة الاتحاد الأوروبي"
    ```
    # إذا كنت تستخدم النسخة x86_64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.x86_64-glibc.sh
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # إذا كنت تستخدم النسخة ARM64:
    curl -O https://meganode.wallarm.com/4.10/wallarm-4.10.2.aarch64-glibc.sh
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

أخيراً، لإكمال التثبيت، تحتاج إلى [تمكين Wallarm لتحليل الحركة][enable-traffic-analysis-step] و[إعادة تشغيل NGINX][restart-nginx-step].

### تثبيت عقد التصفية وما بعد التحليلات بشكل منفصل

يوفر خيار التبديل filtering/postanalytics الخيار لتثبيت وحدة ما بعد التحليلات [بشكل منفصل][separate-postanalytics-installation-aio]. بدون هذا الخيار، يتم تثبيت كل من مكونات التصفية وما بعد التحليلات معًا بشكل افتراضي.