* نسخة منصة Kubernetes 1.23-1.25
* مدير حزم [Helm](https://helm.sh/)
* التوافقية لخدماتكم مع [متحكم دخول NGINX المجتمعي](https://github.com/kubernetes/ingress-nginx) إصدار 1.6.4 أو أقل
* الوصول إلى الحساب بدور **المدير** وتعطيل التوثيق الثنائي في وحدة التحكم Wallarm لـ [السحاب الأمريكي](https://us1.my.wallarm.com/) أو [السحاب الأوروبي](https://my.wallarm.com/)
* الوصول إلى `https://us1.api.wallarm.com` للعمل مع سحاب Wallarm الأمريكي أو إلى `https://api.wallarm.com` للعمل مع سحاب Wallarm الأوروبي
* الوصول إلى `https://charts.wallarm.com` لإضافة خرائط Wallarm Helm. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* الوصول إلى مستودعات Wallarm على Docker Hub `https://hub.docker.com/r/wallarm`. تأكد من عدم حجب الوصول بواسطة جدار الحماية
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
