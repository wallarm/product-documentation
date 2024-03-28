# تكوين صفحة الحجب ورمز الخطأ (NGINX)

تتناول هذه التعليمات الطريقة لتخصيص صفحة الحجب ورمز الخطأ المرتجع في الرد على طلب تم حجبه للأسباب التالية:

* الطلب يحتوي على الحُمولات الخبيثة من الأنواع التالية: [هجمات التحقق من المدخلات](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [هجمات vpatch](../../user-guides/rules/vpatch-rule.md)، أو [الهجمات المكتشفة على أساس التعبيرات القواعدية](../../user-guides/rules/regex-rule.md).
* الطلب الذي يحتوي على الحُمولات الخبيثة من القائمة أعلاه ينشأ من [عنوان IP مُدرج في القائمة الرمادية](../../user-guides/ip-lists/overview.md) والعقدة تُصفى الطلبات في وضع الحجب الآمن [mode](../configure-wallarm-mode.md).
* الطلب ينشأ من [عنوان IP مُرفض](../../user-guides/ip-lists/overview.md).

## القيود على التكوين

يتم دعم تكوين صفحة الحجب ورمز الخطأ في تنشيطات العقدة الأساسية لـ NGINX من Wallarm ولكن لا يتم دعمه في تنشيطات العقدة الأساسية لـ Envoy و CDN. العقدة الأساسية لـ Envoy و CDN دائماً تُعيد الرمز `403` في الرد على الطلب المحجوب.

## طرق التكوين

بشكل افتراضي، يتم إعادة رمز الرد 403 وصفحة الحجب الافتراضية لـ NGINX إلى العميل. يمكنك تغيير الإعدادات الافتراضية باستخدام التوجيهات الآتية لـ NGINX:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### توجيه NGINX `wallarm_block_page`

يمكنك تكوين صفحة الحجب ورمز الخطأ بتمرير العوامل التالية في توجيه `wallarm_block_page` لـ NGINX:

* الطريق إلى ملف HTM أو HTML لصفحة الحجب. يمكنك تحديد الطريق إلى صفحة الحجب العرفية أو [صفحة الحجب النموذجية](#customizing-sample-blocking-page) المقدمة من Wallarm.
* نص الرسالة التي يتم إعادتها في الرد على طلب محجوب.
* URL لإعادة توجيه العميل.
* `response_code`: رمز الرد.
* `type`: نوع الطلب المحجوب بناءً على الذي يجب أن يتم إعادة التكوين المحدد له. العامل يقبل قيمة واحدة أو أكثر (مفصولة بفواصل) من القائمة:

    * `attack` (بشكل افتراضي): للطلبات التي تم حجبها بواسطة العقدة المُصفاة عندما تكون عقدة المُصفاة على وضع الحجب أو الحجب الآمن [mode](../configure-wallarm-mode.md).
    * `acl_ip`: للطلبات التي تنشأ من عناوين IP التي تمت إضافتها إلى [القائمة السوداء](../../user-guides/ip-lists/overview.md) ككائن منفرد أو شبكة فرعية.
    * `acl_source`: للطلبات التي تنشأ من عناوين IP التي تم تسجيلها في البلدان أو المناطق أو مراكز البيانات [المُدرجة في القائمة السوداء](../../user-guides/ip-lists/overview.md).

توجيه `wallarm_block_page` يقبل العوامل المُدرجة بالتنسيقات التالية:

* الطريق إلى ملف HTM أو HTML، رمز الخطأ (اختياري)، ونوع الطلب المحجوب (اختياري)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm تُقدم صفحة الحجب النموذجية والتي يمكنك استخدامها كنقطة بداية لتخصيصك [الخاص](#customizing-sample-blocking-page). الصفحة موجودة تحت الطريق التالي:
    
    === "المثبت الشامل، صورة AMI أو GCP، صورة Docker أساسية لـ NGINX"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "خيارات التنشيط الأخرى"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    يمكنك استخدام [متغييرات NGINX](https://nginx.org/en/docs/varindex.html) على صفحة الحجب. لذلك، أضف اسم المتغير بتنسيق `${variable_name}` إلى كود صفحة الحجب، مثل `${remote_addr}` لعرض عنوان IP الذي تنشأ منه الطلب المحجوب.

    !!! warning "معلومات مهمة لمستخدمي Debian و CentOS"
        إذا كنت تستخدم إصدار NGINX أقل من 1.11 مُثبت من [مستودعات CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md)، يجب أن تقوم بإزالة متغير `request_id` من كود الصفحة لعرض صفحة الحجب الديناميكية بشكل صحيح:
        ```
        UUID ${request_id}
        ```

        ما سبق ينطبق على كلاً من `wallarm_blocked.html` وصفحة الحجب العرفية.

    [مثال على التكوين →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* URL لإعادة توجيه العميل ونوع الطلب المحجوب (اختياري)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [مثال على التكوين →](#url-for-the-client-redirection)
* `location` مُسمى من NGINX ونوع الطلب المحجوب (اختياري)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [مثال على التكوين →](#named-nginx-location)
* اسم المتغير الذي يُعين الطريق إلى ملف HTM أو HTML، رمز الخطأ (اختياري)، ونوع الطلب المحجوب (اختياري)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "تهيئة صفحة الحجب مع متغييرات NGINX في الكود"
        إذا كنت تستخدم هذه الطريقة لتعيين صفحة الحجب مع [متغييرات NGINX](https://nginx.org/en/docs/varindex.html) في كودها، يرجى تهيئة هذه الصفحة عبر التوجيه [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path).

    [مثال على التكوين →](#variable-and-error-code)

التوجيه `wallarm_block_page` يمكن تعيينه داخل الكتل `http`، `server`، `location` من ملف تكوين NGINX.

### توجيه NGINX `wallarm_block_page_add_dynamic_path`

يستخدم التوجيه `wallarm_block_page_add_dynamic_path` لتهيئة صفحة الحجب التي تحتوي على متغييرات NGINX في كودها ويتم تعيين الطريق إلى هذه الصفحة الحاجبة أيضاً باستخدام متغير. وإلا، لا يتم استخدام التوجيه.

يمكن تعيين التوجيه داخل كتلة `http` من ملف تكوين NGINX.

## تخصيص الصفحة النموذجية للحجب

تبدو الصفحة النموذجية المُقدمة من Wallarm كالتالي:

![صفحة الحجب من Wallarm](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

يمكنك استخدام الصفحة النموذجية كنقطة بداية لتخصيصك بتعزيزها بما يلي:

* إضافة شعار شركتك – بشكل افتراضي، لا يُعرض شعار على الصفحة.
* إضافة البريد الإلكتروني لدعم شركتك – بشكل افتراضي، لا يتم استخدام روابط البريد الإلكتروني وعبارة "اتصل بنا" هي نص بسيط بدون أي رابط.
* تغيير أي عناصر HTML أخرى أو إضافة عناصرك الخاصة.

!!! info "واريانتات الصفحة العرفية للحجب"
    بدلاً من تعديل الصفحة النموذجية المُقدمة من Wallarm، يمكنك إنشاء صفحة عرفية من الصفر.

### الإجراء العام

إذا قمت بتعديل الصفحة النموذجية نفسها، قد تُفقد تعديلاتك عند تحديث مكونات Wallarm. لذلك، من الأفضل نسخ الصفحة النموذجية، إعطائها اسم جديد، ومن ثم تعديلها. تصرف بناءً على نوع التثبيت الخاص بك كما هو موضح في الأقسام أدناه.

**<a name="copy"></a>الصفحة النموذجية للنسخ**

يمكنك إنشاء نسخة من `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) الموجودة بالبيئة التي يتم فيها تثبيت عقدتك المُصفاة. كبديل، انسخ الكود أدناه واحفظه كملف جديد:

??? info "ظهر كود الصفحة النموذجية"

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>You are blocked</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins:700|Roboto|Roboto+Mono&display=swap" rel="stylesheet">
        <style>
            html {
                font-family: 'Roboto', sans-serif;
            }

            body {
                margin: 0;
                height: 100vh;
            }

            .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                min-height: 100%;
            }

            .logo {
                margin-top: 32px;
            }

            .message {
                display: flex;
                margin-bottom: 100px;
            }

            .alert {
                padding-top: 20px;
                width: 246px;
                text-align: center;
            }

            .alert-title {
                font-family: 'Poppins', sans-serif;
                font-weight: bold;
                font-size: 24px;
                line-height: 32px;
            }

            .alert-desc {
                font-size: 14px;
                line-height: 20px;
            }

            .info {
                margin-left: 76px;
                border-left: 1px solid rgba(149, 157, 172, 0.24);
                padding: 20px 0 20px 80px;
                width: 340px;
            }

            .info-title {
                font-weight: bold;
                font-size: 20px;
                line-height: 28px;
            }

            .info-text {
                margin-top: 8px;
                font-size: 14px;
                line-height: 20px;
            }

            .info-divider {
                margin-top: 16px;
            }

            .info-data {
                margin-top: 12px;
                border: 1px solid rgba(149, 157, 172, 0.24);
                border-radius: 4px;
                padding: 9px 12px;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roboto Mono', monospace;
            }

            .info-copy {
                margin-top: 12px;

                padding: 6px 12px;
                border: none;
                outline: none;
                background: rgba(149, 157, 172, 0.08);
                cursor: pointer;
                transition: 0.24s cubic-bezier(0.24, 0.1, 0.24, 1);
                border-radius: 4px;

                font-size: 14px;
                line-height: 20px;
            }

            .info-copy:hover {
                background-color: rgba(149, 157, 172, 0.24);
            }

            .info-copy:active {
                background-color: rgba(149, 157, 172, 0.08);
            }

            .info-mailto,
            .info-mailto:visited {
                color: #fc7303;
            }
        </style>
        <script>
            // Place your support email here
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Place you logo here.
                    You can use an external image:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    Or put your logo source code (like svg) right here:
                    <svg width="160" height="80"> ... </svg>
                -->
            </div>

            <div class="message">
                <div class="alert">
                    <svg width="207" height="207" viewBox="0 0 207 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M88.7512 33.2924L15.6975 155.25C14.1913 157.858 13.3943 160.816 13.3859 163.828C13.3775 166.84 14.1579 169.801 15.6494 172.418C17.141 175.035 19.2918 177.216 21.8877 178.743C24.4837 180.271 27.4344 181.092 30.4462 181.125H176.554C179.566 181.092 182.516 180.271 185.112 178.743C187.708 177.216 189.859 175.035 191.351 172.418C192.842 169.801 193.623 166.84 193.614 163.828C193.606 160.816 192.809 157.858 191.303 155.25L118.249 33.2924C116.711 30.7576 114.546 28.6618 111.963 27.2074C109.379 25.7529 106.465 24.9888 103.5 24.9888C100.535 24.9888 97.6206 25.7529 95.0372 27.2074C92.4538 28.6618 90.2888 30.7576 88.7512 33.2924V33.2924Z"
                            stroke="#F24444" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M103.5 77.625V120.75" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M103.5 146.625V146.668" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <div class="alert-title">Malicious activity blocked</div>
                    <div class="alert-desc">Your request is blocked since it was identified as a malicious one.</div>
                </div>
                <div class="info">
                    <div class="info-title">Why it happened</div>
                    <div class="info-text">
                        You might have used symbols similar to a malicious code sequence, or uploaded a specific file.
                    </div>

                    <div class="info-divider"></div>

                    <div class="info-title">What to do</div>
                    <div class="info-text">
                        If your request is considered to be legitimate, please <a id="mailto" href="" class="info-mailto">contact us</a> and provide your last action description and the following data:
                    </div>

                    <div id="data" class="info-data">
                        IP ${remote_addr}<br />
                        Blocked on ${time_iso8601}<br />
                        UUID ${request_id}
                    </div>

                    <button id="copy-btn" class="info-copy">
                        Copy details
                    </button>
                </div>
            </div>
            <div></div>
        </div>
        <script>
            // Warning: ES5 code only

            function writeText(str) {
                const range = document.createRange();

                function listener(e) {
                    e.clipboardData.setData('text/plain', str);
                    e.preventDefault();
                }

                range.selectNodeContents(document.body);
                document.getSelection().addRange(range);
                document.addEventListener('copy', listener);
                document.execCommand('copy');
                document.removeEventListener('copy', listener);
                document.getSelection().removeAllRanges();
            }

            function copy() {
                const text = document.querySelector('#data').innerText;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                }

                return writeText(text);
            }

            document.querySelector('#copy-btn').addEventListener('click', copy);

            const mailto = document.getElementById('mailto');
            if (SUPPORT_EMAIL) mailto.href = `mailto:${wallarm_dollar}{SUPPORT_EMAIL}`;
            else mailto.replaceWith(mailto.textContent);
        </script>
    </body>
    ```

**ملف نظام عام**

يمكنك إنشاء نسخة من `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) تحت اسم جديد أينما تريد (يجب أن يكون لـ NGINX الإذن بالقراءة هناك) بما في ذلك المجلد نفسه.

**حاوية Docker**

لتعديل الصفحة النموذجية للحجب أو توفير الخاصة بك من الصفر، يمكنك استخدام وظيفة [bind mount](https://docs.docker.com/storage/bind-mounts/) لـ Docker. عند استخدامها، يتم نسخ صفحتك وملف التكوين NGINX من جهازك المُضيف إلى الحاوية ومن ثم يتم الربط بمراجعة الأصول، بحيث إذا قمت بتغيير الملفات على جهازك المُضيف، ستتم مزامنة النسخ وبالعكس.

لذا، لتعديل الصفحة النموذجية للحجب أو توفير الخاصة بك، قم بما يلي:

1. قبل التشغيل الأول، [قم بإعداد](#copy) `wallarm_blocked_renamed.html` المعدل الخاص بك.
1. قم بإعداد ملف تكوين NGINX بالطريق إلى صفحتك الحاجبة. انظر [مثال التكوين](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).
1. تشغيل الحاوية [بتثبيت](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) الصفحة الحاجبة المُعدة وملف التكوين.
1. إذا كنت بحاجة إلى تحديث صفحتك الحاجبة في حاوية تعمل في وقت لاحق، على جهازك المُضيف، قم بتغيير `wallarm_blocked_renamed.html` المُرجع ثم أعد تشغيل NGINX في الحاوية.

**وحدة التحكم Ingress**

لتعديل الصفحة النموذجية للحجب أو توفير الخاصة بك، قم بما يلي:

1. [قم بإعداد](#copy) `wallarm_blocked_renamed.html` المعدل الخاص بك.
1. [إنشاء ConfigMap من الملف](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`.
1. قم بتركيب ConfigMap التي تم إنشاؤها على الوحدة `Pod` مع وحدة التحكم Ingress من Wallarm. لذلك، يرجى تحديث كائن الـ Deployment ذي الصلة بوحدة التحكم Ingress من Wallarm باتباع [التعليمات](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "الدليل لتركيب ConfigMap"
        نظرًا لأن الملفات الموجودة في الدليل المستخدم لتركيب ConfigMap يمكن أن يتم حذفها، يوصى بإنشاء دليل جديد للملفات التي تم تركيبها عبر ConfigMap.

### تعديلات متكررة

لإضافة شعار شركتك، في ملف `wallarm_blocked_renamed.html`، قم بتعديل وإلغاء التعليق:

```html
<div class="content">
    <div id="logo" class="logo">
        <!--
            Place you logo here.
            You can use an external image:
            <img src="https://example.com/logo.png" width="160" alt="Company Name" />
            Or put your logo source code (like svg) right here:
            <svg width="160" height="80"> ... </svg>
        -->
    </div>
```

لإضافة البريد الإلكتروني لدعم شركتك، في ملف `wallarm_blocked_renamed.html`، قم بتعديل متغير `SUPPORT_EMAIL`:

```html
<script>
    // Place your support email here
    const SUPPORT_EMAIL = "support@company.com";
</script>
```

إذا كنت تقوم بتهيئة متغير عرفي يحتوي على `$` في قيمة، اهرب هذا الرمز عبر إضافة `{wallarm_dollar}` قبل اسم المتغير، مثل: `${wallarm_dollar}{variable_name}`. متغير `wallarm_dollar` يُعيد `&`.

## أمثلة التكوين

أدناه هي أمثلة على تكوين صفحة الحجب ورمز الخطأ عبر التوجيهات `wallarm_block_page` و `wallarm_block_page_add_dynamic_path`.

يتم تحديد العامل `type` من التوجيه `wallarm_block_page` بشكل صريح في كل مثال. إذا قمت بإزالة العامل `type`، يتم إعادة صفحة الحجب التكوينة، الرسالة، إلخ فقط في الرد على الطلب الذي تم حجبه بواسطة العقدة المُصفاة في الوضع الحجب أو الحجب الآمن [mode](../configure-wallarm-mode.md).

### الطريق إلى الملف HTM أو HTML لصفحة الحجب ورمز الخطأ

يظهر هذا المثال الإعدادات التالية للرد:

* [الصفحة](#customizing-sample-blocking-page) النموذجية المُعدلة للحجب  `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` ورمز الخطأ 445 إذا تم حجب الطلب بواسطة العقدة المُصفاة في الوضع الحجب أو الحجب الآمن.
* صفحة الحجب العرفية `/usr/share/nginx/html/block.html` ورمز الخطأ 445 إذا تم إنشاء الطلب من أي عنوان IP مُرفض.

#### ملف تكوين NGINX

```bash
wallarm_block_page &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

لتطبيق الإعدادات على حاوية Docker، يجب تثبيت ملف التكوين NGINX بالإعدادات المناسبة على الحاوية بالإضافة إلى ملفات `wallarm_blocked_renamed.html` و `block.html`. [تشغيل الحاوية بتثبيت ملف التكوين →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### تعليقات Ingress

قبل إضافة تعليق Ingress:

1. [أنشئ ConfigMap من الملفات](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html` و `block.html`.
2. قم بتركيب ConfigMap المُنشأة على الوحدة `Pod` مع وحدة التحكم Ingress من Wallarm. لذلك، يرجى تحديث كائن الـ Deployment ذي الصلة بوحدة التحكم Ingress من Wallarm باتباع [التعليمات](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "الدليل لتركيب ConfigMap"
        نظرًا لأن الملفات الموجودة في الدليل المستخدمة لتركيب ConfigMap يمكن أن يتم حذفها، يوصى بإنشاء دليل جديد للملفات المثبتة عبر ConfigMap.
تعليقات Ingress:

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source"
```

### URL لإعادة توجيه العميل

يظهر هذا المثال إعدادات لإعادة توجيه العميل إلى الصفحة `host/err445` إذا تم حجب الطلب بواسطة العقدة المُصفاة والذي تم إنشاؤه من البلدان أو المناطق أو مراكز البيانات التي تمت إضافتها إلى القائمة السوداء.

#### ملف تكوين NGINX

```bash
wallarm_block_page /err445 type=acl_source;
```

لتطبيق الإعدادات على حاوية Docker، يجب تثبيت ملف التكوين NGINX بالإعدادات المناسبة على الحاوية. [تشغيل الحاوية بتثبيت ملف التكوين →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### تعليقات Ingress

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### `location` مُسمى من NGINX

يظهر هذا المثال الإعدادات لإعادة إلى العميل الرسالة `The page is blocked` ورمز الخطأ 445 بغض النظر عن السبب الذي يتم حجب الطلب بناءً عليه (وضع الحجب أو الحجب الآمن، الأصل مُرفض كعنصر فردي IP / شبكة فرعية / بلد أو منطقة / مركز البيانات).

#### ملف تكوين NGINX

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

لتطبيق الإعدادات على حاوية Docker، يجب تثبيت ملف التكوين NGINX بالإعدادات المناسبة على الحاوية. [تشغيل الحاوية بتثبيت ملف التكوين →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### تعليقات Ingress

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### المتغير ورمز الخطأ

يعيد هذا التكوين الرد إلى العميل إذا كان الطلب ينشأ من المصدر المُدرج في القائمة السوداء كعنصر فردي IP أو شبكة فرعية. تُعيد العقدة من Wallarm الرمز 445 وصفحة الحجب التي يعتمد محتواها على قيمة رأس `User-Agent`:

* بشكل افتراضي، يتم إعادة [الصفحة](#customizing-sample-blocking-page) النموذجية المُعدلة للحجب `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html`. نظرًا لاستخدام متغييرات NGINX في كود الصفحة الحاجبة، ينبغي تهيئة هذه الصفحة عبر التوجيه `wallarm_block_page_add_dynamic_path`.
* لمستخدمي Firefox — `/usr/share/nginx/html/block_page_firefox.html` (إذا كنت تقوم بتنشيط وحدة التحكم Ingress، يوصى بإنشاء دليل منفصل لملفات الصفحات المحجوبة العرفية، أي `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    نظرًا لاستخدام متغييرات NGINX في كود الصفحة الحاجبة، ينبغي تهيئة هذه الصفحة عبر التوجيه `wallarm_block_page_add_dynamic_path`.
* لمستخدمي Chrome — `/usr/share/nginx/html/block_page_chrome.html` (إذا كنت تقوم بتنشيط وحدة التحكم Ingress، يوصى بإنشاء دليل منفصل لملفات الصفحات المحجوبة العرفية، أي `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    نظرًا لعدم استخدام متغييرات NGINX في كود الصفحة الحاجبة، ينبغي ألا يتم تهيئة هذه الصفحة.

#### ملف تكوين NGINX

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

لتطبيق الإعدادات على حاوية Docker، يجب تثبيت ملف التكوين NGINX بالإعدادات المناسبة على الحاوية بالإضافة إلى ملفات `wallarm_blocked_renamed.html`، `block_page_firefox.html`، و `block_page_chrome.html`. [تشغيل الحاوية بتثبيت ملف التكوين →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### وحدة التحكم Ingress

1. قم بتمرير العامل `controller.config.http-snippet` إلى الرسم البياني Helm المُثبت باستخدام الأمر [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/):

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. [أنشئ ConfigMap من الملفات](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`، `block_page_firefox.html`، و `block_page_chrome.html`.
3. قم بتركيب ConfigMap المُنشأة على الوحدة `Pod` مع وحدة التحكم Ingress من Wallarm. لذلك، يرجى تحديث كائن الـ Deployment ذي الصلة بوحدة التحكم Ingress من Wallarm باتباع [التعليمات](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "الدليل لتركيب ConfigMap"
        نظرًا لأن الملفات الموجودة في الدليل المستخدمة لتركيب ConfigMap يمكن أن يتم حذفها، يوصى بإنشاء دليل جديد للملفات المثبتة عبر ConfigMap.
4. أضف التعليق التالي إلى Ingress:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```