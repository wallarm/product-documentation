[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/
[link-using-extension]:     ../using-extension.md

# أمثلة على امتدادات FAST: نظرة عامة

سيتم استخدام تطبيق الويب الضعيف [OWASP Juice Shop][link-juice-shop] لتوضيح قدرات آلية امتداد FAST.

يمكن [نشر][link-juice-shop-deploy] هذا التطبيق بعدة طرق (على سبيل المثال، باستخدام Docker، Node.JS، أو Vagrant).

لرؤية وثائق OWASP Juice Shop التي تسرد الثغرات المضمنة فيه، توجه إلى الرابط التالي [هنا][link-juice-shop-docs].

!!! تحذير "التعامل مع تطبيق ضعيف"
    نقترح تجنب توفير وصول إنترنت أو بيانات حقيقية (على سبيل المثال، أزواج اسم المستخدم/كلمة المرور) للمضيف الذي يعمل عليه OWASP Juice Shop.

لفحص تطبيق "OWASP Juice Shop" المستهدف بحثاً عن الثغرات، اتبع الخطوات التالية:

1. [فحص تطبيق الويب][link-app-examination] للتعرف على سلوكه.
2. [إعداد مثال لامتداد معدل.][link-mod-extension]
3. [إعداد مثال لامتداد غير معدل.][link-non-mod-extension]
4. [استخدام الامتدادات المُعدة.][link-using-extension]

!!! معلومات "نحو وصف عناصر الطلب"
    عند إنشاء امتداد FAST، تحتاج إلى فهم بنية الطلب HTTP المرسل إلى التطبيق وبنية الاستجابة HTTP المستلمة من التطبيق لتصف بشكل صحيح عناصر الطلب التي تحتاج إلى العمل معها باستخدام النقاط.
    
    لرؤية معلومات مفصلة، توجه إلى هذا [الرابط][link-points].