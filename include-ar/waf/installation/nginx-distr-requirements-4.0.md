* الوصول إلى الحساب بدور **المدير** والمصادقة الثنائية معطلة في واجهة Wallarm لل[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تعطيل SELinux أو تكوينه وفقًا ل[التعليمات](configure-selinux-instr)
* تنفيذ جميع الأوامر كمستخدم متميز (مثل `root`)
* بالنسبة لمعالجة الطلبات والتحليلات اللاحقة على خوادم مختلفة: يتم تثبيت التحليلات اللاحقة على خادم منفصل وفقًا ل[التعليمات](install-postanalytics-instr)
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من أن الوصول ليس محظورًا بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم وكيل فقط، فاستخدم [التعليمات](configure-proxy-balancer-instr)
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* تثبيت محرر النصوص **vim**، **nano**، أو أي آخر. في التعليمات، يتم استخدام **vim**