[link-scope-rps-limit]:     check-scope.md#limit-scanning-speed
[link-vulnerabilities]:     ../vulnerabilities/check-vuln.md
[link-scanner-modules]:     configure-scanner-modules.md

[img-configure-scanner]:        ../../images/user-guides/scanner/configure-scanner.png

# 一般的なスキャナ設定 <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

スキャナの設定にアクセスするには、*スキャナ* タブに移動し、左側の設定ボタンをクリックします。

![!スキャナ設定][img-configure-scanner]

## スキャナ

この設定は、スコープ内のリソースの発見を有効化または無効化し、典型的な脆弱性を検索します。

設定がオンの場合、スキャンを手動で再起動するには、設定をオフにし、再度オンに切り替えます。

!!! info "検出された脆弱性の表示"
    スキャナが見つけた脆弱性は、Web インターフェイスの [*脆弱性*][link-vulnerabilities] タブで表示できます。

スキャナの設定では、次の操作を行うことができます：
* 検出された脆弱性のリストの設定
* 脆弱性の再チェックの無効化と有効化

!!! info "スキャナの設定"
    スキャナの詳細な設定情報については、この[リンク][link-scanner-modules]を参照してください。

## アクティブな脅威検証

この設定では、スキャナによる[自動アタック再現](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)を完全に無効化または有効化できます。
後で、*チェック* ボタンをクリックするか、*ルール* タブを使用して、アタック検証を手動で実行することができます。

## スキャナの RPS 制限

この設定では、スキャナ要求によって生成される Web アプリケーションへの最大負荷を制限します。

最大リクエスト数（RPS）は次のように設定できます。
* ドメイン
* IP アドレス

複数のドメインが同じ IP アドレスに関連付けられている場合、この IP アドレスへのリクエストの速度は、IP アドレスの制限を超えません。複数の IP アドレスが 1 つのドメインに関連付けられている場合、このドメイン内のこれらの IP アドレスへのリクエストの合計速度は、ドメインの制限を超えません。

個々の IP アドレスやドメインの制限は、[ネットワークスコープ][link-scope-rps-limit] セクション内でオーバーライドできます。

デフォルトのスキャナ RPS 設定を復元するには、*Restore defaults* ボタンをクリックします。

----------

スキャナ設定に対する変更を適用するには、*Save* をクリックします。