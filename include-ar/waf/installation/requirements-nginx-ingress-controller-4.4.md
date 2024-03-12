* نسخة منصة كوبرنتس 1.23-1.25
* مدير الحزم [Helm](https://helm.sh/)
* توافق الخدمات الخاصة بك مع [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) الإصدار 1.6.4 أو أقل
* الوصول إلى الحساب بدور **المدير** وتعطيل المصادقة الثنائية في لوحة تحكم وولارم لـ [US Cloud](https://us1.my.wallarm.com/) أو [EU Cloud](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع US Wallarm Cloud أو إلى `https://api.wallarm.com` للعمل مع EU Wallarm Cloud
* الوصول إلى `https://charts.wallarm.com` لإضافة رسوم بيانية Helm من وولارم. تأكد من أن الوصول غير محظور بواسطة جدار ناري
* الوصول إلى مستودعات وولارم على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من أن الوصول غير محظور بواسطة جدار ناري
* الوصول إلى عناوين IP لـ Google Cloud Storage المدرجة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عندما تقوم [بإدراج قائمة سماح، قائمة حظر، أو قائمة رمادية][ip-list-docs] لدول بأكملها، مناطق، أو مراكز بيانات بدلاً من عناوين IP فردية، يسترجع عقدة وولارم عناوين IP الدقيقة المتعلقة بالمدخلات في قوائم IP من قاعدة البيانات المجمعة المستضافة على Google Storage