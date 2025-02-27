# كشف Credential Stuffing <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

تعد [هجمات Credential Stuffing](../attacks-vulns-list.md#credential-stuffing) هي نوع من الهجمات الإلكترونية حيث يستخدم القراصنة قوائم من بيانات الاعتماد المستخدمين التي تم اختراقها للوصول غير المصرح به إلى حسابات المستخدمين على مواقع الويب العديدة.تشرح هذه المقالة كيفية كشف هذا النوع من التهديدات باستخدام **كشف Credential Stuffing** الخاص بـ Wallarm.

تعد هجمات Credential Stuffing خطرة بسبب الممارسة الشائعة لإعادة استخدام أسماء المستخدمين وكلمات المرور المتطابقة عبر الخدمات المختلفة، بالإضافة إلى الاتجاه لاختيار كلمات مرور يسهل تخمينها (ضعيفة). تتطلب هجمة Credential Stuffing الناجحة محاولات أقل، لذا يمكن للمهاجمين إرسال طلبات بتكرار أقل، مما يجعل التدابير القياسية مثل حماية القوة الغاشمة غير فعالة.

## كيف تعالج Wallarm مشكلة Credential Stuffing

يقوم **كشف Credential Stuffing** الخاص بـ Wallarm بجمع وعرض معلومات فورية عن محاولات استخدام بيانات الاعتماد المخترقة أو الضعيفة للوصول إلى تطبيقاتك. كما يتيح إشعارات فورية عن هذه المحاولات ويقوم بتكوين قائمة قابلة للتنزيل تحتوي على جميع بيانات الاعتماد المخترقة أو الضعيفة التي توفر الوصول إلى تطبيقاتك.

لتحديد كلمات المرور المخترقة والضعيفة، يستخدم Wallarm قاعدة بيانات شاملة تحتوي على أكثر من **850 مليون سجل** تم جمعها من قاعدة بيانات بيانات الاعتماد المخترقة العامة [HIBP](https://haveibeenpwned.com/).

![مخطط Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

يحافظ كشف Credential Stuffing الخاص بـ Wallarm على أمان بيانات الاعتماد من خلال تطبيق سلسلة من الإجراءات التالية:

1. عندما يصل الطلب إلى العقدة، ينشئ [SHA-1](https://en.wikipedia.org/wiki/SHA-1) من كلمة المرور ويُرسل عددًا من الأحرف إلى الCloud.
1. تتحقق السحابة من قاعدة بياناتها لكلمات المرور المعروفة أنها مُخترقة بحثًا عن تلك التي تبدأ بالأحرف المُستلمة. إذا تم العثور عليها، يتم إرسالها إلى العقدة في تنسيق SHA-1 المشفر، والعقدة تقارنها مع كلمة المرور من الطلب.
1. إذا كان المطابقة، تبلغ العقدة عن هجمة Credential Stuffing إلى السحابة، بما في ذلك تسجيل الدخول المأخوذ من الطلب لهذه معلومات الهجوم.
1. العقدة تُمرّر الطلب إلى التطبيق.

بهذه الطريقة، لن يتم إرسال كلمات المرور من الأجهزة التي تحتوي على عقد Wallarm إلى سحابة Wallarm بدون تشفير. يتم إرسال بيانات الاعتماد بشكل منفصل، مما يضمن أن بقاء بيانات تفويض العملاء آمنة داخل شبكتك.

**محاولات الجمعة والفردية**

يستطيع كشف Credential Stuffing تسجيل محاولات جماعية كبيرة لاستخدام بيانات الاعتماد المُخترقة التي تم تنفيذها بواسطة البوتات وكذلك المحاولات الفردية التي لا يمكن الكشف عنها بواسطة وسائل أخرى.

**تدابير التخفيف**

يسمح لك معرفة الحسابات ذات كلمات المرور المسروقة أو الضعيفة باستثناء تدابير لحماية بيانات هذه الحسابات، مثل التواصل مع ملاك الحسابات، أو تعليق الوصول إلى الحسابات مؤقتًا، وما إلى ذلك.

لا تحظر Wallarm الطلبات التي تحتوي على بيانات اعتماد مُخترقة لتجنب حظر المستخدمين الشرعيين حتى لو كانت كلمات مرورهم ضعيفة أو كانت مُخترقة. ومع ذلك، لاحظ أن يمكن حظر محاولات Credential Stuffing إذا:

* كانت جزءًا من نشاط البوت الخبيث المكتشف وتم تمكين الوحدة النمطية [API Abuse Prevention](../api-abuse-prevention/overview.md).
* كانت جزءًا من الطلبات التي تحتوي على [علامات هجوم](../attacks-vulns-list.md) أخرى.

## تمكين

لتمكين **كشف Credential Stuffing** الخاص بـ Wallarm:

1. تأكد من أن [خطة الاشتراك](../about-wallarm/subscription-plans.md#subscription-plans) الخاصة بك تتضمن **كشف Credential Stuffing**. لتغيير خطة الاشتراك، يرجى إرسال طلب إلى [sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.).
1. تأكد من أن عقدة Wallarm الخاصة بك هي [الإصدار 4.10](../updating-migrating/what-is-new.md) أو أعلى، وتم تنشيطها باستخدام واحدة من ممتلكات البرنامج الفنية المحددة:
    * [مثبت All-in-one](../installation/nginx/all-in-one.md)
    * [رسم بياني Helm لوحدة تحكم Ingress المستندة إلى NGINX](../admin-en/installation-kubernetes-en.md)
    * [صورة Docker المستندة إلى NGINX](../admin-en/installation-docker-en.md)
    * [صورة الجهاز Amazon (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [صورة الجهاز Google Cloud](../installation/cloud-platforms/gcp/machine-image.md)
1. تحقق من أن [دور](../user-guides/settings/users.md#user-roles) المستخدم الخاص بك يسمح بتكوين **كشف Credential Stuffing**.
1. في واجهة Wallarm → **Credential Stuffing**, قم بتمكين الوظيفة (معطلة بشكل افتراضي).

بمجرد تمكين **كشف Credential Stuffing** ، فإنه يحتاج إلى [تكوين](#configuring) لبدء العمل.

## تكوين

تحتاج لتشكيل قائمة نقاط النهاية للمصادقة ليتم التحقق من محاولات استخدام بيانات الاعتماد التي تم اختراقها. لتشكيل القائمة، انتقل إلى واجهة Wallarm → **Credential Stuffing**.

![واجهة Wallarm - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

هناك طريقتين لإضافة نقاط النهاية إلى القائمة:

* من قائمة **النقاط النهائية الموصى بها** التي تتضمن نوعين من العناصر:
    
    * القواعد المحددة مسبقًا من Wallarm التي تستخدم التعبيرات العادية لتحديد نقاط النهاية الشائعة المستخدمة للمصادقة والمعلمات التي تخزن كلمات المرور وأسماء الدخول.
    * نقاط النهاية المستخدمة للمصادقة التي تم العثور عليها بواسطة الوحدة النمطية [API Discovery](../api-discovery/overview.md) وسجلت كونها تلقت حركة مرور فعلية.

* يدويًا - يمكنك أيضًا تضمين نقاط النهاية الفريدة من نوعها للمصادقة الخاصة بك، مما يضمن الحماية الكاملة. عند الإضافة يدويًا، قم بتعيين [URI](../user-guides/rules/rules.md#uri-constructor) وطريقة البحث عن معلمات المصادقة:

    * بواسطة **موقع البارامترات بالضبط** - ستحتاج إلى التشير إلى نقاط الطلب [النقطة](../user-guides/rules/rules.md#points) التي توجد فيها كلمة المرور واسم الدخول بدقة.
    * بواسطة **التعبير العادي** - سيتم البحث عن معلمات نقطة النهاية مع كلمة المرور واسم الدخول باستخدام [التعبير العادي](../user-guides/rules/rules.md#condition-type-regex).
    
        ![Credential Stuffing - إضافة نقاط النهاية للمصادقة - التعبير العادي](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## عرض محاولات استخدام بيانات الاعتماد المُخترقة

يتم عرض عدد محاولات استخدام بيانات الاعتماد المُخترقة في الأيام السبع الأخيرة في قسم **Credential Stuffing**. انقر على العداد وسيتم توجيهك إلى قسم **الهجمات** الذي سيعرض جميع هجمات [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) للأيام السبع الأخيرة.

قم بتوسيع أي من الهجمات لرؤية قائمة تسجيلات الدخول التي تم اختراق كلمات مرورها.

![هجمات - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## الحصول على قائمة CSV لبيانات الاعتماد المُخترقة

يتم عرض العدد الإجمالي لبيانات الاعتماد المُخترقة في قسم **Credential Stuffing**. انقر على العداد وسيقوم المتصفح بتنزيل ملف CSV يحتوي على قائمة بيانات الاعتماد المُخترقة.

## الحصول على إشعارات

يمكنك الحصول على إشعارات فورية حول محاولات استخدام بيانات الاعتماد المُخترقة على بريدك الإلكتروني، أو Messenger، أو أحد [أنظمتك المتكاملة](../user-guides/settings/integrations/integrations-intro.md). لتمكين هذه الإشعارات، في قسم **المحفزات** لـ Wallarm، قم بتكوين مُحفز أو أكثر مع حالة **حساب المستخدم المُخترق**.

يمكنك تضييق الإشعارات بواسطة التطبيق أو الاستضافة التي ترغب في مراقبتها وبواسطة نوع الاستجابة.

**مثال على المؤثر: إشعار حول محاولة استخدام بيانات الاعتماد المُخترقة في Slack**

في هذا المثال، إذا تم اكتشاف محاولة جديدة لاستخدام بيانات الاعتماد المُخترقة، سيتم إرسال إشعار حول هذا إلى قناة Slack الخاصة بك التي تم تكوينها.

![مُحفز Credential stuffing](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**لاختبار المُحفز:**

1. اذهب إلى Wallarm Console → **Integrations** في السحابة [US](https://us1.my.wallarm.com/integrations/) أو [EU](https://my.wallarm.com/integrations/)، وقم بتكوين [التكامل مع Slack](../user-guides/settings/integrations/slack.md).
1. في قسم **Credential Stuffing** ، تأكد من تمكين Credential Stuffing ، وتمت إضافة القاعدة المحددة مسبقًا من Wallarm التالية من **النقاط النهائية الموصى بها** إلى **نقاط النهاية النشطة للمصادقة**:

    الطلب هو:

    ```
    /**/{{login|auth}}.*
    ```

    كلمة المرور موجودة هنا:

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    تسجيل الدخول موجود هنا:

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. في قسم **المحفزات** ، أنشئ محفزا كما هو موضح أعلاه، وربطه بتكامل Slack الخاص بك.
1. أرسل طلبًا يحتوي على بيانات اعتماد مُخترقة إلى نقطة نهاية `localhost/login` الخاصة بالعقدة:

    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```

1. في قسم **الهجمات**، تحقق من كون الطلب الخاص بك تم تسجيله بوصفه حدث من نوع `credential_stuffing`: محاولة لاستخدام بيانات الاعتماد المُخترقة.
1. قم بتوسيع الهجوم للتأكد من كونه يحتوي على معلومات الدخول المُخترقة.
1. تحقق من الرسائل في قناة Slack الخاصة بك. يجب أن تبدو الرسالة الجديدة كما يلي:
    ```
    [wallarm] تم اكتشاف بيانات اعتماد مسروقة

    نوع الإشعار: compromised_logins

    تم اكتشاف بيانات اعتماد مسروقة في حركة مرورك الواردة:

    الحسابات المُخترقة: user-01@company.com
    العنوان المرتبط: localhost/login
    الرابط: https://my.wallarm.com/attacks/?q=attacks+d%3Alocalhost+u%3A%2Flogin+statuscode%3A404+application%3Adefault+credential_stuffing+2024%2F01%2F22

    العميل: VotreEntreprise
    السحابة: EU
    ```

## القيود

حاليًا، الوحدة النمطية لكشف Credential Stuffing غير مدعومة على عقد Wallarm التي تم توزيعها عبر:

* حزم DEB/RPM لـ NGINX ([الاستقرار](../installation/nginx/dynamic-module.md), [التوزيع](../installation/nginx/dynamic-module-from-distr.md)) أو [NGINX Plus](../installation/nginx-plus.md)
* [وحدة Terraform لـ AWS](../installation/cloud-platforms/aws/terraform-module/overview.md)
* [صورة Docker المبنية على Envoy](../admin-en/installation-guides/envoy/envoy-docker.md)