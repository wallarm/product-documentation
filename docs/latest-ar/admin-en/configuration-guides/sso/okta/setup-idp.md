#   الخطوة 2: إنشاء وتهيئة تطبيق في Okta

[img-dashboard]:            ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:   ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:         ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:  ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:  #1-general-settings
[anchor-configure-saml]:    #2-configure-saml
[anchor-feedback]:          #3-feedback
[anchor-fetch-metadata]:    #downloading-metadata  

!!! info "المتطلبات الأساسية"
    القيم التالية تُستخدم كقيم توضيحية في هذا الدليل:
    
    *   `WallarmApp` كقيمة لمتغير **اسم التطبيق** (في Okta).
    *   `https://sso.online.wallarm.com/acs` كقيمة لمتغير **URL الموحد للتسجيل** (في Okta).
    *   `https://sso.online.wallarm.com/entity-id` كقيمة لمتغير **معرّف المستمع (URI)** (في Okta).

!!! warning
    تأكد من استبدال القيم النموذجية لمتغيرات **URL الموحد للتسجيل** و **معرّف المستمع (URI)** بالقيم الحقيقية المحصل عليها في [الخطوة السابقة][doc-setup-sp].

قم بتسجيل الدخول إلى خدمة Okta (يجب أن يكون الحساب بحقوق المدير) وانقر على زر *المدير* في أعلى اليمين.

في قسم *لوحة التحكم*، انقر على زر *إضافة تطبيقات* على اليمين.

![لوحة تحكم Okta][img-dashboard]

في قسم التطبيق الجديد، انقر على زر *إنشاء تطبيق جديد* على اليمين.

في النافذة المنبثقة، حدد الخيارات التالية:
1.  **منصة** → "ويب".
2.  **طريقة الدخول** → "SAML 2.0".

انقر على زر *إنشاء*.

بعد ذلك، سيتم نقلك إلى معالج التكامل SAML (*إنشاء SAML التكامل*). لإنشاء وتهيئة التكامل SAML، سيُطلب منك إكمال ثلاث مراحل:
1.  [إعدادات عامة.][anchor-general-settings]
2.  [تكوين SAML.][anchor-configure-saml]
3.  [التغذية الراجعة.][anchor-feedback]

بعد ذلك، [يجب تنزيل البيانات الوصفية][anchor-fetch-metadata] للتكامل المُنشأ حديثا.

##  1.  الإعدادات العامة

أدخل اسم التطبيق الذي تقوم بإنشائه في حقل **اسم التطبيق**.

اختياريا، يمكنك تنزيل شعار التطبيق (**شعار التطبيق**) وتهيئة رؤية التطبيق لمستخدميك في الصفحة الرئيسية لـ Okta وفي تطبيق Okta المحمول.

انقر على زر *التالي*.

![الإعدادات العامة][img-general]

##  2.  تكوين SAML

في هذه المرحلة ستحتاج إلى المتغيرات التي تم توليدها [سابقًا][doc-setup-sp] من جانب Wallarm:

*   **معرّف كيان Wallarm**
*   **عنوان URL لخدمة استهلاك التأكيد (ACS URL)**

!!! info "متغيرات Okta"
    هذا الدليل يصف فقط المتغيرات الإلزامية التي يجب تعبئتها عند تكوين SSO مع Okta.
    
    لمعرفة المزيد عن باقي المتغيرات (بما في ذلك تلك المتعلقة بإعدادات التوقيع الرقمي وتشفير رسائل SAML)، يرجى الرجوع إلى [وثائق Okta][link-okta-docs].

املأ المتغيرات الأساسية التالية:
*   **URL الموحد للتسجيل**—أدخل قيمة **عنوان URL لخدمة استهلاك التأكيد (ACS URL)** المحصل عليها سابقاً من جانب Wallarm.
*   **معرّف المستمع (معرّف SP)**—أدخل قيمة **معرّف كيان Wallarm** التي تم الحصول عليها سابقاً من جانب Wallarm.

بقية المتغيرات للإعداد الأولي يمكن تركها كما هي.

![تكوين SAML][img-saml]

انقر على *التالي* لاستكمال الإعداد. إذا أردت العودة إلى الخطوة السابقة، انقر على *السابق*.

![معاينة إعدادات SAML][img-saml-preview]

##  3.  التغذية الراجعة

في هذه المرحلة، يُطلب منك تزويد Okta بمعلومات إضافية حول نوع تطبيقك، إذا كنت عميلًا أو شريكًا لـ Okta، وبيانات أخرى. يكفي اختيار "أنا عميل Okta أضيف تطبيق داخلي" لمتغير **هل أنت عميل أو شريك**؟

إذا لزم الأمر، قم بملء المتغيرات الأخرى المتاحة.

بعد ذلك، يمكنك إنهاء معالج التكامل SAML بالنقر على زر *إنهاء*. للذهاب إلى الخطوة السابقة، انقر على زر *السابق*.

![نموذج التغذية الراجعة][img-feedback]

بعد هذه المرحلة، سيتم نقلك إلى صفحة الإعدادات للتطبيق الذي تم إنشاؤه.

الآن تحتاج إلى [تنزيل البيانات الوصفية][anchor-fetch-metadata] للتكامل الذي تم إنشاؤه لـ [استمرار في تهيئة مزود SSO][doc-metadata-transfer] من جانب Wallarm.

البيانات الوصفية هي مجموعة من المتغيرات التي تصف خصائص موفر الهوية (مثل تلك التي تم توليدها لموفر الخدمة في [الخطوة 1][doc-setup-sp]) المطلوبة لتكوين SSO.


##  تنزيل البيانات الوصفية

يمكنك تنزيل البيانات الوصفية إما كملف XML أو "كما هي" بنص (ستحتاج إلى إدخال البيانات الوصفية يدويًا عند تكوينها لاحقًا).

للتنزيل كملف XML:
1.  انقر على رابط *بيانات موفر الهوية الوصفية* في صفحة الإعدادات للتطبيق المُنشأ:

    ![رابط تنزيل البيانات الوصفية][img-fetch-metadata-xml]
    
    نتيجة لذلك، سيتم نقلك إلى علامة تبويب جديدة في المتصفح بمحتوى مماثل:
    
    ![مثال على البيانات الوصفية بتنسيق XML][img-xml-metadata]
    
2.  حفظ المحتوى لملف XML (باستخدام المتصفح أو طريقة مناسبة أخرى).

لتنزيل البيانات الوصفية "كما هي":
1.  في صفحة الإعدادات للتطبيق المُنشأ، انقر على زر *عرض تعليمات الإعداد*.

    ![زر "عرض تعليمات الإعداد"][img-fetch-metadata-manually]
    
2.  انسخ كل البيانات المعطاة.

الآن يمكنك [الاستمرار في تكوين SSO][doc-metadata-transfer] من جانب Wallarm.