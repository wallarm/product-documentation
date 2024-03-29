لتنصيب postanalytics بشكل منفصل مع المثبت الشامل، استخدم:

=== "رمز API"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh postanalytics
    ```        

    تضبط متغيرة `WALLARM_LABELS` المجموعة التي سيتم إضافة العقدة إليها (تستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo sh wallarm-4.10.2.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo sh wallarm-4.10.2.aarch64-glibc.sh postanalytics
    ```