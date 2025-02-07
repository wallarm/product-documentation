```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Cloudflare用Wallarmコネクタ

[Cloudflare](https://www.cloudflare.com/)は、ウェブサイトやインターネットアプリケーションのセキュリティ、速度、信頼性を向上させるために設計された機能（CDN、WAF、DNSサービス、SSL/TLS暗号化など）を提供するセキュリティおよびパフォーマンスサービスです。Wallarmは、Cloudflare上で実行されるAPIを保護するためのコネクタとして機能します。

Cloudflare用コネクタとしてWallarmを利用するには、まずWallarm Nodeを外部にデプロイし、Wallarm提供のコードを使用したCloudflareワーカーを実行してトラフィックを分析のためWallarm Nodeへルーティングする必要があります。

<a name="cloudflare-modes"></a>Cloudflareコネクタは、[インライン](../inline/overview.md)および[アウトオブバンド](../oob/overview.md)の両方のトラフィックフローをサポートします：

=== "インライントラフィックフロー"

    Wallarmが悪意のあるアクティビティをブロックするように設定されている場合:

    ![CloudflareとWallarmの組み合わせ（インラインスキーム）](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "アウトオブバンドトラフィックフロー"
    ![CloudflareとWallarmの組み合わせ（アウトオブバンドスキーム）](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## 使用例

すべての[Wallarm deployment options](../supported-deployment-options.md)の中で、このソリューションはCloudflare経由でアプリケーションにアクセスを提供する場合に推奨されます。

## 制約事項

* Wallarmルールによる[Rate limiting](../../user-guides/rules/rate-limiting.md)はサポートされません。
* [Multitenancy](../multi-tenant/overview.md)はまだサポートされていません。

## 要件

デプロイを進めるために、以下の要件を満たしていることを確認してください：

* Cloudflareテクノロジーの理解。
* Cloudflareを介して実行されるAPIまたはトラフィック。

## デプロイ

### 1. Wallarm Nodeのデプロイ

Wallarm NodeはWallarmプラットフォームにおける中核コンポーネントで、デプロイが必要です。受信トラフィックを検査し、悪意のあるアクティビティを検出し、脅威を軽減するように設定できます。

Wallarmホスティング型もしくはご自身のインフラでデプロイすることができ、必要な制御レベルに応じて選択できます。

=== "Edgeノード"
    コネクタ用のWallarmホスティングノードのデプロイには、[手順](../se-connector.md)に従ってください。
=== "Selfホスティングノード"
    Selfホスティングノードのデプロイ用のアーティファクトを選択し、添付の手順に従ってください：

    * [All-in-one installer](../native-node/all-in-one.md)：ベアメタルまたはVM上のLinuxインフラ用
    * [Docker image](../native-node/docker-image.md)：コンテナ配備環境用
    * [Helm chart](../native-node/helm-chart.md)：Kubernetesを利用するインフラ用

### 2. Wallarmワーカーコードの取得とデプロイ

Wallarm NodeにトラフィックをルーティングするCloudflareワーカーを実行するには：

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、ご利用のプラットフォームに対応したコードバンドルをダウンロードしてください。

    Selfホスティングノードを実行している場合は、sales@wallarm.comに連絡し、コードバンドルを入手してください。
1. ダウンロードしたコードを使用して[Cloudflareワーカー](https://developers.cloudflare.com/workers/get-started/dashboard/)を作成してください。
1. `wallarm_node`パラメータに[Wallarm Nodeインスタンス](#1-deploy-a-wallarm-node)のアドレスを設定してください。
1. 必要に応じて、[他のパラメータ](#configuration-options)も変更してください。

    ![Cloudflareワーカー](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. **Website** → ご利用のドメインに移動し、**Workers Routes** → **Add route**にアクセスしてください：

    * Routeには、Wallarmによる分析を行うためにルーティングするパスを指定してください（例：すべてのパスの場合は`*.example.com/*`）。
    * Workerには、作成したWallarmワーカーを選択してください。

    ![Cloudflareルートの追加](../../images/waf-installation/gateways/cloudflare/add-route.png)

## テスト

デプロイ済みソリューションの機能をテストするには、次の手順に従ってください：

1. テスト[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストをAPIに送信してください：

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクション（[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)）を開き、攻撃がリストに表示されていることを確認してください。
    
    ![インターフェースに表示された攻撃][attacks-in-ui-image]

    Wallarm Nodeモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックフローがインラインの場合、リクエストはブロックされます。

## 設定オプション

ワーカーコード内で、以下のパラメータを指定できます：

| パラメータ | 説明 | 必須? |
| --------- | ----------- | --------- |
| `wallarm_node` | Wallarm Nodeインスタンスのアドレスを設定します。 | 必須 |
| `wallarm_mode` | トラフィック処理モードを決定します：`inline`（デフォルト）はトラフィックをWallarm Nodeで直接処理し、`async`は元のフローに影響を与えずにトラフィックの[コピー](../oob/overview.md)を解析します。 | 非必須 |
| `wallarm_send_rsp_body` | スキーマ[discovery](../../api-discovery/overview.md)および[brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md)などの攻撃検出強化のため、レスポンスボディ解析を有効にします。デフォルト：`true`（有効）。 | 非必須 |
| `wallarm_response_body_limit` | Nodeが解析できるレスポンスボディサイズ（バイト単位）の制限です。デフォルトは`0x4000`です。 | 非必須 |
| `wallarm_block_page.custom_path`<br>(Worker version 1.0.1+) | NodeからHTTP 403レスポンスとして返されるカスタムブロッキングページのURLです。例： `https://example.com/block-page.html`。<br>デフォルト：`null`（`html_page`が`true`の場合、詳細なWallarm提供のエラーページを使用します）。 | 非必須 |
| `wallarm_block_page.html_page`<br>(Worker version 1.0.1+) | 悪意のあるリクエストに対してカスタムHTMLブロッキングページを有効にします。デフォルト：`false`（シンプルなHTTP 403を返します）。 | 非必須 |
| `wallarm_block_page.support_email`<br>(Worker version 1.0.1+) | 問題報告用にブロッキングページに表示されるメールアドレスです。デフォルト：`support@mycorp.com`。 `html_page`が`true`の場合は必須です。 | 必須（`html_page`が`true`の場合） |

!!! info "Wallarm提供のエラーページを表示"
    HTTP 403レスポンスとして返されるWallarm提供のエラーページは以下のようになります：

    ![Wallarmブロッキングページ](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Cloudflareワーカーのアップグレード

デプロイ済みのCloudflareワーカーを[新しいバージョン](code-bundle-inventory.md#cloudflare)にアップグレードするには：

1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、最新のWallarm Cloudflareコードバンドルをダウンロードしてください。

    Selfホスティングノードを実行している場合は、sales@wallarm.comに連絡して最新のコードバンドルを取得してください。
1. デプロイ済みのCloudflareワーカーのコードを最新のバンドルに置き換えてください。

    `wallarm_node`、`wallarm_mode`などの既存のパラメータ値は維持してください。
1. **Deploy**を実行して、更新された関数をデプロイしてください。

ワーカーのアップグレードには、特にメジャーバージョンアップの場合、Wallarm Nodeのアップグレードが必要になることがあります。リリースの更新やアップグレード手順については[Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。非推奨を回避し将来のアップグレードを簡素化するため、定期的なNodeの更新を推奨します。
```