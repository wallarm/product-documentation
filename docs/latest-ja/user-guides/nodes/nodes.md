# Wallarmノード

Wallarm Console UIの**Nodes**セクションでは、セルフホスト型のノードインスタンスを管理できます。

Wallarmノードモジュールは、悪意のあるトラフィックをWallarmで軽減できるよう、お客様の環境にデプロイする必要があります。Wallarmノードはプロキシとして動作し、悪意のあるリクエストを阻止しつつ、正当なリクエストを保護対象リソースへ転送します。

WallarmノードのUIで行える操作:

* 新しいノードを作成
* インストール済みノードのプロパティとメトリクスを表示
* ノードトークンを再生成
* ノードの名前を変更
* ノードを削除

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "管理者アクセス"
    Wallarmノード/トークンの作成、削除、再生成は、**Administrator**または**Global Administrator**ロールのユーザーのみが実行できます。インストール済みノードの詳細の閲覧はすべてのユーザーが可能です。

!!! warning "通常型およびクラウド型ノードの廃止"
    リリース4.6以降、利用可能なノードタイプは[**Wallarm node**タイプ](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)のみです。

    **Wallarm node**は、[サポートされるあらゆる環境](../../installation/supported-deployment-options.md)での登録と設定に統一されたアプローチを採用します。

## ノードの作成

[適切なトークン](#api-and-node-tokens-for-node-creation)を使用してWallarmノードを作成するには:

=== "APIトークンを使用"

    1. Wallarm Console→**Settings**→**API tokens**を、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
    1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
    1. このトークンをコピーします。
    1. APIトークンを使用して、[適した環境](../../installation/supported-deployment-options.md)に新しいノードをデプロイします。ノードが登録されると、Wallarm Consoleの**Nodes**セクションに自動的に表示されます。

=== "ノードトークンを使用"

    1. Wallarm Console→**Nodes**を[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開き、**Wallarm node**タイプのノードを作成します。

        ![Wallarm nodeの作成](../../images/user-guides/nodes/create-cloud-node.png)
    
    1. 生成されたトークンをコピーします。
    1. ノードトークンを使用して、[適した環境](../../installation/supported-deployment-options.md)に新しいノードをデプロイします。

!!! info "マルチテナントオプション"
    **multi-tenant**オプションを使用すると、複数の独立した企業インフラストラクチャや分離環境を同時にWallarmで保護できます。[詳細はこちら](../../installation/multi-tenant/overview.md)

    === "APIトークンでのインストール"

        インストール後に既存ノードのメニューから、ノードをmulti-tenantモードに切り替えることができます。

    === "ノードトークンでのインストール"
    
        ノードの作成時、または既存ノードのメニューから、ノードをmulti-tenantモードに切り替えることができます。

## ノードの詳細の表示

インストール済みのフィルタリングノードの詳細は、各フィルタリングノードのテーブルおよびカードに表示されます。カードを開くには、該当するテーブルのレコードをクリックします。

利用できるノードのプロパティとメトリクスは次のとおりです。

* 作成時に設定したノード名
* 1秒あたりの平均リクエスト数（RPS）
* ノードのIPアドレス
* 一意のノード識別子（UUID）
* Wallarmノードのトークン（**Administrator**または**Global Administrator**[ロール](../settings/users.md)のユーザーにのみ表示されます）
* フィルタリングノードとWallarm Cloudの最終同期時刻
* フィルタリングノードの作成日
* 当月にノードが処理したリクエスト数。あわせて、**View events from this node for the day**（**Attacks**セクションに切り替えます）も可能です。
* 使用中のLOMおよびproton.dbのバージョン
* インストール済みのWallarmパッケージおよびNGINX（存在する場合）のバージョン

![ノードカード](../../images/user-guides/nodes/view-wallarm-node.png)

1つのWallarmノードが複数のインスタンスに対してインストールされている場合（例: 異なるサーバーインスタンスで初期トラフィック処理とリクエストの事後分析を実行する場合）、対応するフィルタリングノードの数はテーブル上で1つのレコードにグループ化されます。プロパティとメトリクスは各インスタンスごとに利用できます。

Wallarmでは、ノードインスタンスは`hostname_NodeUUID`という形式で命名されます。内訳は次のとおりです。 

* `hostname`は、ノードインスタンスを起動している稼働マシンの名前です
* `NodeUUID`は、一意のノード識別子（UUID）です

## ノードトークンの再生成

トークンを再生成すると、そのノード用の新しいトークンが作成されます。 

1. Wallarm Console→**Nodes**を開きます。
2. ノードのメニューまたはカードで**Regenerate token**をクリックします。
3. ノードがすでにお使いのインフラストラクチャにインストールされている場合は、新しいトークンの値をコピーし、インストール済みノードの設定に指定します。

![ノードトークンの再生成](../../images/user-guides/nodes/generate-new-token.png)

## ノードの削除

ノードを削除すると、アプリケーションへのリクエストのフィルタリングは停止します。フィルタリングノードの削除は元に戻せません。ノードはノード一覧から永久に削除されます。

1. Wallarm Console→**Nodes**を開きます。
1. 1つ以上のノードを選択し、**Delete**をクリックします。ノードのメニューまたはノードカードのボタンからフィルタリングノードを削除することもできます。
1. 操作を確認します。

## ノード作成のためのAPIトークンとノードトークン

WallarmフィルタリングノードはWallarm Cloudと連携します。ノードにWallarm Cloud APIへのアクセス権を付与するには、Cloud側でトークンを生成し、ノードを稼働させるマシンでそのトークンを使用する必要があります。この目的には、推奨の**API tokens**（推奨）または**node tokens**を使用します:

* `Node deployment/Deployment`の使用タイプを持つ[**API tokens**](../settings/api-tokens.md)を使用するのは次のような場合です。

    * UIでノードを論理的に整理するためのノードグループ数が事前に分からない場合（ノードグループが継続的に追加/削除される場合）。API tokensでは、`WALLARM_LABELS`変数で`group`ラベル値を設定して、これらのグループを容易に管理できます。
    * トークンのライフサイクルを管理する必要がある場合（有効期限を指定したり、API tokensを無効化したりできるため、より安全になります）。

        !!! info "一部のデプロイ方法ではAPI tokensはサポートされません"
            現在、[Terraformモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)に基づくAWSデプロイではAPI tokensを使用できません。代わりにnode tokensを使用してください。

* どのノードグループを用意するかが事前に分かっている場合は、**Node tokens**を使用します。ノードグループの作成と命名には、**Nodes**→**Create node**を使用します。ノードをデプロイする際、グループに含めたい各ノードに対してグループのトークンを使用します。

!!! info "オートスケーリングのサポート"
    両方のトークンタイプは、一部のクラウド/インストール方式で利用できるノードのオートスケーリング機能をサポートします。