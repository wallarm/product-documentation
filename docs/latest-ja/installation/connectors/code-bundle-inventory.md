# コネクタコードバンドルの変更履歴

このドキュメントでは、Native Node（MuleSoft、Cloudflareなど）で動作するコネクタコードバンドルのバージョンを一覧します。

## バージョン形式

コネクタコードバンドルのバージョンは次の形式に従います:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>
```

| 要素 | 説明 |
| ------- | ----------- |
| `<MAJOR_VERSION>` | 重要な更新、新機能、または非互換の変更です。[Native Nodeの更新](../../updating-migrating/native-node/node-artifact-versions.md)が必要です。 |
| `<MINOR_VERSION>` | 非互換の変更を伴わない改善や新機能です。 |
| `<PATCH_VERSION>` | 軽微なバグ修正や改善です。 |

## MuleSoft Mule Gateway

[アップグレード方法](mulesoft.md#upgrading-the-policy)

現在のバージョンは、ダウンロードしたWallarmポリシーの`pom.xml`ファイル、またはMuleSoft UIのポリシー情報で確認できます。

| ポリシーバージョン      | [Native Nodeバージョン](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 2.x                 | 0.8.2以下           |
| 3.0.x               | 0.8.3以上           |
| 3.2.x               | 0.10.1以上          |

### 3.2.0 (2025-01-31)

Native Nodeバージョン0.10.1以上が必要です。

* 悪意のあるリクエストをブロックした際のレスポンスコードを、MuleSoft Enterprise Editionリポジトリの`http-transform`プラグインを使用して403に設定するようにしました。

    以前は、レスポンスボディにブロックされたことを示すメッセージを含めて200ステータスコードを返していました。新しいコネクタバージョンを使用するには、標準の`anypoint-exchange-v3`リポジトリに加えて、[Maven `settings.xml`](../../installation/connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)で`mulesoft-releases-ee`リポジトリの認証が必要です。
* バグ修正: リクエスト識別子の一意性を確保しました。
* メモリ消費を最適化しました。

### 3.0.1 (2024-11-20)

* `WALLARM NODE MAX RETRIES`と`WALLARM NODE RETRY INTERVAL`パラメータを追加しました。

    これらのパラメータにより、ネットワーク障害時にWallarm Nodesへデータを送信する際の最大再試行回数と再試行間隔を設定できます。

### 3.0.0 (2024-11-14)

Native Nodeバージョン0.8.3以上が必要です。

* `CLIENT HOST EXPRESSION`と`CLIENT IP EXPRESSION`パラメータを追加しました。

    これらにより、元のホストおよびリモートIPを抽出するためのカスタム[DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions)式を指定でき、[MuleSoftのIP Blocklistポリシー](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist)と整合します。

### 2.0.3 (2024-11-13)

* バグ修正を行いました。

### 2.0.2 (2024-11-06)

* バグ修正を行いました。

### 2.0.1 (2024-10-10)

* 初期リリース

## MuleSoft Flex Gateway

[アップグレード方法](mulesoft-flex.md#upgrading-the-policy)

現在のバージョンは、ダウンロードしたWallarmポリシーの`Cargo.toml` → `[package]` → `version`パラメータ、またはMuleSoft UIのポリシー情報で確認できます。

| ポリシーバージョン      | [Native Nodeバージョン](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.x.x               | 0.16.0以上          |

### 1.1.0 (2025-08-19)

* Flex PDKを1.4.0にアップグレードしました。
* 大きなレスポンス時のGatewayのクラッシュを修正しました。

### 1.0.0 (2025-07-23)

* [初期リリース](mulesoft-flex.md)

## Akamai

[アップグレード方法](akamai-edgeworkers.md#upgrading-the-wallarm-edgeworkers)

現在のバージョンは、ダウンロードしたコードバンドルの`wallarm-main`/`wallarm-sp` → `bundle.json` → `edgeworker-version`で確認できます。

| ポリシーバージョン      | [Native Nodeバージョン](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.x                 | 0.16.3以上          |

### 1.0 (2025-08-18)

* [初期リリース](akamai-edgeworkers.md)

## CloudFront

[アップグレード方法](aws-lambda.md#upgrading-the-lambdaedge-functions)

### 1.0.0 (2024-10-10)

* 初期リリース

## Cloudflare

[アップグレード方法](cloudflare.md#upgrading-the-cloudflare-worker)

### 1.0.1

* 悪意のあるリクエスト向けのカスタムブロッキングページをサポートしました。以下の[パラメータ](cloudflare.md#configuration-options)で設定できます:

    * `wallarm_block_page.custom_path`
    * `wallarm_block_page.html_page`
    * `wallarm_block_page.support_email`

### 1.0.0 (2024-10-10)

* 初期リリース

## Kong API Gateway

[アップグレード方法](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* 初期リリース

<!-- ## Istio

[How to upgrade](istio.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* Initial release -->

## Broadcom Layer7 API Gateway

[アップグレード方法](layer7-api-gateway.md#upgrading-the-wallarm-policies)

### 1.0.0 (2024-11-07)

* 初期リリース

## Fastly

[アップグレード方法](fastly.md#upgrading-the-wallarm-compute-service-on-fastly)

### 1.2.0 (2025-04-03)

* 代替の構成を使用できるようにしました。

    Wallarm用のComputeサービスを複数運用している場合、異なる構成の[config storeを複数作成](../../installation/connectors/fastly.md#4-create-the-wallarm-config-store)し、それぞれを対応するサービスにリンクできます。

### 1.1.0 (2025-01-06)

* オプションの`LOGGING_ENDPOINT`[パラメータ](fastly.md#4-create-the-wallarm-config-store)で設定可能な[ログストリーミングエンドポイント](https://www.fastly.com/documentation/guides/integrations/logging/)をサポートしました。

### 1.0.0 (2025-01-02)

* 初期リリース

## IBM API Connect

[アップグレード方法](ibm-api-connect.md#upgrading-the-policies)

現在のバージョンは、Wallarmポリシーファイルの`info.version`で確認できます。両方のポリシーは同じバージョン番号を使用します。

| ポリシーバージョン      | [Native Nodeバージョン](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.0.1               | 0.13.x系では0.13.3以降、または0.14.1以降 |

### 1.0.1 (2025-05-20)

* 初期リリース