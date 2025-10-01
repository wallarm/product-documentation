# アプリケーションの設定

会社に複数のアプリケーションがある場合、会社全体のトラフィック統計だけでなく、各アプリケーションごとの統計を個別に閲覧できると便利です。アプリケーションごとにトラフィックを分離するには、Wallarmシステムの「アプリケーション」エンティティを使用できます。

アプリケーションを使用すると、次のことが可能です。

* 各アプリケーションごとのイベントと統計を[閲覧](#viewing-events-and-statistics-by-application)する
* 特定のアプリケーション向けにトリガー、ルール、その他のWallarm機能を[構成](#configuring-wallarm-features-by-application)する
* 環境（本番、テストなど）を個別のアプリケーションとして扱う

    !!! info "環境の分離"
        アプリケーションとして管理される環境は、現在のWallarmアカウントのすべてのユーザーがアクセスできます。特定のユーザーのみにアクセスを制限したい場合は、アプリケーションではなく[multitenancy](../../installation/multi-tenant/overview.md)機能を使用してください。

Wallarmがアプリケーションを識別できるようにするには、ノードの設定で適切なディレクティブを使って各アプリケーションに一意の識別子を割り当てる必要があります。識別子はアプリケーションのドメインにもドメインパスにも設定できます。

デフォルトでは、Wallarmは各アプリケーションを識別子（ID）`-1`の`default`アプリケーションとして扱います。

## アプリケーションの追加

1. （任意）Wallarm Console → **Settings** → **Applications**でアプリケーションを追加します。

    ![アプリケーションを追加する](../../images/user-guides/settings/configure-app.png)

    !!! warning "管理者アクセス"
        ロールが**Administrator**のユーザーのみが**Settings** → **Applications**セクションにアクセスできます。
2. ノードの設定で次のいずれかの方法により、アプリケーションに一意のIDを割り当てます。

    * WallarmがNGINXモジュール、クラウドマーケットプレイスイメージ、設定ファイルをマウントしたNGINXベースのDockerコンテナ、サイドカーコンテナとしてインストールされている場合は、ディレクティブ[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)を使用します。
    * WallarmがNGINXベースのDockerコンテナとしてインストールされている場合は、[環境変数](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)`WALLARM_APPLICATION`を使用します。
    * WallarmがIngressコントローラーとしてインストールされている場合は、[Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations)`wallarm-application`を使用します。
    * Native Nodeのall-in-oneインストーラー、Dockerイメージ、AWS AMIの場合は、[`route_config.wallarm_application`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_application)パラメータを使用します。
    * Native NodeのHelm chartの場合は、[`config.connector.route_config.wallarm_application`](../../installation/native-node/helm-chart-conf.md#configconnectorroute_configwallarm_application)パラメータを使用します。
    * Edgeのインラインまたはコネクタのセットアップウィンドウでアプリケーションを設定します。

    値は`0`を除く正の整数に設定できます。

    指定したIDのアプリケーションがWallarm Console → **Settings** → **Applications**に追加されていない場合、自動的に一覧に追加されます。アプリケーション名は指定した識別子に基づいて自動生成されます（例: IDが`-1`のアプリケーションは`Application #1`）。名前は後でWallarm Consoleから変更できます。

アプリケーションが正しく構成されている場合、そのアプリケーションを対象とした攻撃の詳細にアプリケーション名が表示されます。アプリケーションの構成をテストするには、アプリケーションのアドレスに[テスト攻撃](../../admin-en/uat-checklist-en.md#node-registers-attacks)を送信できます。

## アプリケーションの自動識別

次の基準に基づいてアプリケーションの自動識別を構成できます。

* 特定のリクエストヘッダー
* NGINXの`map`ディレクティブを使用した特定のリクエストヘッダーまたはURLの一部

!!! info "NGINXのみ"
    ここで説明する方法は、NGINXベースのセルフホスト型ノードのデプロイにのみ適用されます。

### 特定のリクエストヘッダーに基づくアプリケーション識別

この方法は次の2ステップで構成します。

1. 各リクエストにアプリケーションIDを含むヘッダーが追加されるようにネットワークを構成します。
1. このヘッダーの値を`wallarm_application`ディレクティブの値として使用します。以下の例を参照してください。

NGINX設定ファイルの例:

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

このリクエストは次のように処理されます。

* 攻撃と見なされ、**Attacks**セクションに追加されます。
* IDが`222`のアプリケーションに関連付けられます。
* 該当するアプリケーションが存在しない場合、**Settings** → **Applications**に追加され、自動的に`Application #222`という名前が付けられます。

![ヘッダーに基づくアプリケーションの追加](../../images/user-guides/settings/configure-app-auto-header.png)

### NGINXの`map`ディレクティブを使用し、特定のリクエストヘッダーまたはURLの一部に基づくアプリケーション識別 

NGINXの`map`ディレクティブを使用して、特定のリクエストヘッダーやエンドポイントURLの一部に基づきアプリケーションを追加できます。ディレクティブの詳細はNGINXの[ドキュメント](https://nginx.org/en/docs/http/ngx_http_map_module.html#map)を参照してください。

## アプリケーション別のイベントと統計の表示

アプリケーションを設定したら、次の内容をアプリケーションごとに個別に表示できます。

* 関心のあるアプリケーションだけの[Attacks](../../user-guides/events/check-attack.md)と[incidents](../../user-guides/events/check-incident.md)
* 関心のあるアプリケーションだけに関連する[API sessions](../../api-sessions/overview.md)
* 関心のあるアプリケーションだけに関連する[dashboards](../../user-guides/dashboards/threat-prevention.md)の統計

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/njvywcvjddzd?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## アプリケーション別のWallarm機能の設定

アプリケーションを設定したら、次のWallarm保護機能をアプリケーションごとに個別に構成できます。

* [Rules](../rules/rules.md#conditions)
* [Triggers](../triggers/triggers.md#understanding-filters)
* [IP lists](../ip-lists/overview.md#limit-by-target-application)
* [API Abuse Prevention](../../api-abuse-prevention/setup.md#creating-profiles)

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/1dsy6claa8wb?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Wallarmの機能をアプリケーションに割り当てることは、それらの機能を適用する条件を指定し、インフラストラクチャの各部分に対して設定を差別化する最も簡単な方法です。

## アプリケーションの削除

Wallarmシステムからアプリケーションを削除するには、ノードの設定ファイルから該当するディレクティブを削除します。**Settings** → **Applications**セクションからのみアプリケーションを削除した場合は、一覧に復元されます。