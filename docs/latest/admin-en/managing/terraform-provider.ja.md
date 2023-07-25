# Terraformを使用したWallarmの管理

あなたがインフラストラクチャを管理するために[Terraform](https://www.terraform.io/)を使用しているなら、それはWallarmを管理するためにそれを使用するのが快適な選択肢かもしれません。Terraform用の[Wallarmプロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)は、それを可能にします。

## 前提条件

* [Terraform](https://www.terraform.io/)の基本知識
* Terraform 0.15.5バイナリまたはそれ以上
* Wallarmアカウントは[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)にあります
* Wallarm ConsoleのUSまたはEU [Cloud](../../about-wallarm/overview.ja.md#cloud)での**Administrator** [役割](../../user-guides/settings/users.ja.md#user-roles)のアカウントへのアクセス
* `https://us1.api.wallarm.com`へのアクセス（US Wallarm Cloudを使用する場合）または`https://api.wallarm.com`へのアクセス（EU Wallarm Cloudを使用する場合）。アクセスがファイアウォールによってブロックされていないことを確認してください

## プロバイダのインストール

1. あなたのTerraform設定にコピーして貼り付けます:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.1.1"
        }
      }
    }

    provider "wallarm" {
      # 設定オプション
    }
    ```

1. `terraform init` を実行します。

## あなたのWallarmアカウントにプロバイダを接続

Wallarm Terraformプロバイダを [US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup) CloudのあなたのWallarmアカウントに接続するには、Terraform設定でAPIアクセス認証情報を設定します:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # マルチテナンシー機能が使用されているときのみ必要:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # マルチテナンシー機能が使用されているときのみ必要:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>`はWallarmアカウントのAPIにアクセスするために使用します。 [取得方法 →](../../user-guides/settings/api-tokens.ja.md)
* `<CLIENT_ID>`はテナント（クライアント）のIDで、[マルチテナンシー](../../installation/multi-tenant/overview.ja.md)機能を使用するときに必要です。 [ここで](../../installation/multi-tenant/configure-accounts.ja.md#step-3-create-the-tenant-via-the-wallarm-api)記述されているように`id`（`uuid`ではなく）を取ります。

Wallarmプロバイダドキュメンテーションの[詳細](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)を参照してください。

## プロバイダを使ったWallarmの管理

Wallarmプロバイダを通じて、Terraformで次を管理できます:

* アカウントの[ノード](../../user-guides/nodes/nodes.ja.md)
* [アプリケーション](../../user-guides/settings/applications.ja.md)
* [ルール](../../user-guides/rules/intro.ja.md)
* [トリガー](../../user-guides/triggers/triggers.ja.md)
* [denylist](../../user-guides/ip-lists/denylist.ja.md)、[allowlist](../../user-guides/ip-lists/allowlist.ja.md)、及び[graylist](../../user-guides/ip-lists/graylist.ja.md)内のIPs
* [ユーザー](../../user-guides/settings/users.ja.md)
* [インテグレーション](../../user-guides/settings/integrations/integrations-intro.ja.md)
* グローバルな[フィルタリングモード](../../admin-en/configure-wallarm-mode.ja.md)
* [スキャナ](../../user-guides/scanner.ja.md)範囲
* [脆弱性](../../user-guides/vulnerabilities.ja.md)

!!! info "Wallarm TerraformプロバイダとCDNノード"
    現在、[CDNノード](../../user-guides/nodes/cdn-node.ja.md)はWallarm Terraformプロバイダを経由しては管理できません。

Wallarmプロバイダ [ドキュメンテーション](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)で一覧操作の実行方法を参照します。

## 使用例

以下はWallarmのTerraform設定例です:

```
provider "wallarm" {
  api_token = "<WALLARM_API_TOKEN>"
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

設定ファイルを保存し、 `terraform apply`を実行します。

設定は次のことを行います:

* 提供されたWallarm APIトークンでUS Cloud → 会社アカウントに接続します。
* `resource "wallarm_global_mode" "global_block"` → グローバルフィルタリングモードを`Local settings (default)`に設定します。これは各ノードでローカルにフィルタリングモードが制御されることを意味します。
* `resource "wallarm_application" "tf_app"` → ID `42`で`Terraform Application 001`という名前のアプリケーションを作成します。
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → ID `42`のアプリケーションへのHTTPSプロトコルを経由して送信されるすべてのリクエストに対してトラフィックフィルタリングモードを`Monitoring`に設定するルールを作成します。

## WallarmとTerraformについての詳細情報

Terraformは、多くのベンダーから利用可能な一連の統合([**プロバイダ**](https://www.terraform.io/language/providers)）とすぐに使える設定([**モジュール**](https://www.terraform.io/language/modules)）をサポートしており、これらは公開された[登録簿](https://www.terraform.io/registry#navigating-the-registry)を通じてユーザーに提供されています。

この登録簿には、Wallarmが公開したものが含まれています:

* Terraformを使用したWallarmの管理用の[Wallarmプロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)。本記事で説明されています。
* Terraform互換環境からAWSにノードをデプロイするための[Wallarmモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.ja.md)。

これら2つはそれぞれ異なる目的に使用される独立したツールです。一方を使用するために他方が必要なわけではありません。