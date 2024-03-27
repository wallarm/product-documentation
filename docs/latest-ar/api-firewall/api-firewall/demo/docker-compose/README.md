# Wallarm API Firewall ديمو باستخدام Docker Compose

هذا الديمو ينشر التطبيق [**httpbin**](https://httpbin.org/) و Wallarm API Firewall كبروكسي يحمي واجهة برمجة التطبيقات **httpbin**. كلا التطبيقين يعملان في حاويات Docker المتصلة باستخدام Docker Compose.

## متطلبات النظام

قبل تشغيل هذا الديمو، يرجى التأكد من أن نظامك يلبي المتطلبات التالية:

* Docker Engine 20.x أو أحدث مُثبت لـ [ماك](https://docs.docker.com/docker-for-mac/install/), [ويندوز](https://docs.docker.com/docker-for-windows/install/), أو [لينكس](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/) مُثبت
* **make** مُثبت لـ [ماك](https://formulae.brew.sh/formula/make), [ويندوز](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download), أو لينكس (باستخدام أدوات إدارة الحزم المناسبة)

## الموارد المستخدمة

الموارد التالية مستخدمة في هذا الديمو:

* [صورة Docker **httpbin**](https://hub.docker.com/r/kennethreitz/httpbin/)
* [صورة Docker لـ API Firewall](https://hub.docker.com/r/wallarm/api-firewall)

## وصف كود الديمو

[كود الديمو](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose) يحتوي على ملفات التكوين التالية:

* المواصفات التالية من OpenAPI 3.0 الموجودة في مجلد `volumes`:
    * `httpbin.json` هي [مواصفات **httpbin** OpenAPI 2.0](https://httpbin.org/spec.json) المحولة إلى صيغة مواصفات OpenAPI 3.0.
    * `httpbin-with-constraints.json` هي مواصفات **httpbin** OpenAPI 3.0 مع إضافة قيود API بشكل صريح.

كلا هذين الملفين سيتم استخدامهما لاختبار نشر الديمو.
* `Makefile` هو ملف التكوين الذي يحدد روتينات Docker.
* `docker-compose.yml` هو الملف الذي يحدد إعدادات صور [API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) و **httpbin** .

## الخطوة 1: تشغيل كود الديمو

لتشغيل كود الديمو:

1. استنسخ مستودع GitHub الذي يحتوي على كود الديمو:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. انتقل إلى المجلد `demo/docker-compose` للمستودع المستنسخ:

    ```bash
    cd api-firewall/demo/docker-compose
    ```
3. قم بتشغيل كود الديمو باستخدام الأمر التالي:

    ```bash
    make start
    ```

    * التطبيق **httpbin** المحمي بـ API Firewall سيكون متاحًا على http://localhost:8080.
    * التطبيق **httpbin** غير المحمي بـ API Firewall سيكون متاحًا على http://localhost:8090. عند اختبار نشر الديمو، يمكنك إرسال الطلبات إلى التطبيق غير المحمي لمعرفة الفرق.
4. انتقل إلى اختبار الديمو.

## الخطوة 2: اختبار الديمو بناءً على المواصفات الأصلية لـ OpenAPI 3.0

بشكل افتراضي، هذا الديمو يعمل مع المواصفات الأصلية لـ **httpbin** OpenAPI 3.0. لاختبار هذا الخيار من الديمو، يمكنك استخدام الطلبات التالية:

* التحقق من أن API Firewall يحجب الطلبات المرسلة إلى المسار غير المعروض:

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```

    الاستجابة المتوقعة:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* التحقق من أن API Firewall يحجب الطلبات مع قيمة نصية مرسلة في المعامل الذي يتطلب نوع بيانات عدد صحيح:

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    الاستجابة المتوقعة:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    هذه الحالة توضح أن API Firewall يحمي التطبيق من هجمات Cache-Poisoned DoS.

## الخطوة 3: اختبار الديمو بناءً على المواصفات الأشد لـ OpenAPI 3.0

أولاً، يرجى تحديث المسار إلى المواصفات OpenAPI 3.0 المستخدمة في الديمو:

1. في ملف `docker-compose.yml`, استبدل قيمة متغير البيئة `APIFW_API_SPECS` بالمسار إلى المواصفات OpenAPI 3.0 الأشد (`/opt/resources/httpbin-with-constraints.json`).
2. أعد تشغيل الديمو باستخدام الأوامر:

    ```bash
    make stop
    make start
    ```

ثم، لاختبار هذا الخيار من الديمو، يمكنك استخدام الطرق التالية:

* التحقق من أن API Firewall يحجب الطلبات مع معامل الاستعلام `int` الذي لا يطابق التعريف التالي:

    ```json
    ...
    {
      "in": "query",
      "name": "int",
      "schema": {
        "type": "integer",
        "minimum": 10,
        "maximum": 100
      },
      "required": true
    },
    ...
    ```

    اختبر التعريف باستخدام الطلبات التالية:

    ```bash
    # الطلب مع عدم وجود معامل الاستعلام الضروري
    curl -sD - http://localhost:8080/get

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    # الطلب مع قيمة معامل int التي تقع ضمن النطاق الصالح
    curl -sD - http://localhost:8080/get?int=15

    # الاستجابة المتوقعة
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...

    # الطلب مع قيمة معامل int التي تتجاوز النطاق
    curl -sD - http://localhost:8080/get?int=5

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # الطلب مع قيمة معامل int التي تتجاوز النطاق
    curl -sD - http://localhost:8080/get?int=1000

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # الطلب مع قيمة معامل int التي تتجاوز النطاق
    # إمكانية الشر: يمكن أن يؤدي الإفراط في حدود الأعداد الصحيحة المكونة من 8 بايت إلى استجابة بإسقاط الstack
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* التحقق من أن API Firewall يحجب الطلبات مع معامل الاستعلام `str` الذي لا يطابق التعريف التالي:

    ```json
    ...
    {
      "in": "query",
      "name": "str",
      "schema": {
        "type": "string",
        "pattern": "^.{1,10}-\\d{1,10}$"
      }
    },
    ...
    ```

    اختبر التعريف باستخدام الطلبات التالية (معامل `int` ما زال ضروريًا):

    ```bash
    # الطلب مع قيمة معامل str التي لا تطابق التعبير النظامي المحدد
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # الطلب مع قيمة معامل str التي لا تطابق التعبير النظامي المحدد
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # الطلب مع قيمة معامل str التي تطابق التعبير النظامي المحدد
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # الاستجابة المتوقعة
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # الطلب مع قيمة معامل str التي لا تطابق التعبير النظامي المحدد
    # إمكانية الشر: الحقن بأوامر SQL
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## الخطوة 4: إيقاف كود الديمو

لإيقاف نشر الديمو وتنظيف بيئتك، استخدم الأمر:

```bash
make stop
```