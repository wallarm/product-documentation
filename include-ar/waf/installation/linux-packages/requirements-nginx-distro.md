* الوصول إلى الحساب بدور **المدير** والمصادقة الثنائية معطلة في واجهة Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو تكوينه وفقًا لـ[التعليمات](configure-selinux-instr)
* تنفيذ جميع الأوامر كمستخدم رئيسي (مثل `root`)
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد أن الوصول غير محجوب بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم الوكيل فقط، استخدم [التعليمات](configure-proxy-balancer-instr)
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* تثبيت محرر نصوص **vim**، **nano**، أو أي آخر. في التعليمات، يستخدم **vim**