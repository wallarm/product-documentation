* وجود حساب بدور **المدير** في وحدة تحكم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/).
* الأنظمة التشغيلية المدعومة:

    * ديبيان 10، 11 و12.x
    * أوبونتو LTS 18.04، 20.04، 22.04
    * CentOS 7، 8 Stream، 9 Stream
    * ألما/روكي لينكس 9
    * RHEL 8.x
    * أوراكل لينكس 8.x
    * ريدوس
    * سوزي لينكس
    * أخرى (القائمة في توسع مستمر، تواصل مع [فريق دعم Wallarm](mailto:support@wallarm.com) للتحقق إذا كان نظامك التشغيلي مدرجًا في القائمة)

* الوصول إلى `https://meganode.wallarm.com` لتحميل مثبت Wallarm الشامل. تأكد من عدم حجب الوصول بواسطة جدار الحماية.
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية. إذا كان يمكن تكوين الوصول عبر خادم وكيل فقط، استخدم [التعليمات][configure-proxy-balancer-instr].
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
* تنفيذ جميع الأوامر كمستخدم ذو صلاحيات عليا (مثل `root`).