# إعداد استكشاف واجهة البرمجة التطبيقية <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

تصف هذه المقالة كيفية تمكين وتكوين وتشخيص موديول [استكشاف واجهة البرمجة التطبيقية](overview.md).

## التمكين

يشتمل استكشاف واجهة البرمجة التطبيقية في كل [أشكال](../installation/supported-deployment-options.md) تثبيت عقدة Wallarm، باستثناء الحزم الفردية لـ Debian 11.x وUbuntu 22.04. خلال توظيف العقدة، يتم تثبيت موديول استكشاف واجهة البرمجة التطبيقية ولكن يبقى معطلاً بشكل افتراضي.

لتمكين وتشغيل استكشاف واجهة البرمجة التطبيقية بشكل صحيح:

1. إذا قمت بتثبيت العقدة من الحزم الفردية، تأكد من أن عقدتك Wallarm من [الإصدار المدعوم](../updating-migrating/versioning-policy.md#version-list).

    للتأكد من الوصول دائمًا إلى النطاق الكامل لميزات استكشاف واجهة البرمجة التطبيقية، يوصى بالتحقق من التحديثات لحزمة `wallarm-appstructure` بشكل دوري على النحو التالي:


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. تأكد من أن [خطة الاشتراك](../about-wallarm/subscription-plans.md#subscription-plans) تشتمل على **استكشاف واجهة البرمجة التطبيقية**. لتغيير خطة الاشتراك، يرجى إرسال طلب إلى [sales@wallarm.com](mailto:sales@wallarm.com).
1. في لوحة تحكم Wallarm → **استكشاف واجهة البرمجة التطبيقية** → **تكوين استكشاف واجهة البرمجة التطبيقية**، قم بتفعيل تحليل الحركة مع استكشاف واجهة البرمجة التطبيقية.

بمجرد تمكين موديول استكشاف واجهة البرمجة التطبيقية، سيبدأ تحليل الحركة وبناء جرد واجهة البرمجة التطبيقية. سيتم عرض جرد واجهة البرمجة التطبيقية في قسم **استكشاف واجهة البرمجة التطبيقية** في لوحة تحكم Wallarm.

## التكوين

بالنقر على زر **تكوين استكشاف واجهة البرمجة التطبيقية** في قسم **استكشاف واجهة البرمجة التطبيقية**، تنتقل إلى خيارات الضبط الدقيق لاستكشاف واجهة البرمجة التطبيقية، مثل اختيار التطبيقات لاستكشاف واجهة البرمجة التطبيقية وتخصيص حساب درجة الخطر.

### اختيار التطبيقات لاستكشاف واجهة البرمجة التطبيقية

يمكنك تمكين/تعطيل استكشاف واجهة البرمجة التطبيقية لجميع التطبيقات أو للتطبيقات المحددة فقط:

1. تأكد من إضافة التطبيقات كما هو موضح في مقالة [إعداد التطبيقات](../user-guides/settings/applications.md).

    إذا لم يتم تكوين التطبيقات، تُجمع بنيات جميع واجهات البرمجة التطبيقية في شجرة واحدة.

1. قم بتمكين استكشاف واجهة البرمجة التطبيقية للتطبيقات المطلوبة في لوحة تحكم Wallarm → **استكشاف واجهة البرمجة التطبيقية** → **تكوين استكشاف واجهة البرمجة التطبيقية**.

    ![استكشاف واجهة البرمجة التطبيقية – الإعدادات](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

عند إضافة تطبيق جديد في **الإعدادات** → **[التطبيقات](../user-guides/settings/applications.md)**، يتم إضافته تلقائيًا إلى قائمة التطبيقات لاستكشاف واجهة البرمجة التطبيقية في الحالة **المعطلة**.

### تخصيص حساب درجة الخطر

يمكنك تكوين وزن كل عامل في حساب [درجة الخطر](risk-score.md) وطريقة الحساب.

## التشخيص

للحصول على وتحليل سجلات استكشاف واجهة البرمجة التطبيقية، يمكنك استخدام الطرق التالية:

* إذا تم تثبيت عقدة Wallarm من حزم DEB/RPM الفردية: تشغيل الأداة القياسية **journalctl** أو **systemctl** داخل النسخة.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* إذا تم توظيف عقدة Wallarm من حاوية Docker، صورة آلة Amazon (AMI) أو صورة آلة Google Cloud: قراءة ملف السجل `/opt/wallarm/var/log/wallarm/appstructure-out.log` داخل الحاوية.
* إذا تم توظيف عقدة Wallarm كمتحكم دخول Kubernetes: تحقق من حالة التجميع الذي يعمل فيه حاويات Tarantool و`wallarm-appstructure`. يجب أن تكون حالة التجميع **تعمل**.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    قراءة سجلات حاوية `wallarm-appstructure`:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```