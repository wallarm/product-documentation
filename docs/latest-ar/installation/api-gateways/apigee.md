[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Apigee Edge مع حزمة Wallarm Proxy

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge) هو منصة إدارة API مع بوابة API تعمل كنقطة دخول لتطبيقات العميل للوصول إلى APIs. لزيادة أمان API في Apigee، يمكنك دمج حزمة Wallarm proxy كما هو موضح في هذا المقال.

تشمل الحل نشر عقدة Wallarm من الخارج وإدخال شيفرة مخصصة أو سياسات في المنصة المحددة. هذا يتيح توجيه الحركة إلى عقدة Wallarm الخارجية للتحليل والحماية ضد التهديدات المحتملة. تُعرف بموصلات Wallarm، وهي تعمل كحلقة وصل أساسية بين منصات مثل Azion Edge، Akamai Edge، MuleSoft، Apigee، و AWS Lambda، وعقدة Wallarm الخارجية. هذه الطريقة تضمن الاندماج السلس، تحليل حركة الزيارات المأمونة، تخفيف المخاطر، وأمان النظام الشامل.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](../supported-deployment-options.md)، تعتبر هذه الحل الأنسب للحالات التالية:

* تأمين APIs المنشرة على منصة Apigee بواسطة وكيلAPI واحد فقط.
* الحاجة إلى حل أمني يقدم مراقبة شاملة للهجمات، التقارير، والحظر الفوري للطلبات الضارة.

## القيود

لهذا الحل بعض القيود حيث يعمل فقط مع الطلبات الواردة:

* لا يعمل اكتشاف الثغرات الأمنية باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) بشكل صحيح. يحدد الحل ما إذا كان API عرضة للخطر أم لا استنادًا إلى ردود الخادم على الطلبات الضارة التي تكون نموذجية للثغرات التي يختبرها.
* لا يمكن لـ[اكتشاف Wallarm API](../../api-discovery/overview.md) استكشاف جرد الـAPI بناءً على حركة الزيارات لديك، حيث يعتمد الحل على تحليل الردود.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متوفرة نظرًا لأنها تتطلب تحليل أكواد الرد.

## المتطلبات

للمتابعة مع النشر، تأكد من تحقيق المتطلبات التالية:

* فهم منصة Apigee.
* تشغيل APIs الخاصة بك على Apigee.

## النشر

لتأمين APIs على منصة Apigee، اتبع الخطوات التالية:

1. نشر عقدة Wallarm على نموذج GCP.
1. الحصول على حزمة Wallarm proxy وتحميلها إلى Apigee.

### 1. نشر عقدة Wallarm

عند استخدام Wallarm proxy على Apigee، تعمل حركة الزيارات [عبر الإنترنت](../inline/overview.md). لذلك، اختر أحد مكونات نشر عقدة Wallarm المدعومة للنشر في الخط على منصة Google Cloud Platform:

* [صورة الآلة GCP](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

اضبط العقدة المنشورة باستخدام القالب التالي:

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

بعد الانتهاء من النشر، خذ ملاحظة عنوان IP لمثيل العقدة حيث سيكون ضروريًا لتكوين توجيه الطلبات الواردة. يرجى ملاحظة أنه يمكن أن يكون العنوان الداخلي؛ ليس هناك حاجة لأن يكون خارجيًا.

### 2. الحصول على حزمة Wallarm proxy وتحميلها إلى Apigee

تشمل الاندماج إنشاء وكيل API على Apigee سيوجه الحركة المشروعة إلى APIs الخاصة بك. اتبع هذه الخطوات للحصول على حزمة Wallarm و[استخدام](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy)ها لوكيلAPI على Apigee:

1. الاتصال بـ[support@wallarm.com](mailto:support@wallarm.com) للحصول على حزمة Wallarm proxy لـ Apigee.
1. في واجهة Apigee Edge، انتقل إلى **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**.
1. حمّل الحزمة التي قدمها فريق دعم Wallarm.
1. افتح ملف التكوين المستورد وحدد [عنوان IP لمثيل عقدة Wallarm](#1-deploy-a-wallarm-node) في `prewall.js` و `postwall.js`.
1. احفظ التكوين ونشره.

## الاختبار

للاختبار وظيفة السياسة المنشورة، اتبع الخطوات التالية:

1. إرسال الطلب مع هجوم [Path Traversal][ptrav-attack-docs] لاختبار إلى API الخاص بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح وحدة التحكم Wallarm→ قسم **Attacks** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا كان وضع عقدة Wallarm مضبوط على الحظر، سيتم حظر الطلب أيضًا.

## هل تحتاج إلى مساعدة؟

إذا واجهت أي مشاكل أو تحتاج إلى مساعدة مع النشر الموصوف لـ Wallarm بالتزامن مع Apigee، يمكنك التواصل مع فريق [دعم Wallarm](mailto:support@wallarm.com). هم متوفرون لتقديم التوجيه والمساعدة في حل أي مشاكل قد تواجهها خلال عملية التنفيذ.