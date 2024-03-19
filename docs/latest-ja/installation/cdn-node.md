[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../admin-en/configure-wallarm-mode.md
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/graylist.md#managing-graylist
[graylist-docs]:                    ../user-guides/ip-lists/graylist.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Section.ioとともにWallarm Nodeをデプロイする

[Section](https://www.section.io/)は、Wallarmノードの簡単なデプロイを可能にするクラウドネイティブホスティングシステムです。逆プロキシとしてトラフィックをルーティングすることで、アプリケーションのインフラストラクチャにサードパーティのコンポーネントを追加することなく、悪意のあるトラフィックを効果的に軽減できます。

!!! info "無料プラン下のCDNノード"
   CDNノードタイプのデプロイは、[無料プラン](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud)ではサポートされていません。

## CDNノードの仕組み

--8<-- "../include-ja/waf/installation/cdn-node/how-cdn-node-works.md"

## 必要条件

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDNノードのデプロイ

1. Wallarm Consoleを開き、**ノード** → **CDN** → **ノードを作成**をクリックします。
1. CDNノードによって保護されるドメインアドレスを入力します（例：`ple.example.com`）。

    指定するアドレスは、スキームとスラッシュを含まないサードレベル（またはそれ以下）のドメインでなければなりません。
1. Wallarmが指定されたドメインに関連付けられたオリジンアドレスを正しく識別していることを確認します。そうでない場合、自動的に発見されたオリジンアドレスを変更してください。

    ![CDN node creation modal][cdn-node-creation-modal]

    !!! warning "オリジンアドレスのダイナミックな更新"
       保護リソースに関連付けられたオリジンIPアドレスまたはドメインをホストプロバイダーが動的に更新する場合は、CDNノード設定で指定されたオリジンアドレスを常に最新の状態に保つ必要があります。Wallarm Consoleを使用すると、いつでも[オリジンアドレスを変更][update-origin-ip-docs]できます。

       それを行わない場合、リクエストはCDNノードがそれらを誤ったオリジンアドレスにプロキシしようとするため、保護リソースに到達しません。
1. CDNノードの登録が完了するのを待ちます。

    CDNノードの登録が完了すると、CDNノードのステータスが**CNAMEが必要**に変更されます。
1. Wallarmが生成したCNAMEレコードを保護するドメインのDNSレコードに追加します。

    もしドメインのために既にCNAMEレコードが設定済みの場合、その値をWallarmが生成するものに取り換えてください。

    ![CDN node creation modal][cname-required-modal]

    DNSプロバイダーによりますが、DNSレコードの変更はインターネット上で効果を発揮し広がるのに最大24時間かかることがあります。新しいCNAMEレコードが広がったら、WallarmのCDNノードはすべての着信リクエストを保護スパイスにプロキシし、悪意のあるものをブロックします。
1. 必要であれば、カスタムのSSL/TLS証明書をアップロードします。

    WallarmはデフォルトでCDNノードドメインのLet's Encrypt証明書を生成します。
1. DNSレコードの変更が広がったら、保護するドメインに対してテスト攻撃を送ります：

    ```bash
    curl http://<保護されるドメイン>/etc/passwd
    ```

    * もしも送り元のIPアドレスが[グレーリストに載っている][graylist-docs]場合、ノードは攻撃をブロックし（HTTPレスポンスコードは403）、記録します。
    * もしも送り元のIPアドレスが[グレーリストに載っていない][graylist-docs]場合、ノードは検出された攻撃を記録だけします。攻撃が登録されたことはWallarm Consoleから**イベント**で確認できます：

        ![Attacks in the interface][attacks-in-ui]

## 次のステップ

WallarmのCDNノードは成功にデプロイされました！

Wallarmの設定オプションを学びましょう：

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDNノードのトラブルシューティング

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-troubleshooting.md"
