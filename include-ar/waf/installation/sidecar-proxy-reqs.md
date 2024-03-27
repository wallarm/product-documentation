* إصدار منصة Kubernetes 1.19-1.29
* [Helm v3](https://helm.sh/) مدير الحزم
* تطبيق تم نشره كـ Pod في تجمع Kubernetes
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو الوصول إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة مخططات Helm الخاصة بـ Wallarm
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`
* الوصول إلى عناوين IP الخاصة بـ Google Cloud Storage المذكورة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عند [إضافة إلى القائمة البيضاء، القائمة السوداء، أو القائمة الرمادية][ip-lists-docs] لدول كاملة، مناطق، أو مراكز بيانات بدلا من عناوين IP فردية، يقوم عقد Wallarm بجلب عناوين IP الدقيقة المتعلقة بالإدخالات في قوائم IP من قاعدة البيانات المجمعة المستضافة على Google Storage
* الوصول إلى الحساب بدور **المدير** في واجهة Wallarm Console لـ [سحابة الولايات المتحدة](https://us1.my.wallarm.com/) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/)