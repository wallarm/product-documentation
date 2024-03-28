[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-fast-trial]:          https://fast.wallarm.com/signup/
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md

#   متطلبات التكامل

لتمكين تكامل FAST ضمن سير عمل CI/CD، ستحتاج إلى

* الوصول إلى بوابة Wallarm وحساب Wallarm.
    
    أنشئ [حساب][link-fast-trial] إذا لم يكن لديك واحد (هذا الحساب سيكون مرتبطًا بالسحابة الأمريكية)
    
* يجب أن يكون لحاوية Docker الخاصة بعقدة FAST الوصول إلى خادم واجهة برمجة تطبيقات Wallarm `us1.api.wallarm.com` عبر بروتوكول HTTPS (`TCP/443`)
--8<-- "../include/fast/cloud-note.md"

 * الأذونات لإنشاء وتشغيل حاويات Docker ضمن سير عمل CI/CD
    
* تطبيق ويب أو API لاختباره بحثًا عن نقاط الضعف (تطبيق *الهدف*)
    
    من الضروري أن يستخدم هذا التطبيق بروتوكول HTTP أو HTTPS في الاتصال.
    
    يجب أن يظل التطبيق الهدف متاحًا حتى ينتهي اختبار الأمان FAST.
    
* أداة اختبار ستختبر التطبيق الهدف باستخدام طلبات HTTP وHTTPS (مصدر *الطلب*)
    
    يجب أن يكون قادرًا على العمل مع خادم وكيل HTTP أو HTTPS.
    
    [Selenium][link-selenium] هو مثال على أداة اختبار تلبي المتطلبات المذكورة.
    
* رمز أو عدة [رموز][doc-about-token].
    <p id="anchor-token"></p>

    [أنشئ عقدة FAST][doc-create-node] في سحابة Wallarm واستخدم الرمز المقابل في حاوية Docker عند تنفيذ مهمة CI/CD.  
    
    سيتم استخدام الرمز بواسطة حاوية Docker مع عقدة FAST أثناء تنفيذ مهمة CI/CD.

    إذا كان لديك عدة مهام CI/CD تعمل بالتزامن، أنشئ عددًا مناسبًا من عقد FAST في سحابة Wallarm.

    !!! info "مثال على رمز"
        قيمة `token_Qwe12345` تُستخدم كمثال لرمز ضمن هذا الدليل.