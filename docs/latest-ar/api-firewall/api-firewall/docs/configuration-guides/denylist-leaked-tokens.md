# منع الطلبات بالتوكنات المخترقة

جدار حماية واجهة برمجة التطبيقات من Wallarm يوفر ميزة لمنع استخدام توكنات المصادقة المسربة. هذا الدليل يوضح كيفية تفعيل هذه الميزة باستخدام حاوية دوكر لجدار حماية واجهة برمجة التطبيقات لإما [واجهة برمجة التطبيقات REST](../installation-guides/docker-container.md) أو [واجهة برمجة التطبيقات GraphQL](../installation-guides/graphql/docker-container.md).

هذه القابلية تعتمد على بياناتك المرفقة بخصوص التوكنات المخترقة. لتفعيلها، قم بتركيب ملف .txt يحتوي على هذه التوكنات إلى حاوية جدار الحماية دوكر، ثم ضبط المتغير البيئي المقابل. للحصول على نظرة معمقة حول هذه الميزة، اقرأ [مقالتنا](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/).

بالنسبة لواجهة برمجة التطبيقات REST، في حال ظهر أي من التوكنات المشار إليها في طلب، جدار حماية واجهة برمجة التطبيقات سيرد باستخدام الرمز الحالة المحدد في متغير البيئة [`APIFW_CUSTOM_BLOCK_STATUS_CODE`](../installation-guides/docker-container.md#apifw-custom-block-status-code). بالنسبة لواجهة برمجة التطبيقات GraphQL، أي طلب يحتوى على توكن مشار إليه سيتم حظره، حتى لو كان متوافقًا مع النظام الأساسي المركب.

لتفعيل ميزة القائمة السوداء:

1. قم بإعداد ملف .txt بالتوكنات المخترقة. يجب أن يكون كل توكن في سطر جديد. ها هو مثال:

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
1. قم بتركيب ملف القائمة السوداء إلى حاوية جدار الحماية دوكر. على سبيل المثال، في ملف `docker-compose.yaml` الخاص بك، قم بالتعديل التالي:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_LEAKED_TOKEN_FILE>:<CONTAINER_PATH_TO_LEAKED_TOKEN_FILE>
    ...
    ```
1. أدخل المتغيرات البيئية التالية عند بدء تشغيل حاوية دوكر:

| متغير البيئة | الوصف |
| -------------- | ----------- |
| `APIFW_DENYLIST_TOKENS_FILE` | المسار في الحاوية إلى ملف القائمة السوداء المركب. مثال: `/auth-data/tokens-denylist.txt`. |
| `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | اسم الكوكيز التي تحمل التوكن المصادقة. |
| `APIFW_DENYLIST_TOKENS_HEADER_NAME` | اسم الرأس الذي ينقل التوكن المصادقة. إذا تم تحديد كلاً من `APIFW_DENYLIST_TOKENS_COOKIE_NAME` و `APIFW_DENYLIST_TOKENS_HEADER_NAME`، جدار حماية واجهة برمجة التطبيقات يفحص كلاهما على التوالي. |
| `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | يشير إلى ما إذا كان ينبغي إزالة بادئة `Bearer` من الرأس المصادقة أثناء المقارنة بالقائمة السوداء. إذا كانت التوكنات في القائمة السوداء لا تحتوي على هذه البادئة، لكن الرأس المصادقة يحتويها، قد لا يتم تطابق التوكنات بشكل صحيح. يقبل `true` أو `false` (الافتراضي).