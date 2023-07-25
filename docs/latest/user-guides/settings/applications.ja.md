# アプリケーションの設定

企業が複数のアプリケーションを持っている場合、企業全体のトラフィックの統計を表示するだけでなく、各アプリケーションの統計を個別に表示することが便利かもしれません。アプリケーションごとにトラフィックを分けるには、Wallarmシステムで「アプリケーション」エンティティを使用できます。

!!! warning "CDNノード用のアプリケーション設定のサポート"
    [Wallarm CDN ノード](../../installation/cdn-node.ja.md)用のアプリケーションを設定するには、[Wallarm サポートチーム](mailto:support@wallarm.com)に依頼してください。

アプリケーションを使用することで、以下のことができます。

* 各アプリケーションごとにイベントと統計を表示する
* 特定のアプリケーションに対して[トリガー](../triggers/triggers.ja.md)、[ルール](../rules/add-rule.ja.md)、および他の Wallarm 機能を設定する
* [分離された環境で Wallarm を設定する](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.ja.md)

Wallarm でアプリケーションを識別するためには、ノード設定で適切なディレクティブを使用してそれらに一意の識別子を割り当てる必要があります。識別子は、アプリケーションドメインとドメインパスの両方に設定することができます。

デフォルトでは、Wallarm は各アプリケーションを識別子（ID）`-1`の`default`アプリケーションとして考慮しています。

## アプリケーションの追加

1. （オプション）Wallarm Console → **設定** → **アプリケーション**でアプリケーションを追加します。

    ![!アプリケーションの追加](../../images/user-guides/settings/configure-app.png)

    !!! warning "管理者アクセス"
        **管理者** 役割を持つユーザーのみが、**設定** → **アプリケーション** セクションにアクセスできます。
2. ノード設定でアプリケーションに一意の ID を割り当てます。

    * Wallarm が NGINX モジュール、クラウドマーケットプレイス画像、設定ファイルがマウントされた NGINX ベースの Docker コンテナ、サイドカーコンテナとしてインストールされている場合、ディレクティブ [`wallarm_application`](../../admin-en/configure-parameters-en.ja.md#wallarm_application)。
    * Wallarm が NGINX ベースの Docker コンテナとしてインストールされている場合、[環境変数](../../admin-en/installation-docker-en.ja.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION`。
    * Wallarm が Ingress コントローラとしてインストールされている場合、[Ingress アノテーション](../../admin-en/configure-kubernetes-en.ja.md#ingress-annotations) `wallarm-application`。
    * 設定ファイルがマウントされた Envoy ベースの Docker コンテナとして Wallarm がインストールされている場合、パラメータ [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.ja.md#basic-settings)。

    値は `0` を除く正の整数にすることができます。

    指定された ID でアプリケーションが Wallarm Console → **設定** → **アプリケーション** に追加されていない場合、リストに自動的に追加されます。指定された識別子に基づいてアプリケーション名が自動生成されます（例えば、ID `-1`のアプリケーションについては `Application #1`）。名称は後で Wallarm Console 経由で変更できます。

アプリケーションが適切に設定されている場合、その名前は、このアプリケーションに対象とされた攻撃の詳細に表示されます。アプリケーションの設定をテストするには、アプリケーションのアドレスに[テスト攻撃](../../admin-en/installation-check-operation-en.ja.md#2-run-a-test-attack)を送信できます。

## 自動アプリケーション識別

以下の基準で自動アプリケーション識別を設定できます。

* 特定のリクエストヘッダー
* `map` NGINX ディレクティブを使用した特定のリクエストヘッダーまたは URL の一部

!!! info "NGINX のみ"
    上記の手法は、NGINX ベースのノード展開にのみ適用されます。

### 特定のリクエストヘッダーに基づくアプリケーション識別

この方法には2つのステップが含まれます。

1. ネットワークを設定して、アプリケーション ID が含まれるヘッダーが各リクエストに追加されるようにします。
1. このヘッダーの値を `wallarm_application` ディレクティブの値として使用します。以下の例を参照してください。

NGINX の設定ファイル（`/etc/nginx/default.conf`）の例：

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

このリクエストでは：

* 攻撃と見なされ、**イベント** セクションに追加されます。
* ID `222` のアプリケーションと関連付けられます。
* 対応するアプリケーションが存在しない場合、**設定** → **アプリケーション** に追加され、自動的に `Application #222` と名付けられます。

![!ヘッダーリクエストに基づくアプリケーションの追加](../../images/user-guides/settings/configure-app-auto-header.png)

### `map` NGINX ディレクティブを使った特定のリクエストヘッダーやURLの一部に基づくアプリケーション識別

`map` NGINX ディレクティブを使って、特定のリクエストヘッダーやエンドポイントURLの一部に基づいてアプリケーションを追加できます。ディレクティブの詳細な説明は、NGINX の[ドキュメント](https://nginx.org/en/docs/http/ngx_http_map_module.html#map)で参照できます。

## アプリケーションの削除

Wallarm システムからアプリケーションを削除するには、ノード設定ファイルから適切なディレクティブを削除します。アプリケーションが **設定** → **アプリケーション** セクションからのみ削除されている場合、リストに復元されます。