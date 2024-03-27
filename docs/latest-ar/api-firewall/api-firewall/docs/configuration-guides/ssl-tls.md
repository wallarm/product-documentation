# تكوين SSL/TLS

دليل ده بيشرح إزاي تظبط متغيرات البيئة عشان تكون اتصالات SSL/TLS بين جدار ال API والتطبيق المحمي، وكمان لجدار ال API نفسه. قدم المتغيرات دي لما تشغل حاوية Docker لجدار ال API لـ [REST API](../installation-guides/docker-container.md) أو [GraphQL API](../installation-guides/graphql/docker-container.md).

## اتصال SSL/TLS آمن بين جدار ال API والتطبيق

عشان تقيم اتصال آمن بين جدار ال API وخادم التطبيق المحمي اللي بيستخدم شهادات CA مخصصة، استخدم متغيرات البيئة الآتية:

1. ركب الشهادة CA المخصصة في حاوية جدار ال API. مثلاً، في `docker-compose.yaml` بتاعك، اعمل التعديل الموضح بالأسفل:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CA>:<CONTAINER_PATH_TO_CA>
    ...
    ```
1. قدم مسار الملف المركب باستخدام متغيرات البيئة التالية:

| متغير البيئة | الوصف |
| -------------------- | ----------- |
| `APIFW_SERVER_ROOT_CA`<br>(فقط لو قيمة `APIFW_SERVER_INSECURE_CONNECTION` كانت `false`) | المسار داخل حاوية Docker لشهادة CA لخادم التطبيق المحمي. |

## اتصال غير آمن بين جدار ال API والتطبيق

عشان تظبط اتصال غير آمن (يعني بيتخطى التحقق من SSL/TLS) بين جدار ال API وخادم التطبيق المحمي، استخدم متغير البيئة ده:

| متغير البيئة | الوصف |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | يحدد إذا كان يجب تعطيل التحقق من شهادة SSL/TLS لخادم التطبيق المحمي. عنوان الخادم محدد في متغير `APIFW_SERVER_URL`. القيمة الافتراضية (`false`)، النظام بيحاول يقيم اتصال آمن باستخدام إما شهادة CA الافتراضية أو اللي محددة في `APIFW_SERVER_ROOT_CA`. |

## SSL/TLS لخادم جدار ال API

عشان تضمن أن الخادم اللي شغال بجدار ال API بيقبل اتصالات HTTPS، اتبع الخطوات الآتية:

1. ركب دليل الشهادة والمفتاح الخاص على حاوية جدار ال API. مثلاً، في `docker-compose.yaml` بتاعك، اعمل التعديل الموضح بالأسفل:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CERT_DIR>:<CONTAINER_PATH_TO_CERT_DIR>
    ...
    ```
1. قدم مسارات الملفات المركبة باستخدام متغيرات البيئة التالية:

| متغير البيئة | الوصف |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH`            | المسار في الحاوية لدليل اللي تم تركيب شهادة ومفتاح خاص جدار ال API فيه. |
| `APIFW_TLS_CERT_FILE`             | اسم ملف شهادة SSL/TLS لجدار ال API، موجود داخل دليل `APIFW_TLS_CERTS_PATH`. |
| `APIFW_TLS_CERT_KEY`              | اسم ملف المفتاح الخاص لشهادة SSL/TLS لجدار ال API، موجود في دليل `APIFW_TLS_CERTS_PATH`. |