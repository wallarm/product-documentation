# أفضل ممارسات نشر وصيانة حلول والارم

تقدم هذه المقالة أفضل الممارسات لنشر وصيانة حل Wallarm.

## فهم قوة NGINX

تستخدم غالبية خيارات نشر عقدة الترشيح Wallarm NGINX كخادم الوكيل العكسي (الأساس لوحدة Wallarm) ، التي توفر مجموعة كبيرة من الوظائف ، والوحدات ، وأدلة الأداء / الأمان. فيما يلي مجموعة من مقالات الإنترنت المفيدة:

* [NGINX رائع](https://github.com/agile6v/awesome-nginx)
* [عرض شرائح أساسيات NGINX وأفضل الممارسات](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [كيفية تحسين تكوين NGINX](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 خطوات سريعة لتحسين أداء خادم NGINX الخاص بك](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [كيفية بناء خادم NGINX قوي في 15 خطوة](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [كيفية ضبط وتحسين أداء خادم الويب NGINX](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [طرق قوية لتعزيز خادم NGINX الخاص بك وتحسين أدائه](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [أفضل ممارسات نشر TLS](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [دليل تأمين خادم الويب NGINX وتقويته](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [NGINX Tuning للحصول على أفضل أداء](https://github.com/denji/nginx-tuning)
* [أفضل 25 ممارسة أمنية لخادم الويب NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## اتبع الخطوات الموصى بها للتعريف

1. تعرف على [خيارات نشر عقدة Wallarm المتاحة](../installation/supported-deployment-options.md).
2. تعرف على الخيارات المتاحة لـ [إدارة تكوين عقدة Wallarm بشكل منفصل لبيئاتك](../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) (إذا لزم الأمر).
3. قم بنشر عقد الترشيح Wallarm في بيئات التشغيل غير الإنتاجية مع تعيين [وضع العمل](../admin-en/configure-wallarm-mode.md) على `monitoring`.
4. تعرف على كيفية التشغيل والتوسع ورصد حلول Wallarm ، وتأكد من استقرار المكون الشبكي الجديد.
5. قم بنشر عقد الترشيح Wallarm في بيئة الإنتاج الخاصة بك مع تعيين [وضع العمل](../admin-en/configure-wallarm-mode.md) على `monitoring`.
6. قم بتنفيذ إدارة التكوين المناسبة و[عمليات الرصد](#enable-proper-monitoring-of-the-filtering-nodes) للمكون Wallarm الجديد.
7. حافظ على تدفق المرور عبر عقد الترشيح في جميع بيئاتك (بما في ذلك الاختبار والإنتاج) لمدة 7-14 يومًا لإعطاء الخلفية القائمة على السحابة لـ Wallarm بعض الوقت للتعرف على التطبيق الخاص بك.
8. قم بتمكين وضع `block` [mode](../admin-en/configure-wallarm-mode.md) في جميع بيئاتك غير الإنتاجية واستخدم الاختبارات الآلية أو اليدوية للتأكد من أن التطبيق المحمي يعمل كما هو متوقع.
9. قم بتمكين وضع `block` [mode](../admin-en/configure-wallarm-mode.md) في بيئة الإنتاج واستخدم الطرق المتاحة للتأكد من أن التطبيق يعمل كما هو متوقع.

## نشر العقد الترشيحي ليس فقط في البيئة الإنتاجية ولكن أيضًا في اختبار وتجهيز

لا تقتصر معظم عقود خدمة Wallarm على عدد العقد التي نشرها العميل ، لذا ليس هناك سبب لعدم نشر العقد الترشيحية عبر جميع بيئاتك بما في ذلك التطوير ، والاختبار ، والتجهيز ، وما إلى ذلك.

من خلال نشر واستخدام العقد الترشيحية في جميع مراحل تطوير البرمجيات و / أو أنشطة تشغيل الخدمة لديك ، لديك فرصة أفضل لاختبار تدفق البيانات بشكل صحيح وتقليل خطر حدوث أي مواقف غير متوقعة في بيئة الإنتاج الحرجة.

## قم بتمكين مكتبة التتبع

تحسن تحليل الطلبات باستخدام [** مكتبة التحقق **] (الحماية من الهجمات.md#library-libdetection) بشكل كبير قدرة العقدة الترشيحية على اكتشاف هجمات SQLi. ينصح به بشدة لجميع عملاء Wallarm [التطوير] (/ التحديث-الهجرة / توصيات-عامة /) إلى الإصدار الأحدث من برنامج تشغيل العقدة الترشيحية واحتفظ بمكتبة ** التحقق ** ممكنة.

* في الإصدار 4.4 وأعلى من العقدة الترشيحية ، يتم تمكين ** التحقق ** بشكل افتراضي.
* في الإصدارات الأقل ، من الأفضل تمكينه باستخدام [الطريقة] (الحماية من الهجمات.md#managing-libdetection-mode) لخيار النشر الخاص بك.

## قم بتكوين التقارير الصحيحة لعناوين IP النهائية

بالنسبة لعقد الترشيح Wallarm الموجودة خلف موزع التحميل أو CDN ، يرجى التأكد من تكوين عقد الترشيح الخاصة بك للتقارير بشكل صحيح لعناوين IP المستخدمين النهائيين (وإلا فإن [وظائف قائمة IP] (../user-guides/ip-list/overview.md) ، [التحقق الاختبار النشط](detecting-vulnerabilities.md#active-threat-verification) ، وبعض الميزات الأخرى لن تعمل):

* [تعليمات لعقد Wallarm القائمة على NGINX] (../admin-en/using-proxy-or-balancer-en.md) (بما في ذلك صور AWS / GCP وحاوية العقدة Docker)
* [تعليمات للعقد الترشيحية التي تم نشرها كمرشد دخول Wallarm كوبيرنتيس] (../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## قم بتمكين الرصد السليم للعقد الترشيحية

من الناحية العملية ، يوصى بتمكين الرصد السليم لعقد الترشيح Wallarm. يجمع الخدمة `collectd` المثبتة مع كل عقدة ترشيح Wallarm المقاييس المدرجة في [الرابط] (../admin-en/monitoring/available-metrics.md).

يعتمد الأسلوب الذي يتم من خلاله إعداد رصد العقدة الترشيحية على خيار نشرها:

* [تعليمات لعقد Wallarm القائمة على NGINX] (../admin-en/monitoring/intro.md) (بما في ذلك صور AWS / GCP وخدمات جانبية كوبيرنتيس)
* [تعليمات للعقد الترشيحية التي تم نشرها كمرشد دخول Wallarm كوبيرنتيس] (../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [تعليمات لصورة Docker القائمة على NGINX] (../admin-en/installation-docker-en.md#monitoring-configuration)

## قم بتنفيذ القدرة الاحتياطية المناسبة ووظائف الفشل التلقائي

مثل أي مكون حرج آخر في البيئة الإنتاجية الخاصة بك ، يجب أن تتم بناء ونشر وتشغيل عقد Wallarm بمستوى مناسب من التكرار والفشل التلقائي. يجب أن يكون لديك ** على الأقل عقدتين نشطتين للترشيح من Wallarm ** تتعامل مع طلبات المستخدم النهائية الحرجة. تقدم المقالات التالية معلومات ذات صلة حول الموضوع:

* [تعليمات لعقد Wallarm القائمة على NGINX] (../admin-en/configure-backup-en.md) (بما في ذلك صور AWS / GCP ، حاوية العقدة عقدة Docker ، وخدمات جانبية كوبيرنتيس)
* [تعليمات للعقد الترشيحية التي تم نشرها كمرشد دخول Wallarm كوبيرنتيس] (../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## تعرف على كيفية استخدام قائمة العناوين المسموحة ، قائمة العناوين التي تم رفضها ، والقائمة الرمادية

بالإضافة إلى حجب الطلبات الخبيثة الفردية ، يمكن لعقد الترشيح Wallarm أيضًا حجب عناوين IP المستخدمين الفردين. يتم تكوين قواعد حجب IPs باستخدام القوائم المسموح بها والقوائم التي تم رفضها والقوائم الرمادية.

[المزيد من التفاصيل حول استخدام قوائم IP →] (../user-guides/ip-lists/overview.md)

## تعرف على كيفية تنفيذ التداول التدريجي لتغييرات تكوين Wallarm

* استخدم سياسات إدارة التغييرات DevOps القياسية والتداول التدريجي للتغييرات التكوينية المنخفضة المستوى لعقد الترشيح Wallarm في جميع الأشكال.
* بالنسبة لقواعد تتبع الحركة ، استخدم مجموعة مختلفة من [IDs] (../admin-en/configure-parameters-en.md#wallarm_application) التطبيقات أو رؤوس طلب `Host`.
* بالنسبة لقاعدة [إنشاء مؤشر هجوم قائم على التعبير العادي] (../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) ، بالإضافة إلى القدرة المذكورة أعلاه على الترتيب مع معرف التطبيق المحدد، يمكن تمكينه في وضع الرصد (مربع الاختيار ** التجريبي **) حتى عندما يكون العقدة Wallarm تعمل في وضع الحجب.
* قاعدة [تعيين وضع الترشيح] (../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console) تسمح بالتحكم في وضع العمل للعقدة Wallarm (`monitoring`، `safe_blocking` أو `block`) من وحدة التحكم Wallarm، مماثلة ل [إعداد `wallarm_mode` ] (../admin -en /configure-parameters-en.md#wallarm_mode) في تكوين NGINX (وفقًا لإعداد [`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override)).

## قم بتكوين التكاملات المتاحة لتلقي الإشعارات من النظام

تقدم Wallarm [تكاملات أصلية](../user-guides/settings/integrations/integrations-intro.md) مريحة مع Slack و Telegram و PagerDuty و Opsgenie وأنظمة أخرى لإرسال إشعارات الأمان المختلفة التي تم إنشاؤها بواسطة النظام بسرعة ، على سبيل المثال:

* الثغرات الأمنية المكتشفة حديثًا
* التغييرات في محيط الشبكة للشركة
* المستخدمين الذين تمت إضافتهم حديثًا إلى حساب الشركة عبر Wallarm Console ، إلخ.

يمكنك أيضًا استخدام وظائف [المشغلات](../user-guides/triggers/triggers.md) لإعداد التنبيهات المخصصة حول أحداث مختلفة تحدث في النظام.

## تعرف على قوة وظائف Triggers

بناءً على بيئتك المحددة ، نوصيك بتكوين [المشغلات](../user-guides/triggers/triggers.md) التالية:

* رصد زيادة مستوى الطلبات الخبيثة التي تم اكتشافها بواسطة عقد Wallarm. قد يشير هذا المشغل إلى واحدة من المشكلات المحتملة التالية:

    * أنت تتعرض لهجمة والعقدة Wallarm تقوم بحجب الطلبات الخبيثة بنجاح. قد ترغب في مراجعة الهجمات التي تم اكتشافها ورفض الأطراف المسؤولة عن الهجوم يدويًا (الحجب) للعناوين IP التي تم الإبلاغ عنها.
    * لديك مستوى متزايد من الهجمات الإيجابية الكاذبة التي اكتشفتها عقد Wallarm. قد ترغب في تصعيد هذا إلى [فريق الدعم الفني لـ Wallarm](mailto:support@wallarm.com) أو [تمييز الطلبات كهجمات كاذبة بشكل يدوي](../user- guides/events/false-attack.md).
    * إذا كان لديك [مشغل القائمة السوداء](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) نشط ولكنك لا تزال تتلقى تنبيهات حول زيادة مستوى الهجمات ، فقد يشير التنبيه إلى أن المشغل لا يعمل كما هو متوقع.

    [راجع مثال المشغل المكون →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* تنبيه أن مستخدمًا جديدًا تمت إضافته إلى حساب شركتك في وحدة تحكم Wallarm

    [راجع مثال المشغل المكون →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* علامة على الطلبات باعتبارها هجمات تجاوز قوية أو تصفح قسري وحظر عناوين IP التي تم إرسال الطلبات منها

    [تعليمات حول تكوين حماية القوة الغاشمة →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* اتصل بأنه تم حظر عناوين IP جديدة

    [راجع مثال المشغل المكون →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* قم بإضافة عناوين IP تلقائيًا إلى [القائمة الرمادية] (../user-guides/ip-lists/overview.md) المستخدمة في وضع [الحجب الآمن] (../admin-en/configure-wallarm-mode.md).

لتحسين معالجة الحركة وتحميل الهجوم ، فإن Wallarm [معدة مسبقًا] (../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) بعض المشغلات.

## قم بتمكين SAML SSO لحسابك في وحدة التحكم Wallarm

يمكنك استخدام موفر SAML SSO مثل G Suite أو Okta أو OneLogin لتوحيد مصادقة المستخدمين في حساب Wallarm الخاص بك في Console.

يُرجى التواصل مع مدير حسابك في Wallarm أو فريق الدعم الفني لتمكين SAML SSO لحسابك ، وبعد ذلك اتبع [هذه التعليمات] (../admin-en/configuration-guides/sso/intro.md) لإجراء تكوين SAML SSO.

## استخدم موفر Wallarm Terraform لإدارة تكوين Wallarm السحابي

يسمح [موفر Terraform الرسمي لـ Wallarm] (../admin-en/managing/terraform-provider.md) لك بإدارة تكوين السحابة الخاص بك Wallarm (المستخدمين ، التطبيقات ، القواعد ، التكاملات ، إلخ) باستخدام الطريقة الحديثة للبنية التحتية ككود (IaC).

## خطة للتحديث بسرعة إلى الإصدارات الجديدة لعقدة Wallarm

تعمل Wallarm باستمرار على تحسين برنامج العقدة الترشيحية ، مع توفر الإصدارات الجديدة حوالي مرة كل ربع. يرجى قراءة [هذا المستند] (../updating-migrating/general-recommendations.md) للحصول على معلومات حول النهج الموصى به لإجراء الترقيات ، مع المخاطر المرتبطة والإجراءات ذات الصلة بالترقية.

## تعرف على النقاط البارزة المعروفة

* ستتلقى جميع عقد Wallarm المتصلة بنفس الحساب Wallarm نفس مجموعة القواعد الافتراضية والمخصصة لترشيح الحركة. لا يزال بإمكانك تطبيق قواعد مختلفة لتطبيقات مختلفة باستخدام معرفات التطبيقات المناسبة أو المعلمات الفريدة لطلب HTTP مثل الرؤوس ومعلمات سلسلة الاستعلام ، إلخ.
* إذا كان لديك المشغل مكونًا لحظر عنوان IP تلقائيًا ([مثال المشغل] (../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)) ، سيحظر النظام عنوان IP لجميع التطبيقات في حساب Wallarm.

## اتبع أفضل ممارسات للتحقق من التهديد النشط <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -80px;"></a>

أحد الطرق التي تستخدمها Wallarm لـ [اكتشاف الثغرات الأمنية] (../about-wallarm/detecting-vulnerabilities.md) هو ** التحقق من التهديد النشط **.

يتيح لك ** التحقق من التهديد النشط ** تحويل المهاجمين إلى اختبارات اختراق واكتشاف مشكلات الأمان المحتملة من نشاطهم بينما يتحققون من تطبيقاتك / APIs للبحث عن ثغرات. تجد هذه الوحدة الثغرات المحتملة عن طريق فحص نقاط نهاية التطبيق باستخدام بيانات الهجوم الحقيقية من الحركة. بشكل افتراضي ، تم تعطيل هذا الأسلوب.

[تعلم أفضل الممارسات لتكوين وحدة ** التحقق من التهديد النشط ** →] (../vulnerability-detection/active-threat-verification/running-test-on-staging.md)