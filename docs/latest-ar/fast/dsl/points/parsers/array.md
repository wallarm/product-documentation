[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xmltag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-jsonobj-filter-and-the-array-filter

# فلتر المصفوفة

فلتر **المصفوفة** يشير إلى مصفوفة القيم في أي من عناصر طلب الأساس التي قد تحتوي على مصفوفات.

يمكن استخدام فلتر المصفوفة في النقطة مع الفلاتر ومحللات البيانات التالية:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

يجب الإشارة إلى عناصر هذه المصفوفة باستخدام الفهارس. تبدأ فهرسة المصفوفة من `0`.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون الفهرس في النقطة [تعبير نظامي للغة برمجة روبي][link-ruby].  

## مثال استخدام فلتر Get مع فلتر المصفوفة

بالنسبة للطلب

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

، يشير فلتر المصفوفة المطبق على مُعامِل `id` لسلسلة الاستفسار إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يشير `GET_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع فهرس `0` من مصفوفة قيم مُعامِل سلسلة الاستفسار `id` الموجهة بواسطة فلتر المصفوفة.
* يشير `GET_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع فهرس `1` من مصفوفة قيم مُعامِل سلسلة الاستفسار `id` الموجهة بواسطة فلتر المصفوفة.

## مثال استخدام فلتر Header مع فلتر المصفوفة

بالنسبة للطلب

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

، يشير فلتر المصفوفة المطبق على رأس `X-Identifier` إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يشير `HEADER_X-Identifier_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع فهرس `0` من مصفوفة قيم رأس `X-Identifier` الموجهة بواسطة فلتر المصفوفة.
* يشير `HEADER_X-Identifier_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع فهرس `1` من مصفوفة قيم رأس `X-Identifier` الموجهة بواسطة فلتر المصفوفة.

## مثال استخدام محلل Form_urlencoded وفلتر المصفوفة

بالنسبة للطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع الجسم

```
id[]=01234&id[]=56789
```

، يشير فلتر المصفوفة المطبق على مُعامِل `id` من جسم الطلب بتنسيق form-urlencoded إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يشير `POST_FORM_URLENCODED_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع فهرس `0` من مصفوفة قيم مُعامِل `id` الموجهة بواسطة فلتر المصفوفة.
* يشير `POST_FORM_URLENCODED_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع فهرس `1` من مصفوفة قيم مُعامِل `id` الموجهة بواسطة فلتر المصفوفة.

## مثال استخدام محلل Multipart وفلتر المصفوفة

بالنسبة للطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[]"

56789
```

، يشير فلتر المصفوفة المطبق على مُعامِل `id` من جسم الطلب بتنسيق multipart إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يشير `POST_MULTIPART_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع فهرس `0` من مصفوفة قيم مُعامِل `id` الموجهة بواسطة فلتر المصفوفة.
* يشير `POST_MULTIPART_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع فهرس `1` من مصفوفة قيم مُعامِل `id` الموجهة بواسطة فلتر المصفوفة.

## مثال استخدام فلتر Xml_tag وفلتر المصفوفة

بالنسبة للطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

مع الجسم

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
Sample text.
</text>
<text>
    &eee;
</text>
```

، يشير فلتر المصفوفة المطبق على الوسم `text` من جسم الطلب بتنسيق XML إلى المصفوفة التالية:

| الفهرس  | القيمة        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* نقطة `POST_XML_XML_TAG_text_ARRAY_0_value` تشير إلى قيمة `Sample text.` التي تتوافق مع فهرس `0` من مصفوفة قيم الوسم `text` الموجهة بواسطة فلتر المصفوفة.
* نقطة `POST_XML_XML_TAG_text_ARRAY_1_value` تشير إلى قيمة `aaaa` التي تتوافق مع فهرس `1` من مصفوفة قيم الوسم `text` الموجهة بواسطة فلتر المصفوفة.

## مثال استخدام فلتر Json_obj وفلتر المصفوفة

بالنسبة للطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع الجسم

```
{
    "username": "user",
    "rights":["read","write"]
}
```

، يشير فلتر المصفوفة المطبق على كائن JSON `rights` من جسم الطلب مع محلل Json_doc وفلتر Json_obj إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* نقطة `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` تشير إلى قيمة `read` التي تتوافق مع فهرس `0` من مصفوفة قيم كائن JSON `rights` الموجهة بواسطة فلتر المصفوفة.
* نقطة `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` تشير إلى قيمة `write` التي تتوافق مع فهرس `1` من مصفوفة قيم كائن JSON `rights` الموجهة بواسطة فلتر المصفوفة.