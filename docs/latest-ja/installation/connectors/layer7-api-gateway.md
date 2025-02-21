```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Broadcom Layer7 API Gateways

Broadcomの[Layer7 API Gateways](https://www.broadcom.com/products/software/api-management/layer7-api-gateways)は、組織のAPIトラフィックを制御および保護するための堅牢なソリューションを提供します。Wallarmは、Broadcom Layer7 API Gatewaysで管理されるAPIのセキュリティを強化するためのコネクタとして機能します。

WallarmをBroadcom Layer7 API Gatewayのコネクタとして使用するには、**Wallarm Nodeを外部でデプロイ**し、トラフィックをWallarm Nodeへ解析のためにルーティングするようゲートウェイにWallarmポリシーを**構成**する必要があります。

Broadcomコネクタは、[インライン](../inline/overview.md)のトラフィックフローのみ対応します。

<!-- The Wallarm policy for Layer7 API Gateways supports the [out-of-band](../oob/overview.md) mode. Diagram below shows the traffic flow for APIs on the Layer7 API Gateways with Wallarm policy applied.

![Layer7 API Gateways with Wallarm image](../../images/waf-installation/gateways/layer7/traffic-flow-oob.png) -->

## ユースケース

すべての[Wallarmデプロイメントオプション](../supported-deployment-options.md)の中で、APIをLayer7 API Gatewaysで管理している場合にこのソリューションを推奨します。

## 制限事項

* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません。

## 必要条件

デプロイを進めるため、以下の必要条件を満たしていることを確認してください:

* Broadcom Layer7 API Gateways製品に関する知識があること。
* アプリケーションおよびAPIがBroadcom Layer7 API Gateways上で連携して稼働していること。
* Broadcom Policy Managerがインストールされ、Broadcom Gatewayに接続されていること。

## デプロイメント

### 1. Wallarm Nodeをデプロイ

Wallarm NodeはWallarmプラットフォームの中核コンポーネントであり、デプロイが必要です。受信トラフィックを検査し、悪意のある活動を検出し、脅威を緩和するよう構成可能です。

以下のアーティファクトのいずれかを使用して、独自のインフラストラクチャ上の別サービスとしてデプロイしてください:

* [All-in-one installer](../native-node/all-in-one.md) (Linux環境、ベアメタルまたはVM向け)
* [Docker image](../native-node/docker-image.md) (コンテナ化されたデプロイメント環境向け)
* [Helm chart](../native-node/helm-chart.md) (Kubernetesを利用するインフラストラクチャ向け)

### 2. NodeのSSL/TLS証明書をPolicy Managerに追加

Broadcom GatewayがHTTPS経由でトラフィックをWallarm Nodeへルーティングできるよう、NodeのSSL/TLS証明書をPolicy Managerに追加してください:

1. Broadcom Policy Managerを開き、**Tasks** → **Certificates, Keys and Secrets** → **Manage Certificates**を選択します。
2. **Add** → **Retrieve via SSL**をクリックし、[Wallarm Nodeのアドレス](#1-deploy-a-wallarm-node)を指定します。

### 3. Wallarmポリシーの取得とデプロイ

Broadcom GatewayをWallarm Node経由でトラフィックをルーティングするよう構成するには:

1. Wallarmポリシーのコードバンドルを取得するためにsales@wallarm.comにお問い合わせください。
2. Broadcom Policy Managerを開き、対象のBroadcom Gatewayのメニューから**Create Policy**を選択し、2つのポリシーを追加します:

    * **リクエスト転送ポリシー**: `Global Policy Fragment`タイプと`message-received`タグを指定します。

        ![](../../images/waf-installation/gateways/layer7/request-policy.png)
    
    * **レスポンス転送ポリシー**: `Global Policy Fragment`タイプと`message-completed`タグを指定します。
    
        ![](../../images/waf-installation/gateways/layer7/response-policy.png)
3. <a name="import-new-broadcom-policies"></a>リクエスト転送ポリシーの場合（例: `forward-requests-to-wallarm`）:

    1. `wallarm-request-blocking.xml`ファイルをインポートします。
    2. `wlrm-node-addr`パラメーターに[Wallarm Nodeインスタンス](#1-deploy-a-wallarm-node)のアドレスを指定します。
    3. ポリシーを**Save and Active**してください。

    ![](../../images/waf-installation/gateways/layer7/request-policy-assertion.png)
4. レスポンス転送ポリシーの場合（例: `forward-responses-to-wallarm`）:

    1. `wallarm-response.xml`ファイルをインポートします。
    2. ポリシーを**Save and Active**してください。

## テスト

デプロイされたポリシーの機能をテストするには、以下の手順に従ってください:

1. ゲートウェイのアドレスに対して、テストの[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストを送信します:

    ```
    curl http://<YOUR_GATEWAY_ADDRESS>/etc/passwd
    ```
2. Wallarm Consoleを開き、[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションで、攻撃がリストに表示されていることを確認してください。
    
    ![Attacks in the interface][attacks-in-ui-image]

    Wallarm Nodeのモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定されている場合、リクエストはブロックされます。

## Wallarmポリシーのアップグレード

Broadcom上にデプロイされたWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#broadcom-layer7-api-gateway)にアップグレードするには:

1. 更新されたコードバンドルを取得するためにsales@wallarm.comにお問い合わせください。
2. [デプロイ手順](#import-new-broadcom-policies)に記載のとおり、Policy Manager内の既存のポリシーインスタンスに更新されたポリシーファイルをインポートしてください。
3. 正しい値でポリシーパラメーターを構成してください。
4. 更新されたポリシーを**Save and Activate**してください。

ポリシーのアップグレードは、特に大きなバージョンアップの場合、Wallarm Nodeのアップグレードを必要とすることがあります。リリースアップデートとアップグレードの手順については、[Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。将来のアップグレードの簡素化と非推奨の回避のため、定期的なNodeのアップデートを推奨します。
```