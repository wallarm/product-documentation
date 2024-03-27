1. شغّل السكربت اللى انت حملته:

    === "توكن API"
        ```bash
        # لو بتستخدم نسخة x86_64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.x86_64-glibc.sh

        # لو بتستخدم نسخة ARM64:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.1.aarch64-glibc.sh
        ```        

        متغير `WALLARM_LABELS` بيحدد المجموعة اللى هيتم إضافة العقدة ليها (يُستخدم للتجميع المنطقي للعقد في واجهة المستخدم لوحة تحكم Wallarm).

    === "توكن العقدة"
        ```bash
        # لو بتستخدم نسخة x86_64:
        sudo sh wallarm-4.10.1.x86_64-glibc.sh

        # لو بتستخدم نسخة ARM64:
        sudo sh wallarm-4.10.1.aarch64-glibc.sh
        ```

1. اختار [سحابة الولايات المتحدة](https://us1.my.wallarm.com/) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/).
1. أدخل توكن Wallarm.