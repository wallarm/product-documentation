[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-formurlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-jsondoc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-jsonobj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-jsonarray-filter-and-the-hash-filter


# فلتر الهاش

**فلتر الهاش** يشير إلى جدول الهاش للقيم في أي من عناصر طلب الأساس التي قد تحتوي على جداول هاش.

يمكن استخدام فلتر الهاش في نقطة معًا مع الفلاتر والمحللات التالية:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

استخدم المفاتيح للإشارة إلى عناصر جدول الهاش الذي يعالجه فلتر الهاش.

!!! info "التعبيرات النظامية في النقاط"
    المفتاح في النقطة يمكن أن يكون [تعبير نظامي للغة برمجة Ruby][link-ruby].

## مثال على استخدام فلتر الجيت وفلتر الهاش

لطلب

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

فلتر الهاش المطبق على معلمة سلسلة استعلام `id` يشير إلى جدول الهاش التالي:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* النقطة `GET_id_HASH_user_value` تشير إلى القيمة `01234` التي تتوافق مع مفتاح `user` من جدول هاش قيم معلمة سلسلة الاستعلام `id` الذي يعالجه فلتر الهاش.
* النقطة `GET_id_HASH_group_value` تشير إلى القيمة `56789` التي تتوافق مع مفتاح `group` من جدول هاش قيم معلمة سلسلة الاستعلام `id` الذي يعالجه فلتر الهاش.

## مثال على استخدام المحلل Form_urlencoded مع فلتر الهاش

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع الجسم

```
id[user]=01234&id[group]=56789
```

فلتر الهاش المطبق على معلمة `id` من جسم الطلب بتنسيق form-urlencoded يشير إلى جدول الهاش التالي:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* النقطة `POST_FORM_URLENCODED_id_HASH_user_value` تشير إلى القيمة `01234` التي تتوافق مع مفتاح `user` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.
* النقطة `POST_FORM_URLENCODED_id_HASH_group_value` تشير إلى القيمة `56789` التي تتوافق مع مفتاح `group` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.

## مثال على استخدام فلتر المالتيبارت وفلتر الهاش

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id[user]" 

01234 
--boundary 
Content-Disposition: form-data; name="id[group]"

56789
```

فلتر الهاش المطبق على معلمة `id` من جسم الطلب مع محلل المالتيبارت يشير إلى جدول الهاش التالي:

| Key   | Value    |
|-------|----------|
| user  | 01234    |
| group | 56789    |

* النقطة `POST_MULTIPART_id_HASH_user_value` تشير إلى القيمة `01234` التي تتوافق مع مفتاح `user` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.
* النقطة `POST_MULTIPART_id_HASH_group_value` تشير إلى القيمة `56789` التي تتوافق مع مفتاح `group` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.

## مثال على استخدام المحلل Json_doc وفلتر الهاش

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع الجسم

```
{
    "username": "user",
    "rights": "read"
}
```

فلتر الهاش المطبق على جسم الطلب بتنسيق JSON مع المحلل Json_doc يشير إلى جدول الهاش التالي:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* النقطة `POST_JSON_DOC_HASH_username_value` تشير إلى القيمة `user` التي تتوافق مع مفتاح `username` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.
* النقطة `POST_JSON_DOC_HASH_rights_value` تشير إلى القيمة `read` التي تتوافق مع مفتاح `rights` من جدول هاش معلمات جسم الطلب الذي يعالجه فلتر الهاش.

## مثال على استخدام فلتر Json_obj وفلتر الهاش

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع الجسم

```
{
    "username": "user",
    "info": {
        "status": "active",
        "rights": "read"
    }
}
```

فلتر الهاش المطبق على جسم الطلب بتنسيق JSON مع المحلل Json_doc وفلتر Json_obj يشير إلى جدول الهاش التالي:

| Key    | Value    |
|--------|----------|
| status | active   |
| rights | read     |

* النقطة `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` تشير إلى القيمة `active` التي تتوافق مع مفتاح `status` من جدول هاش الكائنات الفرعية لكائن JSON `info` الذي يعالجه فلتر الهاش.
* النقطة `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` تشير إلى القيمة `read` التي تتوافق مع مفتاح `rights` من جدول هاش الكائنات الفرعية لكائن JSON `info` الذي يعالجه فلتر الهاش.

## مثال على استخدام فلتر Json_array وفلتر الهاش

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع الجسم

```
{
    "username": "user",
    "posts": [{
            "title": "Greeting",
            "length": "256"
        },
        {
            "title": "Hello World!",
            "length": "32"
        }
    ]
}
```

فلتر الهاش المطبق على عنصر الأول من مجموعة كائنات JSON `posts` من جسم الطلب مع المحلل Json_doc وفلتر Json_obj و Json_array يشير إلى جدول الهاش التالي:

| Key    | Value    |
|--------|----------|
| title  | Greeting |
| length | 256      |

* النقطة `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` تشير إلى القيمة `Greeting` التي تتوافق مع مفتاح `title` من جدول هاش كائنات JSON الذي يعالجه فلتر الهاش.
* النقطة `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` تشير إلى القيمة `256` التي تتوافق مع مفتاح `length` من جدول هاش كائنات JSON الذي يعالجه فلتر الهاش.