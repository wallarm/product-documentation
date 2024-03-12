# تحديد عنوان IP الأصلي للعميل عند استخدام وكيل HTTP أو موزع الحمولة (NGINX)

تصف هذه التعليمات البرمجة المطلوبة لـ NGINX لتحديد عنوان IP الأصلي للعميل الذي يتصل بخوادمك عبر وكيل HTTP أو موزع الحمولة.

* إذا تم تثبيت عقدة Wallarm من الحزم DEB / RPM ، أو AWS / GCP images ، أو صورة Docker المستندة إلى NGINX ، يرجى استخدام **التعليمات الحالية**.
* إذا تم نشر عقدة Wallarm بصفتها وحدة تحكم Ingress لـ K8s ، فيرجى استخدام [هذه التعليمات](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

## كيفية تحديد عقدة Wallarm لعنوان IP للطلب

تقرأ عقدة Wallarm عنوان IP المصدر للطلب من المتغير NGINX `$remote_addr`. إذا تم تمرير الطلب عبر خادم وكيل أو موزع الحمولة قبل إرساله إلى العقدة، فستحتفظ المتغير `$remote_addr` بعنوان IP لخادم الوكيل أو موزع الحمولة.

![استخدام الموزع](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

يتم عرض عنوان IP المصدر للطلب الذي تم تحديده بواسطة عقدة Wallarm في [تفاصيل الهجوم](../user-guides/events/check-attack.md#attacks) في Wallarm Console.

## مشاكل محتملة في استخدام عنوان IP لخادم الوكيل أو موزع الحمولة كعنوان مصدر للطلب

إذا كانت عقدة Wallarm تعتبر عنوان IP خادم الوكيل أو موزع الحمولة عنوان IP لمصدر الطلب ، فقد لا تعمل الميزات التالية من Wallarm بشكل صحيح:

* [التحكم في الوصول إلى التطبيقات حسب عناوين IP](../user-guides/ip-lists/overview.md) ، على سبيل المثال:

	إذا تم إدراج عناوين IP العميل الأصلية في القائمة السوداء ، فلن تحظر عقدة Wallarm الطلبات الناشئة عنها لأنها تعتبر عنوان IP موزع الحمولة عنوان IP لمصدر الطلب.
* [الحماية من الهجمات المتكررة](configuration-guides/protecting-against-bruteforce.md) ، على سبيل المثال:

 	إذا كانت الطلبات المارة عبر موزع الحمولة لديها علامات هجوم غاشمة ، فستحجب Wallarm عنوان IP هذا الموزع وبالتالي ستحجب جميع الطلبات اللاحقة التي تم تمريرها عبر موزع الحمولة هذا.
* وحدة [التحقق من التهديد النشط](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) و [ماسح الثغرات الأمنية](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ، على سبيل المثال:

	ستعتبر Wallarm أن عنوان IP لموزع الحمولة هو [عنوان IP الذي تم إنشاء هجمات الاختبار منه](../admin-en/scanner-addresses.md) الذي تم إنشاؤه بواسطة وحدة التحقق من التهديد النشط وماسح الثغرات الأمنية. وبهذه الطريقة ، ستتم عرض هجمات الاختبار في وحدة التحكم في Wallarm كهجمات نشأت من عنوان IP لموزع الحمولة وسيتم التحقق منها بشكل إضافي من قبل Wallarm مما سيؤدي إلى إنشاء حمولة إضافية على التطبيق.

إذا كانت عقدة Wallarm متصلة عبر [مقبس IPC](https://en.wikipedia.org/wiki/Unix_domain_socket) ، ثم سيتم اعتبار `0.0.0.0` كمصدر للطلب.

## التكوين لتحديد عنوان IP العميل الأصلي

لتكوين تحديد عنوان IP العميل الأصلي ، يمكنك استخدام [وحدة NGINX **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html). تتيح لك هذه الوحدة إعادة تعريف قيمة `$remote_addr` [المستخدمة](#how-wallarm-node-identifies-an-ip-address-of-a-request) من قبل عقدة Wallarm للحصول على عنوان IP العميل.

يمكنك استخدام وحدة NGINX **ngx_http_realip_module** بأحد الطرق التالية:

* لقراءة عنوان IP العميل الأصلي من رأس معين (عادةً ، [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) تمت إضافته إلى الطلب بواسطة موزع الحمولة أو خادم الوكيل.
* إذا كان خادم الوكيل أو موزع الحمولة يدعم [بروتوكول PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) ، لقراءة عنوان IP العميل الأصلي من الرأس `PROXY`.

### تكوين NGINX لقراءة الرأس `X-Forwarded-For` (`X-Real-IP` أو ما شابه)

إذا كان خادم الوكيل أو موزع الحمولة يضيف الرأس `X-Forwarded-For` (`X-Real-IP` أو ما شابه) الذي يحتوي على عنوان IP العميل الأصلي, يرجى تكوين وحدة NGINX **ngx_http_realip_module** لقراءة هذا الرأس على النحو التالي:

1. افتح ملف التهيئة التالي لـ NGINX المثبت مع عقدة Wallarm:

    * `/etc/nginx/conf.d/default.conf` إذا تم تثبيت عقدة Wallarm من حزم الـ DEB / RPM أو المُثبت الشامل.
    * `/etc/nginx/nginx.conf` إذا تم نشر عقدة Wallarm من صورة AWS / GCP.
    * إذا تم نشر عقدة Wallarm من صورة Docker المُستندة إلى NGINX ، يجب عليك إنشاء وتحرير ملف التكوين NGINX محليًا وتركيبه على الحاوية Docker على المسار `/etc/nginx/sites-enabled/default`. يمكنك نسخ ملف تكوين NGINX الأولي والحصول على التعليمات حول تركيب الملف على الحاوية من [تعليمات Docker الخاصة بـ Wallarm NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. في سياق `location` NGINX أو أعلى، أضف التوجيه `set_real_ip_from` بعنوان IP لخادم الوكيل أو موزع الحمولة. إذا كان لدى خادم الوكيل أو موزع الحمولة عدة عناوين IP ، يرجى إضافة عدد منفصل من التوجيهات. مثلا:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. في الوثائق المتعلقة بموزع الحمولة المستخدم ، ابحث عن اسم الرأس الذي يتم إلحاقه بهذا الموزع لتمرير عنوان IP العميل الأصلي. في الغالب ، يُطلق على الرأس اسم `X-Forwarded-For`.
3. في سياق `location` NGINX أو أعلى، أضف التوجيه `real_ip_header` مع اسم الرأس الذي تم العثور عليه في الخطوة السابقة. مثال :

	```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
        real_ip_header X-Forwarded-For;
    }
    ...
    ```
4. إعادة تشغيل NGINX:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    ستقوم NGINX بتعيين قيمة الرأس المحددة في توجيه `real_ip_header` إلى المتغير `$remote_addr` ، لذا ستقرأ عقدة Wallarm عناوين IP العملاء الأصلية من هذا المتغير.
5. [اختبر التكوين](#testing-the-configuration).

### تكوين NGINX لقراءة الرأس `PROXY`

إذا كان خادم الوكيل أو موزع الحمولة يدعم [البروتوكول PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) ، يمكنك تكوين وحدة NGINX **ngx_http_realip_module** لقراءة الرأس `PROXY` كما يلي:

1. افتح ملف التهيئة التالي لـ NGINX المثبت مع عقدة Wallarm:

    * `/etc/nginx/conf.d/default.conf` إذا تم تثبيت عقدة Wallarm من حزم DEB / RPM أو المُثبت الشامل.
    * `/etc/nginx/nginx.conf` إذا تم نشر عقدة Wallarm من صورة AWS / GCP.
    * إذا تم نشر عقدة Wallarm من صورة Docker المُستندة إلى NGINX ، يجب عليك إنشاء وتحرير ملف التكوين NGINX محليًا وتركيبه على الحاوية Docker على المسار `/etc/nginx/sites-enabled/default`. يمكنك نسخ ملف تكوين NGINX الأولي والحصول على التعليمات حول تركيب الملف على الحاوية من [تعليمات Docker الخاصة بـ Wallarm NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. في سياق `server` NGINX ، أضف العامل `proxy_protocol` إلى التوجيه `listen`.
3. في سياق `location` NGINX أو أعلى، أضف التوجيه `set_real_ip_from` بعنوان IP لخادم الوكيل أو موزع الحمولة. إذا كان لدى خادم الوكيل أو موزع الحمولة عدة عناوين IP ، يرجى إضافة عدد منفصل من التوجيهات، على سبيل المثال:
4. في سياق `location` NGINX أو أعلى، أضف التوجيه `real_ip_header` بقيمة `proxy_protocol`.

    مثال لملف تكوين NGINX مع جميع التوجيهات المضافة:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * تستمع NGINX للاتصالات الواردة على المنفذ 80.
    * إذا لم يتم تمرير الرأس `PROXY` في الطلب الوارد ، فإن NGINX لن تقبل هذا الطلب لأنه يعتبر غير صالح.
    * بالنسبة للطلبات الناتجة عن العنوان `<IP_ADDRESS_OF_YOUR_PROXY>` ، ستقوم NGINX بإسناد عنوان المصدر الذي تم تمريره في الرأس `PROXY` إلى المتغير `$remote_addr` ، لذا ستقرأ عقدة Wallarm عناوين IP العملاء الأصلية من هذا المتغير.
5. إعادة تشغيل NGINX:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [اختبر التكوين](#testing-the-configuration).

لتضمين عنوان IP العميل الأصلي في السجلات ، يجب أن تضيف التوجيه `proxy_set_header` وتعديل قائمة المتغيرات في التوجيه `log_format` في تكوين NGINX كما هو موضح في [تعليمات تسجيل NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address).

مزيد من التفاصيل حول تحديد عنوان IP العميل الأصلي استنادًا إلى الرأس `PROXY` متاحة في [وثائق NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address).

### اختبار التهيئة

1. أرسل هجوم الاختبار إلى عنوان التطبيق المحمي:

    === "استخدام cURL"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "استخدام printf و Netcat (للرأس `PROXY`)"
		```bash
		printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
		```
2. افتح Wallarm Console وتأكد من ظهور عنوان IP العميل الأصلي في تفاصيل الهجوم:

    ![عنوان IP الذي نشأ عن الطلب](../images/request-ip-address.png)

    إذا قرأت NGINX العنوان الأصلي من الرأس `X-Forwarded-For` (`X-Real-IP` أو ما يشبه) ، فإن قيمة الرأس ستتم أيضًا عرضها في الهجوم الخام.

    ![رأس X-Forwarded-For](../images/x-forwarded-for-header.png)

## أمثلة التكوين

أدناه ستجد أمثلة على تهيئة NGINX المطلوبة لتحديد عنوان IP الأصلي للعميل الذي يتصل بخوادمك من خلال موزعات الحمولة الشائعة.

### CDن Cloudflare

إذا كنت تستخدم شبكة توزيع المحتوى Cloudflare ، يمكنك [تكوين وحدة NGINX **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) لتحديد عناوين IP الأصلية للعملاء.

```bash
...
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;

real_ip_header CF-Connecting-IP;
#real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

* قبل حفظ التكوين ، يرجى التأكد من أن عناوين IP لـ Cloudflare المحددة في التكوين أعلاه تتطابق مع تلك الموجودة في [وثائق Cloudflare](https://www.cloudflare.com/ips/). 
* يمكنك تحديد `CF-Connecting-IP` أو `X-Forwarded-For` كقيمة للتوجيه `real_ip_header`. تُلحق شبكة توزيع المحتوى Cloudflare كلا الرأسين ويمكنك تكوين NGINX لقراءة أي منهما. [مزيد من التفاصيل في شبكة توزيع المحتوى Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs).

### CDN Fastly

إذا كنت تستخدم شبكة توزيع المحتوى Fastly ، يمكنك [تكوين وحدة NGINX **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) لتحديد عناوين IP الأصلية للعملاء.

```bash
...
set_real_ip_from 23.235.32.0/20;
set_real_ip_from 43.249.72.0/22;
set_real_ip_from 103.244.50.0/24;
set_real_ip_from 103.245.222.0/23;
set_real_ip_from 103.245.224.0/24;
set_real_ip_from 104.156.80.0/20;
set_real_ip_from 146.75.0.0/16;
set_real_ip_from 151.101.0.0/16;
set_real_ip_from 157.52.64.0/18;
set_real_ip_from 167.82.0.0/17;
set_real_ip_from 167.82.128.0/20;
set_real_ip_from 167.82.160.0/20;
set_real_ip_from 167.82.224.0/20;
set_real_ip_from 172.111.64.0/18;
set_real_ip_from 185.31.16.0/22;
set_real_ip_from 199.27.72.0/21;
set_real_ip_from 199.232.0.0/16;
set_real_ip_from 2a04:4e40::/32;
set_real_ip_from 2a04:4e42::/32;

real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

قبل حفظ التكوين ، يرجى التأكد أن عناوين IP Fastly المحددة في التكوين أعلاه تتطابق مع تلك الموجودة في [وثائق Fastly](https://api.fastly.com/public-ip-list). 

### HAProxy

إذا كنت تستخدم HAProxy ، فيجب تكوين كلا الجانبين من HAProxy و Wallarm node بشكل صحيح لتحديد عناوين IP الأصلية للعملاء:

* في ملف التهيئة `/etc/haproxy/haproxy.cfg` ، أدخل السطر `option forwardfor header X-Client-IP` إلى كتلة التوجيه `backend` المسؤولة عن ربط HAProxy بـ Wallarm node.

	تخبر التوجيه `option forwardfor` موزع الحمولة HAProxy أن يجب إضافة رأس بمعرف IP العميل إلى طلب. [المزيد من التفاصيل في وثائق HAProxy](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	مثال على التكوين:

    ```
    ...
    # عنوان IP العام لتلقي الطلبات
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # الخلفية مع عقدة Wallarm
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    *   `<HAPROXY_IP>` هو عنوان IP لخادم HAProxy لتلقي طلبات العملاء.
    *   `<WALLARM_NODE_IP>` هو عنوان IP لعقدة Wallarm لتلقي الطلبات من خادم HAProxy.

* في ملف التكوين لـ NGINX المثبت مع عقدة Wallarm ، فيجب أن تكون [وحدة **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) مكونة كما يلي:

	```bash
    ...
    location / {
        wallarm_mode block;
        
        proxy_pass http://<APPLICATION_IP>;        
        set_real_ip_from <HAPROXY_IP1>;
        set_real_ip_from <HAPROXY_IP2>;
        real_ip_header X-Client-IP;
    }
    ...
    ```

    *   `<APPLICATION_IP>` هو عنوان IP للتطبيق المحمي للطلبات من عقدة Wallarm.
    *   `<HAPROXY_IP1>` و `<HAPROXY_IP2>` هما عناوين IP ل HAProxy التي تمرر الطلبات إلى عقدة Wallarm.