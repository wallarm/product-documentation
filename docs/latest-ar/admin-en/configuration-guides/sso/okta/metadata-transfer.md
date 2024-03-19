#   الخطوة 3: نقل بيانات Okta إلى معالج إعداد Wallarm

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

عُد إلى معالج إعداد Okta SSO في وحدة تحكم Wallarm واضغط *التالي* للانتقال إلى خطوة الإعداد التالية.

في هذه الخطوة، يلزم توفير البيانات الوصفية [التي تم توليدها][link-metadata] بواسطة خدمة Okta.

هناك طريقتان لإرسال بيانات مزود الهوية (في هذه الحالة Okta) إلى معالج إعداد Wallarm:
*   برفع ملف XML يحوي البيانات الوصفية.

    ارفع ملف XML بالضغط على زر *الرفع* واختيار الملف المناسب. يمكنك أيضًا القيام بذلك بسحب الملف من مدير الملفات إلى حقل أيقونة "XML".

*   بإدخال البيانات الوصفية يدويًا.

    اضغط على رابط *إدخال يدوي* وانسخ معايير خدمة Okta إلى حقول معالج الإعداد على النحو التالي:
    
    *   **رابط تسجيل الدخول الموحد لمزود الهوية** إلى حقل **رابط تسجيل الدخول الموحد لمزود الهوية**.
    *   **مُصدر مزود الهوية** إلى حقل **مُصدر مزود الهوية**.
    *   **شهادة X.509** إلى حقل **شهادة X.509**.
    
    ![إدخال البيانات الوصفية يدويًا][img-transfer-metadata-manually]
    
اضغط *التالي* للانتقال إلى الخطوة التالية. إذا أردت العودة إلى الخطوة السابقة، اضغط *رجوع*.


##  إكمال معالج SSO

في الخطوة الأخيرة من معالج إعداد Wallarm، سيتم إجراء اختبار توصيل تلقائيًا مع خدمة Okta وسيتم فحص مزود SSO.

بعد إكمال الاختبار بنجاح (إذا تم ملء جميع المعلومات اللازمة بشكل صحيح)، سيخبرك معالج الإعداد أن خدمة Okta متصلة كمزود للهوية، ويمكنك البدء بتوصيل آلية SSO لمصادقة المستخدمين.

أكمل تكوين SSO بالضغط على زر *إنهاء* أو بالانتقال إلى صفحة المستخدم لتكوين SSO بالضغط على الزر المناسب.

![إكمال معالج SSO][img-sp-wizard-finish]

بعد إكمال معالج تكوين SSO، سترى في علامة التبويب *التكامل* أن خدمة Okta متصلة كمزود للهوية وأنه لا تتوفر مزودات SSO أخرى.

![علامة التبويب "التكامل" بعد إنهاء معالج SSO][img-integration-tab]


الآن، انتقل إلى [الخطوة التالية][doc-allow-access-to-wl] في عملية تكوين SSO.