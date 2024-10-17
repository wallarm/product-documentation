* الوصول إلى الحساب بدور **المدير** أو **النشر** والمصادقة الثنائية معطلة في واجهة Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو تكوينه وفقًا لـ[التعليمات][configure-selinux-instr]
* تنفيذ جميع الأوامر كمستخدم متميز (مثل `root`)
* لمعالجة الطلبات والتحليلات بعد الإرسال على خوادم مختلفة: تثبيت التحليلات بعد الإرسال على خادم منفصل وفقًا لـ[التعليمات][install-postanalytics-instr]
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من أن الوصول غير محظور بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com:444` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com:444` للعمل مع سحابة Wallarm الأوروبية. إذا كان بالإمكان تكوين الوصول عبر خادم وكيل فقط، فاستخدم [التعليمات][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* تثبيت محرر النصوص **vim**، **nano**، أو أي محرر آخر. في التعليمات، يُستخدم **vim**