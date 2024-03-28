# نشر Wallarm OOB من صورة أمازون

توفر هذه المقالة التعليمات لنشر [Wallarm OOB](overview.md) على AWS باستخدام [الصورة الرسمية لآلة أمازون (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD). الحل الموصوف هنا مصمم لتحليل حركة المرور المعكوسة بواسطة الويب أو خادم الوكيل.

## حالات الاستخدام

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

## 6. الاتصال بالنسخة السحابية من Wallarm

يتصل عقدة النسخة السحابية بالسحابة من Wallarm عبر السكربت [`cloud-init.py`][cloud-init-spec]. يقوم هذا السكريبت بتسجيل العقدة مع السحابة من Wallarm باستخدام الرمز المقدم، ويعمل على تحديدها عالميًا إلى وضع [المراقبة][wallarm-mode]، ويقوم بتعيين الأوامر [`wallarm_force`][wallarm_force_directive] في كتلة `location /` في NGINX لتحليل نسخ حركة المرور المعكوسة فقط. إعادة تشغيل NGINX تنهي الإعداد.

قم بتشغيل السكريبت `cloud-init.py` على النسخة المنشأة من الصورة السحابية كما يلي:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
    ```

* `WALLARM_LABELS='group=<GROUP>'` يحدد اسم مجموعة العقدة (موجودة، أو، إذا لم تكن موجودة، سيتم إنشاؤها). يتم تطبيقه فقط إذا كان يستخدم رمز API.
* `<TOKEN>` هو القيمة المنسوخة للرمز.

## 7. تكوين الويب أو خادم الوكيل لعكس حركة المرور إلى عقدة Wallarm

1. قم بتكوين خادم الويب أو الوكيل (مثلاً NGINX، Envoy) لعكس حركة المرور الواردة إلى عقدة Wallarm. للحصول على تفاصيل التكوين، نوصي بالرجوع إلى دليل خادم الويب أو الوكيل.
   
   داخل [الرابط][web-server-mirroring-examples]، ستجد التكوين المثالي لأشهر خوادم الويب والوكلاء (NGINX، Traefik، Envoy).
1. قم بتعيين التكوين التالي في ملف `/etc/nginx/sites-enabled/default` على النسخة بالعقدة:

    ```
    location / {
        include /etc/nginx/presets.d/mirror.conf;
        
        # قم بتغيير 222.222.222.22 إلى عنوان خادم العكس
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
    }
    ```

    أوامر `set_real_ip_from` و`real_ip_header` مطلوبة لعرض عناوين IP للمخترقين في [وحدة تحكم Wallarm][real-ip-docs].

## 8. اختبار تشغيل Wallarm

--8<-- "../include/waf/installation/cloud-platforms/test-operation-oob.md"

## 9. ضبط الحل المنشور

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"