اعتمادًا على نهج نشر Wallarm المختار ([في خط الإنترنت][inline-docs] أو [خارج النطاق][oob-docs])، يتم استخدام أوامر مختلفة لتسجيل النسخة مع Cloud Wallarm.

=== "في الخط"
    يتصل عقدة نسخة السحابة بالسحابة عبر سكريبت [cloud-init.py][cloud-init-spec]. يقوم هذا السكريبت بتسجيل العقدة مع سحابة Wallarm باستخدام الرمز المُقدم، يضعها عالميًا على وضع المراقبة [mode][wallarm-mode]، ويُعد العقدة لتوجيه الحركة المشروعة بناءً على علامة `--proxy-pass`. إعادة تشغيل NGINX تُنهي الإعداد.

    قم بتشغيل سكريبت `cloud-init.py` على النسخة المُنشأة من صورة السحابة كالتالي:

    === "سحابة الولايات المتحدة"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` يُحدد اسم مجموعة العقدة (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يُطبق فقط إذا كنت تستخدم رمز API.
    * `<TOKEN>` هو قيمة الرمز المنسوخة.
    * `<PROXY_ADDRESS>` هو عنوان لعقدة Wallarm لتوجيه الحركة المشروعة إليه. يمكن أن يكون عنوان IP لنسخة التطبيق، موازنة الحمل، أو اسم DNS، إلخ، حسب هيكلية البنية التحتية الخاصة بك.
=== "خارج النطاق"
    يتصل عقدة نسخة السحابة بالسحابة عبر سكريبت [cloud-init.py][cloud-init-spec]. يقوم هذا السكريبت بتسجيل العقدة مع سحابة Wallarm باستخدام الرمز المقدم، يضعها عالميًا على وضع المراقبة [mode][wallarm-mode]، ويُضبط توجيهات [`wallarm_force`][wallarm_force_directive] في قسم `location /` بـ NGINX لتحليل نسخ الحركة المتماثلة فقط. إعادة تشغيل NGINX تُنهي الإعداد.

    قم بتشغيل سكريبت `cloud-init.py` على النسخة المُنشأة من صورة السحابة كالتالي:

    === "سحابة الولايات المتحدة"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "سحابة الاتحاد الأوروبي"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` يُحدد اسم مجموعة العقدة (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يُطبق فقط إذا كنت تستخدم رمز API.
    * `<TOKEN>` هو قيمة الرمز المنسوخة.