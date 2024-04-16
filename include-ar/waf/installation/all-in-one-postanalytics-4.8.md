لتثبيت postanalytics بشكل منفصل باستخدام المثبت الشامل، استخدم:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```        

    تقوم متغير `WALLARM_LABELS` بتعيين المجموعة التي سيتم إضافة العقدة إليها (يستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم النسخة x86_64:
    sudo sh wallarm-4.8.10.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم النسخة ARM64:
    sudo sh wallarm-4.8.10.aarch64-glibc.sh postanalytics
    ```