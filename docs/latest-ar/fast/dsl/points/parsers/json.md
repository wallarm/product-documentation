[link-ruby]:                    http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-hash]:                    hash.md
[link-array]:                   array.md
[link-jsonobj-array]:           array.md#the-example-of-using-the-jsondoc-filter-and-the-array-filter
[link-jsonobj-hash]:            hash.md#the-example-of-using-the-jsonobj-filter-and-the-hash-filter
[link-jsonarray-hash]:          hash.md#the-example-of-using-the-jsonarray-filter-and-the-hash-filter

[anchor1]:          #jsonobj-filter
[anchor2]:          #jsonarray-filter


# مُحلل Json_doc

يُستخدم محلل **Json_doc** للعمل مع البيانات بصيغة JSON التي يمكن تواجدها في أي جزء من الطلب. يشير مُحلل Json_doc إلى محتويات حاوية بيانات JSON الأساسية في صورتها الخام.

يبني مُحلل Json_doc هيكل بيانات معقد على أساس البيانات المدخلة. يمكنك استخدام الفلاتر التالية للتوجه إلى عناصر هذا الهيكل البياني:
* [فلتر Json_obj][anchor1];
* [فلتر Json_array][anchor2].

أضف أسماء مُحلل Json_doc والفلتر المُقدم منه بحروف كبيرة إلى النقطة لاستخدام الفلتر في النقطة.

**مثال:**

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

بجسم الطلب

```
{
    "username": "admin",
    "info": {
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

يشير مُحلل Json_doc المُطبق على جسم الطلب إلى البيانات التالية:

```
{
    "username": "admin",
    "info": {
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## فلتر Json_obj

يشير فلتر **Json_obj** إلى جدول الهاش لأجسام JSON. يجب الإشارة إلى عناصر هذا الجدول الهاش باستخدام أسماء أجسام JSON.

!!! info "التعبيرات النمطية في النقاط"
    يُمكن أن يكون اسم جسم JSON في النقطة [تعبير نمطي للغة برمجة Ruby][link-ruby].  

يعمل الفلتر [Hash][link-hash] المُطبق على بيانات JSON بطريقة مُماثلة لفلتر Json_obj.

قد تحتوي القيم من جداول الهاش بصيغة JSON أيضًا على الهياكل البيانية المعقدة التالية: المصفوفات وجداول الهاش. استخدم الفلتر التالي للتوجه إلى العناصر في هذه الهياكل:
* فلتر [Array][link-jsonobj-array] أو فلتر [Json_array][anchor2] للمصفوفات
* فلتر [Hash][link-jsonobj-hash] أو فلتر [Json_obj][anchor1] لجداول الهاش

**مثال:**

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

بجسم الطلب

```
{
    "username": "user",
    "rights": "read"
}
```

يشير فلتر Json_obj المطبق على جسم الطلب مع محلل Json_doc إلى الجدول التالي:

| Key      | Value    |
|----------|----------|
| username | user     |
| rights   | read     |

* تشير النقطة `POST_JSON_DOC_JSON_OBJ_username_value` إلى قيمة `user`.
* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_value` إلى قيمة `read`.

## فلتر Json_array

يشير فلتر **Json_array** إلى مصفوفة قيم أجسام JSON. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام الفهارِس. يبدأ فهرس المصفوفة من `0`.

!!! info "التعبيرات النمطية في النقاط"
    يمكن أن يكون الفهرس في النقطة [تعبير نمطي للغة برمجة Ruby][link-ruby]. 

يعمل فلتر [Array][link-array] المطبق على بيانات JSON بطريقة مماثلة لفلتر Json_array.

قد تحتوي القيم من المصفوفات بصيغة JSON أيضًا على جداول هاش. استخدم فلتر [Hash][link-jsonarray-hash] أو [Json_obj][anchor1].

**مثال:**

لطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

بجسم الطلب

```
{
    "username": "user",
    "rights":["read","write"]
}
```

يشير فلتر Json_array المطبق على جسم JSON `rights` مع محلل Json_doc وفلتر Json_obj إلى المصفوفة التالية:

| Index  | Value    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` إلى قيمة `read` التي تتوافق مع فهرس `0` من مصفوفة قيم جسم JSON `rights` المشار إليه بواسطة فلتر Json_array.
* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` إلى قيمة `write` التي تتوافق مع فهرس `1` من مصفوفة قيم جسم JSON `rights` المشار إليه بواسطة فلتر Json_array.