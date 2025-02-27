# Wallarmノード

Wallarm Console UIの**Nodes**セクションでは、セルフホスト型ノードインスタンスを管理できます。

Wallarmノードモジュールは、悪意あるトラフィックを軽減するために顧客環境に展開する必要があります。Wallarmノードは、悪意あるリクエストを軽減し、正当なリクエストを保護対象リソースへ転送するプロキシとして動作します。

WallarmノードUIの管理オプション:

* 新しいノードの作成
* インストール済みノードのプロパティとメトリクスの表示
* ノードトークンの再生成
* ノードの名前変更
* ノードの削除

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "管理者アクセス"
    Wallarmノード/トークンの作成、削除、再生成は**Administrator**または**Global Administrator**ロールを持つユーザーのみが利用できます。インストール済みノードの詳細表示は、全てのユーザーが利用可能です。

!!! warning "通常型およびクラウド型ノードの削除"
    リリース4.6以降、[**Wallarm node**タイプのみが利用可能です](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)。
    
    **Wallarm node**は[任意の対応環境](../../installation/supported-deployment-options.md)での登録および構成について統一的なアプローチを採用します。

## ノードの作成

[適切なトークン](#api-and-node-tokens-for-node-creation)を使用してWallarmノードを作成するには:

=== "With API token"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)でWallarm Console → **Settings** → **API tokens**を開きます。
    1. `Deploy`ソースロールを持つAPIトークンを探すか作成します。
    1. 該当トークンをコピーします。
    1. あなたのAPIトークンを使用して[対応環境](../../installation/supported-deployment-options.md)に新しいノードを展開します。ノードの登録後、Wallarm Consoleの**Nodes**セクションに自動的に表示されます。

=== "With node token"

    1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

        ![Wallarm node作成](../../images/user-guides/nodes/create-cloud-node.png)
    
    1. 生成されたトークンをコピーします。
    1. あなたのノードトークンを使用して[対応環境](../../installation/supported-deployment-options.md)に新しいノードを展開します。

!!! info "マルチテナントオプション"
    **multi-tenant**オプションを利用すると、Wallarmを使用して複数の独立した企業インフラまたは隔離された環境を同時に保護できます。[詳細はこちら](../../installation/multi-tenant/overview.md)

    === "API token installation"

        インストール後、既存ノードのメニューからノードをマルチテナントモードに切り替えることができます。

    === "Node token installation"
    
        ノード作成時または既存ノードのメニューからノードをマルチテナントモードに切り替えることができます。

## ノードの詳細表示

インストール済みフィルタリングノードの詳細は、各フィルタリングノードのテーブルおよびカードに表示されます。カードを開くには、該当するテーブルのレコードをクリックします。

利用可能なノードプロパティとメトリクスは次の通りです:

* ノード作成時に付与されたノード名
* 1秒あたりの平均リクエスト数(RPS)
* ノードのIPアドレス
* ユニークなノード識別子(UUID)
* Wallarmノードのトークン（**Administrator**または**Global Administrator**[role](../settings/users.md)を持つユーザーにのみ表示）
* フィルタリングノードとWallarm Cloudの最終同期時刻
* フィルタリングノード作成日
* ノードが今月処理したリクエスト数（**このノードの当日のイベントを表示**をクリックすると**Attacks**セクションに切り替わります）
* 使用されているLOMとproton.dbのバージョン
* インストール済みのWallarmパッケージ、NGINX、およびEnvoy（該当する場合）のバージョン

![ノードカード](../../images/user-guides/nodes/view-wallarm-node.png)

1つのWallarmノードが複数のインスタンスにインストールされている場合（例：初期トラフィック処理とサーバーインスタンスが実行するリクエストのポスト分析など）、対応するフィルタリングノードの数が1つのテーブルレコードにまとめられます。各インスタンスごとにプロパティとメトリクスが利用可能です。

Wallarmでは、ノードインスタンスは`hostname_NodeUUID`の形式で命名されます。ここで、

* `hostname`はノードインスタンスが起動している作業マシンの名前です
* `NodeUUID`はユニークなノード識別子（UUID）です

`register-node`スクリプト内の`-n`パラメーターを使用して、ノードインストール時に`hostname`を手動で設定できます。

## ノードトークンの再生成

トークンの再生成により、ノードに対して新しいトークンが作成されます。

1. Wallarm Console → **Nodes**を開きます。
2. ノードメニューまたはカードの**Regenerate token**をクリックします。
3. ノードが既にインフラにインストールされている場合は、新しいトークンの値をコピーし、インストール済みノード設定に指定します。

![ノードトークンの再生成](../../images/user-guides/nodes/generate-new-token.png)

## ノードの削除

ノードが削除されると、アプリケーションへのリクエストフィルタリングが停止されます。フィルタリングノードの削除は元に戻せません。ノードはノードリストから完全に削除されます。

1. Wallarm Console → **Nodes**を開きます。
2. ノードを1つまたは複数選択し、**Delete**をクリックします。ノードメニューまたはノードカードのボタンを選択することでフィルタリングノードを削除することもできます。
3. 操作を確認します。

## ノード作成用のAPIおよびノードトークン

WallarmフィルタリングノードはWallarm Cloudと連携します。ノードにWallarm Cloud APIへのアクセスを提供するため、Cloud側でトークンを生成し、ノードが稼働するマシンで使用する必要があります。この目的のために、**API tokens**（推奨）または**node tokens**を使用します:

* [**API tokens**](../settings/api-tokens.md)（`Deploy`ロールを割り当てる）を使用する場合:

    * UI上でノードを論理的に整理するために使用するノードグループ数が事前に不明の場合（ノードグループは常に追加/削除されます。API tokensを使用することで、`WALLARM_LABELS`変数で`group`ラベルの値を設定して、これらのグループを容易に管理できます）。
    * トークンのライフサイクルを管理する必要がある場合（有効期限を指定するか、API tokensを無効化することで、セキュリティを向上させられます）。

        !!! info "一部の展開オプションではAPI tokensはサポートされません"
            API tokensは現在、[Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md)に基づくAWS展開では使用できません。代わりにnode tokensを使用してください。

* ノードグループが事前に判明している場合は**node tokens**を使用してください。**Nodes** → **Create node**を使用してノードグループを作成し、名前を付けます。ノードの展開時に、グループに含める各ノードに対してグループのトークンを使用します。

!!! info "オートスケーリング対応"
    両方のトークンタイプは、一部のクラウド/展開バリアントで利用可能なノードオートスケーリング機能をサポートします。