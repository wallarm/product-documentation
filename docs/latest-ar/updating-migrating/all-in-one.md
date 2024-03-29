[خدمة-الإحصاءات-كل-المعايير]:        ../admin-en/configure-statistics-service.md
[صورة-الهجمات-في-الواجهة]:             ../images/admin-guides/test-attacks-quickstart.png
[حالة-تارانتول]:                        ../images/tarantool-status.png
[تعليمات-ضبط-البروكسي-الموازن]:      ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[وثائق-الهجوم-بمسار-الارتداد]:           ../attacks-vulns-list.md#path-traversal

# ترقية عقدة Wallarm باستخدام مثبت All-in-One 

تصف هذه التعليمات الخطوات لترقية عقدة Wallarm 4.x المثبتة باستخدام [مثبت الكل في واحد] (../installation/nginx/all-in-one.md) إلى الإصدار 4.10.

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## إجراء الترقية 

إجراء الترقية يختلف حسب طريقة تثبيت وحدات العقدة التصفية وpostanalytics:

* [على نفس الخادم](#filtering-node-and-postanalytics-on-the-same-server): الوحدات تتم ترقيتها جميعًا
* [على خوادم مختلفة](#filtering-node-and-postanalytics-on-different-servers): **أولاً** قم بترقية وحدة postanalytics و**بعد ذلك** وحدة التصفية.

## العقدة التصفية وpostanalytics على نفس الخادم

استخدم الإجراء أدناه لترقية وحدات العقدة التصفية وpostanalytics المثبتة باستخدام مثبت الكل في واحد على نفس الخادم.

### الخطوة 1: إعداد رمز Wallarm Token

لترقية العقدة، ستحتاج إلى رمزWallarm من [أحد الأنواع](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). لإعداد الرمز:

=== "رمز API"
    1. افتح واجهة المستخدم الرسومية لـ Wallarm Console → **الإعدادات** → **رموز API** في [سحابة US](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة EU](https://my.wallarm.com/settings/api-tokens).
    1. ابحث عن رمز API أو قم بإنشاء واحد مع دور المصدر 'Deploy'.
    1. انسخ هذا الرمز.
    
=== "الرمز الخاص بالعقدة"
    للترقية، استخدم نفس رمز العقدة الذي تم استخدامه للتثبيت:
    
    1. افتح واجهة المستخدم الرسومية لـ Wallarm Console → **العُقد** في [سحابة US](https://us1.my.wallarm.com/nodes) أو [سحابة EU](https://my.wallarm.com/nodes).
    1. في مجموعتك الخاصة بالعقدة الحالية، انسخ الرمز باستخدام القائمة التي تظهر بجانب العقدة→ **نسخ الرمز**.

### الخطوة 2: تنزيل أحدث إصدار من مركب Wallarm All-in-One

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 3: تشغيل مركب Wallarm All-in-One

قم بتشغيل السكربت الذي تم تنزيله:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # إذا كنت تستخدم الإصدار ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # إذا كنت تستخدم الإصدار ARM64:
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```

* `<GROUP>` تضبط اسم المجموعة التي ستضاف إليها العقدة (يستخدم لتجميع العقدات من الناحية المنطقية في واجهة المستخدم الرسومية لـ Wallarm Console). يطبق فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز الذي تم نسخه.
* `<CLOUD>` هي سحابة Wallarm التي ستتم فيها تسجيل العقدة الجديدة. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 4: أعد تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### الخطوة 5: اختبر عملية العقدة Wallarm

لاختبار عملية العقدة الجديدة:

1. أرسل الطلب مع طريقة اختبار الهجوم [Path Traversal][وثائق-الهجوم-بمسار-الارتداد] إلى عنوان المورد المحمي:

    ```
    curl http://localhost/etc/passwd
    ```

1. افتح واجهة المستخدم الرسومية لـ Wallarm Console → القسم **الهجمات** في [سحابة US](https://us1.my.wallarm.com/attacks) أو [سحابة EU](https://my.wallarm.com/attacks) وتأكد من عرض الهجمات في القائمة.
1. بمجرد أن يتم مزامنة بيانات السحابة المخزنة (القواعد، قائمة IP) إلى العقدة الجديدة، قم ببعض الهجمات الاختبارية للتأكد من أن القواعد الخاصة بك تعمل كما هو متوقع.

## العقدة التصفية وpostanalytics على خوادم مختلفة

!!! تحذير "تسلسل الخطوات لترقية العقدة التصفية ووحدات postanalytics"
    إذا كانت العقدة التصفية ووحدات postanalytics مثبتة على خوادم مختلفة، فمن الضروري ترقية حزم postanalytics قبل تحديث حزم العقدة التصفية.

### الخطوة 1: إعداد رمز Wallarm Token

لترقية العقدة، ستحتاج إلى رمزWallarm من [أحد الأنواع](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). لإعداد الرمز:

=== "رمز API"
    1. افتح واجهة المستخدم الرسومية لـ Wallarm Console → **الإعدادات** → **رموز API** في [سحابة US](https://us1.my.wallarm.com/settings/api-tokens) أو [سحابة EU](https://my.wallarm.com/settings/api-tokens).
    1. ابحث عن رمز API أو قم بإنشاء واحد مع دور المصدر 'Deploy'.
    1. انسخ هذا الرمز.
    
=== "الرمز الخاص بالعقدة"
    للترقية، استخدم نفس رمز العقدة الذي تم استخدامه للتثبيت:
    
    1. افتح واجهة المستخدم الرسومية لـ Wallarm Console → **العُقد** في [سحابة US](https://us1.my.wallarm.com/nodes) أو [سحابة EU](https://my.wallarm.com/nodes).
    1. في مجموعتك الخاصة بالعقدة الحالية، انسخ الرمز باستخدام القائمة التي تظهر بجانب العقدة→ **نسخ الرمز**.

### الخطوة 2: تنزيل أحدث إصدار من مركب Wallarm All-in-One لجهاز postanalytics

يتم هذا الإجراء على جهاز postanalytics.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 3: تشغيل مركب Wallarm All-in-One لترقية postanalytics

يتم هذا الإجراء على جهاز postanalytics.

=== "رمز API"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # إذا كنت تستخدم الإصدار ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # إذا كنت تستخدم الإصدار ARM64:
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```

* `<GROUP>` تضبط اسم المجموعة التي ستضاف إليها العقدة (يستخدم لتجميع العقدات من الناحية المنطقية في واجهة المستخدم الرسومية لـ Wallarm Console). يطبق فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز الذي تم نسخه.
* `<CLOUD>` هي سحابة Wallarm التي ستتم فيها تسجيل العقدة الجديدة. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 4: تنزيل أحدث إصدار من مركب Wallarm All-in-One لماكينة العقدة التصفية

يتم هذا الخطوة على جهاز العقدة التصفية.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 5: تشغيل مركب Wallarm All-in-One لترقية العقدة التصفية

يتم هذا الخطوة على جهاز العقدة التصفية.

=== "رمز API"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # إذا كنت تستخدم الإصدار ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم الإصدار x86_64:
    sudo sh wallarm-4.10.2.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # إذا كنت تستخدم الإصدار ARM64:
    sudo sh wallarm-4.10.2.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```

* `<GROUP>` تضبط اسم المجموعة التي ستضاف إليها العقدة (يستخدم لتجميع العقدات من الناحية المنطقية في واجهة المستخدم الرسومية لـ Wallarm Console). يطبق فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز الذي تم نسخه.
* `<CLOUD>` هي سحابة Wallarm التي ستتم فيها تسجيل العقدة الجديدة. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 6: التحقق من التفاعل بين وحدات العقدة التصفية وpostanalytics المنفصلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"
