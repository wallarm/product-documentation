# التوافق بين عقدة تصفية Wallarm وإصدارات NGINX

إذا كانت النسخة المثبتة من NGINX في بيئتك مختلفة عن النسخة المستقرة، Plus أوالمثبتة من مستودعات Debian/CentOS، تعلم كيفية تثبيت Wallarm من هذا المستند.

## هل عقدة تصفية Wallarm متوافقة مع النسخة الرئيسية من NGINX؟

لا، عقدة تصفية Wallarm غير متوافقة مع النسخة `الرئيسية` من NGINX. يمكنك تثبيت عقدة Wallarm بالطرق التالية:

* الاتصال بالنسخة الرسمية المفتوحة المصدر NGINX `المستقرة` اتباعًا لهذه [التعليمات](../installation/nginx/dynamic-module.md)
* الاتصال بـ NGINX المثبت من مستودعات Debian/CentOS اتباعًا لهذه [التعليمات](../installation/nginx/dynamic-module-from-distr.md)
* الاتصال بـ NGINX Plus الرسمي التجاري اتباعًا لهذه [التعليمات](../installation/nginx-plus.md)

## هل عقدة تصفية Wallarm متوافقة مع البناء المخصص من NGINX؟

نعم، يمكن ربط وحدة Wallarm بالبناء المخصص من NGINX بعد إعادة بناء حزم Wallarm. لإعادة بناء الحزم، الرجاء الاتصال بفريق الدعم الفني لـ Wallarm عبر [support@wallarm.com](mailto:support@wallarm.com) وإرسال البيانات التالية:

* إصدار نواة Linux: `uname -a`
* توزيع Linux: `cat /etc/*release`
* إصدار NGINX:

    * [البناء الرسمي لـ NGINX](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * بناء NGINX المخصص: `<مسار إلى nginx>/nginx -V`

* توقيع التوافق:
  
      * [البناء الرسمي لـ NGINX](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * بناء NGINX المخصص: `egrep -ao '.,.,.,[01]{33}' <مسار إلى nginx>/nginx`

* المستخدم (ومجموعته) الذي يُشغل عمليات العامل في NGINX: `grep -w 'user' <مسار-إلى-ملفات-تكوين-NGINX/nginx.conf>`