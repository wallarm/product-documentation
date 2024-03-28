[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Node.js لخدمة AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) هي خدمة حوسبة خالية من الخوادم، تعتمد على الأحداث، وتسمح لك بتشغيل الكود لأنواع مختلفة من التطبيقات أو الخدمات الخلفية دون الحاجة إلى توفير أو إدارة الخوادم. من خلال دمج كود Wallarm Node.js، يمكنك توجيه الحركة الواردة إلى عقدة Wallarm للتحليل والتصفية. تقدم هذه المقالة تعليمات حول تكوين Wallarm لتحليل الحركة وتصفيتها خاصة للامدا Node.js في تطبيق AWS الخاص بك.

تشمل الحلول نشر عقدة Wallarm بشكل خارجي وإضافة كود مخصص أو سياسات إلى المنصة المحددة. يمكن هذا من توجيه الحركة إلى عقدة Wallarm الخارجية للتحليل والحماية من التهديدات المحتملة. يشار إليها باسم وصلات Wallarm، التي تعمل كالرابط الأساسي بين المنصات مثل Azion Edge، Akamai Edge، Mulesoft، Apigee، وAWS Lambda، وعقدة Wallarm الخارجية. يضمن هذا النهج الاندماج السلس، تحليل الحركة الآمن، التخفيف من المخاطر، وأمان المنصة بشكل عام.

## حالات الاستخدام

من بين جميع [خيارات نشر Wallarm المدعومة](../supported-deployment-options.md)، يُنصح بهذا الحل للحالات الاستخدام التالية:

* تأمين التطبيقات على AWS التي تستخدم لامدا Node.js.
* الحاجة إلى حل أمان يقدم مراقبة شاملة للهجمات، التقارير، ومنع الطلبات الضارة فورًا.

## القيود

يلحق الحل قيودًا حيث يعمل فقط مع الطلبات الواردة:

* لا يعمل اكتشاف الضعف باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) بشكل صحيح. يحدد الحل ما إذا كانت واجهة برمجة التطبيقات عرضة للضعف أم لا بناءً على ردود الخادم على الطلبات الضارة المميزة للثغرات التي يتم اختبارها.
* لا يمكن لـ[اكتشاف API بواسطة Wallarm](../../api-discovery/overview.md) استكشاف جرد الواجهات البرمجية بناءً على حركتك، حيث يعتمد الحل على تحليل الاستجابات.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متوفرة نظرًا لأنها تتطلب تحليل رموز الاستجابة.

توجد أيضًا قيود أخرى:

* حجم جسم حزمة HTTP محدود بـ 40 كيلوبايت عند الاعتراض على مستوى طلب Viewer و1MB على مستوى طلب Origin.
* الوقت الأقصى للاستجابة من عقدة Wallarm محدود بـ 5 ثوانٍ لطلبات Viewer و30 ثانية لطلبات Origin.
* Lambda@Edge لا تعمل ضمن الشبكات الخاصة (VPC).
* العدد الأقصى للطلبات المعالجة في وقت واحد لكل منطقة هو 1,000 (الحصة الافتراضية)، ولكن يمكن زيادتها إلى عشرات الآلاف.

## المتطلبات

للمتابعة مع النشر، تأكد من أنك تلبي المتطلبات التالية:

* فهم تقنيات AWS Lambda.
* واجهات برمجة التطبيقات أو الحركة التي تعمل على AWS.

## النشر

لتأمين التطبيقات على AWS التي تستخدم لامدا Node.js باستخدام Wallarm، اتبع الخطوات التالية:

### 1. نشر عقدة Wallarm

عند دمج Wallarm مع AWS Lambda، يعمل تدفق الحركة [بشكل مباشر](../inline/overview.md). لذلك، اختر واحدًا من الأشكال المدعومة لنشر عقدة Wallarm للنشر المباشر على AWS:

* [AWS AMI](../packages/aws-ami.md)
* [خدمة الحاويات المرنة من أمازون (ECS)](../cloud-platforms/aws/docker-container.md)

قم بتكوين العقدة المنشورة باستخدام القالب التالي:

```
server {
    listen 80;

    server_name _;

	access_log off;
	wallarm_mode off;

	location / {
		proxy_set_header Host $http_x_forwarded_host;
		proxy_pass http://unix:/tmp/wallarm-nginx.sock;
	}
}

server {
    listen 443 ssl;

    server_name yourdomain-for-wallarm-node.tld;

	### هنا تكوين SSL

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
	
	wallarm_mode monitoring;
	#wallarm_mode block;

	real_ip_header X-Lambda-Real-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

يرجى الانتباه إلى التكوينات التالية:

* شهادات TLS/SSL للحركة الآمنة عبر HTTPS: لتمكين عقدة Wallarm من التعامل مع حركة HTTPS الآمنة، قم بتكوين الشهادات TLS/SSL بشكل مناسب. سيعتمد التكوين المحدد على طريقة النشر المختارة. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الرجوع إلى [مقالته](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على التوجيه.
* تكوين [وضع تشغيل Wallarm](../../admin-en/configure-wallarm-mode.md).

### 2. الحصول على سكريبت Wallarm Node.js لـ AWS Lambda وتشغيله

للحصول على وتشغيل سكريبت Wallarm Node.js على AWS Lambda، اتبع الخطوات التالية:

1. اتصل بـ[دعم Wallarm](mailto:support@wallarm.com) للحصول على سكريبت Wallarm Node.js.
1. [أنشئ](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) سياسة IAM جديدة بالأذونات التالية:

    ```
    lambda:CreateFunction, 
    lambda:UpdateFunctionCode, 
    lambda:AddPermission, 
    iam:CreateServiceLinkedRole, 
    lambda:GetFunction, 
    lambda:UpdateFunctionConfiguration, 
    lambda:DeleteFunction, 
    cloudfront:UpdateDistribution, 
    cloudfront:CreateDistribution, 
    lambda:EnableReplication. 
    ```
1. في خدمة AWS Lambda، أنشئ وظيفة جديدة باستخدام Node.js 14.x كوقت تشغيل والدور المُنشئ في الخطوة السابقة. اختر **إنشاء دور جديد بأذونات أساسية لـ Lambda**.
1. في محرر مصدر الكود، الصق الكود الذي تلقيته من فريق دعم Wallarm.
1. في الكود الملصق، قم بتحديث قيم `WALLARM_NODE_HOSTNAME` و`WALLARM_NODE_PORT` لتشير إلى [عقدة Wallarm المنشورة سابقًا](#1-deploy-a-wallarm-node).
    
    لإرسال الحركة إلى العقدة الفلترة عبر 443/SSL، استخدم التكوين التالي:

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```

    إذا كنت تستخدم شهادة موقعة ذاتيًا، أجرِ التغيير التالي لتعطيل تطبيق الشهادة بشكل صارم:

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // فقط في حالة استخدام شهادة موقعة ذاتيًا
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
1. عد إلى قسم IAM وعدل الدور الجديد المنشأ من خلال إرفاق السياسات التالية: `AWSLambda_FullAccess`, `AWSLambdaExecute`, `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole`, و`LambdaDeployPermissions` المنشأة في الخطوة السابقة.
1. في علاقات الثقة، أضف التغيير التالي إلى **الخدمة**:

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
1. انتقل إلى Lambda → الوظائف → <وظيفتك> وانقر على **إضافة مُحَفّز**.
1. في خيارات النشر إلى Lambda@Edge، انقر على **النشر إلى Lambda@Edge** واختر توزيع CloudFront الذي يحتاج إلى إضافة معالج Wallarm أو أنشئ واحدًا جديدًا.

    خلال العملية، اختر **طلب المُشاهِد** لحدث CloudFront وضع علامة في المربع لـ **تضمين الجسم**.

## الاختبار

لتجربة وظيفة السياسة المنشورة، اتبع الخطوات التالية:

1. أرسل الطلب مع هجوم [اختراق المسار][ptrav-attack-docs] الاختباري إلى واجهة برمجة التطبيقات الخاصة بك:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. افتح واجهة Wallarm Console → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من ظهور الهجوم في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا تم ضبط وضع عقدة Wallarm على الحجب، سيتم حجب الطلب أيضًا.

## هل تحتاج مساعدة؟

إذا واجهت أي مشكلات أو تحتاج إلى المساعدة مع نشر Wallarm الموضح بالتوافق مع AWS Lambda، يمكنك التواصل مع فريق [دعم Wallarm](mailto:support@wallarm.com). هم متوفرون لتقديم التوجيه ومساعدتك في حل أي مشكلات قد تواجهها خلال عملية التنفيذ.