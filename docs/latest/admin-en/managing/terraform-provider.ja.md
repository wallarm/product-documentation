# Terraform を使った Wallarm の管理

[Terraform](https://www.terraform.io/) をインフラストラクチャの管理に使用している場合、Wallarm の管理にもそれを使用することが快適なオプションかもしれません。Terraform 用の [Wallarm プロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) は、それを可能にします。

## 必要条件

* [Terraform](https://www.terraform.io/) の基本的な知識
* Terraform バイナリ 0.15.5 以上
* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) での Wallarm アカウント
* US または EU [Cloud](../../about-wallarm/overview.md#cloud) の Wallarm Console で **管理者** [役割](../../user-guides/settings/users.md#user-roles) を持つアカウントへのアクセス
* US Wallarm Cloud の場合は `https://us1.api.wallarm.com` に、EU Wallarm Cloud の場合は `https://api.wallarm.com` にアクセスします。ファイアウォールによってアクセスが遮断されていないことを確認してください。

## プロバイダのインストール

1. 以下をコピーして Terraform の設定に貼り付ける。

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.0.0"
        }
      }
    }

    provider "wallarm" {
      # 設定オプション
    }
    ```

1. `terraform init` を実行する。

## プロバイダを Wallarm アカウントに接続

Wallarm Terraform プロバイダを [US](https://us1.my.wallarm.com/signup) または [EU](https://my.wallarm.com/signup) クラウドの Wallarm アカウントに接続するには、Terraform の設定で API アクセス認証情報を設定します。

=== "US Cloud"
    ```
    provider "wallarm" {
      api_uuid = "<UUID>"
      api_secret = "<SECRET_KEY>"
      api_host = "https://us1.api.wallarm.com"
      # マルチテナント機能を使用する場合のみ必要です。
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_uuid = "<UUID>"
      api_secret = "<SECRET_KEY>"
      api_host = "https://api.wallarm.com"
      # マルチテナント機能を使用する場合のみ必要です。
      # client_id = <CLIENT_ID>
    }
    ```

* `<UUID>` と `<SECRET_KEY>` は、Wallarm アカウントの API にアクセスするための認証情報です。[取得方法はこちら →](../../api/overview.md#your-own-client)
* `<CLIENT_ID>` はテナント (クライアント) の ID で、[マルチテナント](../../installation/multi-tenant/overview.md) 機能を使用する場合にのみ必要です。[ここ](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)で説明されているように `id` ( `uuid` ではない ) を取得してください。

Wallarm プロバイダのドキュメントで [詳細](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) を参照してください。

## プロバイダを使って Wallarm を管理する

Wallarm プロバイダでは、Terraform を介して以下の項目を管理できます。

* アカウント内の [ノード](../../user-guides/nodes/nodes.md)
* [アプリケーション](../../user-guides/settings/applications.md)
* [ルール](../../user-guides/rules/intro.md)
* [トリガー](../../user-guides/triggers/triggers.md)
* [拒否リストにある IP](../../user-guides/ip-lists/denylist.md)
* [ユーザー](../../user-guides/settings/users.md)
* [インテグレーション](../../user-guides/settings/integrations/integrations-intro.md)
* グローバルな [フィルタリングモード](../../admin-en/configure-wallarm-mode.md)
* [スキャナー](../../user-guides/scanner/intro.md) の範囲
* [脆弱性](../../user-guides/vulnerabilities/check-vuln.md)

!!! info "Wallarm Terraform プロバイダと CDN ノード"
    現在、[CDN ノード](../../user-guides/nodes/cdn-node.md) は Wallarm Terraform プロバイダを使って管理できません。

Wallarm プロバイダ [ドキュメント](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs) で、上記の動作方法を参照してください。

## 使用例

以下は、Wallarm 用の Terraform 設定の例です。

```
provider "wallarm" {
  api_uuid = "<UUID>"
  api_secret = "<SECRET_KEY>"
  api_host = "https://us1.api.wallarm.com"
}

resource "wallarm_global_mode" "global_block" {
  waf_mode = "default"
}

resource "wallarm_application" "tf_app" {
  name = "Terraform Application 001"
  app_id = 42
}

resource "wallarm_rule_mode" "tiredful_api_mode" {
  mode =  "monitoring"

  action {
    point = {
      instance = 42
    }
  }

  action {
    type = "regex"
    point = {
      scheme = "https"
    }
  }
}
```

設定ファイルを保存してから、`terraform apply` を実行します。

この設定は以下のことを行います。

* `<UUID>` と `<SECRET_KEY>` の API 資格情報で US クラウド → 会社アカウントに接続します。
* `resource "wallarm_global_mode" "global_block"` → グローバルフィルタリングモードを `ローカル設定 (デフォルト)` に設定します。これにより、フィルタリングモードは各ノードでローカルに制御されます。
* `resource "wallarm_application" "tf_app"` → ID が `42` のアプリケーション `Terraform Application 001` を作成します。
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ID が `42` のアプリケーションに HTTPS プロトコルを介して送信されるすべてのリクエストに対して、トラフィックフィルタリングモードを `監視` に設定するルールを作成します。

## Wallarm と Terraform に関する追加情報

Terraformは、多くのベンダーによって充実した公開 [レジストリ](https://www.terraform.io/registry#navigating-the-registry) 経由でユーザーに利用可能な、いくつかのインテグレーション (**[プロバイダ](https://www.terraform.io/language/providers) **) および使い勝手の良い設定 (**[モジュール](https://www.terraform.io/language/modules) **) をサポートしています。

Wallarm は、このレジストリに以下を公開しました。

* Terraform を使用して Wallarm を管理するための [Wallarm プロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)。現在の記事で説明しています。
* Terraform 互換環境から AWS にノードをデプロイするための [Wallarm モジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)。

これらは互いに独立したツールであり、別々の目的で使用されます。片方を使用するために他方が必要とされるわけではありません。