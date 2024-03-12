[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Apigee Edge مع حزمة بروكسي Wallarm

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge) هي منصة إدارة API مع بوابة API تعمل كنقطة دخول لتطبيقات العميل للوصول إلى APIs. لتعزيز أمان API في Apigee، يمكنك دمج حزمة بروكسي API Wallarm كما هو مفصل في هذا المقال.

الحل يتضمن نشر عقدة Wallarm خارجيًا وإدخال كود مخصص أو سياسات في المنصة المحددة. هذا يمكّن من توجيه الحركة إلى العقدة الخارجية Wallarm من أجل التحليل والحماية ضد التهديدات المحتملة. تُعرف بموصلات Wallarm، وتعمل كالوصلة الأساسية بين المنصات مثل Azion Edge، Akamai Edge، Mulesoft، Apigee، و AWS Lambda، والعقدة الخارجية Wallarm. يضمن هذا النهج الدمج السلس، تحليل الحركة الآمن، التقليل من المخاطر، والأمان الشامل للمنصة.

## حالات الاستخدام

من بين كل [خيارات نشر Wallarm المدعومة](../supported-deployment-options.md)، هذا الحل هو الأنسب لحالات الاستخدام التالية:

* تأمين APIs المنشورة على منصة Apigee ببروكسي API واحد فقط.
* الحاجة إلى حل أمان يوفر مراقبة شاملة للهجمات، التقارير، والحجب الفوري للطلبات الضارة.

## القيود

للحل بعض القيود حيث يعمل فقط مع الطلبات الواردة:

* اكتشاف الثغرات الأمنية باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) لا يعمل بشكل صحيح. الحل يحدد إذا كانت API عرضة للخطر أم لا بناءً على استجابات الخادم للطلبات الضارة التي تكون نموذجية للثغرات الأمنية التي يتم اختبارها.
* [اكتشاف API Wallarm](../../api-discovery/overview.md) لا يمكنه استكشاف مخزون API بناءً على حركتك، حيث يعتمد الحل على تحليل الاستجابة.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متاح إذ يتطلب تحليل رمز الاستجابة.

## المتطلبات

للمضي قدمًا في النشر، تأكد من تلبية المتطلبات التالية:

* فهم منصة Apigee.
* APIs الخاصة بك تعمل على Apigee.

## النشر

لتأمين APIs على منصة Apigee، اتبع هذه الخطوات:

1. نشر عقدة Wallarm على نسخة GCP.
1. الحصول على حزمة بروكسي Wallarm وتحميلها إلى Apigee.

### 1. نشر عقدة Wallarm

عند استخدام بروكسي Wallarm على Apigee، تعمل حركة السير [في الخط](../inline/overview.md). لذا، اختر واحدًا من مواد نشر العقدة Wallarm المدعومة للنشر في خط على منصة Google Cloud Platform:

* [صورة GCP للآلة](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

قم بتكوين العقدة المنشورة باستخدام القالب التالي:

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

	access_log off;
	wallarm_mode off;

	location / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://unix:/tmp/wallarm-nginx.sock;
	}
}

server {
	listen unix:/tmp/wallarm-nginx.sock;
	
	server_name _;
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

بعد الانتهاء من النشر، احرص على تدوين عنوان IP لنسخة العقدة حيث سيكون ضروريًا لتكوين توجيه الطلبات الواردة. يرجى ملاحظة أن الIP يمكن أن يكون داخليًا؛ لا يوجد متطلب لأن يكون خارجيًا.

### 2. الحصول على حزمة بروكسي Wallarm وتحميلها إلى Apigee

تتضمن العملية إنشاء بروكسي API على Apigee سيوجه الحركة الشرعية إلى APIs الخاصة بك. اتبع هذه الخطوات للحصول على و[استخدام](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy) حزمة Wallarm لبروكسي API على Apigee:

1. تواصل مع [support@wallarm.com](mailto:support@wallarm.com) للحصول على حزمة بروكسي Wallarm لـ Apigee.
1. في واجهة Apigee Edge، انتقل إلى **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**.
1. قم بتحميل الحزمة المقدمة من فريق دعم Wallarm.
1. افتح ملف الإعدادات المستورد وحدد [عنوان IP لعقدة Wallarm](#1-deploy-a-wallarm-node) في `prewall.js` و `postwall.js`.
1. احفظ ونشر الإعداد.

## الاختبار

لتجربة وظائف السياسة المنشورة، اتبع هذه الخطوات:

1. أرسل الطلب مع هجوم [Path Traversal][ptrav-attack-docs] الاختباري إلى API الخاص بك:

    ```
    curl http://<عنوان_IP_أو_نطاق_تطبيقك>/etc/passwd
    ```
1. افتح واجهة Wallarm Console → قسم **Attacks** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا كان وضع العقدة Wallarm مُعد للحجب، سيتم أيضًا حجب الطلب.

## هل تحتاج لمساعدة؟

إذا واجهت أي مشكلات أو كنت بحاجة إلى المساعدة في النشر الموصوف لـ Wallarm بالتزامن مع Apigee، يمكنك الوصول إلى فريق دعم [Wallarm](mailto:support@wallarm.com). هم متوفرون لتقديم الإرشاد والمساعدة في حل أي مشاكل قد تواجهها أثناء عملية التنفيذ.