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


#   كيفية إنشاء نسخة محلية من مستودع Wallarm لCentOS

يمكنك إنشاء واستخدام نسخة محلية (والمعروفة أيضًا ب*المرآة*) من مستودع Wallarm للتأكد من أن كافة عقد الفلترة في بنيتك التحتية يتم نشرها من مصدر واحد ولديها نفس رقم الإصدار.

سيقودك هذا المستند خلال عملية إنشاء مرآة لمستودع Wallarm لخادم CentOS 7 عبر مدير مستودعات JFrog Artifactory.



!!! info "متطلبات مسبقة"
    تأكد من استيفاء الشروط التالية قبل اتخاذ أي خطوات أخرى:
    
    *   لديك هذه المكونات مثبتة على خادمك:
    
        *   نظام التشغيل CentOS 7
        *   حزم `yum-utils` و`epel-release`
        *   برنامج JFrog Artifactory القادر على إنشاء مستودعات RPM ([تعليمات التثبيت][link-jfrog-installation])
            
            اقرأ المزيد حول إصدارات وميزات JFrog Artifactory [هنا][link-jfrog-comparison-matrix].
        
    *   JFrog Artifactory يعمل ويتصل.
    *   الخادم لديه وصول إلى الإنترنت.


يتألف إنشاء مرآة لمستودع Wallarm من
1.  [إنشاء نسخة محلية من مستودع Wallarm][anchor-fetch-repo]
2.  [إنشاء مستودع RPM محلي في JFrog Artifactory][anchor-setup-repo-artifactory]
3.  [استيراد النسخة المحلية من مستودع Wallarm إلى JFrog Artifactory][anchor-import-repo]

##  1.  إنشاء نسخة محلية من مستودع Wallarm

لإنشاء نسخة محلية من مستودع Wallarm، قم بما يلي:
1.  أضف مستودع Wallarm بتنفيذ الأمر التالي:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  انتقل إلى دليل مؤقت (مثلاً، `/tmp`) وقم بمزامنة مستودع Wallarm مع هذا الدليل بتنفيذ الأمر التالي:

    ```bash
    reposync -r wallarm-node -p .
    ```

إذا انتهت الأمر `reposync` بنجاح، فسيتم وضع حزم Wallarm في الدليل الفرعي `wallarm-node/Packages` لدليلك المؤقت (مثلاً، `/tmp/wallarm-node/Packages`). 


##  2.  إنشاء مستودع RPM محلي في JFrog Artifactory

لإنشاء مستودع RPM محلي في JFrog Artifactory، قم بما يلي:
1.  انتقل إلى واجهة ويب JFrog Artifactory عبر اسم النطاق أو عنوان IP الخاص (مثلاً، `http://jfrog.example.local:8081/artifactory`).

    سجل الدخول إلى واجهة الويب بحساب المدير.

2.  انقر على إدخال القائمة *الإدارة*، ثم الرابط *المحلي* في قسم *المستودعات*.

3.  انقر على زر *جديد* لإنشاء مستودع محلي جديد.

    ![إنشاء مستودع محلي جديد][img-new-local-repo]

4.  حدد نوع الحزمة "RPM".

5.  املأ اسم المستودع في حقل *مفتاح المستودع*. يجب أن يكون هذا الاسم فريدًا في JFrog Artifactory. نوصي باختيار اسم يتوافق مع [أفضل الممارسات لتسمية مستودعات Artifactory][link-artifactory-naming-agreement] (مثلاً، `wallarm-centos-upload-local`).

    حدد تخطيط "maven-2-default" من قائمة *تخطيط المستودع* المنسدلة.
    
    يمكنك ترك الإعدادات الأخرى دون تغيير.

    انقر على الزر *حفظ وإنهاء* لإنشاء المستودع المحلي Artifactory.
    
    ![إعدادات المستودع][img-artifactory-repo-settings]

    الآن، يجب أن يتم عرض المستودع الجديد في قائمة المستودعات المحلية.

لإنهاء إنشاء مرآة مستودع Wallarm، [استورد الحزم المتزامنة][anchor-fetch-repo] إلى المستودع المحلي Artifactory.


##  3.  استيراد النسخة المحلية من مستودع Wallarm إلى JFrog Artifactory

لاستيراد حزم Wallarm إلى المستودع المحلي RPM في Artifactory، قم بما يلي:
1.  سجل الدخول إلى واجهة ويب JFrog Artifactory بحساب المدير.

2.  انقر على إدخال القائمة *الإدارة*، ثم الرابط *المستودعات* في قسم *الاستيراد والتصدير*.

3.  في قسم *استيراد المستودع من المسار*، حدد المستودع المحلي الذي [أنشأته سابقًا][anchor-setup-repo-artifactory] من قائمة *مستودع من مسار* المنسدلة.

4.  انقر على زر *استعراض* وحدد الدليل الذي يحتوي على حزم Wallarm والتي [أنشأتها سابقًا][anchor-fetch-repo].

5.  انقر على زر *استيراد* لاستيراد حزم Wallarm من الدليل.

    ![استيراد الحزم][img-import-into-artifactory]
    
6.  انقر على إدخال القائمة *القطع*، وتأكد من تواجد الحزم Wallarm المستوردة في المستودع المحلي المطلوب.

    ![الحزم في المستودع][img-local-repo-ok]
    


الآن يمكنك [نشر عقد فلترة Wallarm][doc-installation-from-artifactory] باستخدام النسخة المحلية من مستودع Wallarm.