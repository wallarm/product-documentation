[rule-creation-options]:    ../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../user-guides/rules/request-processing.md

# إجراءات كشف الهجمات

تقوم منصة Wallarm بتحليل مرور التطبيق بشكل مستمر وتقلل الطلبات الخبيثة في الوقت الفعلي. من خلال هذه المقالة، ستتعلم أنواع الموارد التي تحميها Wallarm من الهجمات، وطرق كشف الهجمات في المرور وكيف يمكنك تتبع وإدارة التهديدات المكتشفة.

## ما هو الهجوم وما هي مكونات الهجوم؟

<a name="attack"></a>**الهجوم** هو ضربة واحدة أو ضربات متعددة مجمعة بحسب الخصائص التالية:

* نفس نوع الهجوم، العامل مع الشحنة الخبيثة، والعنوان الذي تم إرسال الضربات إليه. قد تأتي الضربات من نفس عنوان الأي بي أو من عناوين مختلفة ولديها قيم مختلفة للأحمال الخبيثة ضمن نوع هجوم واحد.

    هذه طريقة تجميع الضربات الأساسية وتطبق على جميع الضربات.
* نفس عنوان الأي بي المصدر إذا تم تمكين [تجميع الضربات حسب الأي بي المصدر](../user-guides/events/analyze-attack.md#grouping-of-hits). يمكن أن تختلف قيم بارامتر الضربات الأخرى.

   تعمل هذه طريقة تجميع الضربات لجميع الضربات باستثناء ما يلي من أنواع الهجمات brute force، Forced browsing، BOLA (IDOR)، Resource overlimit، Data bomb و Virtual patch.

    إذا تم تجميع الضربات بواسطة هذه الطريقة، فإن الزر [**تمييز كإيجابي كاذب**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) وخيار [التحقق النشط من التهديد](detecting-vulnerabilities.md#active-threat-verification) لا تتوافر للهجوم.

طرق تجميع الضربات المدرجة لا تستبعد بعضها البعض. إذا كانت للضربات خصائص كلا الطريقتين، فيتم تجميعها جميعًا في هجوم واحد.

<a name="hit"></a>**الضربة** هي طلب خبيث متسلسل (طلب خبيث أصلي والبيانات الوصفية التي أضيفت من قبل node Wallarm). إذا كشفت Wallarm عدة أحمال خبيثة من أنواع مختلفة في طلب واحد، تسجل Wallarm عدة ضربات مع أحمال من نوع واحد في كل ضربة.

<a name="malicious-payload"></a>**الحمولة الخبيثة** هي جزء من الطلب الأصلي يحتوي على العناصر التالية:

* علامات الهجوم المكتشفة في طلب. إذا تم كشف عدة علامات لهجوم تتميز بنفس نوع الهجوم في الطلب، سيتم تسجيل العلامة الأولى فقط في الحمولة.
* سياق علامة الهجوم. السياق هو مجموعة الرموز التي تسبق وتغلق العلامات الهجوم المكتشفة. نظرًا لأن طول الحمولة محدود، يمكن تجاهل السياق إذا كانت علامة الهجوم طول الحمولة الكاملة.

   نظرًا لأن علامات الهجوم لا تُستخدم للكشف عن [الهجمات السلوكية](#behavioral-attacks)، فإن الطلبات التي تم إرسالها كجزء من الهجمات السلوكية تحتوي على أحمال فارغة. 

## أنواع الموارد المحمية

تحلل عقد Wallarm المرور HTTP وWebSocket المرسلة إلى الموارد المحمية:

* تم تمكين تحليل المرور HTTP بشكل افتراضي.

    تحلل عقد Wallarm المرور HTTP لـ [هجمات التحقق من صحة الإدخال](#input-validation-attacks) و [الهجمات السلوكية](#behavioral-attacks).
* يجب تمكين تحليل مرور WebSocket إضافيًا عبر التوجيه [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    تحلل عقد Wallarm مرور WebSocket فقط لـ [هجمات التحقق من صحة الإدخال](#input-validation-attacks).

يمكن تصميم واجهة برمجة التطبيق (API) المحمية على أساس التقنيات التالية (محدودة تحت [خطة الاشتراك](subscription-plans.md#subscription-plans) WAAP):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## عملية كشف الهجوم

لكشف الهجمات، تستخدم Wallarm العملية التالية:

1. تحديد تنسيق الطلب و [تحليل](../user-guides/rules/request-processing.md) كل جزء طلب.
2. تحديد النقطة النهائية التي تمت معالجة الطلب إليها.
3. تطبيق [قواعد مخصصة](../user-guides/rules/rules.md) لتحليل الطلب تم تكوينها في وحدة تحكم Wallarm.
4. اتخاذ قرار حول ما إذا كان الطلب خبيثًا أم لا بناءً على [القواعد الافتراضية](#tools-for-attack-detection) والقواعد المخصصة.

## أنواع الهجمات

تحمي حلول Wallarm ، والخدمات المصغرة والتطبيقات الويب من التهديدات [OWASP Top 10](https://owasp.org/www-project-top-ten/) و [OWASP API Top 10](https://owasp.org/www-project-api-security/) وتعرض API وغيرها من التهديدات الآلية.

فنيًا، تنقسم جميع الهجمات التي يمكن اكتشافها بواسطة Wallarm إلى مجموعات:

* هجمات التحقق من صحة الإدخال
* الهجمات السلوكية

يعتمد طريقة الكشف عن الهجمات على مجموعة الهجمات. لاكتشاف الهجمات السلوكية، يتطلب تكوين عقدة Wallarm إضافية.

### هجمات التحقق من صحة الإدخال

تتضمن هجمات التحقق من صحة الإدخال SQL Injection, cross‑site scripting, remote code execution, Path Traversal وغيرها من أنواع الهجمات. يتميز كل نوع هجوم بمجموعات الرموز المحددة المرسلة في الطلبات. لكشف هجمات التحقق من صحة الإدخال، يُطلب إجراء تحليل بناء الجملة للطلبات - تحليلهم للكشف عن مجموعات رموز محددة.

تكشف Wallarm عن هجمات التحقق من صحة الإدخال في أي جزء من الطلب بما في ذلك الملفات الثنائية مثل SVG، JPEG، PNG، GIF، PDF، etc باستخدام الأدوات المدرجة [tools](#tools-for-attack-detection).

تم تمكين الكشف عن هجمات التحقق من صحة الإدخال لجميع العملاء بشكل افتراضي.

### الهجمات السلوكية

تتضمن الهجمات السلوكية الأنواع التالية من الهجمات:

* [هجمات brute‑force](../admin-en/configuration-guides/protecting-against-bruteforce.md) تتضمن القوة القسرية لكلمة المرور، قوة قسرية لidentifier الموسم، stuffing للأوراق المالية. هذه الهجمات تتميز بعدد كبير من الطلبات ذات القيم الامتحانية المختلفة المرسلة إلى URI النموذجي لمدة زمنية محدودة.

   على سبيل المثال، إذا أجبر المهاجم كلمة المرور، يمكن إرسال العديد من الطلبات المشابهة مع قيم `password` مختلفة إلى عنوان URL لاستيثاق المستخدم:

   ```bash
   https://example.com/login/?username=admin&password=123456
   ```
* تتميز [هجمات Forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) بعدد كبير من رموز الاستجابة 404 التي تم إرجاعها إلى الطلبات إلى وحدات المعالجة المركزية المختلفة لمدة زمنية محدودة.

   على سبيل المثال، هدف هذا الهجوم قد يكون تعداد والوصول إلى الموارد المخفية (مثل دلائل وملفات تحتوي على معلومات حول مكونات التطبيق) لاستخدام هذه المعلومات لأداء أنواع هجمات أخرى.

* [هجمات BOLA (IDOR)](../admin-en/configuration-guides/protecting-against-bola-trigger.md) التي تستغل الثغرة بنفس الاسم. تسمح هذه الثغرة للمهاجم بالوصول إلى كائن بواسطة معرفه عبر طلب API وإما الحصول على بياناته أو تعديلها متجاوزة آلية التفويض.

   على سبيل المثال، إذا أجبر المهاجم معرف المتجر للعثور على معرف حقيقي والحصول على البيانات المالية للمتجر المقابل:

   ```bash
   https://example.com/shops/{shop_id}/financial_info
   ```

   إذا لم يتطلب التفويض لمثل التي تتعلق API، يمكن للمهاجم الحصول على البيانات المالية الحقيقية واستخدامها لأغراضه.

#### الكشف

لكشف الهجمات السلوكية، من الضروري إجراء تحليل بناء الجملة للطلبات وتحليل الترابط لعدد الطلبات والوقت بين الطلبات.

يتم إجراء التحليل المرتبط عند تجاوز العتبة لعدد الطلبات المرسلة للتوثيق المستخدم أو دليل ملف الموارد أو الرابط لكائن محدد. يجب تعيين العتبة لعدد الطلبات لتقليل خطر حجب الطلبات المشروعة (على سبيل المثال، عندما يدخل المستخدم كلمة المرور غير الصحيحة في حسابه عدة مرات).

* يتم إجراء التحليل المرتبط بواسطة وحدة postanalytics من Wallarm.
* يتم المقارنة بين عدد الطلبات الواردة والحد العتبة لعدد الطلبات، وحجب الطلبات في السحابة Wallarm.

عند الكشف عن هجوم سلوكي، يتم حجب مصادر الطلب، وبالتحديد العناوين الأي بي التي تم إرسال الطلبات منها يتم إضافتها إلى القائمة المرفوضة.

#### الحماية

لحماية المورد ضد الهجمات السلوكية، من الضروري تعيين الحد الأدنى لتحليل الترابط والروابط التي تكون عرضة للهجمات السلوكية:

* [تعليمات تكوين حماية القوة القسرية](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [تعليمات تكوين حماية تصفح القوة القسرية](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [تعليمات تكوين حماية BOLA (IDOR)](../admin-en/configuration-guides/protecting-against-bola-trigger.md)

## أدوات كشف الهجوم

لكشف الطلبات الخبيثة، تحلل عقد Wallarm [جميع الطلبات](#attack-detection-process) المرسلة إلى المورد المحمي باستخدام الأدوات التالية:

* مكتبة **libproton**
* مكتبة **libdetection**
* القواعد المخصصة لتحليل الطلب

### المكتبة libproton

مكتبة **libproton** هي الأداة الأولية لكشف الطلبات الخبيثة. تُستخدم المكتبة مكون **proton.db** الذي يحدد علامات نوع الهجوم المختلفة كتسلسلات رمز، على سبيل المثال: `union select` لـ [نوع هجوم الحقن SQL](../attacks-vulns-list.md#sql-injection). إذا احتوى الطلب على تسلسل رمز يطابق التسلسل من **proton.db**، يُعتبر هذا الطلب هجومًا من النوع المقابل.

تقوم Wallarm بتحديث proton.db بشكل منتظم مع تسلسلات الرموز لأنواع الهجمات الجديدة ولأنواع الهجمات الموصوفة بالفعل.

### المكتبة libdetection

#### نظرة عامة على libdetection

تقوم المكتبة [**libdetection**](https://github.com/wallarm/libdetection) بالتحقق إضافيًا من الهجمات التي تم كشفها بواسطة المكتبة **libproton** على النحو التالي:

* إذا أكدت **libdetection** علامات الهجوم التي تم كشفها بواسطة **libproton**، يتم حجب الهجوم (إذا كانت العقدة التصفية تعمل في وضع `block`) وتحميله إلى السحابة Wallarm.
* إذا لم **libdetection** تأكد من علامات الهجوم التي تم كشفها بواسطة **libproton**، يُعتبر الطلب مشروعًا، الهجوم لن يتم تحميله إلى السحابة Wallarm ولن يتم حجبه (إذا كانت العقدة التصفية تعمل في وضع `block`).

تضمن استخدام **libdetection** الكشف المزدوج عن الهجمات وتقليل عدد الإيجابيات الكاذبة.

!!! info "أنواع الهجمات التي تتم مصادقتها بواسطة مكتبة libdetection"
    حالياً، تصادق المكتبة **libdetection** فقط هجمات الحقن SQL.

#### كيفية عمل libdetection

الخاصية المميزة لـ **libdetection** هو أنه يحلل الطلبات ليس فقط لتسلسلات الرموز المحددة لأنواع الهجمات، ولكن أيضًا للسياق الذي تم إرسال التسلسل الرمزي فيه.

تحتوي المكتبة على سلاسل الأحرف لنماذج الهجوم المختلفة (الحقن SQL الآن). تسمى السلسلة كالسياق. مثال على السياق لنوع هجوم الحقن SQL:

```curl
SELECT example FROM table WHERE id=
```

تجري المكتبة تحليل الهجوم لمطابقة السياقات. إذا لم يتمتع الهجوم بمطابقة السياقات، فلن يتم تعريف الطلب على أنه خبيث ولن يتم حجبه (إذا كانت العقدة التصفية تعمل في وضع `block`).

#### اختبار libdetection

للتحقق من عملية **libdetection**، يمكنك إرسال الطلب الشرعي التالي إلى المورد المحمي:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* ستكشف المكتبة **libproton** `UNION SELECT` كعلامة هجوم الحقن SQL. نظرًا لأن `UNION SELECT` بدون أوامر أخرى ليست علامة لهجوم الحقن SQL، تكشف **libproton** إيجابية كاذبة.
* إذا كان التحليل للطلبات مع مكتبة **libdetection** ممكنًا، فلن يتم تأكيد علامة هجوم الحقن SQL في الطلب. سيعتبر الطلب مشروعًا، الهجوم لن يتم تحميله إلى السحابة Wallarm ولن يتم حجبه (إذا كانت العقدة التصفية تعمل في وضع `block`).

#### إدارة وضع libdetection

!!! info "وضع libdetection الافتراضي"
   الوضع الافتراضي للمكتبة **libdetection** هو `on/true` (مفعل) لجميع [خيارات النشر](../installation/supported-deployment-options.md).

يمكنك التحكم في وضع **libdetection** باستخدام:

* التوجيه [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) لـ NGINX.
* المتغير [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) لـ Envoy.
* واحد من [الخيارات](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode) لوحدة تحكم Wallarm NGINX Ingress:

   * التعليق التوضيحي `nginx.ingress.kubernetes.io/server-snippet` إلى موارد Ingress.
   * المتغير `controller.config.server-snippet` لـ Helm chart.

* التعليق التوضيحي `wallarm-enable-libdetection` [العلامة البيانية للنطاق](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list) لحلول Sidecar Wallarm.
* المتغير `libdetection` لـ [نشر AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module).

## تجاهل أنواع الهجمات المعينة

القاعدة **تجاهل أنواع الهجمات المعينة** تسمح بتعطيل الكشف عن أنواع معينة من الهجمات في عناصر الطلبات المعينة.

بشكل افتراضي، تقوم عقدة Wallarm بتمييز الطلب على أنه هجوم إذا كشفت علامات أي نوع هجوم في أي عنصر طلب. ومع ذلك، يمكن أن تكون بعض الطلبات التي تحتوي على علامات الهجمات شرعية بالفعل (على سبيل المثال يمكن أن يحتوي جسم الطلب الذي ينشر المنشور على منتدى المدير قاعدة البيانات على وصف [الأمر الخبيث SQL](../attacks-vulns-list.md#sql-injection)).

إذا قامت عقدة Wallarm بتمييز الحمولة القياسية للطلب على أنها خبيثة، تحدث [إيجابية كاذبة](#false-positives). لمنع الإيجابيات الكاذبة، تحتاج القواعد القياسية للكشف عن الهجمات إلى تعديل باستخدام القواعد المخصصة لأنواع معينة لاستيعاب التفاصيل المحمية للتطبيق. أحد أنواع القواعد المخصصة هو **تجاهل أنواع الهجمات المعينة**.

**إنشاء وتطبيق القاعدة**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**مثال على القاعدة**

قل أنه عند تأكيد المستخدم إصدار المنشور على منتدى مدير قاعدة البيانات، يرسل العميل طلب POST إلى النقطة النهائية `https://example.com/posts/`. لدي هذا الطلب الخصائص التالية:

* يتم تمرير محتوى المنشور في معلم الطلب الجسم `postBody`. قد يتضمن محتوى المنشور أوامر SQL التي يمكن أن يتم تمييزها من قبل Wallarm على أنها خبيثة.
* الجسم الطلب من النوع `application/json`.

مثال على طلب cURL التي تحتوي على [الحقن SQL](../attacks-vulns-list.md#sql-injection):

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

لذا، تحتاج إلى تجاهل الحقن SQL في المعلم `postBody` منطلبات الذهاب إلى `https://example.com/posts/`

للقيام بذلك، قم بتعيين القاعدة **تجاهل أنواع الهجمات المعينة** كما هو معروض على لقطة الشاشة:

![مثال على القاعدة "تجاهل أنواع الهجمات المعينة"](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## تجاهل علامات الهجوم المحددة في البيانات الثنائية

تُستخدم القواعد **السماح بالبيانات الثنائية** و **السماح بأنواع ملفات معينة** لضبط قواعد الكشف عن الهجمات القياسية للبيانات الثنائية.

بشكل افتراضي، تقوم عقدة Wallarm بتحليل الطلبات الواردة لجميع علامات الهجوم المعروفة. أثناء التحليل، قد لا تعتبر عقدة Wallarm علامات الهجوم أن تكون رموزاً ثنائيةً عاديةً وبالتالي تكتشف بالخطأ حمولات خبيثة في البيانات الثنائية.

باستخدام القواعد **السماح بالبيانات الثنائية** و **السماح بأنواع ملفات معينة**، يمكنك تحديد بشكل صريح عناصر الطلب التي تحتوي على بيانات ثنائية. خلال تحليل العنصر المحدد للطلب، ستتجاهل عقدة Wallarm علامات الهجوم التي لا يمكن أبدًا أن تمر في البيانات الثنائية.

* تسمح القاعدة **السماح بالبيانات الثنائية** بضبط دقيق للكشف عن الهجمات لعناصر الطلب التي تحتوي على بيانات ثنائية (على سبيل المثال، الملفات المضغوطة أو المشفرة).
* تسمح القاعدة **السماح بأنواع معينة من الملفات** بضبط دقيق للكشف عن الهجمات لعناصر الطلب التي تحتوي على أنواع ملفات معينة (على سبيل المثال، PDF، JPG).

**إنشاء وتطبيق القاعدة**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**مثال على القاعدة**

قل أنه عند تحميل المستخدم الملف الثنائي مع الصورة باستخدام النموذج على الموقع، يرسل العميل طلب POST من نوع `multipart/form-data` إلى `https://example.com/uploads/`. يتم تمرير الملف الثنائي في معلم الجسم `fileContents` وتحتاج إلى السماح بذلك.

للقيام بذلك، قم بتعيين القاعدة **السماح بالبيانات الثنائية** كما هو معروض على لقطة الشاشة::

![مثال على القاعدة "السماح بالبيانات الثنائية"](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## مراقبة وحجب الهجمات

**هجمات التحقق من صحة الإدخال**

يمكن أن تعالج Wallarm [هجمات التحقق من صحة الإدخال](#input-validation-attacks) في الأوضاع التالية:

* وضع المراقبة: تكتشف لكن لا تحجب الهجمات.
* وضع الحجب الآمن: تكتشف الهجمات ولكنها تحجب فقط تلك التي تنشأ من [الأي بي المدرجة في القائمة الرمادية](../user-guides/ip-lists/overview.md). لا يتم حجب الطلبات الشرعية التي تنشأ من أي بي مدرجة في القائمة الرمادية.
* وضع الحجب: تكتشف وتحجب الهجمات.

المعلومات التفصيلية حول كيفية عمل أوضاع التصفية المختلفة وكيفية تكوين وضع التصفية بشكل عام وللتطبيقات والنطاقات والنقاط النهائية محددة متاحة [هنا](../admin-en/configure-wallarm-mode.md).

**الهجمات السلوكية**

يتم تعريف كيف تكتشف Wallarm [الهجمات السلوكية](#behavioral-attacks) وتعمل في حالة كشفها ليس بواسطة وضع التصفية، ولكن بواسطة [تكوين محدد](#protection) لحماية هذا النوع من الهجمات.

## الإيجابيات الكاذبة

تحدث **الإيجابية الكاذبة** عندما يتم كشف علامات الهجوم في الطلب الشرعي أو عندما يتم التأهل الشرعي على أنه ثغرة. [مزيد من التفاصيل عن الإيجابيات الكاذبة في فحص الثغرات →](detecting-vulnerabilities.md#false-positives)

عند تحليل الطلبات بحثاً عن الهجمات، تستخدم Wallarm مجموعة قواعد قياسية توفر حماية مثلى للتطبيق بأدنى نسب ممكنة من الإيجابيات الكاذبة. بسبب التفاصيل المحمية للتطبيق، قد تعترف القواعد القياسية بالخطأ بعلامات الهجوم في الطلبات الشرعية. على سبيل المثال: قد يتم الكشف عن الحقن SQL في الطلب الذي يضيف منشورًا بوصف الاستعلام SQL الخبيث إلى منتدى مدير قاعدة البيانات.

في مثل هذه الحالات، يتعين ضبط القواعد القياسية لاستيعاب التفاصيل المحمية للتطبيق باستخدام الأساليب التالية:

* قم بتحليل الإيجابيات الكاذبة المحتملة (عن طريق تنقية جميع الهجمات بواسطة العلامة `!known`) وإذا تأكدت من الإيجابيات الكاذبة، [ضع علامة](../user-guides/events/false-attack.md) على الهجمات أو الضربات المناسبة بشكل ملائم. ستقوم Wallarm تلقائيًا بإنشاء القواعد التي تعطل التحليل للطلبات ذاتها عن علامات الهجوم المكتشفة.
* [تعطيل الكشف عن أنواع معينة من الهجمات](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) في الطلبات المعينة.
* [تعطيل الكشف عن علامات الهجوم معينة في البيانات الثنائية](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data).
* [تعطيل المحللات التي تم تطبيقها بالخطأ على الطلبات](../user-guides/rules/request-processing.md#managing-parsers).

تمثل تحديد ومعالجة الإيجابيات الكاذبة جزءًا من ضبط Wallarm لحماية التطبيقات الخاصة بك. نوصي بنشر العقدة Wallarm الأولى في [الوضع](#monitoring-and-blocking-attacks) التابع للمراقبة وتحليل الهجمات المكتشفة. إذا تم التعرف على بعض الهجمات بالخطأ كهجمات، قم بتمييزها كإيجابيات كاذبة وقم بتحويل العقدة التصفية إلى وضع الحجب.

## إدارة الهجمات المكتشفة

جميع الهجمات المكتشفة معروضة في وحدة تحكم Wallarm → قسم الهجمات بواسطة المرشح `attacks`. يمكنك إدارة الهجمات من خلال الواجهة على النحو التالي:

* عرض وتحليل الهجمات
* زيادة أولوية هجوم في قائمة قائمة الانتظار للفحص مرة أخرى
* تحديد الهجمات أو الضغطات المنفصلة كإيجابيات كاذبة
* إنشاء القواعد للتعامل المخصص مع الضغطات المنفصلة

![عرض الهجمات](../images/user-guides/events/check-attack.png)

## لوحات معلومات الهجمات

تقدم Wallarm لوحات معلومات شاملة لمساعدتك على البقاء على رأس الوضع الأمني الخاص بنظامك.

يقدم لوحة "الوقاية من الأهداف" [Threat Prevention](../user-guides/dashboards/threat-prevention.md) ، التابعة لـ Wallarm، مقاييس عامة حول وضعية الأمان الخاص بنظامك، بما في ذلك معلومات متعددة الجوانب حول الهجمات: مصادرهم، وأهدافهم، وأنواعهم وبروتوكولاتهم.

![لوحة الوقاية من الأهداف](../images/user-guides/dashboard/threat-prevention.png)

توفر اللوحة [OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md) رؤية مفصلة حول وضعية الأمان الخاصة بنظامك في مجال OWASP API Top 10 threats، بما في ذلك معلومات حول الهجمات.

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## الإخطارات حول الهجمات المكتشفة، والضربات والأحمال الخبيثة

يمكن أن ترسل Wallarm إليك إشعارات حول الهجمات المكتشفة، والضربات والأحمال الخبيثة. يتيح لك البقاء على علم بمحاولات الهجوم على نظامك وتحليل المرور الخبيث المكتشف على الفور. يشمل تحليل المرور الخبيث الإبلاغ عن الإيجابيات الكاذبة، والسماح بقائمة الـ IPs التي تنشأ منها الطلبات الشرعية ونفي قائمة IPs مصادر الهجوم.

لتكوين الإخطارات:

1. قم بتكوين [التكاملات الأصلية](../user-guides/settings/integrations/integrations-intro.md) مع الأنظمة لإرسال الإخطارات (على سبيل المثال PagerDuty، Opsgenie، Splunk، Slack، Telegram).
2. قم بتعيين الشروط لإرسال الإخطارات:

   * للحصول على الإخطارات حول كل ضربة مكتشفة، حدد الخيار المناسب في إعدادات التكامل.
   
     ??? info "انظر مثال على الإخطار حول ضربة مكتشفة في تنسيق JSON"
         ```json
         [
             {
                 "summary": "[Wallarm] تم اكتشاف ضربة جديدة",
                 "details": {
                 "client_name": "TestCompany",
                 "cloud": "EU",
                 "notification_type": "new_hits",
                 "hit": {
                     "domain": "www.example.com",
                     "heur_distance": 0.01111,
                     "method": "POST",
                     "parameter": "SOME_value",
                     "path": "/news/some_path",
                     "payloads": [
                         "say ni"
                     ],
                     "point": [
                         "post"
                     ],
                     "probability": 0.01,
                     "remote_country": "PL",
                     "remote_port": 0,
                     "remote_addr4": "8.8.8.8",
                     "remote_addr6": "",
                     "tor": "none",
                     "request_time": 1603834606,
                     "create_time": 1603834608,
                     "response_len": 14,
                     "response_status": 200,
                     "response_time": 5,
                     "stamps": [
                         1111
                     ],
                     "regex": [],
                     "stamps_hash": -22222,
                     "regex_hash": -33333,
                     "type": "sqli",
                     "block_status": "monitored",
                     "id": [
                         "hits_production_999_202010_v_1",
                         "c2dd33831a13be0d_AC9"
                     ],
                     "object_type": "hit",
                     "anomaly": 0
                     }
                 }
             }
         ]
         ```
   
   * لتعيين الحد الأدنى لعدد الهجمات، أو الضربات أو الأحمال الخبيثة والحصول على الإشعارات عند تجاوز الحد، قم بتكوين [المشغلات](../user-guides/triggers/triggers.md) المناسبة.

## فيديوهات توضيحية

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
