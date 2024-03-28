# الحماية التلقائية ضد هجمات BOLA <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

الهجمات السلوكية مثل [التفويض المعطل على مستوى الكائن (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) تستغل نقطة الضعف التي تحمل نفس الاسم. تتيح هذه الثغرة للمهاجم الوصول إلى كائن من خلال معرفه عبر طلب API وإما قراءة بياناته أو تعديلها متجاوزًا آلية التفويض.

الأهداف المحتملة لهجمات BOLA هي النقاط النهائية ذات التغيرات. يمكن لـ Wallarm اكتشاف وحماية هذه النقاط النهائية تلقائيًا من بين تلك التي يستكشفها وحدة [اكتشاف API](overview.md).

لتفعيل الحماية التلقائية ضد BOLA، انتقل إلى لوحة التحكم Wallarm → [**حماية BOLA**](../admin-en/configuration-guides/protecting-against-bola.md) وقم بتحويل المفتاح إلى وضع التفعيل:

![مفتاح BOLA](../images/user-guides/bola-protection/trigger-enabled-state.png)

سيتم تمييز كل نقطة نهاية API محمية بالأيقونة المناسبة في جرد API، على سبيل المثال:

![مفتاح BOLA](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

يمكنك فلترة نقاط نهاية API حسب حالة الحماية التلقائية ضد BOLA. العامل المطابق متاح تحت فلتر **الآخرين**.