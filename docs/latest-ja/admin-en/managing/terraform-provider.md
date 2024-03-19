# Terraformを使用したWallarmの管理

[Terraform](https://www.terraform.io/)を使用してインフラストラクチャを管理している場合、それを使用してWallarmを管理すると便利かもしれません。Terraform用の[Wallarmプロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)は、そのようにすることを可能にします。

## 前提条件

* [Terraform](https://www.terraform.io/)の基本を理解していること
* Terraform 0.15.5バイナリ以上
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmアカウント
* USまたはEUの[Cloud](../../about-wallarm/overview.md#cloud)のWallarmコンソールで**管理者**[役割](../../user-guides/settings/users.md#user-roles)を持つアカウントへのアクセス
* USのWallarm Cloudを使用している場合は`https://us1.api.wallarm.com`へのアクセス、またはEUのWallarm Cloudを使用している場合は`https://api.wallarm.com`へのアクセスができることを確認してください。ファイヤーウォールでアクセスがブロックされていないことを確認してください。

## プロバイダのインストール

1. Terraformの設定に以下をコピー＆ペーストします：

    ```
    terraform {
      required_version = ">= 0.15.5"

      required_providers {
        wallarm = {
          source = "wallarm/wallarm"
          version = "1.1.2"
        }
      }
    }

    provider "wallarm" {
      # Configuration options
    }
    ```

1. `terraform init`を実行します。

## プロバイダをあなたのWallarmアカウントに接続する

Wallarm Terraformプロバイダを[US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup)クラウドのあなたのWallarmアカウントに接続するには、あなたのTerraform設定にAPIアクセス認証情報を設定します：

=== "US Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://us1.api.wallarm.com"
      # Required only when multitenancy feature is used:
      # client_id = <CLIENT_ID>
    }
    ```
=== "EU Cloud"
    ```
    provider "wallarm" {
      api_token = "<WALLARM_API_TOKEN>"
      api_host = "https://api.wallarm.com"
      # Required only when multitenancy feature is used:
      # client_id = <CLIENT_ID>
    }
    ```

- `<WALLARM_API_TOKEN>`は、WallarmアカウントのAPIにアクセス可能にします。[こちらから入手できます](../../user-guides/settings/api-tokens.md)
- `<CLIENT_ID>`はテナント（クライアント）のIDです。[マルチテナンシー](../../installation/multi-tenant/overview.md)機能を使用する場合にのみ必要です。`id`を[こちら](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)で説明されているように使用してください。

Wallarmプロバイダのドキュメンテーションには[詳細](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)が記載されています。

## プロバイダを使用したWallarmの管理

Wallarmプロバイダを通じて、Terraformを使用して以下を管理できます：

* アカウントの[ノード](../../user-guides/nodes/nodes.md)
* [アプリケーション](../../user-guides/settings/applications.md)
* [ルール](../../user-guides/rules/rules.md)
* [トリガー](../../user-guides/triggers/triggers.md)
* [拒否リスト](../../user-guides/ip-lists/denylist.md)、[許可リスト](../../user-guides/ip-lists/allowlist.md)および[グレーリスト](../../user-guides/ip-lists/graylist.md)のIP
* [ユーザー](../../user-guides/settings/users.md)
* [統合](../../user-guides/settings/integrations/integrations-intro.md)
* グローバル[フィルタモード](../../admin-en/configure-wallarm-mode.md)
* [スキャナ](../../user-guides/scanner.md)スコープ
* [脆弱性](../../user-guides/vulnerabilities.md)

!!! info "Wallarm TerraformプロバイダとCDNノード"
    現在、[CDNノード](../../user-guides/nodes/cdn-node.md)はWallarm Terraformプロバイダを通じて管理することはできません。

Wallarmプロバイダ[ドキュメンテーション](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)で、上記操作の行い方を確認してください。

## 使用例

以下に、WallarmのTerraform設定の例を示します：

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

設定ファイルを保存し、`terraform apply`を実行します。

この設定は以下を行います：

- 提供されたWallarm APIトークンを使用してUSクラウドの企業アカウントに接続します。
- `resource "wallarm_global_mode" "global_block"` → グローバルフィルタモードを`ローカル設定（デフォルト）`に設定します。これは、フィルタモードが各ノードでローカルに制御されることを意味します。
- `resource "wallarm_application" "tf_app"` → IDが`42`の`Terraform Application 001`という名前のアプリケーションを作成します。
- `resource "wallarm_rule_mode" "tiredful_api_mode"` → ID `42`のアプリケーションへのHTTPSプロトコルで送られる全てのリクエストに対して、トラフィックフィルタモードを`モニタリング`に設定するルールを作成します。

## WallarmとTerraformに関するさらなる情報

Terraformは、公開[レジストリ](https://www.terraform.io/registry#navigating-the-registry)を通じてユーザーに利用可能ないくつかの統合（**[プロバイダ](https://www.terraform.io/language/providers)**）と使用可能な設定（**[モジュール](https://www.terraform.io/language/modules)**）をサポートしており、多数のベンダーから提供されています。

このレジストリに、Wallarmは以下を公開しています：

- Terraformを介してWallarmを管理するための[Wallarmプロバイダ](https://registry.terraform.io/providers/wallarm/wallarm/latest/docs)。現在の記事で説明されています。
- Terraform互換環境からAWSへのノードのデプロイを行うための[Wallarmモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)。

これら2つは異なる目的で使用するための独立したツールです。一方を使用するために他方が必要とされるわけではありません。