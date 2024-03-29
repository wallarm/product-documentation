[link-ruby]:        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html

[anchor1]:      #the-example-of-using-the-get-filter-and-the-hash-filter
[anchor2]:      #the-example-of-using-the-formurlencoded-parser-with-the-hash-filter
[anchor3]:      #the-example-of-using-the-multipart-filter-and-the-hash-filter
[anchor4]:      #the-example-of-using-the-jsondoc-parser-and-the-hash-filter
[anchor5]:      #the-example-of-using-the-jsonobj-filter-and-the-hash-filter
[anchor6]:      #the-example-of-using-the-jsonarray-filter-and-the-hash-filter

# مرشح الجدول

يشير مرشح **الجدول** إلى جدول القيم في أي من عناصر الطلب الأساسية التي قد تحتوي على جداول.

يمكن استخدام مرشح الجدول بالتزامن مع المرشحات والمحللات التالية:
* [Get][anchor1];
* [Form_urlencoded][anchor2];
* [Multipart][anchor3];
* [Json_doc][anchor4];
* [Json_obj][anchor5];
* [Json_array][anchor6].

استخدم المفاتيح للإشارة إلى عناصر جدول القيم الذي يتم تناوله بواسطة مرشح الجدول.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون المفتاح في النقطة [تعبيراً نظامياً للغة برمجة Ruby][link-ruby].

## مثال على استخدام مرشح Get ومرشح الجدول

لطلب

```
POST http://example.com/login?id[user]=01234&id[group]=56789 
```

مرشح الجدول المطبق على معامل استفسار `id` يشير إلى جدول القيم التالي:

| المفتاح | القيمة  |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* نقطة `GET_id_HASH_user_value` تشير إلى قيمة `01234` المتطابقة مع مفتاح `user` من جدول قيم معاملات استفسار `id` الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `GET_id_HASH_group_value` تشير إلى قيمة `56789` المتطابقة مع مفتاح `group` من جدول قيم معاملات استفسار `id` الذي يتم تناوله بواسطة مرشح الجدول.

## مثال على استخدام المحلل Form_urlencoded مع مرشح الجدول

لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع الجسم

```
id[user]=01234&id[group]=56789
```

مرشح الجدول المطبق على معامل `id` من جسم الطلب بتنسيق form-urlencoded يشير إلى الجدول التالي:

| المفتاح | القيمة  |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* نقطة `POST_FORM_URLENCODED_id_HASH_user_value` تشير إلى قيمة `01234` المتطابقة مع مفتاح `user` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `POST_FORM_URLENCODED_id_HASH_group_value` تشير إلى قيمة `56789` المتطابقة مع مفتاح `group` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.

## مثال على استخدام مرشح Multipart ومرشح الجدول

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

مرشح الجدول المطبق على معامل `id` من جسم الطلب بالتزامن مع المحلل Multipart يشير إلى جدول القيم التالي:

| المفتاح | القيمة  |
|-------|--------|
| user  | 01234  |
| group | 56789  |

* نقطة `POST_MULTIPART_id_HASH_user_value` تشير إلى قيمة `01234` المتطابقة مع مفتاح `user` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `POST_MULTIPART_id_HASH_group_value` تشير إلى قيمة `56789` المتطابقة مع مفتاح `group` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.

## مثال على استخدام المحلل Json_doc ومرشح الجدول

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

مرشح الجدول المطبق على جسم الطلب بتنسيق JSON بالتزامن مع المحلل Json_doc يشير إلى جدول القيم التالي:

| المفتاح  | القيمة |
|---------|--------|
| username | user  |
| rights   | read  |

* نقطة `POST_JSON_DOC_HASH_username_value` تشير إلى قيمة `user` المتطابقة مع مفتاح `username` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `POST_JSON_DOC_HASH_rights_value` تشير إلى قيمة `read` المتطابقة مع مفتاح `rights` من جدول قيم معاملات جسم الطلب الذي يتم تناوله بواسطة مرشح الجدول.

## مثال على استخدام مرشح Json_obj ومرشح الجدول

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

مرشح الجدول المطبق على جسم الطلب بتنسيق JSON بالتزامن مع المحلل Json_doc ومرشح Json_obj يشير إلى جدول القيم التالي:

| المفتاح | القيمة  |
|--------|--------|
| status | active |
| rights | read   |

* نقطة `POST_JSON_DOC_JSON_OBJ_info_HASH_status_value` تشير إلى قيمة `active` المتطابقة مع مفتاح `status` من جدول قيم الأشياء الفرعية لكائن JSON `info` الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `POST_JSON_DOC_JSON_OBJ_info_HASH_rights_value` تشير إلى قيمة `read` المتطابقة مع مفتاح `rights` من جدول قيم الأشياء الفرعية لكائن JSON `info` الذي يتم تناوله بواسطة مرشح الجدول.

## مثال على استخدام مرشح Json_array ومرشح الجدول

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

مرشح الجدول المطبق على العنصر الأول من مصفوفة كائنات JSON `posts` من جسم الطلب بالتزامن مع المحللين Json_doc، Json_obj ومرشح Json_array يشير إلى جدول القيم التالي:

| المفتاح | القيمة   |
|--------|---------|
| title  | Greeting |
| length | 256      |

* نقطة `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_title_value` تشير إلى قيمة `Greeting` المتطابقة مع مفتاح `title` من جدول قيم كائنات JSON الذي يتم تناوله بواسطة مرشح الجدول.
* نقطة `POST_JSON_DOC_JSON_OBJ_posts_JSON_ARRAY_0_HASH_length_value` تشير إلى قيمة `256` المتطابقة مع مفتاح `length` من جدول قيم كائنات JSON الذي يتم تناوله بواسطة مرشح الجدول.