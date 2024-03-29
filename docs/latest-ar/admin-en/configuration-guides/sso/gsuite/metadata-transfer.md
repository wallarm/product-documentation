# الخطوة 3: نقل بيانات G Suite الوصفية إلى معالج إعداد Wallarm

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

ارجع إلى معالج إعداد SSO الخاص بـ G Suite في واجهة Wallarm وانقر على *التالي* للانتقال إلى الخطوة التالية من الإعداد.

في هذه المرحلة، يجب عليك توفير البيانات الوصفية التي تم إنشاؤها بواسطة خدمة G Suite إلى معالج إعداد SSO الخاص بـ Wallarm.

هناك طريقتان لنقل البيانات الوصفية:
*   [تحميل ملف XML يحتوي على البيانات الوصفية في معالج إعداد Wallarm.][anchor-upload-metadata-xml]
*   [نسخ ولصق المعلمات المطلوبة يدويًا في معالج إعداد Wallarm.][anchor-upload-metadata-manually]


##  تحميل البيانات الوصفية باستخدام ملف XML

إذا قمت بحفظ بيانات G Suite الوصفية على شكل ملف XML عند تكوين التطبيق في G Suite سابقًا (في [الخطوة 2][doc-setup-idp])، انقر على زر *تحميل* واختر الملف الذي تريده. يمكنك أيضًا القيام بذلك بسحب الملف من مدير الملفات إلى رمز "XML". بعد تحميل الملف، انقر على *التالي* للانتقال إلى الخطوة التالية.

![تحميل البيانات الوصفية][img-sp-wizard-transfer-metadata]


##  نسخ المعلمات يدويًا

إذا قمت بنسخ معلمات مزود الهوية الموفرة عند تكوين التطبيق في G Suite، انقر على رابط *إدخال يدويًا* لإدخال المعلمات المنسوخة يدويًا وملء النموذج.

أدخل المعلمات التي تم إنشاؤها بواسطة G Suite في حقول معالج إعداد Wallarm كما يلي:

*   **SSO URL** → **عنوان SSO لمزود الهوية**
*   **Entity ID** → **مُصدر مزود الهوية**
*   **Certificate** → **شهادة X.509**

انقر على *التالي* للانتقال إلى الخطوة التالية. إذا أردت العودة إلى الخطوة السابقة، انقر على *رجوع*.

![إدخال البيانات الوصفية يدويًا][img-transfer-metadata-manually]


##  إكمال معالج SSO

في الخطوة النهائية من معالج إعداد Wallarm، سيتم إجراء اختبار الاتصال بخدمة G Suite تلقائيًا وسيتم التحقق من مزود SSO.

بعد إكمال الاختبار بنجاح (إذا تم ملء جميع المعلمات الضرورية بشكل صحيح)، سيُعلمك معالج الإعداد أن خدمة G Suite متصلة كمزود هوية ويمكنك بدء ربط آلية SSO لمصادقة المستخدمين.

أكمل تكوين SSO بالنقر على زر *إنهاء* أو انتقل إلى صفحة المستخدم لتكوين SSO بالنقر على الزر المقابل.

![إكمال معالج SSO][img-sp-wizard-finish]

بعد إكمال معالج تكوين SSO، سترى في علامة التبويب "التكامل" أن خدمة G Suite متصلة كمزود هوية وأنه لا توجد مزودات SSO متاحة أخرى.

![علامة التبويب “التكامل” بعد إنهاء معالج SSO][img-integration-tab]


الآن، انتقل إلى [الخطوة التالية][doc-allow-access-to-wl] من عملية تكوين SSO.