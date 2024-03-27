لتثبيت postanalytics بشكل منفصل باستخدام المثبت الشامل، استخدم:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh postanalytics
    ```        

    المتغير `WALLARM_LABELS` يقوم بتحديد المجموعة التي سيتم إضافة العقدة إليها (يستخدم للتجميع المنطقي للعُقد في واجهة المستخدم لـ Wallarm Console).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.8.9.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.8.9.aarch64-glibc.sh postanalytics
    ```