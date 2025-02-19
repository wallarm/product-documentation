[api-discovery-enable-link]:        ../api-discovery/setup.md#enable
[link-wallarm-mode-override]:       ../admin-en/configure-parameters-en.md#wallarm_mode_allow_override
[rule-creation-options]:            ../user-guides/events/check-attack.md#attack-analysis_1
[acl-access-phase]:                 ../admin-en/configure-parameters-en.md#wallarm_acl_access_phase 
[img-mode-rule]:                    ../images/user-guides/rules/wallarm-mode-rule.png

# フィルトレーションモード

フィルトレーションモードは、受信リクエストを処理する際のフィルタリングノードの動作を定義します。本ドキュメントでは、利用可能なフィルトレーションモードおよびその設定方法について説明します。

## 利用可能なフィルトレーションモード

Wallarmフィルタリングノードは、受信リクエストを以下のモード（穏やかなものから厳格なものへ順に）で処理できます：

* **無効** (`off`)
* **モニタリング** (`monitoring`)
* **セーフブロッキング** (`safe_blocking`)
* **ブロッキング** (`block`)

--8<-- "../include/wallarm-modes-description-latest.md"

## 設定方法

フィルトレーションモードは、以下の方法で設定できます。

* [ノード側で`wallarm_mode`ディレクティブを設定する](#setting-wallarm_mode-directive)
* [Wallarm Consoleにおける一般的なフィルトレーションルールを定義する](#general-filtration-rule-in-wallarm-console)
* [Wallarm Consoleにおけるエンドポイント対象のフィルトレーションルールを定義する](#endpoint-targeted-filtration-rules-in-wallarm-console)

フィルトレーションモード設定方法の優先順位は、[`wallarm_mode_allow_override`ディレクティブ](#prioritization-of-methods)によって決定されます。デフォルトでは、Wallarm Consoleで指定された設定は、その値の厳格度に関係なく、`wallarm_mode`ディレクティブによる設定よりも優先されます。

### `wallarm_mode`ディレクティブの設定

ノード側で`wallarm_mode`ディレクティブを使用してフィルトレーションモードを設定できます。異なるデプロイメントにおける`wallarm_mode`ディレクティブの設定上の特徴を以下に説明します。

なお、本設定は[in-line](../installation/inline/overview.md)デプロイメントにのみ適用されます。[out-of-band (OOB)](../installation/oob/overview.md)ソリューションでは`monitoring`モードのみが有効です。

=== "All-in-oneインストーラー"

    Linux上に[all-in-one installer](../installation/nginx/all-in-one.md)を使用してインストールされたNGINXベースのノードでは、フィルタリングノードの設定ファイルに`wallarm_mode`ディレクティブを設定できます。異なるコンテキストに対してフィルトレーションモードを定義できます。これらのコンテキストは、以下のリストのように、最もグローバルなものから最もローカルなものへと順に並びます：

    * `http`: HTTPサーバーに送信されるリクエストにディレクティブが適用されます。
    * `server`: 仮想サーバーに送信されるリクエストにディレクティブが適用されます。
    * `location`: 該当のパスを含むリクエストにのみディレクティブが適用されます。

    もし`http`、`server`、`location`ブロックで異なる`wallarm_mode`ディレクティブの値が定義されている場合、最もローカルな設定が最も高い優先順位を持ちます。

    以下の[設定例](#configuration-example)を参照してください。

=== "Docker NGINXベースイメージ"

    Dockerコンテナを使用してNGINXベースのWallarmノードをデプロイする場合、`WALLARM_MODE`環境変数を[渡してください](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)：

    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/node:5.3.0
    ```

=== "Docker Envoyベースイメージ"

    Dockerコンテナを使用してEnvoyベースのWallarmノードをデプロイする場合、`WALLARM_MODE`環境変数を[渡してください](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)：

    ```
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_MODE='monitoring' -p 80:80 wallarm/envoy:4.8.0-1
    ```

    または、設定ファイルに対応するパラメータを[含め](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)て、当該ファイルをマウントしてコンテナを実行してください。

=== "NGINX Ingressコントローラー"

    NGINX Ingressコントローラーの場合、`wallarm-mode`アノテーションを使用してください：

    ```
    kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
    ```

    フィルトレーションモードを`monitoring`に設定して、NGINXベースのIngressコントローラーでのトラフィック分析が[どのように有効になるか](../admin-en/installation-kubernetes-en.md#step-2-enabling-traffic-analysis-for-your-ingress)の例を参照してください。

=== "Kong Ingressコントローラー"

    Kong Ingressコントローラーの場合、`wallarm-mode`アノテーションを使用してください：

    ```
    kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
    ```

    フィルトレーションモードを`monitoring`に設定して、KongベースのIngressコントローラーでのトラフィック分析が[どのように有効になるか](../installation/kubernetes/kong-ingress-controller/deployment.md#step-3-enable-traffic-analysis-for-your-ingress)の例を参照してください。

=== "サイドカー"

    Wallarm Sidecarソリューションの場合、デフォルトの`values.yaml`のWallarm固有部分で`mode`パラメータを設定してください：

    ```
    config:
    wallarm:
        ...
        mode: monitoring
        modeAllowOverride: "on"
    ```

    サイドカー用のフィルトレーションモードの指定方法については、[こちら](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md)を参照してください。

=== "Edgeコネクター"

    [Security Edge connectors](../installation/se-connector.md)の場合、コネクターのデプロイ時に**Filtration mode**セレクターで`wallarm_mode`の値を指定してください。

=== "Native Node"
    * Native Node all-in-one installerおよびDockerイメージの場合、[`route_config.wallarm_mode`](../installation/native-node/all-in-one-conf.md#route_configwallarm_mode)パラメータを使用してください。
    * Native Node Helmチャートの場合、[`config.connector.mode`](../installation/native-node/helm-chart-conf.md#configconnectormode)パラメータを使用してください。

### Wallarm Consoleにおける一般的なフィルトレーションルール

[US](https://us1.my.wallarm.com/settings/general)または[EU](https://my.wallarm.com/settings/general) Cloudの**Settings**→**General**で、すべての受信リクエストに対する一般的なフィルトレーションモードを定義できます。
    
![一般設定タブ](../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png)

一般的なフィルトレーションモードの設定は、**Rules**セクションにおける**Set filtration mode**[default](../user-guides/rules/rules.md#default-rules)ルールとして表されます。なお、このセクションのエンドポイント対象のフィルトレーションルールは、より高い優先順位を持ちます。

### Wallarm Consoleにおけるエンドポイント対象のフィルトレーションルール

特定のブランチ、エンドポイント、およびその他の条件に基づいてフィルトレーションモードを設定できます。Wallarmはこの目的のために**Set filtration mode**[ルール](../user-guides/rules/rules.md)を提供しています。これらのルールは、[Wallarm Consoleで設定された一般的なフィルトレーションルール](#general-filtration-rule-in-wallarm-console)よりも高い優先順位を持ちます。

新たなフィルトレーションモードルールを作成するには：

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection**→**Override filtration mode**を選択します。 
1. **If request is**において、ルールを適用する対象範囲を[記述](../user-guides/rules/rules.md#configuring)します。特定のブランチ、ヒット、エンドポイントに対してルールを作成した場合、それらが対象範囲を定義します。必要に応じて、条件を追加できます。
1. 目的のモードを選択します。
1. 変更を保存し、[ルールのコンパイル完了](../user-guides/rules/rules.md#ruleset-lifecycle)を待ちます。

フィルトレーションモードルールを作成するには、[Wallarm APIを直接呼び出す](../api/request-examples.md#create-the-rule-setting-filtration-mode-to-monitoring-for-the-specific-application)こともできますのでご注意ください。

### 設定方法の優先順位

!!! warning "Edgeノードにおける`wallarm_mode_allow_override`ディレクティブのサポート"
    Wallarm Edgeの[inline](../installation/security-edge/deployment.md)および[connector](../installation/se-connector.md)ノードでは、`wallarm_mode_allow_override`ディレクティブをカスタマイズできない点にご留意ください。

`wallarm_mode_allow_override`ディレクティブは、フィルタリングノードの設定ファイルに記載された`wallarm_mode`ディレクティブの値ではなく、Wallarm Consoleで定義されたルールを適用する機能を管理します。

`wallarm_mode_allow_override`ディレクティブには、以下の値が有効です：

* `off`: Wallarm Consoleで指定されたルールは無視され、設定ファイルに記載された`wallarm_mode`ディレクティブによるルールが適用されます。
* `strict`: 設定ファイルに記載された`wallarm_mode`ディレクティブの値よりも厳しいフィルトレーションモードを定義するWallarm Cloudで指定されたルールのみが適用されます。

    利用可能なフィルトレーションモードは、最も穏やかなものから最も厳格なものまで、[上記](#available-filtration-modes)に記載されています。

* `on` (デフォルト): Wallarm Consoleで指定されたルールが適用され、設定ファイルに記載された`wallarm_mode`ディレクティブの値は無視されます。

`wallarm_mode_allow_override`ディレクティブの値を定義できるコンテキストは、最もグローバルなものから最もローカルなものまで、以下のリストに示されています：

* `http`: `http`ブロック内のディレクティブは、HTTPサーバーに送信されるリクエストに適用されます。
* `server`: `server`ブロック内のディレクティブは、仮想サーバーに送信されるリクエストに適用されます。
* `location`: `location`ブロック内のディレクティブは、該当のパスを含むリクエストにのみ適用されます。

もし`http`、`server`、`location`ブロックで異なる`wallarm_mode_allow_override`ディレクティブの値が定義されている場合、最もローカルな設定が最も高い優先順位を持ちます。

**`wallarm_mode_allow_override`ディレクティブの使用例：**

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

この設定例では、Wallarm Consoleからのフィルトレーションモードルールの適用が以下のようになります：

1. 仮想サーバー`SERVER_A`に送信されるリクエストについては、Wallarm Consoleで定義されたフィルトレーションモードルールは無視されます。`SERVER_A`に対応する`server`ブロックに`wallarm_mode`ディレクティブが指定されていないため、`http`ブロックで指定された`monitoring`フィルトレーションモードが適用されます。
2. 仮想サーバー`SERVER_B`に送信されるリクエストについては、`/main/login`パスを含むリクエストを除き、Wallarm Consoleで定義されたフィルトレーションモードルールが適用されます。
3. 仮想サーバー`SERVER_B`に送信され、`/main/login`パスを含むリクエストについては、設定ファイルで指定された`monitoring`モードよりも厳しいフィルトレーションモードを定義する場合に限り、Wallarm Consoleで定義されたフィルトレーションモードルールが適用されます。

## 設定例

ここでは、これまでに述べたすべての方法を使用したフィルトレーションモード設定の例を考えます。

### ノード設定ファイル

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

### Wallarm Consoleのルール

* [Wallarm Consoleにおける一般的なフィルトレーションルール](#general-filtration-rule-in-wallarm-console)：**モニタリング**。
* [エンドポイント対象のフィルトレーションルール](#endpoint-targeted-filtration-rules-in-wallarm-console):
    * リクエストが以下の条件を満たす場合：
        * メソッド：`POST`
        * パスの第1部分：`main`
        * パスの第2部分：`apply`、
        
        その場合、**Default**フィルトレーションモードを適用します。
        
    * リクエストが以下の条件を満たす場合：
        * パスの第1部分：`main`、
        
        その場合、**Blocking**フィルトレーションモードを適用します。
        
    * リクエストが以下の条件を満たす場合：
        * パスの第1部分：`main`
        * パスの第2部分：`login`、
        
        その場合、**Monitoring**フィルトレーションモードを適用します。

### リクエスト例

設定されたサーバー`SERVER_A`に送信されたリクエストと、それに対してWallarmフィルタリングノードが適用する動作の例は以下の通りです：

* `SERVER_A`サーバーに対する`wallarm_mode monitoring;`設定により、`/news`パスの悪意のあるリクエストは処理されますがブロックされません。

* `SERVER_A`サーバーに対する`wallarm_mode monitoring;`設定により、`/main`パスの悪意のあるリクエストは処理されますがブロックされません。サーバー`SERVER_A`の`wallarm_mode_allow_override off;`設定のため、Wallarm Consoleで定義された**Blocking**ルールは適用されません。

* `/main/login`パスのリクエストに対する`wallarm_mode block;`設定により、`/main/login`パスの悪意のあるリクエストはブロックされます。フィルタリングノード設定ファイルの`wallarm_mode_allow_override strict;`設定により、Wallarm Consoleで定義された**Monitoring**ルールは適用されません。

* `/main/signup`パスのリクエストは、`wallarm_mode_allow_override strict;`設定および`/main`パスに対してWallarm Consoleで定義された**Blocking**ルールによりブロックされます。

* `/main/apply`パスかつ`GET`メソッドの悪意のあるリクエストは、`/main/apply`パスのリクエストに対する`wallarm_mode_allow_override on;`設定および`/main`パスに対してWallarm Consoleで定義された**Blocking**ルールによりブロックされます。
* `/main/apply`パスかつ`POST`メソッドの悪意のあるリクエストは、`/main/apply`パスのリクエストに対する`wallarm_mode_allow_override on;`設定、Wallarm Consoleで定義された**Default**ルール、およびフィルタリングノード設定ファイル内の`/main/apply`パスに対する`wallarm_mode block;`設定によりブロックされます。
* `/main/feedback`パスの悪意のあるリクエストは、フィルタリングノード設定ファイルにおける`wallarm_mode safe_blocking;`設定により、[graylisted IP](../user-guides/ip-lists/overview.md)からのものである場合にのみブロックされます。フィルタリングノード設定ファイルの`wallarm_mode_allow_override off;`設定により、Wallarm Consoleで定義された**Monitoring**ルールは適用されません。

## フィルトレーションモードの段階的適用に関するベストプラクティス

新規Wallarmノードの導入を成功させるため、フィルトレーションモードを切り替える以下のステップバイステップの推奨事項に従ってください：

1. ノンプロダクション環境にWallarmフィルタリングノードを`monitoring`オペレーションモードでデプロイします。
2. プロダクション環境にWallarmフィルタリングノードを`monitoring`オペレーションモードでデプロイします。
3. テスト環境やプロダクション環境を含めた全ての環境で、7～14日間フィルタリングノード経由のトラフィックを継続させ、Wallarm Cloudベースのバックエンドがアプリケーションを学習するための時間を確保します。
4. ノンプロダクション環境ですべて、Wallarmの`block`モードを有効にし、自動もしくは手動のテストを用いて保護対象アプリケーションが期待通りに動作していることを確認します。
5. プロダクション環境でもWallarmの`block`モードを有効にし、利用可能な方法を用いてアプリケーションが期待通りに動作していることを確認します。