# لوحات تحكم OWASP لأمن واجهة برمجة التطبيقات لأكثر 10 أمور أهمية

معيار [OWASP لأمن واجهة برمجة التطبيقات لأكثر 10 أمور أهمية](https://owasp.org/www-project-api-security/) هو المعيار الذهبي لتقييم مخاطر الأمان في واجهات برمجة التطبيقات. لمساعدتك على قياس موقف أمن واجهة برمجة التطبيقات الخاصة بك ضد هذه التهديدات، تقدم Wallarm لوحات التحكم التي توفر رؤية ومقاييس واضحة للتخفيف من التهديدات.

تغطي لوحات التحكم أهم 10 مخاطر لأمن واجهة برمجة التطبيقات حسب OWASP لكلا الإصدارين [2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/) و [2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/).

باستخدام هذه اللوحات، يمكنك تقييم الحالة الأمنية الإجمالية والتعامل الاستباقي مع مشكلات الأمان المكتشفة من خلال إعداد عناصر تحكم أمنية مناسبة.

=== "لوحة تحكم OWASP لأكثر 10 أمور أهمية في أمن واجهة برمجة التطبيقات لعام 2019"
    ![أكثر 10 أمور أهمية في أمن واجهة برمجة التطبيقات حسب OWASP لعام 2019](../../images/user-guides/dashboard/owasp-api-top-ten-2019-dash.png)
=== "لوحة تحكم OWASP لأكثر 10 أمور أهمية في أمن واجهة برمجة التطبيقات لعام 2023"
    ![أكثر 10 أمور أهمية في أمن واجهة برمجة التطبيقات حسب OWASP لعام 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## تقييم التهديد

تقدر Wallarm المخاطر لكل تهديد في واجهة برمجة التطبيقات بناءً على الرقابة الأمنية المطبقة والثغرات الأمنية المكتشفة:

* **أحمر** - يحدث إذا لم يتم تطبيق أي تحكم أمني أو إذا كانت واجهات برمجة التطبيقات الخاصة بك تمتلك ثغرات أمنية نشطة عالية المخاطر.
* **أصفر** - يحدث إذا تم تطبيق التحكم الأمني جزئيًا فقط أو إذا كانت واجهات برمجة التطبيقات الخاصة بك تمتلك ثغرات أمنية نشطة متوسطة أو منخفضة المخاطر.
* **أخضر** يشير إلى أن واجهات برمجة التطبيقات الخاصة بك محمية ولا تمتلك أي ثغرات أمنية مفتوحة.

بالنسبة لكل تهديد من أهم 10 تهديدات في أمن واجهة برمجة التطبيقات حسب OWASP يمكنك العثور على معلومات مفصلة حول التهديد، والعناصر التحكم الأمنية المتاحة، والثغرات الأمنية المترابطة، والتحقيق في الهجمات ذات الصلة:

![أهم 10 تهديدات لأمن واجهة برمجة التطبيقات حسب OWASP](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## عناصر الرقابة الأمنية Wallarm لـ OWASP API 2019

تقدم منصة الأمان Wallarm الحماية الكاملة ضد أهم 10 مخاطر في أمن واجهة برمجة التطبيقات الخاص بـ OWASP لعام 2019 عبر العناصر التحكم الأمنية التالية:

| التهديدات الأولى من أهم 10 تهديدات لأمن واجهة برمجة التطبيقات حسب OWASP لعام 2019 | عناصر الرقابة الأمنية Wallarm |
| ----------------------- | ------------------------ |
| [API1:2019 تفويض كسر مستوى الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) | <ul><li>[معالجة BOLA التلقائية](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) لإنشاء مشغلات تلقائيا لحماية نقاط النهاية المعرضة للخطر</li></ul> |
| [API2:2019 تفويض الاستخدام مكسر](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa2-broken-user-authentication.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>[مشغل الهجوم القوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من هجمات الهجوم القوي التي تستهدف نقاط النهاية للمصادقة</li></ul> |
| [API3:2019 تعرض بيانات مفرط](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa3-excessive-data-exposure.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li></ul> |
| [API4:2019 نقص الموارد والتحديد المعدل](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[مشغل الهجوم القوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من هجمات الهجوم القوي التي غالبا ما تؤدي إلى خدمة الرفض، مما يجعل واجهة برمجة التطبيقات غير مستجيبة أو حتى غير متاحة</li><li>[منع سوء استخدام واجهة برمجة التطبيقات](../../about-wallarm/api-abuse-prevention.md) التخفيف من الأعمال الخبيثة لروبوتات التي غالبا ما تؤدي إلى خدمة الرفض، مما يجعل واجهة برمجة التطبيقات غير مستجيبة أو حتى غير متاحة</li></ul> |
| [API5:2019 تفويض كسر مستوى الوظيفة](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa5-broken-function-level-authorization.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>[مشغل تصفح قوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من محاولات التصفح القوي التي تعتبر أيضا وسيلة لاستغلال هذا التهديد</li></ul> |
| [API6:2019 تعيين ضخم](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) | <ul><li>يتم اكتشاف هجمات التعيين الضخمة تلقائيا، عناصر الرقابة الأمنية محددة ليست مطلوبة</li></ul> |
| [API7:2019 أعدادات الأمان الخاطئة](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa7-security-misconfiguration.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>عمليات الفحص الذاتي لعقدة Wallarm للحفاظ على أحدث الإصدارات والسياسات الأمنية محدثة (راجع [كيفية معالجة المشكلات](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API8:2019 حقن](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) | <ul><li>يتم اكتشاف الحقن الخبيثة تلقائيا، عناصر الرقابة الأمنية محددة ليست مطلوبة</li></ul> |
| [API9:2019 إدارة الأصول غير الصحيحة](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa9-improper-assets-management.md) | <ul><li>[اكتشاف واجهة برمجة التطبيقات](../../api-discovery/overview.md) لاكتشاف الجرد الفعلى لواجهة برمجة التطبيقات بناءً على حركة المرور الفعلية</li></ul> |
| [API10:2019 التسجيل والمراقبة غير الكافية](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) | <ul><li>[التكاملات مع أنظمة إدارة الأحداث والمعلومات الأمنية، وأدوات الحماية من نقاط النهاية، والمراسلات، إلخ.](../settings/integrations/integrations-intro.md) للحصول على إشعارات وتقارير في الوقت المناسب حول حالة أمان واجهة برمجة التطبيقات الخاصة بك</li></ul> |

## عناصر الرقابة الأمنية Wallarm لـ OWASP API 2023

تقدم منصة الأمان Wallarm الحماية الكاملة ضد أهم 10 مخاطر في أمن واجهة برمجة التطبيقات الخاص بـ OWASP لعام 2023 عبر العناصر التحكم الأمنية التالية:

| التهديدات الأولى من أهم 10 تهديدات لأمن واجهة برمجة التطبيقات حسب OWASP لعام 2023 | عناصر الرقابة الأمنية Wallarm |
| ----------------------- | ------------------------ |
| [API1:2023 تفويض كسر مستوى الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[معالجة BOLA التلقائية](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) لإنشاء مشغلات تلقائيا لحماية نقاط النهاية المعرضة للخطر</li></ul> |
| [API2:2023 تفويض الاستخدام مكسر](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>[مشغل الهجوم القوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من هجمات الهجوم القوي التي تستهدف نقاط النهاية للمصادقة</li></ul> |
| [API3:2023 تفويض كسر مستوى خاصية الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li></ul> |
| [API4:2023 استهلاك غير محدود للموارد](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[مشغل الهجوم القوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من هجمات الهجوم القوي التي غالبا ما تؤدي إلى خدمة الرفض، مما يجعل واجهة برمجة التطبيقات غير مستجيبة أو حتى غير متاحة</li></ul> |
| [API5:2023 تفويض كسر مستوى الوظيفة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>[مشغل تصفح قوي](../../admin-en/configuration-guides/protecting-against-bruteforce.md) للتخفيف من محاولات التصفح القوي التي تعتبر أيضا وسيلة لاستغلال هذا التهديد</li></ul> |
| [API6:2023 وصول غير محدود لتدفقات الأعمال الحساسة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[منع سوء استخدام واجهة برمجة التطبيقات](../../about-wallarm/api-abuse-prevention.md) للتخفيف من الأعمال الخبيثة للروبوتات</li></ul> |
| [API7:2023 تزييف طلبات الخادم](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li></ul> |
| [API8:2023 أعدادات الأمان الخاطئة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li><li>عمليات الفحص الذاتي لعقدة Wallarm للحفاظ على أحدث الإصدارات والسياسات الأمنية محدثة (راجع [كيفية معالجة المشكلات](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 إدارة المخزون غير الصحيحة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[اكتشاف واجهة برمجة التطبيقات](../../api-discovery/overview.md) لاكتشاف الجرد الفعلى لواجهة برمجة التطبيقات بناءً على حركة المرور الفعلية</li></ul> |
| [API10:2023 استهلاك غير آمن لواجهات برمجة التطبيقات](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[ماسح الثغرات الأمنية](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) لاكتشاف ثغرات أمنية نشطة من النوع المقابل</li></ul> |

## مقارنة أهم 10 تهديدات لأمن واجهة برمجة التطبيقات حسب OWASP لعام 2019 و2023

وفقا لمشروع OWASP، فإن التهديدات الأمنية الأكثر أهمية لعام 2023 تشترك إلى حد كبير مع تلك التي تم تحديدها في عام 2019، مع بعض الاستثناءات الجديرة بالذكر:

* تم دمج التهديد [API6:2019 التعيين الضخم](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) مع [API3:2023 تفويض كسر مستوى خاصية الكائن](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md).
* لم يعد التهديد [API8:2019 الحقن](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) مدرجًا على حدة وتم تضمينه في الفئة الجديدة [API10:2023 استهلاك غير آمن لواجهات برمجة التطبيقات](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md).
* تمت إزالة التهديد [API10:2019 التسجيل والمراقبة غير الكافية](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) من أهم 10 تهديدات لأمن واجهة برمجة التطبيقات حسب OWASP.
* تشتمل القائمة الآن على تهديدان جديدان لواجهة برمجة التطبيقات، وهما [API6:2023 الوصول غير المحدود لتدفقات الأعمال الحساسة](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md)، الذي يتعرض للتهديدات الآلية، و [API7:2023 تزييف طلبات الخادم](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md)، مما يشدد على أهمية هذه التهديدات.