[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../rules/intro.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/graylist.md#managing-graylist
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# CDNフィルタリングノード

WallarmコンソールUIの**ノード**セクションでは、[**Wallarmノード**](nodes.md)と**CDNノード**の2種類のノードを管理できます。この記事はCDNノードについてです。

!!! info "Free tierプランでのCDNノード"
    CDNノードタイプの展開は、[Free tierプラン](../../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud)ではサポートされていません。

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.ja.md"

## ノードの作成

CDNノードを作成するには、[インストラクション](../../installation/cdn-node.md)に従ってください。

## ノードの詳細を表示

インストールされたノードの詳細は、各ノードのテーブルおよびカードに表示されます。カードを開くには、適切なテーブルレコードをクリックしてください。

次のノードのプロパティと指標が利用可能です。

* 保護されたドメインの名前に基づいて生成されたノード名
* ノードのIPアドレス
* 保護されたドメインに関連付けられた元のアドレス
* 固有のノード識別子（UUID）
* ノードのステータス
* SSL/TLS証明書：Wallarmが生成したLet's Encryptまたはカスタム証明書
* フィルタリングノードとWallarmクラウドとの最後の同期の時間
* フィルタリングノードの作成日
* その月にノードで処理されたリクエストの数
* 使用されているcustom_rulesetおよびproton.dbのバージョン
* インストールされたWallarmパッケージのバージョン
* 使用可能なコンポーネントの更新インジケータ

![!CDNノードカード](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## 保護されたリソースの元のアドレスを更新する

ホスティングプロバイダが保護されたリソースに関連付けられた元のIPアドレスまたはドメインを動的に更新する場合は、CDNノード構成で指定された元のアドレスを最新の状態に保ってください。それ以外の場合、CDNノードが間違った元のアドレスにプロキシしようとして、リクエストが保護されたリソースに到達しなくなります。

元のアドレスを更新するには、**Edit origin address**オプションを使用してください。

## カスタムSSL/TLS証明書のアップロード

Wallarmは、CDNノードドメインでHTTPSを有効にする[Let's Encrypt](https://letsencrypt.org/)証明書を自動的に発行します。証明書は、必要に応じて自動的に生成され、更新されます。

保護されたドメインの証明書がすでにある場合や、Let's Encrypt証明書よりもそれを好む場合は、**Update SSL/TLS certificate**オプションを使用して独自の証明書をアップロードできます。

## Varnishキャッシュの使用

[バーニッシュキャッシュ](https://varnish-cache.org/intro/index.html#intro)のHTTPアクセラレータをCDNノードと一緒に使用すると、ユーザーへのコンテンツ配信が高速化し（たとえば、サーバーの応答）。ただし、コンテンツを変更すると、CDNでのキャッシュ済みコピーが遅れて更新される可能性があり、[問題](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node)が発生してバーニッシュキャッシュを無効にする理由となります。

コンテンツ更新速度の問題を回避するために、Varnishキャッシュはデフォルトで無効になっています。Varnishキャッシュを手動で有効/無効にできます。操作するには、**ノード**→CDNノードメニュー→**Varnishキャッシュの有効化**または**Varnishキャッシュの無効化**に進んでください。

## ノードの削除

フィルタリングノードが削除されると、ドメインへのリクエストのフィルタリングが停止します。フィルタリングノードの削除は元に戻せません。Wallarmノードはノードリストから完全に削除されます。

1. 保護されたドメインのDNSレコードからWallarm CNAMEレコードを削除します。

    !!! warning "悪意のあるリクエストの軽減が停止します"
        CNAMEレコードが削除され、インターネット上で変更が有効になると、Wallarm CDNノードはリクエストのプロキシを停止し、正当なトラフィックと悪意のあるトラフィックが直接保護されたリソースに直行します。

        削除されたDNSレコードが有効になり、新しいノードバージョンのために生成されたCNAMEレコードがまだ有効になっていない場合、保護されたサーバーの脆弱性が悪用されるリスクがあります。
1. 変更が伝播されるのを待ちます。実際のCNAMEレコードのステータスは、Wallarmコンソール→**ノード**→**CDN**→**ノードの削除**に表示されます。
1. ノードリストからCDNノードを削除します。

![!ノードの削除](../../images/user-guides/nodes/delete-cdn-node.png)

## CDNノードのトラブルシューティング

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.ja.md"