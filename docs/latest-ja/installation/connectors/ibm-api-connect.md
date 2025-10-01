[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/waf-installation/gateways/ibm/test-attack-ui.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# IBM API Connect向けWallarmコネクタ

[IBM API Connect](https://www.ibm.com/products/api-connect)は、APIの作成、保護、管理、監視のためのツールを含むフルライフサイクルのAPI管理ソリューションです。Wallarmはコネクタとして使用でき、IBM API Connectで管理されるAPIトラフィックを検査し、不正リクエストを軽減することでAPIを保護します。

WallarmをIBM API Connectと統合するには、外部にWallarm Nodeをデプロイし、検査のためにIBM API Gatewayがトラフィックをそのノードへプロキシするように構成します。

IBM API Connect向けWallarmコネクタは[インライン](../inline/overview.md)トラフィック解析のみをサポートします:

![](../../images/waf-installation/gateways/ibm/ibm-traffic-flow-inline.png)

!!! info "API仕様に一致するリクエスト"
    IBM API Connectの動作により、定義されたOpenAPIのパスに一致するリクエストのみがWallarm Nodeによって検査されます。

## ユースケース

このソリューションは、IBM API Connect経由で公開されるAPIの保護に推奨されます。

## 制限事項

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## 要件

デプロイを進める前に、以下の要件を満たしていることを確認してください。

* IBM API ConnectおよびIBM DataPower Gatewayの知識があること。
* 稼働中のIBM API Connect環境（ローカルまたはクラウド管理）。
* IBM API Connectで公開済みのAPI。
* コマンドライン操作用のIBM API Toolkit（`apic`または`apic-slim`）がインストールされていること。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス権。
* 0.13.x系では0.13.3以降、または0.14.1以降のバージョンのWallarm Node。

## デプロイ

### 1. Wallarm Nodeをデプロイする

Wallarm NodeはWallarmプラットフォームの中核コンポーネントで、受信トラフィックを検査し、不正な挙動を検出し、脅威を軽減するように構成できます。

必要な管理レベルに応じて、Wallarmホスト型として、またはご自身のインフラストラクチャ内にデプロイできます。

!!! info "必須のWallarm Nodeバージョン"
    IBM API Connectとの統合には、Wallarm Nodeの[バージョン](../../updating-migrating/native-node/node-artifact-versions.md)として0.13.x系では0.13.3以降、または0.14.1以降が必要です。旧バージョンはこのコネクタをサポートしません。

=== "Edge node"
    コネクタ用のWallarmホスト型ノードをデプロイするには、[手順](../security-edge/se-connector.md)に従ってください。
=== "Self-hosted node"
    セルフホストノードをデプロイするためのアーティファクトを選択し、各手順に従ってください:

    * ベアメタルまたはVM上のLinux環境向けの[All-in-one installer](../native-node/all-in-one.md)
    * コンテナ化デプロイを使用する環境向けの[Docker image](../native-node/docker-image.md)
    <!-- * [AWS AMI](../native-node/aws-ami.md) for AWS infrastructures -->
    * Kubernetesを利用するインフラストラクチャ向けの[Helm chart](../native-node/helm-chart.md)

### 2. Wallarmポリシーを取得し、IBM API ConnectのAPIに適用する

Wallarmは、API ConnectのAPIに付与できるカスタムポリシーを提供します。これらのポリシーは、APIのリクエストおよびレスポンスをWallarm Node経由でプロキシし、検査と脅威検出を行います。

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**へ進み、プラットフォーム用のcode bundleをダウンロードします。

    セルフホストノードを実行している場合は、code bundle取得のためsales@wallarm.comまでご連絡ください。
1. リクエスト検査ポリシーを登録します:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. レスポンス検査ポリシーを登録します:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

多くの場合、`configured-gateway-service`の名前は`datapower-api-gateway`です。

### 3. アセンブリパイプラインにWallarmの検査ステップを統合する

API仕様の`x-ibm-configuration.assembly.execute`セクション内で、トラフィックをWallarm Node経由にルーティングするため、以下のステップを追加または更新します。

1. `invoke`ステップの前に、受信リクエストをWallarm Nodeへプロキシする`wallarm_pre`ステップを追加します。
1. `invoke`ステップを次のように構成してください:
    
    * `target-url`は`$(target-url)$(request.path)?$(request.query-string)`という形式にします。これにより、元のバックエンドのパスとクエリパラメータを保ったままリクエストがプロキシされます。
    * `header-control`および`parameter-control`では、すべてのヘッダーとパラメータの通過を許可します。これにより、Wallarm Nodeがリクエスト全体を解析し、あらゆる部分の攻撃を検出し、APIインベントリを正確に構築できます。
1. `invoke`ステップの後に、レスポンスをWallarm Nodeへプロキシして検査する`wallarm_post`ステップを追加します。

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

Wallarmポリシーでサポートされるプロパティ:

| パラメータ | ステップ名 | 説明 | 必須? |
| --------- | --------- | ---- | ----- |
| `wallarmNodeAddress` | `wallarm_pre`, `wallarm_post` | Wallarm NodeインスタンスのURL。 | はい |
| `failSafeBlock` | `wallarm_pre`, `wallarm_post` | `true`（デフォルト）の場合、リクエスト/レスポンス転送中にWallarm Nodeが利用不可であるかエラーを返した際に、リクエストまたはレスポンスをブロックします。 | いいえ |

### 4. 変更済みAPIを含むプロダクトを公開する

トラフィックフローへの変更を適用するには、変更したAPIを含むプロダクトを再公開します:

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```

## 例: Wallarmポリシーを適用したAPIとプロダクト

この例は、アセンブリに`wallarm_pre`、`invoke`、`wallarm_post`の各ステップ（リクエスト/レスポンス検査）を追加した基本的なAPIとプロダクト構成を示します。これをデプロイして、Wallarm Node経由のトラフィック検査をテストできます。

* API仕様:

```yaml
openapi: 3.0.3
info:
  title: Hello API
  version: 1.0.0
  x-ibm-name: hello-api
servers:
  - url: /
paths:
  /hello:
    get:
      summary: Say Hello
      responses:
        '200':
          description: OK
          content:
            text/plain:
              schema:
                type: string
x-ibm-configuration:
  properties:
    target-url:
      value: https://httpbin.org
      description: Where to proxy the filtered traffic
      encoded: false
  type: rest
  phase: realized
  enforced: true
  testable: true
  cors:
    enabled: true
  gateway: datapower-api-gateway
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
  activity-log:
    enabled: true
    success-content: activity
    error-content: payload
```

* プロダクト仕様:

```yaml
product: 1.0.0
info:
  name: hello-product
  title: Hello Product
  version: 1.0.0
  description: A basic product exposing Hello API
apis:
  hello-api:
    $ref: ./api.yaml
plans:
  default:
    title: Default Plan
    description: Open access plan
    approval: false
    rate-limit:
      value: unlimited
    apis:
      hello-api: {}
visibility:
  view:
    enabled: true
    type: public
  subscribe:
    enabled: true
    type: authenticated
gateways:
  - datapower-api-gateway
```

## テスト

デプロイしたポリシーの機能をテストするには、次の手順に従います。

1. APIに対してテスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストを送信します:

    ```
    curl -k --request GET --url https://localhost:9444/<PATH ALLOWED BY SPEC> \
      --header 'X-IBM-Client-Id: <YOUR IBM CLIENT ID>' \
      --header 'accept: /etc/passwd'
    ```

    IBM API Connectの動作により、定義されたOpenAPIのパスに一致するリクエストのみがWallarm Nodeによって検査されます。

1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で**Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェイスのAttacks][attacks-in-ui-image]

    Wallarm nodeのモードが[in blocking](../../admin-en/configure-wallarm-mode.md)で、トラフィックがインラインで流れている場合は、リクエストもブロックされます（スクリーンショットはこのケースを示しています）。

## ポリシーのアップグレード

デプロイ済みのWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#ibm-api-connect)へアップグレードするには:

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**から、IBM向けの更新済みWallarmポリシーをダウンロードします。

    セルフホストノードを実行している場合は、更新済みのcode bundle取得のためsales@wallarm.comまでご連絡ください。
1. `policies:create`コマンドで各ポリシーを再登録し、更新された`.zip`ファイルを指定します:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. `wallarm-post.zip`についても同様に実施します。
1. API仕様内の`x-ibm-configuration.assembly.execute`で、ポリシーのバージョンを更新します:

    ```yaml
    ...
    x-ibm-configuration:
      ...
      assembly:
        execute:
          - wallarm_pre:
              version: <NEW_VERSION>
          ...
          - wallarm_post:
              version: <NEW_VERSION>
    ...
    ```

    両ポリシーは同一のバージョン番号を使用します。
1. `products:publish`コマンドを使用して、関連するプロダクトを再公開します。

    ```
    apic products:publish \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        <PATH TO THE UPDATED PRODUCT YAML>
    ```

ポリシーのアップグレードでは、特にメジャーバージョンの更新時にWallarm Nodeのアップグレードが必要な場合があります。セルフホストNodeのリリースノートおよびアップグレード手順は[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)をご参照ください。Wallarmホスト型の場合は[Edgeコネクタのアップグレード手順](../security-edge/se-connector.md#upgrading-the-edge-node)をご覧ください。非推奨を避け、将来のアップグレードを容易にするため、定期的なNodeの更新を推奨します。