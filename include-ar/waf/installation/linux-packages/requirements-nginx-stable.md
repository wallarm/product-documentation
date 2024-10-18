* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في لوحة تحكم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو تهيئته وفقًا لـ[التعليمات][configure-selinux-instr]
* نسخة NGINX 1.24.0

    !!! info "إصدارات NGINX المخصصة"
        إذا كانت لديك نسخة مختلفة، يرجى الرجوع إلى التعليمات حول [كيفية ربط وحدة Wallarm ببناء مخصص من NGINX][nginx-custom]
* تنفيذ جميع الأوامر كمستخدم فائق الصلاحيات (مثل `root`)
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من أن الوصول ليس محظورًا بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم البروكسي فقط، استخدم [التعليمات][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* تثبيت محرر النصوص **vim**، **nano**، أو أي آخر. في التعليمات، يُستخدم **vim**