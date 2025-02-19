# CPU yüksek kullanım sorunu giderme

Wallarm tarafından önerilen CPU kullanımı yaklaşık %10-15'tir; bu, filtreleme düğümlerinin trafiğin 10 kat artışını kaldırabileceği anlamına gelir. Eğer bir Wallarm düğümü beklenenden fazla CPU tüketiyorsa ve CPU kullanımını azaltmanız gerekiyorsa, bu kılavuzu kullanın.

En uzun istek işleme sürelerini ve dolayısıyla ana CPU tüketicilerini tespit etmek için, [extended logging'i etkinleştirebilir](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) ve işleme süresini izleyebilirsiniz.

Wallarm tarafından CPU yükünü azaltmak için aşağıdakileri yapabilirsiniz:

* NGINX yapılandırmasına [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) ekleyin veya düğüm 4.6'dan itibaren Wallarm'ın kendi [rate limiting](../user-guides/rules/rate-limiting.md) işlevselliğini kullanın. Bu, özellikle brute force ve diğer saldırılar durumunda CPU yükünü azaltmanın en iyi yolu olabilir.

    ??? info "Example configuration - using `limit_req`"

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

* NGINX ve Tarantool için uygun miktarda bellek [ayırıldığını](../admin-en/configuration-guides/allocate-resources-for-node.md) kontrol edin.
* Filtreleme modunda yapılan saldırı işaretleri aramadan, denylisted IP'lerden gelen herhangi bir isteği derhal engellemesi için [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) yönergesinin `on` olarak ayarlandığından emin olun. Yönergeyi etkinleştirmenin yanı sıra, yanlışlıkla **Allowlist**'e eklenen IP'leri veya yanlışlıkla **Denylist**'e eklenmeyen konumları bulmak için Wallarm [IP listelerini](../user-guides/ip-lists/overview.md) kontrol edin.

    Not: Bu CPU kullanımını azaltma yöntemi, arama motorlarından gelen isteklerin atlanmasına yol açabilir. Ancak, bu problem NGINX yapılandırmasında `map` modülünün kullanımıyla da çözülebilir.

    ??? info "Example configuration - `map` module solving search engines problem"

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

* [Libdetection'ı](../about-wallarm/protecting-against-attacks.md#libdetection-overview) (düğüm versiyonu 4.4'ten itibaren varsayılan olarak etkin) `wallarm_enable_libdetection off` komutu ile devre dışı bırakın. Libdetection kullanmak CPU tüketimini %5-10 oranında artırır. Ancak, libdetection'ın devre dışı bırakılmasının SQLi saldırı tespiti için yanlış pozitif sayısında artışa neden olabileceğini göz önünde bulundurmak gerekir.
* Tespit edilen saldırı analizinde Wallarm'ın, belirli istek öğeleri için yanlışlıkla bazı ayrıştırıcıları [kurallarda](../user-guides/rules/request-processing.md#managing-parsers) veya [NGINX yapılandırması üzerinden](../admin-en/configure-parameters-en.md#wallarm_parser_disable) kullandığını fark ederseniz, bu ayrıştırıcıları uygulanmadıkları durumlar için devre dışı bırakın. Ancak, genel olarak ayrıştırıcıların devre dışı bırakılmasının tavsiye edilmediğini unutmayın.
* [İstek işleme süresini düşürün](../user-guides/rules/configure-overlimit-res-detection.md). Bunun yapılması, meşru isteklerin sunucuya ulaşmasını engelleyebileceğini unutmayın.
* Olası [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) hedeflerini analiz edin ve mevcut [koruma önlemlerinden](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) birini uygulayın.