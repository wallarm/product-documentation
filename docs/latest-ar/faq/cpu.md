# تحري مشكلة استهلاك عالي لمعالج الحاسوب (CPU)

يوصى باستهلاك معالج الحاسوب بنسبة حوالي ١٠-١٥٪ من قبل Wallarm، مما يعني أن عقد التصفية ستكون قادرة على التعامل مع زيادة حجم الزيارات بمقدار ١٠ أضعاف. إذا كانت عقدة Wallarm تستهلك المزيد من معالج الحاسوب عما كان متوقعًا وأنت بحاجة إلى تقليل استهلاك المعالج، استخدم هذا الدليل.

لكشف أطول فترات معالجة الطلبات وبالتالي الاستهلاكيين الأساسيين لمعالج الحاسوب، يمكنك [تمكين التسجيل الموسع](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) ومراقبة وقت المعالجة.

يمكنك القيام بالتالي لتقليل حمل المعالج الناتج عن Wallarm:

* إضافة [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) إلى تكوين NGINX أو ابتداءً من العقدة 4.6 استخدم وظيفة [تحديد المعدل](../user-guides/rules/rate-limiting.md) الخاصة بـ Wallarm. قد يكون هذا أفضل طريقة لتقليل حمل المعالج في حالة هجمات القوة العنيفة وغيرها من الهجمات.

    ??? info "مثال التكوين - استخدام `limit_req`"

        ```bash
        http {
          map $request_uri $binary_remote_addr_map {
            ~^/get $binary_remote_addr;
            ~^/post $binary_remote_addr;
            ~^/wp-login.php $binary_remote_addr;
          }
          limit_req_zone $binary_remote_addr_map zone=urls:10m rate=3r/s;
          limit_req_zone $binary_remote_addr$request_uri zone=allurl:10m rate=5r/s;

          limit_req_status 444;

          server {
            location {
              limit_req zone=urls nodelay;
              limit_req zone=allurl burst=30;
            }
          }
        }
        ```

* التأكد من تخصيص الكمية المناسبة من الذاكرة [qد قد تمّ تخصيصها](../admin-en/configuration-guides/allocate-resources-for-node.md) لـ NGINX وTarantool.
* التأكد من أن توجيه [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) مضبوط على `on` والذي يحجب على الفور أي طلبات من عناوين الـIP المدرجة في القائمة السوداء في أي وضع ترشيح دون البحث عن علامات الهجمات في هذه الطلبات. إلى جانب تمكين التوجيه، تحقق من قوائم [IP الخاصة بـ Wallarm](../user-guides/ip-lists/overview.md) للعثور على عناوين IP التي أضيفت بالخطأ إلى **القائمة البيضاء** أو المواقع التي لم تُضف بالخطأ إلى **القائمة السوداء**.

    لاحظ أن هذه الطريقة لخفض استهلاك المعالج قد تؤدي إلى تخطي طلبات من محركات البحث. ومع ذلك، يمكن حل هذه المشكلة أيضًا من خلال استخدام وحدة `map` في تكوين NGINX.

    ??? info "مثال التكوين - حل مشكلة محركات البحث باستخدام وحدة `map`"

        ```bash
        http {
          wallarm_acl_access_phase on;
          map $http_user_agent $wallarm_mode{
        	  default monitoring;
        	  ~*(google|bing|yandex|msnbot) off;
          }
          server {
            server_name mos.ru;
            wallarm_mode $wallarm_mode;
          }
        }
        ```

* تعطيل [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (مفعل افتراضيًا ابتداءً من إصدار العقدة 4.4) عبر `wallarm_enable_libdetection off`. استخدام libdetection يزيد من استهلاك المعالج بنسبة 5-10٪. ومع ذلك، يجب الأخذ في الاعتبار أن تعطيل libdetection قد يؤدي إلى زيادة عدد النتائج الإيجابية المزيفة للكشف عن هجمات SQLi.
* إذا كشفت أثناء تحليل الهجمات المكتشفة أن Wallarm يستخدم بشكل خاطئ بعض المفسرات [في القواعد](../user-guides/rules/request-processing.md#managing-parsers) أو [عبر تكوين NGINX](../admin-en/configure-parameters-en.md#wallarm_parser_disable) لعناصر معينة من الطلبات، قم بتعطيل هذه المفسرات لما لا يتناسب معها. مع ذلك، لاحظ أنه لا يُنصح أبدًا بتعطيل المفسرات بشكل عام.
* [خفض وقت معالجة الطلب](../user-guides/rules/configure-overlimit-res-detection.md). لاحظ أنه بفعل ذلك قد تمنع الطلبات الشرعية من الوصول إلى الخادم.
* تحليل الأهداف المحتملة لـ [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) وتطبيق إحدى تدابير [الحماية المتاحة](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm).