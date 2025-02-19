```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Fastly向けWallarmコネクタ

[Fastly](https://www.fastly.com/)は、コンテンツデリバリーネットワーク(CDN)サービス、リアルタイムなアプリケーションデリバリー、キャッシング、およびCompute@Edgeによるエッジ上でのカスタムロジック実行を提供する強力なエッジクラウドプラットフォームです。Wallarmコネクタを使用することで、Fastly上で稼働するAPIを保護できます。

FastlyのコネクタとしてWallarmを使用するには、**Wallarm Nodeを外部に展開し**、Wallarmが提供するバイナリを使用して**Fastly Computeサービスを実行し**、Wallarm Nodeへトラフィックをルーティングして解析を行う必要があります。

Fastlyコネクタは、[インライントラフィックフロー](../inline/overview.md)と[アウトオブバンドトラフィックフロー](../oob/overview.md)の両方に対応しています。

<!-- === "インライントラフィックフロー"

    Wallarmが悪意のあるアクティビティをブロックする設定の場合:

    ![Wallarmを使用したFastly - インラインスキーム](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-inline.png)
=== "アウトオブバンドトラフィックフロー"
    ![Wallarmを使用したFastly - アウトオブバンドスキーム](../../images/waf-installation/gateways/fastly/fastly-traffic-flow-oob.png) -->

## ユースケース

サポートされているすべての[Wallarmの展開オプション](../supported-deployment-options.md)の中で、Fastly経由でトラフィックを配信する場合にこのソリューションが推奨されます。

## 制限事項

* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません。

## 要件

デプロイを進めるためには、次の要件を満たしている必要があります:

* Fastlyの技術についての理解
* Fastlyを経由して稼働しているAPIまたはトラフィック
* [Fastly CLIがインストールされている](https://www.fastly.com/documentation/reference/tools/cli/#installing)

## デプロイ

### 1. Wallarm Nodeを展開する

Wallarm NodeはWallarmプラットフォームのコアコンポーネントであり、受信トラフィックを検査し、悪意のあるアクティビティを検出して脅威を緩和するように設定できます。

必要とする管理レベルに応じて、Wallarmがホストするノードまたは独自のインフラストラクチャ上に展開できます。

=== "Edge node"
    コネクタ用にWallarmがホストするノードを展開するには、[こちらの手順](../se-connector.md)に従ってください。
=== "Self-hosted node"
    セルフホストノードの展開に適したアーティファクトを選択し、添付の手順に従ってください:

    * ベアメタルまたは仮想マシン上のLinux環境向け[オールインワンインストーラー](../native-node/all-in-one.md)
    * コンテナ化された展開環境向け[Dockerイメージ](../native-node/docker-image.md)
    * Kubernetesを利用するインフラ向け[Helmチャート](../native-node/helm-chart.md)

### 2. FastlyにWallarmコードを展開する

FastlyからWallarm Nodeへトラフィックをルーティングするため、対応するWallarmロジックを実装したFastly Computeサービスを展開する必要があります:

1. Wallarm Consoleの**Security Edge** → **Connectors** → **Download code bundle**に進み、Wallarmパッケージをダウンロードしてください。

    セルフホストノードを使用している場合は、パッケージ入手のためにsales@wallarm.comにお問い合わせください。
1. Fastly UIの**Account** → **API tokens** → **Personal tokens** → **Create token**に移動してください:

    * タイプ：Automation token
    * スコープ：Global API access
    * 特別な変更が必要な場合を除き、他の設定はデフォルトのままにしてください

    ![](../../images/waf-installation/gateways/fastly/generate-token.png)
1. Fastly UIの**Compute** → **Compute services** → **Create service** → **Use a local project**に移動し、Wallarm用のインスタンスを作成してください。

    作成後、生成された`--service-id`をコピーしてください:

    ![](../../images/waf-installation/gateways/fastly/create-compute-service.png)
1. Wallarmパッケージが保存されているローカルディレクトリへ移動し、展開してください:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    成功メッセージ:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

    ??? warning "fastly.tomlの読み込みエラー"
        次のエラーが発生した場合:

        ```
        ✗ Verifying fastly.toml

        ERROR: error reading fastly.toml.
        ```

        `fastly compute publish`ではなく、提供された`fastly compute deploy`を使用していることを確認してください。

### 3. Wallarm Nodeおよびバックエンドのホストを指定する

解析および転送のために正しくトラフィックをルーティングするには、Fastlyサービス設定でWallarm Nodeとバックエンドのホストを定義する必要があります:

1. Fastly UIの**Compute** → **Compute services** → Wallarmサービス → **Edit configuration**に移動してください。
1. **Origins**に移動し、**Create hosts**を選択してください:

    * [Wallarm Nodeのアドレス](#1-deploy-a-wallarm-node)を`wallarm-node`ホストとして追加し、Wallarm Nodeへの解析用トラフィックをルーティングしてください。
    * Nodeから元のバックエンドへトラフィックを転送するため、バックエンドのアドレスを別のホスト(例：`backend`)として追加してください。

    ![](../../images/waf-installation/gateways/fastly/hosts.png)
1. 新しいサービスバージョンを**Activate**してください。

### 4. Wallarm config storeを作成する

Wallarm固有の設定を定義する`wallarm_config` configを作成してください:

1. Fastly UIの**Resources** → **Config stores** → **Create a config store**に移動し、以下のキーと値を持つ`wallarm_config` storeを作成してください:

    | Parameter                         | Description                                                                                                                                                                | Required? |
    | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
    | `WALLARM_BACKEND`                 | Computeサービスの設定で指定された[Wallarm Nodeインスタンス](#1-deploy-a-wallarm-node)のホスト名。                                                                          | Yes       |
    | `ORIGIN_BACKEND`                  | Computeサービスの設定で指定されたバックエンドのホスト名。                                                                                                                  | Yes       |
    | `WALLARM_MODE_ASYNC`              | 元のフローに影響を与えずにトラフィックの[コピー](../oob/overview.md)解析を有効にする(`true`)またはインライン解析を行う(`false`、デフォルト)。                           | No        |
    | `WALLARM_DEBUG`                   | デバッグ情報をテイリングログに書き出す(`true`)か無効にする(`false`、デフォルト)。                                                                                       | No        |
    | `WALLARM_RESPONSE_BODY_SIZE_LIMIT`| Nodeが解析可能なレスポンスボディのサイズ制限(バイト単位)。`none`(デフォルト)などの数値以外の値は制限なしを意味します。                                                   | No        |
    | `ORIGIN_PASS_CACHE`               | リクエストをバックエンドに送信する際にFastlyのキャッシングレイヤーをバイパスしてパススルー動作を強制する(`true`)。デフォルトではFastlyのキャッシングレイヤーが使用される(`false`)。 | No        |
    | `ORIGIN_PRESERVE_HOST`            | クライアントリクエストの元の`Host`ヘッダーを維持し、`X-Forwarded-Host`ヘッダーを介してオリジンバックエンドのホスト名に置き換えない。元の`Host`に依存するバックエンドに有用です。デフォルト：`false`。 | No        |
    | `LOGGING_ENDPOINT`                | コネクタ用の[logging endpoint](https://www.fastly.com/documentation/guides/integrations/logging/)を設定します。デフォルトではテイリングログ(stderr)が使用される。        | No        |

1. config storeをWallarm Computeサービスに**リンク**してください.

![](../../images/waf-installation/gateways/fastly/config-store.png)

!!! info "複数サービスでのconfig storeの共有"
    WallarmのComputeサービスを複数実行している場合、`wallarm_config` config storeはすべてのサービス間で共有されます。そのため、すべてのサービスで同じオリジンバックエンド名を使用する必要がありますが、実際のバックエンドの値は各サービスの設定でカスタマイズ可能です。

### 5.（オプション）カスタムブロッキングページを設定する

Wallarm Nodeがインラインモードで動作し、[ブロック](../../admin-en/configure-wallarm-mode.md)攻撃を実施する場合、悪意のあるリクエストに対してHTTP 403のステータスコードで応答します。応答をカスタマイズするため、FastlyのKV storeを使用してカスタムHTMLブロッキングページを設定できます:

1. Fastly UIの**Resources** → **KV stores** → **Create a KV store**に移動し、`wallarm`という名前のKV storeを作成してください.
1. `block_page.html`というキーを追加し、カスタムHTMLブロッキングページをアップロードしてください。このページはブロックされたリクエストに返されます.
1. KV storeをWallarm Computeサービスに**リンク**してください.

![](../../images/waf-installation/gateways/fastly/custom-block-page.png)

??? info "カスタムブロッキングページ用のWallarmテンプレートの表示"
    出発点として、以下のWallarm提供のテンプレートをカスタムブロッキングページとして使用できます。ユーザーに表示する情報やご希望のデザインに合わせて、必要に応じて調整してください:

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>ブロックされました</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins:700|Roboto|Roboto+Mono&display=swap" rel="stylesheet">
        <style>
            html {
                font-family: 'Roboto', sans-serif;
            }

            body {
                margin: 0;
                height: 100vh;
            }

            .content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                min-height: 100%;
            }

            .logo {
                margin-top: 32px;
            }

            .message {
                display: flex;
                margin-bottom: 100px;
            }

            .alert {
                padding-top: 20px;
                width: 246px;
                text-align: center;
            }

            .alert-title {
                font-family: 'Poppins', sans-serif;
                font-weight: bold;
                font-size: 24px;
                line-height: 32px;
            }

            .alert-desc {
                font-size: 14px;
                line-height: 20px;
            }

            .info {
                margin-left: 76px;
                border-left: 1px solid rgba(149, 157, 172, 0.24);
                padding: 20px 0 20px 80px;
                width: 340px;
            }

            .info-title {
                font-weight: bold;
                font-size: 20px;
                line-height: 28px;
            }

            .info-text {
                margin-top: 8px;
                font-size: 14px;
                line-height: 20px;
            }

            .info-divider {
                margin-top: 16px;
            }

            .info-data {
                margin-top: 12px;
                border: 1px solid rgba(149, 157, 172, 0.24);
                border-radius: 4px;
                padding: 9px 12px;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roboto Mono', monospace;
            }

            .info-copy {
                margin-top: 12px;

                padding: 6px 12px;
                border: none;
                outline: none;
                background: rgba(149, 157, 172, 0.08);
                cursor: pointer;
                transition: 0.24s cubic-bezier(0.24, 0.1, 0.24, 1);
                border-radius: 4px;

                font-size: 14px;
                line-height: 20px;
            }

            .info-copy:hover {
                background-color: rgba(149, 157, 172, 0.24);
            }

            .info-copy:active {
                background-color: rgba(149, 157, 172, 0.08);
            }

            .info-mailto,
            .info-mailto:visited {
                color: #fc7303;
            }
        </style>
        <script>
            // サポート用メールアドレスをここに記入してください
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    ここにロゴを配置してください。
                    外部画像を使用することもできます:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    もしくはロゴのソースコード(例：svg)をここに記述してください:
                    <svg width="160" height="80"> ... </svg>
                -->
            </div>

            <div class="message">
                <div class="alert">
                    <svg width="207" height="207" viewBox="0 0 207 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M88.7512 33.2924L15.6975 155.25C14.1913 157.858 13.3943 160.816 13.3859 163.828C13.3775 166.84 14.1579 169.801 15.6494 172.418C17.141 175.035 19.2918 177.216 21.8877 178.743C24.4837 180.271 27.4344 181.092 30.4462 181.125H176.554C179.566 181.092 182.516 180.271 185.112 178.743C187.708 177.216 189.859 175.035 191.351 172.418C192.842 169.801 193.623 166.84 193.614 163.828C193.606 160.816 192.809 157.858 191.303 155.25L118.249 33.2924C116.711 30.7576 114.546 28.6618 111.963 27.2074C109.379 25.7529 106.465 24.9888 103.5 24.9888C100.535 24.9888 97.6206 25.7529 95.0372 27.2074C92.4538 28.6618 90.2888 30.7576 88.7512 33.2924V33.2924Z"
                            stroke="#F24444" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M103.5 77.625V120.75" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M103.5 146.625V146.668" stroke="#F24444" stroke-width="16" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <div class="alert-title">悪意のあるアクティビティをブロックしました</div>
                    <div class="alert-desc">悪意のあるリクエストとして認識されたため、リクエストがブロックされました。</div>
                </div>
                <div class="info">
                    <div class="info-title">原因</div>
                    <div class="info-text">
                        悪意のあるコードシーケンスと類似する記号を使用したか、特定のファイルをアップロードした可能性があります。
                    </div>

                    <div class="info-divider"></div>

                    <div class="info-title">対処方法</div>
                    <div class="info-text">
                        リクエストが正当と判断された場合、<a id="mailto" href="" class="info-mailto">お問い合わせ</a>いただき、最後の操作内容と以下のデータを提供してください。
                    </div>

                    <div id="data" class="info-data">
                        IP ${remote_addr}<br />
                        Blocked on ${time_iso8601}<br />
                        UUID ${request_id}
                    </div>

                    <button id="copy-btn" class="info-copy">
                        詳細をコピー
                    </button>
                </div>
            </div>
            <div></div>
        </div>
        <script>
            // 警告：ES5コードのみ

            function writeText(str) {
                const range = document.createRange();

                function listener(e) {
                    e.clipboardData.setData('text/plain', str);
                    e.preventDefault();
                }

                range.selectNodeContents(document.body);
                document.getSelection().addRange(range);
                document.addEventListener('copy', listener);
                document.execCommand('copy');
                document.removeEventListener('copy', listener);
                document.getSelection().removeAllRanges();
            }

            function copy() {
                const text = document.querySelector('#data').innerText;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                }

                return writeText(text);
            }

            document.querySelector('#copy-btn').addEventListener('click', copy);

            const mailto = document.getElementById('mailto');
            if (SUPPORT_EMAIL) mailto.href = `mailto:${wallarm_dollar}{SUPPORT_EMAIL}`;
            else mailto.replaceWith(mailto.textContent);
        </script>
    </body>
    ```

## テスト

展開したソリューションの機能をテストするには、以下の手順に従ってください:

1. Wallarm Computeサービスのドメインに対して、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストを送信してください:

    ```
    curl http://<WALLARM_FASTLY_SERVICE>/etc/passwd
    ```
1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)内の**Attacks**セクションを開き、攻撃が一覧に表示されていることを確認してください.
    
    ![インターフェースに表示された攻撃][attacks-in-ui-image]

    Wallarm Nodeモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れる場合、リクエストはブロックされます。

## Fastly上のWallarm Computeサービスのアップグレード

展開したFastly Computeサービスを[新しいバージョン](code-bundle-inventory.md#fastly)にアップグレードするには、以下の手順に従ってください:

1. Wallarm Consoleの**Security Edge** → **Connectors** → **Download code bundle**に進み、更新されたコードバンドルをダウンロードしてください.

    セルフホストノードを使用している場合、更新されたコードバンドルを入手するためにsales@wallarm.comにお問い合わせください.
1. 更新された`wallarm-api-security.tar.gz` Wallarmパッケージアーカイブがあるディレクトリに移動し、以下を実行してください:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    * `<SERVICE_ID>`は展開したWallarmサービスのIDに置き換えてください.
    * `<FASTLY_TOKEN>`はデプロイメントに使用したFastly APIトークンに置き換えてください.
1. Fastly UIで新しいサービスバージョンを**Activate**してください.

Computeサービスのアップグレードには、特にメジャーバージョンアップの場合、Wallarm Nodeのアップグレードが必要になる場合があります。リリースの更新およびアップグレード手順については、[Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。将来のアップグレードの簡易化および非推奨を回避するために、定期的なノードの更新を推奨します.
```