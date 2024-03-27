[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-fast-trial]:          https://fast.wallarm.com/signup/
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   الشروط الأساسية للإندماج

لتمكين دمج FAST ضمن سير عمل CI/CD، سوف تحتاج إلى

* الوصول إلى بوابة Wallarm وحساب Wallarm.
    
    قم بإنشاء [حساب][link-fast-trial] إذا لم يكن لديك واحد (هذا الحساب سيكون مرتبطًا بالسحابة الأمريكية)
    
* يجب أن يكون لدي Docker container الخاص بعقدة FAST الوصول إلى خادم Wallarm API `us1.api.wallarm.com` عبر بروتوكول HTTPS (`TCP/443`)
--8<-- "../include/fast/cloud-note.md"

 * الأذونات اللازمة لإنشاء وتشغيل حاويات Docker لسير عمل CI/CD
    
* تطبيق ويب أو واجهة برمجة التطبيقات لاختبار الثغرات الأمنية (تطبيق *هدف*)
    
    من الضروري أن يستخدم هذا التطبيق بروتوكول ال HTTP أو HTTPS للتواصل.
    
    يجب أن يظل التطبيق الهدف متاحًا حتى ينتهي اختبار الأمان FAST.
    
* أداة اختبار ستختبر التطبيق الهدف باستخدام طلبات HTTP و HTTPS (مصدر *طلب*)
    
    يجب أن يكون بإمكان مصدر الطلب العمل مع خادم بروكسي HTTP أو HTTPS.
    
    [Selenium][link-selenium] هو مثال على أداة اختبار تلبي المتطلبات المذكورة.
    
* واحد أو أكثر من [الرموز][doc-about-token].
    <p id="anchor-token"></p>

    [إنشاء عقدة FAST][doc-create-node] في سحابة Wallarm واستخدم الرمز المناسب في حاوية Docker عند تنفيذ مهمة CI/CD.  
    
    سيتم استخدام الرمز بواسطة حاوية Docker مع عقدة FAST أثناء تنفيذ مهمة CI/CD.

    إذا كان لديك عدة مهام CI/CD تعمل في نفس الوقت، قم بإنشاء عدد مناسب من عقد FAST في سحابة Wallarm.

    !!! info "مثال على رمز"
        يتم استخدام قيمة `token_Qwe12345` كمثال على رمز طوال هذا الدليل.  