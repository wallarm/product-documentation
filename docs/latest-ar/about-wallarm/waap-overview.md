# واجهة الحماية السحابية لتطبيقات الويب وAPI

توفر واجهة الحماية السحابية لتطبيقات الويب وAPI من Wallarm حماية متقدمة للتطبيقات وواجهات برمجة التطبيقات في أي بيئة عملاء. WAAP من Wallarm هو جيل جديد من جدار حماية التطبيقات الويب يدعم بروتوكولات API متعددة، مثل REST، SOAP، GraphQL، وغيرها، ويعتمد على تفتيش عميق للباكيتات لتغطية كاملة ل[أوائل العشرة من OWASP](https://owasp.org/www-project-top-ten/) وأكثر. توفر WAAP دقة عالية في الكشف عن [التهديدات المتنوعة](../attacks-vulns-list.md)، بما في ذلك التهديدات اليوم الصفري، وعدد قليل من [الإيجابيات الخاطئة](../about-wallarm/protecting-against-attacks.md#false-positives). هذا يتيح لك حماية بنيتك التحتية بسرعة وفعالية.

![هجوم حسب البروتوكولات](../images/user-guides/dashboard/api-protocols.png)

## المبادئ العامة

يتم التعامل مع حركة المرور بواسطة مكونين: عقد تصفية Wallarm وسحابة Wallarm. يتم نشر عقد تصفية Wallarm في بنية التحتية للعميل وهي مسؤولة عن تحليل حركة المرور وحجب الهجمات. يتم إرسال إحصاءات الهجمات المجمعة إلى سحابة Wallarm للتحليل الإحصائي ومعالجة الأحداث. كما تتولى سحابة Wallarm مسؤولية الإدارة المركزية والتكامل مع أدوات الأمان الأخرى.

![!مخطط العمارة](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

تدعم Wallarm خيارات نشر متنوعة، بما في ذلك السحابة العامة، والنشر داخل المؤسسات، والنشر الكامل كخدمة SaaS، والتكامل مع Kubernetes، وواجهات API للبوابة، وأطراف الأمان، إلخ. يمكن نشر عقد تصفية Wallarm إما [داخل الشبكة](../installation/inline/overview.md) أو [خارج الشبكة](../installation/oob/overview.md)، حسب احتياجاتك وبنيتك التحتية. خيارات تكوين سياسة الأمان المرنة تتيح لك التبديل بسرعة بين وضعيات [المراقبة والحجب](../admin-en/configure-wallarm-mode.md)، مما يزيل الخوف من حجب حركة المرور الشرعية.

## تدابير الحماية

توفر WAAP من Wallarm مجموعة واسعة من تدابير الأمان لحماية التطبيقات الخاصة بك من جميع أنواع التهديدات، بما في ذلك على سبيل المثال لا الحصر:

* الطوابع المحدثة ضد XSS، SQLi، RCE، إلخ.
* التصحيح الافتراضي
* إنشاء كاشفات مخصصة
* [حماية من L7 DDoS](../admin-en/configuration-guides/protecting-against-ddos.md)
* [الحماية من مرتكبي عدة هجمات](../admin-en/configuration-guides/protecting-with-thresholds.md)
* تحديد معدل
* [حماية من الاختراق العنيف](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [حماية من التصفح القسري](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [حماية BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [التصفية حسب المواقع الجغرافية وأنواع المصادر](../user-guides/ip-lists/overview.md)
* تغذية IP الخبيثة

## القدرات الإضافية

بالإضافة إلى حماية التطبيقات، توفر واجهة الحماية السحابية لتطبيقات الويب وAPI من Wallarm القدرة على فحص [الأصول المكشوفة](../user-guides/scanner.md) وتقييم مستوى الأمان. هذا يتيح لك تحديد نقاط الضعف قبل أن يهاجمها المخترقون.

تتيح قدرات [التقارير](../user-guides/dashboards/owasp-api-top-ten.md) المرنة و[التكامل](../user-guides/settings/integrations/integrations-intro.md) مع تطبيقات أخرى لك التعرف بسرعة على التهديدات الناشئة والرد عليها في الوقت المناسب.

يمكن [إضافة](../about-wallarm/subscription-plans.md) قدرات تحليل وحماية API المتقدمة حسب الحاجة.