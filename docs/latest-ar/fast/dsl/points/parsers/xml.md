[link-ruby]:                http://ruby-doc.org/core-2.6.1/doc/regexp_rdoc.html
[link-xmltag-array]:        array.md#the-example-of-using-the-xmltag-filter-and-the-array-filter
[link-array]:               array.md

[anchor1]:      #xml_comment-filter
[anchor2]:      #xml_dtd-filter
[anchor3]:      #xml_dtd_entity-filter
[anchor4]:      #xml_pi-filter
[anchor5]:      #xml_tag-filter
[anchor6]:      #xml_tag_array-filter
[anchor7]:      #xml_attr-filter

# معالج XML

يتم استخدام معالج **XML** للعمل مع البيانات بتنسيق XML التي يمكن أن تكون موجودة في أي جزء من الطلب. يجب تحديد اسمه في نقطة عند استخدام المرشحات التي يوفرها.

يمكنك استخدام اسم معالج XML في النقطة دون أي مرشحات مقدمة منه للعمل مع محتوى حاوية البيانات XML من الرتبة الأعلى في شكلها الخام.

**المثال:** 

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
    نص عينة.
</text>
```

الجسم، النقطة `POST_XML_value` تشير إلى البيانات التالية بتنسيق خام:

```
<!DOCTYPE foo [<!ENTITY eee SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<text>
    نص عينة.
</text>
```

يبني معالج XML بنية بيانات معقدة على أساس البيانات المدخلة. يمكنك استخدام المرشحات التالية للعنوان العناصر من هذه البنية البيانات:
* [مرشح Xml_comment ][anchor1];
* [مرشح Xml_dtd ][anchor2];
* [مرشح Xml_dtd_entity ][anchor3];
* [مرشح Xml_pi ][anchor4];
* [مرشح Xml_tag ][anchor5];
* [مرشح Xml_tag_array ][anchor6];
* [مرشح Xml_attr ][anchor7].

أضف أسماء معالج XML والمرشح المقدم منه بحروف كبيرة إلى النقطة لاستخدام المرشح في النقطة.


## مرشح Xml_comment

يشير المرشح **Xml_comment** إلى المصفوفة التي تحتوي على التعليقات من البيانات بتنسيق XML. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام فهارسها. تبدأ فهرسة المصفوفة بـ `0`.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

يمكن استخدام مرشح Xml_comment فقط في النقطة بالاشتراك مع معالج XML.

**المثال:** 

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
<!-- الأول -->
<text>
    نص عينة.
</text>
<!-- الثاني -->
```

الجسم، يشير Xml_comment المطبق بالاشتراك مع معالج XML إلى المصفوفة التالية:

| الفهرس  | القيمة    |
|--------|----------|
| 0      | الأول    |
| 1      | الثاني   |

* تشير النقطة `POST_XML_XML_COMMENT_0_value` إلى القيمة `الأول` التي تتوافق مع الفهرس `0` من المصفوفة التي يتم توجيهها بواسطة المرشح Xml_comment.
* تشير النقطة `POST_XML_XML_COMMENT_1_value` إلى القيمة `الثاني` التي تتوافق مع الفهرس `1` من المصفوفة التي يتم توجيهها بواسطة المرشح Xml_comment.

## مرشح Xml_dtd

يشير المرشح **Xml_dtd** إلى المخطط الخارجي DTD المستخدم في بيانات XML. يمكن استخدام هذا المرشح فقط في النقطة بالاشتراك مع معالج XML.

يشير مرشح Xml_dtd إلى قيمة سلسلة. لا يمكن لهذا المرشح الإشارة إلى بنى بيانات معقدة (مثل المصفوفات أو جداول التجزئة).


**المثال:** 

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
<!-- الأول -->
<text>
    نص عينة.
</text>
```

الجسم، تشير النقطة `POST_XML_DTD_value` إلى القيمة `example.dtd`.

## مرشح Xml_dtd_entity

يشير المرشح **Xml_dtd_entity** إلى المصفوفة التي تحتوي على تعليمات المخطط DTD المحددة في البيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام فهارسها. تبدأ فهرسة المصفوفة بـ `0`. 

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

يمكن استخدام مرشح Xml_dtd_entity فقط في النقطة بالاشتراك مع معالج XML.

**المثال:** 

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
<!ENTITY sample "هذا نص تجريبي.">
]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- الأول -->
<text>
    &xxe;
</text>
<text>
    &sample;
</text>
```

الجسم، يشير مرشح Xml_dtd_entity المطبق على جسم الطلب بالاشتراك مع معالج XML إلى المصفوفة التالية:

| الفهرس  | الاسم   | القيمة                |
|--------|--------|----------------------|
| 0      | xxe    | aaaa                 |
| 1      | sample | هذا نص تجريبي. |

في هذه المصفوفة، يشير كل فهرس إلى الزوج (اسم - قيمة) الذي يتوافق مع الاسم والقيمة للمخطط DTD.
* أضف اللاحقة `_name` في نهاية النقطة التي تستخدم مرشح Xml_dtd_entity للإشارة إلى اسم تعليمة المخطط.
* أضف اللاحقة `_value` في نهاية النقطة التي تستخدم مرشح Xml_dtd_entity للإشارة إلى قيمة تعليمة المخطط.



* تشير النقطة `POST_XML_XML_DTD_ENTITY_0_name` إلى اسم التعليمة `xxe` الذي يتوافق مع الفهرس `0` من المصفوفة التي يتم توجيهها بواسطة مرشح Xml_dtd_entity.
* تشير النقطة `POST_XML_XML_DTD_ENTITY_1_value` إلى قيمة التعليمة `هذا نص تجريبي.` الذي يتوافق مع الفهرس `1` من المصفوفة التي يتم توجيهها بواسطة مرشح Xml_dtd_entity.

## مرشح Xml_pi

يشير المرشح **Xml_pi** إلى مصفوفة التعليمات لمعالجة البيانات المحددة لبيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام فهارسها. تبدأ فهرسة المصفوفة بـ `0`. 

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

يمكن استخدام مرشح Xml_pi فقط في النقطة بالاشتراك مع معالج XML.

**المثال:** 

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
<!-- الأول -->
<text>
    نص عينة.
</text>
```

الجسم، يشير مرشح Xml_pi المطبق على جسم الطلب مع معالج XML إلى المصفوفة التالية:

| الفهرس  | الاسم           | القيمة                           |
|--------|----------------|----------------------------------|
| 0      | xml-stylesheet | type="text/xsl" href="style.xsl" |
| 1      | last-edit      | user="John" date="2019-05-11"    |

في هذه المصفوفة، يشير كل فهرس إلى الزوج (اسم - قيمة) الذي يتطابق مع الاسم والقيمة لتعليمة معالجة البيانات.
* أضف اللاحقة `_name` في نهاية النقطة التي تستخدم مرشح Xml_pi للإشارة إلى اسم التعليمة لمعالجة البيانات.
* أضف اللاحقة `_value` في نهاية النقطة التي تستخدم مرشح Xml_pi للإشارة إلى قيمة التعليمة لمعالجة البيانات.



* تشير النقطة `POST_XML_XML_PI_0_name` إلى اسم التعليمة `xml-stylesheet` الذي يتطابق مع الفهرس `0` من المصفوفة التي يتم توجيهها بواسطة مرشح Xml_pi.
* تشير النقطة `POST_XML_XML_PI_1_value` إلى قيمة التعليمة `user="John" date="2019-05-11"` الذي يتطابق مع الفهرس `1` من المصفوفة التي يتم توجيهها بواسطة مرشح Xml_pi.

## مرشح Xml_tag

يشير المرشح **Xml_tag** إلى الجدول التجزئي لوسوم XML من بيانات XML. يجب الإشارة إلى عناصر هذا الجدول التجزئي باستخدام أسماء الوسوم. يمكن استخدام هذا المرشح فقط في النقطة بالاشتراك مع معالج XML. 

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون اسم الوسم في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

الوسوم من بيانات XML قد تحتوي أيضاً على مصفوفات القيم. استخدم مرشح [Array][link-xmltag-array] أو [ Xml_tag_array][anchor6] للإشارة إلى القيم من هذه المصفوفات.

**المثال:** 

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
<!-- الأول -->
<text>
    نص عينة.
</text>
<sample>
    &eee;
</sample>
```

الجسم، يشير مرشح Xml_tag المطبق على جسم الطلب مع معالج XML إلى الجدول التجزئي التالي:

| الرمز    | القيمة        |
|--------|--------------|
| text   | نص عينة. |
| sample | aaaa         |

* تشير النقطة `POST_XML_XML_TAG_text_value` إلى القيمة `نص عينة.` التي تتوافق مع الرمز `text` من الجدول التجزئي الذي يتم توجيهه بواسطة مرشح Xml_tag.
* تشير النقطة `POST_XML_XML_TAG_sample_value` إلى القيمة `aaaa` التي تتوافق مع الرمز `sample` من الجدول التجزئي الذي يتم توجيهه بواسطة مرشح Xml_tag.

## مرشح Xml_tag_array

يشير المرشح **Xml_tag_array** إلى مصفوفة قيم الوسم من بيانات XML. يجب الإشارة إلى عناصر هذه المصفوفة باستخدام فهارسها. تبدأ فهرسة المصفوفة بـ `0`. يمكن استخدام هذا المرشح فقط في النقطة بالاشتراك مع معالج XML. 

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون الفهرس في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

يعمل مرشح [Array][link-array] المطبق على بيانات XML بطريقة مشابهة لـ Xml_tag_array.

!!! info "طرق معالجة محتوى الوسوم"
    لا يميز معالج XML بين قيمة الوسم والعنصر الأول في مصفوفة قيم الوسوم.

مثلاً، تشير النقاط `POST_XML_XML_TAG_myTag_value` و `POST_XML_XML_TAG_myTag_ARRAY_0_value` إلى القيمة نفسها.

**المثال:** 

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
<!-- الأول -->
<text>
    نص عينة.
</text>
<text>
    &eee;
</text>
```

الجسم، يشير مرشح Xml_tag_array المطبق على وسم `text` في جسم الطلب إلى المصفوفة التالية:

| الفهرس  | القيمة       |
|--------|--------------|
| 0      | نص عينة. |
| 1      | aaaa         |

* تشير النقطة `POST_XML_XML_TAG_text_XML_TAG_ARRAY_0_value` إلى القيمة `نص عينة.` التي تتوافق مع الفهرس `0` من مصفوفة قيم وسم النص الموجهة بواسطة مرشح Xml_tag_array.
* تشير النقطة `POST_XML_XML_TAG_text_XML_TAG_ARRAY_1_value` إلى القيمة `aaaa` التي تتوافق مع الفهرس `1` من مصفوفة قيم وسم النص الموجهة بواسطة مرشح Xml_tag_array.

## مرشح Xml_attr

يشير المرشح **Xml_attr** إلى جدول التجزئة لسمات الوسم من بيانات XML. يجب الإشارة إلى عناصر هذا الجدول التجزئة باستخدام أسماء السمات.

!!! info "التعبيرات العادية في النقاط"
    يمكن أن يكون اسم السمة في النقطة تعبير عادي من لغة البرمجة [Ruby][link-ruby].  

يمكن استخدام هذا المرشح فقط في النقطة بالاشتراك مع مرشح Xml_tag.

**المثال:** 

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
<!-- الأول -->
<text category="معلومات" font="12">
    نص عينة.
</text>
```

الجسم، يشير مرشح Xml_attr المطبق على وسم `text` في جسم الطلب بالاشتراك مع معالج XML ومرشح Xml_tag إلى الجدول التجزئة التالي:

| الرمز     | القيمة        |
|----------|--------------|
| category | معلومات |
| font     | 12           |

* تشير النقطة `POST_XML_XML_TAG_text_XML_ATTR_category_value` إلى القيمة `معلومات` التي تتطابق مع الرمز `category` من جدول تجزئة سمات وسم النص الموجهة بواسطة مرشح Xml_attr.
* تشير النقطة `POST_XML_XML_TAG_text_XML_ATTR_font_value` إلى القيمة `12` التي تتطابق مع الرمز `font` من جدول تجزئة سمات وسم النص الموجهة بواسطة مرشح Xml_attr.