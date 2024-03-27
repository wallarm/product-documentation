# تشغيل جدار الواجهة البرمجية (API Firewall) على Docker لـ REST API

توفر هذه الدليل خطوات التنزيل والتثبيت وبدء تشغيل [جدار الواجهة البرمجية من Wallarm](../index.md) على Docker للتحقق من صحة طلبات REST API.

## المتطلبات

* [Docker مثبت ومعرف](https://docs.docker.com/get-docker/)
* [مواصفات OpenAPI 3.0](https://swagger.io/specification/) مطورة لـ REST API للتطبيق الذي يجب حمايته بواسطة جدار الواجهة البرمجية من Wallarm

## الطرق لتشغيل جدار الواجهة البرمجية على Docker

الطريقة الأسرع لنشر جدار الواجهة البرمجية على Docker هي [Docker Compose](https://docs.docker.com/compose/). تعتمد الخطوات أدناه على استخدام هذه الطريقة.

إذا كان من الضروري، يمكنك أيضًا استخدام `docker run`. قدمنا أوامر `docker run` المناسبة لنشر نفس البيئة في [هذا القسم](#using-docker-run-to-start-api-firewall).

## الخطوة 1. إنشاء الملف `docker-compose.yml`

لنشر جدار الواجهة البرمجية والبيئة المناسبة باستخدام Docker Compose ، أنشئ أولاً **docker-compose.yml** بالمحتوى التالي:

```yml
version: '3.8'

networks:
  api-firewall-network:
    name: api-firewall-network

services:
  api-firewall:
    container_name: api-firewall
    image: wallarm/api-firewall:v0.6.13
    restart: on-failure
    volumes:
      - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    environment:
      APIFW_API_SPECS: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_RESPONSE_VALIDATION: <RESPONSE_VALIDATION_MODE>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: kennethreitz/httpbin
    restart: on-failure
    ports:
      - 8090:8090
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## الخطوة 2. تكوين الشبكة Docker

إذا كان الأمر ضروريًا، قم بتغيير تكوين [شبكة Docker](https://docs.docker.com/network/) المحدد في **docker-compose.yml** → `networks`.

**docker-compose.yml** الموفر يأمر Docker بإنشاء الشبكة `api-firewall-network` وربط التطبيق وحاويات جدار الواجهة البرمجية بها.

يوصى باستخدام شبكة Docker مستقلة للسماح لتطبيق الحاوية وجدار الواجهة البرمجية بالتواصل دون ربط يدوي.

## الخطوة 3. تكوين التطبيق ليحمى بواسطة  جدار الواجهة البرمجية

قم بتغيير تكوين التطبيق الموجود في حاوية ليتم حمايته بواسطة جدار الواجهة البرمجية. يتم تعريف هذا التكوين في **docker-compose.yml** → `services.backend`.

**docker-compose.yml** المقدم يأمر Docker ببدء حاوية Docker [kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) المتصلة بـ `api-firewall-network` والمعينة إلى [اسم الشبكة](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) `backend`. الشبكة تتصل بالمنفذ 8090.

إذا كنت تقوم بتكوين تطبيقك الخاص، فقم بتعريف الإعدادات المطلوبة فقط لبدء حاوية التطبيق الصحيحة. لا يلزم أي تكوين محدد لجدار الواجهة البرمجية.

## الخطوة 4. تكوين جدار الواجهة البرمجية

أدرج تكوين جدار الواجهة البرمجية في **docker-compose.yml** → `services.api-firewall` على النحو التالي:

**مع `services.api-firewall.volumes`** ، يرجى توصيل مواصفات [OpenAPI 3.0](https://swagger.io/specification/) بدليل حاوية جدار الواجهة البرمجية:
    
* `<HOST_PATH_TO_SPEC>`: المسار إلى مواصفات OpenAPI 3.0 لـ REST API التطبيق الخاص بك الموجود على الجهاز المضيف. تنسيقات الملفات المقبولة هي YAML و JSON (امتدادات الملف `.yaml`, `.yml`, `.json`). على سبيل المثال: `/opt/my-api/openapi3/swagger.json`.
* `<CONTAINER_PATH_TO_SPEC>`: المسار إلى دليل الحاوية حيث يتم توصيل مواصفات OpenAPI 3.0. على سبيل المثال: `/api-firewall/resources/swagger.json`.

**مع `services.api-firewall.environment`** ، يرجى تعيين الإعدادات العامة لجدار الواجهة البرمجية من خلال المتغيرات البيئية التالية:

| متغير البيئة| وصف | ضركري؟ |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| <a name="apifw-api-specs"></a>`APIFW_API_SPECS`                 | المسار إلى مواصفات OpenAPI 3.0. هناك العديد من الطرق لتحديد المسار:<ul><li>المسار إلى ملف المواصفات الموجود في الحاوية ، على سبيل المثال: `/api-firewall/resources/swagger.json`. عند تشغيل الحاوية ، قم بتوصيل هذا الملف بالخيار `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`.</li><li>عنوان URL لملف المواصفات ، على سبيل المثال: `https://example.com/swagger.json`. عند تشغيل الحاوية ، تجاهل الخيار `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`.</li></ul>                                                                                                                                                                                                                                                                    | نعم       |
| `APIFW_URL`                       | عنوان URL لجدار الواجهة البرمجية. على سبيل المثال: `http://0.0.0.0:8088/`. يجب أن يكون قيمة المنفذ مطابقة لمنفذ الحاوية المنشور للمضيف.<br><br>إذا كانت جدار الواجهة البرمجية يستمع إلى بروتوكول HTTPS ، يرجى توصيل الشهادة والمفتاح الخاص المولد SSL/TLS بالحاوية ، وتمرير إعدادات SSL/TLS جدار الواجهة البرمجية ** المذكورة أدناه إلى الحاوية.   | نعم       |
| `APIFW_SERVER_URL`                | عنوان URL الخاص بالتطبيق الموصوف في مواصفات OpenAPI الجبلية والتي يجب حمايتها بواسطة جدار الواجهة البرمجية. على سبيل المثال: `http://backend:80`.  | نعم       |
| `APIFW_REQUEST_VALIDATION`        | الوضع الذي يتعامل فيه جدار الواجهة البرمجية عند التحقق من صحة الطلبات المرسلة إلى عنوان URL التطبيق:<ul><li>`BLOCK` لحظر وتسجيل الطلبات التي لا تتطابق مع المخطط الموفر في مواصفات OpenAPI 3.0 الموجودة (سيتم إرجاع الرد `403 Forbidden` إلى الطلبات المحظورة). يتم إرسال السجلات إلى [خدمات `STDOUT` و `STDERR` Docker ](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` لتسجيل الطلبات التي لا تتطابق مع المخطط الموفر في مواصفات OpenAPI 3.0 الموجودة ولكن دون حظرها. يتم إرسال السجلات إلى [خدمات `STDOUT` و `STDERR` Docker ](https://docs.docker.com/config/containers/logging/).</li><li>`DISABLE` لتعطيل التحقق من صحة الطلب.</li></ul>         | نعم       |
| `APIFW_RESPONSE_VALIDATION`       | الوضع الذي يتعامل فيه جدار الواجهة البرمجية عند التحقق من صحة استجابات التطبيق على الطلبات الواردة:<ul><li>`BLOCK` لحظر الطلب وتسجيله إذا لم تكن الاستجابة الخاصة بالتطبيق على هذا الطلب تتوافق مع المخطط الموفر في مواصفات OpenAPI 3.0 الموجودة. سيتم توصيل هذا الطلب إلى عنوان URL التطبيق ولكن العميل سوف يتلقى الرد `403 Forbidden`. يتم إرسال السجلات إلى [خدمات `STDOUT` و `STDERR` Docker ](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` لتسجيل الطلب ولكن دون حظره إذا لم تكن الاستجابة الخاصة بالتطبيق على هذا الطلب تتوافق مع المخطط الموفر في مواصفات OpenAPI 3.0 الموجودة. يتم إرسال السجلات إلى [خدمات `STDOUT` و `STDERR` Docker ](https://docs.docker.com/config/containers/logging/).</li><li>`DISABLE` لتعطيل التحقق من صحة الطلب.</li></ul> | نعم       |
| `APIFW_LOG_LEVEL`                 | مستوى تسجيل جدار الواجهة البرمجية. القيم الممكنة:<ul><li>`DEBUG` لتسجيل أحداث من أي نوع (INFO و ERROR و WARNING و DEBUG).</li><li>`INFO` لتسجيل أحداث من أنواع INFO و WARNING و ERROR.</li><li>`WARNING` لتسجيل أحداث من أنواع WARNING و ERROR.</li><li>`ERROR` لتسجيل أحداث من نوع ERROR فقط.</li><li>`TRACE` لتسجيل الطلبات الواردة واستجابات جدار الواجهة البرمجية ، بما في ذلك المحتوى.</li></ul> القيمة الافتراضية هي `DEBUG`. السجلات على الطلبات والاستجابات التي لا تتوافق مع المخطط المقدم لها نوع ERROR.    | لا        |
| <a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | [رمز الرد HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) الذي يتم إرجاعه بواسطة جدار الواجهة البرمجية الذي يعمل في وضع `BLOCK` إذا لم يتطابق الطلب أو الرد مع المخطط الموجود في مواصفات OpenAPI 3.0 الموجودة. القيمة الافتراضية هي `403`. | لا |
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(تجريبي) | عبارة عن ما إذا كان سيتم إرجاع الرد `Apifw-Validation-Status` الذي يحتوي على سبب حظر الطلب في الرد على هذا الطلب. يمكن أن يكون القيمة `true` أو `false`. القيمة الافتراضية هي `false`.| لا |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | إذا تم تعيينها على `true`، سيتم حذف رد `Accept-Encoding` من الطلبات الموجهة. القيمة الافتراضية عبارة عن `false`. | لا|
| `APIFW_LOG_FORMAT` | تنسيق سجلات جدار الواجهة البرمجية. يمكن أن يكون القيمة `TEXT` أو `JSON`. القيمة الافتراضية هي `TEXT`. | لا|
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(فقط إذا كان جدار الواجهة البرمجية يعمل في وضع `LOG_ONLY` لكلا من الطلبات والاستجابات) | [رموز الرد HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) التي تشير إلى أن النقطة النهائية للواجهة البرمجية المطلوبة التي لم تتضمن في المواصفات ليست الظل. يمكنك تحديد عدة أكواد حالة مفصولة بفاصلة منقوطة (مثل `404;401`). القيمة الافتراضية هي `404`.<br><br> بشكل افتراضي، يشير جدار الواجهة البرمجية الذي يعمل في الوضع `LOG_ONLY` لكلا من الطلبات والاستجابات إلى جميع النقاط النهائية التي لم تتضمن في المواصفات والتي تعيد الرمز المتميز عن "404" كظل. | لا |
| `APIFW_MODE` | تعيين الوضع العام لجدار الواجهة البرمجية. القيم الممكنة القيم الممكنة هي `PROXY` (الافتراضي)، [`graphql`](graphql/docker-container.md) و [`API`](api-mode.md). | لا|
| `APIFW_PASS_OPTIONS` | عند تعيينه على `true`، يسمح جدار الواجهة البرمجية بطلبات `OPTIONS` إلى النقاط النهائية في المواصفات، حتى إذا لم يتم وصف طريقة `OPTIONS`. القيمة الافتراضية هي `false`. | لا |
| `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` | يحدد ما إذا كانت الطلبات يتم تمييزها على أنها لا تتطابق مع المواصفات إذا كانت العوامل الخاصة بها لا تتوافق مع تلك المحددة في المواصفات OpenAPI. القيمة الافتراضية هي `true`.<br><br> إذا كنت تقوم بتشغيل جدار الواجهة البرمجية في وضع [`API`](api-mode.md)، يحصل هذا المتغير على اسم مختلف `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION`. | لا |

**مع `services.api-firewall.ports` و `services.api-firewall.networks`** ، حدد منفذ حاوية جدار الواجهة البرمجية وقم بتوصيل الحاوية بالشبكة التي تم إنشاؤها. يأمر **docker-compose.yml** الموفر Docker ببدء تشغيل جدار الواجهة البرمجية المتصل بشبكة `api-firewall-network` [الشبكة](https://docs.docker.com/network/) على المنفذ 8088.

## الخطوة 5. نشر البيئة المكونة

لبناء وبدء تشغيل البيئة المكونة، قم بتشغيل الأمر التالي:

```bash
docker-compose up -d --force-recreate
```

للتحقق من خرج السجل:

```bash
docker-compose logs -f
```

## الخطوة 6. اختبار تشغيل جدار الواجهة البرمجية

لاختبار تشغيل جدار الواجهة البرمجية، أرسل الطلب الذي لا يتطابق مع مواصفات Open API 3.0 الموجودة إلى عنوان حاوية Docker لجدار الواجهة البرمجية. على سبيل المثال، يمكنك تمرير القيمة النصية في المعلمة التي تتطلب القيمة الصحيحة.

إذا لم يتطابق الطلب مع مخطط الواجهة البرمجية المقدمة، سيتم إضافة رسالة الخطأ ERROR المناسبة إلى سجلات حاوية Docker لجدار الواجهة البرمجية.

## الخطوة 7. تمكين المرور على جدار الواجهة البرمجية

لإتمام تكوين جدار الواجهة البرمجية، يرجى تمكين المرور الوارد على جدار الواجهة البرمجية من خلال تحديث تكوين نظام التوزيع الخاص بتطبيقك. على سبيل المثال، قد يتطلب ذلك تحديث ضبط Ingress أو NGINX أو توازن الحمل.

## إيقاف تشغيل البيئة المنشورة

لإيقاف البيئة المنشورة باستخدام Docker Compose ، قم بتشغيل الأمر التالي:

```bash
docker-compose down
```

## استخدام `docker run` لبدء تشغيل جدار الواجهة البرمجية

لبدء تشغيل جدار الواجهة البرمجية على Docker ، يمكنك أيضًا استخدام الأوامر التقليدية لـ Docker كما هو مبين في الأمثلة أدناه:

1. [لإنشاء شبكة Docker مستقلة](#step-2-configure-the-docker-network) للسماح بالاتصال بين التطبيق الموجود في الحاوية وجدار الواجهة البرمجية دون ربط يدوي:

    ```bash
    docker network create api-firewall-network
    ```
2. [لبدء تشغيل التطبيق الموجود في الحاوية](#step-3-configure-the-application-to-be-protected-with-api-firewall) الذي يجب حمايته بواسطة جدار الواجهة البرمجية:

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [لبدء تشغيل جدار الواجهة البرمجية](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. عندما يتم بدء تشغيل البيئة، اختبرها وقم بتمكين المرور على جدار الواجهة البرمجية باتباع الخطوات 6 و 7.