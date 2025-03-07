* الوصول إلى الحساب بدور **المدير** والمصادقة الثنائية معطلة في وحدة التحكم Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تم تعطيل SELinux أو تهيئته بناءً على [التعليمات][configure-selinux-instr]
* إصدار NGINX 1.24.0

    !!! info "إصدارات NGINX المخصصة"
        إذا كنت تمتلك إصدارًا مختلفًا، ارجع إلى التعليمات حول [كيفية ربط وحدة Wallarm بإصدار NGINX المخصص][nginx-custom]
* تنفيذ جميع الأوامر كمستخدم فائق الصلاحيات (مثل `root`)
* لمعالجة الطلبات والتحليلات اللاحقة على خوادم مختلفة: تم تثبيت التحليلات اللاحقة على خادم منفصل بناءً على [التعليمات][install-postanalytics-instr]
* الوصول إلى `https://repo.wallarm.com` لتنزيل الحزم. تأكد من أن الوصول ليس محظورًا بواسطة جدار حماية
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم وكيل فقط، فاستخدم [التعليمات][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* تثبيت محرر النصوص **vim**، **nano**، أو أيٍ آخر. في التعليمات، يُستخدم **vim**