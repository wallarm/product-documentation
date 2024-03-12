* نسخة منصة Kubernetes من 1.24 إلى 1.27
* مدير الحزم [Helm](https://helm.sh/)
* توافق خدماتك مع [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) الإصدار 1.9.5
* الوصول للحساب بدور **المدير** وميزة المصادقة الثنائية معطلة في وحدة تحكم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة مخططات Helm من Wallarm. تأكد من أن الوصول ليس محجوبًا بواسطة جدار حماية
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من أن الوصول ليس محجوبًا بواسطة جدار حماية
* الوصول إلى عناوين IP لـ Google Cloud Storage المدرجة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عندما تقوم بـ[إدراج، استبعاد، أو تصنيف باللون الرمادي][ip-list-docs] لدول كاملة، مناطق، أو مراكز بيانات بدلاً من عناوين IP الفردية، يسترجع عقدة Wallarm عناوين IP المتعلقة بالمدخلات في قوائم الـ IP من قاعدة البيانات المجمعة المستضافة على Google Storage