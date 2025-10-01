# Terraformを使用したWallarmの管理

インフラストラクチャの管理に[Terraform](https://www.terraform.io/)を使用している場合、Wallarmの管理にもそれを使用すると便利です。Terraform向けの[Wallarmプロバイダー](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)を使用すると実現できます。

## 要件

* [Terraform](https://www.terraform.io/)の基礎知識
* Terraform 0.15.5以降のバイナリ
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmアカウント
* USまたはEUの[Cloud](../../about-wallarm/overview.md#cloud)にあるWallarm Consoleで**Administrator**[role](../../user-guides/settings/users.md#user-roles)を持つアカウントへのアクセス
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールでブロックされていないことを確認してください

## プロバイダーのインストール

1. 次をTerraformの構成にコピー&ペーストします:

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.5.0"
        }
      }
    }

    provider "wallarm" {
      # 構成オプション
    }
    ```

1. `terraform init`を実行します。

## プロバイダーをWallarmアカウントに接続する

[US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup) CloudのWallarmアカウントにWallarm Terraformプロバイダーを接続するには、Terraformの構成にAPIアクセス認証情報を設定します:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # マルチテナンシー機能を使用する場合にのみ必要です:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # マルチテナンシー機能を使用する場合にのみ必要です:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>`はお使いのWallarmアカウントのAPIにアクセスするためのトークンです。[取得方法→](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>`はテナント（クライアント）のIDで、[マルチテナンシー](../../installation/multi-tenant/overview.md)機能を使用する場合にのみ必要です。[こちら](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)の説明に従って`uuid`ではなく`id`を使用してください。

詳細はWallarmプロバイダーの[ドキュメント](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)を参照してください。

## プロバイダーでWallarmを管理する

Wallarmプロバイダーを使用すると、Terraform経由で次の項目を管理できます:

* [セルフホストノード](../../user-guides/nodes/nodes.md)
* [アプリケーション](../../user-guides/settings/applications.md)
* [ルール](../../user-guides/rules/rules.md)
* [トリガー](../../user-guides/triggers/triggers.md)
* [denylist](../../user-guides/ip-lists/overview.md)、[allowlist](../../user-guides/ip-lists/overview.md)、[graylist](../../user-guides/ip-lists/overview.md)内のIP
* [ユーザー](../../user-guides/settings/users.md)
* [インテグレーション](../../user-guides/settings/integrations/integrations-intro.md)
* グローバル[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)
* [脆弱性](../../user-guides/vulnerabilities.md)

!!! info "Wallarm TerraformプロバイダーとEdgeノード"
    現時点では、Edgeの[inline](../../installation/security-edge/inline/overview.md)および[connector](../../installation/security-edge/se-connector.md)ノードはWallarm Terraformプロバイダー経由で管理できません。

記載の操作方法はWallarmプロバイダーの[ドキュメント](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)を参照してください。

## 使用例

以下はWallarm用のTerraform構成例です:

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

構成ファイルを保存し、その後`terraform apply`を実行します。

この構成は次の処理を行います:

* US Cloud → 企業アカウントに、指定のWallarm APIトークンで接続します。
* `resource "wallarm_global_mode" "global_block"` → グローバルフィルタリングモードを`Local settings (default)`に設定します。これは各ノードでローカルにフィルタリングモードを制御することを意味します。
* `resource "wallarm_application" "tf_app"` → 名前が`Terraform Application 001`、IDが`42`のアプリケーションを作成します。
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → IDが`42`のアプリケーションにHTTPSプロトコルで送信されるすべてのリクエストに対して、トラフィックのフィルタリングモードを`Monitoring`に設定するルールを作成します。

## WallarmとTerraformに関するさらなる情報

Terraformは、多数のインテグレーション（[プロバイダー](https://www.terraform.io/language/providers)）と、すぐに使用できる構成（[モジュール](https://www.terraform.io/language/modules)）をサポートしており、複数のベンダーが公開[レジストリ](https://www.terraform.io/registry#navigating-the-registry)に提供しています。

このレジストリには、Wallarmが次を公開しています:

* TerraformでWallarmを管理するための[Wallarmプロバイダー](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)。本記事で説明しています。
* Terraform互換の環境からAWSにノードをデプロイするための[Wallarmモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)。

これら2つは目的の異なる独立したツールです。一方を使用するためにもう一方は必要ありません。