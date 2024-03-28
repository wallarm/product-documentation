[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


# كيفية تثبيت حزم Wallarm من مستودع JFrog Artifactory المحلي لنظام CentOS

لتثبيت حزم Wallarm من [مستودع JFrog Artifactory][doc-repo-mirroring] على مضيف مخصص لعقدة فلتر، نفذ الإجراءات التالية على هذا المضيف:
1. انتقل إلى واجهة مستخدم الويب JFrog Artifactory إما عن طريق اسم النطاق أو عنوان IP (مثل `http://jfrog.example.local:8081/artifactory`).

    سجّل الدخول إلى واجهة المستخدم بحساب المستخدم.
    
2. انقر على إدخال قائمة *المواد الأثرية* واختر مستودعًا يحتوي على حزم Wallarm.

3. انقر على رابط *ضبطني*.

    ![التعامل مع المستودع][img-working-with-repo]
    
    ستظهر نافذة منبثقة. اكتب كلمة مرور حساب المستخدم في حقل *اكتب كلمة المرور* واضغط *أدخل*. الآن، ستحتوي التعليمات في هذه النافذة على بيانات الاعتماد الخاصة بك.
    
    ![إدخال بيانات الاعتماد][img-repo-creds]

4. قم بالتمرير لأسفل إلى مثال تكوين `yum` وانقر على زر `نسخ الشظية إلى الحافظة` لنسخ هذا المثال إلى الحافظة.

    ![مثال على التكوين][img-repo-code-snippet]
    
5. أنشئ ملف تكوين `yum` (مثل، `/etc/yum.repos.d/artifactory.repo`) والصق الشظية المنسوخة فيه.

    !!! تحذير "مهم!"
        تأكد من إزالة الجزء `<PATH_TO_REPODATA_FOLDER>` من معلمة `baseurl` حتى يشير `baseurl` إلى جذر المستودع.
    
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
    
6. ثبت حزمة `epel-release` على المضيف:
    
    ```
    sudo yum install -y epel-release
    ```

الآن يمكنك اتباع أي تعليمات لتثبيت على CentOS. ستحتاج إلى تخطي الخطوة التي يتم فيها إضافة المستودع لأنك قمت بإعداد مستودع محلي بدلاً من ذلك.