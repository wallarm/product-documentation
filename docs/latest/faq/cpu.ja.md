# CPU使用率が高い問題のトラブルシューティング

Wallarmが推奨するCPU使用率は約10〜15%であり、これによりフィルタリングノードは10倍のトラフィックスパイクに対応できます。もし、Wallarmノードが予想以上にCPUを消費し、CPUの使用率を減らす必要がある場合は、このガイドを使用してください。

最も長いリクエスト処理時間と、そのための主なCPUの消費者を明らかにするためには、[詳細なログを有効に](../admin-ja/configure-logging.md#configuring-extended-logging-for-the-nginx‑based-filter-node)し、処理時間を監視できます。

WallarmによるCPU負荷を下げるために以下のことができます：

* NGINXの設定に [`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html) を追加するか、またはノード4.6からWallarm独自の [レート制限](../user-guides/rules/rate-limiting.md) 機能を使う。これは、ブルートフォース攻撃やその他の攻撃の場合にCPU負荷を減らす最良の方法かもしれません。

    ??? info "`limit_req`を使用した設定例"

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

* NGINXとTarantool用に[適切なメモリが割り当てられている](../admin-ja/configuration-guides/allocate-resources-for-node.md)ことを確認してください。
* [`wallarm_acl_access_phase`](../admin-ja/configure-parameters-ja.md#wallarm_acl_access_phase) ディレクティブが `on`に設定されていることを確認してください。これにより、フィルタリングモードに関係なく、ブロックリストに登録されたIPからの全てのリクエストを攻撃の兆候を探すことなく即座にブロックします。このディレクティブを有効にするとともに、誤って **許可リスト**に追加されたIPや、誤って **ブロックリスト**に追加されていない場所を見つけるためにWallarm [IPリスト](../user-guides/ip-lists/overview.md)を確認してください。

    ただし、この方法を用いると、検索エンジンからのリクエストがスキップされる可能性があります。しかし、この問題もNGINX設定内の `map` モジュールを用いれば解決可能です。

    ??? info "設定例 - `map` モジュールを利用して検索エンジンからのリクエストを解決する方法"

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

* [libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview) を `wallarm_enable_libdetection off` で無効化します。libdetectionを使用することでCPU使用率が5-10%上昇しますが、libdetectionを無効にするとSQLi攻撃検出の偽陽性の増加につながる可能性があることを考慮する必要があります。
* 検出された攻撃の分析中にWallarmが誤って一部のパーサを [ルール内](../user-guides/rules/disable-request-parsers.md) や [NGINX設定経由](../admin-ja/configure-parameters-ja.md#wallarm_parser_disable)でリクエストの特定の要素に対して使用していることが判明した場合、それらが適用されないものに対してこれらのパーサを無効化します。ただし、一般的にパーサを無効化することは推奨されません。
* [リクエストの処理時間を減らす](../user-guides/rules/configure-overlimit-res-detection.md)こと。ただし、これにより正当なリクエストがサーバに到達しない可能性があることを注意してください。
* [DDoS](../admin-ja/configuration-guides/protecting-against-ddos.md)の可能性のあるターゲットを分析し、利用可能な[保護対策](../admin-ja/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm)の一つを適用します。