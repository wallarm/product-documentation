[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-with-the-array-filter
[anchor2]:      #the-example-of-using-the-header-filter-with-the-array-filter
[anchor3]:      #the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[anchor4]:      #the-example-of-using-the-multipart-parser-and-the-array-filter
[anchor5]:      #the-example-of-using-the-xmltag-filter-and-the-array-filter
[anchor6]:      #the-example-of-using-the-jsonobj-filter-and-the-array-filter


# مُرشِح الصفيف

يُشير **مُرشح** الصفيف إلى صفيف القيم في أي من عناصر الطلب الأساسية التي قد تحتوي على صفائف.

يمكن استخدام مُرشح الصفيف مع المرشحات والمحللات التالية:
* [Get][anchor1];
* [Header][anchor2];
* [Form_urlencoded][anchor3];
* [Multipart][anchor4];
* [Xml_tag][anchor5];
* [Json_obj][anchor6].

يجب الإشارة إلى عناصر هذا الصفيف باستخدام الفهارس. يبدأ ترقيم الفهارس من `0`.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون الفهرس في النقطة [تعبيرًا نظاميًا للغة برمجة Ruby][link-ruby].  

## مثال على استخدام مُرشِح Get مع مُرشِح الصفيف

لطلب

```
GET http://example.com/login?id[]="01234"&id[]="56789" HTTP/1.1
```

، يُشير مُرشح الصفيف المطبق على معامل الاستعلام `id` إلى الصفيف التالي:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يُشير `GET_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع الفهرس `0` من صفيف قيم معامل الاستعلام `id` الذي يُعالجه مُرشح الصفيف.
* يُشير `GET_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع الفهرس `1` من صفيف قيم معامل الاستعلام `id` الذي يُعالجه مُرشح الصفيف.

## مثال على استخدام مُرشِح Header مع مُرشِح الصفيف

لطلب

```
GET http://example.com/login/index.php HTTP/1.1
X-Identifier: 01234
X-Identifier: 56789
```

، يُشير مُرشح الصفيف المطبق على رأس `X-Identifier` إلى الصفيف التالي:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يُشير `HEADER_X-Identifier_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع الفهرس `0` من صفيف قيم رأس `X-Identifier` الذي يُعالجه مُرشح الصفيف.
* يُشير `HEADER_X-Identifier_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع الفهرس `1` من صفيف قيم رأس `X-Identifier` الذي يُعالجه مُرشح الصفيف.

## مثال على استخدام مُحلِل Form_urlencoded ومُرشِح الصفيف

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

بجسد

```
id[]=01234&id[]=56789
```

، يُشير مُرشح الصفيف المطبق على معامل `id` من جسد الطلب بتنسيق form-urlencoded إلى الصفيف التالي:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يُشير `POST_FORM_URLENCODED_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع الفهرس `0` من صفيف قيم معامل `id` الذي يُعالجه مُرشح الصفيف.
* يُشير `POST_FORM_URLENCODED_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع الفهرس `1` من صفيف قيم معامل `id` الذي يُعالجه مُرشح الصفيف.

## مثال على استخدام مُحلِل Multipart ومُرشِح الصفيف

لطلب

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

، يُشير مُرشح الصفيف المطبق على معامل `id` من جسد الطلب بتنسيق multipart إلى الصفيف التالي:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | 01234    |
| 1      | 56789    |

* يُشير `POST_MULTIPART_id_ARRAY_0_value` إلى قيمة `01234` التي تتوافق مع الفهرس `0` من صفيف قيم معامل `id` الذي يُعالجه مُرشح الصفيف.
* يُشير `POST_MULTIPART_id_ARRAY_1_value` إلى قيمة `56789` التي تتوافق مع الفهرس `1` من صفيف قيم معامل `id` الذي يُعالجه مُرشح الصفيف.

## مثال على استخدام مُرشِح Xml_tag ومُرشِح الصفيف

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

بجسد

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

، يُشير مُرشح الصفيف المطبق على علامة `text` من جسد الطلب بتنسيق XML إلى الصفيف التالي:

| الفهرس  | القيمة        |
|--------|--------------|
| 0      | Sample text. |
| 1      | aaaa         |

* يُشير نقطة `POST_XML_XML_TAG_text_ARRAY_0_value` إلى قيمة `Sample text.` التي تتوافق مع الفهرس `0` من صفيف قيم علامة `text` الذي يُعالجه مُرشح الصفيف.
* يُشير نقطة `POST_XML_XML_TAG_text_ARRAY_1_value` إلى قيمة `aaaa` التي تتوافق مع الفهرس `1` من صفيف قيم علامة `text` الذي يُعالجه مُرشح الصفيف.

## مثال على استخدام مُرشِح Json_obj ومُرشِح الصفيف

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

بجسد

```
{
    "username": "user",
    "rights":["read","write"]
}
```

، يُشير مُرشح الصفيف المطبق على كائن JSON `rights` من جسد الطلب مع مُحلل Json_doc ومُرشح Json_obj إلى الصفيف التالي:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* يُشير نقطة `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_0_value` إلى قيمة `read` التي تتوافق مع الفهرس `0` من صفيف قيم كائن JSON `rights` الذي يُعالجه مُرشح الصفيف.
* يُشير نقطة `POST_JSON_DOC_JSON_OBJ_rights_ARRAY_1_value` إلى قيمة `write` التي تتوافق مع الفهرس `1` من صفيف قيم كائن JSON `rights` الذي يُعالجه مُرشح الصفيف.