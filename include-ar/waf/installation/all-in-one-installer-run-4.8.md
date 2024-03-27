1. شغل السكريبت الذي تم تحميله:

    === "رمز الواجهة البرمجية"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.9.aarch64-glibc.sh
        ```
        
        متغير `WALLARM_LABELS` يقوم بتعيين المجموعة التي سيتم إضافة العقدة إليها (يستخدم للتجميع المنطقي للعقد في واجهة المستخدم للوحة تحكم Wallarm).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo sh wallarm-4.8.9.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo sh wallarm-4.8.9.aarch64-glibc.sh
        ```

1. اختر [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/).
1. أدخل رمز Wallarm.