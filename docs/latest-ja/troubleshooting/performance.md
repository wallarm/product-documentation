# パフォーマンスのトラブルシューティング

## WallarmノードのCPU使用率が高すぎます

Wallarmの推奨CPU使用率は約10～15%です。これは、フィルタリングノードがトラフィックスパイクを最大10倍まで処理できることを意味します。WallarmノードのCPU使用量が想定より多く、CPU使用率を下げる必要がある場合は、本ガイドを参照してください。

最も処理時間が長いリクエスト（ひいては主なCPU消費要因）を把握するには、[拡張ログを有効化](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)して処理時間を監視します。

WallarmによるCPU負荷を下げるには、次の対処が可能です。

* NGINXの設定に[`limit_req`](http://nginx.org/en/docs/http/ngx_http_limit_req_module.html)を追加します。また、ノード4.6以降ではWallarmの[レート制限](../user-guides/rules/rate-limiting.md)機能を使用します。総当たり攻撃などの場合、この方法がCPU負荷を下げる最良の手段となる可能性があります。

    ??? info "設定例 - `limit_req`の利用"

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

* NGINXとwstoreに適切なメモリが[割り当てられている](../admin-en/configuration-guides/allocate-resources-for-node.md)ことを確認します。
* [`wallarm_acl_access_phase`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)ディレクティブが`on`に設定されていることを確認します。これにより、いずれのフィルタリングモードでも、対象リクエスト内の攻撃兆候を探索せずに、**Denylist**に登録されたIPからのリクエストを即時にブロックします。あわせて、Wallarmの[IP lists](../user-guides/ip-lists/overview.md)を確認し、誤って**Allowlist**に追加したIPや、誤って**Denylist**に追加していないロケーションがないかを確認します。

    このCPU使用率低減方法により、検索エンジンからのリクエストをスキップしてしまう場合があります。ただし、NGINXの設定で`map`モジュールを使用することで、この問題も解決できます。

    ??? info "設定例 - 検索エンジン問題の解決に`map`モジュールを使用"

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

* [`libdetection`](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)（ノードバージョン4.4以降はデフォルトで有効）を`wallarm_enable_libdetection off`で無効化します。libdetectionを使用するとCPU消費が5～10%増加します。ただし、libdetectionを無効化すると、SQLi攻撃の検知における誤検知が増加する可能性がある点に留意してください。
* 検知された攻撃の分析中に、リクエストの特定要素に対してWallarmが[ルール内](../user-guides/rules/request-processing.md#managing-parsers)または[NGINXの設定](../admin-en/configure-parameters-en.md#wallarm_parser_disable)を通じて不適切なパーサーを使用していることが判明した場合、該当しない要素については当該パーサーを無効化します。ただし、一般的にパーサーの無効化は推奨しません。
* [リクエスト処理時間を短縮します](../user-guides/rules/configure-overlimit-res-detection.md)。これを行うことで、正当なリクエストがサーバーに到達しなくなる可能性がある点に注意してください。
* 潜在的な[DDoS](../admin-en/configuration-guides/protecting-against-ddos.md)の標的を分析し、利用可能な[保護対策](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm)のいずれかを適用します。