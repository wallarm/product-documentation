[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability-in-endpoints
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# حماية BOLA التلقائية لنقاط النهاية المكتشفة بواسطة استكشاف API <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

يصف هذا المقال الحماية التلقائية لـBOLA لنقاط النهاية التي تم اكتشافها بواسطة [استكشاف API](../../api-discovery/overview.md) (APID).

!!! info "تدابير حماية BOLA الأخرى"
    بالإضافة إلى ذلك، يمكنك تكوين [الحماية من BOLA بواسطة الزناد](protecting-against-bola-trigger.md).

--8<-- "../include/bola-intro.md"

## منطق الحماية

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## التكوين

!!! info "استكشاف API مطلوب"
    الحماية التلقائية من BOLA متاحة إذا كنت تستخدم وحدة **[استكشاف API](../../api-discovery/overview.md)**.

لتفعيل الحماية التلقائية، انتقل إلى وحدة التحكم Wallarm → **حماية BOLA** وحول الزر إلى الحالة المفعلة:

![زناد BOLA](../../images/user-guides/bola-protection/trigger-enabled-state.png)

ثم يمكنك تعديل السلوك الافتراضي لـWallarm بتعديل قالب كشف BOLA التلقائي كما يلي:

* تغيير العتبة للطلبات القادمة من نفس الـIP لتُعد كهجمات BOLA.
* تغيير الرد عند تجاوز العتبة:

    * **إدراج الـIP في القائمة السوداء** - سيقوم Wallarm بـ[إدراج IPs](../../user-guides/ip-lists/overview.md) مصدر هجوم BOLA في القائمة السوداء وبالتالي سيحظر كل الحركة المتولدة من هذه IPs.
    * **إدراج الـIP في القائمة الرمادية** - سيقوم Wallarm بـ[إدراج IPs](../../user-guides/ip-lists/overview.md) مصدر هجوم BOLA في القائمة الرمادية وبالتالي سيحظر فقط الطلبات الضارة القادمة من هذه IPs وفقط إذا كان عقد التصفية في وضع الحظر الآمن [الوضع](../../admin-en/configure-wallarm-mode.md).

![زناد BOLA](../../images/user-guides/bola-protection/trigger-template.png)

## التعطيل

لتعطيل الحماية التلقائية من BOLA، حول الزر إلى الحالة المعطلة في قسم **حماية BOLA**.

بمجرد انتهاء اشتراكك في استكشاف API، يتم تعطيل الحماية التلقائية من BOLA تلقائيًا.