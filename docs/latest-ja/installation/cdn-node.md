[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../user-guides/rules/wallarm-mode-rule.md
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resource
[rules-docs]:                       ../user-guides/rules/intro.md
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

# Wallarm CDNノードの展開

アプリケーションのインフラストラクチャに第三者のコンポーネントを設置せずに、Wallarm CDNノードをリバースプロキシとして運用し、悪意のあるトラフィックを軽減します。

!!! info "無料枠のCDNノード"
    [無料枠プラン](../about-wallarm/subscription-plans.md#free-tier-subscription-plan-us-cloud)では、CDNノードタイプの展開はサポートされていません。

## CDNノードの仕組み

--8<-- "../include-ja/waf/installation/cdn-node/how-cdn-node-works.md"

## 要件

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDNノードの展開

1. Wallarm Consoleを開き、**Nodes** → **CDN** → **Create node**を選択。
1. 保護するドメインアドレスを入力します。例：`ple.example.com`。

    指定されたアドレスは、3レベル（以下）のドメインであり、スキームやスラッシュを含まない必要があります。
1. Wallarmが指定されたドメインに関連付けられたオリジンアドレスを正しく識別していることを確認してください。そうでない場合は、自動的に検出されたオリジンアドレスを変更してください。

    ![!CDN node creation modal][cdn-node-creation-modal]

    !!! warning "オリジンアドレスの動的更新"
        ホスティングプロバイダーが保護リソースに関連付けられたオリジンIPアドレスまたはドメインを動的に更新する場合は、CDNノード設定のオリジンアドレスを最新の状態に保ってください。Wallarm Consoleでは、いつでも[オリジンアドレスを変更][update-origin-ip-docs]できます。

        そうでない場合、リクエストは保護リソースに到達せず、CDNノードが誤ったオリジンアドレスにプロキシしようとします。
1. CDNノードの登録が完了するのを待ちます。

    CDNノードの登録が完了すると、CDNノードのステータスが**Requires CNAME**に変更されます。
1. Wallarmが生成したCNAMEレコードを、保護されたドメインのDNSレコードに追加します。

    ドメインにすでにCNAMEレコードが設定されている場合は、Wallarmが生成した値に置き換えてください。

    ![!CDN node creation modal][cname-required-modal]

    DNSプロバイダーによっては、DNSレコードの変更がインターネット上で効力を発揮し、伝播するまでに最大24時間かかることがあります。新しいCNAMEレコードが伝播されると、WallarmのCDNノードは保護されたリソースへのすべての入力リクエストをプロキシし、悪意のあるものをブロックします。
1. 必要に応じて、カスタムSSL/TLS証明書をアップロードします。

    WallarmはデフォルトでCDNノードドメイン用のLet's Encrypt証明書を生成します。
1. DNSレコードの変更が伝播したら、保護されたドメインにテスト攻撃を送信します。

    ```bash
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    * 発信元IPアドレスが[グレーリスト][graylist-docs]に登録されている場合、ノードは攻撃をブロック（HTTPレスポンスコードは403）し、記録します。
    * 発信元IPアドレスが[グレーリスト][graylist-docs]に登録されていない場合、ノードは検出された攻撃を記録するだけです。攻撃がWallarm Console → **Events**に登録されたことを確認できます。
    
        ![!Attacks in the interface][attacks-in-ui]

## 次のステップ

Wallarm CDNノードが正常に展開されました！

Wallarmの設定オプションについて学びます。

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDNノードのトラブルシューティング

--8<-- "../include-ja/waf/installation/cdn-node/cdn-node-troubleshooting.md"