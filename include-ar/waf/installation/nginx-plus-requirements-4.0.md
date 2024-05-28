* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في لوحة تحكم Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو تكوينه وفقًا لـ[التعليمات][configure-selinux-instr]
* إصدار NGINX Plus 28 (R28)

    !!! info "إصدارات NGINX Plus المخصصة"
        إذا كان لديك إصدار مختلف، ارجع إلى التعليمات حول [كيفية ربط وحدة Wallarm ببنية NGINX المخصصة][nginx-custom]
* تنفيذ جميع الأوامر كمستخدم متميز (مثل `root`)
* لمعالجة الطلبات والتحليلات البعدية على خوادم مختلفة: تثبيت التحليلات البعدية على خادم منفصل وفقًا لـ[التعليمات][install-postanalytics-instr]
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من أن الوصول غير محجوب بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم وكيل فقط، استخدم[التعليمات][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* تثبيت محرر النصوص **vim** أو **nano** أو أي محرر آخر. في التعليمات، يتم استخدام **vim**