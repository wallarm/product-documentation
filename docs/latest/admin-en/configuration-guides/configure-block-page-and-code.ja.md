					# ブロッキングページとエラーコードの設定（NGINX）

これらの手順は、以下の理由でブロックされたリクエストに返されるブロックページとエラーコードをカスタマイズする方法を説明しています。

* 次のタイプの悪意のあるペイロードが含まれたリクエスト：[入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../../user-guides/rules/vpatch-rule.md)、または [正規表現に基づいて検出された攻撃](../../user-guides/rules/regex-rule.md)。
* 上記の悪意のあるペイロードを含むリクエストが [グレーリスト化されたIPアドレス](../../user-guides/ip-lists/graylist.md) から送信され、ノードは安全なブロッキング[モード](../configure-wallarm-mode.md)でリクエストをフィルタリングします。
* リクエストが [ブラックリスト化されたIPアドレス](../../user-guides/ip-lists/denylist.md) から送信された場合。

## 設定の制限事項

ブロッキングページとエラーコードの設定は、NGINXベースのWallarmノード展開でサポートされていますが、Envoy-およびCDNベースのWallarmノード展開ではサポートされていません。Envoy-およびCDN-ベースのWallarmノードは、ブロックされたリクエストに対するレスポンスで常にコード `403` を返します。

## 設定方法

デフォルトでは、レスポンスコード403とデフォルトのNGINXブロッキングページがクライアントに返されます。以下のNGINXディレクティブを使用してデフォルトの設定を変更できます。

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINXディレクティブ `wallarm_block_page`

`wallarm_block_page` NGINXディレクティブに以下のパラメータを渡して、ブロッキングページとエラーコードを設定できます。

* ブロッキングページのHTMLまたはHTMファイルへのパス。カスタムブロックページまたはWallarmが提供する[サンプルブロックページ](#customizing-sample-blocking-page)のパスを指定できます。
* ブロックされたリクエストに対するレスポンスで返されるメッセージのテキスト。
* クライアントのリダイレクト用のURL。
* `response_code`：レスポンスコード。
* `type`：指定された設定が返されるべきブロックされたリクエストのタイプ。パラメータは、リストから1つまたは複数の値（カンマで区切る）を受け入れます。

    * `attack`(デフォルト)：ブロッキングまたはセーフブロッキング[モード](../configure-wallarm-mode.md)でリクエストをフィルタリングする際にフィルタリングノードによってブロックされたリクエスト。
    * `acl_ip`：[ブラックリスト](../../user-guides/ip-lists/denylist.md)に単一のオブジェクトまたはサブネットとして追加されたIPアドレスから発信されたリクエスト。
    * `acl_source`：[ブラックリスト化された](../../user-guides/ip-lists/denylist.md)国、地域、またはデータセンターに登録されたIPアドレスから発信されたリクエスト。

`wallarm_block_page`ディレクティブは、以下の形式でリストされたパラメータを受け入れます。

* HTMLまたはHTMファイルへのパス、エラーコード（オプション）、およびブロックされたリクエストタイプ（オプション）

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    Wallarmは、サンプルブロッキングページ `&/usr/share/nginx/html/wallarm_blocked.html` を提供しています。このページを[カスタマイズ](#customizing-sample-blocking-page)の出発点として使用できます。

    ブロッキングページで [NGINX変数](https://nginx.org/en/docs/varindex.html) を使用できます。これには、ブロックページコードに形式 `${variable_name}` の変数名を追加します。たとえば、 `${remote_addr}` を使ってブロックされたリクエストが送信されたIPアドレスを表示します。

    !!! warning "DebianおよびCentOSユーザーへの重要な情報"
        [CentOS/Debian](../../installation/nginx/dynamic-module-from-distr.md) リポジトリからインストールされた1.11よりも低いバージョンのNGINXを使用する場合は、動的ブロッキングページを正しく表示するために、ページコードから `request_id` 変数を削除する必要があります。
        ```
        UUID ${request_id}
        ```

        これは、 `wallarm_blocked.html` およびカスタムブロックページの両方に適用されます。

    [設定の例 →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* クライアントリダイレクト用のURLとブロックされたリクエストタイプ（オプション）

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [設定の例 →](#url-for-the-client-redirection)
* 名前付きNGINX `location` およびブロックされたリクエストタイプ（オプション）

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [設定の例 →](#named-nginx-location)
* HTMLまたはHTMファイルへのパスを設定する変数の名前、エラーコード（オプション）、およびブロックされたリクエストタイプ（オプション）

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "コード内のNGINX変数でブロッキングページを初期化する"
        [NGINX変数](https://nginx.org/en/docs/varindex.html)がコードに含まれるブロッキングページを、この方法を使って設定する場合は、ディレクティブ [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path) を使ってこのページを初期化してください。

    [設定の例 →](#variable-and-error-code)

ディレクティブ `wallarm_block_page` は、NGINX設定ファイルの `http`、`server`、`location` ブロック内に設定できます。

### NGINXディレクティブ `wallarm_block_page_add_dynamic_path`

ディレクティブ `wallarm_block_page_add_dynamic_path` は、NGINX変数をコードに持つブロッキングページを初期化し、このブロッキングページへのパスも変数を使用して設定されている場合に使用されます。それ以外の場合、ディレクティブは使用されません。

ディレクティブは、NGINX設定ファイルの `http` ブロック内に設定できます。## サンプルブロックページのカスタマイズ

Wallarm によって提供されるサンプルブロックページ `/usr/share/nginx/html/wallarm_blocked.html` は以下のようになっています。

![!Wallarmのブロックページ](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

このサンプルページを使って、以下のようなカスタマイズを行うことができます。

* 会社のロゴを追加する - デフォルトでは、ページにロゴは表示されません。
* 会社のサポートメールを追加する - デフォルトでは、メールリンクが使用されず、`contact us` のフレーズはリンクがない単純なテキストです。
* 他の HTML 要素を変更するか、独自の要素を追加する。

!!! info "カスタムブロックページのバリエーション"
    Wallarmによって提供されるサンプルページを変更する代わりに、独自のページをゼロから作成することができます。
### General procedure

If you modify the sample page itself, your modifications may be lost on Wallarm components update. Therefore, it is recommended to copy the sample page, give it a new name, and only then modify it. Act depending on your installation type as described in the sections below.

**<a name="copy"></a>Sample page for copying**

You can make a copy of the `/usr/share/nginx/html/wallarm_blocked.html` located in the environment where your filtering node is installed. Alternatively, copy the code below and save it as your new file:

??? info "Show sample page code"

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

**Common file system**

You can make a copy of the `/usr/share/nginx/html/wallarm_blocked.html` under a new name wherever you want (NGINX should have read permission there) including the same folder.

**Docker container**

To modify the sample blocking page or provide your own custom from scratch, you can use Docker's [bind mount](https://docs.docker.com/storage/bind-mounts/) functionality. When using it, your page and NGINX configuration file from your host machine are copied to the container and then referenced with the originals, so that if you change files on the host machine, their copies will be synchronized and vice versa.

Therefore, to modify the sample blocking page or provide your own, do the following:

1. Before the first run, [prepare](#copy) your modified `wallarm_blocked_renamed.html`.
1. Prepare NGINX configuration file with the path to your blocking page. See [configuration example](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).
1. Run the container [mounting](../installation-docker-en.md#run-the-container-mounting-the-configuration-file) the prepared blocking page and configuration file.
1. If you need later to update your blocking page in a running container, on the host machine, change the referenced `wallarm_blocked_renamed.html` then restart NGINX in the container.

**Ingress controller**

To modify the sample blocking page or provide your own, do the following:

1. [Prepare](#copy) your modified `wallarm_blocked_renamed.html`.
1. [Create ConfigMap from the file](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`.
1. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Directory for mounted ConfigMap"
        Existing files in the directory used to mount ConfigMap will be deleted.
1. Instruct pod to use your custom page by providing Ingress annotation:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="<PAGE_ADDRESS>"
    ```
### 頻繁な変更

会社のロゴを追加するには、`wallarm_blocked_renamed.html`ファイルで、以下の部分を変更し、コメントを解除してください。

```html
<div class="content">
    <div id="logo" class="logo">
        <!--
            ここにロゴを配置してください。
            外部画像を使用することもできます：
            <img src="https://example.com/logo.png" width="160" alt="Company Name" />
            または、ロゴのソースコード（SVGなど）をここに入れてください：
            <svg width="160" height="80"> ... </svg>
        -->
    </div>
```

会社のサポートメールを追加するには、`wallarm_blocked_renamed.html`ファイルで、`SUPPORT_EMAIL`変数を変更してください。

```html
<script>
    // ここにサポートメールを入力してください
    const SUPPORT_EMAIL = "support@company.com";
</script>
```

`$`を含む値を持つカスタム変数を初期化する場合は、変数名の前に`{wallarm_dollar}`を追加して、この記号をエスケープしてください。例：`${wallarm_dollar}{variable_name}`。`wallarm_dollar`変数は`&`を返します。

## 設定例

以下は、ディレクティブ`wallarm_block_page`および`wallarm_block_page_add_dynamic_path`を使用して、ブロックページとエラーコードを構成する例です。

各例で`wallarm_block_page`ディレクティブの`type`パラメータが明示的に指定されています。`type`パラメータを削除すると、構成済みのブロックページ、メッセージなどは、ブロッキングまたはセーフブロッキング[モード](../configure-wallarm-mode.md)でリクエストがフィルタリングノードによってブロックされた場合にのみレスポンスで返されます。

### ブロックページとエラーコードのHTMまたはHTMLファイルへのパス

この例では、以下のレスポンス設定が示されています。

* ブロッキングまたはセーフブロッキングモードでのフィルタリングノードによるリクエストブロック時に、[変更済み](#customizing-sample-blocking-page)のサンプルWallarmブロックページ`/usr/share/nginx/html/wallarm_blocked_renamed.html`とエラーコード445が返されます。
* 任意のブラックリストIPアドレスからのリクエストが発生した場合、カスタムブロックページ`/usr/share/nginx/html/block.html`とエラーコード445が返されます。#### NGINX設定ファイル

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

Dockerコンテナに設定を適用するには、適切な設定が記載されたNGINX設定ファイルをコンテナにマウントする必要があります。[設定ファイルをマウントしてコンテナを実行する →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressアノテーション

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### 変数とエラーコード

この設定は、単一のIPまたはサブネットとしてdenylistに登録されたソースからのリクエストがクライアントに返されます。Wallarmノードは、コード445と、`User-Agent`ヘッダー値に依存するコンテンツを持つブロックページを返します。

* デフォルトでは、[変更済み](#customizing-sample-blocking-page)のサンプルWallarmブロックページ`/usr/share/nginx/html/wallarm_blocked_renamed.html`が返されます。ブロックページコードでNGINX変数が使用されているため、このページはディレクティブ`wallarm_block_page_add_dynamic_path`を介して初期化する必要があります。
* Firefoxのユーザー向け - `/usr/share/nginx/html/block_page_firefox.html` (Wallarm Ingressコントローラをデプロイする場合、カスタムブロックページファイル用に別のディレクトリを作成することが推奨されます。例：`/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    ブロックページコードでNGINX変数が使用されているため、このページはディレクティブ`wallarm_block_page_add_dynamic_path`を介して初期化する必要があります。
* Chromeのユーザー向け - `/usr/share/nginx/html/block_page_chrome.html` (Wallarm Ingressコントローラをデプロイする場合、カスタムブロックページファイル用に別のディレクトリを作成することが推奨されます。例：`/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    ブロックページコードでNGINX変数が使用されていないため、このページは初期化する必要はありません。

#### NGINX設定ファイル

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

Dockerコンテナに設定を適用するには、適切な設定が記載されたNGINX設定ファイルを、`wallarm_blocked_renamed.html`、`block_page_firefox.html`、および`block_page_chrome.html`ファイルとともにコンテナにマウントする必要があります。[設定ファイルをマウントしてコンテナを実行する →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingressコントローラ

1. [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/)コマンドを使用して、デプロイされたHelmチャートに`controller.config.http-snippet`パラメータを渡します：

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. ファイル`wallarm_blocked_renamed.html`、`block_page_firefox.html`、および`block_page_chrome.html`から[ConfigMapを作成します](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)。
3. 作成されたConfigMapをWallarm Ingressコントローラを持つPodにマウントします。これを行うには、Wallarm Ingressコントローラに関連するDeploymentオブジェクトを更新して、[手順](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)に従ってください。

    !!! info "ConfigMapがマウントされたディレクトリ"
        ConfigMapをマウントするために使用されるディレクトリに既存のファイルが削除される可能性があるため、ConfigMap経由でファイルをマウントする新しいディレクトリを作成することが推奨されます。
4. Ingressに次のアノテーションを追加します：

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```