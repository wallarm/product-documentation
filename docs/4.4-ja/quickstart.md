[operation-mode-rule-docs]: user-guides/rules/wallarm-mode-rule.md
[filtration-modes-docs]: admin-en/configure-wallarm-mode.md
[graylist-docs]: user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]: about-wallarm/overview.md#cloud
[user-roles-docs]: user-guides/settings/users.md
[rules-docs]: user-guides/rules/intro.md
[ip-lists-docs]: user-guides/ip-lists/overview.md
[integration-docs]: user-guides/settings/integrations/integrations-intro.md
[trigger-docs]: user-guides/triggers/triggers.md
[application-docs]: user-guides/settings/applications.md
[events-docs]: user-guides/events/check-attack.md
[sqli-attack-desc]: attacks-vulns-list.md#sql-injection
[xss-attack-desc]: attacks-vulns-list.md#crosssite-scripting-xss

# Wallarmプラットフォームのクイックスタート

Wallarmプラットフォームは、ウェブアプリケーション、API、マイクロサービスをOWASPおよびOWASPトップ10の攻撃、ボット、アプリケーションの乱用から保護し、超低偽陽性を提供します。このガイドに従って、月次APIリクエスト500Kの制限を伴って無料でプラットフォームを完全に使用することができます。

クイックスタートでは、Wallarmアカウントを登録し、最初のWallarmフィルタリングノードを数分で実行します。無料の割り当てがありますので、製品パワーを実際のトラフィックに試すことができます。

## PlaygroundでWallarmを学ぶ

Wallarmを使用する前に、まず[Wallarm Playground](https://my.us1.wallarm.com/playground)を見ることができます。

Playgroundでは、実際のデータで埋め尽くされたWallarm Consoleのビューにアクセスできます。Wallarm Consoleは、処理されたトラフィックのデータを表示し、プラットフォームの微調整を可能にする主要なWallarmプラットフォームコンポーネントです。つまり、Playgroundを使用して製品の操作を学んだり、読み取り専用モードで使用および使用例を試すことができます。

![!アカウント作成のUI](images/playground.png)

実際のトラフィックでWallarmソリューションの機能を試してみたい場合は、[無料アカウントを作成](#create-wallarm-account-and-get-free-tier)してください。

## Wallarmアカウントを作成し、Free Tierを取得する

Wallarmアカウントを作成するには：

1. [US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup) Wallarm Cloudで登録リンクに従い、個人データを入力してください。

    [Wallarm Cloudの詳細情報 →](about-wallarm/overview.md#cloud)
1. 確認メッセージに記載されているリンクに従ってアカウントを確認してください。

アカウントが登録され、確認されると、使用中のWallarm Cloudに応じて、アカウントに自動的に**無料枠**または**無料トライアル**が割り当てられます。

* USクラウドでは、Free tierを使用して、Wallarmソリューションのパワーを月間500,000リクエストで無料で試すことができます。
* EUクラウドでは、Wallarmソリューションを14日間無料で試せる試用期間があります。

最初の[Wallarmフィルタリングノードをデプロイして](#deploy-wallarm-filtering-node)続行してください。

## Wallarmフィルタリングノードをデプロイする

Wallarmは、フィルタリングノードのデプロイに[多くのオプションをサポートしています](installation/supported-deployment-options.md)。それらを学んで最も適切なものを選択するか、以下に説明するようにWallarmで最も速く開始する方法をたどってください。

ノードをインフラストラクチャのコンポーネントとして迅速にデプロイするには、最初に以下を確認してください。

* [Dockerがインストールされていること]（https://docs.docker.com/engine/install/）
* Wallarmアカウントで**管理者** [role][user-roles-docs]

DockerイメージからWallarmフィルタリングノードをデプロイするには：

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)でWallarm Console → **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarm nodeの作成](images/create-wallarm-node-empty-list.png)

    **マルチテナントノード**のチェックボックスはオフにしましょう。このチェックボックスは、クイックスタートの一部ではない対象機能のセットアップに関連しています。
1. 生成されたトークンをコピーします。
1. 作成したノードでコンテナを実行します：

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.4.5-1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.4.5-1
    ```

環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm Console UIからコピーしたWallarmノードトークン。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`（USクラウド用）</li><li>`api.wallarm.com`（EUクラウド用）</li></ul>デフォルト値： `api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block` 悪意のあるリクエストを遮断するため</li><li>`safe_blocking` [グレーリストのIPアドレス][graylist-docs]からの悪意のあるリクエストのみを遮断するため</li><li>`monitoring` リクエストを分析するが遮断しないため</li><li>`off` トラフィックの分析および処理を無効にするため</li></ul>デフォルト値： `monitoring`。<br>[フィルタリングモードの詳細説明 →][filtration-modes-docs] | いいえ

デプロイをテストするには、[Pathトラバーサル](attacks-vulns-list.md#path-traversal)の悪意のあるペイロードで最初の攻撃を実行します：

```
curl http://localhost/etc/passwd
```

`NGINX_BACKEND`が`example.com`の場合、curlコマンドに`-H 'Host: example.com'`オプションを追加してください。

デフォルトでノードが**monitoring** [フィルタリングモード](admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作しているため、Wallarmノードは攻撃をブロックせずに登録します。攻撃が登録されたことを確認するには、Wallarm Console → **イベント**に移動します。

![!インターフェースの攻撃](images/admin-guides/test-attacks-quickstart.png)

## 次のステップ

Wallarmノードのクイックデプロイが成功しました！

デプロイステージをさらに活用するには：

* [DockerでNGINXベースのWallarmノードをデプロイするための完全なガイドを学ぶ](admin-en/installation-docker-en.md)
* [Wallarmがサポートするすべてのデプロイオプションを学ぶ](installation/supported-deployment-options.md)

デプロイされたノードをさらに微調整するために、以下の機能を学びます。

--8<-- "../include-ja/waf/installation/quick-start-configuration-options-4.4.md"