# الخطوة 2: إنشاء وتكوين تطبيق في G Suite

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! info "المتطلبات الأولية"
    القيم التالية تُستخدم كقيم عرض في هذا الدليل:

    * `WallarmApp` كقيمة لمعامل **اسم التطبيق** (في G Suite).
    * `https://sso.online.wallarm.com/acs` كقيمة لمعامل **عنوان URL لـ ACS** (في G Suite).
    * `https://sso.online.wallarm.com/entity-id` كقيمة لمعامل **معرّف الكيان** (في G Suite).

!!! warning
    تأكد من استبدال القيم العينية لمعاملي **عنوان URL لـ ACS** و **معرّف الكيان** بالقيم الحقيقية المُحصل عليها في [الخطوة السابقة][doc-setup-sp].

قم بتسجيل الدخول إلى لوحة التحكم [admin console][link-gsuite-adm-console] من Google. اضغط على كتلة *التطبيقات*.

![لوحة تحكم الإدارة في G Suite][img-gsuite-console]

اضغط على كتلة *تطبيقات SAML*. أضف تطبيقًا جديدًا بالضغط على رابط *إضافة خدمة/تطبيق إلى نطاقك* أو زر "+" في أسفل اليمين.

اضغط على زر *ضبط التطبيق الخاص بي*.

![إضافة تطبيق جديد إلى G Suite][img-gsuite-add-app]

سيتم توفير معلومات (metadata) من G Suite كمزود هوية لك:
*   **عنوان URL لـ SSO**
*   **معرّف الكيان**
*   **الشهادة** (X.509)

metadata هي مجموعة من المعاملات التي تصف خصائص مزود الهوية (مشابهة لتلك التي تم إنشاؤها لمزود الخدمة في [الخطوة 1][doc-setup-sp]) والتي تُعد ضرورية لتكوين SSO.

يمكن نقلها إلى معالج تكوين Wallarm SSO بطريقتين:
*   نسخ كل معامل وتنزيل الشهادة، ثم لصقها (تحميلها) في الحقول المقابلة لمعالج تكوين Wallarm.
*   تنزيل ملف XML ببيانات metadata وتحميله على جانب Wallarm.

احفظ metadata بأي طريقة تفضلها وانتقل إلى الخطوة التالية في تكوين التطبيق بالضغط على *التالي*. سيتم وصف إدخال metadata الخاصة بمزود الهوية على جانب Wallarm في [الخطوة 3][doc-metadata-transfer].

![حفظ metadata][img-fetch-metadata]

المرحلة التالية في تكوين التطبيق هي تقديم metadata الخاصة بمزود الخدمة (Wallarm). الحقول المطلوبة:
*   **عنوان URL لـ ACS** يتوافق مع معامل **عنوان URL لخدمة استقبال الادعاء** الذي تم إنشاؤه على جانب Wallarm.
*   **معرّف الكيان** يتوافق مع معامل **معرّف كيان Wallarm** الذي تم إنشاؤه على جانب Wallarm.

املأ الحقول المتبقية إذا لزم الأمر. اضغط على *التالي*.

![ملء معلومات مزود الخدمة][img-fill-in-sp-data]

في المرحلة الأخيرة من تكوين التطبيق، سيُطلب منك توفير التعيينات بين خصائص مزود الخدمة لحقول ملفات الصفات المتاحة. Wallarm (كمزود خدمة) يتطلب منك إنشاء تعيين الخصائص.

اضغط على *إضافة تعيين جديد* ثم قم بتعيين خاصية `البريد الإلكتروني` إلى حقل "البريد الإلكتروني الأساسي" (في مجموعة "المعلومات الأساسية").

![إنشاء تعيين خصائص][img-create-attr-mapping]

اضغط على *إنهاء*.

بعد ذلك، ستُعلم في نافذة منبثقة أن المعلومات المقدمة تم حفظها و، من أجل إكمال تكوين SAML SSO، ستحتاج إلى رفع البيانات حول مزود الهوية (Google) في لوحة الإدارة لمزود الخدمة (Wallarm). اضغط على *موافق*.

بعد ذلك، سيتم إعادة توجيهك إلى صفحة التطبيق المُنشأ.
بمجرد إنشاء التطبيق، يتم تعطيله لجميع المنظمات الخاصة بك في G Suite. لتفعيل SSO لهذا التطبيق، اضغط على زر *تعديل الخدمة*.

![صفحة التطبيق في G Suite][img-app-page]

اختر *تفعيل للجميع* لمعامل **حالة الخدمة** واضغط على *حفظ*.


الآن يمكنك [الاستمرار في تكوين SSO][doc-metadata-transfer] على جانب Wallarm.