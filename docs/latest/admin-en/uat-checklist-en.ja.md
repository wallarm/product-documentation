# Wallarmユーザー受け入れテストチェックリスト

このセクションでは、Wallarmインスタンスが正しく動作することを確認するためのチェックリストを提供しています。

| 操作                                                                                                                  | 期待される動作                     | チェック  |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------|----------|
| [Wallarmノードが攻撃を検出する](#wallarm-node-detects-attacks)                                   | 攻撃が検出される                   |          |
| [Wallarmインターフェースにログインできる](#you-can-log-into-the-wallarm-interface)                         | ログインできる                     |          |
| [Wallarmインターフェースがリクエスト毎秒を表示する](#wallarm-interface-shows-requests-per-second)               | リクエストの統計が見える           |          |
| [Wallarmはリクエストを偽のものとマークし、ブロックを停止する](#wallarm-marks-requests-as-false-and-stops-blocking-them) | Wallarmがリクエストをブロックしない    |          |
| [Wallarmは脆弱性を検出し、セキュリティインシデントを作成する](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | セキュリティインシデントが作成される   |          |
| [Wallarmが境界を検出する](#wallarm-detects-perimeter)                                                | 範囲が検出される                    |          |
| [IP許可リスト、拒否リスト、グレーリストが機能する](#ip-allowlisting-denylisting-and-graylisting-work)                                                  | IPアドレスがブロックされる           |          |
| [ユーザーが設定され、適切なアクセス権を持っている](#users-can-be-configured-and-have-proper-access-rights) | ユーザーの作成や更新ができる         |          |
| [ユーザーの活動ログにレコードがある](#user-activity-log-has-records)                                    | ログにレコードがあります            |          |
| [レポートが機能する](#reporting-works)                                                                  | レポートが届く                      |          | |


## Wallarmノードが攻撃を検出する

1. 悪意のあるリクエストをリソースに送信します：

   ```
   http://<resource_URL>/etc/passwd
   ```

2. 次のコマンドを実行して、攻撃回数が増えたかどうかを確認します：

   ```
   curl http://127.0.0.8/wallarm-status
   ```

参照：[フィルターノード操作の確認](installation-check-operation-en.md)

## Wallarmインターフェースにログインできる

1.  使用しているクラウドに対応するリンクに進みます：
    *   USクラウドを使用している場合は、<https://us1.my.wallarm.com>のリンクを開きます。
    *   EUクラウドを使用している場合は、<https://my.wallarm.com/>のリンクを開きます。
2.  ログインできるかどうか確認します。

参照：[脅威防止ダッシュボードの概要](../user-guides/dashboards/threat-prevention.md)。

## Wallarmインターフェースがリクエスト毎秒を表示する

1. リクエストをリソースに送信します：

   ```
   curl http://<resource_URL>
   ```

   または、バッシュスクリプトでいくつかのリクエストを送信します：

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<resource_URL> ;
   done
   ```

   この例は10のリクエストになります。

2. Wallarmインターフェースが検出したリクエスト毎秒を表示するかどうか確認します。

参照：[脅威防止ダッシュボード](../user-guides/dashboards/threat-prevention.md)。

## Wallarmはリクエストを偽のものとマークし、ブロックを停止する

1. *Attacks*タブで攻撃を展開します。
2. ヒットを選択し、「False」をクリックします。
3. 約3分間待ちます。
4. リクエストを再送信し、Wallarmがそれを攻撃として検出しブロックするかどうかを確認します。

参照：[Falseアタックの処理](../user-guides/events/false-attack.md)。

## Wallarmは脆弱性を検出し、セキュリティインシデントを作成する

1. リソースに開かれた脆弱性があることを確認します。
2. 脆弱性を悪用する悪意のあるリクエストを送信します。
3. Wallarmインタフェースで検出されたインシデントがあるかどうか確認します。

参照：[攻撃とインシデントの確認](../user-guides/events/check-attack.md)。

## Wallarmが境界を検出する

1. *Scanner*タブでリソースのドメインを追加します。
2. 追加されたドメインに関連するすべてのリソースがWallarmによって発見されるかどうか確認します。

参照：[スキャナーの使用](../user-guides/scanner/intro.md)。

## IP許可リスト、拒否リスト、グレーリストが機能する

1. [IPリストの基本ロジック](../user-guides/ip-lists/overview.md)を学びます。
2. IPアドレスを[allowlist](../user-guides/ip-lists/allowlist.md)、[denylist](../user-guides/ip-lists/denylist.md)、および[graylist](../user-guides/ip-lists/graylist.md)に追加します。
3. フィルタリングノードがリストに追加されたIPからのリクエストを正しく処理しているかどうかを確認します。

## ユーザーが設定され、適切なアクセス権を持っている

1. Wallarmシステムで*Administrator*ロールがあることを確認します。
2. [ユーザーの設定](../user-guides/settings/users.md)に記載されているように、ユーザーを作成、役割を変更、無効化、削除します。

参照：[ユーザーの設定](../user-guides/settings/users.md)。

## ユーザーの活動ログにレコードがある

1. *Settings* –> *Users*に移動します。
2. *User Activity Log*にレコードがあることを確認します。

参照：[ユーザーの活動ログ](../user-guides/settings/audit-log.md)。

## レポートが機能する

1. *Attacks*タブで検索クエリを入力します。
2. 右側のレポートボタンをクリックします。
3. メールアドレスを入力し、もう一度レポートボタンをクリックします。
5. レポートが届くかどうかを確認します。

参照：[カスタムレポートの作成](../user-guides/search-and-filters/custom-report.md)。