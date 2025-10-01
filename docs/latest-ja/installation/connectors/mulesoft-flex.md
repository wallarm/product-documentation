[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# MuleSoft Flex Gateway向けWallarmコネクタ

本ガイドでは、Wallarmコネクタを使用して[MuleSoft Flex Gateway](https://docs.mulesoft.com/gateway/latest/)で管理されているMuleおよび非MuleのAPIをどのように保護するかを説明します。

Flex GatewayのコネクタとしてWallarmを使用するには、Wallarmノードを外部にデプロイし、MuleSoftでWallarm提供のポリシーを適用して、トラフィックを解析のためにWallarmノードへルーティングする必要があります。

Flex Gateway向けWallarmコネクタは、[同期（インライン）](../inline/overview.md)および[非同期（アウトオブバンド）](../oob/overview.md)のトラフィック解析の両方をサポートします:

=== "同期トラフィックフロー"
    ![Wallarmポリシー適用のMuleSoft](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-inline.png)
=== "非同期トラフィックフロー"
    ![Wallarmポリシー適用のMuleSoft](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-oob.png)

## ユースケース

本ソリューションは、Flex Gatewayで管理されるAPIを保護するための推奨手法です。

## 制限事項

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## 要件

デプロイを進めるにあたり、次の要件を満たしていることを確認してください:

* MuleSoftプラットフォームについての理解があります。
* お使いのアプリケーションとAPIがFlex Gateway上で連携して稼働しています。

    !!! info "部分的なリクエストに関する注意"
        ブロッキング[モード](../../admin-en/configure-wallarm-mode.md)で動作するコネクタの場合、アップストリームが部分的なリクエストを安全に処理できることを確認してください。これは`proxy wasm`ポリシーがストリーミングである性質によるものです。完全な検証が完了する前に、一部のボディデータがアップストリームに到達する場合があります。[詳細はこちら](https://docs.mulesoft.com/pdk/latest/policies-pdk-configure-features-stop)
* ご利用のMuleSoftユーザーに、MuleSoft Anypoint Platformアカウントへアーティファクトをアップロードする権限が付与されています。
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)にある**Administrator**アカウントへアクセスできます。
* ホストシステムに[Node.js](https://nodejs.org/en/download) 16.0.0+と`npm` 7+がインストールされています。
* ホストシステムに[`make`](https://formulae.brew.sh/formula/make)がインストールされています。
* ホストシステムに[Anypoint CLI 4.x](https://docs.mulesoft.com/anypoint-cli/latest/install)がインストールされています。
* ホストシステムに[PDK CLIの前提条件](https://docs.mulesoft.com/pdk/latest/policies-pdk-prerequisites)がインストールされています。
* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされ稼働しています。
* Native Nodeは[バージョン0.16.0以上](../../updating-migrating/native-node/node-artifact-versions.md)です。

## デプロイ

### 1. Wallarmノードをデプロイする

Wallarmノードはデプロイが必要なWallarmプラットフォームの中核コンポーネントです。受信トラフィックを検査し、悪意のあるアクティビティを検出し、脅威の軽減を行うように構成できます。

Flex Gatewayコネクタの場合、ノードはお客様のインフラストラクチャ内にのみデプロイできます。 

セルフホスト型ノードのデプロイ方法として適切なアーティファクトを選択し、各手順に従ってください:

* [オールインワンインストーラー](../native-node/all-in-one.md): ベアメタルまたはVM上のLinuxインフラ向け
* [Dockerイメージ](../native-node/docker-image.md): コンテナ化デプロイを使用する環境向け
* [Helmチャート](../native-node/helm-chart.md): Kubernetesを利用するインフラ向け

!!! info "必要なNodeのバージョン"
    MuleSoft Flex Gatewayコネクタは、Native Nodeの[バージョン0.16.0以上](../../updating-migrating/native-node/node-artifact-versions.md)でのみサポートされます。

### 2. Wallarmポリシーを取得してMuleSoft Exchangeにアップロードする

MuleSoft ExchangeにWallarmポリシーを取得してアップロードするには、次の手順に従ってください:

1. sales@wallarm.comに連絡してコードバンドルを入手します。
1. ポリシーを公開するマシンが[すべての必要要件](#requirements)を満たしていることを確認します。
1. ポリシーのアーカイブを展開します。
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → 組織を選択 → **business group ID**をコピーします。
1. 展開したポリシーディレクトリで→ `Cargo.toml` → `[package.metadata.anypoint]` → `group_id`に、コピーしたグループIDを指定します:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. ポリシーの作業を行っているのと同じターミナルセッションで、[Anypoint CLIで認証](https://docs.mulesoft.com/anypoint-cli/latest/auth)します:

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. ポリシーをビルドして公開します:

    ```bash
    make setup      # 依存関係とPDK CLIをインストールします
    make build      # ポリシーをビルドします
    make release    # ポリシーの新しい本番版をAnypointに公開します
    # または
    # make publish  # ポリシーの開発版をAnypointに公開します
    ```

これでカスタムポリシーがMuleSoft Anypoint PlatformのExchangeで利用可能になりました。

![Wallarmポリシー適用のMuleSoft](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. WallarmポリシーをAPIに適用する

Wallarmポリシーは、個別のAPIにも、すべてのAPIにも適用できます。

1. 個別のAPIに適用するには、Anypoint Platform → **API Manager** → 対象APIを選択 → **Policies** → **Add policy**に進みます。
1. すべてのAPIに適用するには、Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**に進みます。
1. ExchangeからWallarmポリシーを選択します。
1. パラメーター`wallarm_node`に、`http://`または`https://`を含むWallarmノードのURLを指定します。
1. 必要に応じて[その他のパラメーター](#configuration-options)を変更します。
1. ポリシーを適用します。

![Wallarmポリシー](../../images/waf-installation/gateways/mulesoft/policy-setup-flex.png)

## 構成オプション

Flex Gateway向けWallarmポリシーの設定では、次のパラメーターを指定できます:

| パラメーター | 説明 | 必須? |
| --------- | ----------- | --------- |
| `wallarm_node` | ご利用の[Wallarm Nodeインスタンス](#1-deploy-a-wallarm-node)のアドレスを設定します。 | はい |
| `real_ip_header` | プロキシやロードバランサー配下にある場合に、元のクライアントIPアドレスを判定するために使用するヘッダーを指定します。デフォルト: `X-Forwarded-For`。 | はい |
| `wallarm_mode` | トラフィック処理モードを指定します: `sync`はトラフィックを直接Wallarm Nodeで処理し、`async`は元のフローに影響を与えずにトラフィックの[コピー](../oob/overview.md)を解析します。デフォルト: `sync`。 | はい |
| `fallback_action` | Wallarmノードがダウンしている場合のリクエストの扱いを定義します。`pass`（すべてのリクエストを許可）または`block`（403コードで全リクエストをブロック）を指定できます。デフォルト: `pass`。 | はい |
| `parse_responses` | レスポンスボディを解析するかどうかを制御します。有効にすると、レスポンススキーマのディスカバリーや、攻撃・脆弱性検出機能が強化されます。デフォルト: `true`。 | はい |
| `response_body_limit` | Wallarmノードに送信するレスポンスボディのサイズを制限します。デフォルト: `4096`バイト。 | いいえ |

## テスト

デプロイ済みポリシーの動作をテストするには、次の手順に従ってください:

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信します:

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の→ **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェイスのAttacks][attacks-in-ui-image]

    Wallarmノードのモードが[ブロッキング](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れている場合、リクエストもブロックされます。

## トラブルシューティング

期待どおりに動作しない場合は、MuleSoft Anypoint Platform → **Runtime Manager** → 対象アプリケーション → **Logs**にアクセスして、APIのログを確認してください。

また、**API Manager**で対象APIを開き、**Policies**タブで適用済みのポリシーを確認することで、ポリシーがAPIに適用されているかを検証できます。自動ポリシーについては、**See covered APIs**オプションを使用して、対象となるAPIと除外理由を確認できます。

## ポリシーのアップグレード

デプロイ済みのWallarmポリシーを[新しいバージョン](code-bundle-inventory.md#mulesoft-flex-gateway)へアップグレードするには:

1. [手順2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)に従って、更新されたWallarmポリシーをダウンロードし、MuleSoft Exchangeにアップロードします。
1. 新しいバージョンがExchangeに表示されたら、**API Manager** → 対象API → **Policies** → Wallarmポリシー → **Edit configuration** → **Advanced options**へ進み、ドロップダウンから新しいポリシーバージョンを選択します。
1. 新しいバージョンで追加のパラメーターが導入されている場合は、必要な値を入力します。
1. 変更を保存します。

Wallarmポリシーが自動ポリシーとして適用されている場合、直接のアップグレードができないことがあります。その場合は、現在のポリシーを削除し、新しいバージョンを手動で再適用してください。

ポリシーのアップグレードにあたっては、特にメジャーバージョンアップの場合、Wallarmノードのアップグレードが必要になることがあります。セルフホスト型ノードのリリースノートについては[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)をご参照ください。非推奨化を避け、将来のアップグレードを容易にするため、ノードは定期的に更新することを推奨します。

## ポリシーのアンインストール

Wallarmポリシーをアンインストールするには、自動ポリシー一覧または個別APIに適用されたポリシー一覧で**Remove policy**オプションを使用します。