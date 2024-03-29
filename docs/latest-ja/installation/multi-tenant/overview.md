# マルチテナンシー概要

**マルチテナンシー**機能は、Wallarmを使用して複数の独立した会社のインフラストラクチャまたは孤立した環境を同時に保護することを許可します。

**テナント**は以下のエンティティを表します：

* Wallarmをパートナーとして統合する場合の独立した会社（**クライアント**）。
* Wallarmをクライアントとして統合する場合の孤立した環境。

--8<-- "../include-ja/waf/features/multi-tenancy/partner-client-term.md"

## マルチテナンシーが解決する問題

マルチテナンシー機能が扱う問題は以下の通りです：

* **Wallarmのパートナーになる**。パートナーは、自身のシステムインフラにフィルタリングノードをインストールし、クライアントに攻撃軽減を提供する組織です。

    各クライアントはWallarmコンソールで別々のアカウントが割り当てられ、全てのアカウントデータは分離され、選択したユーザーだけがアクセスできるようになります。
* **保護された環境のデータを互いに分離する**。環境は、個別のアプリケーション、データセンター、API、本番環境またはステージング環境などになる可能性があります。

    関連する問題の例：

    * Wallarmノードは孤立したチームによって管理される本番環境とステージング環境へのリクエストをフィルタリングします。その要件は、特定の環境を管理するチームのみがそのデータにアクセスできるようにすることです。
    * Wallarmノードは、孤立したチームによって管理され、異なる地域に位置するいくつかのデータセンターに展開されます。一つはヨーロッパに、もう一つはアジアにあります。その要件は、特定のデータセンターを管理するユーザーのみがそのデータにアクセスできるようにすることです。

    各クライアントはWallarmコンソールで別々のアカウントが割り当てられ、全てのアカウントデータは分離され、選択したユーザーだけがアクセスできるようになります。

## Wallarmコンポーネントのカスタマイズ

Wallarmは、Wallarmコンソールといくつかの他のコンポーネントをカスタマイズすることを可能にします。マルチテナンシーを使用する場合、以下のカスタマイズオプションが役立つ可能性があります：

* Wallarmコンソールのブランド化
* Wallarmコンソールをカスタムドメインでホストする
* クライアントや同僚からのメッセージを受け取るための技術サポートのメールアドレスを設定する

## マルチテナンシー設定

マルチテナンシー機能はデフォルトでは無効です。この機能を有効にして設定するには：

1. お申し込みプランに**マルチテナントシステム**の機能を追加するために、[sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送信します。
2. Wallarmコンソールでテナントのアカウントを[設定](configure-accounts.md)します。
3. マルチテナントWallarmノードを[デプロイおよび設定](deploy-multi-tenant-node.md)します。