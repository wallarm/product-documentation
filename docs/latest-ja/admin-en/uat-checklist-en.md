[ptrav-attack-docs]:             ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart.png

# ノード導入後のWallarmヘルスチェック

本書は、新しいフィルタリングノードを導入した後にWallarmが正しく動作していることを確認するためのチェックリストです。既存のノードの健全性確認にも本手順を使用できます。

!!! info "ヘルスチェック結果"
    記載の期待結果と実際の結果に差異がある場合、ノードの機能に問題がある兆候である可能性があります。そのような不一致には特に注意を払い、必要に応じて[Wallarmサポートチーム](https://support.wallarm.com/)にお問い合わせください。

## ノードがCloudに登録されている

確認方法:

1. Wallarm Console → **Configuration** → **Nodes**を開きます。
1. アクティブなノードのみが表示されるようにフィルターを適用します。
1. 一覧から対象ノードを見つけ、クリックして詳細を表示します。

## ノードが攻撃を記録している

確認方法:

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ノードがすべてのトラフィックを記録している

完全な可視性を確保するため、Wallarmの[API Sessions](../api-sessions/overview.md)は悪意のあるリクエストと正当なリクエストのすべてを段階的なユーザーセッションの形式で表示します。

確認方法:

1. ノードで保護されているリソースにリクエストを送信します:

      ```
      curl http://<resource_URL>
      ```

      またはbashスクリプトで複数のリクエストを送信します:

      ```
      for (( i=0 ; $i<10 ; i++ )) ;
      do 
         curl http://<resource_URL> ;
      done
      ```

      この例では10件のリクエストを送信します。

1. **Events** → **API Sessions**を開きます。
1. 送信したリクエストと先ほど送信した攻撃が同一のセッション内にまとまっていることを確認します。

## ノードの統計サービスが動作している

`/wallarm-status` URLにアクセスすると、フィルタリングノードの動作統計を取得できます。

!!! info "統計サービス"
    統計サービスの詳細と設定方法は[こちら](../admin-en/configure-statistics-service.md)をご覧ください。

確認方法:

1. ノードがインストールされているマシン上で次のコマンドを実行します:

      ```
      curl http://127.0.0.8/wallarm-status
      ```

1. 出力を確認します。次のように表示されるはずです:

      ```json
      {
            "requests": 11,
            "streams": 0,
            "messages": 0,
            "attacks": 1,
            "blocked": 0,
            "blocked_by_acl": 0,
            "blocked_by_antibot": 0,
            "acl_allow_list": 0,
            "abnormal": 11,
            "tnt_errors": 0,
            "api_errors": 0,
            "requests_lost": 0,
            "overlimits_time": 0,
            "segfaults": 0,
            "memfaults": 0,
            "softmemfaults": 0,
            "proton_errors": 0,
            "time_detect": 0,
            "db_id": 199,
            "lom_id": 1726,
            "custom_ruleset_id": 1726,
            "custom_ruleset_ver": 56,
            "db_apply_time": 1750365841,
            "lom_apply_time": 1750365842,
            "custom_ruleset_apply_time": 1750365842,
            "proton_instances": {
                  "total": 2,
                  "success": 2,
                  "fallback": 0,
                  "failed": 0
            },
            "stalled_workers_count": 0,
            "stalled_workers": [],
            "ts_files": [
            {
                  "id": 1726,
                  "size": 11887,
                  "mod_time": 1750365842,
                  "fname": "/opt/wallarm/etc/wallarm/custom_ruleset"
            }
            ],
            "db_files": [
            {
                  "id": 199,
                  "size": 355930,
                  "mod_time": 1750365841,
                  "fname": "/opt/wallarm/etc/wallarm/proton.db"
            }
            ],
            "startid": 2594491974706159096,
            "compatibility": 4,
            "config_revision": 0,
            "rate_limit": {
            "shm_zone_size": 67108864,
            "buckets_count": 2,
            "entries": 0,
            "delayed": 0,
            "exceeded": 0,
            "expired": 0,
            "removed": 0,
            "no_free_nodes": 0
            },
            "timestamp": 1750371146.209885,
            "split": {
            "clients": [
                  {
                  "client_id": null,
                  "requests": 11,
                  "streams": 0,
                  "messages": 0,
                  "attacks": 1,
                  "blocked": 0,
                  "blocked_by_acl": 0,
                  "blocked_by_antibot": 0,
                  "overlimits_time": 0,
                  "time_detect": 0,
                  "applications": [
                  {
                        "app_id": -1,
                        "requests": 11,
                        "streams": 0,
                        "messages": 0,
                        "attacks": 1,
                        "blocked": 0,
                        "blocked_by_acl": 0,
                        "blocked_by_antibot": 0,
                        "overlimits_time": 0,
                        "time_detect": 0
                  }
                  ]
                  }
            ]
            }
      }
      ```

      これは、フィルタリングノードの統計サービスが起動しており正常に動作していることを意味します。

## ノードのログが収集されている

確認方法:

1. ノードがインストールされているマシンで`/opt/wallarm/var/log/wallarm`に移動します。
1. `wcli-out.log`の内容を確認します。ブルートフォース検出、Cloudへの攻撃エクスポート、Cloudとのノード同期状況など、ほとんどのWallarmサービスのログが記録されています。

その他のログおよびログ設定の詳細は[こちら](../admin-en/configure-logging.md)をご覧ください。

## ノードが脆弱性を記録している

Wallarmはお使いのアプリケーションAPIの[脆弱性](../glossary-en.md#vulnerability)を検出します。

確認方法:

1. ご利用のリソースに次のリクエストを送信します:

      ```
      curl <RECOURSE_URL> -H 'jwt: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJjbGllbmRfaWQiOiIxIn0.' -H 'HOST: <TEST_HOST_NAME>'
      ```

      なお、そのホストに対してすでに[脆弱なJWT](../attacks-vulns-list.md#weak-jwt)の脆弱性が検出されている場合（ステータスが何であっても、クローズ済みでも同様です）、新たな脆弱性が登録されることを確認するには、異なる`TEST_HOST_NAME`を指定する必要があります。

1. Wallarm Console → **Events** → **Vulnerabilities**を開き、weak JWTの脆弱性が一覧に表示されたかを確認します。

## IPリストが機能している

Wallarmでは、リクエスト送信元のIPアドレスをAllowlist、Denylist、Graylistに分類することでアプリケーションAPIへのアクセスを制御できます。IPリストの基本ロジックは[こちら](../user-guides/ip-lists/overview.md)をご覧ください。

確認方法:

1. Wallarm Console → **Events** → **Attacks**を開き、[ノードが攻撃を記録している](#node-registers-attacks)の確認で作成した攻撃を見つけます。
1. 攻撃の送信元IPをコピーします。
1. Security Controls → **IP Lists** → **Allowlist**に移動し、コピーした送信元IPをこのリストに追加します。
1. 新しいIPリストの状態がフィルタリングノードに反映されるまで待ちます（約2分）。
1. 同じIPから同じ攻撃を再送します。**Attacks**には何も表示されないはずです。
1. **Allowlist**からそのIPを削除します。
1. そのIPを**Denylist**に追加します。
1. [ノードがすべてのトラフィックを記録している](#node-registers-all-traffic)の手順と同様に正当なリクエストを送信します。これらのリクエストは正当であっても**Attacks**にブロックとして表示されるはずです。

## ルールが機能している

Wallarmでは、[ルール](../user-guides/rules/rules.md)を使用して、システムが悪意のあるリクエストを検出する方法や検出時の動作を変更できます。ルールはWallarm ConsoleからCloud上で作成し、カスタムルールセットとして構成され、Cloudからフィルタリングノードに配信されて適用されます。

確認方法:

1. 次のいずれかの方法で現在のカスタムルールセットのIDと日時を確認します:

      * Wallarm Console → **Configuration** → **Nodes**で対象ノードの詳細を開き、custom_rulesetのID番号とインストール時刻を確認します。
      * [ノードの統計](#node-statistics-service-works)で`custom_ruleset_id`と`custom_ruleset_apply_time`を確認します。
      * `wcli-out.log`の[ノードログ](#node-logs-are-collected)で、最新の"lom"を含む行を確認し、その行の"version"と"time"に注目します。

1. Security Controls → **Rules**に移動します。
1. **Add rule** → **Fine-tuning attack detection** → **Ignore certain attacks**を使用し、リクエストの`uri`部分で**Path traversal**を無視するように選択してルールを作成します。
1. 手順1で確認した値が更新されたことを確認します（2～4分かかる場合があります）。
1. [ノードが攻撃を記録している](#node-registers-attacks)の確認で実行した攻撃を再実行します。今回はこの攻撃は無視され、**Attacks**に表示されないはずです。
1. そのルールを削除します。