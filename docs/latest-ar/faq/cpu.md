# تحرّي ومعالجة استهلاك الوحدة المركزية المرتفع

يُنصح بأن يكون استهلاك وحدة المعالجة المركزية بواسطة Wallarm حوالي 10-15%، مما يعني أن عقد التصفية ستكون قادرة على التعامل مع زيادة في حجم المرور بمقدار 10 أضعاف. إذا كانت عقدة Wallarm تستهلك وحدة معالجة مركزية أكثر مما كان متوقعًا وكنت بحاجة إلى خفض استهلاك وحدة المعالجة المركزية، استخدم هذا الدليل.

لكشف الحلقات الأطول في معالجة الطلبات وبالتالي العناصر الرئيسية المستهلكة لوحدة المعالجة المركزية، يمكنك [تمكين التسجيل الموسع](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) ومراقبة وقت المعالجة.

يمكنك القيام بما يلي لخفض حمل وحدة المعالجة المركزية بواسطة Wallarm:

* إضافة [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) إلى تكوين NGINX أو ابتداءً من العقدة 4.6 استخدم وظائف [تحديد المعدل](../user-guides/rules/rate-limiting.md) الخاصة بـ Wallarm. قد تكون هذه أفضل طريقة لتقليل حمل وحدة المعالجة المركزية في حالة الهجمات القوية والهجمات الأخرى.

    ??? info "مثال التكوين - باستخدام `limit_req`"

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

* التأكد من تخصيص كمية الذاكرة المناسبة [للتخصيص](../admin-en/configuration-guides/allocate-resources-for-node.md) لـ NGINX وTarantool.
* التأكد من تعيين توجيه [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) إلى `on` والذي يقوم بحظر أي طلبات من عناوين IP المدرجة في القائمة السوداء في أي وضع تصفية دون البحث عن علامات الهجوم في هذه الطلبات. بالإضافة إلى تمكين التوجيه، تحقق من [قوائم IP](../user-guides/ip-lists/overview.md) في Wallarm للعثور على عناوين IP التي أُضيفت عن طريق الخطأ إلى **القائمة البيضاء** أو المواقع التي لم تُضف عن طريق الخطأ إلى **القائمة السوداء**.

    لاحظ أن هذه الطريقة لخفض استهلاك وحدة المعالجة المركزية قد تؤدي إلى تخطي طلبات من محركات البحث. ومع ذلك، يمكن أيضًا حل هذه المشكلة من خلال استخدام وحدة `map` في تكوين NGINX.

    ??? info "مثال التكوين - `map` module لحل مشكلة محركات البحث"

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

* تعطيل [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (مُمكن بشكل افتراضي بدءًا من إصدار العقدة 4.4) عبر `wallarm_enable_libdetection off`. يؤدي استخدام libdetection إلى زيادة استهلاك وحدة المعالجة المركزية بنسبة 5-10%. ومع ذلك، يجب الأخذ في الاعتبار أن تعطيل libdetection قد يؤدي إلى زيادة في عدد النتائج الإيجابية الكاذبة لاكتشاف هجمات SQLi.
* إذا كشفت خلال تحليل الهجمات المكتشفة أن Wallarm يستخدم بطريقة خاطئة بعض المحللات [في القواعد](../user-guides/rules/request-processing.md#managing-parsers) أو [عبر تكوين NGINX](../admin-en/configure-parameters-en.md#wallarm_parser_disable) لعناصر معينة في الطلبات، عطل هذه المحللات لما لا تنطبق عليه. لاحظ، ومع ذلك، أن تعطيل المحللات بشكل عام لا يُنصح به أبدًا.
* [تخفيض وقت معالجة الطلب](../user-guides/rules/configure-overlimit-res-detection.md). لاحظ أنه بفعل ذلك قد تمنع الطلبات المشروعة من الوصول إلى الخادم.
* تحليل الأهداف المحتملة لـ [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) وتطبيق إحدى [إجراءات الحماية](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) المتاحة.