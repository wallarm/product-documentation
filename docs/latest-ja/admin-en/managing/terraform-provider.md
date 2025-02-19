# Terraformを使用したWallarmの管理

[infrastructure management]を[Terraform](https://www.terraform.io/)で管理している場合、Wallarmの管理にも利用することは快適なオプションかもしれません。[TerraformのWallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)を使用することで実現できます。

## 必要条件

* [Terraform](https://www.terraform.io/)の基本知識
* Terraform 0.15.5以上のバイナリ
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)内のWallarmアカウント
* USまたはEUの[Cloud](../../about-wallarm/overview.md#cloud)にあるWallarm Consoleで**Administrator**[role](../../user-guides/settings/users.md#user-roles)のアクセス権があるアカウント
* US Wallarm Cloudを利用している場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用している場合は`https://api.wallarm.com`へのアクセス権があり、ファイアウォール等によりアクセスがブロックされていないこと

## プロバイダーのインストール

1. 次のコードをTerraformの設定ファイルにコピー＆ペーストしてください:

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
      # Configuration options
    }
    ```

1. `terraform init`を実行します。

## Wallarmアカウントへのプロバイダーの接続

Wallarm Terraformプロバイダーを[US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup)CloudのWallarmアカウントに接続するには、Terraformの設定ファイルにAPIアクセスの認証情報を設定してください:

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # マルチテナンシー機能を使用する場合のみ必要です:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # マルチテナンシー機能を使用する場合のみ必要です:
      # client_id = <CLIENT_ID>
    }
    ```

* `<WALLARM_API_TOKEN>`はWallarmアカウントのAPIへのアクセスを可能にします。[取得方法はこちら→](../../user-guides/settings/api-tokens.md)
* `<CLIENT_ID>`はテナント（クライアント）のIDです。[マルチテナンシー](../../installation/multi-tenant/overview.md)機能を使用する場合のみ必要で、[こちら](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)に記載のとおり`uuid`ではなく`id`を使用してください。

Wallarm providerの詳細については[こちら](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)をご確認ください。

## プロバイダーによるWallarmの管理

Wallarmプロバイダーを使用することで、Terraform経由で以下の項目を管理できます:

* [Self-hosted nodes](../../user-guides/nodes/nodes.md)
* [Applications](../../user-guides/settings/applications.md)
* [Rules](../../user-guides/rules/rules.md)
* [Triggers](../../user-guides/triggers/triggers.md)
* [denylist](../../user-guides/ip-lists/overview.md)、[allowlist](../../user-guides/ip-lists/overview.md)、[graylist](../../user-guides/ip-lists/overview.md)内のIP
* [Users](../../user-guides/settings/users.md)
* [Integrations](../../user-guides/settings/integrations/integrations-intro.md)
* グローバルな[filtration mode](../../admin-en/configure-wallarm-mode.md)
* [Scanner](../../user-guides/scanner.md)の範囲
* [Vulnerabilities](../../user-guides/vulnerabilities.md)

!!! info "Wallarm TerraformプロバイダーとEdgeノード"
    現在、Edge用の[inline](../../installation/security-edge/deployment.md)および[connector](../../installation/se-connector.md)ノードはWallarm Terraformプロバイダーでは管理できません。

Wallarm providerの[documentation](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)において、上記の操作方法をご確認ください。

## 使用例

以下は、Wallarm用Terraform設定の例です:

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

設定ファイルを保存し、`terraform apply`を実行してください。

この設定は以下のことを行います:

* 提供されたWallarm APIトークンを使用してUS Cloud→企業アカウントに接続します。
* `resource "wallarm_global_mode" "global_block"` → グローバルなfiltration modeを`Local settings (default)`に設定します。これは、それぞれのノードでローカルにfiltration modeが管理されることを意味します。
* `resource "wallarm_application" "tf_app"` → ID`42`の`Terraform Application 001`という名前のアプリケーションを作成します。
* `resource "wallarm_rule_mode" "tiredful_api_mode"` → アプリケーションID`42`へHTTPSプロトコルで送信されるすべてのリクエストに対して、filtration modeを`Monitoring`に設定するルールを作成します。

## WallarmとTerraformに関するさらなる情報

Terraformは多数の[providers](https://www.terraform.io/language/providers)や、準備された[modules](https://www.terraform.io/language/modules)を通じて利用可能な統合をサポートしており、これらは多数のベンダーによりパブリックな[registry](https://www.terraform.io/registry#navigating-the-registry)で提供されています。

このregistryに対して、Wallarmは以下を公開しています:

* Terraformを使用してWallarmを管理するための[Wallarm provider](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)。本記事にて説明しています。
* Terraform互換環境からAWSへノードを展開するための[Wallarm module](../../installation/cloud-platforms/aws/terraform-module/overview.md)。

これらは異なる目的で使用される独立したツールであり、互いに依存するものではありません。