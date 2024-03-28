تعتمد الأوامر المستخدمة لتسجيل النسخة مع سحابة Wallarm على نهج نشر Wallarm المختار ([داخل الخط][inline-docs] أو [خارج النطاق][oob-docs]).

=== "داخل الخط"
    يتصل عقدة نسخة السحاب بالسحابة عبر السكربت [cloud-init.py][cloud-init-spec]. يسجل هذا السكربت العقدة مع سحابة Wallarm باستخدام رمز مُقدم، ويضبطها عالميًا على وضع [المراقبة][wallarm-mode]، ويجهز العقدة لتوجيه حركة المرور الشرعية بناءً على علم `--proxy-pass`. يكمل إعادة تشغيل NGINX الإعداد.

    شغّل السكربت `cloud-init.py` على النسخة المُنشأة من صورة السحاب كما يلي:

    === "سحابة الولايات المتحدة"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` يضبط اسم مجموعة العقد (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يُطبق هذا فقط إذا كنت تستخدم رمز API.
    * `<TOKEN>` هو قيمة الرمز المنسوخة.
    * `<PROXY_ADDRESS>` هو عنوان لعقدة Wallarm لتوجيه حركة المرور الشرعية إليه. يمكن أن يكون عنوان IP لنسخة تطبيق، موازنة الحمل، أو اسم DNS، إلخ، بناءً على هندسة النظام لديك.
=== "خارج النطاق"
    يتصل عقدة نسخة السحاب بالسحابة عبر السكربت [cloud-init.py][cloud-init-spec]. يسجل هذا السكربت العقدة مع سحابة Wallarm باستخدام رمز مُقدم، ويضبطها عالميًا على وضع [المراقبة][wallarm-mode]، ويضبط توجيهات [`wallarm_force`][wallarm_force_directive] في كتلة `location /` بتكوين NGINX لتحليل نسخ حركة المرور المعكوسة فقط. يكمل إعادة تشغيل NGINX الإعداد.

    شغّل السكربت `cloud-init.py` على النسخة المُنشأة من صورة السحاب كما يلي:

    === "سحابة الولايات المتحدة"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` يضبط اسم مجموعة العقد (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يُطبق هذا فقط إذا كنت تستخدم رمز API.
    * `<TOKEN>` هو قيمة الرمز المنسوخة.