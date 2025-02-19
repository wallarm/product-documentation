# NGINXにおけるブロッキングページとエラーコードの設定

これらの手順は、ブロッキングリクエストに対するレスポンスで返されるブロッキングページおよびエラーコードをカスタマイズする方法について説明します。この設定は、セルフホスト型NGINXノードにのみ該当します。

カスタムブロッキングページは、以下の理由によりブロックされたリクエストに対して返されます:

* リクエストが、[input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch attacks](../../user-guides/rules/vpatch-rule.md)または[正規表現に基づいて検出された攻撃](../../user-guides/rules/regex-rule.md)のいずれかに該当する悪意のあるペイロードを含む場合。
* 上記リストの悪意のあるペイロードを含むリクエストが[graylisted IP address](../../user-guides/ip-lists/overview.md)から発信され、ノードがSafe modeでリクエストをフィルタリングしている場合。
* リクエストが[denylisted IP address](../../user-guides/ip-lists/overview.md)から発信された場合。

## 設定の制限

ブロッキングページとエラーコードの設定は、NGINXベースのWallarmノード展開でサポートされていますが、Native Node、EnvoyベースおよびCDNベースのWallarmノード展開ではサポートされません。EnvoyベースおよびCDNベースのWallarmノードは、ブロックされたリクエストに対して常にコード`403`を返します。

## 設定方法

デフォルトでは、レスポンスコード403とNGINXのデフォルトブロッキングページがクライアントに返されます。以下のNGINXディレクティブを使用してデフォルト設定を変更できます:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINXディレクティブ `wallarm_block_page`

`wallarm_block_page` NGINXディレクティブに以下のパラメータを指定することで、ブロッキングページおよびエラーコードを設定できます:

* ブロッキングページのHTMまたはHTMLファイルへのパス。カスタムブロッキングページまたはWallarmが提供する[サンプルブロッキングページ](#customizing-sample-blocking-page)へのパスのいずれかを指定できます。
* ブロックされたリクエストに対して返されるメッセージのテキスト。
* クライアントリダイレクトのためのURL。
* `response_code`: レスポンスコード。
* `type`: 指定した設定が返されるブロックされたリクエストの種別。このパラメータは、以下のリストから1つまたは複数の値（カンマで区切る）を受け付けます:

    * `attack` (デフォルト): ブロッキングまたはSafe modeでリクエストをフィルタリングするノードによりブロックされたリクエストの場合。
    * `acl_ip`: 単一オブジェクトまたはサブネットとして[denylist](../../user-guides/ip-lists/overview.md)に追加されたIPアドレスから発信されたリクエストの場合。
    * `acl_source`: 国、地域またはデータセンターごとに[denylisted](../../user-guides/ip-lists/overview.md)として登録されているIPアドレスから発信されたリクエストの場合。

`wallarm_block_page`ディレクティブは、以下の形式でパラメータを受け付けます:

* ブロッキングページのHTMまたはHTMLファイルへのパス、エラーコード（オプション）、およびブロックされたリクエストの種別（オプション）

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarmは、[customizing-sample-blocking-page](#customizing-sample-blocking-page)としてカスタマイズの出発点として使用できるサンプルブロッキングページを提供します。ページは以下のパスにあります:
    
    === "All-in-one installer, AMI or GCP image, NGINX-based Docker image"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "Other deployment options"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    ブロッキングページ上で[NGINX variables](https://nginx.org/en/docs/varindex.html)を使用できます。このため、ブロッキングページのコードに`${variable_name}`形式で変数名を追加します。例として、ブロックされたリクエストの発信元IPアドレスを表示する`${remote_addr}`があります。

    !!! warning "DebianおよびCentOSユーザー向けの重要な情報"
        CentOS/DebianのリポジトリからインストールされたNGINXバージョンが1.11未満の場合、動的ブロッキングページを正しく表示するために、ページコードから`request_id`変数を削除する必要があります:
        ```
        UUID ${request_id}
        ```

        これは`wallarm_blocked.html`およびカスタムブロックページの両方に該当します。

    [設定例 →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* クライアントリダイレクトのURLおよびブロックされたリクエストの種別（オプション）

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [設定例 →](#url-for-the-client-redirection)
* NGINXの名前付き`location`とブロックされたリクエストの種別（オプション）

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [設定例 →](#named-nginx-location)
* HTMまたはHTMLファイルへのパス、エラーコード（オプション）、およびブロックされたリクエストの種別（オプション）を設定する変数名

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "NGINX変数を使用してブロッキングページをコード内で初期化する場合"
        この方法を使用して[NGINX variables](https://nginx.org/en/docs/varindex.html)がコード内で使用されるブロッキングページを設定する場合は、ディレクティブ[`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path)を使用してこのページを初期化してください。

    [設定例 →](#variable-and-error-code)

`wallarm_block_page`ディレクティブは、NGINX設定ファイルの`http`、`server`、`location`ブロック内に設定できます。

### NGINXディレクティブ `wallarm_block_page_add_dynamic_path`

`wallarm_block_page_add_dynamic_path`ディレクティブは、コード内にNGINX変数が使用されているブロッキングページの初期化に使用します。また、このブロッキングページへのパスは変数を使用して設定されます。そうでない場合、このディレクティブは使用しません。

このディレクティブは、NGINX設定ファイルの`http`ブロック内に設定できます。

## カスタマイズサンプルブロッキングページ

Wallarmが提供するサンプルブロッキングページは、以下のようになっています:

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

このサンプルページをカスタマイズの出発点として使用し、以下の点を強化できます:

* 自社のロゴの追加 – デフォルトではページにロゴは表示されません。
* 自社のサポートメールの追加 – デフォルトではメールリンクは使用されず、`contact us`フレーズはリンクなしのシンプルなテキストです。
* その他のHTML要素の変更や独自要素の追加。

!!! info "カスタムブロッキングページのバリエーション"
    Wallarmが提供するサンプルページを変更するのではなく、最初からカスタムページを作成することもできます。

### 一般的な手順

サンプルページ自体を変更すると、Wallarmコンポーネントのアップデート時に変更が失われる可能性があります。そのため、サンプルページをコピーし、新しい名前を付けてから変更することを推奨します。以下の各インストールタイプに応じた手順に従ってください。

**<a name="copy"></a>コピー用のサンプルページ**

フィルタリングノードがインストールされている環境にある`/usr/share/nginx/html/wallarm_blocked.html`（または`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`）のコピーを作成できます。あるいは、以下のコードをコピーして新しいファイルとして保存してください:

??? info "サンプルページコードの表示"

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>You are blocked</title>
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
            // Place your support email here
            const SUPPORT_EMAIL = "";
        </script>
    </head>

    <body>
        <div class="content">
            <div id="logo" class="logo">
                <!--
                    Place you logo here.
                    You can use an external image:
                    <img src="https://example.com/logo.png" width="160" alt="Company Name" />
                    Or put your logo source code (like svg) right here:
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
                    <div class="alert-title">Malicious activity blocked</div>
                    <div class="alert-desc">Your request is blocked since it was identified as a malicious one.</div>
                </div>
                <div class="info">
                    <div class="info-title">Why it happened</div>
                    <div class="info-text">
                        You might have used symbols similar to a malicious code sequence, or uploaded a specific file.
                    </div>

                    <div class="info-divider"></div>

                    <div class="info-title">What to do</div>
                    <div class="info-text">
                        If your request is considered to be legitimate, please <a id="mailto" href="" class="info-mailto">contact us</a> and provide your last action description and the following data:
                    </div>

                    <div id="data" class="info-data">
                        IP ${remote_addr}<br />
                        Blocked on ${time_iso8601}<br />
                        UUID ${request_id}
                    </div>

                    <button id="copy-btn" class="info-copy">
                        Copy details
                    </button>
                </div>
            </div>
            <div></div>
        </div>
        <script>
            // Warning: ES5 code only

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

**共通ファイルシステム**

NGINXが読み取り権限を持つ任意の場所に、`/usr/share/nginx/html/wallarm_blocked.html`（または`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`）を新しい名前でコピーできます。同一フォルダー内に配置しても構いません。

**Dockerコンテナ**

サンプルブロッキングページを変更する場合、または最初からカスタムページを提供する場合、Dockerの[bind mount](https://docs.docker.com/storage/bind-mounts/)機能を使用できます。これを使用すると、ホストマシン上のページおよびNGINX設定ファイルがコンテナへコピーされ、元のファイルと参照されるため、ホストマシン上のファイルが変更されると、そのコピーも同期されます。

したがって、サンプルブロッキングページを変更する、またはカスタムページを提供するには、以下を実施します:

1. 初回実行前に、[copy](#copy)によって変更済みの`wallarm_blocked_renamed.html`を準備します。
1. ブロッキングページへのパスを含むNGINX設定ファイルを準備します。設定例は[こちら](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)を参照してください。
1. 準備済みのブロッキングページおよび設定ファイルを[mounting](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)してコンテナを実行します。
1. 後に実行中のコンテナでブロッキングページを更新する必要がある場合、ホストマシン上で参照される`wallarm_blocked_renamed.html`を変更し、コンテナ内でNGINXを再起動します。

**Ingressコントローラー**

サンプルブロッキングページを変更する、またはカスタムページを提供するには、以下を実施します:

1. [copy](#copy)によって変更済みの`wallarm_blocked_renamed.html`を準備します。
1. ファイル[ConfigMapの作成](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)を実施して`wallarm_blocked_renamed.html`を作成します。
1. 作成済みのConfigMapをWallarm IngressコントローラーのPodにマウントします。このため、[instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)に従い、Deploymentオブジェクトを更新します。

    !!! info "ConfigMapマウントディレクトリ"
        ConfigMapをマウントするディレクトリ内の既存ファイルは削除される可能性があるため、ConfigMapでマウントされるファイル用に新しいディレクトリを作成することを推奨します。
1. Ingressアノテーションにより、Podにカスタムページの使用を指示します:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/blockpages/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/blockpages/wallarm_blocked_renamed-2.html response_code=445 type=acl_ip,acl_source"
    ```

### 頻繁に行う変更

自社のロゴを追加する場合は、`wallarm_blocked_renamed.html`ファイル内で以下の部分を変更し、コメントアウトを解除してください:

```html
<div class="content">
    <div id="logo" class="logo">
        <!--
            Place you logo here.
            You can use an external image:
            <img src="https://example.com/logo.png" width="160" alt="Company Name" />
            Or put your logo source code (like svg) right here:
            <svg width="160" height="80"> ... </svg>
        -->
    </div>
```

自社のサポートメールを追加する場合は、`wallarm_blocked_renamed.html`ファイル内で`SUPPORT_EMAIL`変数を以下のように変更してください:

```html
<script>
    // Place your support email here
    const SUPPORT_EMAIL = "support@company.com";
</script>
```

値内で`$`を含むカスタム変数を初期化する場合、変数名の前に`{wallarm_dollar}`を追加してこのシンボルをエスケープします。例: `${wallarm_dollar}{variable_name}`。`wallarm_dollar`変数は`&`を返します。

## 設定例

以下は、`wallarm_block_page`および`wallarm_block_page_add_dynamic_path`ディレクティブを使用して、ブロッキングページとエラーコードを設定する例です。

`wallarm_block_page`ディレクティブの`type`パラメータは、各例で明示的に指定されています。`type`パラメータを削除した場合、設定されたブロックページ、メッセージ等は、フィルタリングノードがブロッキングまたはSafe modeでリクエストをブロックした場合にのみ返されます。

### ブロッキングページおよびエラーコード付きHTMまたはHTMLファイルへのパス

この例では、以下のレスポンス設定を示します:

* フィルタリングノードがブロッキングまたはSafe modeでリクエストをブロックした際に、[customizing-sample-blocking-page](#customizing-sample-blocking-page)で変更されたサンプルWallarmブロッキングページ`/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html`とエラーコード445を返す場合。
* 任意のdenylisted IPアドレスから発信されたリクエストの場合、カスタムブロッキングページ`/usr/share/nginx/html/block.html`とエラーコード445を返す場合。

#### NGINX設定ファイル

```bash
wallarm_block_page &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

設定をDockerコンテナに適用するには、該当する設定が記述されたNGINX設定ファイルを`wallarm_blocked_renamed.html`および`block.html`ファイルと共にコンテナにマウントしてください。[Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressアノテーション

Ingressアノテーションを追加する前に:

1. ブロックされた攻撃用の変更済み`wallarm_blocked_renamed.html`と、denylisted IPからのリクエスト用の`wallarm_blocked_renamed-2.html`を[copy](#copy)してください。
1. 以下を実行してファイルからConfigMapを作成します:
    
    ```
    kubectl -n <CONTROLLER_NAMESPACE> create configmap customized-pages --from-file=wallarm_blocked_renamed.html --from-file=wallarm_blocked_renamed-2.html
    ```
    
1. 作成済みのConfigMapをWallarm IngressコントローラーのPodに[mount]((https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap))します:

    * 使用するvalues.yamlを以下のように更新します:

        ```
        controller:
            wallarm:
            <...>
            # -- コントローラのメインコンテナに追加するvolumeMounts.
            extraVolumeMounts:
            - name: custom-block-pages
              mountPath: /usr/share/nginx/blockpages
            # -- コントローラPodに追加するvolumes.
            extraVolumes:
            - name: custom-block-pages
              configMap:
              name: customized-pages
            <...>
        ```

    * 以下を実行してリリースに変更を適用します:

        ```
        helm -n <CONTROLLER_NAMESPACE> upgrade <CHART-RELEASE-NAME> wallarm/wallarm-ingress --reuse-values -f values.yaml
        ```
        
        !!! info "ConfigMapマウントディレクトリ"
            ConfigMapでマウントされるディレクトリ内の既存ファイルは削除される可能性があるため、ConfigMapでマウントされるファイル用に新しいディレクトリを作成することを推奨します。

Ingressアノテーション:

```bash
kubectl -n <INGRESS_NAMESPACE> annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/blockpages/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/blockpages/wallarm_blocked_renamed-2.html response_code=445 type=acl_ip,acl_source"
```

#### Podアノテーション (Sidecar controller使用時)

ブロックページは、`sidecar.wallarm.io/wallarm-block-page`アノテーションを用いてPod単位で設定できます。例:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/wallarm-block-page: "&/path/to/block/page1.html response_code=403 type=attack;&/path/to/block/page2.html response_code=403 type=acl_ip,acl_source"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### クライアントリダイレクト用URL

この例では、denylistedな国、地域またはデータセンターから発信されたリクエストがブロックされた場合、クライアントを`host/err445`にリダイレクトする設定を示します。

#### NGINX設定ファイル

```bash
wallarm_block_page /err445 type=acl_source;
```

設定をDockerコンテナに適用するには、該当する設定が記述されたNGINX設定ファイルをコンテナにマウントしてください。[Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressアノテーション

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### 名前付きNGINX `location`

この例では、ブロック理由（ブロッキングまたはSafe mode、単一IP/サブネット、国や地域、データセンター）に関係なく、クライアントに対して`The page is blocked`というメッセージとエラーコード445を返す設定を示します。

#### NGINX設定ファイル

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

設定をDockerコンテナに適用するには、該当する設定が記述されたNGINX設定ファイルをコンテナにマウントしてください。[Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressアノテーション

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### 変数とエラーコード

この設定は、denylistedなソース（単一IPまたはサブネット）から発信されたリクエストに対して返されます。Wallarmノードは、コード445と、`User-Agent`ヘッダーの値に依存するコンテンツのブロッキングページを返します:

* デフォルトでは、[customizing-sample-blocking-page](#customizing-sample-blocking-page)で変更されたサンプルWallarmブロッキングページ`/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html`が返されます。NGINX変数がブロッキングページのコード内で使用されているため、このページはディレクティブ`wallarm_block_page_add_dynamic_path`で初期化する必要があります。
* Firefoxユーザー向け — `/usr/share/nginx/html/block_page_firefox.html`（Wallarm Ingressコントローラーを展開している場合、カスタムブロックページファイル用に別のディレクトリ、例：`/usr/custom-block-pages/block_page_firefox.html`を作成することを推奨します）:

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    NGINX変数がブロッキングページのコード内で使用されているため、このページはディレクティブ`wallarm_block_page_add_dynamic_path`で初期化する必要があります。
* Chromeユーザー向け — `/usr/share/nginx/html/block_page_chrome.html`（Wallarm Ingressコントローラーを展開している場合、カスタムブロックページファイル用に別のディレクトリ、例：`/usr/custom-block-pages/block_page_chrome.html`を作成することを推奨します）:

    ```bash
    You are blocked!
    ```

    NGINX変数がブロッキングページのコード内で使用されていないため、このページは初期化する必要はありません。

#### NGINX設定ファイル

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

設定をDockerコンテナに適用するには、該当する設定が記述されたNGINX設定ファイルを、`wallarm_blocked_renamed.html`、`block_page_firefox.html`および`block_page_chrome.html`ファイルと共にコンテナにマウントしてください。[Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressコントローラー

1. [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/)コマンドを使用して、デプロイ済みHelmチャートに`controller.config.http-snippet`パラメータを渡してください:

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. `wallarm_blocked_renamed.html`、`block_page_firefox.html`、および`block_page_chrome.html`ファイルからConfigMapを[作成](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)します。
3. 作成済みのConfigMapをWallarm IngressコントローラーのPodにマウントします。このため、[instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)に従い、該当するDeploymentオブジェクトを更新してください。

    !!! info "ConfigMapマウントディレクトリ"
        ConfigMapでマウントされるディレクトリ内の既存ファイルは削除される可能性があるため、ConfigMapでマウントされるファイル用に新しいディレクトリを作成することを推奨します。
4. 以下のアノテーションをIngressに追加します:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```