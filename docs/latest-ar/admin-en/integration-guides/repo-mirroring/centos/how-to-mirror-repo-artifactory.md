[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-creating-a-local-copy-of-the-wallarm-repository
[anchor-setup-repo-artifactory]:        #2-creating-a-local-rpm-repository-in-jfrog-artifactory
[anchor-import-repo]:                   #3-importing-the-local-copy-of-the-wallarm-repository-into-jfrog-artifactory


#   كيفية عكس مخزن Wallarm لـ CentOS

يمكنك إنشاء واستخدام نسخة محلية (تُعرف أيضًا بـ *المرآة*) من مخزن Wallarm للتأكد من أن جميع عقد الفلتر في بنيتك التحتية يتم نشرها من مصدر واحد ولها نفس رقم الإصدار.

سيوجهك هذا المستند خلال عملية عكس مخزن Wallarm لخادم CentOS 7 عبر مدير مخزن JFrog Artifactory.


!!! info "المتطلبات الأساسية"
    تأكد من تحقق الشروط التالية قبل اتخاذ أي خطوات إضافية:
    
    *   لديك هذه المكونات مثبتة على خادمك:
    
        *   نظام التشغيل CentOS 7
        *   حزم `yum-utils` و `epel-release`
        *   برنامج JFrog Artifactory القادر على إنشاء مخازن RPM ([تعليمات التثبيت][link-jfrog-installation])
            
            تعرف على المزيد حول إصدارات وميزات JFrog Artifactory [هنا][link-jfrog-comparison-matrix].
        
    *   JFrog Artifactory يعمل وجاهز.
    *   الخادم يملك وصول للإنترنت.


يشمل عكس مخزن Wallarm
1.  [إنشاء نسخة محلية من مخزن Wallarm][anchor-fetch-repo]
2.  [إنشاء مخزن RPM محلي في JFrog Artifactory][anchor-setup-repo-artifactory]
3.  [استيراد النسخة المحلية من مخزن Wallarm إلى JFrog Artifactory][anchor-import-repo]

##  1.  إنشاء نسخة محلية من مخزن Wallarm

لإنشاء نسخة محلية من مخزن Wallarm، اتبع الخطوات التالية:
1.  أضف مخزن Wallarm بتنفيذ الأمر التالي:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  انتقل إلى دليل مؤقت (مثل، `/tmp`) وقم بمزامنة مخزن Wallarm إلى هذا الدليل بتنفيذ الأمر التالي:

    ```bash
    reposync -r wallarm-node -p .
    ```

إذا انتهى أمر `reposync` بنجاح، فإن حزم Wallarm ستُوضع في الدليل الفرعي `wallarm-node/Packages` من دليلك المؤقت (مثال، `/tmp/wallarm-node/Packages`). 


##  2.  إنشاء مخزن RPM محلي في JFrog Artifactory

لإنشاء مخزن RPM محلي في JFrog Artifactory، اتبع الخطوات التالية:
1.  انتقل إلى واجهة ويب JFrog Artifactory عبر اسم النطاق أو عنوان IP (مثال، `http://jfrog.example.local:8081/artifactory`).

    قم بتسجيل الدخول إلى واجهة الويب بحساب المدير.

2.  انقر على قائمة *Admin*، ثم الرابط *Local* في قسم *Repositories*.

3.  انقر على زر *New* لإنشاء مخزن محلي جديد.

    ![إنشاء مخزن محلي جديد][img-new-local-repo]

4.  اختر نوع حزمة “RPM”.

5.  املأ اسم المخزن في حقل *Repository Key*. يجب أن يكون هذا الاسم فريدًا في JFrog Artifactory. نوصي باختيار اسم يتوافق مع [أفضل الممارسات لتسمية مخازن Artifactory][link-artifactory-naming-agreement] (مثال، `wallarm-centos-upload-local`).

    اختر تخطيط “maven-2-default” من قائمة *Repository Layout* المنسدلة.
    
    يمكنك ترك الإعدادات الأخرى دون تغيير.

    انقر على زر *Save & Finish* لإنشاء مخزن Artifactory المحلي.
    
    ![إعدادات المخزن][img-artifactory-repo-settings]

    الآن، يجب أن يتم عرض المخزن الجديد في قائمة المخازن المحلية.

لإنهاء عكس مخزن Wallarm، [قم باستيراد الحزم المزامنة][anchor-fetch-repo] إلى مخزن Artifactory المحلي.


##  3.  استيراد النسخة المحلية من مخزن Wallarm إلى JFrog Artifactory

لاستيراد حزم Wallarm إلى مخزن Artifactory المحلي RPM، اتبع الخطوات التالية:
1.  قم بتسجيل الدخول إلى واجهة ويب JFrog Artifactory بحساب المدير.

2.  انقر على قائمة *Admin*، ثم رابط *Repositories* في قسم *Import & Export*.

3.  في قسم *Import Repository from Path*، اختر المخزن المحلي الذي [أنشأته سابقًا][anchor-setup-repo-artifactory] من قائمة *Repository from Path* المنسدلة.

4.  انقر على زر *Browse* واختر الدليل الذي يحتوي على حزم Wallarm التي [أنشأتها سابقًا][anchor-fetch-repo].

5.  انقر على زر *Import* لاستيراد حزم Wallarm من الدليل.

    ![استيراد الحزم][img-import-into-artifactory]
    
6.  انقر على قائمة *Artifacts*، وتأكد من وجود حزم Wallarm المستوردة في المخزن المحلي المطلوب.

    ![الحزم في المخزن][img-local-repo-ok]
    


الآن يمكنك [نشر عقد فلتر Wallarm][doc-installation-from-artifactory] باستخدام المرآة المحلية لمخزن Wallarm.