[cdn-node-operation-scheme]:        ../images/waf-installation/quickstart/cdn-node-scheme.png
[data-to-wallarm-cloud-docs]:       ../user-guides/rules/sensitive-data-rule.md
[operation-modes-docs]:             ../admin-en/configure-wallarm-mode.md
[operation-mode-rule-docs]:         ../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console
[wallarm-cloud-docs]:               ../about-wallarm/overview.md#cloud
[cdn-node-creation-modal]:          ../images/waf-installation/quickstart/cdn-node-creation-modal.png
[cname-required-modal]:             ../images/waf-installation/quickstart/cname-required-modal.png
[attacks-in-ui]:                    ../images/admin-guides/test-attacks-quickstart.png
[user-roles-docs]:                  ../user-guides/settings/users.md
[update-origin-ip-docs]:            ../user-guides/nodes/cdn-node.md#updating-the-origin-address-of-the-protected-resourse
[rules-docs]:                       ../user-guides/rules/rules.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[integration-docs]:                 ../user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     ../user-guides/triggers/triggers.md
[application-docs]:                 ../user-guides/settings/applications.md
[nodes-ui-docs]:                    ../user-guides/nodes/cdn-node.md
[events-docs]:                      ../user-guides/events/check-attack.md
[graylist-populating-docs]:         ../user-guides/ip-lists/overview.md
[graylist-docs]:                    ../user-guides/ip-lists/overview.md
[link-app-conf]:                    ../user-guides/settings/applications.md
[varnish-cache]:                    #why-is-there-a-delay-in-the-update-of-the-content-protected-by-the-cdn-node
[using-varnish-cache]:              ../user-guides/nodes/cdn-node.md#using-varnish-cache

# Section.ioを利用したWallarmノードのデプロイ

[Section](https://www.section.io/)は、Wallarmノードの簡単なデプロイを可能にするクラウドネイティブホスティングシステムです。リバースプロキシとしてトラフィックをルーティングすることで、アプリケーションのインフラにサードパーティコンポーネントを追加することなく、悪意あるトラフィックを効果的に軽減できます。

## ユースケース

すべてのサポートされる[Wallarmデプロイメントオプション](supported-deployment-options.md)の中で、このソリューションは以下の**ユースケース**に最適です:

* 軽量サービスを保護するために、迅速かつ容易にデプロイできるセキュリティソリューションを求めている場合です。
* ホスティングインフラ内にWallarmノードをデプロイする能力が不足している場合です。
* Wallarmフィルタリングノードの管理や保守を避け、自動化されたデプロイを希望する場合です。

## 制限事項

このソリューションには以下の制限があります:

* 高トラフィックの解析およびフィルタリングには、CDNノードの使用は推奨されません。
* [Free tierプラン](../about-wallarm/subscription-plans.md#free-tier)では、CDNノードタイプのデプロイはサポートされません。
* CDNノードでは、3階層目（またはそれ以下、例: 4階層、5階層など）のドメインのみ保護できます。たとえば、`ple.example.com`のCDNノードは作成できますが、`example.com`は作成できません。
* [`collectd` service](../admin-en/monitoring/intro.md)はサポートされません。
* 標準手順による[アプリケーションセットアップ](../user-guides/settings/applications.md)は利用できません。設定の支援については、[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。
* [カスタムブロックページとエラーコード](../admin-en/configuration-guides/configure-block-page-and-code.md)は設定できません。デフォルトでは、CDNノードはブロックされたリクエストに対して403レスポンスコードを返します。

## 必要条件

--8<-- "../include/waf/installation/cdn-node/cdn-node-deployment-requirements.md"

## CDNノードの動作

--8<-- "../include/waf/installation/cdn-node/how-cdn-node-works.md"

## CDNノードのデプロイ

1. Wallarm Console → **Nodes** → **CDN** → **Create node** を開きます。
1. 保護するドメインアドレス（例：`ple.example.com`）を入力します。

    指定されたアドレスは3階層目（またはそれ以下）のドメインであり、スキームやスラッシュを含んではいけません。
1. Wallarmが指定されたドメインに関連付けられた起源アドレスを正確に識別できることを確認します。そうでない場合は、自動検出された起源アドレスを変更してください。

    ![CDNノード作成モーダル][cdn-node-creation-modal]

    !!! warning "起源アドレスの動的更新"
        ホスティングプロバイダーが保護対象リソースに関連付けられた起源IPアドレスまたはドメインを動的に更新する場合、CDNノード設定で指定された起源アドレスを最新の状態に保つ必要があります。Wallarm Consoleでは、[起源アドレスの変更][update-origin-ip-docs]が可能です。

        さもなければ、CDNノードは誤った起源アドレスへプロキシしようとするため、リクエストが保護対象リソースに到達しなくなります。
1. CDNノードの登録完了を待ちます。

    登録が完了すると、CDNノードのステータスは**Requires CNAME**に変更されます。
1. Wallarmによって生成されたCNAMEレコードを保護対象ドメインのDNSレコードに追加します。

    既にドメイン用にCNAMEレコードが設定されている場合は、その値をWallarmによって生成されたものに置き換えてください。

    ![CDNノード作成モーダル][cname-required-modal]

    DNSプロバイダーによっては、DNSレコードの変更がインターネットに伝播して反映されるまで、最大24時間かかる場合があります。新しいCNAMEレコードが伝播されると、Wallarm CDNノードが保護対象リソースへのすべてのリクエストをプロキシし、悪意あるリクエストをブロックします。
1. 必要に応じて、カスタムSSL/TLS証明書をアップロードします。

    デフォルトでは、WallarmがCDNノードドメイン用にLet's Encrypt証明書を生成します。
1. DNSレコードの変更が伝播された後、保護対象ドメインに対してテスト攻撃を送信します:

    ```bash
    curl http://<PROTECTED_DOMAIN>/etc/passwd
    ```

    * 発信元IPアドレスが[graylisted][graylist-docs]の場合、ノードは攻撃をブロック（HTTPレスポンスコード403）し、記録も行います。
    * 発信元IPアドレスが[graylisted][graylist-docs]でない場合、ノードは検出された攻撃のみを記録します。Wallarm Consoleの**Attacks**で攻撃が登録されているか確認できます:
    
        ![UI上の攻撃][attacks-in-ui]

## 次のステップ

Wallarm CDNノードのデプロイに成功しました!

Wallarmの設定オプションについて、以下をご参照ください:

--8<-- "../include/waf/installation/cdn-node/cdn-node-configuration-options.md"

## CDNノードのトラブルシューティング

--8<-- "../include/waf/installation/cdn-node/cdn-node-troubleshooting.md"