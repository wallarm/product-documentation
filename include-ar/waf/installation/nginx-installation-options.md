تنقسم معالجة الطلبات في عقدة Wallarm إلى مرحلتين:

* المعالجة الأولية في وحدة NGINX-Wallarm. المعالجة لا تتطلب الكثير من الذاكرة ويمكن وضعها على خوادم الواجهة الأمامية دون تغيير متطلبات الخادم.
* التحليل الإحصائي للطلبات المعالجة في وحدة التحليلات اللاحقة. التحليلات اللاحقة تتطلب ذاكرة بشكل كبير، وقد يستلزم ذلك تغييرات في تكوين الخادم أو تثبيت التحليلات اللاحقة على خادم منفصل.

اعتمادًا على هندسة النظام، يمكن تثبيت وحدات NGINX-Wallarm والتحليلات اللاحقة على **نفس الخادم** أو على **خوادم مختلفة**.