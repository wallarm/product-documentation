#   الخطوة 3: نقل بيانات G Suite Metadata إلى ساحر إعداد Wallarm

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

ارجع إلى معالج إعداد SSO لـ G Suite في وحدة تحكم Wallarm وانقر على *التالي* للمضي قدماً إلى الخطوة التالية في الإعداد.

في هذه المرحلة، عليك توفير بيانات metadata التي أنشأتها خدمة G Suite إلى معالج إعداد SSO لـ Wallarm.

هناك طريقتان لنقل بيانات metadata:
*   [رفع ملف XML به بيانات metadata في معالج إعداد Wallarm.][anchor-upload-metadata-xml]
*   [نسخ ولصق الباراميترات المطلوبة في معالج إعداد Wallarm يدويًا.][anchor-upload-metadata-manually]


##  رفع بيانات Metadata باستخدام ملف XML

إذا كنت قد حفظت بيانات metadata الخاصة بـ G Suite كملف XML عند تهيئة التطبيق في G Suite في وقت سابق (في [الخطوة 2][doc-setup-idp])، انقر على زر *رفع* واختر الملف المطلوب. يمكنك أيضًا القيام بذلك بسحب الملف من مدير الملفات إلى رمز “XML”. بعد رفع الملف، انقر على *التالي* للانتقال إلى الخطوة التالية.

![رفع بيانات metadata][img-sp-wizard-transfer-metadata]


##  نسخ الباراميترات يدويًا

إذا كنت قد نسخت الباراميترات المقدمة من مزود الهوية عند تهيئة التطبيق في G Suite، انقر على رابط *إدخال يدويًا* لإدخال الباراميترات التي تم نسخها يدويًا واملأ النموذج.

أدخل الباراميترات التي أنشأتها G Suite في حقول معالج إعداد Wallarm كما يلي:

*   **عنوان URL لـ SSO** → **عنوان URL لمزود الهوية SSO**
*   **معرف الكيان** → **مصدر مزود الهوية**
*   **الشهادة** → **شهادة X.509**

انقر على *التالي* للانتقال إلى الخطوة التالية. إذا أردت العودة إلى الخطوة السابقة، انقر على *العودة*.

![إدخال بيانات metadata يدويًا][img-transfer-metadata-manually]


##  إكمال معالج SSO

في الخطوة النهائية لمعالج إعداد Wallarm، سيتم تنفيذ اتصال اختباري بخدمة G Suite تلقائيًا وسيتم التحقق من مزود SSO.

بعد إكمال الاختبار بنجاح (إذا تم تعبئة جميع الباراميترات اللازمة بشكل صحيح)، سيعلمك معالج الإعداد بأن خدمة G Suite متصلة كمزود هوية ويمكنك بدء توصيل آلية SSO لمصادقة المستخدمين.

أكمل تهيئة SSO بالنقر على زر *إنهاء* أو انتقل إلى صفحة المستخدم لتهيئة SSO بالنقر على الزر المقابل.

![إكمال معالج SSO][img-sp-wizard-finish]

بعد إكمال معالج تهيئة SSO، سترى في التبويب "Integration" أن خدمة G Suite متصلة كمزود هوية وأنه لا توجد مزودات SSO أخرى متاحة.

![التبويب “Integration” بعد إنهاء معالج SSO][img-integration-tab]


الآن، انتقل إلى [الخطوة التالية][doc-allow-access-to-wl] في عملية تهيئة SSO.