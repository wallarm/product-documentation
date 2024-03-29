# محلل Json_doc

يُستخدم محلل **Json_doc** للتعامل مع البيانات بصيغة JSON التي يمكن أن تكون موجودة في أي جزء من الطلب. يشير محلل Json_doc إلى محتويات حاوية بيانات JSON المستوى الأعلى في صيغتها الخام.

يبني محلل Json_doc هيكلاً بيانات معقداً بناءً على البيانات المدخلة. يمكنك استخدام الفلاتر التالية للوصول إلى عناصر هذا الهيكل البياني:
* [فلتر Json_obj][anchor1]؛
* [فلتر Json_array][anchor2]؛

أضف أسماء محلل Json_doc والفلتر الذي يوفره بأحرف كبيرة إلى النقطة لاستخدام الفلتر في النقطة.

**مثال:**

للطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع جسم الطلب

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```

يشير محلل Json_doc المطبق على جسم الطلب إلى البيانات التالية:

```
{
    "username": "admin",
    "info":{
        "firstName": "John",
        "lastName": "Smith"
    }
}
```


## فلتر Json_obj

يشير فلتر **Json_obj** إلى جدول الهاش الخاص بكائنات JSON. يجب الإشارة إلى عناصر هذا الجدول باستخدام أسماء كائنات JSON.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون اسم كائن JSON في النقطة تعبيراً نظامياً للغة برمجة روبي [تعبير نظامي في لغة روبي][link-ruby].

يعمل فلتر [هاش][link-hash] عند تطبيقه على بيانات JSON بطريقة مشابهة لفلتر Json_obj.

قد تحتوي قيم جداول الهاش بصيغة JSON على هياكل بيانات معقدة أخرى: مصفوفات وجداول هاش. استخدم الفلاتر التالية للوصول إلى عناصر هذه الهياكل:
* فلتر [مصفوفة][link-jsonobj-array] أو فلتر [Json_array][anchor2] للمصفوفات.
* فلتر [هاش][link-jsonobj-hash] أو فلتر [Json_obj][anchor1] لجداول الهاش.

**مثال:**

للطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع جسم الطلب

```
{
    "username": "user",
    "rights": "read"
}
```

يشير فلتر Json_obj المطبق على جسم الطلب مع محلل Json_doc إلى الجدول التالي:

| المفتاح      | القيمة    |
|----------|----------|
| username | user     |
| rights   | read     |

* تشير النقطة `POST_JSON_DOC_JSON_OBJ_username_value` إلى قيمة `user`.
* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_value` إلى قيمة `read`.

## فلتر Json_array

يشير فلتر **Json_array** إلى مصفوفة قيم كائن JSON. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام الفهارس. يبدأ ترقيم الفهارس في المصفوفة من `0`.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبيراً نظامياً للغة برمجة روبي [تعبير نظامي في لغة روبي][link-ruby].

يعمل فلتر [مصفوفة][link-array] عند تطبيقه على بيانات JSON بطريقة مشابهة لفلتر Json_array.

قد تحتوي قيم المصفوفات بصيغة JSON أيضاً على جداول هاش. استخدم [هاش][link-jsonarray-hash] أو [Json_obj][anchor1].

**مثال:**

للطلب

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/json
```

مع جسم الطلب

```
{
    "username": "user",
    "rights":["read","write"]
}
```

يشير فلتر Json_array المطبق على كائن JSON `rights` مع محلل Json_doc وفلتر Json_obj إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | read     |
| 1      | write    |

* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_0_value` إلى قيمة `read` التي تتوافق مع الفهرس `0` من مصفوفة قيم كائن JSON `rights` التي تم الوصول إليها بواسطة فلتر Json_array.
* تشير النقطة `POST_JSON_DOC_JSON_OBJ_rights_JSON_ARRAY_1_value` إلى قيمة `write` التي تتوافق مع الفهرس `1` من مصفوفة قيم كائن JSON `rights` التي تم الوصول إليها بواسطة فلتر Json_array.