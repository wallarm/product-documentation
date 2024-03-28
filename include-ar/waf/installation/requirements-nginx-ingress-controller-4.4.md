* نسخة منصة Kubernetes 1.23-1.25
* مدير حزم [Helm](https://helm.sh/)
* التوافقية لخدماتكم مع [متحكم دخول NGINX المجتمعي](https://github.com/kubernetes/ingress-nginx) إصدار 1.6.4 أو أقل
* الوصول إلى الحساب بدور **المدير** وتعطيل التوثيق الثنائي في وحدة التحكم Wallarm لـ [السحاب الأمريكي](https://us1.my.wallarm.com/) أو [السحاب الأوروبي](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحاب Wallarm الأمريكي أو إلى `https://api.wallarm.com` للعمل مع سحاب Wallarm الأوروبي
* الوصول إلى `https://charts.wallarm.com` لإضافة خرائط Wallarm Helm. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى عناوين IP لتخزين Google Cloud المدرجة ضمن [الرابط](https://www.gstatic.com/ipranges/goog.json). عندما تقوم [بإضافة عناوين IP إلى القائمة السمحة، القائمة السوداء، أو القائمة الرمادية][ip-list-docs] لدول، مناطق، أو مراكز بيانات بأكملها بدلاً من عناوين IP فردية، يسترد عقد Wallarm عناوين IP الدقيقة المتعلقة بالمدخلات في قوائم الIP من قاعدة البيانات المجمعة المستضافة على Google Storage