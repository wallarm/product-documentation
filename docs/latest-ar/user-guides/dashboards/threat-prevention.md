# لوحة معلومات الوقاية من التهديدات

تجمع Wallarm تلقائيًا مقاييس حول الحركة المعالجة وتعرضها في قسم **لوحات المعلومات → الوقاية من التهديدات** في وحدة تحكم Wallarm. تتيح لوحة المعلومات لأي مستخدم تحليل اتجاهات الحركة الشرعية والضارة والحصول على حالة ضعف التطبيقات لفترة زمنية.

تُعرض المقاييس في القطع التالية:

* إحصائيات للشهر الحالي وسرعة مواجهة الطلبات
* الحركة الشرعية والضارة
* أنواع الهجمات
* بروتوكولات API
* مصادر الهجمات
* أهداف الهجوم
* ماسح الثغرات

يمكنك تصفية بيانات القطعة حسب [التطبيقات](../settings/applications.md) والفترة الزمنية. بشكل افتراضي، تُمثل القطع الإحصائيات لجميع التطبيقات للشهر الأخير.

يسمح أي قطعة بفتح [قائمة الأحداث](../events/check-attack.md) التي تم جمع الإحصائيات عنها.

!!! معلومة "البدء باستخدام Wallarm"
    إذا قمت بتسجيل حساب Wallarm في [السحابة](../../about-wallarm/overview.md#cloud) الأمريكية، ستتمكن من استكشاف الميزات الأساسية لـWallarm في **ساحة اللعب** مع الوصول للقراءة فقط إلى أقسام وحدة تحكم Wallarm. استخدمه لتجربة الميزات الرئيسية لمنصة Wallarm دون الحاجة إلى نشر أي مكونات في بيئتك.
    
    تتضمن قسم لوحة المعلومات أيضًا زر **البدء** للمستخدمين الجدد. عند النقر على الزر، ستحصل على قائمة بخيارات اكتشاف المنتج المفيدة ومن بينها:
    
    * خيار **جولة التوجيه** سيوفر لك خيارات النشر المدعومة من Wallarm وروابط إلى تعليمات النشر ذات الصلة.
    * خيار **ساحة لعب Wallarm** سيقوم بتوجيهك إلى ساحة لعب وحدة تحكم Wallarm مع الوصول للقراءة فقط لأقسامها. هذا الخيار متاح فقط لمستخدمي السحابة الأمريكية.

## إحصائيات للشهر الحالي وسرعة مواجهة الطلبات

تعرض القطعة البيانات التالية:

* الحصة الشهرية للطلبات المحددة في [خطة الاشتراك](../../about-wallarm/subscription-plans.md)
* عدد [الضربات](../../about-wallarm/protecting-against-attacks.md#hit) المكتشفة والمحظورة خلال الشهر الحالي
* السرعة الفعلية التي يتم بها مواجهة الطلبات والضربات

![إحصائيات الشهر الحالي](../../images/user-guides/dashboard/current-month-stats.png)

## الحركة الشرعية والضارة لفترة

تعرض القطعة إحصائيات ملخصة للحركة المعالجة خلال الفترة المختارة:

* يمثل الرسم البياني توزيع البيانات على مر الزمن، مما يمكنك من تتبع فترات النشاط الأكثر نشاطًا
* العدد الإجمالي للطلبات المعالجة، [الضربات](../../glossary-en.md#hit)، و[الحوادث](../../glossary-en.md#security-incident)، وعدد الضربات المحظورة
* الاتجاهات: تغير في عدد الأحداث لفترة مختارة ولنفس الفترة السابقة

![الحركة الشرعية والضارة](../../images/user-guides/dashboard/traffic-stats.png)

## أنواع الهجمات

تعرض هذه القطعة [أعلى أنواع الهجمات المكتشفة](../../attacks-vulns-list.md) التي تساعد في تحليل أنماط الحركة الضارة وسلوك المهاجمين.

باستخدام هذه البيانات، يمكنك تحليل قابلية خدماتك لأنواع هجمات مختلفة واتخاذ التدابير المناسبة لتحسين أمن الخدمة.

![أنواع الهجمات](../../images/user-guides/dashboard/attack-types.png)

## بروتوكولات API

تعرض هذه القطعة الإحصائيات حول بروتوكولات API التي يستخدمها المهاجمون. يمكن لـWallarm تحديد بروتوكولات API التالية:

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* JSON-RPC
* WebDAV

باستخدام القطعة، يمكنك تحليل الطلبات الضارة المرسلة عبر بروتوكولات معينة وتقييم قابلية نظامك لمثل هذه الطلبات.

![أنواع الهجمات](../../images/user-guides/dashboard/api-protocols.png)

## CVEs

تعرض قطعة **CVEs** قائمة بأعلى الثغرات الأمنية CVE التي استغلها المهاجمون خلال الإطار الزمني المختار. من خلال تغيير نوع الفرز، يمكنك الاطلاع على أحدث CVEs، وتتبع الـCVEs التي تعرضت للهجوم أكثر.

يتم تقديم كل CVE مع التفاصيل مثل درجة CVSS v3.0، وتعقيد الهجوم، والامتيازات المطلوبة وغيرها المستلمة من [قاعدة بيانات الضعف](https://vulners.com/). الثغرات الأمنية المسجلة قبل عام 2015 لا تُقدم مع درجة CVSS v3.0.

![CVE](../../images/user-guides/dashboard/cves.png)

يمكنك مراجعة نظامك للوقوف على الثغرات البارزة وإذا وُجدت، تنفيذ توصيات التعويض المناسبة للقضاء على خطر استغلال الثغرة.

## التوثيق

تعرض هذه القطعة طرق التوثيق التي استخدمها المهاجمون خلال الإطار الزمني المحدد، مثل:

* API Key
* Basic Auth
* Bearer Token
* Cookie Auth، وغيرها.

![التوثيق](../../images/user-guides/dashboard/authentication.png)

تتيح هذه المعلومات لك حدد طرق التوثيق الضعيفة ومن ثم اتخاذ خطوات وقائية.

## مصادر الهجوم

تعرض هذه القطعة الإحصائيات حول مجموعات مصادر الهجوم:

* المواقع
* الأنواع، مثل Tor، Proxy، VPN، AWS، GCP، وغيرها.

يمكن أن تساعد هذه البيانات في تحديد مصادر الهجوم المسيئة وتمكين حظر الطلبات القادمة منها باستخدام [قوائم العناوين](../ip-lists/overview.md) الرمادية أو قوائم الحظر.

يمكنك عرض بيانات عن كل مجموعة مصادر على علامات التبويب المنفصلة.

![مصادر الهجوم](../../images/user-guides/dashboard/attack-sources.png)

## أهداف الهجوم

تعرض هذه القطعة النطاقات و[التطبيقات](../settings/applications.md) التي تعرضت للهجوم بشكل كبير. يتم عرض المقاييس التالية لكل جسم:

* عدد الحوادث المكتشفة
* عدد الضربات المكتشفة
* الاتجاهات: تغير في عدد الضربات للفترة المختارة ولنفس الفترة السابقة. على سبيل المثال: إذا فحصت الإحصائيات للشهر الأخير، تعرض الاتجاه الفرق في عدد الضربات بين الشهر الأخير والشهر السابق كنسبة مئوية

يمكنك عرض البيانات على النطاقات والتطبيقات على علامات التبويب المنفصلة.

![أهداف الهجوم](../../images/user-guides/dashboard/attack-targets.png)

## ماسح الثغرات

تعرض قطعة الماسح الإحصائيات حول الثغرات المكتشفة في [الأصول العامة](../scanner.md):

* عدد الثغرات من جميع مستويات المخاطر المكتشفة خلال الفترة المختارة
* عدد الثغرات النشطة من جميع مستويات المخاطر في نهاية الفترة المختارة
* التغيرات في عدد الثغرات من جميع مستويات المخاطر للفترة المختارة

![قطعة الماسح](../../images/user-guides/dashboard/dashboard-scanner.png)