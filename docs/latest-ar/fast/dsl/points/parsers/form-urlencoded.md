[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-formurlencoded-array]:        array.md#the-example-of-using-the-formurlencoded-parser-and-the-array-filter
[link-formurlencoded-hash]:         hash.md#the-example-of-using-the-formurlencoded-parser-with-the-hash-filter

# مُحلِّل Form_urlencoded

مُحلِّل **Form_urlencoded** يُستخدم للعمل مع جسم الطلب في صيغة form-urlencoded. يقوم هذا المُحلِّل بإنشاء جدول تجزئة حيث يكون أسماء مُعاملات جسم الطلب هي المفاتيح وقيم المُعاملات المُقابلة هي قيم جدول التجزئة. يجب الإشارة إلى عناصر هذا الجدول بأسماء المُعاملات.

!!! info "التعبيرات النمطية في النقاط"
    يُمكن أن يكون اسم المُعامل في النقطة تعبيرًا نمطيًا للغة البرمجة [رُوبي][link-ruby].

!!! warning "استخدام مُحلِّل Form_urlencoded في النقطة"
    يُمكن استخدام مُحلِّل Form_urlencoded في النقطة فقط بالاشتراك مع فلتر الـPost الذي يشير إلى جسم الطلب الأساسي.

يُمكن أيضًا أن يحتوي جسم الطلب في صيغة form-urlencoded على هياكل بيانات مُعقدة التالية: المصفوفات وجداول التجزئة. استخدم فلاتر [المصفوفة][link-formurlencoded-array] و[التجزئة][link-formurlencoded-hash] على التوالي للإشارة إلى العناصر في هذه الهياكل.

**مثال:**

بالنسبة لطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
```

مع جسم

```
id=01234&username=John
```

يقوم مُحلِّل Form_urlencoded المطبق على جسم الطلب بإنشاء جدول التجزئة التالي:

| المفتاح  | القيمة    |
|----------|----------|
| id       | 01234    |
| username | John     |

* تشير النقطة `POST_FORM_URLENCODED_id_value` إلى قيمة `01234` التي تُقابل مفتاح `id` من جدول التجزئة الذي أنشأه مُحلِّل Form_urlencoded.
* تشير النقطة `POST_FORM_URLENCODED_username_value` إلى قيمة `John` التي تُقابل مفتاح `username` من جدول التجزئة الذي أنشأه مُحلِّل Form_urlencoded.