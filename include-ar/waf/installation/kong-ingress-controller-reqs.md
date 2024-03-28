* إصدار منصة Kubernetes من 1.22 إلى 1.26
* موارد K8s Ingress التي تقوم بتكوين Kong لتوجيه مكالمات API إلى الخدمات الدقيقة التي ترغب في حمايتها
* توافق موارد K8s Ingress مع Kong 3.1.x
* مدير الحزم [Helm v3](https://helm.sh/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة مخططات Helm الخاصة بـ Wallarm
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`
* الوصول إلى عناوين IP لـ Google Cloud Storage المذكورة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عند [تضمين, استبعاد, أو إضافة إلى القائمة الرمادية][ip-lists-docs] لدول كاملة، مناطق، أو مراكز بيانات بدلاً من عناوين IP فردية، يقوم عقد Wallarm باسترجاع عناوين IP الدقيقة المتعلقة بالمدخلات في القوائم الأيبية من قاعدة البيانات المجمعة المستضافة على Google Storage
* الوصول إلى الحساب بدور **المسؤول** في وحدة التحكم الخاصة بـ Wallarm لل[سحابة الأمريكية](https://us1.my.wallarm.com/) أو لل[سحابة الأوروبية](https://my.wallarm.com/)