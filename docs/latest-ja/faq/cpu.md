# CPU 高使用率のトラブルシューティング

Wallarm が推奨する CPU 使用率は約10-15％であり、これはフィルタリングノードがx10トラフィックスパイクを処理できることを意味します。 Wallarm ノードが想定以上に CPU を消費し、CPU の使用量を減らす必要がある場合は、このガイドを使用してください。

最も長いリクエスト処理エピソードとそうすることで主な CPU 消費者を明らかにするためには、 [拡張ログを有効に](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node)して処理時間を監視することができます。

Wallarm による CPU 負荷を下げるために以下を行うことができます：

* [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)を NGINX の設定に追加するか、またはノード 4.6 以降からは Wallarm 独自の [rate limiting](../user-guides/rules/rate-limiting.md) 機能を使用します。 これは総当り攻撃およびその他の攻撃の場合に CPU 負荷を減らす最善の方法である可能性があります。

    ??? info "`limit_req` を使用した例の設定"

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

* NGINX および Tarantool に適切な量のメモリが [割り当てられている](../admin-en/configuration-guides/allocate-resources-for-node.md) ことを確認します。
* [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) ディレクティブが `on` に設定されていることを確認します。これにより、フィルタリングモードに関係なく、これらのリクエストの中で攻撃の兆候を探すことなく、拒否リストの IP からのすべてのリクエストを即座にブロックします。 ディレクティブを有効にするとともに、誤って **許可リスト** に追加された IP や、誤って **拒否リスト** に追加されていない場所を見つけるために Wallarm [IP リスト](../user-guides/ip-lists/overview.md)を確認します。

    なお、CPU 使用率を下げるこの方法は、検索エンジンからのリクエストをスキップする可能性があります。 ただし、この問題は NGINX の設定で `map` モジュールを使用することで解決することも可能です。

    ??? info "問題を解決するための `map` モジュールの例設定"

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

* `wallarm_enable_libdetection off` を使用して [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview)（ノードのバージョン 4.4 以降ではデフォルトで有効化）を無効化します。 libdetection を使用すると、CPU の消費量が5-10％増加します。ただし、libdetection を無効化すると、SQLi 攻撃検出の偽陽性の数が増加する可能性があることを考慮に入れる必要があります。
* 攻撃分析中に Wallarm が誤っていくつかのパーサーを [ルール内](../user-guides/rules/disable-request-parsers.md) または [NGINX の設定を介して](../admin-en/configure-parameters-en.md#wallarm_parser_disable) 特定のリクエスト要素に使用していることが分かった場合、それらが適用されないものに対してこれらのパーサーを無効にします。ただし、一般的にパーサーを無効にすることは推奨されません。
* [リクエストの処理時間を短縮](../user-guides/rules/configure-overlimit-res-detection.md) します。 ただし、これを行うと、正当なリクエストがサーバーに届かない可能性がありますので注意してください。
* [DDoS](../admin-en/configuration-guides/protecting-against-ddos.md) の可能性のあるターゲットを分析し、利用可能な [保護手段](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm) の一つを適用します。