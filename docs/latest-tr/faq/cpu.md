# CPU Yüksek Kullanım Sorun Giderme

Wallarm tarafından önerilen CPU kullanımı yaklaşık %10-15'tir, bu da filtreleme düğümlerinin x10 trafik artışını ele alabileceği anlamına gelir. Bir Wallarm düğümü beklenenden daha fazla CPU tüketiyorsa ve CPU kullanımını azaltmanız gerekiyorsa, bu rehberi kullanın.

En uzun talep işleme bölümlerini ve böylece en büyük CPU tüketicilerini ortaya çıkarmak için, [genişletilmiş bir günlüklemeyi etkinleştirebilir](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node) ve işleme süresini izleyebilirsiniz.

Wallarm tarafından CPU yükünü azaltmak için aşağıdakileri yapabilirsiniz:

* [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)'i NGINX yapılandırmasına ekleyin ya da düğüm 4.6'dan itibaren Wallarm'ın kendi [hız sınırlama](../user-guides/rules/rate-limiting.md) işlevini kullanın. Bu, brute force ve diğer saldırılar durumunda CPU yükünü azaltmanın en iyi yolu olabilir.

    ??? info "`limit_req` kullanarak örnek yapılandırma"

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

* NGINX ve Tarantool için uygun miktarda belleğin [tahsis edildiğinden](../admin-en/configuration-guides/allocate-resources-for-node.md) emin olun.
* [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) yönergesinin `on` olarak ayarlandığından emin olun. Bu, saldırı belirtileri bu taleplerde aranmaksızın, herhangi bir filtreleme modunda, karalisteye alınmış IP'lerden gelen talepleri derhal engeller. Yönergeyi etkinleştirmenin yanı sıra, yanlışlıkla **İzin Listesine** eklenmiş IP'leri veya yanlışlıkla **Reddetme Listesine** eklenmemiş konumları bulmak için Wallarm [IP listelerini](../user-guides/ip-lists/overview.md) kontrol edin.

    Bu CPU kullanımını azaltma yönteminin, arama motorlarından gelen isteklerin atlanmasına yol açabileceğini unutmayın. Ancak, bu sorun da NGINX yapılandırmasında `map` modülünün kullanılmasıyla çözülebilir.

    ??? info "`map` modülü ile arama motorları sorununu çözme - örnek yapılandırma"

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

* [libdetection'u](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (düğüm sürüm 4.4'ten itibaren varsayılan olarak etkindir) `wallarm_enable_libdetection off` aracılığıyla devre dışı bırakın. Libdetection kullanımı CPU tüketimini %5-10 artırır. Ancak, libdetection'u devre dışı bırakmanın SQLi saldırı tespitinde yanlış pozitif sayısında artışa yol açabileceğini göz önünde bulundurmak gereklidir.
* Tespit edilen saldırı analizi sırasında Wallarm'ın bazı ayrıştırıcıları [kurallarda](../user-guides/rules/disable-request-parsers.md) veya [NGINX yapılandırması aracılığıyla](../admin-en/configure-parameters-en.md#wallarm_parser_disable) taleplerin belirli unsurları için yanlışlıkla kullandığını ortaya çıkarırsanız, bunları geçerli olmadıkları şeyler için devre dışı bırakın. Ancak, genel olarak ayrıştırıcıların devre dışı bırakılmasının hiçbir zaman önerilmediğini unutmayın.
* [İstek işleme süresini azaltın](../user-guides/rules/configure-overlimit-res-detection.md). Bunu yaparak, meşru isteklerin sunucuya ulaşmasını engelleyebilirsiniz.
* [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) için olası hedefleri analiz edin ve mevcut [koruma önlemlerinden](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) birini uygulayın.