# アプリケーションの設定

あなたの会社が複数のアプリケーションを持っている場合、全社のトラフィックの統計情報だけでなく、各アプリケーションの統計情報を個別に見ることが便利かもしれません。アプリケーションごとにトラフィックを分けるために、Wallarmシステム内の "アプリケーション" エンティティを使用することができます。

!!! warning "CDNノードのアプリケーション設定のサポート"
    [Wallarm CDNノード](../../installation/cdn-node.md)のためのアプリケーションを設定するには、[Wallarmサポートチーム](mailto:support@wallarm.com)に依頼してください。

アプリケーションを使用することで、以下のことが可能になります:

* 各アプリケーションのイベントと統計情報を個別に閲覧
* 特定のアプリケーションのための[トリガー](../triggers/triggers.md)、[ルール](../rules/rules.md)、その他のWallarm機能の設定
* [分離された環境でのWallarmの設定](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md)

Wallarmがあなたのアプリケーションを識別するためには、それらにノード設定の適切なディレクティブを通じて一意の識別子を割り当てることが必要です。識別子は、アプリケーションのドメインとドメインパスの両方に設定することができます。

デフォルトでは、Wallarmは各アプリケーションを識別子（ID）が `-1` の `default` アプリケーションと見なします。

## アプリケーションの追加

1. （オプション）Wallarm Console → **設定** → **アプリケーション**でアプリケーションを追加します。

    ![アプリケーションの追加](../../images/user-guides/settings/configure-app.png)

    !!! warning "管理者権限"
        **管理者**ロールを持つユーザーのみが、**設定** → **アプリケーション**セクションにアクセスすることができます。
2. ノード設定を通じてアプリケーションに一意のIDを割り当てます。

     * WallarmがNGINXモジュール、クラウドマーケットプレイスイメージ、設定ファイルがマウントされたNGINXベースのDockerコンテナ、サイドカーコンテナとしてインストールされている場合は、ディレクティブ [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) を使用します。
     * WallarmがNGINXベースのDockerコンテナとしてインストールされている場合は、[環境変数](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION`を使用します。
     * WallarmがIngressコントローラとしてインストールされている場合は、[Ingressアノテーション](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` を使用します。
     * Wallarmが設定ファイルがマウントされたEnvoyベースのDockerコンテナとしてインストールされている場合は、パラメータ [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)を使用します。

    値は `0` を除く正の整数にすることができます。

    指定したIDのアプリケーションがWallarm Console → **设定** → **アプリケーション**に追加されていない場合、自動的にリストに追加されます。アプリケーションの名前は、指定した識別子に基づいて自動生成されます（例：IDが `-1` のアプリケーションの場合は `Application #1`）。名前は後からWallarm Consoleで変更することができます。

アプリケーションが正しく設定されている場合、その名前はこのアプリケーションを目標とした攻撃の詳細に表示されます。アプリケーションの設定をテストするためには、アプリケーションのアドレスに[テスト攻撃](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信することができます。

## 自動アプリケーション識別

以下のものに基づいて自動アプリケーションの識別を設定することができます:

* 特定のリクエストヘッダー
* `map` NGINXディレクティブを使用した特定のリクエストヘッダーやURLの一部 

!!! info "NGINXのみ"
    上記のアプローチは、NGINXベースのノード展開にのみ適用されます。

### 特定のリクエストヘッダーに基づくアプリケーションの識別

このアプリーケーションには2つのステップが含まれています:

1. ネットワークを設定して、各リクエストにアプリケーションIDが含まれるヘッダーが追加されるようにします。
1. このヘッダーの値を `wallarm_application` ディレクティブの値として使用します。以下の例をご覧ください。

NGINX設定ファイル(`/etc/nginx/default.conf`)の例:

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

攻撃リクエストの例:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

このリクエストでは、以下の操作を実行します:

* 攻撃と見なされ、**イベント**セクションに追加されます。
* ID `222` のアプリケーションと関連付けられます。
* 対応するアプリケーションが存在しない場合、**設定**　→　**アプリケーション**に追加され、自動的に `アプリケーション #222` と命名されます。

![特定のリクエストヘッダーに基づくアプリケーションの追加](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINXディレクティブを使用した特定のリクエストヘッダーまたはURLの一部に基づいてアプリケーションを特定 

`map` NGINXディレクティブを使用して特定のリクエストヘッダーまたはエンドポイントURLの一部に基づいてアプリケーションを追加することができます。ディレクティブの詳細な説明はNGINXの[ドキュメンテーション](https://nginx.org/en/docs/http/ngx_http_map_module.html#map)を参照してください。

## アプリケーションの削除

アプリケーションをWallarmシステムから削除するには、ノード設定ファイルから適切なディレクティブを削除します。もしアプリケーションが **設定**　→　**アプリケーション**の欄からだけ削除された場合は、リストに再び表示されます。
