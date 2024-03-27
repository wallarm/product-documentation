# حزم NGINX المخصصة

إذا كنتم تحتاجون إلى حزم Wallarm DEB/RPM لنسخة من NGINX مختلفة عن النسخة الثابتة، NGINX Plus، أو النسخة المُوزعة، يمكنكم طلب بناء Wallarm مخصص من خلال اتباع هذه التعليمات.

بشكل افتراضي، حزم Wallarm DEB/RPM متاحة للنسخ التالية من NGINX:

* NGINX المفتوح المصدر الرسمي `stable` - الرجاء الرجوع إلى [تعليمات التثبيت](../nginx/dynamic-module.md)
* NGINX المقدم من التوزيع - الرجاء الرجوع إلى [تعليمات التثبيت](../nginx/dynamic-module-from-distr.md)
* NGINX Plus التجاري الرسمي - الرجاء الرجوع إلى [تعليمات التثبيت](../nginx-plus.md)

يمكن دمج وحدة Wallarm مع نسخة مخصصة من NGINX، بما في ذلك NGINX `mainline`، من خلال إعادة بناء حزم Wallarm. لإعادة البناء، يرجى التواصل مع فريق [دعم فني Wallarm](mailto:support@wallarm.com) وتوفير المعلومات التالية:

* نسخة نواة لينكس: `uname -a`
* توزيع لينكس: `cat /etc/*release`
* نسخة NGINX:

    * [البناء الرسمي لـNGINX](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * البناء المخصص لـNGINX: `<path to nginx>/nginx -V`

* توقيع التوافق:
  
      * [البناء الرسمي لـNGINX](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * البناء المخصص لـNGINX: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* المستخدم (ومجموعة المستخدم) الذي يشغل عمليات عامل NGINX: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`