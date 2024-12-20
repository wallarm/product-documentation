[operation-mode-rule-docs]:         admin-en/configure-wallarm-mode.md
[filtration-modes-docs]:            admin-en/configure-wallarm-mode.md
[graylist-docs]:                    user-guides/ip-lists/graylist.md
[wallarm-cloud-docs]:               about-wallarm/overview.md#cloud
[user-roles-docs]:                  user-guides/settings/users.md
[rules-docs]:                       user-guides/rules/rules.md
[ip-lists-docs]:                    user-guides/ip-lists/overview.md
[integration-docs]:                 user-guides/settings/integrations/integrations-intro.md
[trigger-docs]:                     user-guides/triggers/triggers.md
[application-docs]:                 user-guides/settings/applications.md
[events-docs]:                      user-guides/events/check-attack.md
[sqli-attack-desc]:                 attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  attacks-vulns-list.md#crosssite-scripting-xss

# Wallarmプラットフォームを素早く開始

Wallarmプラットフォームは、OWASPとOWASP Top 10の攻撃、ボット、および低い偽陽性率のアプリケーションの乱用からWebアプリケーション、API、マイクロサービスを保護します。このガイドに従って、毎月500KのAPI要求の制限で無料で完全にプラットフォームを使用することができます。

素早いスタートとして、Wallarmアカウントを登録し、最初のWallarmフィルタリングノードを数分で実行します。無料の割り当てがあるため、実際のトラフィックに製品のパワーを試すことができます。

## PlaygroundでWallarmを学ぶ

Wallarmをより詳しく知るため、まず[Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstartja)をご利用ください。

Playgroundでは、実際のデータが最初から埋め込まれたWallarmコンソールを使用できます。これは、処理されたトラフィックに関するデータを表示し、プラットフォームの微調整を許可する主要なWallarmプラットフォームコンポーネントです。したがって、Playgroundを使用すると、製品の動きを理解し、その使用方法の有用な例を読み取り専用モードで試すことができます。

![アカウント作成用のUI](images/playground.png)

あなたのトラフィックでWallarmソリューションの機能を試すには、[無料ホスティングアカウントを作成します](#create-wallarm-account-and-get-free-tier)。

## Wallarmアカウントを作成し、無料枠を取得する

Wallarmアカウントを作成するには：

1. Wallarm Cloudの[US](https://us1.my.wallarm.com/signup)または[EU](https://my.wallarm.com/signup)の登録リンクをたどり、パーソナルデータを入力します。

    [Wallarm Cloudsの詳細情報 →](about-wallarm/overview.md#cloud)
1. 送信された確認メッセージからのリンクをたどってアカウントを確認します。

アカウントが登録し、確認されると、使用しているWallarmクラウドに応じて、自動的に**フリーティア**または**フリートライアル**が割り当てられます：

* USクラウドでは、フリーティアでは月に50万回のリクエストでWallarmソリューションのパワーを無料で試すことができます。
* EUクラウドでは、14日間のトライアル期間があり、その期間中にWallarmソリューションを無料で試すことができます。

次に、[最初のWallarmフィルタリングノードをデプロイ](#deploy-the-wallarm-filtering-node)する続けてください。

## Wallarmフィルタリングノードをデプロイする

Wallarmは[フィルタリングノードのデプロイメントにたくさんのオプションをサポート](installation/supported-deployment-options.md)します。それらを学び、最も適したものを選択するか、または以下に説明するように、Wallarmの開始を最も速くする方法に従うことができます。

基盤の一部としてノードを迅速にデプロイするためには、まず次のことを確認してください：

* [Dockerがインストールされている](https://docs.docker.com/engine/install/)
* Wallarmアカウントに**管理者** [ロール][user-roles-docs]がある

DockerイメージからWallarmフィルタリングノードをデプロイします：

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **Nodes** を開き、**Wallarmノード**タイプのノードを作成します。  

    ![Wallarmノード作成](images/create-wallarm-node-empty-list.png)

    **マルチテナントノード**チェックボックスについては、チェックを外したままにしておきます。このチェックボックスは、クイックスタートの一部ではない対応する機能の設定に関連しています。
1. 生成されたトークンをコピーします。
1. ノードを含むコンテナを実行します：

=== "USクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.6.2-1
    ```
=== "EUクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.6.2-1
    ```

環境変数 | 内容 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm Console UIからコピーしたWallarmノードトークン。 | はい
`NGINX_BACKEND` | Wallarmソリューションで保護するリソースのドメインまたはIPアドレス。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバ：<ul><li>`us1.api.wallarm.com` for the USクラウド</li><li>`api.wallarm.com` for the EUクラウド</li></ul>デフォルト：`api.wallarm.com`。 | いいえ
`WALLARM_MODE` | ノードモード：<ul><li>`block`とすると不正なリクエストをブロックします</li><li>`safe_blocking`とすると[グレーリストに含まれるIPアドレス][graylist-docs]からのマリシャスリクエストのみをブロックします</li><li>`monitoring`とするとリクエストを分析しますが、ブロックしません</li><li>`off`とするとトラフィックの分析と処理を無効にします</li></ul>デフォルト：`monitoring`。<br>[フィルタモードの詳細説明 →][filtration-modes-docs] | いいえ

デプロイメントをテストするには、[Path Traversal](attacks-vulns-list.md#path-traversal)のマリシャスペイロードで初めての攻撃を実行します：

```
curl http://localhost/etc/passwd
```

`NGINX_BACKEND`が`example.com`の場合、curlコマンドで`-H 'Host: example.com'`オプションも付けてください。

ノードはデフォルトで**監視**[フィルタモード](admin-en/configure-wallarm-mode.md#available-filtration-modes)で動作するため、Wallarmノードは攻撃をブロックせず、それを登録します。攻撃が登録されたことを確認するには、Wallarm Console → **Events**に進みます：

![インターフェースの攻撃](images/admin-guides/test-attacks-quickstart.png)

## 次のステップ

無事にWallarmノードのクイックデプロイメントが完了しました！

デプロイメントステージからさらに多くのことを学びたい場合は：

* [Dockerを使ったNGINXベースのWallarmノードデプロイに関する完全ガイドを学ぶ](admin-en/installation-docker-en.md)
* [Wallarmがサポートするすべてのデプロイメントオプションを学ぶ](installation/supported-deployment-options.md)

デプロイされたノードの微調整を行うためには、特性を学びます：

--8<-- "../include-ja/waf/installation/quick-start-configuration-options-4.4.md"
