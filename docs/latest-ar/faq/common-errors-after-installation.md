# أخطاء بعد تثبيت عقدة Wallarm

إذا واجهت بعض الأخطاء بعد تثبيت عقدة Wallarm، فتحقق من هذا الدليل لاستكشاف الأخطاء وإصلاحها. إذا لم تجد التفاصيل ذات الصلة هنا، يرجى التواصل مع [الدعم الفني لـWallarm](mailto:support@wallarm.com).

## فشل سيناريوهات تنزيل الملفات

إذا فشلت سيناريوهات تنزيل الملفات الخاصة بك بعد تثبيت عقدة الفلترة، فالمشكلة تكمن في تجاوز حجم الطلب للحد المحدد في التوجيه `client_max_body_size` في ملف تكوين Wallarm.

غيّر القيمة في `client_max_body_size` في التوجيه `location` للعنوان الذي يقبل تحميلات الملفات. تغيير قيمة `location` فقط يحمي الصفحة الرئيسية من استقبال طلبات كبيرة.

غيّر القيمة في `client_max_body_size`:

1. افتح ملف التكوين للتحرير في مجلد `/etc/nginx-wallarm`.
2. أدخل القيمة الجديدة:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` هو العنوان الذي يقبل تحميلات الملفات.

وصف تفصيلي للتوجيه متاح في [الوثائق الرسمية لـNGINX](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## كيفية إصلاح أخطاء "لم يتم التحقق من توقيع wallarm-node"، "yum لا يملك بيانات مخزنة كافية للاستمرار"، "لم يتم التحقق من التوقيعات"؟

إذا انتهت صلاحية مفاتيح GPG لحزم Wallarm RPM أو DEB، قد تظهر لك رسائل الخطأ التالية:

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] repomd.xml signature could not be verified for wallarm-node_3.6

واحد من المستودعات المكونة فشل (عقدة Wallarm لـ CentOS 7 - 3.6)،
وyum لا يملك بيانات مخزنة كافية للاستمرار.

W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: التوقيعات التالية
لم يتم التحقق منها لأن المفتاح العام غير متاح: NO_PUBKEY 1111FQQW999
E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' غير موقع.
N: التحديث من مستودع كهذا لا يمكن أن يتم بأمان، ولذلك تم تعطيله بشكل افتراضي.
N: راجع صفحة الرجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
```

لإصلاح المشكلة على **Debian أو Ubuntu**، يرجى اتباع الخطوات:

1. قم باستيراد مفاتيح GPG الجديدة لحزم Wallarm:

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. قم بتحديث حزم Wallarm:

	```bash
	sudo apt update
	```

لإصلاح المشكلة على **CentOS**، يرجى اتباع الخطوات:

1. أزل المستودع المضاف مسبقًا:

	```bash
	sudo yum remove wallarm-node-repo
	```
2. نظف الذاكرة المخبأة:

	```bash
	sudo yum clean all
	```
3. أضف مستودعًا جديدًا باستخدام الأمر لإصدارات CentOS وعقدة Wallarm المناسبة:

	=== "CentOS 7.x أو Amazon Linux 2.0.2021x وأقل"
		```bash

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.4
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.6
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.8
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
		```
	=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
		```bash

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.4
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.6
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm

		# العقدة الفلترة ووحدة تحليلات ما بعد العملية للإصدار 4.8
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
		```		
4. إذا لزم الأمر، قم بتأكيد العملية.

## لماذا لا تقوم العقدة الفلترة بحظر الهجمات عند العمل في وضع الحظر (`wallarm_mode block`)؟

استخدام التوجيه `wallarm_mode` هو واحد فقط من عدة طرق لتكوين وضع فلترة حركة المرور. بعض هذه الطرق لها أولوية أعلى من قيمة التوجيه `wallarm_mode`.

إذا قمت بتهيئة وضع الحظر عبر `wallarm_mode block` لكن عقدة فلترة Wallarm لا تحظر الهجمات، يرجى التأكد من أن وضع الفلترة لم يتم تجاوزه باستخدام طرق تكوين أخرى:

* باستخدام [قاعدة **ضبط وضع الفلترة**](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
* في [قسم **العامة** من وحدة تحكم Wallarm](../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)

[المزيد عن طرق تهيئة وضع الفلترة ←](../admin-en/configure-parameters-en.md)