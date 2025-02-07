```markdown
# マルチテナンシーの概要

「**multitenancy** 機能は、Wallarmを使用して複数の独立した企業インフラまたは隔離された環境を同時に保護することを可能にします。」

「Tenant」([**tenant account**](#tenant-accounts))は次のエンティティを表します:

* Wallarmをパートナーとして統合する場合は、独立した企業（**client**）です。
* Wallarmをクライアントとして統合する場合は、隔離された環境です。

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## マルチテナンシーが対処する課題

マルチテナンシー機能は、次の課題に対処します:

* **Wallarmのパートナーになる**. パートナーとは、自社のシステムインフラ内にフィルタリングノードを配置して、顧客に対して攻撃緩和を提供する組織です。

    各クライアントにはWallarm Console上で個別のアカウントが割り当てられ、すべてのアカウントデータは隔離され、選択されたユーザーのみがアクセスできるようになります。
* **保護された環境間でデータを分離する**. 環境とは、個別のアプリケーション、データセンター、API、本番またはステージング環境などを指します.

    関連する例:

    * Wallarmノードは、隔離されたチームによって管理される本番およびステージング環境に送信されるリクエストをフィルタリングします. 要件は、特定の環境を管理するチームのみがそのデータにアクセスできるようにすることです.
    * Wallarmノードは、隔離されたチームが管理し異なる地域に所在する複数のデータセンターに展開されます. 要件は、特定のデータセンターを管理するユーザーのみがそのデータにアクセスできるようにすることです.

    各クライアントにはWallarm Console上で個別のアカウントが割り当てられ、すべてのアカウントデータは隔離され、選択されたユーザーのみがアクセスできるようになります。

## Wallarmコンポーネントのカスタマイズ

Wallarmは、Wallarm Consoleおよびその他のコンポーネントのカスタマイズを可能にします. マルチテナンシーを使用する場合、次のカスタマイズオプションが有用です:

* Wallarm Consoleのブランド化
* 独自ドメインでWallarm Consoleをホストする
* 顧客や同僚からのメッセージを受信するために、技術サポート用のメールアドレスを設定する

## Tenantアカウント

Tenantアカウントは次の特徴があります:

* Wallarm Console上でTenantアカウントを正しくグループ化するために、各Tenantアカウントはパートナーまたは隔離環境を持つクライアントを示すグローバルアカウントに紐付けられます.
* 各Tenantアカウントには個別にユーザーがアクセスできるように提供されます.
* 各Tenantアカウントのデータは隔離され、アカウントに追加されたユーザーのみがアクセスできます.
* **global** [roles](../../user-guides/settings/users.md#user-roles)を持つユーザーは、新しいTenantアカウントを作成し、すべてのTenantアカウントのデータを表示・編集できます.

Tenantアカウントは次の構成に従って作成されます:

![!Tenant account structure](../../images/partner-waf-node/accounts-scheme.png)

* **Global account**はパートナーまたはクライアントごとにTenantアカウントをグループ化するためのみに使用されます.
* **Technical tenant account**は、Tenantアカウントへのアクセスを提供するために[global users](../../user-guides/settings/users.md#user-roles)を追加するために使用されます. global usersは通常、Wallarmパートナー企業の従業員または隔離された環境のためにマルチテナンシーを使用するWallarmクライアントです.
* **Tenant accounts**は次の目的で使用されます:
    * tenantに対して、検出された攻撃データおよびトラフィックフィルタリング設定へのアクセスを提供する.
    * ユーザーに特定のTenantアカウントのデータへのアクセスを提供する.

[Global users](../../user-guides/settings/users.md#user-roles)は次の操作が可能です: 

* Wallarm Console上でアカウントを切り替える.
* tenantの[subscriptions and quotas](../../about-wallarm/subscription-plans.md)を監視する.

![!Tenant selector in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant`はtechnical tenant accountです
* `Tenant 1`および`Tenant 2`はTenantアカウントです

## マルチテナンシーの構成

マルチテナンシー機能はデフォルトで無効になっています. 有効化および構成するには、次の手順を実行してください:

1. [sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送信し、**Multi-tenant system** 機能をサブスクリプションプランに追加してください.
2. Wallarm Console上でTenantアカウントを[Configure](configure-accounts.md)してください.
3. multi-tenant Wallarm nodeを[Deploy and configure](deploy-multi-tenant-node.md)してください.
```