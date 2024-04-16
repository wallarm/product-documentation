1. شغّل السكربت المُنزل:

    === "رمز API"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh

        # إذا كنت تستخدم النسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh
        ```        

        تقوم متغير `WALLARM_LABELS` بتعيين المجموعة التي سيُضاف إليها العقدة (يُستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo sh wallarm-4.8.10.x86_64-glibc.sh

        # إذا كنت تستخدم النسخة ARM64:
        sudo sh wallarm-4.8.10.aarch64-glibc.sh
        ```

1. اختر [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/).
1. أدخل رمز Wallarm.