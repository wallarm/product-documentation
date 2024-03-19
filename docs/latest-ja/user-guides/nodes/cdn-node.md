[cdn-node-operation-scheme]:        ../../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../rules/sensitive-data-rule.md
[operation-modes-docs]:             ../../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../../admin-en/configure-wallarm-mode.md
[wallarm-cloud-docs]:               ../../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../settings/users.md
[update-origin-ip-docs]:            #updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../rules/rules.md
[ip-lists-docs]:                    ../ip-lists/overview.md
[integration-docs]:                 ../settings/integrations/integrations-intro.md
[trigger-docs]:                     ../triggers/triggers.md
[application-docs]:                 ../settings/applications.md
[events-docs]:                      ../events/check-attack.md
[graylist-populating-docs]:         ../ip-lists/graylist.md#managing-graylist
[link-app-conf]:                    ../settings/applications.md
[using-varnish-cache]:              #using-varnish-cache

# CDNフィルタリングノード

Wallarm Console UIの**ノード**セクションでは、[**Wallarm node**](nodes.md)と**CDNノード**タイプのノードを管理することができます。この記事はCDNノードについて説明します。

!!! info "無料プランの下でのCDNノード"
    CDNノードタイプのデプロイは、[無料プラン](../../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud)ではサポートされていません。

--8<-- "../include-ja/waf/installation/cdn-node/how-cdn-node-works.md"

## ノードの作成

CDNノードを作成するには、[手順](../../installation/cdn-node.md)に従ってください。

## ノードの詳細閲覧

インストールされたノードの詳細は、各ノードのテーブルとカードに表示されます。カードを開くには、適切なテーブルレコードをクリックします。

以下のノードのプロパティとメトリックスが利用可能です：

* 保護されたドメインの名前に基づいて生成されたノード名
* ノードのIPアドレス
* 保護されたドメインに関連付けられた原点アドレス
* ユニークなノード識別子（UUID）
* ノードのステータス
* SSL/TLS証明書: Wallarmによって生成されたLet's Encryptまたはカスタム証明書
* フィルタリングノードとWallarm Cloudの最終同期時間
* フィルタリングノードの作成日
* 現在の月にノードによって処理されたリクエスト数
* 使用されるcustom_rulesetとproton.dbのバージョン
* インストールされたWallarmパッケージのバージョン
* 利用可能なコンポーネント更新のインジケーター

![CDNノードカード](../../images/user-guides/nodes/view-cdn-node-comp-vers.png)

## 保護されたリソースの原点アドレスの更新

もし、あなたのホスティングプロバイダーが動的に原点IPアドレスや保護リソースに関連付けられたドメインを更新する場合は、CDNノード設定で指定された原点アドレスを常に最新のものにしてください。そうしないと、リクエストは保護リソースに到達せず、CDNノードが間違った原点アドレスにプロキシしようとします。

原点のアドレスを更新するには、**原点アドレスを編集**のオプションを使用します。

## カスタムSSL/TLS証明書のアップロード

Wallarmは、CDNノードドメインでHTTPSを有効にするための[Let's Encrypt](https://letsencrypt.org/)証明書を自動的に発行します。証明書は必要に応じて自動的に生成および更新されます。

もし、あなたが保護されたドメインの証明書をすでに所有していて、それをLet's Encrypt証明書よりも優先したい場合は、**SSL/TLS証明書を更新**のオプションを使用して、あなた自身の証明書をアップロードすることができます。

## Varnish Cacheの使用

[Varnish Cache](https://varnish-cache.org/intro/index.html#intro) HTTPアクセラレータを使ったCDNノードの利用は、ユーザー（例えば、あなたのサーバーのレスポンス）に対するコンテンツ配信を高速化します。しかし、あなたがコンテンツを変更した場合、CDN上のキャッシュされたコピーが遅延して更新され、[問題](#why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node)を引き起こし、Varnish Cacheを無効にする理由となるかもしれません。

コンテンツの更新速度に関する問題を避けるために、Varnish Cacheはデフォルトで無効になっています。Varnish Cacheを手動で有効/無効にすることができます。そうするには、**ノード** → CDNノードメニュー → **Varnish Cacheを有効にする**または**Varnish Cacheを無効にする**に進みます。

## ノードの削除

フィルタリングノードが削除されると、あなたのドメインへのリクエストのフィルタリングが停止します。フィルタリングノードの削除は元に戻すことができません。Wallarmノードはノードリストから完全に削除されます。

1. 保護されたドメインのDNSレコードからWallarm CNAMEレコードを削除します。

    !!! warning "悪意のあるリクエストの軽減が停止します"
        CNAMEレコードが削除され、インターネット上で変更が有効になると、Wallarm CDNノードはリクエストのプロキシを停止し、正当なトラフィックと悪意のあるトラフィックは直接保護リソースに到達します。

        これは、削除されたDNSレコードが有効になり、新しいノードバージョン用に生成されたCNAMEレコードがまだ有効になっていないときに、保護サーバーの脆弱性が悪用されるリスクを生じます。
1. 変更が伝播するのを待ちます。実際のCNAMEレコードのステータスは、Wallarm Console → **ノード** → **CDN** → **ノードを削除**で表示されます。
1. ノードリストからCDNノードを削除します。

![ノードの削除](../../images/user-guides/nodes/delete-cdn-node.png)

## CDNノードのトラブルシューティング

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-troubleshooting.md"