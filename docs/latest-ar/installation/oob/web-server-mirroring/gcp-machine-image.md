# نشر Wallarm OOB من صورة آلة GCP

توفر هذه المقالة تعليمات لنشر [Wallarm OOB](overview.md) على منصة Google Cloud باستخدام [الصورة الرسمية للآلة](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node). تم تصميم الحل الموضح هنا لتحليل حركة المرور التي يتم توجيهها بشكل معكوس بواسطة خادم الويب أو الوكيل.

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. ربط عقدة التصفية بسحابة Wallarm

تتصل عقدة النسخة السحابية بالسحابة عن طريق النص البرمجي [cloud-init.py][cloud-init-spec]. يقوم هذا النص البرمجي بتسجيل العقدة في سحابة Wallarm باستخدام رمز مقدم، ويضبطها عالميًا على [وضع][wallarm-mode] المراقبة، ويضبط الأوامر [`wallarm_force`][wallarm_force_directive] في كتلة `location /` في NGINX لتحليل نسخ حركة المرور المعكوسة فقط. إعادة تشغيل NGINX ينهي الإعداد.

قم بتشغيل النص البرمجي `cloud-init.py` على النسخة المنشأة من صورة السحاب كما يلي:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` يضبط اسم مجموعة العقدة (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يتم تطبيقها فقط إذا كنت تستخدم رمز API.
* `<TOKEN>` هو قيمة الرمز المنسوخة.

## 6. تكوين خادم الويب أو الوكيل لديك لتوجيه حركة المرور إلى عقدة Wallarm

1. قم بتكوين خادم الويب أو الوكيل لديك (مثل NGINX، Envoy) لتوجيه حركة المرور الواردة إلى عقدة Wallarm. للحصول على تفاصيل التكوين، نوصي بالرجوع إلى وثائق خادم الويب أو الوكيل لديك.

    داخل [الرابط][web-server-mirroring-examples]، ستجد تكوين المثال لأشهر خوادم الويب والوكلاء (NGINX، Traefik، Envoy).
1. اضبط التكوين التالي في ملف `/etc/nginx/sites-enabled/default` على النسخة التي تحتوي على العقدة:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # قم بتغيير 222.222.222.22 إلى عنوان خادم التوجيه
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    أوامر `set_real_ip_from` و`real_ip_header` مطلوبة ليتم عرض عناوين IP للمهاجمين في [وحدة تحكم Wallarm][real-ip-docs].

## 7. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 8. تعديل الحل المنشور بدقة

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"