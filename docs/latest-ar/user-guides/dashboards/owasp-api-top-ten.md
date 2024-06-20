# لوحات "أو وا س بي" العشرة الأعلى في أمن الواجهات البرمجية للتطبيقات

[مشروع OWASP للأمن الأعلى عشر لواجهات البرمجية للتطبيقات](https://owasp.org/www-project-api-security/) هو المعيار الذهبي لتقييم مخاطر الأمان في واجهات البرمجية للتطبيقات. لمساعدتك في قياس موقف أمان الواجهات البرمجية للتطبيقات (APIs) الخاصة بك ضد تهديدات الأمان هذه، تقدم Wallarm لوحات معلومات توفر رؤية واضحة ومقاييس للتقليل من التهديدات.

تغطي لوحات المعلومات المخاطر الأعلى عشر لأمن واجهات البرمجية للتطبيقات حسب OWASP لكلا الإصدارين [2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/) و [2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/).

باستخدام هذه اللوحات، يمكنك تقييم الحالة الأمنية العامة والتعامل بشكل استباقي مع مشكلات الأمان التي تم اكتشافها عن طريق إعداد ضوابط الأمان المناسبة .

![لوحة OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## تقييم التهديد

تقدر Wallarm المخاطر لكل تهديد لواجهة برمجية للتطبيقات على أساس الضوابط الأمنية المطبقة والثغرات الأمنية المكتشفة:

* **الأحمر** - يحدث إذا لم يتم تطبيق أي ضوابط أمنية أو إذا كانت واجهات البرمجية للتطبيقات الخاصة بك لديها ثغرات أمنية عالية الخطورة نشطة.
* **الأصفر** - يحدث إذا تم تطبيق الضوابط الأمنية جزئيًا فقط أو إذا كانت واجهات البرمجية للتطبيقات الخاصة بك لديها ثغرات أمنية نشطة متوسطة أو منخفضة الخطورة.
* **الأخضر** يشير إلى أن واجهات البرمجية للتطبيقات الخاصة بك محمية ولا تمتلك ثغرات أمنية مكتشفة.

لكل تهديد من أعلى عشرة تهديدات لواجهات البرمجية للتطبيقات حسب OWASP يمكنك العثور على معلومات مفصلة حول التهديد، الضوابط الأمنية المتاحة، والثغرات الأمنية المترابطة، والتحقيق في الهجمات ذات الصلة:
![الأعلى عشرة لواجهات البرمجية للتطبيقات حسب OWASP](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## ضوابط الأمان لـ Wallarm لـ OWASP API 2023

توفر منصة الأمان Wallarm حماية كاملة ضد الأعلى عشرة للأمان لواجهات البرمجية للتطبيقات حسب OWASP 2023 عبر الضوابط الأمنية التالية:

| تهديد "أو وا س بي" الأعلى عشرة لواجهات البرمجية للتطبيقات 2023 | ضوابط الأمان في Wallarm |
| ----------------------- | ------------------------ |
| [API1:2023 التفويض المكسور على مستوى الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[التخفيف التلقائي من BOLA](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) لإنشاء مشغلات تلقائيًا لحماية النقاط الطرفية المعرضة للخطر</li></ul> |
| [API2:2023 حذف الدخول المكسر](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li><li>[مشغل القوة الغاشمة](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتقليل من هجمات القوة الغاشمة التي تستهدف نقاط الطرف من الدخول</li></ul> |
| [API3:2023 تفويض مكسر على مستوى خصائص الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li></ul> |
| [API4:2023 استهلاك غير محدود للمصدر](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[مشغل القوة الغاشمة](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتقليل من هجمات القوة الغاشمة والتي غالبًا ما تؤدي إلى نفاد الخدمة، مما يجعل الواجهة البرمجية للتطبيق غير مستجيبة أو غير متاحة حتى</li></ul> |
| [API5:2023 التفويض المكسر على مستوى الوظائف](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li><li>[مشغل التصفح الإجباري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتقليل من محاولات التصفح الإجباري والتي أيضًا طريقة لاستغلال هذا التهديد</li></ul> |
| [API6:2023 الوصول غير المحدود لتدفقات الأعمال الحساسة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[وقائع الإساءة لواجهة البرمجية للتطبيق](../../api-abuse-prevention/overview.md) التي تحد من أعمال البوت الخبيثة</li></ul> |
| [API7:2023 طلب الخادم الجانبي المزور](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li></ul> |
| [API8:2023 التكوين الأمني المكسر](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li><li>Wallarm node self-checks للحفاظ على الإصدارات الحديثة للعقدة والسياسات الأمنية (راجع [كيفية معالجة المشكلات](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 إدارة المخزون غير الصحيحة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[اكتشاف واجهة البرمجية للتطبيق](../../api-discovery/overview.md) لاكتشاف قائمة واجهات البرمجية للتطبيق الحقيقية تلقائيًا استنادًا إلى حركة المرور الحقيقية</li></ul> |
| [API10:2023 الاستهلاك غير الآمن لواجهات البرمجية للتطبيقات](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف الثغرات الأمنية النشطة من النوع المتقابل</li></ul> |
