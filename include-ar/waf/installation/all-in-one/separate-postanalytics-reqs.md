* الوصول إلى الحساب بدور **المدير** والتحقق الثنائي مُعطل في واجهة Wallarm للمستخدمين لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* تنفيذ جميع الأوامر كمستخدم رئيسي (مثل `root`)
* الوصول إلى `https://meganode.wallarm.com` لتنزيل مُثبت Wallarm الموحد. تأكد من عدم حظر الوصول بواسطة جدار الحماية
* الوصول إلى `https://us1.api.wallarm.com` عند العمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` عند العمل مع سحابة Wallarm الأوروبية. إذا كان يُمكن تكوين الوصول عبر خادم الوكيل فقط، استخدم [التعليمات][configure-proxy-balancer-instr]
* تثبيت محرر نصوص **vim**، **nano**، أو أي محرر آخر. في الأوامر المذكورة في هذا المقال، يتم استخدام **vim**