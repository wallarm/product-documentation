# Wallarmユーザー受け入れテストチェックリスト

このセクションでは、Wallarm インスタンスが正しく作動することを確認するためのチェックリストを提供します。

| 操作                                                                                                                                                        | 期待される動作                   | 確認  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|--------|
| [Wallarm ノードが攻撃を検出する](#wallarm-node-detects-attacks)                                                                     | 攻撃が検出されます                |        |
| [Wallarm インターフェースにログインできる](#you-can-log-into-the-wallarm-interface)                                                 | ログインすることができます                      |        |
| [Wallarm インターフェースが1秒あたりのリクエストを表示する](#wallarm-interface-shows-requests-per-second)                                       | リクエストの統計を見ることができます          |        |
| [Wallarmがリクエストを偽物とマークし、それらをブロックするのを停止する](#wallarm-marks-requests-as-false-and-stops-blocking-them)               | Wallarmはリクエストをブロックしません |        |
| [Wallarmが脆弱性を検出し、セキュリティインシデントを作成する](#wallarm-detects-vulnerabilities-and-creates-security-incidents) | セキュリティインシデントが作成されます      |        |
| [Wallarmがパーメータを検出する](#wallarm-detects-perimeter)                                                                                   | 範囲が検出されます                 |        |
| [IP許可リスト, 拒否リスト, グレーリストが作動する](#ip-allowlisting-denylisting-and-graylisting-work)                                                                                         | IPアドレスがブロックされます            |        |
| [ユーザーは設定可能であり適切なアクセス権を持つ](#users-can-be-configured-and-have-proper-access-rights)                   | ユーザーを作成および更新することができます    |        |
| [ユーザーのアクティビティログにレコードが存在する](#user-activity-log-has-records)                                                                   | ログにレコードが存在します                 |        |
| [レポートが作成される](#reporting-works)                                                                                               | レポートを受け取ります                 |        | |

## Wallarm ノードが攻撃を検出します

1. 悪意のあるリクエストをあなたのリソースに送信します。

   ```
   http://<リソースの_URL>/etc/passwd
   ```

2. 攻撃カウントが増加したかどうかを確認するために以下のコマンドを実行します。

   ```
   curl http://127.0.0.8/wallarm-status
   ```

[フィルタノードの動作の評価](installation-check-operation-en.md)も参照してください。

## Wallarm インターフェースにログインできます

1. あなたが使用しているクラウドに対応するリンクに進みます：
    *   USクラウドを使用している場合は、<https://us1.my.wallarm.com>のリンクに進みます。
    *   EUクラウドを使用している場合は、<https://my.wallarm.com/>のリンクに進みます。
2. あなたが正しくログインできるかどうかを確認します。

[脅威防止ダッシュボードの概要](../user-guides/dashboards/threat-prevention.md)も参照してください。

## Wallarm インターフェースが1秒あたりのリクエストを表示します

1. リソースにリクエストを送ります：

   ```
   curl http://<リソースの_URL>
   ```

   または、bashスクリプトで複数のリクエストを送信します：

   ```
   for (( i=0 ; $i<10 ; i++ )) ;
   do 
      curl http://<リソースの_URL> ;
   done
   ```

   これは10リクエストのための例です。

2. Wallarmインターフェースが1秒当たりの検出されたリクエストを表示するかどうかを確認します。

[脅威防止ダッシュボード](../user-guides/dashboards/threat-prevention.md)も参照してください。

## Wallarmはリクエストを偽物とマークし、それをブロックするのを停止します

1. *攻撃*タブで攻撃を展開します。
2. ヒットを選択し、*偽物*をクリックします。
3. 約3分間待ちます。
4. リクエストを再送信し、Wallarmが攻撃として検出し、それをブロックするかどうかを確認します。

[偽物の攻撃との作業](../user-guides/events/false-attack.md)も参照してください。

## Wallarmは脆弱性を検出し、セキュリティーインシデントを作成します

1. リソース上に開かれた脆弱性があることを確認します。
2. 脆弱性を悪用する悪意のあるリクエストを送信します。
3. Wallarmインターフェースでインシデントが検出されたかどうかを確認します。

[攻撃とインシデントの評価](../user-guides/events/check-attack.md)も参照してください。

## Wallarmはパーメータを検出します

1. *スキャナー* タブで、あなたのリソースのドメインを追加します。
2. Wallarmが追加したドメインに関連するすべてのリソースを発見するかどうかを確認します。

[スキャナーとの作業](../user-guides/scanner.md)も参照してください。

## IP許可リスト, 拒否リスト, グレーリストが作動します

1. [IPリストのコアロジック](../user-guides/ip-lists/overview.md)を学びます。
2. IPアドレスを[allowlist](../user-guides/ip-lists/allowlist.md), [denylist](../user-guides/ip-lists/denylist.md), [graylist](../user-guides/ip-lists/graylist.md)に追加します。
3. フィルタリングノードがリストに追加されたIPからのリクエストを正しく処理しているかどうかを確認します。

## ユーザーは設定可能であり、適切なアクセス権を持っています

1. Wallarmシステムで*管理者*ロールを持っていることを確認します。
2. [ユーザーの設定](../user-guides/settings/users.md)で説明されているように、ユーザーを作成、ロールを変更、無効化、削除します。

[ユーザーの設定](../user-guides/settings/users.md)も参照してください。

## ユーザーアクティビティログにレコードが存在します

1. *設定* -> *ユーザー*へ進みます。
2. *ユーザーアクティビティログ*にレコードが存在することを確認します。

[ユーザーアクティビティログ](../user-guides/settings/audit-log.md)も参照してください。

## レポーティングが作動します

1. *攻撃*タブで、検索クエリを入力します。
2. 右側のレポートボタンをクリックします。
3. あなたのEメールを入力し、再度レポートボタンをクリックします。
4. レポートを受け取ったかどうかを確認します。

[カスタムレポートの作成](../user-guides/search-and-filters/custom-report.md)も参照してください。