[api-discovery-enable-link]:        ../api-discovery/setup.md#enable
[link-wallarm-mode-override]:       ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]:            ../user-guides/events/check-attack.md#attack-analysis_1
[acl-access-phase]:                 ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 
[img-mode-rule]:                    ../images/user-guides/rules/wallarm-mode-rule.png

# フィルタリングモード

フィルタリングモードは、受信リクエストを処理する際のフィルタリングノードの動作を定義します。本ドキュメントでは、利用可能なフィルタリングモードとその設定方法を説明します。

## 利用可能なフィルタリングモード {#available-filtration-modes}

Wallarmフィルタリングノードは、次のモードで受信リクエストを処理できます（弱い→強いの順）:

* `off`
* `monitoring`
* `safe_blocking` - ブロックが安全と判断される場合のみブロックします（[graylist](../user-guides/ip-lists/overview.md)）。
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

## 設定方法

フィルタリングモードは次の方法で設定できます:

* [ノード側で`wallarm_mode`ディレクティブを設定する](#setting-wallarm_mode-directive)
* [Wallarm Consoleで全体のフィルタリングモードを定義する](#general-filtration-mode)
* [Wallarm Consoleで条件付きフィルタリングモードを定義する](#conditioned-filtration-mode)

フィルタリングモードの設定方法の優先順位は、[`wallarm_mode_allow_override`ディレクティブ](#prioritization-of-methods)で決まります。デフォルトでは、`wallarm_mode`ディレクティブの値の強さに関係なく、Wallarm Consoleで指定した設定の方が高い優先度を持ちます。

### `wallarm_mode`ディレクティブの設定 {#setting-wallarm_mode-directive}

ノード側では[`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)ディレクティブを使用してノードのフィルタリングモードを設定できます。デプロイメントごとの設定の特徴は以下のとおりです。

なお、ここで説明する設定は[in-line](../installation/inline/overview.md)デプロイにのみ適用されます。[out-of-band (OOB)](../installation/oob/overview.md)ソリューションでは`monitoring`モードのみ有効にできます。

=== "All-in-oneインストーラー"

    Linuxに[All-in-oneインストーラー](../installation/nginx/all-in-one.md)でインストールしたNGINXベースのノードでは、フィルタリングノードの設定ファイルで`wallarm_mode`ディレクティブを設定できます。複数のコンテキストに対してフィルタリングモードを定義できます。これらのコンテキストは、よりグローバルなものからローカルなものへ、次の順序で適用されます:
    
    * `http`: ディレクティブはHTTPサーバーに送信されるリクエストに適用されます。
    * `server`: ディレクティブは仮想サーバーに送信されるリクエストに適用されます。
    * `location`: ディレクティブはその特定のパスを含むリクエストにのみ適用されます。
    
    同じ設定ファイル内で`http`、`server`、`location`ブロックに異なる`wallarm_mode`値を設定した場合は、最もローカルな設定が最優先されます。
    
    下記の[設定例](#configuration-example)をご覧ください。

=== "DockerのNGINXベースイメージ"

    NGINXベースのWallarmノードをDockerコンテナでデプロイする場合は、`WALLARM_MODE`環境変数を[指定します](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables):
    
    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/node:6.4.1
    ```
    
    または、[設定ファイルに該当パラメータを含め](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)、このファイルをマウントしてコンテナを実行します。

=== "NGINX Ingress controller"

    NGINX Ingress controllerの場合は、`wallarm-mode`アノテーションを使用します:
    
    ```
    kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
    ```
    
    フィルタリングモードを`monitoring`に設定してNGINXベースのIngress controllerのトラフィック解析を[有効化する例](../admin-en/installation-kubernetes-en.md#step-2-enabling-traffic-analysis-for-your-ingress)をご覧ください。

=== "Sidecar"

    Wallarm Sidecarソリューションでは、デフォルトの`values.yaml`のWallarm固有セクションで`mode`パラメータを設定します:
    
    ```
    config:
    wallarm:
        ...
        mode: monitoring
        modeAllowOverride: "on"
    ```
    
    Sidecarのフィルタリングモード指定の詳細は[こちら](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md)をご覧ください。

=== "Edge Connectors"

    [Security Edge connectors](../installation/security-edge/se-connector.md)では、コネクタのデプロイ時に**Filtration mode**セレクタで`wallarm_mode`の値を指定します。
=== "Native Node"
    * Native NodeのAll-in-oneインストーラーおよびDockerイメージでは、[`route_config.wallarm_mode`](../installation/native-node/all-in-one-conf.md#route_configwallarm_mode)パラメータを使用します。
    * Native NodeのHelmチャートでは、[`config.connector.route_config.wallarm_mode`](../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_mode)パラメータを使用します。

### 全体のフィルタリングモード {#general-filtration-mode}

全ての受信リクエストに対する全体のフィルタリングモードは、Mitigation controls（[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）またはRules（[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）を使用して定義できます。

=== "Mitigation controls"

    全ての受信リクエストの全体フィルタリングモードは、“all traffic” **Real-time blocking mode**[mitigation control](../about-wallarm/mitigation-controls-overview.md)で定義します:
    
    | 設定 | フィルタリングモード |
    | --- | --- |
    | **Inherited** | フィルタリングモードは、[all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode)およびWallarmノードの[設定](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive)から継承されます。 |
    | **Excluding** | `off` |
    | **Monitoring** | `monitoring` |
    | **Safe blocking** | `safe_blocking` |
    | **Blocking** | `block` |
    
    既定は**Inherited**です。グローバルモードはいつでも変更できます。

=== "Rules"
    
    全ての受信リクエストに対する全体のフィルタリングモードは、[US](https://us1.my.wallarm.com/settings/general)または[EU](https://my.wallarm.com/settings/general) Cloudの**Settings** → **General**で定義できます。
    
    ![一般設定タブ](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)
    
    全体のフィルタリングモード設定は、**Rules**セクションの**Set filtration mode**[default](../user-guides/rules/rules.md#default-rules)ルールとして表されます。このセクションでエンドポイントを対象とするフィルタリングルールの方が高い優先度を持つ点にご注意ください。

### 条件付きフィルタリングモード {#conditioned-filtration-mode}

特定のブランチやエンドポイント、その他の条件に基づくフィルタリングモードは、Mitigation controls（[Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）またはRules（[Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans)サブスクリプション）で設定できます。

=== "Mitigation controls"

    特定のブランチやエンドポイント、その他の条件に基づいてフィルタリングモードを設定できます。Wallarmは**Real-time blocking mode**[mitigation control](../about-wallarm/mitigation-controls-overview.md)を提供します。
    
    その前に:**Mitigation Controls**の記事（[こちら](../about-wallarm/mitigation-controls-overview.md#configuration)）で、任意のmitigation controlに対して**Scope**と**Mitigation mode**をどのように設定するかをご確認ください。
    
    新しいフィルタリングモードのmitigation controlを作成するには:
    
    1. Wallarm Console → **Mitigation Controls**に進みます。
    1. **Add control** → **Real-time blocking mode**を使用します。
    1. **Scope**に適用する対象を記述します。
    1. **Mitigation mode**セクションで、指定したスコープに対するフィルタリングモードを選択します:
    
        | 設定 | フィルタリングモード |
        | --- | --- |
        | **Inherited** | フィルタリングモードは、[all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode)およびWallarmノードの[設定](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive)から継承されます。 |
        | **Excluding** | `off` |
        | **Monitoring** | `monitoring` |
        | **Safe blocking** | `safe_blocking` |
        | **Blocking** | `block` |
    
    1. 変更を保存し、[mitigation controlのコンパイルが完了](../about-wallarm/mitigation-controls-overview.md#ruleset-lifecycle)するまでお待ちください。

=== "Rules"

    特定のブランチやエンドポイント、その他の条件に基づいてフィルタリングモードを設定できます。これには**Set filtration mode**[rule](../user-guides/rules/rules.md)を使用します。これらのルールは、[Wallarm Consoleで設定する全体のフィルタリングルール](#general-filtration-mode)よりも高い優先度を持ちます。
    
    新しいフィルタリングモードのルールを作成するには:
    
    --8<-- "../include/rule-creation-initial-step.md"
    
    1. **Fine-tuning attack detection** → **Override filtration mode**を選択します。
    1. **If request is**で、ルールを適用するスコープを[記述します](../user-guides/rules/rules.md#configuring)。特定のブランチ、ヒット、またはエンドポイントからルール作成を始めた場合は、それらがスコープを定義します。必要に応じて条件を追加できます。
    1. 指定したスコープに対するフィルタリングモードを選択します:
    
        | 設定 | フィルタリングモード |
        | --- | --- |
        | **Default** | フィルタリングモードは、[グローバルのフィルタリングモード設定](../admin-en/configure-wallarm-mode.md#general-filtration-mode)およびWallarmノードの[設定](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive)から継承されます。 |
        | **Disabled** | `off` |
        | **Monitoring** | `monitoring` |
        | **Safe blocking** | `safe_blocking` |
        | **Blocking** | `block` |
    
    1. 変更を保存し、[ルールのコンパイルが完了](../user-guides/rules/rules.md#ruleset-lifecycle)するまでお待ちください。
    
    なお、フィルタリングモードのルールは、[Wallarm APIを直接呼び出す](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application)ことでも作成できます。

### 方法の優先順位 {#prioritization-of-methods}

!!! warning "`wallarm_mode_allow_override`ディレクティブのEdgeノードでのサポート"
    `wallarm_mode_allow_override`ディレクティブは、Wallarm Edgeの[inline](../installation/security-edge/inline/deployment.md)および[connector](../installation/security-edge/se-connector.md)ノードではカスタマイズできません。

`wallarm_mode_allow_override`ディレクティブは、フィルタリングノードの設定ファイルにある`wallarm_mode`ディレクティブの値ではなく、Wallarm Consoleで定義したモードのルール/mitigation controlsを適用できるかどうかを管理します。

`wallarm_mode_allow_override`ディレクティブには次の値を設定できます:

* `off`: Wallarm Consoleで指定したモードのルール/mitigation controlsは無視されます。設定ファイル内の`wallarm_mode`ディレクティブで指定したルールが適用されます。
* `strict`: 設定ファイル内の`wallarm_mode`ディレクティブで定義したモードよりも厳しいフィルタリングモードを定義する、Wallarm Cloudで指定したモードのルール/mitigation controlsのみが適用されます。
    
    利用可能なフィルタリングモードの弱い→強いの順序は[上記](#available-filtration-modes)に示しています。
    
* `on`（デフォルト）: Wallarm Consoleで指定したモードのルール/mitigation controlsが適用されます。設定ファイル内の`wallarm_mode`ディレクティブで指定したルールは無視されます。

`wallarm_mode_allow_override`ディレクティブの値を定義できるコンテキストは、よりグローバルなものからローカルなものへ次の順序です:

* `http`: `http`ブロック内のディレクティブはHTTPサーバーに送信されるリクエストに適用されます。
* `server`: `server`ブロック内のディレクティブは仮想サーバーに送信されるリクエストに適用されます。
* `location`: `location`ブロック内のディレクティブはその特定のパスを含むリクエストにのみ適用されます。

`http`、`server`、`location`ブロックで異なる`wallarm_mode_allow_override`値を定義した場合は、最もローカルな設定が最優先されます。

**`wallarm_mode_allow_override`ディレクティブの使用例:**

```bash
http {
    
    wallarm_mode monitoring;
    
    server {
        server_name SERVER_A;
        wallarm_mode_allow_override off;
    }
    
    server {
        server_name SERVER_B;
        wallarm_mode_allow_override on;
        
        location /main/login {
            wallarm_mode_allow_override strict;
        }
    }
}
```

この設定例では、Wallarm Consoleのフィルタリングモードのルールは次のように適用されます:

1. 仮想サーバー`SERVER_A`に送信されるリクエストには、Wallarm Consoleで定義したフィルタリングモードのルール/mitigation controlsは無視されます。`SERVER_A`に対応する`server`ブロックに`wallarm_mode`ディレクティブが指定されていないため、`http`ブロックで指定された`monitoring`フィルタリングモードが適用されます。
2. 仮想サーバー`SERVER_B`に送信されるリクエストには、パスに`/main/login`を含むリクエストを除き、Wallarm Consoleで定義したフィルタリングモードのルール/mitigation controlsが適用されます。
3. 仮想サーバー`SERVER_B`に送信され、かつパスに`/main/login`を含むリクエストに対しては、`monitoring`よりも厳しいフィルタリングモードを定義する場合に限り、Wallarm Consoleで定義したフィルタリングモードのルールが適用されます。

## 設定例 {#configuration-example}

ここでは、上記のすべての方法を使用したフィルタリングモード設定の例を示します。

### ノードの設定ファイル

```bash
http {
    
    wallarm_mode block;
        
    server { 
        server_name SERVER_A;
        wallarm_mode monitoring;
        wallarm_mode_allow_override off;
        
        location /main/login {
            wallarm_mode block;
            wallarm_mode_allow_override strict;
        }
        
        location /main/signup {
            wallarm_mode_allow_override strict;
        }
        
        location /main/apply {
            wallarm_mode block;
            wallarm_mode_allow_override on;
        }
        
        location /main/feedback {
            wallarm_mode safe_blocking;
            wallarm_mode_allow_override off;
        }
    }
}
```

### Wallarm Consoleでの設定

* [全体のフィルタリングモード](#general-filtration-mode): **Monitoring**。
* [条件付きフィルタリングモードの設定](#conditioned-filtration-mode):
    * 次の条件に一致する場合:
        * Method: `POST`
        * First part of the path: `main`
        * Second part of the path: `apply`,
        
        **Default**フィルタリングモードを適用します。
        
    * 次の条件に一致する場合:
        * First part of the path: `main`,
        
        **Blocking**フィルタリングモードを適用します。
        
    * 次の条件に一致する場合:
        * First part of the path: `main`
        * Second part of the path: `login`,
        
        **Monitoring**フィルタリングモードを適用します。

### リクエスト例

設定済みサーバー`SERVER_A`に送信されるリクエスト例と、それに対してWallarmフィルタリングノードが適用するアクションは次のとおりです:

* `/news`パスを持つ悪意のあるリクエストは、サーバー`SERVER_A`に対する`wallarm_mode monitoring;`設定により処理されますが、ブロックはされません。

* `/main`パスを持つ悪意のあるリクエストは、サーバー`SERVER_A`に対する`wallarm_mode monitoring;`設定により処理されますが、ブロックはされません。
    
    Wallarm Consoleで定義された**Blocking**ルールは、サーバー`SERVER_A`の`wallarm_mode_allow_override off;`設定により適用されません。

* `/main/login`パスを持つ悪意のあるリクエストは、`/main/login`パスに対する`wallarm_mode block;`設定によりブロックされます。
    
    Wallarm Consoleで定義された**Monitoring**ルールは、フィルタリングノード設定ファイルの`wallarm_mode_allow_override strict;`設定により適用されません。

* `/main/signup`パスを持つ悪意のあるリクエストは、`/main/signup`パスに対する`wallarm_mode_allow_override strict;`設定と、`/main`パスに対してWallarm Consoleで定義された**Blocking**ルールによりブロックされます。
* `/main/apply`パスかつ`GET`メソッドの悪意のあるリクエストは、`/main/apply`パスに対する`wallarm_mode_allow_override on;`設定と、`/main`パスに対してWallarm Consoleで定義された**Blocking**ルールによりブロックされます。
* `/main/apply`パスかつ`POST`メソッドの悪意のあるリクエストは、`/main/apply`パスに対する`wallarm_mode_allow_override on;`設定、Wallarm Consoleで定義された**Default**ルール、さらにフィルタリングノード設定ファイルの`/main/apply`パスに対する`wallarm_mode block;`設定によりブロックされます。
* `/main/feedback`パスを持つ悪意のあるリクエストは、フィルタリングノード設定ファイルで`/main/feedback`パスに対して`wallarm_mode safe_blocking;`が設定されているため、[graylisted IP](../user-guides/ip-lists/overview.md)からのリクエストの場合にのみブロックされます。
    
    フィルタリングノード設定ファイルの`wallarm_mode_allow_override off;`設定により、Wallarm Consoleで定義された**Monitoring**ルールは適用されません。

## フィルタリングモードを段階的に適用するベストプラクティス

新しいWallarmノードをスムーズに導入するため、次のステップに従ってフィルタリングモードを切り替えることをおすすめします:

1. 本番以外の環境に、動作モードを`monitoring`に設定したWallarmフィルタリングノードをデプロイします。
1. 本番環境に、動作モードを`monitoring`に設定したWallarmフィルタリングノードをデプロイします。
1. 全ての環境（テストと本番を含む）で7‑14日間、フィルタリングノード経由でトラフィックを流し、Wallarmのクラウドベースバックエンドがアプリケーションを学習する時間を確保します。
1. すべての本番以外の環境でWallarmの`block`モードを有効化し、自動テストまたは手動テストで保護対象アプリケーションが期待どおり動作することを確認します。
1. 本番環境でWallarmの`block`モードを有効化し、利用可能な手段でアプリケーションが期待どおり動作することを確認します。