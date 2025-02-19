# アプリケーションの設定

企業に複数のアプリケーションがある場合、会社全体のトラフィック統計だけでなく、各アプリケーションごとの統計を個別に確認できることが便利です。トラフィックをアプリケーション別に分離するために、Wallarmシステム内で "application" エンティティを使用できます。

アプリケーションを使用することで、以下のことが可能です：

* 各アプリケーションごとにイベントと統計情報を個別に確認します。
* 特定のアプリケーションに対して[triggers](../triggers/triggers.md)、[rules](../rules/rules.md)などのWallarm機能を設定します。
* [Configure Wallarm in separated environments](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md)します。

Wallarmがアプリケーションを識別するためには、ノード構成内で適切なディレクティブを使用して一意の識別子を割り当てる必要があります。識別子は、アプリケーションのドメインおよびドメインパスの両方に対して設定可能です。

デフォルトでは、Wallarmは各アプリケーションを識別子 (ID) `-1` の `default` アプリケーションと見なします。

## アプリケーションの追加

1. （任意）Wallarm Console → **Settings** → **Applications** でアプリケーションを追加します。

    ![Adding an application](../../images/user-guides/settings/configure-app.png)

    !!! warning "管理者アクセス"
        **Administrator** ロールのユーザーのみが **Settings** → **Applications** セクションにアクセスできます。
2. ノード構成内で以下の方法によりアプリケーションに一意のIDを割り当てます：

    * WallarmがNGINXモジュール、cloud marketplace image、マウントされた構成ファイルを持つNGINXベースのDockerコンテナ、またはサイドカーコンテナとしてインストールされている場合は、ディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)を使用します。
    * WallarmがNGINXベースのDockerコンテナとしてインストールされている場合は、[環境変数](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION` を使用します。
    * WallarmがIngressコントローラーとしてインストールされている場合は、[Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` を使用します。
    * Wallarmがマウントされた構成ファイルを持つEnvoyベースのDockerコンテナとしてインストールされている場合は、パラメータ[`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)を使用します。
    * Native NodeオールインワンインストーラーおよびDockerイメージの場合は、[`route_config.wallarm_application`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_application)パラメータを使用します。
    * Native Node Helmチャートの場合は、[`config.connector.route_config.wallarm_application`](../../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_application)パラメータを使用します。
    * Edge inlineまたはconnectorセットアップウィンドウでのアプリケーション構成を使用します。

    値は `0` を除く正の整数でなければなりません。

    指定されたIDのアプリケーションが Wallarm Console → **Settings** → **Applications** に追加されていない場合、自動的にリストに追加されます。アプリケーション名は指定された識別子に基づいて自動的に生成されます（例：IDが `-1` のアプリケーションの場合は `Application #1`）。アプリケーション名は後でWallarm Consoleから変更できます。

アプリケーションが正しく構成されている場合、その名前はこのアプリケーションを狙った攻撃の詳細に表示されます。アプリケーション構成をテストするには、アプリケーションのアドレスに[test attack](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信してください。

## 自動アプリケーション識別

以下の方法に基づいて自動的なアプリケーション識別を設定できます：

* 特定のリクエストヘッダー
* `map` NGINXディレクティブを使用した特定のリクエストヘッダーまたはURLの一部

!!! info "NGINX限定"
    記載のアプローチはNGINXベースのセルフホストノード展開の場合にのみ適用されます。

### 特定のリクエストヘッダーに基づくアプリケーション識別

このアプローチは2つのステップで構成されます：

1. 各リクエストにアプリケーションIDを含むヘッダーが追加されるよう、ネットワークを構成します。
1. このヘッダーの値を `wallarm_application` ディレクティブの値として使用します。以下の例を参照してください。

NGINX構成ファイルの例：

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

攻撃リクエストの例：

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

このリクエストは以下を行います：

* 攻撃と見なされ、**Attacks** セクションに追加されます。
* ID `222` のアプリケーションに関連付けられます。
* 該当アプリケーションが存在しない場合、**Settings** → **Applications** に追加され、自動的に `Application #222` と命名されます。

![Adding an application on the base of header request](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINXディレクティブを使用した特定のリクエストヘッダーまたはURLの一部に基づくアプリケーション識別

`map` NGINXディレクティブを使用して、特定のリクエストヘッダーまたはエンドポイントURLの一部に基づいてアプリケーションを追加できます。ディレクティブの詳細な説明についてはNGINX [documentation](https://nginx.org/en/docs/http/ngx_http_map_module.html#map)を参照してください。

## アプリケーションの削除

Wallarmシステムからアプリケーションを削除するには、ノード構成ファイルから該当するディレクティブを削除します。**Settings** → **Applications** セクションからのみ削除された場合、リストに再表示されます。