# CPU高使用率のトラブルシューティング

Wallarmが推奨するCPU使用率は約10-15%です。これは、フィルタリングノードが通常の10倍のトラフィックスパイクに対応できることを意味します。Wallarmノードが期待より多くのCPUを消費し、CPU使用率を下げる必要がある場合は、このガイドをご利用ください。

最も長いリクエスト処理時間を明らかにし、主要なCPU消費要因を特定するために、[拡張ロギングを有効にする](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)ことで処理時間を監視してください。

WallarmによるCPU負荷を下げるために、以下の対策を実施できます:

* NGINX構成に[`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)を追加するか、ノード4.6以降ではWallarm独自の[レートリミティング](../user-guides/rules/rate-limiting.md)機能を使用できます。ブルートフォース攻撃やその他の攻撃の場合、これがCPU負荷を下げる最良の方法である可能性があります。

    ??? info "例：`limit_req`を使用する構成"

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

* NGINXおよびTarantoolに適切なメモリが[割り当てられている](../admin-en/configuration-guides/allocate-resources-for-node.md)ことを確認します。

* 任意のフィルトレーションモードにおいて、これらのリクエストから攻撃サインを検索することなく即座にdenylistに含まれるIPからのリクエストをブロックする`on`に[`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)ディレクティブが設定されていることを確認します。このディレクティブを有効にするとともに、誤って**Allowlist**に追加されたIPや、誤って**Denylist**に追加されていない対象を見つけるために、Wallarmの[IPリスト](../user-guides/ip-lists/overview.md)を確認してください。

    ただし、この方法でCPU使用率を下げると、検索エンジンからのリクエストをスキップする結果になる可能性があります。しかしながら、この問題はNGINX構成における`map`モジュールの活用によっても解決可能です。

    ??? info "例：検索エンジン問題を解決する`map`モジュールを使用する構成"

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

* ノードバージョン4.4以降デフォルトで有効になっている[libdetection](../about-wallarm/protecting-against-attacks.md#libdetection-overview)を`wallarm_enable_libdetection off`によって無効化します。libdetectionを使用するとCPU消費が5-10%増加します。ただし、libdetectionを無効化するとSQLi攻撃検出の誤検知が増加する可能性があることを考慮する必要があります。

* 検知された攻撃の解析中に、Wallarmがリクエストの特定要素に対して誤って[ルール内のパーサー](../user-guides/rules/request-processing.md#managing-parsers)または[NGINX構成内のパーサー](../admin-en/configure-parameters-en.md#wallarm_parser_disable)を使用していることが判明した場合、対象に適用されないパーサーは無効化してください。ただし、一般的にパーサーを無効化することは推奨されません。

* [リクエスト処理時間を短縮](../user-guides/rules/configure-overlimit-res-detection.md)します。ただし、これにより正当なリクエストがサーバーに届かなくなる可能性があることに注意してください。

* 可能性のある[DDoS](../admin-en/configuration-guides/protecting-against-ddos.md)の標的を解析し、利用可能な[保護対策](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm)の1つを適用してください。