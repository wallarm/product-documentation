[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console
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

Wallarm Console UIの**Nodes**セクションでは、[**Wallarm node**](nodes.md)および**CDN node**タイプのノードを管理できます。本記事はCDNノードについて説明します。

!!! info "Free tierでのCDNノード"
    CDN nodeタイプのデプロイは[Free tierプラン](../../about-wallarm/subscription-plans.md#free-tier)ではサポートされていません。

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## ノードの作成

CDNノードを作成するには、[こちらの手順](../../installation/cdn-node.md)に従ってください。

## ノードの詳細の表示

インストールされたノードの詳細は、各ノードのテーブルおよびカードに表示されます。カードを開くには、該当するテーブルのレコードをクリックしてください。

利用可能なノードのプロパティおよびメトリクスは以下のとおりです:

* 保護対象ドメインの名前に基づいて生成されたノード名
* ノードのIPアドレス
* 保護対象ドメインに関連付けられたオリジンアドレス
* 一意のノード識別子（UUID）
* ノードの状態
* SSL/TLS証明書：Wallarmが生成したLet's Encrypt証明書またはカスタム証明書
* フィルタリングノードとWallarm Cloudの最終同期時刻
* フィルタリングノードの作成日
* 当月にノードが処理したリクエスト数
* 使用中のcustom_rulesetおよびproton.dbのバージョン
* インストールされたWallarmパッケージのバージョン
* 利用可能なコンポーネントアップデートのインジケータ

![CDN node card](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## 保護対象リソースのオリジンアドレスの更新

ホスティングプロバイダーが保護対象リソースに関連付けられたオリジンIPアドレスまたはドメインを動的に更新する場合、CDNノードの設定に指定されたオリジンアドレスを最新の状態に保ってください。そうしないと、CDNノードが誤ったオリジンアドレスにリクエストをプロキシしようとするため、リクエストが保護対象リソースに到達しなくなります。

オリジンアドレスを更新するには、**Edit origin address** オプションを使用してください。

## カスタムSSL/TLS証明書のアップロード

Wallarmは自動的にCDNノードドメインでHTTPSを有効にする[Let's Encrypt](https://letsencrypt.org/)証明書を発行します。証明書は必要に応じて自動的に生成および更新されます。

保護対象ドメイン用の証明書を既にお持ちで、Let's Encrypt証明書ではなくそれを使用したい場合は、**Update SSL/TLS certificate** オプションを使用してご自身の証明書をアップロードしてください。

## Varnish Cacheの使用

CDNノードと[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTPアクセラレータを利用すると、ユーザーへのコンテンツ配信（例：サーバーのレスポンス）を高速化できます。ただし、コンテンツを変更した場合、CDN上のキャッシュコピーの更新に遅延が生じる可能性があり、これが[問題](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node)を引き起こす原因となり、Varnish Cacheを無効化する理由となることがあります。

コンテンツ更新速度に関する問題を回避するため、Varnish Cacheはデフォルトで無効になっています。Varnish Cacheは手動で有効または無効にできます。設定するには、**Nodes** → CDN nodeメニュー → **Enable Varnish Cache** または **Disable Varnish Cache** に進んでください。

## ノードの削除

フィルタリングノードが削除されると、ドメインへのリクエストのフィルタリングが停止されます。フィルタリングノードの削除は元に戻すことができません。Wallarm nodeはノード一覧から永久に削除されます。

1. 保護対象ドメインのDNSレコードからWallarm CNAMEレコードを削除してください。

    !!! warning "不正リクエストの軽減が停止されます"
        CNAMEレコードが削除され、インターネット上で変更が反映されると、Wallarm CDN nodeはリクエストのプロキシングを停止し、正当なトラフィックと不正なトラフィックが直接保護対象リソースに到達します。

        削除されたDNSレコードが反映されたにもかかわらず、新しいノードバージョン用に生成されたCNAMEレコードがまだ反映されていない場合、保護対象サーバーの脆弱性が悪用されるリスクが生じます。
1. 変更が伝播するのを待ってください。実際のCNAMEレコードの状態は、Wallarm Console → **Nodes** → **CDN** → **Delete node** に表示されます。
1. ノード一覧からCDN nodeを削除してください。

![Deleting the node](../../images/user-guides/nodes/delete-cdn-node.png)

## CDNノードのトラブルシューティング

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"