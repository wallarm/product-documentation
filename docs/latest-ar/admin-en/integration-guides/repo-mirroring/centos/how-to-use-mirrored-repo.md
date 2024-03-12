[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


#   كيفية تثبيت حزم Wallarm من مستودع JFrog Artifactory المحلي لـ CentOS

لتثبيت حزم Wallarm من [مستودع JFrog Artifactory][doc-repo-mirroring] على جهاز مخصص لعقدة فلترة، قم بتنفيذ الإجراءات التالية على هذا الجهاز:
1.  تصفح واجهة مستخدم الويب JFrog Artifactory عن طريق اسم النطاق أو عنوان IP (مثال، `http://jfrog.example.local:8081/artifactory`).

    سجل دخولك إلى واجهة الويب باستخدام حساب مستخدم.
    
2.  انقر على إدخال قائمة *القطع الأثرية* واختر مستودع يحتوي على حزم Wallarm.

3.  انقر على رابط *ضبطني*.

    ![التعامل مع المستودع][img-working-with-repo]
    
    ستظهر نافذة منبثقة. اكتب كلمة مرور حساب المستخدم في حقل *اكتب كلمة المرور* واضغط *Enter*. الآن، ستحتوي التعليمات في هذه النافذة على بيانات الاعتماد الخاصة بك.
    
    ![كتابة بيانات الاعتماد][img-repo-creds]

4.  انزل لأسفل إلى مثال تكوين `yum` وانقر على زر `Copy Snippet to Clipboard` لنسخ هذا المثال إلى الحافظة.

    ![مثال عن التكوين][img-repo-code-snippet]
    
5.  قم بإنشاء ملف تكوين `yum` (مثل، `/etc/yum.repos.d/artifactory.repo`) والصق الشذرة المنسوخة فيه.

    !!! تحذير "مهم!"
        تأكد من إزالة قطعة `<PATH_TO_REPODATA_FOLDER>` من معلمة `baseurl` حتى تشير `baseurl` إلى جذر المستودع.
    
    مثال على ملف `/etc/yum.repos.d/artifactory.repo` لمستودع العينة `wallarm-centos-upload-local`:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #اختياري - إذا كانت لديك مفاتيح توقيع GPG مثبتة، استخدم الأعلام أدناه للتحقق من توقيع بيانات المستودع:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  قم بتثبيت حزمة `epel-release` على الجهاز:
    
    ```
    sudo yum install -y epel-release
    ```

الآن يمكنك اتباع أي تعليمات تثبيت لـ CentOS. ستحتاج إلى تخطي الخطوة التي يتم فيها إضافة المستودع لأنك أعددت مستودعًا محليًا بدلاً من ذلك.