# توافق عقدة تصفية Wallarm مع إصدارات NGINX

لو كانت نسخة NGINX المُثبتة في بيئتك مختلفة عن النسخة الثابتة، Plus أو النسخة المُثبتة من مستودع Debian/CentOS، تعلم كيفية تثبيت Wallarm من هذا المستند.

## هل عقدة تصفية Wallarm متوافقة مع NGINX mainline؟

لا، عقدة تصفية Wallarm غير متوافقة مع NGINX `mainline`. يمكنك تثبيت عقدة Wallarm بالطرق التالية:

* الاتصال بـ NGINX `stable` المصدر الرسمي المفتوح وفقا لهذه [التعليمات](../installation/nginx/dynamic-module.md)
* الاتصال بـ NGINX المثبت من مستودعات Debian/CentOS وفقا لهذه [التعليمات](../installation/nginx/dynamic-module-from-distr.md)
* الاتصال بـ NGINX Plus التجاري الرسمي وفقا لهذه [التعليمات](../installation/nginx-plus.md)

## هل عقدة تصفية Wallarm متوافقة مع نسخة NGINX المخصصة؟

نعم، يمكن توصيل وحدة Wallarm بنسخة NGINX المخصصة بعد إعادة بناء حزم Wallarm. لإعادة بناء الحزم، يرجى الاتصال بـ [فريق الدعم الفني لـ Wallarm](mailto:support@wallarm.com) وإرسال البيانات التالية:

* إصدار النواة Linux: `uname -a`
* توزيع Linux: `cat /etc/*release`
* إصدار NGINX:

    * [NGINX البناء الرسمي](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX البناء المخصص: `<path to nginx>/nginx -V`

* توقيع التوافق:
  
      * [NGINX البناء الرسمي](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX البناء المخصص: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* المستخدم (ومجموعة المستخدم) الذي يُشغل عمليات عامل NGINX: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`