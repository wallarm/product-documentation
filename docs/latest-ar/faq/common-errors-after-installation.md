# أخطاء بعد تثبيت عقدة Wallarm

إذا حدثت بعض الأخطاء بعد تثبيت عقدة Wallarm، راجع دليل استكشاف الأخطاء وإصلاحها هذا لمعالجتها. إذا لم تجد التفاصيل ذات الصلة هنا، يرجى التواصل مع [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).

## فشل سيناريوهات تحميل الملفات

إذا فشلت سيناريوهات تحميل الملفات بعد تثبيت عقدة الفلترة، فإن المشكلة تكمن في تجاوز حجم الطلب للحد المحدد في توجيه `client_max_body_size` في ملف تكوين Wallarm.

قم بتغيير القيمة في `client_max_body_size` في توجيه `location` للعنوان الذي يقبل تحميلات الملفات. تغيير قيمة `location` فقط يحمي الصفحة الرئيسية من الحصول على طلبات كبيرة.

قم بتغيير القيمة في `client_max_body_size`:

1. افتح ملف التكوين للتعديل في دليل `/etc/nginx-wallarm`.
2. ضع القيمة الجديدة:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload` هو العنوان الذي يقبل تحميلات الملفات.

وصف تفصيلي للتوجيه متوفر في [وثائق NGINX الرسمية](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## كيف يمكن إصلاح الأخطاء "تعذر التحقق من توقيع wallarm-node"، "yum لا يحتوي على بيانات مخبأة كافية للمتابعة"، "لم يتم التحقق من التوقيعات"؟

إذا انتهت صلاحية مفاتيح GPG لحزم RPM أو DEB الخاصة بـ Wallarm، قد تظهر لك الرسائل التالية:

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] repomd.xml signature could not be verified for wallarm-node_3.6

أحد المستودعات المكونة فشل (Wallarm Node لـ CentOS 7 - 3.6)،
و yum لا يحتوي على بيانات مخبأة كافية للمتابعة.

W: خطأ GPG: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: التوقيعات التالية
لم يتم التحقق منه لأن المفتاح العام غير متوفر: NO_PUBKEY 1111FQQW999
E: المستودع 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' غير موقع.
N: تحديث من مثل هذا المستودع لا يمكن أن يتم بأمان، وبالتالي يتم تعطيله بشكل افتراضي.
N: انظر صفحة الرجل apt-secure(8) لتفاصيل إنشاء المستودع وتكوين المستخدم.
```

لإصلاح المشكلة على **Debian أو Ubuntu**، يرجى اتباع الخطوات:

1. استيراد مفاتيح GPG الجديدة لحزم Wallarm:

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. تحديث حزم Wallarm:

	```bash
	sudo apt update
	```

لإصلاح المشكلة على **CentOS**، يرجى اتباع الخطوات:

1. إزالة المستودع الذي تم إضافته سابقًا:

	```bash
	sudo yum remove wallarm-node-repo
	```
2. مسح الذاكرة المخبأة:

	```bash
	sudo yum clean all
	```
3. إضافة مستودع جديد باستخدام الأمر لإصدارات CentOS و Wallarm node المناسبة:

	=== "CentOS 7.x أو Amazon Linux 2.0.2021x وأقل"
		```bash

		# عقدة تصفية ووحدة postanalytics للإصدار 4.4
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# عقدة تصفية ووحدة postanalytics للإصدار 4.6
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm

		# عقدة تصفية ووحدة postanalytics للإصدار 4.8
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
		```
	=== "AlmaLinux، Rocky Linux أو Oracle Linux 8.x"
		```bash

		# عقدة تصفية ووحدة postanalytics للإصدار 4.4
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# عقدة تصفية ووحدة postanalytics للإصدار 4.6
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm

		# عقدة تصفية ووحدة postanalytics للإصدار 4.8
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.8/x86_64/wallarm-node-repo-4.8-0.el8.noarch.rpm
		```		
4. إذا لزم الأمر، قم بتأكيد الإجراء.

## لماذا لا تقوم عقدة التصفية بحظر الهجمات عند العمل في وضع الحظر (`wallarm_mode block`)؟

استخدام توجيه `wallarm_mode` هو واحد فقط من عدة طرق لتكوين وضع تصفية حركة المرور. بعض هذه الطرق لها أولوية أعلى من قيمة توجيه `wallarm_mode`.

إذا قمت بتكوين وضع الحظر عبر `wallarm_mode block` ولكن عقدة تصفية Wallarm لا تحظر الهجمات، يرجى التأكد من أن وضع التصفية لم يتم تجاوزه باستخدام طرق تكوين أخرى:

* باستخدام [القاعدة **ضبط وضع التصفية**](../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)
* في [القسم **العام** من وحدة تحكم Wallarm](../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)

[المزيد من التفاصيل حول طرق تكوين وضع التصفية →](../admin-en/configure-parameters-en.md)