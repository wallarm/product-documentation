[link-points]:          points/intro.md
[link-detect]:          detect/phase-detect.md
[link-collect]:         phase-collect.md
[link-match]:           phase-match.md
[link-modify]:          phase-modify.md
[link-send]:            phase-send.md
[link-generate]:        phase-generate.md
[link-extensions]:      using-extension.md
[link-ext-logic]:       logic.md
[link-vuln-list]:       ../vuln-list.md

[img-vulns]:            ../../images/fast/dsl/en/create-extension/vulnerabilities.png
[img-vuln-details]:     ../../images/fast/dsl/en/create-extension/vuln_details.png

[anchor-meta-info]:     #structure-of-the-meta-info-section

# إنشاء امتدادات FAST

!!! info "بناء جملة وصف عناصر الطلب"
    عند إنشاء امتداد FAST، تحتاج إلى فهم بنية طلب HTTP المرسل إلى التطبيق وبنية الرد HTTP المستلم من التطبيق لتصف بدقة عناصر الطلب التي تحتاج إلى العمل معها باستخدام النقاط.

    للحصول على معلومات مفصلة، تابع إلى هذا [الرابط][link-points].

يتم إنشاء امتدادات FAST بوصف جميع الأقسام المطلوبة لتشغيل الامتداد في ملف YAML المقابل. يستخدم الامتداد من نوع مختلف مجموعة خاصة به من الأقسام ([معلومات مفصلة عن أنواع الامتدادات][link-ext-logic]).

## الأقسام المستخدمة

### امتداد التعديل

يستخدم هذا النوع من الامتدادات الأقسام التالية:
* الأقسام الإلزامية:
    * `meta-info`—يحتوي على معلومات حول الثغرة الأمنية التي من المفترض أن يكتشفها الامتداد. يوصف بنية هذا القسم [أدناه][anchor-meta-info].
    * `detect`—يحتوي على وصف الطور Detect الإلزامي. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-detect].
* الأقسام الاختيارية (قد تكون غير موجودة):
    * `collect`—يحتوي على وصف لطور Collect الاختياري. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-collect].
    * `match`—يحتوي على وصف لطور Match الاختياري. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-match].
    * `modify`—يحتوي على وصف لطور Modify الاختياري. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-modify].
    * `generate`—يحتوي على وصف لطور Generate الاختياري. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-generate].

### امتداد غير تعديلي

يستخدم هذا النوع من الامتدادات الأقسام الإلزامية التالية:
* `meta-info`—يحتوي على معلومات حول الثغرة الأمنية التي من المفترض أن يكتشفها الامتداد. يوصف بنية هذا القسم [أدناه][anchor-meta-info].
* `send`—يحتوي على طلبات اختبار محددة مسبقًا ليتم إرسالها إلى مضيف مدرج في طلب أساسي. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-send].
* `detect`—يحتوي على وصف لطور Detect الإلزامي. للحصول على معلومات مفصلة حول هذه المرحلة وبنية القسم المقابل، تابع إلى هذا [الرابط][link-detect].

## بنية قسم `meta-info`

قسم `meta-info` الإعلامي يتكون من البنية التالية:

```
meta-info:
  - title:
  - type:
  - threat:
  - description:
```

* `title` — خيط عنوان اختياري يصف الثغرة الأمنية. سيتم عرض القيمة المحددة في قائمة الثغرات الأمنية المكتشفة على واجهة ويب Wallarm في عمود "العنوان". يمكن استخدامه لتحديد إما الثغرة الأمنية أو الامتداد المعين الذي اكتشف الثغرة.

    ??? info "مثال"
        `title: "ثغرة توضيحية"`

* `type` — بارامتر إلزامي يصف نوع الثغرة الأمنية التي يحاول الامتداد استغلالها. سيتم عرض القيمة المحددة في عمود "النوع" في قائمة الثغرات الأمنية المكتشفة على واجهة ويب Wallarm. يمكن للبارامتر أخذ إحدى القيم الموصوفة [هنا][link-vuln-list].
   
    ??? info "مثال"
        `type: sqli`    

* `threat` — بارامتر اختياري يحدد مستوى تهديد الثغرة الأمنية. ستتم مشاهدة القيمة المحددة بصريًا في قائمة الثغرات الأمنية المكتشفة على واجهة ويب Wallarm في عمود "الخطر". يمكن تعيين قيمة عددية للبارامتر تتراوح من 1 إلى 100. كلما ارتفعت القيمة، زاد مستوى تهديد الثغرة الأمنية.

    ??? info "مثال"
        `threat: 20`
    
    ![قائمة الثغرات الأمنية المكتشفة][img-vulns]

* `description` — بارامتر سلسلة اختياري يحتوي على وصف للثغرة الأمنية التي يكتشفها الامتداد. ستتم مشاهدة هذه المعلومات في الوصف التفصيلي للثغرة الأمنية.
    
    ??? info "مثال"
        `description: "ثغرة توضيحية"`    
    
    ![وصف تفصيلي للثغرة الأمنية على واجهة ويب Wallarm][img-vuln-details]

!!! info "توصيل امتدادات FAST"
    لتوصيل امتداد إلى FAST، تحتاج إلى تركيب الدليل الذي يحتوي على ملف YAML للامتداد إلى حاوية Docker لعقدة FAST. للحصول على معلومات مفصلة حول إجراء التركيب، انتقل إلى هذا [الرابط][link-extensions].