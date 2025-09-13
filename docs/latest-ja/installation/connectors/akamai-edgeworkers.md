[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Akamai向けWallarmコネクタ

[Akamai CDN](https://www.akamai.com/solutions/content-delivery-network)のプロパティを通じてAPIを配信しているお客様向けに、Wallarmは専用のEdgeWorkerコードバンドルを提供します。このEdgeWorkerをデプロイすると、リクエストはオリジンに到達する前に検査と保護のためWallarmノードへルーティングされます。この方法により、オリジンのインフラを変更することなく、エッジでAPIトラフィックを直接保護できます。

AkamaiのコネクタとしてWallarmを使用するには、Wallarmノードを外部にデプロイし、AkamaiでWallarm提供のコードバンドルを適用して、トラフィックをWallarmノードへ解析のためにルーティングする必要があります。

Akamai向けWallarmコネクタは、[同期（インライン）](../inline/overview.md)と[非同期（アウトオブバンド）](../oob/overview.md)の両方のトラフィック解析をサポートします:

=== "同期トラフィックフロー"
    ![!Wallarm EdgeWorkerを用いたAkamaiの同期トラフィックフロー](../../images/waf-installation/gateways/akamai/traffic-flow-sync.png)
=== "非同期トラフィックフロー"
    ![!Wallarm EdgeWorkerを用いたAkamaiの非同期トラフィックフロー](../../images/waf-installation/gateways/akamai/traffic-flow-async.png)

## ユースケース

このソリューションは、Akamai CDN経由で配信されるAPIの保護に適しています。

## 制限事項

Akamai向けWallarmコネクタにはいくつかの制限があります:

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

加えて、以下の[EdgeWorkersプラットフォームの制約](https://techdocs.akamai.com/edgeworkers/docs/limitations)がコネクタ設計に影響します:

* **httpRequestドメイン制限** – EdgeWorkerからのサブリクエストは、すでにAkamaiが配信しているドメイン（すなわち、設定済みのプロパティ）を宛先にする必要があります
* **HTTPSのみのサブリクエスト** – 別のプロトコルが指定されている場合、EdgeWorkersは自動的にHTTPSへ変換します
* **イベントモデルの制限** – リクエストおよびレスポンスのボディは`responseProvider`イベント内でのみアクセス可能です

これらの制約により、Wallarm EdgeWorkerは同じプロパティへサブリクエストを発行する`responseProvider`関数として実装されています。このサブリクエストにはカスタムヘッダー`x-wlrm-checked`が含まれ、無限ループを防止し、トラフィックをWallarmノードへルーティングできるようにします。

## 要件

Akamai上にWallarm EdgeWorkerをデプロイするには、以下の要件を満たしてください:

* Akamaiの各種テクノロジーの理解
* 契約でAkamai EdgeWorkersが[有効化](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract)されていること
* オリジンバックエンドの用意

    * 到達可能なオリジンサーバー上でAPIサービスが稼働していること
    * オリジンドメインがCNAMEレコードでAkamaiのプロパティホスト名に解決すること
* 保護対象のオリジンへトラフィックを転送するよう構成されたAkamaiプロパティ

    * プロパティには**Default Rule**に**Origin Server** behaviorを含める必要があります
    * プロパティに配信対象ホスト用の有効なTLS証明書が必要です
* DNSゾーン（例: `customer.com`）を管理でき、Wallarmノード用プロパティに割り当てる専用サブドメイン（例: `node.customer.com`）を用意できること

    プロパティの作成後、AkamaiはEdge Hostname（例: `node.customer.com.edgesuite.net`）を返します。DNSに、選択したサブドメインをこのEdge Hostnameへ向ける**CNAMEレコード**を作成する必要があります。

## デプロイ

### 1. Wallarmノードをデプロイ {#1-deploy-a-wallarm-node}

WallarmノードはWallarmプラットフォームの中核コンポーネントであり、デプロイが必要です。受信トラフィックを検査し、悪意のある活動を検出し、脅威を緩和するように設定できます。

Akamaiコネクタの場合、ノードはお客様のインフラ内にのみデプロイできます。 

セルフホスト型ノードのデプロイに使用するアーティファクトを選択し、各手順に従ってください:

* LinuxのベアメタルまたはVMインフラ向けの[All-in-oneインストーラー](../native-node/all-in-one.md)
* コンテナ化デプロイを使用する環境向けの[Dockerイメージ](../native-node/docker-image.md)
* Kubernetesを利用するインフラ向けの[Helmチャート](../native-node/helm-chart.md)

!!! info "必要なNodeバージョン"
    AkamaiコネクタはNative Nodeの[バージョン0.16.3+](../../updating-migrating/native-node/node-artifact-versions.md)でのみサポートされます。

### 2. Wallarmコードバンドルを取得しEdgeWorkersを作成 {#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers}

Akamai EdgeWorkersでWallarmコードバンドルを取得して実行するには、次の手順に従ってください:

1. [support@wallarm.com](mailto:support@wallarm.com)に連絡し、Wallarmコードバンドルを入手します。
1. Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID**に進み、コードバンドル`wallarm-main`をインポートします。

    これは、リクエストをWallarmノード経由でルーティングするメインのEdgeWorkerです。
1. 別のEdgeWorker IDを作成し、`wallarm-sp`バンドルをインポートします。

    これはなりすまし防止のために推奨されるEdgeWorkerです。プロパティは不要です。

### 3. Wallarmノード用プロパティを作成

1. Akamai Property Managerで新しいプロパティを作成します:

    * **Property name / hostname**: 専用のノードホスト名（例: `node.customer.com`）。このホスト名はお客様が管理するDNSゾーンに属している必要があります。
    * **Property type**: `Dynamic Site Accelerator`
    * **Origin type**: `Web server`
    * **Origin Hostname**: デプロイ済みのWallarmノードの実際の[アドレス](#1-deploy-a-wallarm-node)
1. プロパティのTLSを構成します:

    * **Akamai Managed Certificate**を選択する（Akamaiが`node.customer.com`の証明書を発行・管理します）、または
    * 必要に応じて独自の証明書をアップロードします。
1. プロパティを保存します。AkamaiがEdge Hostnameを生成します。例:

    ```
    node.customer.com.edgesuite.net
    ```
1. DNSゾーンで、ノードホスト名をEdge Hostnameに向けるCNAMEレコードを作成します。例:

    ```
    node.customer.com → node.customer.com.edgesuite.net
    ```
1. [stagingでプロパティを有効化](https://techdocs.akamai.com/property-mgr/docs/activate-stage)して動作を確認し、続けて[productionで有効化](https://techdocs.akamai.com/property-mgr/docs/activate-prod)します。

![!AkamaiにおけるWallarmノード用プロパティ](../../images/waf-installation/gateways/akamai/wallarm-property.png)

### 4. オリジンプロパティで変数を設定

既存のオリジンプロパティを開き、→ **Edit New Version**で次の変数を設定します:

| 変数 | 説明 | 必須? |
| -------- | ----------- | --------- |
| `PMUSER_WALLARM_NODE` | `wallarm-main` EdgeWorker用に作成したプロパティ名 | はい |
| `PMUSER_WALLARM_HEADER_SECRET` | なりすまし防止のための任意のシークレット値（例: `aj8shd82hjd72hs9`）。`wallarm-main` EdgeWorkerが同じプロパティへリクエストをフォワードする際、ヘッダー`x-wlrm-checked`にこの値を設定します。`wallarm-sp` EdgeWorkerがヘッダーを検証し、一致しない場合はリクエストをブロックします。これにより無限ループを防ぎ、クライアントが偽のヘッダーを追加してWallarmのチェックを回避することを防止します。<br>秘密として保持し、他の用途で再利用しないでください。 | はい |
| `PMUSER_WALLARM_ASYNC` | トラフィックの処理モードを決定します。`false`はWallarmノードで直接処理します（同期）。`true`はトラフィックの[コピー](../oob/overview.md)を解析し、元のフローに影響を与えません（非同期）。デフォルト: `false`。 | いいえ |
| `PMUSER_WALLARM_INSPECT_REQ_BODY` | リクエストボディをWallarmノードへ送って解析するかどうかを制御します。デフォルト: `true`。 | いいえ |
| `PMUSER_WALLARM_INSPECT_RSP_BODY` | レスポンスボディをWallarmノードへ送って解析するかどうかを制御します。これによりレスポンススキーマのディスカバリーや、攻撃・脆弱性検出が強化されます。デフォルト: `true`。 | いいえ |

![!Akamaiのオリジンプロパティ向けWallarm変数](../../images/waf-installation/gateways/akamai/origin-property-variables.png)

**Set Variable** behaviorを使用すると、コネクタモードやボディ検査の設定をルート単位やファイルタイプ単位で詳細に調整できます。

### 5. Wallarm EdgeWorkerルールを追加

オリジンプロパティで空の新規ルールを作成します:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Behavior: EdgeWorkers → the `wallarm-main` EdgeWorker

より複雑な構成では、この条件にパスのチェックを組み合わせ（例: `/api/*`のパスにのみ適用）、APIトラフィックだけをWallarmで処理するようにできます。

### 6. なりすまし防止ルールを追加

オリジンプロパティでもう1つ空の新規ルールを作成します:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Behavior: EdgeWorkers → the `wallarm-sp` EdgeWorker

このルールは、ヘッダー`x-wlrm-checked`が`PMUSER_WALLARM_HEADER_SECRET`の値と一致することを保証します。一致しない値はブロックされ、クライアントがWallarmのチェックを回避することを防ぎます。

より複雑な構成では、この条件にパスのチェックを組み合わせ（例: `/api/*`のパスにのみ適用）、APIトラフィックだけをWallarmで処理するようにできます。

### 7. プロパティを保存して有効化

1. 新しいオリジンプロパティのバージョンを保存します。
1. [staging環境で有効化](https://techdocs.akamai.com/property-mgr/docs/activate-stage)します。
1. 検証後、[productionで有効化](https://techdocs.akamai.com/property-mgr/docs/activate-prod)します。

## テスト

デプロイしたEdgeWorkersの動作をテストするには、次の手順に従ってください:

1. Akamai CDNにテスト用の[Path Traversal][ptrav-attack-docs]攻撃を送信します:

    ```
    curl http://<AKAMAI_CDN>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクション（[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)）を開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェイスのAttacks][attacks-in-ui-image]

    Wallarmノードのモードがブロッキングに設定されている場合は、リクエストもブロックされます。

## Wallarm EdgeWorkersのアップグレード

デプロイ済みのWallarm EdgeWorkersを[新しいバージョン](code-bundle-inventory.md#akamai)へアップグレードするには:

1. `wallarm-main`用に[作成](#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)したEdgeWorkerへ移動します。
1. **Create Version**を押し、新しい`wallarm-main`コードバンドルをアップロードします。
1. [staging環境で有効化](https://techdocs.akamai.com/property-mgr/docs/activate-stage)します。
1. 検証後、[productionで有効化](https://techdocs.akamai.com/property-mgr/docs/activate-prod)します。
1. `wallarm-sp`コードバンドルのバージョンが変わった場合は、同じ手順を繰り返します。

EdgeWorkerのアップグレードでは、特にメジャーバージョン更新時に、Wallarmノードのアップグレードが必要となる場合があります。セルフホスト型ノードのリリースノートは[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。非推奨の回避と将来のアップグレード簡素化のため、ノードの定期的な更新を推奨します。