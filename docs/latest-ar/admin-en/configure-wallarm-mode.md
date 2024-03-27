[link-wallarm-mode-override]:       ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]:            ../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[acl-access-phase]:                 ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 
[img-mode-rule]:                    ../images/user-guides/rules/wallarm-mode-rule.png

# وضع الترشيح

يحدد وضع الترشيح سلوك عقدة الترشيح عند معالجة الطلبات الواردة. تصف هذه التعليمات الأطوار المتاحة للترشيح وطرق تكوينها.

## الأوضاع المتاحة للترشيح

يمكن لعقدة ترشيح Wallarm معالجة الطلبات الواردة في الأوضاع التالية (من الأخف إلى الأشد):

* **معاق** (`off`)
* **الرصد** (`monitoring`)
* **الحظر الآمن** (`safe_blocking`)
* **الحظر** (`block`)

--8<-- "../include/wallarm-modes-description-latest.md"

## طرق تكوين وضع الترشيح

يمكن تكوين وضع الترشيح بالطرق التالية:

* تعيين قيمة لتوجيه `wallarm_mode` في ملف تكوين عقدة الترشيح

    !!! التحذير "دعم توجيه `wallarm_mode` على العقدة CDN"
        يرجى ملاحظة أن توجيه `wallarm_mode` لا يمكن تكوينه على [عقد Wallarm CDN](../installation/cdn-node.md). لتكوين وضع الترشيح لعقد CDN، يرجى استخدام الطرق المتاحة الأخرى.
* تحديد القاعدة العامة للترشيح في وحدة تحكم Wallarm
* تعريف قواعد الترشيح المستهدفة للنقاط النهائية في وحدة تحكم Wallarm

تتم تحديد أولويات طرق تكوين وضع الترشيح في [توجيه `wallarm_mode_allow_override`](#setting-up-priorities-of-filtration-mode-configuration-methods-using-wallarm_mode_allow_override). بشكل افتراضي، تمتلك الإعدادات المحددة في وحدة تحكم Wallarm أولوية أعلى من توجيه `wallarm_mode` بغض النظر عن قيمته الشديدة.

### تحديد وضع الترشيح في توجيه `wallarm_mode`

!!! التحذير "دعم توجيه `wallarm_mode` على العقدة CDN"
    يرجى ملاحظة أن توجيه `wallarm_mode` لا يمكن تكوينه على [عقد Wallarm CDN](../installation/cdn-node.md). لتكوين وضع الترشيح لعقد CDN، يرجى استخدام الطرق المتاحة الأخرى.

باستخدام توجيه `wallarm_mode` في ملف تكوين عقدة الترشيح، يمكنك تحديد أوضاع الترشيح لسياقات مختلفة. يتم ترتيب هذه السياقات من الأكثر شمولية إلى الأكثر محلية في القائمة التالية:

* `http`: يتم تطبيق التوجيهات داخل الكتلة `http` على الطلبات المرسلة إلى الخادم HTTP.
* `server`: تُطبِق التوجيهات داخل كتلة `server` على الطلبات المرسلة إلى الخادم الافتراضي.
* `location`: يتم تطبيق التوجيهات داخل الكتلة `location` فقط على الطلبات التي تحتوي على المسار المعين.

إذا تم تعريف قيم توجيه `wallarm_mode` مختلفة للكتل `http` و `server` و `location`، فإن التكوين المحلي الأكثر دقة له الأولوية الأعلى.

**مثال على استخدام توجيه `wallarm_mode`:**

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

في هذا المثال، يتم تعريف أوضاع الترشيح للموارد على النحو التالي:

1. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم HTTP.
2. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_A`.
3. يتم تطبيق وضع `off` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_B`.
4. يتم تطبيق وضع `off` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C`، باستثناء الطلبات التي تحتوي على المسار `/main/content`، `/main/login`، أو المسار `/main/reset-password`.
      1. يتم تطبيق وضع `monitoring` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` والتي تحتوي على المسار `/main/content`.
      2. يتم تطبيق وضع `block` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` والتي تحتوي على المسار `/main/login`.
      3. يتم تطبيق وضع `safe_blocking` على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_C` والتي تحتوي على المسار `/main/reset-password`.

### إعداد قاعدة الترشيح العامة في وحدة تحكم Wallarm

يمكنك تحديد وضع الترشيح العام لجميع الطلبات الواردة في **الإعدادات** → **عام** في [الغيمة الأمريكية](https://us1.my.wallarm.com/settings/general) أو [الغيمة الأوروبية](https://my.wallarm.com/settings/general).

![علامة التبويب الإعدادات العامة](../images/configuration-guides/configure-wallarm-mode/ar/general-settings-page-with-safe-blocking.png)

يتم تمثيل إعداد وضع الترشيح العام كقاعدة **ضبط وضع الترشيح**[الافتراضي](../user-guides/rules/rules.md#default-rules) في قسم **القواعد**. لاحظ أن قواعد الترشيح المستهدفة للنقاط النهائية في هذا القسم لها أولوية أعلى.

### إعداد قواعد الترشيح المستهدفة للنقاط النهائية في وحدة تحكم Wallarm

يمكنك تعيين وضع الترشيح لفروع محددة ونقاط نهائية واعتماداً على ظروف أخرى. يمكن إنشاء مثل هذه القواعد من أقسام مختلفة من وحدة التحكم Wallarm وسوف يتم تخزينها في قسم **القواعد**. لديهم أولوية أعلى من [القاعدة العامة للترشيح المحددة في وحدة تحكم Wallarm](#setting-up-general-filtration-rule-in-wallarm-console).

لإنشاء قاعدة وضع ترشيح جديدة:

1. انتقل إلى وحدة تحكم Wallarm:

    * **القواعد** → **إضافة قاعدة** أو الفروع الخاصة بك → **إضافة قاعدة**.
    * **الهجمات** / **الحوادث** → هجوم/حادث → نتيجة → **القاعدة**.
    * **اكتشاف API** (إذا كان [ممكّناً](../api-discovery/setup.md#enable)) → النقطة النهائية الخاصة بك → **إنشاء قاعدة**.

1. في **إذا كان الطلب هو**، [وصف](../user-guides/rules/rules.md#configuring) النطاق لتطبيق القاعدة عليه. إذا بدأت القاعدة لنطاق محدد أو نتيجة أو نقطة نهائية، فإنها تحدد النطاق - إذا كانت هناك حاجة، يمكنك إضافة المزيد من الظروف.

1. في **ثم**، اختر **ضبط وضع الترشيح** وحدد وضعاً مرغوباً.
1. احفظ التغييرات وانتظر حتى [اكتمال تجميع القاعدة](../user-guides/rules/rules.md#ruleset-lifecycle).

لاحظ أنه لإنشاء قاعدة وضع الترشيح، يمكنك أيضاً [استدعاء API Wallarm مباشرة](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application).

**مثال: تعطيل الحظر المطلوب خلال تسجيل المستخدم**

لنفترض أن تسجيل مستخدم جديد لتطبيقك متاح على `example.com/signup`. حيث أنه من الأفضل تجاهل الهجوم بدلًا من فقدان العميل، فمهما كانت تدابير الحظر المطبقة لتطبيقك، فإنه من الأفضل تعطيل الحظر أثناء تسجيل المستخدم.

للقيام بذلك، اضبط القاعدة **ضبط وضع الترشيح** كما هو معروض على اللقطة الشاشة:

![ضبط وضع تدفق الحركة][img-mode-rule]

### إعداد أولويات طرق تكوين وضع الترشيح باستخدام `wallarm_mode_allow_override`

!!! التحذير "دعم توجيه `wallarm_mode_allow_override` على العقدة CDN"
    يرجى ملاحظة أن توجيه `wallarm_mode_allow_override` لا يمكن تكوينه على [عقد Wallarm CDN](../installation/cdn-node.md).

يدير توجيه `wallarm_mode_allow_override` القدرة على تطبيق القواعد التي تم تعريفها على وحدة تحكم Wallarm بدلاً من استخدام قيم توجيه `wallarm_mode` من ملف تكوين عقدة الترشيح.

القيم التالية صالحة لتوجيه `wallarm_mode_allow_override`:

* `off`: يتم تجاهل القواعد المحددة في وحدة تحكم Wallarm. يتم تطبيق القواعد المحددة بواسطة توجيه `wallarm_mode` في ملف التكوين.
* `strict`: يتم تطبيق القواعد المحددة في السحابة Wallarm فقط التي تحدد أوضاع ترشيح أشد من تلك المعرفة بواسطة توجيه `wallarm_mode` في ملف التكوين.

    يتم سرد أوضاع الترشيح المتاحة المرتبة من الأخف إلى الأشد [أعلاه](#available-filtration-modes).

* `on` (بشكل افتراضي): يتم تطبيق القواعد المحددة في وحدة تحكم Wallarm. يتم تجاهل القواعد المحددة بواسطة توجيه `wallarm_mode` في ملف التكوين.

تقدم السياقات التي يمكن فيها تعريف قيمة `wallarm_mode_allow_override` توجيه، مرتبة من الأكثر شمولية إلى الأكثر محلية، في القائمة التالية:

* `http`: يتم تطبيق التوجيهات داخل الكتلة `http` على الطلبات المرسلة إلى الخادم HTTP.
* `server`: تُطبِق التوجيهات داخل كتلة `server` على الطلبات المرسلة إلى الخادم الافتراضي.
* `location`: يتم تطبيق التوجيهات داخل الكتلة `location` فقط على الطلبات التي تحتوي على المسار المعين.

إذا تم تعريف قيم توجيه `wallarm_mode_allow_override` مختلفة في الكتل `http` و `server` و `location`، فإن التكوين المحلي الأكثر دقة له الأولوية الأعلى.

**مثال على استخدام توجيه `wallarm_mode_allow_override`:**

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

يؤدي هذا المثال على التكوين إلى التطبيقات التالية لقواعد وضع الترشيح من وحدة تحكم Wallarm:

1. يتم تجاهل قواعد وضع الترشيح المحددة في وحدة تحكم Wallarm بالنسبة للطلبات المرسلة إلى الخادم الافتراضي `SERVER_A`. لا توجد تعليمة `wallarm_mode` محددة في الكتلة `server` التي تتوافق مع الخادم `SERVER_A`، ولذا يتم تطبيق وضع الترشيح `monitoring` المحدد في الكتلة `http` على مثل هذه الطلبات.
2. تُطبِق قواعد وضع الترشيح المحددة في وحدة تحكم Wallarm على الطلبات المرسلة إلى الخادم الافتراضي `SERVER_B` باستثناء الطلبات التي تحتوي على المسار `/main/login`.
3. بالنسبة لتلك الطلبات التي ترسل إلى الخادم الافتراضي `SERVER_B` وتحتوي على المسار `/main/login`، تطبق قواعد وضع الترشيح المحددة في وحدة تحكم Wallarm فقط إذا كانت تحدد وضع ترشيح أشد من وضع `monitoring`.

## مثال على تكوين وضع الترشيح

لننظر في مثال لتكوين وضع الترشيح التي تستخدم جميع الطرق المذكورة أعلاه.

### إعداد وضع الترشيح في ملف تكوين عقدة الترشيح

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

### إعداد وضع الترشيح في وحدة تحكم Wallarm

* [قاعدة الترشيح العامة](#setting-up-general-filtration-rule-in-wallarm-console): **الرصد**.
* [قواعد الترشيح](#setting-up-filtration-rules-in-rules-section):
    * إذا كان الطلب يلبي الشروط التالية:
        * الطريقة: `POST`
        * الجزء الأول من المسار: `main`
        * الجزء الثاني من المسار: `apply`,
        
        ثم ضبط وضع الترشيح على **الافتراضي**.
        
    * إذا كان الطلب يلبي الشرط التالي:
        * الجزء الأول من المسار: `main`,
        
        ثم ضبط وضع الترشيح على **الحظر**.
        
    * إذا كان الطلب يلبي الشروط التالية:
        * الجزء الأول من المسار: `main`
        * الجزء الثاني من المسار: `login`,
        
        ثم ضبط وضع الترشيح على **الرصد**.

### أمثلة على الطلبات المرسلة إلى الخادم `SERVER_A`

أمثلة على الطلبات المرسلة إلى الخادم المكون `SERVER_A` والإجراءات التي تطبقها عقدة الفلترة Wallarm عليها هي التالية:

* يتم معالجة الطلب الخبيث ذو المسار `/news` ولكنه لا يتم حظره بسبب إعداد `wallarm_mode monitoring;` للخادم `SERVER_A`.

* يتم معالجة الطلب الخبيث ذو المسار `/main` ولكنه لا يتم حظره بسبب إعداد `wallarm_mode monitoring;` للخادم `SERVER_A`.

    لا يتم تطبيق القاعدة **الحظر** المحددة في وحدة تحكم Wallarm عليه بسبب إعداد `wallarm_mode_allow_override off;` للخادم `SERVER_A`.

* يتم حظر الطلب الخبيث ذو المسار `/main/login` بسبب إعداد `wallarm_mode block;` للطلبات ذات المسار `/main/login`.

    لا يتم تطبيق قاعدة **الرصد** المحددة في وحدة تحكم Wallarm عليه بسبب إعداد `wallarm_mode_allow_override strict;` في ملف تكوين العقدة التابع التفصيلي للفلترة.

* يتم حظر الطلب الخبيث ذو المسار `/main/signup` بسبب إعداد `wallarm_mode_allow_override strict;` للطلبات ذات المسار `/main/signup` والقاعدة **الحظر** المحددة في وحدة تحكم Wallarm للطلبات ذات المسار `/main`.
* يتم حظر الطلب الخبيث ذو المسار `/main/apply` والطريقة `GET` بسبب إعداد `wallarm_mode_allow_override on;` للطلبات ذات المسار `/main/apply` والقاعدة **الحظر** المحددة في وحدة تحكم Wallarm للطلبات ذات المسار `/main`.
* يتم حظر الطلب الخبيث ذو المسار `/main/apply` والطريقة `POST` بسبب إعداد `wallarm_mode_allow_override on;` للطلبات ذات المسار `/main/apply`، والقاعدة **الافتراضية** المحددة في وحدة تحكم Wallarm، وإعداد `wallarm_mode block;` للطلبات ذات المسار `/main/apply` في ملف تكوين العقدة التابعة للترشيح.

## أفضل الممارسات حول تطبيق وضع الترشيح بشكل تدريجي

للارتقاء بنجاح بعقدة Wallarm جديدة، اتبع هذه التوصيات الخطوة بخطوة لتبديل أوضاع الترشيح:

1. قم بتنفيذ عقد الترشيح Wallarm في بيئاتك غير المنتجة مع تعيين وضع التشغيل على `monitoring`.
1. قم بتنفيذ عقد الترشيح Wallarm في بيئتك الإنتاجية مع تعيين وضع التشغيل على `monitoring`.
1. احتفظ بتدفق الحركة عبر عقد الترشيح في جميع بيئاتك (بما في ذلك الاختبار والإنتاج) لمدة 7-14 يومًا لإعطاء الوقت الكافي للنهاية الخلفية القائمة على السحاب من Wallarm للتعلم عن تطبيقك.
1. قم بتفعيل وضع الحظر `block` من Wallarm في جميع بيئاتك غير المنتجة واستخدم الاختبارات الأوتوماتيكية أو اليدوية لتأكيد أن التطبيق المحمي يعمل كما هو متوقع.
1. قم بتفعيل وضع الحظر `block` في بيئة الإنتاج واستخدم الطرق المتاحة لتأكيد أن التطبيق يعمل كما هو متوقع.