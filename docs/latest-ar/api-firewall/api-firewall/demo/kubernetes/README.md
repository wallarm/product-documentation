# عرض توضيحي لجدار الحماية الخاص بواجهة برمجة التطبيقات في Wallarm مع Kubernetes

يقوم هذا العرض التوضيحي بنشر التطبيق [**httpbin**](https://httpbin.org/) وجدار الحماية الخاص بواجهة برمجة التطبيقات في Wallarm كوكيل يحمي واجهة برمجة التطبيقات **httpbin**. كلا التطبيقين يعملان في حاويات Docker داخل Kubernetes.

## متطلبات النظام

قبل تشغيل هذا العرض التوضيحي، يرجى التأكد من أن نظامك يلبي المتطلبات التالية:

* Docker Engine 20.x أو أحدث مُثبت لـ [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/), أو [Linux](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/) مُثبت
* **make** مُثبت لـ [Mac](https://formulae.brew.sh/formula/make), [Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download), أو Linux (باستخدام أدوات إدارة الحزم المناسبة)

يمكن أن يكون تشغيل هذا البيئة التوضيحية كثيف الموارد. يرجى التأكد من توفر الموارد التالية:

* على الأقل 2 نواة CPU
* على الأقل 6GB من الذاكرة المتقلبة

## الموارد المستخدمة

تُستخدم الموارد التالية في هذا العرض التوضيحي:

* [صورة Docker **httpbin**](https://hub.docker.com/r/kennethreitz/httpbin/)
* [صورة Docker لجدار الحماية API](https://hub.docker.com/r/wallarm/api-firewall)

## وصف رمز العرض التوضيحي

يقوم [رمز العرض التوضيحي](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes) بتشغيل مجموعة Kubernetes مع نشر **httpbin** وجدار الحماية لواجهة برمجة التطبيقات.

لتشغيل مجموعة Kubernetes، يستخدم هذا العرض التوضيحي الأداة [**kind**](https://kind.sigs.k8s.io/) التي تسمح بتشغيل مجموعة K8s في دقائق باستخدام حاويات Docker كعقد. من خلال استخدام عدة طبقات من التجريد، يتم تعبئة **kind** واعتماداته في صورة Docker التي تقوم ببدء مجموعة Kubernetes.

يتم تكوين النشر التوضيحي عبر الدلائل/الملفات التالية:

* تقع مواصفات OpenAPI 3.0 لواجهة برمجة التطبيقات **httpbin** في الملف `volumes/helm/api-firewall.yaml` تحت مسار `manifest.body`. باستخدام هذه المواصفات، سيقوم جدار الحماية API بالتحقق من مطابقة الطلبات والاستجابات المُرسلة إلى عنوان التطبيق لمخطط واجهة برمجة التطبيقات.

    لا تحدد هذه المواصفات [مخطط واجهة برمجة التطبيقات الأصلي لـ **httpbin**](https://httpbin.org/spec.json). لتوضيح ميزات جدار الحماية API بشكل أكثر شفافية، قمنا بتحويل وتعقيد المخطط الأصلي لـ OpenAPI 2.0 وحفظ التخصيص في `volumes/helm/api-firewall.yaml` > `manifest.body`.
* `Makefile` هو الملف التكويني الذي يحدد إجراءات Docker.
* `docker-compose.yml` هو الملف الذي يحدد التكوين التالي لتشغيل مجموعة Kubernetes الزمنية:

    * بناء عقدة [**kind**](https://kind.sigs.k8s.io/) بناءً على [`docker/Dockerfile`](https://github.com/wallarm/api-firewall/blob/main/demo/kubernetes/docker/Dockerfile).
    * نشر خادم DNS لتوفير اكتشاف الخدمة لـ Kubernetes وDocker في وقت واحد.
    * نشر السجل المحلي لـ Docker وخدمة `dind`.
    * تكوين صور [جدار الحماية API Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) و**httpbin**.
  
## الخطوة 1: تشغيل رمز العرض التوضيحي

لتشغيل رمز العرض التوضيحي:

1. استنسخ مستودع GitHub الذي يحتوي على رمز العرض التوضيحي:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. تغيير إلى دليل `demo/kubernetes` في المستودع المستنسخ:

    ```bash
    cd api-firewall/demo/kubernetes
    ```
3. تشغيل رمز العرض التوضيحي باستخدام الأمر أدناه. يرجى ملاحظة أن تشغيل هذا العرض التوضيحي يمكن أن يكون كثيف الموارد. يستغرق الأمر حتى 3 دقائق لبدء بيئة العرض التوضيحي.

    ```bash
    make start
    ```

    * سيكون التطبيق **httpbin** المحمي بواسطة جدار الحماية API متوفرًا على http://localhost:8080.
    * سيكون التطبيق **httpbin** غير المحمي بواسطة جدار الحماية API متوفرًا على http://localhost:8090. عند اختبار النشر التوضيحي، يمكنك إرسال طلبات إلى التطبيق غير المحمي لمعرفة الفرق.
4. الانتقال إلى اختبار العرض التوضيحي.

## الخطوة 2: اختبار العرض التوضيحي

باستخدام الطلب التالي، يمكنك اختبار جدار الحماية API المنشور:

* تحقق من أن جدار الحماية API يحظر الطلبات المُرسلة إلى المسار غير المعرض:

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
* تحقق من أن جدار الحماية API يحظر الطلبات التي تحتوي على قيمة سلسلة مُمرة في المعلمة التي تتطلب نوع بيانات عدد صحيح:

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

    يوضح هذا الحالة أن جدار الحماية API يحمي التطبيق من هجمات Cache-Poisoned DoS.
* تحقق من أن جدار الحماية API يحظر الطلبات التي تحتوي على معلمة الاستعلام `int` التي لا تتطابق مع التعريف التالي:

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
    # طلب بمعلمة استعلام مفقودة مطلوبة
    curl -sD - http://localhost:8080/get

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # طلب بقيمة معلمة int الذي يقع ضمن نطاق صالح
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


    # طلب بقيمة معلمة int الذي يخرج عن النطاق
    curl -sD - http://localhost:8080/get?int=5

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # طلب بقيمة معلمة int الذي يخرج عن النطاق
    curl -sD - http://localhost:8080/get?int=1000

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # طلب بقيمة معلمة int الذي يخرج عن النطاق
    # إمكانية الشر: قد يؤدي الفائض لعدد صحيح مكون من 8 بايت إلى رد بإسقاط المكدس
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* تحقق من أن جدار الحماية API يحظر الطلبات التي تحتوي على معلمة الاستعلام `str` التي لا تتطابق مع التعريف التالي:

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

    اختبر التعريف باستخدام الطلبات التالية (لا يزال المعلم `int` مطلوبًا):

    ```bash
    # طلب بقيمة معلمة str التي لا تتطابق مع التعبير النظامي المحدد
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # طلب بقيمة معلمة str التي لا تتطابق مع التعبير النظامي المحدد
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # طلب بقيمة معلمة str التي تتطابق مع التعبير النظامي المحدد
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


    # طلب بقيمة معلمة str التي لا تتطابق مع التعبير النظامي المحدد
    # إمكانية الشر: حقن SQL
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # الاستجابة المتوقعة
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## الخطوة 4: إيقاف تشغيل رمز العرض التوضيحي

لإيقاف نشر العرض التوضيحي وتنظيف بيئتك، استخدم الأمر:

```bash
make stop
```