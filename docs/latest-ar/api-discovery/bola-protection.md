# الحماية التلقائية ضد هجمات BOLA <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

الهجمات السلوكية مثل [التفويض على مستوى الكائن المكسور (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) تستغل ثغرة بنفس الاسم. تسمح هذه الثغرة للمهاجم بالوصول إلى كائن عن طريق المعرف الخاص به عبر طلب API وإما قراءة بياناته أو تعديلها متجاوزًا آلية التفويض.

الأهداف المحتملة لهجمات BOLA هي نهايات الوصول ذات المتغيرات. يمكن لـ Wallarm اكتشاف مثل هذه النهايات تلقائيًا وحمايتها من بين النقاط التي استكشفها وحدة [اكتشاف API](overview.md).

لتفعيل حماية BOLA التلقائية، انتقل إلى وحدة التحكم Wallarm → [**حماية BOLA**](../admin-en/configuration-guides/protecting-against-bola.md) وقم بتحويل المفتاح إلى الحالة المفعلة:

![مشغل BOLA](../images/user-guides/bola-protection/trigger-enabled-state.png)

سيتم تمييز كل نقطة نهاية API محمية بالرمز المناسب في جرد API، مثلاً:

![مشغل BOLA](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

يمكنك تصفية نقاط نهاية API حسب حالة الحماية التلقائية BOLA. المعامل المقابل متاح تحت فلتر **الآخرين**.