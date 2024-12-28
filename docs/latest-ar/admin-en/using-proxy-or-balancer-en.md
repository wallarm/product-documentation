# تحديد عنوان IP الأصلي للعميل عند استخدام وكيل HTTP أو موزع الحمولة (NGINX)

تصف هذه التعليمات التجهيزات الضرورية لتهيئة NGINX لتحديد عنوان IP الأصلي لعميل يتصل بخوادمك من خلال وكيل HTTP أو موزع حمولة.

* إذا تم تثبيت وحدة Wallarm من الحزم DEB / RPM ، AWS / GCP images أو صورة Docker المستندة على NGINX ، يرجى استخدام **التعليمات الحالية** .
* إذا تم نشر الوحدة  Wallarm كمراقب الدخول K8s  ، يرجى استخدام [هذه التعليمات](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

## كيف تحدد الوحدة Wallarm عنوان IP للطلب

تقرأ الوحدة Wallarm عنوان IP المصدر للطلب من المتغير NGINX `$remote_addr`. إذا مر الطلب عبر خادم الوكيل أو موزع الحمولة قبل إرساله إلى الوحدة ، فيحتفظ المتغير `$remote_addr` بعنوان IP لخادم الوكيل أو  موزع الحمولة.

![استخدام الموزع](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

يتم عرض عنوان IP الأصلي للطلب الذي تم تحديده بواسطة وحدة Wallarm في [تفاصيل الهجوم](../user-guides/events/check-attack.md#attacks) في لوحة التحكم Wallarm.

## المشاكل الممكنة عند استخدام عنوان IP لخادم وكيل أو موزع حمولة كعنوان مصدر للطلب

إذا اعتبرت الوحدة Wallarm أن عنوان IP الخادم الوكيل أو موزع الحمولة هو عنوان IP المصدر للطلب ، فقد تعمل الميزات التالية لـ Wallarm بشكل غير صحيح:

* [التحكم في الوصول إلى التطبيقات بناءً على عناوين IP](../user-guides/ip-lists/overview.md) ، على سبيل المثال:

   إذا تم رفض الوصول لعناوين IP العملاء الأصلية ، فإن الوحدة Wallarm لن تكتفي بمنع الطلبات المنشأة من هذه العناوين حيث تعتبر أن عنوان IP موزع الحمولة هو عنوان المصدر.
* [حماية من الهجمات القوية](configuration-guides/protecting-against-bruteforce.md) ، على سبيل المثال:

    إذا كانت الطلبات التي تمر عبر موزع الحمولة تحتوي على علامات هجوم قوية ، فسوف تضيف Wallarm هذا العنوان IP إلى قائمة الرفض وبالتالي ستمنع جميع الطلبات اللاحقة التي تعبر عبر هذا الموزع.
* النموذج [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) و [Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ، على سبيل المثال:

    ستعتبر Wallarm أن عنوان IP الموزع هو [عنوان IP المنشئ للهجمات الاختبار](../admin-en/scanner-addresses.md) التي تم إنشاؤها بواسطة  Threat Replay Testing module و Vulnerability Scanner. وبالتالي، سيتم عرض الهجمات الاختبار في لوحة التحكم Wallarm كهجمات نشأت من عنوان IP للموزع وسيتم التحقق منها إضافياً من Wallarm مما سيؤدي إلى إنشاء حمولة إضافية على التطبيق.

إذا كانت الوحدة Wallarm متصلة عبر [IPC socket](https://en.wikipedia.org/wiki/Unix_domain_socket)، فيعتبر `0.0.0.0` كمصدر للطلب.

## التهيئة لتحديد عنوان IP العميل الأصلي

لتكوين تحديد عنوان IP العميل الأصلي، يمكنك استخدام [NGINX module **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html). يسمح هذا الوحدة بإعادة تعريف قيمة `$remote_addr` [المستخدمة](#how-wallarm-node-identifies-an-ip-address-of-a-request) بواسطة وحدة Wallarm للحصول على عنوان IP العميل.

يمكنك استخدام وحدة NGINX **ngx_http_realip_module** في أحد الطرق التالية:

* لقراءة عنوان IP العميل الأصلي من رأس محدد (عادة، [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) تمت إضافته إلى الطلب بواسطة موزع الحمولة أو خادم الوكيل.
* إذا كان موزع الحمولة أو خادم الوكيل يدعم بروتوكول [PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)، يمكنك قراءة عنوان IP العميل الأصلي من الرأس `PROXY`.

### تكوين NGINX لقراءة رأس `X-Forwarded-For` (`X-Real-IP` أو مماثل)

إذا قمت بإضافة موزع الحمولة أو خادم الوكيل الرأس `X-Forwarded-For` (`X-Real-IP` أو ما شابه) الذي يحتوي على عنوان IP العميل الأصلي ، يرجى تهيئة الوحدة NGINX **ngx_http_realip_module** لقراءة هذا الرأس على النحو التالي:

1. افتح الملف التالي لإعدادات NGINX المثبتة مع الوحدة Wallarm:

    * `/etc/nginx/conf.d/default.conf`  إذا تم تثبيت الوحدة Wallarm من الحزم DEB / RPM أو كمثبت كل في واحد.
    * `/etc/nginx/nginx.conf` إذا تم نشر الوحدة Wallarm من صورة AWS / GCP.
    * إذا تم نشر الوحدة Wallarm من صورة Docker المستندة على NGINX، فيجب أن تقوم بإنشاء وتعديل ملف التهيئة NGINX محليا وتركيبه على الحاوية Docker على المسار `/etc/nginx/sites-enabled/default`. يمكنك نسخ ملف التهيئة الأولي NGINX والحصول على التعليمات على تركيب الملف على الحاوية من [تعليمات Docker المستندة على Wallarm NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. في سياق `location` في NGINX أو أعلى ، أضف التوجيه `set_real_ip_from` مع عنوان IP لخادم الوكيل أو موزع الحمولة. إذا كان للوكيل أو موزع الحمولة عدة عناوين IP ، يرجى إضافة عدد منفصل من التوجيهات المناسبة. على سبيل المثال:
        
    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
2. في وثائق التعليمات المرفقة مع موزع الحمولة المستخدم ، ابحث عن اسم الرأس المضاف بواسطة موزع الحمولة هذا لتمرير عنوان IP العميل الأصلي. في الغالب ، يسمى الرأس `X-Forwarded-For`.
3. في سياق `location` في NGINX أو أعلى ، أضف التوجيه `real_ip_header` مع اسم الرأس الذي تم العثور عليه في الخطوة السابقة. على سبيل المثال:

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
4. أعد تشغيل NGINX:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

    سيقوم NGINX بتعيين قيمة الرأس المحددة في التوجيه `real_ip_header` إلى المتغير `$remote_addr` ، لذا ستقرأ الوحدة Wallarm عناوين IP العملاء الأصلية من هذا المتغير.
5. [اختبر التهيئة](#testing-the-configuration).

### تكوين NGINX لقراءة الرأس `PROXY`

إذا كان موزع الحمولة أو خادم الوكيل يدعم بروتوكول [PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)، يمكنك تكوين الوحدة NGINX **ngx_http_realip_module** لقراءة الرأس `PROXY` على النحو التالي:

1. افتح الملف التالي لإعدادات NGINX المثبتة مع الوحدة Wallarm:

   * `/etc/nginx/conf.d/default.conf`  إذا تم تثبيت الوحدة Wallarm من الحزم DEB / RPM أو كمثبت كل في واحد.
    * `/etc/nginx/nginx.conf` إذا تم نشر الوحدة Wallarm من صورة AWS / GCP.
    * إذا تم نشر الوحدة Wallarm من صورة Docker المستندة على NGINX، فيجب أن تقوم بإنشاء وتعديل ملف التهيئة NGINX محليا وتركيبه على الحاوية Docker على المسار `/etc/nginx/sites-enabled/default`. يمكنك نسخ ملف التهيئة الأولي NGINX والحصول على التعليمات على تركيب الملف على الحاوية من [تعليمات Docker المستندة على Wallarm NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. في سياق `server` بـ NGINX ، أضف البارامتر `proxy_protocol` إلى التوجيه `listen`.
3. في سياق `location` في NGINX أو أعلى ، أضف التوجيه `set_real_ip_from` مع عنوان IP لخادم الوكيل أو موزع الحمولة. إذا كان للوكيل أو موزع الحمولة عدة عناوين IP ، الرجاء إضافة عدد منفصل من التوجيهات المناسبة.
4. في سياق `location` في NGINX أو أعلى ، أضف التوجيه `real_ip_header` بقيمة `proxy_protocol`.
     مثال على ملف تكوين NGINX مع جميع التوجيهات التي تمت إضافتها:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * يستمع NGINX للاتصالات الواردة على المنفذ 80.
    * إذا لم يتم تمرير الرأس `PROXY` في الطلب الوارد ، لا يقبل NGINX هذا الطلب لأنه يعتبر غير صالح.
    * بالنسبة للطلبات التي تم إنشاؤها من العنوان `<IP_ADDRESS_OF_YOUR_PROXY>`، سيقوم NGINX بتعيين العنوان المصدر الذي تم تمريره في الرأس `PROXY` إلى المتغير `$remote_addr` ، لذا ستقرأ الوحدة Wallarm عناوين IP العملاء الأصلية من هذا المتغير.
5. أعد تشغيل NGINX:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
6. [اختبر التهيئة](#testing-the-configuration).

لإضافة عنوان IP العميل الأصلي في السجلات، يجب عليك إضافة التوجيه `proxy_set_header` وتعديل قائمة المتغيرات في التوجيه `log_format` في تهيئة NGINX كما هو موضح في [تعليمات تسجيل  NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address).

المزيد من التفاصيل حول تحديد عنوان IP العميل الأصلي بناءً على الرأس `PROXY` متاحة في [وثائق  NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address).

### اختبار التهيئة

1. أرسل الهجوم التجريبي إلى عنوان التطبيق المحمي:

    === "Using cURL"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "Using printf and Netcat (for the header `PROXY`)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. افتح لوحة التحكم Wallarm وتأكد من أن عنوان IP العميل الأصلي يظهر في تفاصيل الهجوم:

    ![عنوان IP منشئ الطلب](../images/request-ip-address.png)

  إذا قرأ NGINX العنوان الأصلي من الرأس `X-Forwarded-For` (`X-Real-IP` أو ما شابه) ، سيتم أيضاً عرض قيمة الرأس في الهجوم الأصلي.

    ![رأس X-Forwarded-For](../images/x-forwarded-for-header.png)

## أمثلة على التهيئة

أدناه ستجد أمثلة التكوين الضروري لـ NGINX لتحديد عنوان IP العميل الأصلي الذي يتصل بخوادمك عبر شبكات موزعو الحمولة الشائعة.

### Cloudflare CDN

عند استخدام Cloudflare CDN، يمكنك [تكوين وحدة NGINX **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) لتحديد عناوين IP العملاء الأصلية.

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

* قبل حفظ التهيئة ، يرجى التأكد من أن عناوين IP لـ Cloudflare المحددة في التهيئة أعلاه تطابق تلك الموجودة في [وثائق Cloudflare](https://www.cloudflare.com/ips/). 
* يمكنك تحديد `CF-Connecting-IP` أو `X-Forwarded-For` كقيمة لتوجيه `real_ip_header`. يقوم Cloudflare CDN بإرفاق كلا الرأسين ويمكنك تكوين NGINX لقراءة أي منهما. [المزيد من التفاصيل في Cloudflare CDN](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

اذا تم استخدام Fastly CDN، يمكنك [تكوين وحدة NGINX **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) لتحديد عناوين IP العملاء الأصلية.

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

قبل حفظ التهيئة ، يرجى التأكد من أن عناوين IP لـ Fastly المحددة في التهيئة أعلاه تطابق تلك الموجودة في [وثائق Fastly](https://api.fastly.com/public-ip-list).

### HAProxy

عند استخدام HAProxy، يجب تكوين كلا من جوانب HAProxy والوحدة Wallarm بشكل صحيح لتحديد عناوين IP العملاء الأصلية :

* في ملف التهيئة `/etc/haproxy/haproxy.cfg`، أدخل السطر `option forwardfor header X-Client-IP` بناءً على حديدة `backend` المسئولة عن ربط HAProxy بالوحدة Wallarm.

 يخبر توجيه `option forwardfor` الخادم  HAProxy بأن الرأس يجب أن يتم إضافته مع عنوان IP العميل الى الطلب. [المزيد من التفاصيل في  وثائق HAProxy](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

     مثال تكوين:

    ```
    ...
    # عنوان IP العام لاستقبال الطلبات
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # الخلفية مع وحدة Wallarm
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    * `<HAPROXY_IP>` هو عنوان IP لخادم HAProxy لاستقبال طلبات العملاء.
    * `<WALLARM_NODE_IP>` هو عنوان IP للوحدة Wallarm لاستقبال الطلبات من خادم HAProxy.

* في ملف التهيئة لـ NGINX المثبتة مع الوحدة Wallarm ، قم بتكوين [وحدة **ngx_http_realip_module**](#configuring-nginx-to-read-the-header-x-forwarded-for-x-real-ip-or-a-similar) على النحو التالي:
    
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

    * `<APPLICATION_IP>` هو عنوان IP للتطبيق المحمي للطلبات من الوحدة Wallarm.
    * `<HAPROXY_IP1>` و `<HAPROXY_IP2>` هي عناوين IP لموزعو الحمولة HAProxy الذين يمرون الطلبات إلى الوحدة Wallarm.