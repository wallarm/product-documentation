[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xmltag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xmlcomment-filter
[anchor2]:      #xmldtd-filter
[anchor3]:      #xmldtdentity-filter
[anchor4]:      #xmlpi-filter
[anchor5]:      #xmltag-filter
[anchor6]:      #xmltagarray-filter
[anchor7]:      #xmlattr-filter

# محلل XML

يستخدم محلل **XML** للعمل مع البيانات بتنسيق XML التي يمكن تواجدها في أي جزء من الطلب. يجب تحديد اسمه في نقطة عند استخدام الفلاتر التي يقدمها.

يمكنك استخدام اسم محلل XML في النقطة دون أي فلاتر يتم تقديمها به للعمل مع محتويات حاوية البيانات XML ذات المستوى الأعلى بشكلها الخام.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

الجسم، تشير النقطة `POST_XML_value` إلى البيانات التالية بتنسيق خام:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    Sample text.
</text>
```

يقوم محلل XML ببناء بنية بيانات معقدة على أساس البيانات المدخلة. يمكنك استخدام الفلاتر التالية للتعامل مع عناصر هذه البنية البيانات:
* [Xml_comment filter][anchor1];
* [Xml_dtd filter][anchor2];
* [Xml_dtd_entity filter][anchor3];
* [Xml_pi filter][anchor4];
* [Xml_tag filter][anchor5];
* [Xml_tag_array filter][anchor6];
* [Xml_attr filter][anchor7].

أضف أسماء محلل XML والفلتر التي يقدمها بأحرف كبيرة للنقطة لاستخدام الفلتر في النقطة.


## فلتر Xml_comment

يشير الفلتر **Xml_comment** إلى المصفوفة التي تحتوي على التعليقات من البيانات بتنسيق XML. يجب الإشارة إلى عناصر هذه المصفوفة عن طريق استخدام فهارسها. تبدأ فهارس المصفوفة من `0`.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

يمكن استخدام فلتر Xml_comment فقط في النقطة مع محلل XML.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
<!-- second -->
```

الجسم، فإن Xml_comment يُطبَق بالاشتراك مع محلل XML يشير إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | first    |
| 1      | second   |

* تشير النقطة `POST_XML_XML_COMMENT_0_value` إلى قيمة `first` التي تعادل فهرس `0` من المصفوفة التي يشير إليها فلتر Xml_comment.
* تشير النقطة `POST_XML_XML_COMMENT_1_value` إلى قيمة `second` التي تعادل فهرس `1` من المصفوفة التي يشير إليها فلتر Xml_comment.

## Xml_dtd Filter

الفلتر **Xml_dtd** يشير إلى المخطط DTD الخارجي المستخدم في البيانات XML. يمكن استخدام هذا الفلتر فقط في النقطة بالاشتراك مع محلل XML.

يشار الى فلتر Xml_dtd كقيمة سلسلة. لا يمكن لهذا الفلتر الاشارة الى البنى المعقدة للبيانات (مثل المصفوفات او الجداول المتجهة).

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE foo SYSTEM "example.dtd">
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
```

الجسم، تشير نقطة `POST_XML_DTD_value` إلى قيمة `example.dtd`.

## Xml_dtd_entity Filter

تشير الفلترة **Xml_dtd_entity** إلى المصفوفة التي تحتوي على توجيهات المخطط DTD المعرفة في البيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة عن طريق استخدام فهارسها. تبدأ فهارس المصفوفة من `0`. 

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

يمكن استخدام فلتر Xml_dtd_entity فقط في النقطة مع محلل XML.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe "aaaa">
<!ENTITY sample "This is sample text.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    &xxe;
</text>
<text>
    &sample;
</text>
```

الجسم، يشير فلتر Xml_dtd_entity المطبق على جسم الطلب بالاشتراك مع محلل XML إلى المصفوفة التالية:

| الفهرس  | الاسم    | القيمة                |
|---------|----------|----------------------|
| 0       | xxe      | aaaa                 |
| 1       | sample   | This is sample text. |

في هذه المصفوفة، يشير كل فهرس إلى ثنائي الاسم والقيمة الذي يتوافق مع اسم وقيمة المخطط DTD.
* أضف اللاحقة `_name` في نهاية النقطة التي تستخدم فلتر Xml_dtd_entity للإشارة إلى اسم التوجيه للمخطط.
* أضف اللاحقة `_value` في نهاية النقطة التي تستخدم فلتر Xml_dtd_entity للإشارة إلى قيمة التوجيه للمخطط.



* تشير نقطة `POST_XML_XML_DTD_ENTITY_0_name` إلى اسم التوجيه `xxe` الذي يتوافق مع فهرس `0` من المصفوفة التي يشير إليها فلتر Xml_dtd_entity.
* تشير نقطة `POST_XML_XML_DTD_ENTITY_1_value` إلى قيمة التوجيه `This is sample text.` التي تتوافق مع فهرس `1` من المصفوفة التي يشير إليها فلتر Xml_dtd_entity.

## Xml_pi Filter

الفلتر **Xml_pi** يشير إلى مصفوفة التعليمات البرمجية المعرفة لبيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة عن طريق استخدام فهارسها. تبدأ فهارس المصفوفة من `0`.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

يمكن استخدام فلتر Xml_pi فقط في النقطة مع محلل XML.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<?last-edit user="John" date="2019-05-11"?>
<!-- first -->
<text>
    Sample text.
</text>
```

الجسم، يشير فلتر Xml_pi المطبق على جسم الطلب بالاشتراك مع محلل XML إلى المصفوفة التالية:

| الفهرس  | الاسم          | القيمة                             |
|---------|----------------|----------------------------------|
| 0       | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1       | last-edit      | user="John" date="2019-05-11"    |

في هذه المصفوفة، يشير كل فهرس إلى ثنائي الاسم والقيمة الذي يتوافق مع اسم وقيمة التعليمات البرمجية لمعالجة البيانات.
* أضف اللاحقة `_name` في نهاية النقطة التي تستخدم فلتر Xml_pi للإشارة إلى اسم التعليمات البرمجية لمعالجة البيانات.
* أضف اللاحقة `_value` في نهاية النقطة التي تستخدم فلتر Xml_pi للإشارة إلى قيمة التعليمات البرمجية لمعالجة البيانات.



* تشير نقطة `POST_XML_XML_PI_0_name` إلى اسم التعليمات `xml-stylesheet`، التي تتوافق مع فهرس `0` من المصفوفة التي يشير إليها فلتر Xml_pi.
* تشير نقطة `POST_XML_XML_PI_1_value` إلى قيمة التعليمات `user="John" date="2019-05-11"`، التي تتوافق مع فهرس `1` من المصفوفة التي يشير إليها فلتر Xml_pi.

## Xml_tag Filter

الفلتر **Xml_tag** يشير إلى جدول التجزئة للوسوم XML من البيانات XML. يجب الإشارة إلى عناصر هذا الجدول عن طريق استخدام أسماء الوسوم. يمكن استخدام هذا الفلتر فقط في النقطة بالاشتراك مع محلل XML.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون اسم الوسم في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

قد تحتوي الوسوم من البيانات XML أيضًا على مصفوفات القيم. استخدم فلتر [Array][link-xmltag-array] أو [Xml_tag_array][anchor6] للإشارة إلى القيم من هذه المصفوفات.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text>
    Sample text.
</text>
<sample>
    &eee;
</sample>
```

الجسم، يشير فلتر Xml_tag المطبق على جسم الطلب بالاشتراك مع محلل XML إلى جدول التجزئة التالي:

| المفتاح  | القيمة         |
|--------|----------------|
| text   | Sample text.   |
| sample | aaaa           |

* تشير القطة `POST_XML_XML_TAG_text_value` إلى القيمة `Sample text.` التي تتوافق مع المفتاح `text` من جدول التجزئة الذي يشار إليه بواسطة فلتر Xml_tag.
* تشير القطة `POST_XML_XML_TAG_sample_value` إلى القيمة `aaaa` التي تتوافق مع المفتاح `sample` من جدول التجزئة الذي يشار إليه بواسطة فلتر Xml_tag.

## Xml_tag_array Filter

الفلتر **Xml_tag_array** يشير إلى مصفوفة قيم الوسوم من البيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة عن طريق استخدام فهارسها. تبدأ فهارس المصفوفة من `0`. يمكن استخدام هذا الفلتر فقط في النقطة بالاشتراك مع محلل XML.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

يعمل فلترة [Array][link-array] المطبق على البيانات XML بطريقة مشابهة ل Xml_tag_array.

!!! info "طرق التوجه لمحتوى الوسم"
    لا يميز محلل XML بين قيمة الوسم والعنصر الأول في مصفوفة قيم الوسم.

على سبيل المثال، تشير النقاط `POST_XML_XML_TAG_myTag_value` و `POST_XML_XML_TAG_myTag_ARRAY_0_value` إلى نفس القيمة.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

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

الجسم، يشير Xml_tag_array المطبق على وسم `text` في جسم الطلب إلى المصفوفة التالية:

| الفهرس  | القيمة      |
|--------|-------------|
| 0      | Sample text.|
| 1      | aaaa        |

* تشير النقطة `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` إلى القيمة `Sample text.` التي تتوافق مع فهرس `0` من مصفوفة قيم وسم النص الذي يشار إليه بواسطة فلتر Xml_tag_array.
* تشير النقطة `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` إلى القيمة `aaaa` التي تتوافق مع فهرس `1` من مصفوفة قيم وسم النص، التي يشار إليها بواسطة فلتر Xml_tag_array.

## Xml_attr Filter

الفلتر **Xml_attr** يشير إلى جدول التجزئة للصفات الوسوم من البيانات XML. يجب الإشارة إلى عناصر هذا الجدول عن طريق استخدام أسماء الصفات.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون اسم الصفة في النقطة تعبيرًا عاديًا بلغة البرمجة [Ruby][link-ruby].  

يمكن استخدام هذا الفلتر فقط في النقطة بالاشتراك مع فلتر Xml_tag.

**مثال:** 

بالنسبة لـ

```
POST http://example.com/main/login HTTP/1.1
Content-type: application/xml
```

الطلب مع 

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- first -->
<text category="informational" font="12">
    Sample text.
</text>
```

الجسم، تشير المرشح Xml_attr المطبق على وسم `text` من جسم الطلب بالاشتراك مع محلل XML وفلتر Xml_tag إلى جدول التجزئة التالي:

| المفتاح    | القيمة         |
|----------|---------------|
| category | informational |
| font     | 12            |

* تشير النقطة `POST_XML_XML_TAG_text_XML_ATTR_category_value` إلى القيمة `informational` التي تتوافق مع المفتاح `category` من جدول تجزئة صفات وسم `text` الذي يشار إليه بواسطة فلتر Xml_attr.
* تشير النقطة `POST_XML_XML_TAG_text_XML_ATTR_font_value` إلى القيمة `12` التي تتوافق مع المفتاح `font` من جدول تجزئة صفات وسم `text` الذي يشار إليه بواسطة فلتر Xml_attr.
