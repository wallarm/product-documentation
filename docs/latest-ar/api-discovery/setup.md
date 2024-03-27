# إعداد اكتشاف واجهة برمجة التطبيقات <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

هذا المقال يشرح كيفية تفعيل، ضبط، وتصحيح [اكتشاف واجهة برمجة التطبيقات](overview.md).

## تفعيل

اكتشاف واجهة برمجة التطبيقات متضمن في جميع [أشكال](../installation/supported-deployment-options.md) تثبيت عقدة Wallarm، باستثناء حزم Debian 11.x و Ubuntu 22.04 الفردية. أثناء نشر العقدة، يتم تثبيت وحدة اكتشاف واجهة برمجة التطبيقات ولكن يتم إبقائها معطلة بشكل افتراضي.

لتفعيل وتشغيل اكتشاف واجهة برمجة التطبيقات بشكل صحيح:

1. إذا قمت بتثبيت العقدة من الحزم الفردية، تأكد أن عقدة Wallarm الخاصة بك ضمن [النسخة المدعومة](../updating-migrating/versioning-policy.md#version-list).

    لضمان الوصول دائمًا إلى كامل ميزات اكتشاف واجهة برمجة التطبيقات، يُنصَح بالتحقق بانتظام من التحديثات لحزمة `wallarm-appstructure` على النحو التالي:


    === "ديبيان لينكس"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "ريدهات لينكس"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. تأكد أن [خطة الاشتراك](../about-wallarm/subscription-plans.md#subscription-plans) تشمل **اكتشاف واجهة برمجة التطبيقات**. لتغيير خطة الاشتراك، من فضلك أرسل طلبًا إلى [sales@wallarm.com](mailto:sales@wallarm.com).
1. في وحدة تحكم Wallarm → **اكتشاف واجهة برمجة التطبيقات** → **ضبط اكتشاف واجهة برمجة التطبيقات**، فعّل تحليل الحركة مع اكتشاف واجهة برمجة التطبيقات.

بمجرد تفعيل وحدة اكتشاف واجهة برمجة التطبيقات، ستبدأ في تحليل الحركة وبناء فهرس واجهات برمجة التطبيقات. سيتم عرض الفهرس في قسم **اكتشاف واجهة برمجة التطبيقات** في وحدة تحكم Wallarm.

## ضبط

بالنقر على زر **ضبط اكتشاف واجهة برمجة التطبيقات** في قسم **اكتشاف واجهة برمجة التطبيقات**، تنتقل إلى خيارات ضبط اكتشاف واجهة برمجة التطبيقات، مثل اختيار التطبيقات للاكتشاف وتخصيص حساب درجة المخاطر.

### اختيار التطبيقات لاكتشاف واجهة برمجة التطبيقات

يمكنك تفعيل/تعطيل اكتشاف واجهة برمجة التطبيقات لجميع التطبيقات أو للتطبيقات المحددة فقط:

1. تأكد من إضافة التطبيقات كما هو موضح في المقال [إعداد التطبيقات](../user-guides/settings/applications.md).

    إذا لم يتم ضبط التطبيقات، سيتم تجميع هياكل جميع واجهات برمجة التطبيقات في شجرة واحدة.

1. فعّل اكتشاف واجهة برمجة التطبيقات للتطبيقات المطلوبة في وحدة تحكم Wallarm → **اكتشاف واجهة برمجة التطبيقات** → **ضبط اكتشاف واجهة برمجة التطبيقات**.

    ![إعدادات اكتشاف واجهة برمجة التطبيقات](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

عند إضافة تطبيق جديد في **الإعدادات** → **[التطبيقات](../user-guides/settings/applications.md)**، يتم إضافته تلقائيًا إلى قائمة التطبيقات لاكتشاف واجهة برمجة التطبيقات في الحالة **معطل**.

### تخصيص حساب درجة المخاطر

يمكنك ضبط وزن كل عامل في حساب [درجة المخاطر](risk-score.md) وطريقة الحساب.

## تصحيح

للحصول على وتحليل سجلات اكتشاف واجهة برمجة التطبيقات، يمكنك استخدام الطرق التالية:

* إذا كانت عقدة Wallarm مثبتة من حزم DEM/RPM الفردية: قم بتشغيل الأداة القياسية **journalctl** أو **systemctl** داخل النسخة.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* إذا كانت عقدة Wallarm مُنتشرة من حاوية Docker، صورة آلة أمازون (AMI) أو صورة آلة قوقل كلاود: اقرأ ملف السجل `/opt/wallarm/var/log/wallarm/appstructure-out.log` داخل الحاوية.
* إذا كانت عقدة Wallarm مُنتشرة كوحدة تحكم إنجرس Kubernetes: تحقق من حالة العلبة التي تشغل حاويات Tarantool و`wallarm-appstructure`. يجب أن تكون حالة العلبة **جاري التشغيل**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    اقرأ سجلات حاوية `wallarm-appstructure`:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```