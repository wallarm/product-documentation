[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# وولارم Node.js لـ AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) هي خدمة حوسبة غير مخدومة ومدفوعة بالأحداث، تتيح لك تشغيل الكود لأنواع مختلفة من التطبيقات أو الخدمات الخلفية دون الحاجة إلى توفير أو إدارة الخوادم. من خلال دمج كود وولارم Node.js، يمكنك التوجيه الوارد للترافيك إلى عقدة وولارم لتحليله وتصفيته. يوفر هذا المقال تعليمات حول تهيئة وولارم لتحليل وتصفية الترافيك خصيصًا للامداهات Node.js في تطبيق AWS الخاص بك.

تتضمن الحل دمج العقدة وولارم خارجيًا وحقن كود أو سياسات مخصصة في المنصة المحددة. هذا يتيح توجيه الترافيك إلى العقدة وولارم الخارجية لتحليله وحمايته من التهديدات المحتملة. يشار إليها باسم موصلات وولارم، فهي تعمل كحلقة وصل أساسية بين المنصات مثل Azion Edge وAkamai Edge وMulesoft وApigee وAWS Lambda، والعقدة وولارم الخارجية. هذا النهج يضمن التكامل السلس، تحليل الترافيك الآمن، تقليل المخاطر، وأمان المنصة بشكل عام.

## حالات الاستخدام

من بين جميع [خيارات توزيع وولارم المدعومة](../supported-deployment-options.md)، هذا الحل هو الموصى به لحالات الاستخدام التالية:

* تأمين التطبيقات على AWS التي تستخدم فيها الامداهات Node.js.
* الطلب على حل أمني يقدم مراقبة شاملة للهجمات، التقرير، وحجب الطلبات الخبيثة بشكل فوري.

## القيود

للحل قيود معينة حيث يعمل فقط مع الطلبات الواردة:

* اكتشاف الضعف باستخدام طريقة [الكشف السلبي](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) لا يعمل بشكل صحيح. الحل يحدد ما إذا كانت واجهة برمجة التطبيقات معرضة للخطر أم لا استنادًا إلى استجابات الخادم للطلبات الخبيثة التي تعتبر نموذجية للثغرات التي يختبرها.
* [اكتشاف واجهة برمجة التطبيقات وولارم](../../api-discovery/overview.md) لا يمكنه استكشاف جرد واجهة برمجة التطبيقات استنادًا إلى ترافيكك، حيث يعتمد الحل على تحليل الاستجابة.
* [الحماية ضد التصفح القسري](../../admin-en/configuration-guides/protecting-against-bruteforce.md) غير متاحة لأنها تتطلب تحليل كود الاستجابة.

هناك أيضًا قيود أخرى:

* حجم جسم حزمة HTTP محدود إلى 40 KB عند الاعتراض على مستوى طلب المشاهد و1MB على مستوى طلب المصدر.
* الوقت الأقصى للاستجابة من عقدة وولارم محدود إلى 5 ثوانٍ لطلبات المشاهدين و30 ثانية لطلبات المصدر.
* لامدا@Edge لا تعمل داخل الشبكات الخاصة (VPC).
* الحد الأقصى لعدد الطلبات المعالجة بالتزامن لكل منطقة هو 1000 (الحصة الافتراضية)، ولكن يمكن زيادتها إلى عشرات الآلاف.

## المتطلبات

للمضي قدمًا في التوزيع، تأكد من أنك تفي بالمتطلبات التالية:

* فهم تقنيات AWS Lambda.
* واجهات برمجة التطبيقات أو الترافيك الجاري على AWS.

## التوزيع

لتأمين التطبيقات على AWS التي تستخدم Node.js لامدا، اتبع هذه الخطوات:

1. توزيع عقدة وولارم على نموذج AWS.
1. احصل على سكربت وولارم Node.js لـ AWS Lambda وشغله.

### 1. توزيع عقدة وولارم

عند دمج وولارم مع AWS Lambda، يعمل التدفق الترافيكي [عبر الإنترنت](../inline/overview.md). ولذلك، اختر أحد تحفيظات عقدة وولارم المدعومة للتوزيع الخطي على AWS:

* [AWS AMI](../packages/aws-ami.md)
* [خدمة حاويات Amazon Elastic (ECS)](../cloud-platforms/aws/docker-container.md)

قم بتهيئة العقدة الموزعة باستخدام القالب التالي:

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

	### تهيئة SSL هنا

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

يرجى الانتباه إلى التهيئات التالية:

* شهادات TLS/SSL لترافيك HTTPS: لتمكين عقدة وولارم من التعامل مع ترافيك HTTPS الآمن، قم بتهيئة شهادات TLS/SSL وفقًا لذلك. التهيئة المحددة ستعتمد على طريقة التوزيع المختارة. على سبيل المثال، إذا كنت تستخدم NGINX، يمكنك الرجوع إلى [مقال](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) للحصول على التوجيه.
* تهيئة [وضع عمل وولارم](../../admin-en/configure-wallarm-mode.md).

### 2. احصل على سكربت وولارم Node.js لـ AWS Lambda وشغله

للحصول على وتشغيل سكربت وولارم Node.js على AWS Lambda، اتبع هذه الخطوات:

1. اتصل بـ [support@wallarm.com](mailto:support@wallarm.com) للحصول على سكربت وولارم Node.js.
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
1. في خدمة AWS Lambda، أنشئ وظيفة جديدة باستخدام Node.js 14.x كوقت تشغيل والدور المُنشأ في الخطوة السابقة. اختر **أنشئ دورًا جديدًا بأذونات Lambda الأساسية**.
1. في محرر مصدر الكود، الصق الكود المستلم من فريق دعم وولارم.
1. في الكود الملصوق، حدّث قيم `WALLARM_NODE_HOSTNAME` و `WALLARM_NODE_PORT` لتشير إلى [عقدة وولارم الموزعة مسبقًا](#1-deploy-a-wallarm-node).
    
    لإرسال الترافيك إلى العقدة التصفية عبر 443/SSL، استخدم التهيئة التالية:

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```

    إذا كنت تستخدم شهادة ذاتية التوقيع، قم بالتغيير التالي لتعطيل تطبيق شهادة صارم:

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // فقط إذا كانت الشهادة ذاتية التوقيع
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
1. عُد إلى قسم IAM وقم بتعديل الدور الجديد المُنشأ بإضافة السياسات التالية: `AWSLambda_FullAccess`، `AWSLambdaExecute`، `AWSLambdaBasicExecutionRole`، `AWSLambdaVPCAccessExecutionRole`، و `LambdaDeployPermissions` المُنشأة في الخطوة السابقة.
1. في علاقات الثقة، أضف التغيير التالي إلى **الخدمة**:

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
1. انتقل إلى Lambda → الوظائف → <وظيفتك> وانقر على **أضف مشغل**.
1. في خيارات نشر إلى Lambda@Edge، انقر على **نشر إلى Lambda@Edge** واختر توزيع CloudFront الذي تريد إضافة معالج وولارم إليه أو أنشئ واحدًا جديدًا.

    خلال العملية، اختر **طلب المشاهد** لحدث CloudFront وضع علامة على صندوق **تضمين الجسم**.

## الاختبار

لتجربة وظائف السياسة الموزعة، اتبع هذه الخطوات:

1. أرسل الطلب مع هجوم [Path Traversal][ptrav-attack-docs] الاختباري إلى واجهة برمجة التطبيقات الخاصة بك:

    ```
    curl http://<عنوان_التطبيق_أو_النطاق/>
    ```
1. افتح لوحة تحكم وولارم → قسم **الهجمات** في [السحابة الأمريكية](https://us1.my.wallarm.com/attacks) أو [السحابة الأوروبية](https://my.wallarm.com/attacks) وتأكد من أن الهجوم يظهر في القائمة.
    
    ![الهجمات في الواجهة][attacks-in-ui-image]

    إذا كانت وضعية عقدة وولارم على الحجب، سيتم حجب الطلب أيضًا.

## تحتاج مساعدة؟

إذا واجهت أية مشكلات أو احتجت إلى المساعدة بشأن التوزيع الموصوف لوولارم بالتعاون مع AWS Lambda، يمكنك الوصول إلى فريق [دعم وولارم](mailto:support@wallarm.com). هم متاحون لتقديم التوجيه والمساعدة في حل أية مشكلات قد تواجهك خلال عملية التنفيذ.