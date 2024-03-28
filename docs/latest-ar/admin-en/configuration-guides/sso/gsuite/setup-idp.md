# الخطوة 2: إنشاء وتهيئة تطبيق في G Suite

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
    القيم التالية تُستخدم كقيم توضيحية في هذا الدليل:

    * `WallarmApp` كقيمة لمعلم **اسم التطبيق** (في G Suite).
    * `https://sso.online.wallarm.com/acs` كقيمة لمعلم **عنوان URL لـ ACS** (في G Suite).
    * `https://sso.online.wallarm.com/entity-id` كقيمة لمعلم **معرف الكيان** (في G Suite).

!!! warning
    تأكد من استبدال القيم النموذجية لمعلمي **عنوان URL لـ ACS** و**معرف الكيان** بالقيم الحقيقية المحصل عليها في [الخطوة السابقة][doc-setup-sp].

قم بتسجيل الدخول إلى [وحدة التحكم الإدارية في Google][link-gsuite-adm-console]. انقر على كتلة *التطبيقات*.

![وحدة التحكم الإدارية في G Suite][img-gsuite-console]

انقر على كتلة *تطبيقات SAML*. أضف تطبيقًا جديدًا بالنقر على رابط *إضافة خدمة/تطبيق إلى نطاقك* أو زر “+” في الزاوية السفلية اليمنى.

انقر على زر *إعداد تطبيق مخصص الخاص بي*.

![إضافة تطبيق جديد إلى G Suite][img-gsuite-add-app]

ستتم مشاركة معلومات (بيانات التعريف) بواسطة G Suite باعتباره مزود الهوية لك:
*   **عنوان URL لـ SSO**
*   **معرف الكيان**
*   **الشهادة** (X.509)

البيانات التعريفية هي مجموعة المعلمات التي تصف خصائص مزود الهوية (مشابهة لتلك التي تم توليدها لمزود الخدمة في [الخطوة 1][doc-setup-sp]) والتي تُطلب لتهيئة SSO.

يمكنك نقلها إلى معالج إعداد SSO في Wallarm بطريقتين:
*   نسخ كل معلم وتنزيل الشهادة، ثم لصق (تحميل) ذلك في المجالات المقابلة لمعالج Wallarm.
*   تنزيل ملف XML بالبيانات التعريفية وتحميله على جانب Wallarm.

احفظ البيانات التعريفية بأي طريقة تفضلها وانتقل إلى الخطوة التالية لتهيئة التطبيق بالنقر على *التالي*. ستُوصف إدخال بيانات التعريف لمزود الهوية على جانب Wallarm في [الخطوة 3][doc-metadata-transfer].

![حفظ البيانات التعريفية][img-fetch-metadata]

المرحلة التالية من تهيئة التطبيق هي تقديم بيانات التعريف لمزود الخدمة (Wallarm). الحقول المطلوبة:
*   **عنوان URL لـ ACS** يقابل معلم **عنوان URL لخدمة استهلاك الادعاء** المُولد على جانب Wallarm.
*   **معرف الكيان** يقابل معلم **معرف الكيان في Wallarm** المُولد على جانب Wallarm.

املأ الحقول المتبقية إذا كان ذلك مطلوبًا. انقر على *التالي*.

![إدخال معلومات مزود الخدمة][img-fill-in-sp-data]

في المرحلة النهائية من تهيئة التطبيق، سيُطلب منك توفير توزيع الخصائص بين خصائص مزود الخدمة وحقول الملف الشخصي للمستخدم المتاحة. يتطلب Wallarm (باعتباره مزود الخدمة) إنشاء توزيع للخصائص.

انقر على *إضافة توزيع جديد* ومن ثم قم بتوزيع خاصية `email` على حقل "البريد الإلكتروني الأساسي" (في مجموعة "المعلومات الأساسية").

![إنشاء توزيع للخصائص][img-create-attr-mapping]

انقر على *إنهاء*.

بعد ذلك، سيُبلغك نافذة منبثقة بتم حفظ المعلومات المقدمة ولإكمال تهيئة SAML SSO، ستحتاج لرفع بيانات عن مزود الهوية (Google) في لوحة التحكم الإدارية لمزود الخدمة (Wallarm). انقر على *موافق*.

بعد ذلك، ستتم إعادة توجيهك إلى صفحة التطبيق الذي تم إنشاؤه.
بمجرد إنشاء التطبيق، يتم تعطيله لجميع منظماتك في G Suite. لتفعيل SSO لهذا التطبيق، انقر على زر *تعديل الخدمة*.

![صفحة التطبيق في G Suite][img-app-page]

اختر *تشغيل للجميع* لمعلم **حالة الخدمة** وانقر على *حفظ*.


الآن يمكنك [متابعة تهيئة SSO][doc-metadata-transfer] على جانب Wallarm.