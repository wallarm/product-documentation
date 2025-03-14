# كشف الثغرات الأمنية

بسبب الإهمال أو نقص المعلومات عند بناء أو تنفيذ تطبيق، قد يكون عرضة للهجمات. ستتعلم من هذه المقالة كيفية كشف منصة Wallarm لثغرات التطبيق مما يتيح لك تحسين أمان النظام.

## ما هي الثغرة الأمنية؟

الثغرة الأمنية هي خطأ يحدث بسبب الإهمال أو نقص المعلومات عند بناء أو تنفيذ تطبيق. يمكن استغلال الثغرة الأمنية من قبل المهاجم لتجاوز حدود الصلاحيات (أي أداء أفعال غير مصرح بها) داخل التطبيق.

## طرق كشف الثغرات الأمنية

عند فحص التطبيق بحثًا عن الثغرات الأمنية النشطة، ترسل Wallarm طلبات تحمل علامات الهجمات إلى عنوان التطبيق المحمي وتحلل استجابات التطبيق. إذا كانت الاستجابة تتطابق مع علامة واحدة أو أكثر للثغرة الأمنية المحددة مسبقًا، تسجل Wallarm الثغرة الأمنية النشطة.

على سبيل المثال: إذا كانت الاستجابة للطلب المرسل لقراءة محتويات `/etc/passwd` تعيد محتويات `/etc/passwd`، فإن التطبيق المحمي معرض لهجمات اختراق مسار النظام. ستسجل Wallarm الثغرة الأمنية بالنوع المناسب.

لكشف الثغرات الأمنية في التطبيق، ترسل Wallarm طلبات تحمل علامات الهجمات باستخدام الطرق التالية:

* **الكشف السلبي**: تم العثور على الثغرة بسبب واقعة أمنية حدثت.
* **التحقق من التهديدات النشطة**: يحول المهاجمين إلى اختبارات اختراق لك ويكتشف المشاكل الأمنية المحتملة من نشاطهم عندما يستكشفون تطبيقاتك/APIs بحثًا عن ثغرات. يجد هذا الوحدة الثغرات المحتملة عن طريق استكشاف نقاط النهاية في التطبيق باستخدام بيانات هجمات حقيقية من الحركة. بشكل افتراضي، يتم تعطيل هذه الطريقة.
* **ماسح الثغرات الأمنية**: يتم فحص الأصول المعرضة للشركة بحثًا عن الثغرات النمطية.

### الكشف السلبي

باستخدام الكشف السلبي، تكشف Wallarm ثغرة أمنية بسبب واقعة أمنية حدثت. إذا تم استغلال ثغرة أمنية في التطبيق أثناء هجوم، تسجل Wallarm واقعة الأمان والثغرة الأمنية التي تم استغلالها.

الكشف السلبي عن الثغرات الأمنية مفعل بشكل افتراضي.

### التحقق من التهديدات النشطة

تحول وحدة التحقق من التهديدات النشطة التابعة لـ Wallarm المهاجمين إلى اختبارات اختراق خاصة بك. تُحلل محاولات الهجوم الأولية، ثم تستكشف طرقًا أخرى قد يتم استغلال نفس الهجوم من خلالها. هذا يكشف عن نقاط الضعف في بيئتك والتي حتى المهاجمين الأصليين لم يجدوها. [اقرأ المزيد](../vulnerability-detection/threat-replay-testing/overview.md)

قدرات التحقق من التهديدات النشطة:

* **الاختبار في الوقت الفعلي**: يستخدم بيانات الهجوم الحية لاكتشاف نقاط الضعف الحالية والمستقبلية المحتملة، مما يجعلك خطوة واحدة إلى الأمام من القراصنة.
* **محاكاة آمنة وذكية**: يتجاوز تفاصيل المصادقة الحساسة ويزيل الكود الضار في الاختبارات. يحاكي تقنيات الهجوم للأمان القصوى، دون المخاطرة بالضرر الفعلي.
* **اختبارات غير إنتاجية آمنة**: يتيح لك [إجراء فحوصات الثغرات الأمنية في إعداد تجريبي أو تطوير](../vulnerability-detection/threat-replay-testing/setup.md) باستخدام بيانات الإنتاج الحقيقية، ولكن من دون المخاطر مثل الإفراط في التحميل أو التعرض للبيانات.

الوحدة معطلة بشكل افتراضي. لتفعيلها:

1. تأكد من امتلاكك لخطة اشتراك **الأمان المتقدم للـ API** [خطة الاشتراك](subscription-plans.md#subscription-plans). الوحدة متاحة فقط تحت هذه الخطة.

     إذا كنت تستخدم خطة مختلفة، يرجى الاتصال بفريق [المبيعات لدينا](mailto:sales@wallarm.com) للانتقال إلى الخطة المطلوبة.
1. انتقل إلى وحدة التحكم الخاصة بـ Wallarm → **الثغرات الأمنية** → **تكوين** باتباع الرابط لـ [السحابة الأمريكية](https://us1.my.wallarm.com/vulnerabilities/active?configure=true) أو [السحابة الأوروبية](https://my.wallarm.com/vulnerabilities/active?configure=true)، وقم بتفعيل مفتاح **التحقق من التهديدات النشطة**.

لديك القدرة أيضًا على [ضبط أو تخصيص سلوك الوحدة](../vulnerability-detection/threat-replay-testing/setup.md#enable) لنقاط النهاية المحددة.

### ماسح الثغرات الأمنية

#### كيف يعمل

يفحص ماسح الثغرات الأمنية جميع الأصول المعرضة للشركة بحثًا عن الثغرات النمطية. يرسل الماسح طلبات إلى عناوين التطبيق من عناوين IP ثابتة ويضيف رأس `X-Wallarm-Scanner-Info` إلى الطلبات.

#### التكوين

* يمكن [تفعيل أو تعطيل](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) الماسح في وحدة التحكم الخاصة بـ Wallarm → **الثغرات الأمنية** → **تكوين**. بشكل افتراضي، الماسح مفعل.
* يمكن تكوين قائمة [الثغرات القابلة للكشف](../user-guides/vulnerabilities.md#configuring-vulnerability-detection) بواسطة الماسح في وحدة التحكم الخاصة بـ Wallarm → **الثغرات الأمنية** → **تكوين**. بشكل افتراضي، يكتشف الماسح جميع الثغرات المتاحة.
* يمكن تكوين [حد الطلبات المرسلة من الماسح](../user-guides/scanner.md#limiting-vulnerability-scanning) لكل أصل في وحدة التحكم الخاصة بـ Wallarm → **الماسح** → **تكوين**.
* إذا كنت تستخدم مرافق إضافية (برمجيات أو أجهزة) لتصفية حركة المرور وحجبها تلقائيًا، يُنصح بتكوين قائمة مسموح بها مع [عناوين IP](../admin-en/scanner-addresses.md) لماسح Wallarm. هذا سيسمح لمكونات Wallarm بمسح مواردك بحثًا عن الثغرات الأمنية بسلاسة.

    لا تحتاج إلى إضافة عناوين IP للماسح يدويًا إلى قائمة السماح في Wallarm - ابتداءً من وحدة Wallarm 3.0، تُضاف عناوين IP للماسح تلقائيًا إلى قائمة السماح.

## الإيجابيات الكاذبة

**الإيجابي الكاذب** يحدث عند اكتشاف علامات الهجوم في الطلب المشروع أو عندما يتم تأهيل الكيان المشروع على أنه ثغرة أمنية. [المزيد من التفاصيل حول الإيجابيات الكاذبة في كشف الهجمات →](protecting-against-attacks.md#false-positives)

قد تحدث الإيجابيات الكاذبة في فحص الثغرات الأمنية بسبب خصائص التطبيق المحمي. قد تشير الاستجابات المتشابهة لطلبات متشابهة إلى وجود ثغرة أمنية نشطة في تطبيق محمي واحد وتكون سلوكًا متوقعًا لتطبيق محمي آخر.

إذا تم اكتشاف إيجابي كاذب لثغرة أمنية، يمكنك إضافة علامة مناسبة للثغرة الأمنية في وحدة التحكم الخاصة بـ Wallarm. ستغلق الثغرة الأمنية المعلمة على أنها إيجابي كاذب ولن يتم إعادة فحصها.

إذا كانت الثغرة الأمنية المكتشفة موجودة في التطبيق المحمي ولا يمكن إصلاحها، نوصي بضبط قاعدة [**إنشاء تصحيح افتراضي**](../user-guides/rules/vpatch-rule.md). ستسمح هذه القاعدة بحجب الهجمات التي تستغل نوع الثغرة الأمنية المكتشفة وستلغي خطر وقوع حادث.

## إدارة الثغرات الأمنية المكتشفة

تُعرض جميع الثغرات الأمنية المكتشفة في وحدة التحكم الخاصة بـ Wallarm → قسم **الثغرات الأمنية**. يمكنك إدارة الثغرات الأمنية من خلال الواجهة كما يلي:

* مشاهدة وتحليل الثغرات الأمنية
* تشغيل التحقق من حالة الثغرة الأمنية: لا تزال نشطة أو تم إصلاحها من جانب التطبيق
* إغلاق الثغرات الأمنية أو وسمها كإيجابيات كاذبة

![قسم الثغرات الأمنية](../images/user-guides/vulnerabilities/check-vuln.png)

إذا كنت تستخدم وحدة [**اكتشاف الـ API**](../api-discovery/overview.md) في منصة Wallarm، فإن الثغرات الأمنية مرتبطة بنقاط النهاية لـ API المكتشفة، على سبيل المثال:

![اكتشاف الـ API - درجة الخطر](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

لمزيد من المعلومات حول إدارة الثغرات الأمنية، راجع التعليمات حول [العمل مع الثغرات الأمنية](../user-guides/vulnerabilities.md).

## إشعارات حول الثغرات الأمنية المكتشفة

يمكن لـ Wallarm إرسال إشعارات حول الثغرات الأمنية المكتشفة. يتيح لك ذلك أن تكون على علم بالثغرات الأمنية الجديدة المكتشفة في تطبيقاتك والاستجابة لها على الفور. تشمل الاستجابة للثغرات الأمنية إصلاحها من جانب التطبيق، الإبلاغ عن الإيجابيات الكاذبة وتطبيق التصحيحات ال