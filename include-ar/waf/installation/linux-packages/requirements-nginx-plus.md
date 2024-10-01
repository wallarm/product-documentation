* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في واجهة Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو ضبطه حسب [التعليمات][configure-selinux-instr]
* إصدار NGINX Plus 29 أو 30 (R29 أو R30)

    !!! info "إصدارات NGINX Plus المخصصة"
        إذا كان لديك إصدار مختلف، يُرجى الرجوع إلى التعليمات حول [كيفية ربط وحدة Wallarm بإصدارات مخصصة من NGINX][nginx-custom]
* تنفيذ جميع الأوامر كمستخدم فائق الصلاحيات (مثل `root`)
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من عدم حظر الوصول بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم وكيل فقط، فيُرجى استخدام [التعليمات][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```
* تثبيت محرر نصوص **vim**، **nano**، أو أي آخر. في التعليمات، يُستخدم **vim**