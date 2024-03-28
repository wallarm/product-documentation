1. تشغيل السكريبت المحمل:
   
    === "رمز API"
        ```bash
        # إذا كنت تستخدم نسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh
        ```
        
        يقوم متغير `WALLARM_LABELS` بتعيين المجموعة التي سيتم إضافة العقدة إليها (يُستخدم للتجميع المنطقي للعقد في واجهة مستخدم Wallarm Console).

    === "رمز العقدة"
        ```bash
        # إذا كنت تستخدم نسخة x86_64:
        sudo sh wallarm-4.6.16.x86_64-glibc.sh

        # إذا كنت تستخدم نسخة ARM64:
        sudo sh wallarm-4.6.16.aarch64-glibc.sh
        ```

1. اختر [سحابة الولايات المتحدة](https://us1.my.wallarm.com/) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/).
1. أدخل رمز Wallarm.