لتثبيت postanalytics بشكل منفصل باستخدام المثبت all-in-one، استخدم:

=== "رمز الواجهة البرمجية"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh postanalytics
    ```        

    تقوم متغير `WALLARM_LABELS` بتعيين المجموعة التي سيتم إضافة العقدة إليها (تُستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

=== "رمز العقدة"
    ```bash
    # إذا كنت تستخدم نسخة x86_64:
    sudo sh wallarm-4.6.16.x86_64-glibc.sh postanalytics

    # إذا كنت تستخدم نسخة ARM64:
    sudo sh wallarm-4.6.16.aarch64-glibc.sh postanalytics
    ```