# コネクタコードバンドル変更履歴

この文書では、Native Node（MuleSoft、Cloudflareなど）と連携するコネクタコードバンドルのバージョンを記載しています。

## バージョン形式

コネクタコードバンドルのバージョンは以下の形式に従います:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>
```

| 要素              | 説明                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `<MAJOR_VERSION>` | 重要な更新、新機能、または後方互換性を破る変更です。[Native Node update](../../updating-migrating/native-node/node-artifact-versions.md)が必要です。 |
| `<MINOR_VERSION>` | 互換性に影響のない拡張機能や新機能です。                                                                     |
| `<PATCH_VERSION>` | 軽微なバグ修正または拡張です。                                                                               |

## MuleSoft

[アップグレード方法](mulesoft.md#upgrading-the-policy)

現在のバージョンは、ダウンロードしたWallarmポリシーの`pom.xml`ファイルまたはMuleSoft UIのポリシー情報に記載されています。

| ポリシーバージョン | [Native Node バージョン](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------ | --------------------------------------------------------------------------------------- |
| 2.x                | 0.8.2以下                                                                               |
| 3.x                | 0.8.3以上                                                                               |

### 3.0.1 (2024-11-20)

* `WALLARM NODE MAX RETRIES`および`WALLARM NODE RETRY INTERVAL`パラメータを追加しました

    これらのパラメータを使用することで、ネットワーク障害時にWallarm Nodeへのデータ送信におけるリトライ試行回数の最大値とリトライ間隔を設定できます。

### 3.0.0 (2024-11-14)

Native Nodeバージョン0.8.3以上が必要です。

* `CLIENT HOST EXPRESSION`および`CLIENT IP EXPRESSION`パラメータを追加しました

    これらにより、オリジナルホストおよびリモートIPを抽出するためのカスタム[DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions)式を指定でき、[MuleSoftのIP Blocklistポリシー](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist)と連携します。

### 2.0.3 (2024-11-13)

* バグ修正

### 2.0.2 (2024-11-06)

* バグ修正

### 2.0.1 (2024-10-10)

* 初回リリース

## CloudFront

[アップグレード方法](aws-lambda.md#upgrading-the-lambdaedge-functions)

### 1.0.0 (2024-10-10)

* 初回リリース

## Cloudflare

[アップグレード方法](cloudflare.md#upgrading-the-cloudflare-worker)

### 1.0.1

* 悪意のあるリクエストに対してカスタムブロッキングページのサポートを追加しました。これは[parameters](cloudflare.md#configuration-options)で設定できます:
    * `wallarm_block_page.custom_path`
    * `wallarm_block_page.html_page`
    * `wallarm_block_page.support_email`

### 1.0.0 (2024-10-10)

* 初回リリース

## Kong API Gateway

[アップグレード方法](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* 初回リリース

## Istio

[アップグレード方法](istio.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* 初回リリース

## Broadcom Layer7 API Gateway

[アップグレード方法](layer7-api-gateway.md#upgrading-the-wallarm-policies)

### 1.0.0 (2024-11-07)

* 初回リリース

## Fastly

[アップグレード方法](fastly.md#upgrading-the-wallarm-compute-service-on-fastly)

### 1.1.0 (2025-01-06)

* オプションの`LOGGING_ENDPOINT`[parameter](fastly.md#4-create-the-wallarm-config-store)を使用して設定することで、[log streaming endpoints](https://www.fastly.com/documentation/guides/integrations/logging/)のサポートを追加しました。

### 1.0.0 (2025-01-02)

* 初回リリース