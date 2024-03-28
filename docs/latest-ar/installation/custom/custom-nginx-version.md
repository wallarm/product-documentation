# حزم NGINX المخصصة

إذا كنت بحاجة إلى حزم Wallarm DEB/RPM لنسخة NGINX مختلفة عن النسخة الثابتة، أو NGINX Plus، أو نسخة التوزيع، يمكنك طلب بناء Wallarm مخصص باتباع هذه التعليمات.

بشكل افتراضي، تتوفر حزم Wallarm DEB/RPM للنسخ التالية من NGINX:

* NGINX المفتوح المصدر الرسمي `الثابت` - راجع [تعليمات التثبيت](../nginx/dynamic-module.md)
* NGINX المقدم من التوزيع - راجع [تعليمات التثبيت](../nginx/dynamic-module-from-distr.md)
* NGINX Plus الرسمي التجاري - راجع [تعليمات التثبيت](../nginx-plus.md)

يمكن دمج وحدة Wallarm مع بناء مخصص من NGINX، بما في ذلك NGINX `الرئيسي`، من خلال إعادة بناء حزم Wallarm. لإعادة بناء الحزم، يرجى الاتصال بفريق [الدعم الفني لـ Wallarm](mailto:support@wallarm.com) وتقديم المعلومات التالية:

* نسخة النواة لينكس: `uname -a`
* توزيع لينكس: `cat /etc/*release`
* نسخة NGINX:

    * [البناء الرسمي لـ NGINX](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * البناء المخصص لـ NGINX: `<مسار إلى nginx>/nginx -V`

* توقيع التوافق:
  
      * [البناء الرسمي لـ NGINX](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * البناء المخصص لـ NGINX: `egrep -ao '.,.,.,[01]{33}' <مسار إلى nginx>/nginx`

* المستخدم (ومجموعة المستخدم) الذي يدير عمليات عامل NGINX: `grep -w 'user' <مسار-إلى-ملفات-تكوين-NGINX/nginx.conf>`