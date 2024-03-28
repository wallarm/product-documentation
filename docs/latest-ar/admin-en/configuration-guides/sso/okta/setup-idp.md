#   الخطوة 2: إنشاء وتكوين تطبيق في Okta

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

!!! info "متطلبات مسبقة"
    تُستخدم القيم التالية كقيم توضيحية في هذا الدليل:
    
    * `WallarmApp` كقيمة لمعامل **اسم التطبيق** (في Okta).
    * `https://sso.online.wallarm.com/acs` كقيمة لمعامل **عنوان URL لتسجيل الدخول الموحد** (في Okta).
    * `https://sso.online.wallarm.com/entity-id` كقيمة لمعامل **URI الجمهور** (في Okta).

!!! warning
    تأكد من استبدال القيم التوضيحية لمعاملات **عنوان URL لتسجيل الدخول الموحد** و**URI الجمهور** بالقيم الحقيقية المُحصلة في [الخطوة السابقة][doc-setup-sp].

قم بتسجيل الدخول إلى خدمة Okta (يجب أن يمتلك الحساب صلاحيات المسؤول) وانقر على زر *المسؤول* في الزاوية العلوية اليمنى.

في قسم *لوحة التحكم*، انقر على زر *إضافة تطبيقات* على اليمين.

![لوحة تحكم Okta][img-dashboard]

في قسم التطبيق الجديد، انقر على زر *إنشاء تطبيق جديد* على اليمين.

في نافذة منبثقة، قم بتعيين الخيارات التالية:
1.  **المنصة** → "ويب".
2.  **طريقة تسجيل الدخول** → "SAML 2.0".

انقر على زر *إنشاء*.

بعد ذلك، ستنتقل إلى معالج دمج SAML (*إنشاء دمج SAML*). سيُطلب منك إكمال ثلاث مراحل لإنشاء وتكوين دمج SAML:
1.  [الإعدادات العامة.][anchor-general-settings]
2.  [تكوين SAML.][anchor-configure-saml]
3.  [التقييم.][anchor-feedback]

بعد ذلك، يجب [تحميل البيانات الوصفية][anchor-fetch-metadata] للدمج الذي تم إنشاؤه حديثًا.


##  1.  الإعدادات العامة

أدخل اسم التطبيق الذي تقوم بإنشائه في حقل **اسم التطبيق**.

اختياريًا، يمكنك تحميل شعار التطبيق (**شعار التطبيق**) وتكوين رؤية التطبيق لمستخدميك على الصفحة الرئيسية لـ Okta وفي تطبيق Okta المحمول.

انقر على زر *التالي*.

![الإعدادات العامة][img-general]


##  2.  تكوين SAML

في هذه المرحلة ستحتاج إلى المعاملات التي تم توليدها [سابقًا][doc-setup-sp] من جانب Wallarm:

*   **معرّف كيان Wallarm**
*   **عنوان URL لخدمة استهلاك الادعاء (ACS URL)**

!!! info "معاملات Okta"
    هذا الدليل يصف فقط المعاملات الإلزامية التي يجب ملؤها عند تكوين SSO مع Okta.
    
    لمعرفة المزيد عن بقية المعاملات (بما في ذلك تلك المتعلقة بإعدادات التوقيع الرقمي وتشفير رسائل SAML)، يرجى الرجوع إلى [وثائق Okta][link-okta-docs].

املأ المعاملات الأساسية التالية:
*   **عنوان URL لتسجيل الدخول الموحد**—أدخل قيمة **عنوان URL لخدمة استهلاك الادعاء (ACS URL)** التي تم الحصول عليها مسبقًا من جانب Wallarm.
*   **URI الجمهور (معرّف كيان SP)**—أدخل قيمة **معرّف كيان Wallarm** التي تم الحصول عليها مسبقًا من جانب Wallarm.

يمكن ترك المعاملات المتبقية للإعداد الأولي كما هي بشكل افتراضي.

![تكوين SAML][img-saml]

انقر على *التالي* لمتابعة الإعداد. إذا أردت العودة إلى الخطوة السابقة، انقر على *السابق*.

![معاينة إعدادات SAML][img-saml-preview]


##  3.  التقييم

في هذه المرحلة، سيُطلب منك تزويد Okta بمعلومات إضافية حول نوع تطبيقك، سواء كنت عميلاً لـ Okta أو شريكًا، وغيرها من البيانات. يكفي اختيار "أنا عميل Okta أضيف تطبيقًا داخليًا" للمعامل **هل أنت عميل أم شريك**؟

إذا لزم الأمر، قم بملء المعاملات الأخرى المتاحة.

بعد ذلك، يمكنك إنهاء معالج دمج SAML بالنقر على زر *إنهاء*. للعودة إلى الخطوة السابقة، انقر على الزر *السابق*.

![نموذج التقييم][img-feedback]

بعد هذه المرحلة، ستنتقل إلى صفحة إعدادات التطبيق الذي تم إنشاؤه.

الآن، تحتاج إلى [تحميل البيانات الوصفية][anchor-fetch-metadata] للدمج الذي تم إنشاؤه لـ [متابعة تكوين مزود SSO][doc-metadata-transfer] من جانب Wallarm.

البيانات الوصفية هي مجموعة من المعاملات التي تصف خصائص مزود الهوية (مثل تلك التي تم توليدها لمزود الخدمة في [الخطوة 1][doc-setup-sp]) المطلوبة لتكوين SSO.


##  تحميل البيانات الوصفية

يمكن تحميل البيانات الوصفية إما كملف XML أو "كما هي" في شكل نص (ستحتاج إلى إدخال البيانات الوصفية يدويًا عند تكوينها لاحقًا).

لتحميل كملف XML:
1.  انقر على رابط *بيانات مزود الهوية الوصفية* على صفحة إعدادات التطبيق الذي تم إنشاؤه:

    ![رابط تحميل البيانات الوصفية][img-fetch-metadata-xml]
    
    نتيجة لذلك، ستُنقل إلى علامة تبويب جديدة في متصفحك مع محتوى مماثل:
    
    ![مثال على البيانات الوصفية بتنسيق XML][img-xml-metadata]
    
2.  احفظ المحتوى في ملف XML (باستخدام متصفحك أو أي طريقة مناسبة أخرى).

لتحميل البيانات الوصفية "كما هي":
1.  على صفحة إعدادات التطبيق الذي تم إنشاؤه، انقر على زر *عرض إرشادات الإعداد*.

    ![زر “عرض إرشادات الإعداد”][img-fetch-metadata-manually]
    
2.  انسخ جميع البيانات المُقدمة.


الآن، يمكنك [متابعة تكوين SSO][doc-metadata-transfer] من جانب Wallarm.