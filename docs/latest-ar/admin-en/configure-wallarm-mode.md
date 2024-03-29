[link-wallarm-mode-override]: ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]: ../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[acl-access-phase]: ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase
[img-mode-rule]: ../images/user-guides/rules/wallarm-mode-rule.png

# وضع الفلترة

يعرف وضع الفلترة سلوك العقدة عند فحص الطلبات الواردة. توجه هذه التعليمات لما يتوفر من أوضاع للفلترة وطرق التكوين الخاصة بها.

## الأوضاع المتاحة للفلترة

يمكن لعقدة الفلترة Wallarm معالجة الطلبات الواردة في الأوضاع التالية (من الأخف إلى الأشد):

* **معطل** (`off`)
* **المراقبة** (`monitoring`)
* **الحجب الآمن** (`safe_blocking`)
* **الحجب** (`block`)

--8<-- "../include/wallarm-modes-description-latest.md"

## طرق تكوين وضع الفلترة

يمكن تكوين وضع الفلترة بالطرق التالية:

* تعيين قيمة لواصفة `wallarm_mode` في ملف تهيئة العقدة الفاصلة.

    !!! تحذير "دعم واصفة `wallarm_mode` على العقدة CDN"
        يرجى الاخذ بعين الاعتبار انه لا يمكن تكوين واصفة `wallarm_mode` على [عقد Wallarm CDN](../installation/cdn-node.md). لتكوين وضع الفلترة للعقد CDN ، يرجى استخدام الطرق الأخرى المتوفرة.
* تحديد القاعدة العامة للفلترة في وحدة تحكم Wallarm
* تحديد قواعد الفلترة الموجهة لنقطة النهاية في وحدة تحكم Wallarm

تتم تحديد أولويات طرق تكوين وضع الفلترة في [الواصفة `wallarm_mode_allow_override`](#setting-up-priorities-of-filtration-mode-configuration-methods-using-wallarm_mode_allow_override). بشكل افتراضي، تحظى الإعدادات المحددة في وحدة تحكم Wallarm بأولوية أعلى من الواصفة `wallarm_mode` بغض النظر عن شدة قيمتها.

### تحديد وضع الفلترة في الواصفة `wallarm_mode`

!!! تحذير "دعم واصفة `wallarm_mode` على العقدة CDN"
    يرجى الاخذ بعين الاعتبار انه لا يمكن تكوين واصفة `wallarm_mode` على [عقد Wallarm CDN](../installation/cdn-node.md). لتكوين وضع الفلترة للعقد CDN ، يرجى استخدام الطرق الأخرى المتوفرة.
    
عند استخدام الواصفة `wallarm_mode` في ملف التهيئة للعقدة الفاصلة، يمكنك تحديد أوضاع الفلترة لسياقات مختلفة. يتم ترتيب هذه السياقات من الأكثر شمولية إلى الأكثر محلية وفقًا للقائمة التالية:

* `http`: تتم تطبيق الواصفات داخل الكتلة `http` على الطلبات المرسلة إلى الخادم HTTP.
* `server`: تتم تطبيق الواصفات داخل الكتلة `server` على الطلبات المرسلة إلى الخادم الافتراضي.
* `location`: يتم تطبيق الواصفات داخل الكتلة `location` فقط على الطلبات التي تحتوي على هذا المسار الخاص.

إذا تم تعريف قيم واصفة `wallarm_mode` مختلفة لكتل `http`, `server`, و`location`، فإن التكوين الأكثر محلية له أعلى أولوية.

**مثال على استخدام واصفة `wallarm_mode`:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode off;
    }
    
    server {
        server_name SERVER_C;
        wallarm_mode off;
        
        location /main/content {
            wallarm_mode monitoring;
        }
        
        location /main/login {
            wallarm_mode block;
        }

        location /main/reset-password {
            wallarm_mode safe_blocking;
        }
    }
}
```

في هذا المثال، يتم تعريف أوضاع الفلترة للموارد على النحو التالي:

1. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم HTTP.
2. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_A`.
3. يتم تطبيق وضع `off` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_B`.
4. يتم تطبيق وضع `off` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C`، باستثناء الطلبات التي تحتوي على المسار `/main/content`, `/main/login`, أو `/main/reset-password`.
    1. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` التي تحتوي على المسار `/main/content`.
    2. يتم تطبيق وضع `block` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` التي تحتوي على المسار `/main/login`.
    3. يتم تطبيق وضع `safe_blocking` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` التي تحتوي على المسار `/main/reset-password`.

### وضع القاعدة العامة للفلترة في وحدة تحكم Wallarm

يمكنك تعريف وضع الفلترة العامة لجميع الطلبات الواردة في **الإعدادات** → **العام** في [الولايات المتحدة](https://us1.my.wallarm.com/settings/general) أو [الإتحاد الأوروبي](https://my.wallarm.com/settings/general) سحابة.

![تبويب الإعدادات العامة](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

يتم تمثيل إعداد وضع الفلترة العامة بواسطة **تعيين وضع الفلترة** [الافتراضي](../user-guides/rules/rules.md#default-rules) القاعدة في قسم **القواعد**. يجب الانتباه إلى أن قواعد الفلترة المستهدفة لنقطة النهاية في هذا القسم لها أولوية أعلى.

### تحديد قواعد الفلترة الموجهة لنقطة النهاية في وحدة تحكم Wallarm

يمكنك تعيين وضع الفلترة للفروع المحددة، ونقاط النهاية، وبالاعتماد على ظروف أخرى. يمكن إنشاء مثل هذه القواعد من أقسام مختلفة من وحدة تحكم Wallarm وسيتم تخزينها في قسم **القواعد**. لديهم أولوية أعلى من [القاعدة العامة للفلترة المحددة في وحدة تحكم Wallarm](#setting-up-general-filtration-rule-in-wallarm-console).

لإنشاء قاعدة جديدة لوضع الفلترة:

1. انتقل إلى وحدة تحكم Wallarm:

    * **القواعد** → **إضافة قاعدة** أو الفرع الخاص بك → **إضافة قاعدة**.
    * **الهجمات** / **الحوادث** → الهجوم/الحادث → الضربة → **القاعدة**.
    * **اكتشاف API** (إذا كانت [مفعلة](../api-discovery/setup.md#enable)) → نقطة النهاية الخاصة بك → **إنشاء قاعدة**.

1. في **If request is**، [صف](../user-guides/rules/rules.md#configuring) النطاق لتطبيق القاعدة عليه. إذا بدأت القاعدة للفرع المحدد، أو الضربة، أو نقطة النهاية، فسوف يعرفون النطاق - إذا لزم الأمر، يمكنك إضافة المزيد من الشروط.

1. في **Then**، اختر **تعيين وضع الفلترة** وحدد الوضع المطلوب.
1. احفظ التغييرات وانتظر حتى [تكتمل تجميع القاعدة](../user-guides/rules/rules.md#ruleset-lifecycle).

لاحظ أنه لإنشاء قاعدة وضع فلترة، يمكنك أيضا [استدعاء واجهة برمجة التطبيقات Wallarm مباشرة](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application).

**مثال: تعطيل حجب الطلب خلال تسجيل المستخدم**

فلنفترض أن التسجيل للمستخدم الجديد لتطبيقك متاح على `example.com/signup`. حيث من الأفضل أن يتم تجاهل الهجوم بدلاً من خسارة العميل، فمهما كانت الإجراءات الحاجزة المطبقة لتطبيقك، فمن الأفضل تعطيل الحجب أثناء تسجيل المستخدم.

للقيام بذلك، حدد قاعدة **تعيين وضع الفلترة** كما هو معروض على لقطة الشاشة:

![تعيين وضع الفلترة للحركة][img-mode-rule]

### تعيين أولويات طرق تكوين وضع الفلترة باستخدام `wallarm_mode_allow_override`

!!! تحذير "دعم واصفة `wallarm_mode_allow_override` على العقدة CDN"
    يرجى الاخذ بعين الاعتبار انه لا يمكن تكوين واصفة `wallarm_mode_allow_override` على [عقد Wallarm CDN](../installation/cdn-node.md).

تدير الواصفة `wallarm_mode_allow_override` القدرة على تطبيق القواعد التي تم تعريفها على وحدة تحكم Wallarm بدلاً من استخدام قيم الواصفة `wallarm_mode` من ملف التكوين للعقدة الفاصلة.

يتوفر القيم التالية للواصفة `wallarm_mode_allow_override`:

* `off`: يتم تجاهل القواعد المحددة في وحدة تحكم Wallarm. يتم تطبيق القواعد المحددة بواسطة الواصفة `wallarm_mode` في ملف التكوين.
* `strict`: يتم تطبيق القواعد المحددة فقط في السحابة Wallarm التي تحدد أوضاع فلترة أكثر صرامة من تلك التي حددها الواصفة `wallarm_mode` في ملف التكوين.

    أوضاع الفلترة المتاحة مرتبة من الأخف إلى الأشد مدرجة [أعلاه](#available-filtration-modes).

* `on` (افتراضيا): يتم تطبيق القواعد المحددة في وحدة تحكم Wallarm. يتم تجاهل القواعد المحددة بواسطة الواصفة `wallarm_mode` في ملف التكوين.

السياقات التي يمكن تعريف قيمة الواصفة `wallarm_mode_allow_override` فيها ، بالترتيب من الأكثر شمولية إلى الأكثر محلية ، تتم تقديمها في القائمة التالية:

* `http`: تتم تطبيق الواصفات داخل الكتلة `http` على الطلبات المرسلة إلى الخادم HTTP.
* `server`: تتم تطبيق الواصفات داخل الكتلة `server` على الطلبات المرسلة إلى الخادم الافتراضي.
* `location`: يتم تطبيق الواصفات داخل الكتلة `location` فقط على الطلبات التي تحتوي على هذا المسار الخاص.

إذا تم تعريف قيم واصفة `wallarm_mode_allow_override` مختلفة في الكتل `http`, `server`, و`location`، فإن التكوين الأكثر محلية له أعلى أولوية.

**مثال على استخدام الواصفة `wallarm_mode_allow_override`:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

هذا المثال على التكوين يؤدي إلى التطبيقات التالية لقواعد وضع الفلترة من وحدة تحكم Wallarm:

1. تتم تجاهل قواعد وضع الفلترة المحددة في وحدة تحكم Wallarm بالنسبة للطلبات المرسلة إلى الخادم الافتراضي `SERVER_A`. لا يوجد الواصفة `wallarm_mode` المحددة في الكتلة `server` التي تتوافق مع الخادم `SERVER_A`، ولهذا السبب يتم تطبيق الوضع `monitoring` المحدد في الكتلة `http` على مثل هذه الطلبات.
2. تتم تطبيق قواعد الفلترة المحددة في وحدة تحكم Wallarm على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_B` ما عدا الطلبات التي تحتوي على المسار `/main/login`.
3. بالنسبة لتلك الطلبات المرسلة إلى الخادم الافتراضي `SERVER_B` والتي تحتوي على المسار `/main/login`، يتم تطبيق قواعد الفلترة المحددة في وحدة تحكم Wallarm فقط إذا قاموا بتعريف وضع فلترة أكثر صرامة من الوضع `monitoring`.

## مثال على تكوين وضع الفلترة

لننظر في مثال على تكوين وضع الفلترة الذي يستخدم كل من الطرق المذكورة أعلاه.

### تعيين وضع الفلترة في ملف تكوين العقدة الفاصلة

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
    }
}
```

### تعيين وضع الفلترة في وحدة تحكم Wallarm

* [القاعدة العامة للفلترة](#setting-up-general-filtration-rule-in-wallarm-console): **المراقبة**.
* [قواعد الفلترة](#setting-up-filtration-rules-in-rules-section):
    * إذا كان الطلب يلبي الشروط التالية:
        * الطريقة: `POST`
        * الجزء الأول من المسار: `main`
        * الجزء الثاني من المسار: `apply`,
        
        ثم قم بتطبيق **الوضع الافتراضي** للفلترة.
        
    * إذا كان الطلب يلبي الشرط التالي:
        * الجزء الأول من المسار: `main`,
        
        ثم قم بتطبيق **وضع الحجب**.
        
    * إذا كان الطلب يلبي الشروط التالية:
        * الجزء الأول من المسار: `main`
        * الجزء الثاني من المسار: `login`,
        
        ثم قم بتطبيق **وضع المراقبة**.

### أمثلة على الطلبات المرسلة إلى الخادم `SERVER_A`

أمثلة على الطلبات المرسلة إلى الخادم `SERVER_A` المكون والإجراءات التي تطبقها العقدة الفاصلة من Wallarm هي الآتي:

* يتم معالجة الطلب الضار مع المسار `/news` ولكن دون إعاقة بسبب الإعداد `wallarm_mode monitoring;` للخادم `SERVER_A`.

* يتم معالجة الطلب الضار مع المسار `/main` ولكن دون إعاقة بسبب الإعداد `wallarm_mode monitoring;` للخادم `SERVER_A`.

    لا تطبق القاعدة **Blocking** المحددة في وحدة تحكم Wallarm عليه بسبب الضبط `wallarm_mode_allow_override off;` للخادم `SERVER_A`.

* يتم حجب الطلب الضار مع المسار `/main/login` بسبب الإعداد `wallarm_mode block;` للطلبات مع المسار `/main/login`.

    لا تطبق القاعدة **Monitoring** المحددة في وحدة تحكم Wallarm عليه بسبب الإعداد `wallarm_mode_allow_override strict;` في ملف التكوين للعقدة.

* يتم حجب الطلب الضار مع المسار `/main/signup` بسبب الإعداد `wallarm_mode_allow_override strict;` للطلبات مع المسار `/main/signup` والقاعدة **Blocking** المحددة في وحدة تحكم Wallarm للطلبات مع المسار `/main`.
* الطلب الضار مع المسار `/main/apply` والطريقة `GET` يتم حجبه بسبب الإعداد `wallarm_mode_allow_override on;` للطلبات مع المسار `/main/apply` والقاعدة **Blocking** المحددة في وحدة تحكم Wallarm للطلبات مع المسار `/main`.
* الطلب الضار مع المسار `/main/apply` والطريقة `POST` يتم حجبه بسبب الإعداد `wallarm_mode_allow_override on;` للطلبات مع المسار `/main/apply`، القاعدة **الافتراضية** المحددة في وحدة تحكم Wallarm، والإعداد `wallarm_mode block;` للطلبات مع المسار `/main/apply` في ملف تكوين العقدة الفاصلة.

## أفضل الممارسات لتطبيق وضع الفلترة تدريجياً

لاستقبال جديد لعقدة Wallarm بنجاح، يرجى اتباع هذه التوصيات خطوة بخطوة لتبديل أوضاع الفلترة:

1. قم بتنشيط العقد الفاصلة من Wallarm في بيئات التشغيل غير الإنتاجية مع تعيين وضع التشغيل في `المراقبة`.
1. قم بتنشيط العقد الفاصلة من Wallarm في بيئة التشغيل الإنتاجية مع تعيين وضع التشغيل في `المراقبة`.
1. احتفظ بتدفق الحركة عبر العقد الفاصلة في كل بيئاتك (بما في ذلك الاختبار والإنتاج) لمدة 7-14 يومًا لإعطاء الخلفية القائمة على السحابة من Wallarm بعض الوقت لتعلم معلومات حول تطبيقك.
1. قم بتمكين وضع `block` لـ Wallarm في جميع بيئاتك غير الإنتاجية واستخدم الاختبارات المؤتمتة أو اليدوية لتأكيد أن التطبيق المحمي يعمل كما هو متوقع.
1. قم بتمكين وضع `block` لـ Wallarm في بيئة التشغيل الإنتاجية واستخدم الطرق المتاحة لتأكيد أن التطبيق يعمل كما هو متوقع.