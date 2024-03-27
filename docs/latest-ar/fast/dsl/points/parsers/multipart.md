[link-ruby]:                        http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-multipart-array]:             array.md#the-example-of-using-the-multipart-parser-and-the-array-filter
[link-multipart-hash]:              hash.md#the-example-of-using-the-multipart-filter-and-the-hash-filter

# محلل متعدد الأجزاء

يُستخدم محلل **الأجزاء المتعددة** للعمل مع جسم الطلب بتنسيق متعدد الأجزاء. يقوم هذا المحلل بإنشاء جدول تجزئة حيث تكون أسماء معاملات جسم الطلب هي المفاتيح وقيم المعاملات المقابلة هي قيم جدول التجزئة. يجب الرجوع إلى عناصر هذا الجدول بإستخدام أسماء المعاملات.


!!! info "استخدام التعبيرات النمطية في النقاط"
    يمكن أن يكون اسم المعامل في النقطة عبارة عن تعبير نمطي من لغة البرمجة [روبي][link-ruby].  

!!! warning "استخدام محلل الأجزاء المتعددة في النقطة"
    يمكن استخدام محلل الأجزاء المتعددة في النقطة مع فلتر الإرسال الذي يشير إلى جسم الطلب الأساسي.


**مثال:** 

للطلب

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

يقوم محلل الأجزاء المتعددة المطبق على جسم الطلب بإنشاء الجدول التالي:

| المفتاح       | القيمة    |
|-----------|----------|
| id        | 01234    |
| username  | admin    |

* تشير نقطة `POST_MULTIPART_id_value` إلى قيمة `01234` التي تتوافق مع مفتاح `id` من جدول التجزئة الذي أنشأه محلل الأجزاء المتعددة.
* تشير نقطة `POST_MULTIPART_username_value` إلى قيمة `admin` التي تتوافق مع المفتاح `username` من جدول التجزئة الذي أنشأه محلل الأجزاء المتعددة.

قد يحتوي جسم الطلب بتنسيق متعدد الأجزاء أيضًا على البُنيات البيانية المعقدة التالية: المصفوفات وجداول التجزئة. استخدم فلاتر [المصفوفات][link-multipart-array] و [جدول التجزئة][link-multipart-hash] على التوالي لمعالجة العناصر في هذه البُنيات.