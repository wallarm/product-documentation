1. تشغيل السكريبت المُحمل:

    === "رمز API"
        ```bash
        # إذا كنت تستخدم نسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh
        ```        

        المتغير `WALLARM_LABELS` يُستخدم لتحديد المجموعة التي سيتم إضافة العقدة إليها (يُستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم نسخة x86_64:
        sudo sh wallarm-4.6.16.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo sh wallarm-4.6.16.aarch64-glibc.sh
        ```

1. اختر [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/).
1. أدخل رمز Wallarm.