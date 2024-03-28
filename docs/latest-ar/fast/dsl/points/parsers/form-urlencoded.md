[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-formurlencoded-parser-with-the-hash-filter

# محلل البيانات المُشفرة بصيغة الـ URL

يُستخدم محلل البيانات المُشفرة بصيغة **Form_urlencoded** للعمل مع جسم الطلب بتنسيق الـ form-urlencoded. يقوم هذا المحلل بإنشاء جدول تجزئة حيث يكون اسماء معلمات جسم الطلب هي المفاتيح وقيم المعلمات المقابلة هي قيم جدول التجزئة. يجب الإشارة إلى عناصر هذا الجدول التجزئة باستخدام اسماء المعلمات.

!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون اسم المعلمة في النقطة تعبيراً نظامياً من لغة برمجة [Ruby][link-ruby].

!!! warning "استخدام محلل البيانات المُشفرة بصيغة الـ Form_urlencoded في النقطة"
    يمكن استخدام محلل البيانات المُشفرة بصيغة Form_urlencoded في النقطة فقط مع تصفية الـ Post التي تشير إلى جسم الطلب الأساسي.

يمكن أن يحتوي جسم الطلب بتنسيق الـ form-urlencoded على هياكل بيانات معقدة تالية: المصفوفات وجداول التجزئة. استخدم تصفيات [المصفوفة][link-formurlencoded-array] و[جدول التجزئة][link-formurlencoded-hash] على التوالي للإشارة إلى العناصر في هذه الهياكل.

**مثال:**

لـ

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع جسم الطلب

```
id=01234&username=John
```

يقوم محلل البيانات المُشفرة بصيغة Form_urlencoded الذي تم تطبيقه على جسم الطلب بإنشاء جدول التجزئة التالي:

| المفتاح      | القيمة    |
|----------|----------|
| id       | 01234    |
| username | John    |

* تشير النقطة `POST_FORM_URLENCODED_id_value` إلى القيمة `01234` التي تطابق المفتاح `id` من جدول التجزئة الذي أنشأه محلل البيانات المُشفرة بصيغة Form_urlencoded.
* تشير النقطة `POST_FORM_URLENCODED_username_value` إلى القيمة `John` التي تطابق المفتاح `username` من جدول التجزئة الذي أنشأه محلل البيانات المُشفرة بصيغة Form_urlencoded.