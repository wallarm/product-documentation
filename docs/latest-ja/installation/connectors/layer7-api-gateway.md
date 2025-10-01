[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Broadcom Layer7 API Gateways

Broadcomの[Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways)は、組織のAPIトラフィックを制御・保護するための堅牢なソリューションを提供します。Wallarmはコネクタとして機能し、Broadcom Layer7 API Gatewaysで管理されるAPIのセキュリティを強化できます。

Broadcom Layer7 API GatewayのコネクタとしてWallarmを使用するには、Wallarm Nodeを外部にデプロイし、ゲートウェイ上にWallarmポリシーを設定して、解析のためにトラフィックをWallarm Nodeへ転送する必要があります。

Broadcomコネクタは[インライン](../inline/overview.md)のトラフィックフローのみをサポートします。

<!-- The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png) -->

## ユースケース

このソリューションは、APIをLayer7 API Gatewaysで管理している場合に推奨します。

## 制限事項

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## 要件

デプロイを進めるにあたり、以下の要件を満たしていることを確認します。

* Broadcom Layer7 API Gateways製品について理解していること。
* アプリケーションとAPIがBroadcom Layer7 API Gatewaysに連携し稼働していること。
* Broadcom Policy Managerがインストールされ、Broadcom Gatewayに接続されていること。

## デプロイ

### <a name="1-deploy-a-wallarm-node"></a>1. Wallarm Nodeをデプロイします

Wallarm NodeはWallarmプラットフォームの中核コンポーネントで、受信トラフィックを検査し、不正なアクティビティを検出し、脅威の軽減を行うように設定できます。

以下のいずれかのアーティファクトを使用して、独自インフラ内に独立したサービスとしてデプロイします。

* Linuxインフラ（ベアメタルまたはVMs）向けの[All-in-oneインストーラー](../native-node/all-in-one.md)
* コンテナ化デプロイを使用する環境向けの[Dockerイメージ](../native-node/docker-image.md)
* AWSインフラ向けの[AWS AMI](../native-node/aws-ami.md)
* Kubernetesを利用するインフラ向けの[Helmチャート](../native-node/helm-chart.md)

### 2. NodeのSSL/TLS証明書をPolicy Managerに追加します

Broadcom GatewayがHTTPS経由でWallarm Nodeにトラフィックをルーティングできるように、NodeのSSL/TLS証明書をPolicy Managerに追加します。

1. Broadcom Policy Managerを開き、→ **Tasks** → **Certificates, Keys and Secrets** → **Manage Certificates**を選択します。
1. **Add** → **Retrieve via SSL**をクリックし、[Wallarm Nodeのアドレス](#1-deploy-a-wallarm-node)を指定します。

### 3. Wallarmポリシーを取得してデプロイします

Broadcom GatewayがトラフィックをWallarm Node経由でルーティングするように設定します。

1. sales@wallarm.comに連絡して、Wallarmポリシーのコードバンドルを入手します。
1. Broadcom Policy Managerを開き、Broadcom Gatewayのメニューで**Create Policy**を選択し、次の2つのポリシーを追加します。

    * **リクエスト転送ポリシー**: タイプに`Global Policy Fragment`、タグに`message-received`を設定します。

        ![](../../images/waf-installation/gateways/layer7/request-policy.png)
    
    * **レスポンス転送ポリシー**: タイプに`Global Policy Fragment`、タグに`message-completed`を設定します。
    
        ![](../../images/waf-installation/gateways/layer7/response-policy.png)
1. <a name="import-new-broadcom-policies"></a>リクエスト転送ポリシー（この例では`forward-requests-to-wallarm`）について:

    1. `wallarm-request-blocking.xml`ファイルをインポートします。
    1. `wlrm-node-addr`パラメータに[Wallarm Nodeインスタンス](#1-deploy-a-wallarm-node)のアドレスを指定します。
    1. ポリシーを**Save and Active**します。

    ![](../../images/waf-installation/gateways/layer7/request-policy-assertion.png)
1. レスポンス転送ポリシー（この例では`forward-responses-to-wallarm`）について:

    1. `wallarm-response.xml`ファイルをインポートします。
    1. ポリシーを**Save and Active**します。

## テスト

デプロイしたポリシーの機能をテストするには、次の手順に従います。

1. テスト用の[パストトラバーサル][ptrav-attack-docs]攻撃を含むリクエストをGatewayのアドレスに送信します。

    ```
    curl http://<YOUR_GATEWAY_ADDRESS>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクションの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)を開き、攻撃がリストに表示されていることを確認します。
    
    ![インターフェースのAttacks][attacks-in-ui-image]

    Wallarm Nodeのモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定されている場合、リクエストもブロックされます。

## Wallarmポリシーのアップグレード

Broadcom上にデプロイ済みのWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#broadcom-layer7-api-gateway)にアップグレードするには:

1. sales@wallarm.comに連絡して、更新されたコードバンドルを入手します。
1. [デプロイ手順](#import-new-broadcom-policies)に従って、更新済みポリシーファイルをPolicy Managerの既存のポリシーインスタンスにインポートします。
1. ポリシーのパラメータを正しい値で設定します。
1. 更新後のポリシーを**Save and Activate**します。

ポリシーのアップグレードでは、特にメジャーバージョンの更新時にWallarm Nodeのアップグレードが必要になる場合があります。リリース情報とアップグレード手順は、[Wallarm Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照します。将来のアップグレードを容易にし非推奨を避けるため、Nodeを定期的に更新することを推奨します。