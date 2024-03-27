# تنصيب Wallarm OOB من صورة GCP Machine

المقال دا بيوفر إرشادات عشان تنصب [Wallarm OOB](overview.md) على منصة Google Cloud باستخدام [الصورة الرسمية](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). الحل الموصوف هنا مصمم عشان يحلل الtraffic المعكوس بواسطة ويب أو بروكسي سيرفر.

## استخدامات

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. ربط الفلترة Node ب Wallarm Cloud

Node الخاص بالانستنس بيتوصل بنظام ال Cloud عن طريق السكريبت [cloud-init.py][cloud-init-spec]. السكريبت دا بيسجل ال Node في Wallarm Cloud باستخدام توكن متوفر، وبيضبطها على ال [mode][wallarm-mode] الخاص بالمراقبة على مستوى العالم، وبيضبط الأوامر [`wallarm_force`][wallarm_force_directive] في بلوك `location /` الخاص ب NGINX لتحليل نسخ الtraffic المعكوسة فقط. إعادة تشغيل NGINX بتكمل الإعداد.

شغل سكريبت `cloud-init.py` على الانستنس اللى تم إنشاؤه من صورة الcloud بالتالي:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` بيضبط اسم مجموعة الnode (الموجودة، أو، لو مش موجودة، هتتعمل). الخاصية دى بتُطبق بس لو بتستخدم توكن ال API.
* `<TOKEN>` هو القيمة المنسوخة من التوكن.

## 6. ضبط الويب أو بروكسي سيرفر عشان يعكس الtraffic على ال Wallarm node

1. ضبط الويب أو بروكسي سيرفر (زي NGINX, Envoy) عشان يعكس الtraffic الوارد على ال Wallarm node. عشان تفاصيل الضبط، ننصحك تشوف دوكيومنتات الويب أو بروكسي سيرفر الخاص بيك.

    جوه [الرابط][web-server-mirroring-examples], هتلاقي مثال الضبط لأشهر الويب وبروكسي سيرفرات (NGINX, Traefik, Envoy).
1. اضبط الأتي في ملف `/etc/nginx/sites-enabled/default` على الانستنس اللي فيه الnode:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # غير 222.222.222.22 عنوان السيرفر المعكّس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    الأوامر `set_real_ip_from` و `real_ip_header` مطلوبين عشان Wallarm Console [يعرض عناوين ال IP للمهاجمين][real-ip-docs].

## 7. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. تعديل إعدادات الحل المنصوب

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"