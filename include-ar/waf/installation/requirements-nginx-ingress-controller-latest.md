* نسخة منصة Kubernetes 1.24-1.27
* مدير الحزم [Helm](https://helm.sh/)
* التوافقية مع [متحكم الدخول إنجنكس الجماعي](https://github.com/kubernetes/ingress-nginx) الإصدار 1.9.5
* الوصول إلى الحساب بدور **المدير** وميزة المصادقة الثنائية معطلة في واجهة Wallarm لـ[السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحابة Wallarm الأمريكية أو إلى `https://api.wallarm.com` للعمل مع سحابة Wallarm الأوروبية
* الوصول إلى `https://charts.wallarm.com` لإضافة الرسوم البيانية لـ Wallarm Helm. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
