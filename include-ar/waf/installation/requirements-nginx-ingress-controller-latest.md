* نسخة منصة Kubernetes 1.24-1.27
* مدير الحزم [Helm](https://helm.sh/)
* التوافقية مع [متحكم الدخول إنجنكس الجماعي](https://github.com/kubernetes/ingress-nginx) الإصدار 1.9.5
* الوصول إلى الحساب بدور **المدير** وميزة المصادقة الثنائية معطلة في واجهة Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة الرسوم البيانية لـ Wallarm Helm. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى عناوين IP لتخزين Google Cloud المدرجة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عندما تقوم [بتضمين أو استبعاد أو تصنيف بلدان أو مناطق أو مراكز بيانات بالقائمة البيضاء أو السوداء أو الرمادية][ip-list-docs] بدلاً من عناوين IP الفردية، يسترجع عقدة Wallarm عناوين IP الدقيقة المتعلقة بالمدخلات في قوائم الIP من قاعدة البيانات المجمعة المستضافة على Google Storage