# WAAP/WAF

وولارم كلاود-نيتيف WAAP (حماية تطبيقات الويب وواجهات البرمجة) بتوفر حماية متقدمة للتطبيقات وواجهات البرمجة في أي بيئة للعميل. WAAP بتاع وولارم هو جيل جديد من ال WAF (جدار حماية تطبيقات الويب) اللي بيدعم بروتوكولات واجهات البرمجة المتعددة، زي REST, SOAP, GraphQL, وغيرها، وبيعتمد على فحص الباكت بعمق علشان يغطي [أهم 10 مخاطر من OWASP](https://owasp.org/www-project-top-ten/) وأكتر. WAAP بيقدم دقة عالية في اكتشاف [التهديدات المختلفة](../attacks-vulns-list.md)، بما في ده الصفر-ديز، وعدد قليل من [الإيجابيات الكاذبة](../about-wallarm/protecting-against-attacks.md#false-positives). ده بيسمح لك بحماية بنيتك التحتية بسرعة وفعالية.

![هجمات عبر بروتوكولات](../images/user-guides/dashboard/api-protocols.png)

## مبادئ عامة

الترافيك بيتم التعامل معاه عن طريق مكونين: عقد التصفية من وولارم وسحابة وولارم. عقد التصفية من وولارم بتتوزع في بنية العميل التحتية وبتكون مسؤولة عن تحليل الترافيك ومنع الهجمات. إحصائيات الهجوم المجمعة بتتبعت لسحابة وولارم للتحليل الإحصائي ومعالجة الأحداث. سحابة وولارم كمان مسؤولة عن الإدارة المركزية والتكامل مع أدوات الأمان الأخرى.

![!مخطط الأرشيف 1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

وولارم بيدعم خيارات توزيع متنوعة، بما في ده السحابة العامة، والتوزيعات المحلية، وال SaaS كامل، والتكامل مع Kubernetes، Gateway APIs، Security Edges، وغيرها. عقد التصفية من وولارم يمكن توزيعها إما [بطريقة مباشرة](../installation/inline/overview.md) أو [خارج السلسلة](../installation/oob/overview.md)، حسب احتياجاتك وبنيتك التحتية. خيارات تكوين السياسة الأمنية المرنة تسمح لك بالتحويل السريع بين [الأوضاع](../admin-en/configure-wallarm-mode.md) من المراقبة إلى المنع، بدون خوف من منع الترافيك الشرعي.

## تدابير الحماية

WAAP من وولارم بيوفر مجموعة واسعة من تدابير الأمان لحماية تطبيقاتك من جميع أنواع التهديدات، مش بس بالمحدود لـ:

* طوابع محدثة ضد XSS, SQLi, RCE، وغيرها.
* التصحيح الافتراضي
* إنشاء كاشفات مخصصة
* [حماية DDoS للطبقة 7](../admin-en/configuration-guides/protecting-against-ddos.md)
* [حماية من مرتكبي الهجمات المتعددة](../admin-en/configuration-guides/protecting-with-thresholds.md)
* تحديد المعدل
* [حماية ضد القوة الغاشمة](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [حماية ضد التصفح القسري](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [حماية BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [التصفية حسب المواقع الجغرافية وأنواع المصادر](../user-guides/ip-lists/overview.md)
* خلاصات IPs الضارة

## قدرات إضافية

بالإضافة لحماية التطبيقات، وولارم كلاود-نيتيف WAAP بتقدم قدرات لفحص [الأصول المعرضة للخطر](../user-guides/scanner.md) وتقييم مستوى الأمان. ده بيسمح لك بتحديد الثغرات قبل ما المخترقين يهاجموها.

قدرات التقرير المرنة [للتقارير](../user-guides/dashboards/owasp-api-top-ten.md) و[التكامل](../user-guides/settings/integrations/integrations-intro.md) مع تطبيقات أخرى بتسمح لك بالتعرف بسرعة على التهديدات الظاهرة والرد عليها في الوقت المناسب.

القدرات المتقدمة في الحماية وتحليل واجهات البرمجة ممكن [تزاد](../about-wallarm/subscription-plans.md) حسب الحاجة.