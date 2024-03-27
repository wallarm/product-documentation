# تشغيل جدار حماية API على Docker لـ API GraphQL

يهدف هذا الدليل إلى مرافقتك خلال عملية تنزيل وتثبيت وبدء [جدار حماية API لـ Wallarm](../../index.md) على Docker لمصادقة طلبات API لـ GraphQL. في الوضع GraphQL، يعمل جدار الحماية الخاص بAPI كوكيل، حيث يقوم بتوجيه طلبات GraphQL من المستخدمين إلى الخادم الرئيسي باستخدام بروتوكولات HTTP أو WebSocket (`graphql-ws`). قبل التنفيذ من قبل الخادم الخلفي، يتحقق جدار الحماية من تعقيد الاستفسار وعمقه وعدد العقد في طلب GraphQL.

لا يقوم جدار الحماية الخاص بAPI بالتحقق من صحة استجابات طلب GraphQL.

## المتطلبات

* [تثبيت Docker وتكوينه](https://docs.docker.com/get-docker/)
* [تحديدات GraphQL](http://spec.graphql.org/October2021/) المطورة لAPI الخاص بGraphQL للتطبيق الذي يجب حمايته بواسطة جدار حماية API لـ Wallarm

## الطرق لتشغيل جدار حماية API على Docker

أسرع طريقة لنشر جدار حماية API على Docker هي [Docker Compose](https://docs.docker.com/compose/). تعتمد الخطوات أدناه على استخدام هذه الطريقة.

إذا كان مطلوبًا، يمكنك أيضًا استخدام `docker run`. لقد وفرنا الأوامر `docker run` المناسبة لنشر كل بيئة في [هذا القسم](#using-docker-run-to-start-api-firewall).

## الخطوة 1. إنشاء ملف `docker-compose.yml`

لاشفاء جدار حماية API والبيئة المناسبة باستخدام Docker Compose، أنشئ أولا ملف **docker-compose.yml** بالمحتوى التالي. في الخطوات التالية، ستقوم بتغيير هذا النموذج.

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
      APIFW_MODE: graphql
      APIFW_GRAPHQL_SCHEMA: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_GRAPHQL_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY: <MAX_QUERY_COMPLEXITY>
      APIFW_GRAPHQL_MAX_QUERY_DEPTH: <MAX_QUERY_DEPTH>
      APIFW_GRAPHQL_NODE_COUNT_LIMIT: <NODE_COUNT_LIMIT>
      APIFW_GRAPHQL_INTROSPECTION: <ALLOW_INTROSPECTION_OR_NOT>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: <IMAGE_WITH_GRAPHQL_APP>
    restart: on-failure
    ports:
      - <HOST_PORT>:<CONTAINER_PORT>
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## الخطوة 2. تكوين شبكة Docker

إذا كان مطلوبًا، قم بتغيير تكوين [شبكة Docker](https://docs.docker.com/network/) المحدد في **docker-compose.yml** → `networks`.

يوجه ملف **docker-compose.yml** المقدم لـ Docker لإنشاء الشبكة `api-firewall-network` وربط حاويات التطبيق وجدار الحماية API بها.

يُنصح باستخدام شبكة Docker منفصلة للتطبيق المحمي الموجود في الحاوية وجدار الحماية API للسماح لهما بالتواصل دون ربط يدوي.

## الخطوة 3. تكوين التطبيق للحماية بواسطة جدار حماية API

قم بتغيير تكوين التطبيق الموجود في الحاوية للحماية بواسطة جدار حماية API. يتم تحديد هذا التكوين في **docker-compose.yml** → `services.backend`.

يوجه النموذج Docker لبدء حاوية التطبيق Docker المحددة، متصلاً بها `api-firewall-network` وتعيين [اسم الشبكة المستعار](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) `backend`. يمكنك تحديد المنفذ كما يناسب متطلباتك.

عند إعداد تطبيقك، يرجى تضمين إعدادات الحاوية الضرورية فقط للبدء الناجح لها. لا يتطلب امرأة تكوين خاص لجدار الحماية API.

## الخطوة 4. تكوين جدار الحماية API

قم بتمرير تكوين جدار الحماية API في **docker-compose.yml** → `services.api-firewall` على النحو التالي:

**مع `services.api-firewall.volumes`**، قم بتركيب [تحديدات GraphQL](http://spec.graphql.org/October2021/) على دليل حاوية جدار حماية ال API:

* `<HOST_PATH_TO_SPEC>`: المسار إلى تحديدات GraphQL لAPI الخاص بك الموجود على الجهاز المضيف. لا يهم تنسيق الملف ولكن عادةً ما يكون `.graphql` أو `gql`. على سبيل المثال: `/opt/my-api/graphql/schema.graphql`.
* `<CONTAINER_PATH_TO_SPEC>`: المسار إلى الدليل الحاوية لتركيب تحديدات GraphQL عليه. على سبيل المثال: `/api-firewall/resources/schema.graphql`.

**مع `services.api-firewall.environment`**، يرجى تعيين تكوين جدار حماية API العام من خلال المتغيرات البيئية التالية:

| المتغير البيئي | الوصف | مطلوب؟ |
| -------------------- | ----------- | --------- |
| `APIFW_MODE` | يعين الوضع العام لجدار حماية API. القيم الممكنة هي [`PROXY`](../docker-container.md) (الافتراضي)، `graphql` و[`API`](../api-mode.md). | لا |
| <a name="apifw-api-specs"></a>`APIFW_GRAPHQL_SCHEMA` | المسار إلى ملف تحديدات GraphQL المركب على الحاوية، على سبيل المثال: `/api-firewall/resources/schema.graphql`. | نعم |
| `APIFW_URL` | عنوان URL لجدار حماية API. على سبيل المثال:  `http://0.0.0.0:8088/`، يجب أن يتوافق قيمة المنفذ مع منفذ الحاوية المنشور على المضيف.<br><br>إذا كان يستمع جدار حماية API إلى بروتوكول HTTPS، يرجى تركيب الشهادة SSL/TLS المولدة والمفتاح الخاص على الحاوية، وتمرير إلى الحاوية **إعدادات SSL/TLS لجدار حماية API** الموضحة أدناه. | نعم |
| `APIFW_SERVER_URL` | عنوان URL للتطبيق الموصوف في التحديدات المركبة التي يجب حمايتها بواسطة جدار حماية API. على سبيل المثال: `http://backend:80`. | نعم |
| <a name="apifw-graphql-request-validation"></a>`APIFW_GRAPHQL_REQUEST_VALIDATION` | وضع جدار حماية API عند التحقق من صحة الطلبات المرسلة إلى عنوان URL للتطبيق:<ul><li>`BLOCK` يحظر ويسجل الطلبات التي لا تتوافق مع نظام GraphQL المركب، حيث يعود برمز `403 Forbidden`. يتم إرسال السجلات إلى خدمات [`STDOUT` و`STDERR` Docker](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` يسجل (ولكن لا يحظر) الطلبات غير المتطابقة.</li><li>`DISABLE` يوقف التحقق من صحة الطلب.</li></ul>يؤثر هذا المتغير على جميع المعلمات الأخرى، باستثناء [`APIFW_GRAPHQL_WS_CHECK_ORIGIN`](websocket-origin-check.md). على سبيل المثال، إذا كان `APIFW_GRAPHQL_INTROSPECTION` هو `false` والوضع هو `LOG_ONLY`، فإن طلبات المعرفة تصل إلى الخادم الخلفي، ولكن يولد جدار الحماية API سجل الخطأ المناظر. | نعم |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | [يحدد](limit-compliance.md) الحد الأقصى لعدد طلبات العقدة التي قد تكون مطلوبة لتنفيذ الاستعلام. يعني تعيينه على `0` تعطيل الفحص التعقيد. القيمة الافتراضية هي `0`. | نعم |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | [يحدد](limit-compliance.md) العمق الأقصى المسموح به لاستعلام GraphQL. قيمة `0` تعني أن التحقق من عمق الاستفسار يتم تجاهله. | نعم |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | [يحدد](limit-compliance.md) الحد الأقصى لعدد العقد في الاستفسار. عند تعيين القيمة على `0`، يتم تجاهل الحد الأقصى لعدد العقد. | نعم |
| <a name="apifw-graphql-introspection"></a>`APIFW_GRAPHQL_INTROSPECTION` | يسمح بطلبات المعرفة، التي تكشف عن تخطيط نظام GraphQL الخاص بك. عند تعيينها إلى `true`، يتم السماح بهذه الاستعلامات. | نعم |
| `APIFW_LOG_LEVEL` | مستوى تسجيل جدار الحماية API. القيم الممكنة:<ul><li>`DEBUG` لتسجيل الأحداث من أي نوع (INFO، ERROR، WARNING، وDEBUG).</li><li>`INFO` لتسجيل أحداث الأنواع INFO، WARNING، و ERROR.</li><li>`WARNING` لتسجيل أحداث الأنواع WARNING وERROR.</li><li>`ERROR` لتسجيل أحداث النوع ERROR فقط.</li><li>`TRACE` لتسجيل الطلبات الواردة واستجابات جدار الحماية API، بما في ذلك محتواها.</li></ul> القيمة الافتراضية هي `DEBUG`. السجلات على الطلبات والاستجابات التي لا تطابق نظام GraphQL المقدم يكون لها نوع ERROR. | لا |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | إذا تم تعيينه على `true`، يتم حذف رأس `Accept-Encoding` من الطلبات الموكلة. القيمة الافتراضية هي `false`. | لا |
| `APIFW_LOG_FORMAT` | تنسيق سجلات جدار حماية API. يمكن أن تكون القيمة `TEXT` أو `JSON`. القيمة الافتراضية هي `TEXT`. | لا |

**مع `services.api-firewall.ports` و `services.api-firewall.networks`**، حدد منفذ الحاوية وقم بتوصيل الحاوية بالشبكة المنشأة.

## الخطوة 5. نشر البيئة المكونة

لاستخراج وبدء البيئة المكونة، قم بتشغيل الأمر التالي:

```bash
docker-compose up -d --force-recreate
```

للتحقق من ناتج السجل:

```bash
docker-compose logs -f
```

## الخطوة 6. اختبار تشغيل جدار حماية API

لاختبار تشغيل جدار حماية API، أرسل الطلب الذي لا يطابق تحديدات GraphQL المركبة إلى عنوان الحاوية Docker لـ API Firewall.

مع تعيين `APIFW_GRAPHQL_REQUEST_VALIDATION` على `BLOCK`، يعمل الجدار الناري على النحو التالي:

* إذا سمح الجدار الناري API بالطلب، فيقوم بتوجيه الطلب إلى الخادم الخلفي.
* إذا لم يتمكن جدار الحماية API من تحليل الطلب، يستجيب بخطأ GraphQL برمز حالة 500.
* إذا فشل التحقق بواسطة جدار الحماية API، فإنه لا يوجه الطلب إلى الخادم الخلفي ولكنه يرد على العميل برمز حالة 200 وخطأ GraphQL في الاستجابة.

إذا لم يطابق الطلب نظام API المقدم، سيتم إضافة رسالة ERROR المناسبة إلى سجلات حاوية Docker لـ API Firewall، على سبيل المثال في تنسيق JSON:

```json
{
  "errors": [
    {
      "message": "field: name not defined on type: Query",
      "path": [
        "query",
        "name"
      ]
    }
  ]
}
```

في السيناريوهات التي يكون فيها عدة حقول في الطلب غير صالحة، سيتم توليد رسالة خطأ واحدة فقط.

## الخطوة 7. تمكين حركة المرور على جدار الحماية API

لإتمام تكوين جدار الحماية API، يرجى تمكين حركة المرور الواردة على جدار الحماية API عن طريق تحديث تكوين نظام نشر تطبيقك. على سبيل المثال، قد يتطلب ذلك تحديث إعدادات Ingress أو NGINX أو موازن الحمل.

## توقيف البيئة المنشأة

لإيقاف البيئة التي تم نشرها باستخدام Docker Compose، قم بتشغيل الأمر التالي:

```bash
docker-compose down
```

## استخدام `docker run` لبدء جدار حماية API

لبدء جدار حماية API على Docker، يمكنك أيضًا استخدام الأوامر العادية لـ Docker كما في الأمثلة أدناه:

1. [لإنشاء شبكة Docker منفصلة](#step-2-configure-the-docker-network) للسماح للتطبيق الموجود في الحاوية وAPI Firewall بالتواصل دون ربط يدوي:

    ```bash
    docker network create api-firewall-network
    ```
2. [بدء التطبيق الموجود في الحاوية](#step-3-configure-the-application-to-be-protected-with-api-firewall) للحماية بواسطة جدار حماية API:

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE_WITH_GRAPHQL_APP>
    ```
3. [لبدء جدار حماية API](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_MODE=graphql \
        -e APIFW_GRAPHQL_SCHEMA=<PATH_TO_MOUNTED_SPEC> -e APIFW_URL=<API_FIREWALL_URL> \
        -e APIFW_SERVER_URL=<PROTECTED_APP_URL> -e APIFW_GRAPHQL_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> \
        -e APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY=<MAX_QUERY_COMPLEXITY> \
        -e APIFW_GRAPHQL_MAX_QUERY_DEPTH=<MAX_QUERY_DEPTH> -e APIFW_GRAPHQL_NODE_COUNT_LIMIT=<NODE_COUNT_LIMIT> \
        -e APIFW_GRAPHQL_INTROSPECTION=<ALLOW_INTROSPECTION_OR_NOT> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. عند بدء البيئة، اختبرها ومكن حركة المرور على جدار الحماية API باتباع الخطوات 6 و7.