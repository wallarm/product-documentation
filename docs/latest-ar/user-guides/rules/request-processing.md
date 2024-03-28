[خيارات-إنشاء-القواعد]: ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[معالجة-الطلبات]: ../../user-guides/rules/request-processing.md

# تحليل الطلبات

عند تحليل الطلبات، يستخدم العقدة الفلترة في Wallarm مجموعة شاملة من المحللات. بعد تحديد أجزاء الطلب، يتم تطبيق المحللات بتسلسل على كل منها لتوفير الإعدادات الفوقية للطلبات التي ستستخدم في الكشف عن الهجمات. المحللات المتاحة، منطق استخدامها والتكوينات الممكنة لهذا المنطق وصفت في هذه المقالة.

لاجراء تحليل فعال، تتبع Wallarm القواعد التالية:

* العمل مع نفس البيانات كالتطبيق المحمي. على سبيل المثال:

    إذا نقدم التطبيق أداة JSON API، فإن المعلمات المعالجة ستتم ترميزها أيضًا في تنسيق JSON. للحصول على قيم المعامل، يستخدم Wallarm محلل JSON. هناك أيضا حالات أكثر تعقيدًا حيث يتم ترميز البيانات عدة مرات - مثلا، JSON إلى Base64 إلى JSON. تتطلب هذه الحالات فك الترميز بعدة محللات.

* يجب اعتبار سياق معالجة البيانات. على سبيل المثال:

    يمكن تمرير المعامل `name` في طلبات الإنشاء كاسم المنتج وكاسم المستخدم. ومع ذلك، قد يكون كود المعالجة لمثل هذه الطلبات مختلف. لتحديد طريقة تحليل مثل هذه المعلمات، قد يستخدم Wallarm عنوان URL الذي تم إرسال الطلبات منه أو معاملات أخرى.

## تحديد وتحليل أجزاء الطلب

ابتداءً من القسم الأعلى من طلب HTTP، يحاول العقدة الفلترة تطبيق كل من المحللات المناسبة بتسلسل على كل جزء. قائمة المحللات التي تم تطبيقها تعتمد على طبيعة البيانات ونتائج التدريب السابق للنظام.

الإخراج من المحللات يصبح مجموعة إضافية من المعلمات التي يجب تحليلها بطريقة مماثلة. في بعض الأحيان، يصبح الإخراج من المحللات بنية معقدة مثل JSON، array، أو associative array.

!!! info "وسوم المحلل"
    لكل محلل معرف (وسم). على سبيل المثال، `header` لمحلل رؤوس الطلب. يتم عرض مجموعة الوسوم التي تم استخدامها في تحليل الطلب في واجهة Wallarm Console ضمن تفاصيل الحدث. توضح هذه البيانات الجزء من الطلب حيث تم الكشف عن الهجوم والمحللات التي تم استخدامها.

    على سبيل المثال، إذا كان هناك هجوم تم الكشف عنه في العنوان `SOAPACTION`:

    ![مثال على الوسم](../../images/user-guides/rules/tags-example.png)

### عنوان URL

كل طلب HTTP يحتوي على عنوان URL. للعثور على الهجمات، يحلل العقدة الفلترة كلاً من القيمة الأصلية ومكوناتها الفردية: **المسار**، **اسم العمل**، **امتداد العمل**، **الاستعلام**.

الوسوم التالية تتوافق مع محلل عنوان URL:

* **uri** للقيمة الأصلية لعنوان الـURL بدون النطاق (مثلا، `/blogs/123/index.php?q=aaa` للطلب المرسل إلى `http://example.com/blogs/123/index.php?q=aaa`).
* **path** للمصفوفة مع أجزاء عنوان الـURL المفصولة برمز `/` (الجزء الأخير من عنوان URL ليس مدرج في المصفوفة). إذا كان هنالك جزء واحد فقط في عنوان URL، ستكون المصفوفة فارغة.
* **action_name** للجزء الأخير من عنوان URL بعد الرمز `/` وقبل النقطة الأولى (`.`). هذا الجزء من عنوان URL موجود دائما في الطلب، حتى ولو كانت قيمته سلسلة فارغة.
* **action_ext** للجزء من عنوان URL بعد النقطة الأخيرة (`.`). قد يغيب في الطلب.

    !!! warning "الحدود بين **action_name** و **action_ext** عندما تكون هناك عدة نقاط"
        إذا كانت هناك عدة نقاط (`.`) في الجزء الأخير من عنوان URL بعد الرمز `/`، قد تحدث مشكلات مع الحدود بين **action_name** و **action_ext**، مثل:
        
        * تعيين الحدود بناءً على النقطة **الأولى**، على سبيل المثال:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * قد تكون بعض العناصر مفقودة بعد التحليل، للمثال أعلاه يمكن أن يكون:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        لتصحيح هذا، قم بتحرير **action_name** و **action_ext** يدويا في [نموذج التحرير المتقدم](rules.md#advanced-edit-form) لمنشئ URI.

* **query** ل[معايير سلسلة الاستعلام](#query-string-parameters) بعد الرمز `?`. 

مثلا:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### معايير سلسلة الاستعلام

تتم إرسال معايير سلسلة الاستعلام إلى التطبيق في عنوان الـURL للطلب بعد الحرف `?` بالتنسيق `key=value`. الوسم **query** يتوافق مع المحلل.

مثال على الطلب | معايير سلسلة الاستعلام والقيم
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### عنوان IP لأصل الطلب

الوسيط المطلوب لعنوان IP لأصل الطلب في قواعد Wallarm هو `remote_addr`. يتم استخدام هذا الوسيط فقط في القاعدة [**تحديد حد الطلبات**](rate-limiting.md) لتحديد الطلبات لكل الأي بي.

### الرؤوس

تتم تقديم الرؤوس في طلب HTTP وبعض التنسيقات الأخرى (مثلا، **multipart**). الوسم **header** يتوافق مع المحلل. دائما ما يتم تحويل أسماء الرؤوس إلى حالة علوية.

مثلا:

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

* `[header, 'HOST']` — `example.com`
* `[header, 'X-TEST', array, 0]` — `aaa`
* `[header, 'X-TEST', array, 1]` — `aaa`
* `[header, 'X-TEST', pollution]` — `aaa,bbb`

### البيانات الفوقية

الوسوم التالية تتوافق مع محلل بيانات فوقية الطلب HTTP:

* **post** لجسم الطلب HTTP
* **method** لطريقة الطلب HTTP: `GET`, `POST`, `PUT`, `DELETE`
* **proto** لنسخة بروتوكول HTTP
* **scheme**: http/https
* **application** لمعرف التطبيق

### محللات إضافية

قد تتطلب أجزاء الطلب المعقدة تحليل إضافي (مثلا، إذا تم ترميز البيانات في Base64 أو عرضها في تنسيق المصفوفة). في هذه الحالات، يتم تطبيق المحللات المدرجة أدناه بشكل إضافي على أجزاء الطلب.

#### base64

يفك ضغط البيانات المشفرة في Base64، ويمكن تطبيقه على أي جزء من الطلب.

#### gzip

يفك ضغط البيانات المضغوطة بواسطة GZIP، ويمكن تطبيقه على أي جزء من الطلب.

#### htmljs

يحول رموز HTML وJS إلى التنسيق النصي، ويمكن تطبيقه على أي جزء من الطلب.

مثلا: `&#x22;&#97;&#97;&#97;&#x22;` سوف يتم تحويلها إلى `"aaa"`.

#### json_doc

يحلل البيانات بتنسيق JSON، ويمكن تطبيقه على أي جزء من الطلب.

المرشحات:

* **json_array** أو **array** لقيمة عنصر الصف
* **json_obj** أو **hash** لقيمة مفتاح الصف المرتبط (`key:value`)

مثلا:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

يحلل البيانات بتنسيق XML، ويمكن تطبيقه على أي جزء من الطلب.

المرشحات:

* **xml_comment** لصف مع التعليقات في جسم وثيقة XML
* **xml_dtd** لعنوان الخطة الخارجية للتوثيقة التي يتم استخدامها
* **xml_dtd_entity** لصف محدد في الوثيقة المعرفة بـ Entity DTD
* **xml_pi** لصف الأوامر المستخدمة في المعالجة
* **xml_tag** أو **hash** لصف مرتبط من الوسوم
* **xml_tag_array** أو **array** لصف قيم الوسم
* **xml_attr** لصف مرتبط من الصفات؛ يمكن استخدامها فقط بعد فلتر **xml_tag**

محلل XML لا يميز بين محتويات الوسم والعنصر الأول في صف قيم الوسم. أي أن المعلمات `[..., xml, xml_tag, 't1']` و `[..., xml, xml_tag, 't1', array, 0]` متطابقة وقابلة للتبادل.

مثلا:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

يحلل صف البيانات. يمكن تطبيقه على أي جزء من الطلب.

مثلا:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

يحليل الصف الذي يحتوي على بيانات ذات صلة (`key:value`)، ويمكن تطبيقه على أي جزء من الطلب.

مثلا:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

يجمع قيم المعاملات التي تحمل نفس الاسم، ويمكن تطبيقه على أي جزء من الطلب بالتنسيق الأصلي أو المفكوك.

مثلا:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

يفك ضغط رموز العنوان، ويمكن تطبيقه فقط على مكون **uri** من العنوان.

#### cookie

يحلل معاملات الطلب Cookie، ويمكن تطبيقه فقط على رؤوس الطلب.

مثلا:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

يحلل جسم الطلب الذي تم تمريره في تنسيق `application/x-www-form-urlencoded`، ويمكن تطبيقه فقط على جسم الطلب.

مثلا:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, form_urlencoded, 'p1']` — `1`
* `[post, form_urlencoded, 'p2', hash, 'a']` — `2`
* `[post, form_urlencoded, 'p2', hash, 'b']` — `3`
* `[post, form_urlencoded, 'p3', array, 0]` — `4`
* `[post, form_urlencoded, 'p3', array, 1]` — `5`
* `[post, form_urlencoded, 'p4', array, 0]` — `6`
* `[post, form_urlencoded, 'p4', array, 1]` — `7`
* `[post, form_urlencoded, 'p4', pollution]` — `6,7`

**grpc** <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

يحلل طلبات واجهة البرمجة API من gRPC، ويمكن تطبيقه فقط على جسم الطلب.

يدعم فلتر **protobuf** لبيانات Protocol Buffers.

#### multipart

يحلل جسم الطلب الذي تم تمريره في تنسيق `multipart`، ويمكن تطبيقه فقط على جسم الطلب.

يدعم فلتر **header** للرؤوس في جسم الطلب.

مثلا:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, multipart, 'p1']` — `1`
* `[post, multipart, 'p2', hash, 'a']` — `2`
* `[post, multipart, 'p2', hash, 'b']` — `3`
* `[post, multipart, 'p3', array, 0]` — `4`
* `[post, multipart, 'p3', array, 1]` — `5`
* `[post, multipart, 'p4', array, 0]` — `6`
* `[post, multipart, 'p4', array, 1]` — `7`
* `[post, multipart, 'p4', pollution]` — `6,7`

إذا تم تحديد اسم الملف في العنوان `Content-Disposition`، فإن الملف يعتبر كأنه تم تحميله في هذا المعامل. سيكون المعامل على الشكل التالي:

* `[post, multipart, 'someparam', file]` — contents of the file

#### viewstate

مصمم لتحليل حالة الجلسة. يستخدم هذة التكنولوجيا من قبل Microsoft ASP.NET، ويمكن تطبيقه فقط على جسم الطلب.

المرشحات:

* **viewstate_array** لصف
* **viewstate_pair** لصف
* **viewstate_triplet** لصف
* **viewstate_dict** لصف مرتبط
* **viewstate_dict_key** للسلسلة
* **viewstate_dict_value** للسلسلة
* **viewstate_sparse_array** لصف مرتبط

#### jwt

يحلل الرموز JWT ويمكن تطبيقه على أي جزء من الطلب.

يعيد محلل JWT النتائج في المعلمات التالية وفقا لهيكل JWT المكتشف:

* `jwt_prefix`: أحد البادئات القيمة لـ JWT المدعومة - lsapi2, mobapp2, bearer. يقرأ المحلل قيمة البادئة في أي تسجيل.
* `jwt_header`: عنوان JWT. بمجرد الحصول على القيمة، يطبق Wallarm عادة أيضا المحللين [`base64`](#base64) و [`json_doc`](#json_doc) عليه.
* `jwt_payload`: حمولة JWT. بمجرد الحصول على القيمة، يطبق Wallarm عادة أيضا المحللين [`base64`](#base64) و [`json_doc`](#json_doc) عليه.

يمكن تمرير الرموز JWT في أي جزء من الطلب. لذلك، قبل تطبيق محلل `jwt` يستخدم Wallarm محلل الجزء الطلب المحدد، مثلا، [`query`](#query-string-parameters) أو [`header`](#headers).

مثال على الـ JWT الممرر في العنوان `Authentication`:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

عند تعريف عنصر الطلب الذي يتم تطبيق الـ [قاعدة](rules.md) عليه:

* اختر أولا محلل الجزء الطلب الذي يحتوي JWT
* حدد أحد المعاملات `jwt_*` المدرجة كقيمة لمحلل `jwt`، مثلا، لقيمة معامل الحمولة `name` JWT :

![JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

### التشدد

يتم تطبيق التشدد على محللات البيانات من أنواع الصف والمفتاح. يتم استخدام التشدد لتحديد حدود تحليل البيانات. تتم الإشارة إلى قيمة التشدد في وسم المحلل. مثلا: **hash_all**، **hash_name**.

إذا لم يتم تحديد التشدد، فيتم تمرير معرف الكيان الذي يتطلب المعالجة إلى المحلل. على سبيل المثال: يتم تمرير اسم كائن JSON أو معرف آخر بعد **hash**.

**all**

يستخدم للحصول على قيم جميع العناصر، المعملات، أو الأجسام. مثلا:

* **path_all** لجميع أجزاء المسار URL
* **query_all** لجميع قيم معايير سلسلة الاستعلام
* **header_all** لجميع قيم الرؤوس
* **array_all** لجميع قيم عناصر الصف
* **hash_all** لجميع قيم الكائنات JSON أو الصفات xml
* **jwt_all** لجميع قيم JWT

**name**

يستخدم للحصول على أسماء جميع العناصر، المعايير، أو الأجسام. على سبيل المثال:

* **query_name** لجميع أسماء معايير سلسلة الاستعلام
* **header_name** لجميع أسماء الرؤوس
* **hash_name** لجميع أسماء الكائنات JSON أو الصفات xml
* **jwt_name** لأسماء جميع المعاملات التي تحمل JWT

## التحكم في المحللات

بشكل افتراضي، عند تحليل الطلب، يحاول موضع Wallarm تطبيق كل من [المحللات](request-processing.md) المناسبة تسلسلا على كل عنصر من الطلب. ومع ذلك، يمكن تطبيق بعض المحللات بشكل خاطئ وكنتيجة لذلك، قد يكشف موضع Wallarm عن علامات هجوم عقب فك الترميز.

على سبيل المثال: قد يحدد موضع Wallarm بشكل خاطئ البيانات غير المشفرة كمشفرة في [Base64](https://en.wikipedia.org/wiki/Base64)، حيث أنه يتم استخدام الرموز الأبجدية للـ Base64 في النص العادي، وقيم الرموز، وقيم UUID وتنسيقات البيانات الأخرى. إذا تم فك ترميز البيانات غير المشفرة والكشف عن علامات الهجوم في القيمة الناتجة، فيعتبر ذلك [إيجابي كاذب](../../about-wallarm/protecting-against-attacks.md#false-positives).

لتجنب الإيجابيات الكاذبة في هكذا حالات، يوفر Wallarm قاعدة **تعطيل/تمكين محلل الطلب** لتعطيل المحللات التي تم تطبيقها بشكل خاطئ على بعض عناصر الطلب.

**انشاء وتطبيق القاعدة**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**مثال على القاعدة**

لنفترض أن الطلبات إلى `https://example.com/users/` تتطلب العنوان التوثيقي `X-AUTHTOKEN`. قد تحتوي قيمة العنوان على تركيبات الرموز الخاصة (مثلا، `=` في النهاية) التي قد تتم ترجمتها بشكل غير صحيح من قبل Wallarm باستخدام محلل `base64` مما يؤدي إلى الكشف الكاذب عن علامة هجوم. تحتاج إلى منع هذا الترميز لتجنب الإيجابيات الكاذبة.

للقيام بذلك، قم بتعيين القاعدة **تعطيل/تمكين محلل الطلب** كما هو معروض في الصورة الشاشة:

![Example of the rule "Disable/Enable request parser"](../../images/user-guides/rules/disable-parsers-example.png)