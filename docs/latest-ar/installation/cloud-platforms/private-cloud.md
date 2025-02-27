[ip-lists-docs]: ../../user-guides/ip-lists/overview.md

# نشر Wallarm في السحابات الخاصة

السحابات الخاصة هي بيئات سحابية مُنشأة لمنظمة أو كيان واحد، توفر استخدامًا وتحكمًا حصريًا بالموارد. هذه المقالة تستعرض مبادئ نشر عقدة Wallarm في السحابات الخاصة.

## الخطوة 1: فهم نطاقك وطريقتك لنشر Wallarm

قبل نشر Wallarm في السحابة الخاصة بك، من الضروري فهم نطاق منظر تطبيقاتك وتحديد الطريقة الأنسب لنشر Wallarm. يُرجى النظر في الخصائص التالية خلال هذا التقييم:

* تقييم نطاق لتأمينه: تقييم منظر التطبيقات الخاص بك وتحديد التطبيقات الحرجة التي تتطلب الحماية. ضع في اعتبارك عوامل مثل حساسية البيانات، التأثير المحتمل للانتهاكات، ومتطلبات الامتثال. هذا التقييم يساعدك في تحديد الأولويات والتركيز على حماية أهم الأصول في السحابة الخاصة بك.
* التحليل [عبر الخط](../inline/overview.md) مقابل التحليل [خارج الخط (OOB)](../oob/overview.md): تحديد ما إذا كنت تريد نشر Wallarm لتحليل عبر الخط أو لتحليل حركة المرور المعكوسة خارج الخط. يتضمن التحليل عبر الخط نشر عقد Wallarm في مسار حركة مرور تطبيقاتك، بينما يتضمن التحليل خارج الخط التقاط وتحليل حركة المرور المعكوسة.
* وضع عقد Wallarm: استنادًا إلى طريقتك المختارة (تحليل عبر الخط أو خارج الخط)، تحديد وضعية عقد Wallarm المناسبة ضمن بنية السحابة الخاصة بك. للتحليل عبر الخط، ضع في اعتبارك وضع عقد Wallarm بالقرب من تطبيقاتك، مثل داخل نفس VLAN أو الشبكة الفرعية. للتحليل خارج الخط، تأكد من أن حركة المرور المعكوسة سيتم توجيهها بشكل صحيح إلى عقد Wallarm للتحليل.

## الخطوة 2: السماح بالاتصالات الصادرة لـ Wallarm

في السحابات الخاصة، غالبًا ما توجد قيود على الاتصالات الصادرة. لضمان عمل Wallarm بشكل صحيح، من الضروري تمكين الاتصالات الصادرة، للسماح بتنزيل الحزم أثناء التثبيت، وإقامة اتصال شبكي بين نسخ عقدة المحلية و Wallarm Cloud، وتشغيل ميزات Wallarm بشكل كامل.

يتم منح الوصول في السحابات الخاصة عادةً استنادًا إلى عناوين IP. يتطلب Wallarm الوصول إلى السجلات DNS التالية:

* The following addresses to have access to the Wallarm Cloud to get security rules, upload attack data, etc.

    --8<-- "../include/wallarm-cloud-ips.md"
* عناوين IP المستخدمة بواسطة Docker Hub في حال اخترت تشغيل Wallarm من صورة Docker.
* `34.111.12.147` (`repo.wallarm.com`) في حال اخترت تثبيت عقدة Wallarm من حزم Linux الفردية لـ [NGINX stable](../nginx/dynamic-module.md)/[NGINX Plus](../nginx-plus.md)/[NGINX المُقدم من التوزيع](../nginx/dynamic-module-from-distr.md). يتم تنزيل حزم تثبيت العقدة من هذا العنوان.
* `35.244.197.238` (`https://meganode.wallarm.com`) في حال اخترت تثبيت Wallarm من [مثبت شامل](../nginx/all-in-one.md). يتم تنزيل المثبت من هذا العنوان.
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"

## الخطوة 3: اختيار نموذج النشر ومكون Wallarm

تقدم Wallarm نماذج نشر مرنة، تسمح للمنظمات باختيار الخيار الأنسب لبيئة السحابة الخاصة بها. اثنان من نماذج النشر الشائعة هما **نشر الأجهزة الافتراضية** و**نشر Kubernetes**.

### نشر الأجهزة الافتراضية

في هذا النموذج، تنشر Wallarm كجهاز افتراضي ضمن بنية السحابة الخاصة بك. يمكن تثبيت الجهاز الافتراضي كـ VM أو حاوية. يمكنك اختيار نشر عقدة Wallarm باستخدام أحد المكونات التالية:

* صور Docker:
    * [صورة Docker المبنية على NGINX](../../admin-en/installation-docker-en.md)
    * [صورة Docker المبنية على Envoy](../../admin-en/installation-guides/envoy/envoy-docker.md)
* حزم Linux:
    * [حزم Linux الفردية لـ NGINX stable](../nginx/dynamic-module.md)
    * [حزم Linux الفردية لـ NGINX Plus](../nginx-plus.md)
    * [حزم Linux الفردية للـ NGINX المُقدم من التوزيع](../nginx/dynamic-module-from-distr.md)
    * [المثبت الشامل لـ Linux](../nginx/all-in-one.md)

### نشر Kubernetes

إذا كانت السحابة الخاصة بك تستخدم Kubernetes لتنسيق الحاويات، يمكن نشر Wallarm كحل أصلي لـ Kubernetes. يتكامل بسلاسة مع مجموعات Kubernetes، مستفيداً من الميزات مثل وحدات التحكم في الدخول، حاويات جانبية، أو موارد Kubernetes المخصصة. يمكنك اختيار نشر Wallarm باستخدام أحد الحلول التالية:

* [وحدة تحكم الدخول المبنية على NGINX](../../admin-en/installation-kubernetes-en.md)
* [وحدة تحكم الحارس الجانبي](../kubernetes/sidecar-proxy/deployment.md)