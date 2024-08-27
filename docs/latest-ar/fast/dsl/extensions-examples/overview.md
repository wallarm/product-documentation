[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md

# أمثلة على امتدادات FAST: نظرة عامة

سيتم استخدام تطبيق الويب القابل للاختراق [OWASP Juice Shop][link-juice-shop] لإظهار قدرات آلية امتداد FAST.

يمكن [نشر][link-juice-shop-deploy] هذا التطبيق بطرق متعددة (على سبيل المثال، باستخدام Docker، Node.JS، أو Vagrant).

للاطلاع على مستندات OWASP Juice Shop التي تسرد الثغرات المدمجة فيه، توجه إلى الرابط التالي [هنا][link-juice-shop-docs].

!!! warning "التعامل مع تطبيق ويب قابل للاختراق"
    نقترح عليك تجنب توفير الوصول إلى الإنترنت أو بيانات حقيقية (مثل أزواج تسجيل الدخول/كلمة المرور) للمضيف الذي يعمل عليه OWASP Juice Shop.

لفحص تطبيق "OWASP Juice Shop" المستهدف بحثًا عن الثغرات، اتبع الخطوات التالية:

1.  [فحص تطبيق الويب][link-app-examination] للتعرف على سلوكه.
2.  [إعداد امتداد تعديل نموذجي.][link-mod-extension]
3.  [إعداد امتداد غير تعديل نموذجي.][link-non-mod-extension]
4.  [استخدام الامتدادات المُنشأة.][link-using-extension]

!!! info "تركيب نحو وصف عناصر الطلب"
    عند إنشاء امتداد FAST، تحتاج إلى فهم هيكل طلب HTTP المُرسل إلى التطبيق وهيكل الرد HTTP الذي تتلقاه من التطبيق من أجل وصف عناصر الطلب التي تحتاج إلى العمل معها باستخدام النقاط بشكل صحيح.
    
    للاطلاع على معلومات مفصلة، توجه إلى هذا [الرابط][link-points].