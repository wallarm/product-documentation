# Wallarmユーザー受け入れテストチェックリスト

このセクションでは、Wallarmインスタンスが正しく動作していることを確認するためのチェックリストを提供します。

| 操作                                                                                                                                                        | 期待される動作                   | 確認  |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|-------|
| [Wallarmノードが攻撃を検出します](#wallarm-node-detects-attacks)                                                                     | 攻撃が検出されます                |       |
| [Wallarmインターフェイスにログインできます](#you-can-log-into-the-wallarm-interface)                                                 | ログインできます                      |       |
| [Wallarmインターフェイスが秒間リクエストを表示します](#wallarm-interface-shows-requests-per-second)                                       | リクエスト統計が表示されます          |       |
| [Wallarmがリクエストを誤検知としてマークしブロックを解除します](#wallarm-marks-requests-as-false-and-stops-blocking-them)               | Wallarmがリクエストをブロックしません |       |
| [Wallarmが脆弱性を検出しセキュリティインシデントを作成します](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | セキュリティインシデントが作成されます      |       |
| [Wallarmがペリメータを検出します](#wallarm-detects-perimeter)                                                                                   | スコープが発見されます                 |       |
| [IPホワイトリスト、ブラックリスト、およびグレイリストが機能します](#ip-allowlisting-denylisting-and-graylisting-work)                                                                                         | IPアドレスがブロックされます            |       |
| [ユーザーが設定され適切なアクセス権を持ちます](#users-can-be-configured-and-have-proper-access-rights)                   | ユーザーが作成・更新されます    |       |
| [ユーザーアクティビティログに記録があります](#user-activity-log-has-records)                                                                   | ログに記録が存在します                 |       |
| [レポート機能が動作します](#reporting-works)                                                                                               | レポートが受信されます                 |       |

## Wallarmノードが攻撃を検出します

1. リソースに対し悪意あるリクエストを送信します：

   ```
   http://<resource_URL>/etc/passwd
   ```

2. 以下のコマンドを実行し、攻撃カウントが増加したか確認します：

   ```
   curl http://127.0.0.8/wallarm-status
   ```

詳細は[フィルターノードの動作確認](installation-check-operation-en.md)を参照してください。

## Wallarmインターフェイスにログインできます

1. ご利用のクラウドに応じたリンクにアクセスします： 
   * USクラウドをご使用の場合は、<https://us1.my.wallarm.com>のリンクにアクセスします。
   * EUクラウドをご使用の場合は、<https://my.wallarm.com/>のリンクにアクセスします。
2. 正常にログインできるか確認します。

詳細は[脅威防止ダッシュボード概要](../user-guides/dashboards/threat-prevention.md)を参照してください。

## Wallarmインターフェイスが秒間リクエストを表示します

1. リソースにリクエストを送信します：

   ```
   curl http://<resource_URL>
   ```

   またはbashスクリプトを用いて複数のリクエストを送信します：

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<resource_URL> ;
   done
   ```

   この例は10リクエストの場合です。

2. Wallarmインターフェイスに秒間で検出されたリクエストが表示されているか確認します。

詳細は[脅威防止ダッシュボード](../user-guides/dashboards/threat-prevention.md)を参照してください。

## Wallarmがリクエストを誤検知としてマークしブロックを解除します

1. Attacksタブで攻撃の詳細を展開します。 
2. ヒットを選択し、Falseをクリックします。
3. 約3分間待ちます。
4. リクエストを再送信し、Wallarmが攻撃として検出しブロックするか確認します。

詳細は[誤検知の操作](../user-guides/events/check-attack.md#false-positives)を参照してください。

## Wallarmが脆弱性を検出しセキュリティインシデントを作成します

1. リソースに対しオープンな脆弱性が存在することを確認します。
2. 脆弱性を悪用するための悪意あるリクエストを送信します。
3. Wallarmインターフェイスにインシデントが検出されているか確認します。

詳細は[インシデントの確認](../user-guides/events/check-incident.md)を参照してください。

## Wallarmがペリメータを検出します

1. Scannerタブで、リソースのドメインを追加します。
2. 追加したドメインに関連するすべてのリソースが認識されているか確認します。

詳細は[スキャナーの操作](../user-guides/scanner.md)を参照してください。

## IPホワイトリスト、ブラックリスト、およびグレイリストが機能します

1. IPリストの基本ロジックを学びます[core logic of IP lists](../user-guides/ip-lists/overview.md)。
2. IPアドレスを[allowlist](../user-guides/ip-lists/overview.md)、[denylist](../user-guides/ip-lists/overview.md)、および[graylist](../user-guides/ip-lists/overview.md)に追加します。
3. フィルターノードがリストに追加されたIPからのリクエストを正しく処理するか確認します。

## ユーザーが設定され適切なアクセス権を持ちます

1. WallarmシステムでAdministratorロールを持っていることを確認します。
2. [Configuring users](../user-guides/settings/users.md)に記載されている通り、ユーザーの作成、ロール変更、無効化、削除を行います。

詳細は[Configuring users](../user-guides/settings/users.md)を参照してください。

## ユーザーアクティビティログに記録があります

1. Settings→Usersに移動します。
2. User Activity Logに記録が存在するか確認します。

詳細は[User activity log](../user-guides/settings/audit-log.md)を参照してください。

## レポート機能が動作します

1. Attacksタブで検索クエリを入力します。
2. 右側のreportボタンをクリックします。
3. メールアドレスを入力し、再度reportボタンをクリックします。
4. レポートが受信されるか確認します。

詳細は[カスタムレポートの作成](../user-guides/search-and-filters/custom-report.md)を参照してください。