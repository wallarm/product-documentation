* إصدار منصة Kubernetes من 1.22 إلى 1.26
* موارد K8s Ingress التي تقوم بتكوين Kong لتوجيه استدعاءات API إلى المايكروسيرفيسات التي ترغب في حمايتها
* توافق موارد K8s Ingress مع Kong 3.1.x
* [مدير الحزمة Helm v3](https://helm.sh/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة رسومات بيانية Helm الخاصة بـ Wallarm
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`
* الوصول إلى عناوين IP الخاصة بتخزين Google Cloud المذكورة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عندما [تقوم بتضمين، استبعاد، أو تعيين قائمة رمادية ل][ip-lists-docs] دول كاملة، مناطق، أو مراكز بيانات بدلاً من عناوين IP فردية، يسترجع عقد Wallarm عناوين IP الدقيقة المتعلقة بالمدخلات في قوائم IP من قاعدة البيانات الموحدة المستضافة على Google Storage
* الوصول إلى الحساب بدور **المدير** في واجهة مستخدم Wallarm لـ [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)