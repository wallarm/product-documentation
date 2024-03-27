[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md

# تحليل الطلبات

لتحليل الطلبات بطريقة فعالة، تتبع Wallarm المبادئ التالية:

* العمل مع نفس البيانات كالتطبيق المحمي. على سبيل المثال:
    إذا كان التطبيق يقدم واجهة برمجة تطبيقات JSON، فإن العوامل المعالجة ستتم تشفيرها أيضا في تنسيق JSON. للحصول على قيم العوامل، تستخدم Wallarm مُحلل JSON. هناك أيضا حالات أكثر تعقيدًا حيث يتم تشفير البيانات عدة مرات - على سبيل المثال، JSON إلى Base64 إلى JSON. تتطلب مثل هذه الحالات فك التشفير باستخدام عدة مُحللات.

* النظر في سياق معالجة البيانات. على سبيل المثال:

    يمكن تمرير العامل `name` في طلبات الإنشاء كاسم المنتج وكاسم المستخدم. ومع ذلك، قد يكون كود معالجة مثل هذه الطلبات مختلفًا. لتحديد طريقة تحليل مثل هذه العوامل، قد تستخدم Wallarm عنوان URL الذي تم إرسال الطلبات منه أو عوامل أخرى.

## تحديد وتحليل أجزاء الطلب

بدءًا من الطبقة العليا للطلب HTTP، يحاول العقدة المُصفِّي تطبيق كل من المُحللات المناسبة على كل جزء تسلسليًا. تعتمد قائمة المُحلات المطبقة على طبيعة البيانات ونتائج التدريب السابقة للنظام.

تتحول الخرج من المُحللات إلى مجموعة إضافية من العوامل التي يجب تحليلها بطريقة مماثلة. أحيانًا يصبح خرج المُحللات بنية معقدة مثل JSON, array, أو associative array.

!!! info "علامات المُحلل"
    لكل مُحلل مُعرف (tag). على سبيل المثال، `header` لمُحلل عناوين الطلب. يتم عرض مجموعة العلامات المستخدمة في تحليل الطلب في التفاصيل الحدث داخل Wallarm Console. توضح هذه البيانات جزء الطلب الذي تم اكتشاف الهجوم فيه والمُحللات التي تم استخدامها.

    على سبيل المثال، إذا تم اكتشاف هجوم في `SOAPACTION` العنوان:

    ![مثال علامة](../../images/user-guides/rules/tags-example.png)

### عنوان URL

يحتوي كل طلب HTTP على عنوان URL. للعثور على الهجمات، تحلل العقدة المُصفِّي كلاً من القيمة الأصلية ومكوناتها الفردية: **path**, **action_name**, **action_ext**, **query**.

تتوافق العلامات التالية مع مُحلل عنوان URL:

* **uri** للقيمة الأصلية لعنوان URL دون النطاق (على سبيل المثال, `/blogs/123/index.php?q=aaa` للطلب المُرسل إلى `http://example.com/blogs/123/index.php?q=aaa`).
* **path** لمجموعة مع أجزاء URL مفصولة برمز `/` (لا يتم تضمين الجزء الأخير من URL في المجموعة). إذا كان هناك جزء واحد فقط في عنوان URL، فستكون المجموعة فارغة.
* **action_name** للجزء الأخير من عنوان URL بعد الرمز `/` وقبل النقاط الأولى (`.`). هذا الجزء من عنوان URL موجود دائمًا في الطلب، حتى لو كانت قيمته سلسلة فارغة.
* **action_ext** لجزء عنوان URL بعد النقاط الأخيرة (`.`). قد يكون مفقودًا في الطلب.

    !!! warning "الحدود بين **action_name** و **action_ext** عند وجود عدة فترات"
        إذا كانت هناك عدة فترات (`.`) في الجزء الأخير من عنوان URL بعد الرمز `/`، قد تحدث مشكلات في الحدود بين **action_name** و **action_ext**، مثل:
        
        * تعيين الحدود بناءً على الفترة **الأولى**، على سبيل المثال:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * بعض العناصر مفقودة بعد التحليل، للمثال أعلاه قد يكون هذا:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        لإصلاح هذا، قم بتعديل يدوياً نقاط **action_name** و **action_ext** في [نموذج التحرير المتقدم](rules.md#advanced-edit-form) للمنشئ URI.

* **query** ل[عوامل السلسلة الاستعلامية](#query-string-parameters) بعد الرمز `?`. 

مثال:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### عوامل السلسلة الاستعلامية

تتم مرور عوامل السلسلة الاستعلامية إلى التطبيق في عنوان URL للطلب بعد حرف `?` في الشكل `key=value`. العلامة **query** تتوافق مع المُحلل.

مثال الطلب | عوامل السلسلة الاستعلامية والقيم
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### عنوان IP الأصلي للطلب

تستخدم نقطة الطلب لعنوان IP الأصلي للطلب في قواعد Wallarm هي `remote_addr`. يتم استخدام هذه النقطة فقط في قاعدة [**تعيين الحد الأقصى للمعدل**](rate-limiting.md) للحد من الطلبات لكل IP.

### العناوين

يتم تقديم العناوين في الطلب HTTP وبعض الأشكال الأخرى (على سبيل المثال,**multipart**). العلامة **header** تتوافق مع المُحلل. تتم دائمًا تحويل أسماء العناوين إلى أحرف كبيرة.

مثال:

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

### البيانات الوصفية

تتوافق العلامات التالية مع مُحلل البيانات الوصفية للطلب HTTP:

* **post** لجسم الطلب HTTP
* **method** لطريقة الطلب HTTP: `GET`, `POST`, `PUT`, `DELETE`
* **proto** لنسخة البروتوكول HTTP
* **scheme**: http/https
* **application** لمُعرف التطبيق

### مُحلات إضافية

قد تتطلب أجزاء الطلب المعقدة تحليلاً إضافيًا (على سبيل المثال، إذا تم تشفير البيانات في Base64 أو تقديمها في تنسيق المصفوفة). في مثل هذه الحالات، يتم تطبيق المحليلات المدرجة أدناه على أجزاء الطلب بالإضافة إلى ذلك.

#### base64

يفك تشفير البيانات المُشفرة Base64، ويمكن تطبيقه على أي جزء من الطلب.

#### gzip

يفك تشفير البيانات المُشفرة GZIP، ويمكن تطبيقه على أي جزء من الطلب.

#### htmljs

يحول الرموز HTML وJS إلى تنسيق نصي، ويمكن تطبيقه على أي جزء من الطلب.

مثال: `&#x22;&#97;&#97;&#97;&#x22;` سيتم تحويله إلى `"aaa"`.

#### json_doc

يحلل البيانات بتنسيق JSON، ويمكن تطبيقه على أي جزء من الطلب.

الفلاتر:

* **json_array** أو **array** لقيمة عنصر المصفوفة
* **json_obj** أو **hash** لقيمة المفتاح associative array (`key:value`)

مثال:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

يحلل البيانات بتنسيق XML، ويمكن تطبيقه على أي جزء من الطلب.

الفلاتر:

* **xml_comment** لمصفوفة مع التعليقات في جسم وثيقة XML
* **xml_dtd** لعنوان الخط الخارجي المستخدم
* **xml_dtd_entity** لمصفوفة مُعرفة في المستند Entity DTD
* **xml_pi** لمصفوفة الأوامر للمعالجة
* **xml_tag** أو **hash** لمصفوفة associative من العلامات
* **xml_tag_array** أو **array** لمصفوفة قيم العلامة
* **xml_attr** لمصفوفة associative من السمات؛ يمكن استخدامه فقط بعد تصفية **xml_tag**

المحلل XML لا يميز بين محتوى العلامة والعنصر الأول في مصفوفة القيم للعلامة. يعني ذلك، العوامل `[..., xml, xml_tag, 't1']` و `[..., xml, xml_tag, 't1', array, 0]` متطابقة وقابلة للتبديل.

مثال:

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

* `[..., xml, xml_dtd_entity, 0]` — الاسم = `xxe`, القيمة = `aaaa`
* `[..., xml, xml_pi, 0]` — الاسم = `xml-stylesheet`, القيمة = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

يحلل مصفوفة البيانات. يمكن تطبيقه على أي جزء من الطلب.

مثال:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

يحلل مصفوفة البيانات associative (`key:value`), ويمكن تطبيقه على أي جزء من الطلب.

مثال:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

يجمع قيم العوامل بنفس الاسم, ويمكن تطبيقه على أي جزء من الطلب في التنسيق الأصلي أو المُشفر.

مثال:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

يفك تشفير رموز URL, ويمكن تطبيقه فقط على المكون **uri** من URL.

#### cookie

يحلل عوامل الطلب Cookie, ويمكن تطبيقه فقط على عناوين الطلب.

مثال:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

يحلل جسم الطلب المُمررة في تنسيق `application/x-www-form-urlencoded`, ويمكن تطبيقه فقط على جسم الطلب.

مثال:

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

يحلل طلبات واجهة برمجة التطبيقات gRPC، ويمكن تطبيقه فقط على جسم الطلب.

تدعم فلتر **protobuf** لبيانات Protocol Buffers.

#### multipart

يحلل جسم الطلب المُمررة بتنسيق `multipart`, ويمكن تطبيقه فقط على جسم الطلب.

تدعم فلتر **header** للعناوين في جسم الطلب.

مثال:

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

إذا تم تحديد اسم الملف في الرأس `Content-Disposition`, ثم يُعتبر الملف قيد التحميل في هذا المعلمة. سيكون المعلمة كما يلي:

* `[post, multipart, 'someparam', file]` — محتوى الملف

#### viewstate

مصممة لتحليل حالة الجلسة. يستخدم التكنولوجيا من قِبَل Microsoft ASP.NET, ويمكن تطبيقه فقط على جسم الطلب.

الفلاتر:

* **viewstate_array** لمصفوفة
* **viewstate_pair** لمصفوفة
* **viewstate_triplet** لمصفوفة
* **viewstate_dict** لمصفوفة associative
* **viewstate_dict_key** لسلسلة
* **viewstate_dict_value** لسلسلة
* **viewstate_sparse_array** لمصفوفة associative

#### jwt

يحلل الرموز JWT ويمكن تطبيقه على أي جزء من الطلب.

يُعيد مُحلل JWT النتيجة في العوامل التالية وفقًا لبنية JWT المكتشفة:

* `jwt_prefix`: واحدة من البادئات القيمة JWT المدعومة - lsapi2, mobapp2, bearer. يقرأ المُحلل قيمة البادئة في أي تسجيل.
* `jwt_header`: رأس JWT. بمجرد الحصول على القيمة، تُطبق Wallarm عادة مُحللات [`base64`](#base64) و [`json_doc`](#json_doc) عليها.
* `jwt_payload`: حمولة JWT. بمجرد الحصول على القيمة، تُطبق Wallarm عادة مُحللات [`base64`](#base64) و [`json_doc`](#json_doc) عليها.

يمكن تمرير JWT في أي جزء من الطلب. لذا، قبل تطبيق مُحلل `jwt` يستخدم Wallarm مُحلل الجزء الخاص بالطلب، مثل [`query`](#query-string-parameters) أو [`header`](#headers).

مثال على JWT المُمرَّرة في العنوان `Authentication`:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

عند تعريف عنصر الطلب الذي تُطبق عليه [القاعدة](rules.md):

* اختر مُحلل الجزء الذي يحتوي على JWT أولاً
* حدد إحدى القيم المدرجة `jwt_*` كقيمة لمُحلل `jwt`, على سبيل المثال لقيمة البياضية `name`:

![وصف البارام في القاعدة JWT](../../images/user-guides/rules/request-element-desc.png)

### القواعد

تطبق القواعد على المُحلَلات لأنواع البيانات المصفوفة والمفتاح. تُستخدم القواعد لتحديد حدود تحليل البيانات. يتم الإشارة إلى قيمة القاعدة في علامة المُحلل. على سبيل المثال: **hash_all**, **hash_name**.

إذا لم يتم تحديد القاعدة، فيتم تمرير مُعرف الكيان الذي يتطلب المعالجة إلى المُحلل. على سبيل المثال: يتم تمرير اسم الكائن JSON أو مُعرف أخر بعد **hash**.

**all**

تُستخدم للحصول على قيم جميع العناصر، أو العوامل، أو الكائنات. على سبيل المثال:

* **path_all** لجميع أجزاء مسار URL
* **query_all** لجميع قيم عوامل سلسلة الاستعلام
* **header_all** لجميع قيم العناوين
* **array_all** لجميع قيم العناصر في المصفوفة
* **hash_all** لجميع قيم الكائنات JSON أو الصفات XML
* **jwt_all** for all JWT values

**name**

تُستخدم للحصول على أسماء جميع العناصر، أو العوامل، أو الكائنات. على سبيل المثال:

* **query_name** لجميع أسماء عوامل سلسلة الاستعلام
* **header_name** لجميع أسماء العناوين
* **hash_name** لجميع أسماء الكائنات JSON أو الصفات XML
* **jwt_name** لأسماء جميع العوامل مع JWT

## إدارة المُحللات

القاعدة **تعطيل/تمكين مُحلل الطلب** تتيح إدارة مجموعة المحليلات المُطبقة على الطلب أثناء تحليله.

بشكل افتراضي، عند تحليل الطلب، تُحاول العقدة Wallarm تطبيق كل من [المُحللات](request-processing.md) المناسبة على كل عنصر من الطلب تسلسليًا. ومع ذلك، يمكن تطبيق بعض المُحللات بشكل خاطئ ونتيجة لذلك، قد تكتشف العقدة Wallarm علامات الهجوم في القيمة الناتجة.

على سبيل المثال: قد تحدد العقدة Wallarm بشكل خاطئ البيانات غير المشفرة كمشفرة في [Base64](https://en.wikipedia.org/wiki/Base64)، نظراً لأن رموز الأبجدية Base64 غالباً ما تُستخدم في النص العادي، وقيم الرموز، وقيم UUID وتنسيقات البيانات الأخرى. إذا قامت بفك تشفير البيانات غير المشفرة واكتشاف علامات الهجوم في القيمة المترتبة، فإن النتائج الإيجابية الخاطئة تحدث [النتائج الإيجابية الكاذبة](../../about-wallarm/protecting-against-attacks.md#false-positives).

لمنع النتائج الإيجابية الكاذبة في مثل هذه الحالات، يمكنك تعطيل المُحلَلات المُطبقة بشكل خاطئ على بعض عناصر الطلب باستخدام القاعدة **تعطيل/تمكين مُحلل الطلب**.

**إنشاء وتطبيق القاعدة**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

لإنشاء وتطبيق القاعدة في القسم **القواعد**:

1. قم بإنشاء القاعدة **تعطيل/تمكين مُحلل الطلب** في القسم **القواعد** من Wallarm Console. تتكون القاعدة من المكونات التالية:

      * **الشرط** [يصف](rules.md#branch-description) النقاط المُطلقة لتطبيق القاعدة عليها.
      * المُحلَلات التي يجب تعطيلها / تمكينها لعنصر الطلب المحدد.      
      * **جزء الطلب** يشير إلى العنصر الأصلي للطلب الذي يجب تحليله / عدم تحليله مع المحليلات المحددة.

         --8<-- "../include/waf/features/rules/request-part-reference.md"
2. انتظر [إكمال تجميع القاعدة](rules.md#ruleset-lifecycle).

**مثال على القاعدة**

لنفترض أن الطلبات إلى `https://example.com/users/` تتطلب العنوان الأصالة `X-AUTHTOKEN`. قد تحتوي قيمة العنوان على مجموعات رموز محددة (على سبيل المثال, `=` في النهاية) لتُشفر من قِبَل Wallarm بمُحلل `base64`.

يمكن تكوين القاعدة **تعطيل/تمكين مُحلل الطلب** لمنع النتائج الإيجابية الكاذبة في قيم `X-AUTHTOKEN` كما يلي:

![مثال على القاعدة "تعطيل/تمكين مُحلل الطلب"](../../images/user-guides/rules/disable-parsers-example.png)