[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resourse
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/overview.md
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# CDNフィルタリングノード

Wallarm Console UIの**Nodes**セクションでは、[**Wallarm node**](nodes.md)および**CDN node**タイプのノードを管理できます。本記事ではCDN nodeについて説明します。

!!! info "Free tierでのCDN node"
    [Security Edge Free Tier](../../about-wallarm/subscription-plans.md#security-edge-free-tier)サブスクリプションプランではCDN nodeタイプのデプロイはサポートされていません。

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## ノードの作成

CDN nodeを作成するには、[手順](../../installation/cdn-node.md)に従ってください。

## ノードの詳細の表示

インストール済みノードの詳細は、各ノードの表およびカードに表示されます。カードを開くには、該当する表の行をクリックします。

以下のノードのプロパティとメトリクスを利用できます。

* 保護対象ドメイン名に基づいて生成されたノード名
* ノードのIPアドレス
* 保護対象ドメインに紐づくオリジンアドレス
* 一意のノード識別子(UUID)
* ノードのステータス
* SSL/TLS証明書：Wallarmが生成するLet's Encrypt証明書またはカスタム証明書
* フィルタリングノードとWallarm Cloudの最終同期時刻
* フィルタリングノードの作成日
* 当月にノードが処理したリクエスト数
* 使用中のcustom_rulesetおよびproton.dbのバージョン
* インストール済みWallarmパッケージのバージョン
* 利用可能なコンポーネント更新の有無

![CDN nodeカード](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## 保護対象のオリジンアドレスの更新 {#updating-the-origin-address-of-the-protected-resourse}

ホスティングプロバイダが保護対象に紐づくオリジンのIPアドレスまたはドメインを動的に更新する場合、CDN nodeの設定に指定したオリジンアドレスを最新に保ってください。そうしないと、CDN nodeが誤ったオリジンアドレスへプロキシしようとするため、リクエストが保護対象に到達しません。

オリジンアドレスを更新するには、**Edit origin address**オプションを使用します。

## カスタムSSL/TLS証明書のアップロード

WallarmはCDN nodeのドメインでHTTPSを有効にするための[Let's Encrypt](https://letsencrypt.org/)証明書を自動的に発行します。証明書は必要に応じて自動生成および自動更新されます。

保護対象ドメイン用の証明書を既にお持ちで、Let's Encrypt証明書ではなくそれを使用したい場合は、**Update SSL/TLS certificate**オプションから独自の証明書をアップロードできます。

## Varnish Cacheの使用 {#using-varnish-cache}

[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTPアクセラレータ付きのCDN nodeを利用すると、ユーザーへのコンテンツ配信（例：サーバーレスポンス）が高速化されます。ただし、コンテンツを変更した場合、CDN上のキャッシュコピーの更新に遅延が生じることがあり、[問題](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node)の原因となったり、Varnish Cacheを無効化する必要が生じたりする可能性があります。

コンテンツ更新の速度に起因する問題を避けるため、Varnish Cacheはデフォルトで無効になっています。Varnish Cacheは手動で有効化/無効化できます。操作は、**Nodes** → CDN node menu → **Enable Varnish Cache**または**Disable Varnish Cache**に進みます。

## ノードの削除

フィルタリングノードを削除すると、ドメイン宛てリクエストのフィルタリングは停止します。フィルタリングノードの削除は元に戻せません。Wallarm nodeはノード一覧から完全に削除されます。

1. 保護対象ドメインのDNSレコードからWallarmのCNAMEレコードを削除します。

    !!! warning "悪意あるリクエストの緩和は停止します"
        CNAMEレコードを削除してインターネット上に変更が反映されると、Wallarm CDN nodeはリクエストのプロキシを停止し、正規トラフィックと悪意あるトラフィックの双方が保護対象へ直接到達します。

        その結果、削除したDNSレコードの変更が反映されている一方で、新しいノードバージョン向けに生成されたCNAMEレコードがまだ反映されていないタイミングでは、保護対象サーバーの脆弱性が悪用されるリスクが生じます。
1. 変更が伝播するまで待ちます。現在のCNAMEレコードの状態はWallarm Console → **Nodes** → **CDN** → **Delete node**に表示されます。
1. ノード一覧からCDN nodeを削除します。

![ノードの削除](../../images/user-guides/nodes/delete-cdn-node.png)

## CDN nodeのトラブルシューティング

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"