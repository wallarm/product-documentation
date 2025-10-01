# Performans Sorun Giderme

## Wallarm düğümü çok fazla CPU tüketiyor

Wallarm tarafından önerilen CPU kullanımı yaklaşık %10–15'tir; bu, filtreleme düğümlerinin trafikte x10 artışı karşılayabileceği anlamına gelir. Bir Wallarm düğümü beklenenden daha fazla CPU tüketiyorsa ve CPU kullanımını azaltmanız gerekiyorsa, bu kılavuzdan yararlanın.

En uzun istek işleme sürelerini ve dolayısıyla başlıca CPU tüketicilerini ortaya çıkarmak için [genişletilmiş günlüklemeyi etkinleştirip](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) işleme süresini izleyebilirsiniz.

Wallarm kaynaklı CPU yükünü azaltmak için aşağıdakileri yapabilirsiniz:

* NGINX yapılandırmasına [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) ekleyin veya düğüm 4.6'dan itibaren Wallarm'ın kendi [oran sınırlama](../user-guides/rules/rate-limiting.md) işlevini kullanın. Bu, kaba kuvvet ve diğer saldırılar durumunda CPU yükünü azaltmanın en iyi yolu olabilir.

    ??? info "Örnek yapılandırma - `limit_req` kullanımı"

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

* NGINX ve wstore için uygun miktarda belleğin [ayrıldığını](../admin-en/configuration-guides/allocate-resources-for-node.md) kontrol edin.
* [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) yönergesinin `on` olarak ayarlandığından emin olun; bu, herhangi bir filtreleme modunda bu isteklerde saldırı işaretlerini aramadan Denylist'te bulunan IP'lerden gelen istekleri anında engeller. Yönergeyi etkinleştirmenin yanı sıra, yanlışlıkla **Allowlist**'e eklenmiş IP'leri veya yanlışlıkla **Denylist**'e eklenmemiş konumları bulmak için Wallarm [IP lists](../user-guides/ip-lists/overview.md)'i kontrol edin.

    Bu CPU kullanımını düşürme yöntemi, arama motorlarından gelen isteklerin atlanmasına yol açabilir. Ancak bu sorun, NGINX yapılandırmasında `map` modülünün kullanılmasıyla da çözülebilir.

    ??? info "Örnek yapılandırma - arama motorları sorununu çözen `map` modülü"

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

* `wallarm_enable_libdetection off` ile [libdetection](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)'ı devre dışı bırakın (düğüm sürümü 4.4'ten beri varsayılan olarak etkindir). libdetection kullanımı CPU tüketimini %5–10 artırır. Ancak, libdetection'ı devre dışı bırakmanın SQLi saldırı tespiti için yanlış pozitif sayısında artışa yol açabileceğini dikkate almak gerekir.
* Tespit edilen saldırı analizi sırasında, Wallarm'ın bazı ayrıştırıcıları [kurallarda](../user-guides/rules/request-processing.md#managing-parsers) veya [NGINX yapılandırması aracılığıyla](../admin-en/configure-parameters-en.md#wallarm_parser_disable) isteklerin belirli öğeleri için yanlışlıkla kullandığını tespit ederseniz, geçerli olmadıkları durumlarda bu ayrıştırıcıları devre dışı bırakın. Ancak, genel olarak ayrıştırıcıların devre dışı bırakılması asla önerilmez.
* [İstek işleme süresini düşürün](../user-guides/rules/configure-overlimit-res-detection.md). Bunu yaparak meşru isteklerin sunucuya ulaşmasını engelleyebileceğinizi unutmayın.
* Olası [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) hedeflerini analiz edin ve mevcut [koruma önlemlerinden](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) birini uygulayın.