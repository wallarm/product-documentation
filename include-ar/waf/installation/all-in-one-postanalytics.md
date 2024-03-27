لتثبيت postanalytics بشكل منفصل باستخدام المثبت الموحد، استخدم:

=== "الرمز الخاص ب API"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh postanalytics
    ```        

    متغير `WALLARM_LABELS` يُحدد المجموعة التي سيتم إضافة العقدة إليها (يُستخدم لتجميع العقد بطريقة منطقية في واجهة المستخدم الخاصة بـ Wallarm Console).

=== "الرمز الخاص ب Node"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo sh wallarm-4.10.1.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo sh wallarm-4.10.1.aarch64-glibc.sh postanalytics
    ```