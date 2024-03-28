[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# محلل الأجزاء المتعددة

يُستخدم محلل **الأجزاء المتعددة** للعمل مع جسم الطلب بتنسيق الأجزاء المتعددة. يقوم هذا المحلل بإنشاء جدول تجزئة حيث أسماء معاملات جسم الطلب هي المفاتيح وقيم هذه المعاملات المقابلة هي قيم جدول التجزئة. يحتاج المرء إلى الإشارة إلى عناصر جدول التجزئة هذا باستخدام أسماء المعاملات.


!!! info "التعبيرات النظامية في النقاط"
    يمكن أن يكون اسم المعامل في النقطة تعبيراً نظامياً للغة البرمجة [Ruby][link-ruby].  

!!! warning "استخدام محلل الأجزاء المتعددة في النقطة"
    لا يمكن استخدام محلل الأجزاء المتعددة في النقطة إلا مع فلتر البُعد الذي يشير إلى جسم الطلب الأساسي.


**مثال:**

بالنسبة للطلب

```
POST http://example.com/login/index.php HTTP/1.1
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="id" 

01234 
--boundary 
Content-Disposition: form-data; name="username"

admin 
```

يقوم محلل الأجزاء المتعددة المطبق على جسم الطلب بإنشاء جدول التجزئة التالي:

| المفتاح       | القيمة    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* نقطة `POST_MULTIPART_id_value` تشير إلى قيمة `01234` التي توافق على مفتاح `id` من جدول التجزئة الذي أنشأه محلل الأجزاء المتعددة.
* نقطة `POST_MULTIPART_username_value` تشير إلى قيمة `admin` التي توافق على مفتاح `username` من جدول التجزئة الذي أنشأه محلل الأجزاء المتعددة.

قد يحتوي جسم الطلب بتنسيق الأجزاء المتعددة أيضًا على البنى التحتية المعقدة التالية: الصفوف وجداول التجزئة. استخدم فلاتر [الصف][link-multipart-array] و[جدول التجزئة][link-multipart-hash] على التوالي للإشارة إلى العناصر في هذه الهياكل.