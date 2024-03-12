[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[tarantool-status]:                         ../images/tarantool-status.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# تحديث عقدة Wallarm بمقتنيات مثبت كل شيء في الواحد

هذه التعليمات توصف الخطوات لتحديث عقدة Wallarm 4.x المثبتة باستخدام [مثبت كل شيء في الواحد](../installation/nginx/all-in-one.md) إلى الإصدار 4.10.

## المتطلبات

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## إجراء التحديث

يختلف إجراء التحديث بناءً على كيفية تثبيت وحدات تصفية العقد وتحليلات ما بعد:

* [على نفس الخادم](#filtering-node-and-postanalytics-on-the-same-server): يتم تحديث الوحدات معاً
* [على خوادم مختلفة](#filtering-node-and-postanalytics-on-different-servers): **أولاً** قم بتحديث وحدة تحليلات ما بعد ثم **بعد ذلك** قم بتحديث وحدة التصفية

## وحدة التصفية وتحليلات ما بعد على نفس الخادم

استخدم الإجراءات أدناه لتحديث وحدات تصفية العقد وتحليلات ما بعد المثبتة باستخدام مثبت كل شيء في الواحد على نفس الخادم.

### الخطوة 1: إعداد رمز Wallarm

لتحديث العقدة، ستحتاج إلى رمز Wallarm من [أحد الأنواع](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). لإعداد الرمز:

=== "رمز API"

    1. افتح واجهة Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.

=== "رمز العقدة"

    للتحديث، استخدم نفس رمز العقدة الذي تم استخدامه للتثبيت:

    1. افتح واجهة Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. في مجموعة العقد الموجودة لديك، انسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.

### الخطوة 2: تنزيل أحدث نسخة من مثبت Wallarm الشامل

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 3: تشغيل مثبت Wallarm الشامل

قم بتشغيل السكريبت المنزَل:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f
    ```

* `<GROUP>` يحدد اسم المجموعة التي سيتم إضافة العقدة إليها (يُستخدم لتجميع العقد بشكل منطقي في واجهة مستخدم Wallarm Console). يُطبق فقط عند استخدام رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.
* `<CLOUD>` هي سحابة Wallarm التي سيتم تسجيل العقدة الجديدة فيها. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 4: إعادة تشغيل NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### الخطوة 5: اختبار تشغيل عقدة Wallarm

لتجربة تشغيل العقدة الجديدة:

1. أرسل طلب مع هجوم اختبار [تجاوز المسار][ptrav-attack-docs] إلى عنوان مورد محمي:

    ```
    curl http://localhost/etc/passwd
    ```

1. افتح واجهة Wallarm Console → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجمات في القائمة.
1. حالما يتم مزامنة بياناتك المخزنة بالسحابة (القواعد، قوائم ال IP) إلى العقدة الجديدة، قم بإجراء بعض الهجمات الاختبارية للتأكد من أن قواعدك تعمل كما هو متوقع.

## وحدة التصفية وتحليلات ما بعد على خوادم مختلفة

!!! warning "تسلسل الخطوات لتحديث وحدة التصفية وتحليلات ما بعد"
    إذا تم تثبيت وحدة التصفية وتحليلات ما بعد على خوادم مختلفة، فمن الضروري تحديث حزم تحليلات ما بعد قبل تحديث حزم وحدة التصفية.

### الخطوة 1: إعداد رمز Wallarm

لتحديث العقدة، ستحتاج إلى رمز Wallarm من [أحد الأنواع](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation). لإعداد الرمز:

=== "رمز API"

    1. افتح واجهة Wallarm Console → **الإعدادات** → **رموز API** في [السحابة الأمريكية](https://us1.my.wallarm.com/settings/api-tokens) أو [السحابة الأوروبية](https://my.wallarm.com/settings/api-tokens).
    1. ابحث أو أنشئ رمز API بدور المصدر `Deploy`.
    1. انسخ هذا الرمز.

=== "رمز العقدة"

    للتحديث، استخدم نفس رمز العقدة الذي تم استخدامه للتثبيت:

    1. افتح واجهة Wallarm Console → **العقد** في [السحابة الأمريكية](https://us1.my.wallarm.com/nodes) أو [السحابة الأوروبية](https://my.wallarm.com/nodes).
    1. في مجموعة العقد الموجودة لديك، انسخ الرمز باستخدام قائمة العقدة → **نسخ الرمز**.

### الخطوة 2: تنزيل أحدث نسخة من مثبت Wallarm الشامل إلى جهاز تحليلات ما بعد

تتم هذه الخطوة على جهاز تحليلات ما بعد.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 3: تشغيل مثبت Wallarm الشامل لتحديث تحليلات ما بعد

تتم هذه الخطوة على جهاز تحليلات ما بعد.

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f postanalytics
    ```

* `<GROUP>` يحدد اسم المجموعة التي سيتم إضافة العقدة إليها (يُستخدم لتجميع العقد بشكل منطقي في واجهة مستخدم Wallarm Console). يُطبق فقط عند استخدام رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.
* `<CLOUD>` هي سحابة Wallarm التي سيتم تسجيل العقدة الجديدة فيها. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 4: تنزيل أحدث نسخة من مثبت Wallarm الشامل إلى جهاز وحدة التصفية

تتم هذه الخطوة على جهاز وحدة التصفية.

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### الخطوة 5: تشغيل مثبت Wallarm الشامل لتحديث وحدة التصفية

تتم هذه الخطوة على جهاز وحدة التصفية.

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```
=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.10.1.x86_64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.10.1.aarch64-glibc.sh -- --batch -t <TOKEN> -c <CLOUD> -f filtering
    ```

* `<GROUP>` يحدد اسم المجموعة التي سيتم إضافة العقدة إليها (يُستخدم لتجميع العقد بشكل منطقي في واجهة مستخدم Wallarm Console). يُطبق فقط عند استخدام رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.
* `<CLOUD>` هي سحابة Wallarm التي سيتم تسجيل العقدة الجديدة فيها. يمكن أن تكون إما `US` أو `EU`.

### الخطوة 6: التحقق من التفاعل بين وحدة التصفية وتحليلات ما بعد المنفصلة

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"