# أفضل الممارسات لتنفيذ وصيانة حلول Wallarm

يصاغ هذا المقال أفضل الممارسات لتنفيذ وصيانة حلول Wallarm.

## فهم قوة NGINX

تستخدم غالبية خيارات تنفيذ عقدة الترشيح Wallarm NGINX كخادم الوكيل العكسي (الأساس لوحدة Wallarm)، التي توفر مجموعة واسعة من الوظائف القابلة للتنفيذ، والأقسام الفرعية، ودلائل الأداء/الأمان. فيما يأتي مجموعة من المقالات المفيدة على الإنترنت:

* [رائع NGINX](https://github.com/agile6v/awesome-nginx)
* [عرض شرائح الأساسيات وأفضل الممارسات لـ NGINX](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [كيفية تحسين تكوين NGINX](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 خطوات سريعة لتحسين أداء خادم NGINX الخاص بك](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [كيفية بناء خادم NGINX قوي في 15 خطوة](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [كيفية ضبط وتحسين أداء خادم الويب NGINX](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [طرق قوية لشحذ خادم NGINX الخاص بك وتحسين أدائه](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [أفضل الممارسات في تنفيذ TLS](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [دليل تأمين وتعزيز أمان خادم الويب NGINX](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [ضبط NGINX للحصول على أفضل أداء](https://github.com/denji/nginx-tuning)
* [أفضل 25 ممارسة أمان لخادم الويب NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## اتبع الخطوات الموصى بها للتشغيل

1. تعرف على خيارات تنفيذ عقدة Wallarm المتاحة (../installation/supported-deployment-options.md).
2. تعرف على الخيارات المتاحة لإدارة تكوين عقدة Wallarm بشكل منفصل لبيئاتك (../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) (إذا كان ذلك ضروريًا).
3. نفذ عقد الترشيح Wallarm في بيئاتك غير المنتجة مع تعيين [وضع التشغيل](../admin-en/configure-wallarm-mode.md) على `monitoring`.
4. تعرف على كيفية التشغيل والتحجيم ومراقبة حل Wallarm، وتأكيد استقرار العنصر الشبكي الجديد.
5. نفذ عقد الترشيح Wallarm في بيئتك الإنتاجية مع تعيين [وضع التشغيل](../admin-en/configure-wallarm-mode.md) على `monitoring`.
6. قم بتنفيذ إدارة التكوين السليم و[عمليات المراقبة](#enable-proper-monitoring-of-the-filtering-nodes) للمكون Wallarm الجديد.
7. حافظ على تدفق المرور عبر عقد الترشيح في جميع بيئاتك (بما في ذلك الاختبار والإنتاج) لمدة 7-14 يومًا لإعطاء الواجهة الخلفية القائمة على السحابة من Wallarm بعض الوقت للتعرف على تطبيقك.
8. قم بتنشيط وضع "block" لـ Wallarm في جميع بيئاتك غير المنتجة واستخدم الاختبارات الآلية أو اليدوية للتأكيد أن التطبيق المحمي يعمل كما هو متوقع.
9. قم بتمكين وضع "block" لـ Wallarm في بيئة الإنتاج واستخدم الطرق المتاحة لتأكيد أن التطبيق يعمل كما هو متوقع.

## قم بتنفيذ عقد الترشيح ليس فقط في بيئة الإنتاج ولكن أيضًا في الاختبار والتجهيز

لا تحدود معظم عقود خدمة Wallarm عدد عقد Wallarm التي يمكن تنفيذها من قبل العميل، لذا لا يوجد سبب لعدم تنفيذ عقد الترشيح في جميع بيئاتك، بما في ذلك التطوير، الاختبار، التجهيز، إلخ.

بتنفيذ واستخدام عقد الترشيح في جميع مراحل نشاطات التطوير و/أو تشغيل الخدمات البرمجية، لديك فرصة أفضل لاختبار جميع بيانات التدفق بشكل صحيح والتقليل من خطر أي حالات غير متوقعة في بيئة الإنتاج الحرجة الخاصة بك.

## تمكين مكتبة libdetection

يُحسِّن تحليل الطلبات باستخدام [مكتبة **libdetection**](protecting-against-attacks.md#library-libdetection) بشكل كبير قدرة عقدة الترشيح على اكتشاف هجمات SQLi. يوصى بشدة لجميع عملاء Wallarm بالترقية (/updating-migrating/general-recommendations/) إلى أحدث إصدار من برمجيات عقدة الترشيح والحفاظ على مكتبة **libdetection** مفعلة.

* في إصدار 4.4 من عقدة الترشيح والإصدارات الأعلى، يتم تمكين **libdetection** بشكل افتراضي.
* في الإصدارات الأقل، يُوصى بتمكينه باستخدام [النهج](protecting-against-attacks.md#managing-libdetection-mode) لخيار تنفيذك.

## قم بتكوين تقارير صحيحة لعناوين IP للمستخدم النهائي

بالنسبة لعقد ترشيح Wallarm الموجودة خلف الموازن أو CDN، يرجى التأكد من تكوين عقد الترشيح الخاصة بك للإبلاغ بشكل صحيح عن عناوين IP للمستخدم النهائي (وإلا فإن القائمة IP ، [التحقق من التهديد النشط](detecting-vulnerabilities.md#active-threat-verification) ، وبعض الميزات الأخرى لن تعمل):

* [تعليمات لعقد Wallarm القائمة على NGINX](../admin-en/using-proxy-or-balancer-en.md) (بما في ذلك صور AWS / GCP وحاوية العقدة Docker)
* [تعليمات لعقد الترشيح التي تم تنفيذها كمراقب وصول Wallarm لـ Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## قم بتمكين المراقبة السليمة لعقد الترشيح

من القدر العالي من الأفضلية تمكين المراقبة الصحيحة لعقد ترشيح Wallarm. يجمع الخدمة `collectd` المثبتة مع كل عقدة ترشيح Wallarm القياسات المدرجة في ال[رابط](../admin-en/monitoring/available-metrics.md).

طريقة إعداد مراقبة عقدة الترشيح تعتمد على خيار تنفيذها:

* [تعليمات لعقد Wallarm القائمة على NGINX](../admin-en/monitoring/intro.md) (بما في ذلك صور AWS / GCP وsidecars Kubernetes)
* [تعليمات لعقد الترشيح التي تم تنفيذها كمراقب وصول Wallarm لـ Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [تعليمات لصورة Docker القائمة على NGINX](../admin-en/installation-docker-en.md#monitoring-configuration)

## قم بتنفيذ الوظائف المتكررة السليمة ووظائف الفشل التلقائي

مثل كل مكون آخر حرج في بيئة الإنتاج الخاصة بك، يجب أن تتم تصميم وتنفيذ وتشغيل عقد Wallarm بالمستوى السليم من التكرار والفشل التلقائي. يجب أن يكون لديك **على الأقل عقدتين ترشيح Wallarm نشطتين** تتعاملان مع طلبات المستخدمين النهائيين الحرجة. توفر المقالات التالية معلومات ذات صلة حول الموضوع:

* [تعليمات لعقد Wallarm القائمة على NGINX](../admin-en/configure-backup-en.md) (بما في ذلك صور AWS / GCP، حاوية عقدة Docker، وsidecars Kubernetes)
* [تعليمات لعقد الترشيح التي تم تنفيذها كمراقب وصول Wallarm لـ Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## تعرف على كيفية استخدام قائمة السماح بالعناوين IP، وقائمة الرفض، والقائمة الرمادية

بالإضافة إلى حظر الطلبات الخبيثة الفردية، يمكن أيضًا لعقد الترشيح Wallarm حظر عناوين IP فردية للمستخدمين النهائيين. يتم تكوين قواعد حظر IPs باستخدام قوائم السماح، والقوائم السوداء والقوائم الرمادية.

[مزيد من التفاصيل حول استخدام قوائم IP →](../user-guides/ip-lists/overview.md)

## تعرف على كيفية تنفيذ التغييرات التكوينية لـ Wallarm بشكل تدريجي

* استخدم سياسات إدارة التغييرات DevOps القياسية والتوزيع التدريجي للتغييرات التكوينية ذات المستوى المنخفض لعقد الترشيح Wallarm في جميع الأشكال.
* بالنسبة لقواعد ترشيح المرور، استخدم مجموعة مختلفة من الأعداد التعريفية للتطبيقات (ID).
* للقاعدة [إنشاء مؤشر هجوم معتمد على عبارات الرجوع](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) ، بالإضافة إلى القدرة المذكورة أعلاه لربطها بمعرف تطبيق معين، يمكن تمكينها في وضع المراقبة (مربع "Experimental") حتى عند تشغيل عقدة Wallarm في وضع الحظر.
* القاعدة [Set filtration mode](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console) يسمح بالتحكم في وضع التشغيل لعقدة Wallarm (`monitoring `، `safe_blocking` أو `block`) من وحدة تحكم Wallarm، بنفس طريقة ضبط [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) في تكوين NGINX (حسب تواجد `wallarm_mode_allow_override`).

## قم بتكوين التكاملات المتاحة لتلقي الإشعارات من النظام

يوفر Wallarm [تكاملات أصلية](../user-guides/settings/integrations/integrations-intro.md) مع Slack، Telegram، PagerDuty، Opsgenie وأنظمة أخرى لإرسال إشعارات أمان مختلفة تم إنشاؤها من قبل النظام بسرعة الى داخل النظام، على سبيل المثال:

* الثغرات الأمنية الكشف عنها حديثا
* التغييرات في الشبكة الخاصة بالشركة
* المستخدمون المضافين حديثًا إلى حساب الشركة عبر وحدة تحكم Wallarm، إلخ

يمكنك أيضًا استخدام وظيفة [المشغلات](../user-guides/triggers/triggers.md) لإعداد تنبيهات مخصصة حول الأحداث المختلفة التي تحدث في النظام.

## تعرف على قوة وظيفة المشغلات

اعتمادًا على بيئتك المحددة، نوصي بتكوين [المشغلات](../user-guides/triggers/triggers.md) التالية:

* المراقبة عند ارتفاع مستوى الطلبات الخبيثة المكتشفة من قِبل عقد Wallarm. هذا المشغل قد يشير إلى واحدة من المشكلات المحتملة التالية:

    * أنت تحت الهجوم وعقدة Wallarm تحظر الطلبات الخبيثة بنجاح. قد تفكر في مراجعة الهجمات المكتشفة وحظر عناوين IP للمهاجمة المبلغ عنها يدويًا.
    * لديك مستوى متزايد من الهجمات الموجبة الكاذبة المكتشفة من قِبل عقد Wallarm. قد تفكر في تصعيدها إلى [فريق الدعم الفني لـ Wallarm](mailto:support@wallarm.com) أو التحقق منها يدويًا ك[طلبات موجبة كاذبة](../user-guides/events/false-attack.md).
    * إذا كان لديك [المشغلات المباحة](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) نشطة ولكنك ما زلت تتلقى تنبيهات عند ارتفاع مستوى الهجمات، فقد يشير التنبيه إلى أن المشغل لا يعمل كما هو متوقع.

    [راجع النموذج الملائم للمشغل →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* إبلاغ أن هناك مستخدم جديد تمت إضافته لحساب شركتك في وحدة تحكم Wallarm

    [راجع النموذج الملائم للمشغل →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* علامة على طلبات الهجمات القوية والتصفح القسري وحظر عناوين IP التي انطلقت منه الطلبات

    [تعليمات حول ضبط الحماية من القوة الغاشمة →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* إبلاغ أن العناوين IP الجديدة تم حظرها

    [راجع النموذج الملائم للمشغل →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* الإضافة التلقائية لعناوين IP إلى [القائمة الرمادية](../user-guides/ip-lists/overview.md) المستخدمة في [الحظر الآمن](../admin-en/configure-wallarm-mode.md).
لتحسين معالجة المرور وتحميل الهجمات، تقوم Wallarm بتسبيق [المشغلات](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers).

## قم بتمكين SAML SSO لحسابك في وحدة تحكم Wallarm

يمكنك استخدام مزود SAML SSO مثل G Suite، Okta، أو OneLogin لتوحيد مصادقة المستخدمين في حساب وحدة تحكم Wallarm الخاص بك.

رجاءً التواصل مع مدير الحساب Wallarm الخاص بك أو فريق الدعم التقني لتمكين SAML SSO للحساب الخاص بك، وبعد ذلك اتبع [التعليمات](../admin-en/configuration-guides/sso/intro.md) لإجراء ضبط عملية SSO الخاصة بـ SAML.

## استخدم مزود Wallarm لـ Terraform لإدارة تكوين Wallarm Cloud

يسمح [مزود Wallarm الرسمي لـ Terraform](../admin-en/managing/terraform-provider.md) لك بإدارة تكوين الحساب الممنوح في السحاب (المستخدمون، التطبيقات، القواعد، التكاملات، إلخ) باستخدام أحدث Infrastructure as Code (IaC).

## قم بتنفيذ خطة لتحديث بسرعة نسخ Wallarm المُصدرة حديثًا

تعمل Wallarm باستمرار على تحسين برنامج عقدة الترشيح، حيث تتوفر إصدارات جديدة حوالي مرة كل ربع. الرجاء قراءة [هذا المستند](../updating-migrating/general-recommendations.md) للحصول على معلومات حول النهج المستحسن لإجراء الترقيات، مع المخاطر المرتبطة والإجراءات التحديث ال相关ة.

## تعرف على المشكلات المعروفة

* ستتلقى جميع عقد Wallarm المتصلة بنفس الحساب Wallarm نفس مجموعة القواعد الافتراضية والمخصصة لترشيح المرور. لا يزال يمكنك تطبيق قواعد مختلفة لتطبيقات مختلفة من خلال استخدام أدلة التعريف التطبيقية السليمة أو المعلمات الفريدة لطلب HTTP مثل الرؤوس، ومعلمات سلسلة الاستعلام، إلخ.
* إذا كان لديك مشغل مكون لحجب عنوان IP تلقائيًا ([مثال المشغل](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour))، سيقوم النظام بحجب IP لجميع التطبيقات في حساب Wallarm.

## اتبع أفضل الممارسات للتحقق النشط من التهديد <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

إحدى الطرق التي تستخدمها Wallarm ل[اكتشاف الثغرات الأمنية](../about-wallarm/detecting-vulnerabilities.md) هو **التحقق النشط من التهديد**.

**التحقق النشط من التهديد** يتيح لك تحويل المهاجمين إلى اختبارات اختراق واكتشاف قضايا أمنية محتملة من نشاطهم أثناء استكشافهم لتطبيقاتك/APIs بحثًا عن الثغرات الأمنية. تحدد هذه الوحدة الثغرات الأمنية المحتملة من خلال استكشاف نقاط نهاية التطبيق باستخدام البيانات الحقيقية للهجوم من المرور. افتراضياً هذا الأسلوب معطل.

[تعرّف على أفضل الممارسات لإعداد وحدة **التحقق النشط من التهديد** →](../vulnerability-detection/active-threat-verification/running-test-on-staging.md)
