1. قم بتشغيل السكربت المُحمّل:

    === "رمز الواجهة البرمجية"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.2.aarch64-glibc.sh
        ```        

        المتغير `WALLARM_LABELS` يُحدد المجموعة التي سيُضاف إليها العقدة (يُستخدم لتجميع العقد بشكل منطقي في واجهة مستخدم وحدة تحكم Wallarm).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم النسخة x86_64:
        sudo sh wallarm-4.10.2.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo sh wallarm-4.10.2.aarch64-glibc.sh
        ```

1. اختر [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/).
1. أدخل رمز Wallarm.