# Configuration of the blocking page and error code (NGINX)

These instructions describe the method to customize the blocking page and error code returned in the response to blocked requests. The configuration is only relevant for the self-hosted NGINX Nodes.

The custom blocking page is returned in response to the requests blocked due to the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../../attacks-vulns-list.md#attack-types), [vpatch attacks](../../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above originated from [graylisted IP address](../../user-guides/ip-lists/overview.md) and the node filters requests in the safe blocking [mode](../configure-wallarm-mode.md).
* Request originated from the [denylisted IP address](../../user-guides/ip-lists/overview.md).

## Configuration limitations

Configuration of the blocking page and error code is supported in self-hosted NGINX-based Wallarm node deployments but is not supported in Native Node.

## Configuration methods

By default, the response code 403 and default NGINX blocking page are returned to the client. You can change default settings by using the following NGINX directives:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINX directive `wallarm_block_page`

You can configure the blocking page and error code passing the following parameters in the `wallarm_block_page` NGINX directive:

* Path to the HTM or HTML file of the blocking page. You can specify the path either to a custom blocking page or the [sample blocking page](#customizing-sample-blocking-page) provided by Wallarm.
* The text of the message to be returned in response to a blocked request.
* URL for the client redirection.
* `response_code`: response code.
* `type`: the type of the blocked request in response to which the specified configuration must be returned. The parameter accepts one or several values (separated by commas) from the list:

    * `attack` (by default): for requests blocked by the filtering node when filtering requests in the blocking or safe blocking [mode](../configure-wallarm-mode.md).
    * `acl_ip`: for requests originated from IP addresses that are added to the [denylist](../../user-guides/ip-lists/overview.md) as a single object or a subnet.
    * `acl_source`: for requests originated from IP addresses that are registered in [denylisted](../../user-guides/ip-lists/overview.md) countries, regions or data centers.

The `wallarm_block_page` directive accepts the listed parameters in the following formats:

* Path to the HTM or HTML file, error code (optional), and blocked request type (optional)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    Wallarm provides the sample blocking page which you can use this page as a start point for your [customization](#customizing-sample-blocking-page). The page is located under the following path:
    
    === "All-in-one installer, AMI or GCP image, NGINX-based Docker image"
        ```
        &/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html
        ```
    === "Other deployment options"
        ```
        &/usr/share/nginx/html/wallarm_blocked.html
        ```

    You can use [NGINX variables](https://nginx.org/en/docs/varindex.html) on the blocking page. For this, add the variable name in the format `${variable_name}` to the blocking page code, e.g. `${remote_addr}` to display the IP address from which the blocked request originated.

    !!! warning "Important information for Debian and CentOS users"
        If you use an NGINX version lower than 1.11 installed from CentOS/Debian repositories, you should remove the `request_id` variable from the page code to display the dynamic blocking page correctly:
        ```
        UUID ${request_id}
        ```

        This applies to both `wallarm_blocked.html` and to the custom block page.

    [Example of configuration →](#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)
* URL for the client redirection and blocked request type (optional)

    ``` bash
    wallarm_block_page /<REDIRECT_URL> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Example of configuration →](#url-for-the-client-redirection)
* Named NGINX `location` and blocked request type (optional)

    ``` bash
    wallarm_block_page @<NAMED_LOCATION> type=<BLOCKED_REQUEST_TYPE>;
    ```

    [Example of configuration →](#named-nginx-location)
* Name of the variable setting the path to the HTM or HTML file, error code (optional), and blocked request type (optional)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```

    !!! warning "Initializing the blocking page with NGINX variables in the code"
        If using this method to set the blocking page with [NGINX variables](https://nginx.org/en/docs/varindex.html) in its code, please initialize this page via the directive [`wallarm_block_page_add_dynamic_path`](#nginx-directive-wallarm_block_page_add_dynamic_path).

    [Example of configuration →](#variable-and-error-code)

The directive `wallarm_block_page` can be set inside the `http`, `server`, `location` blocks of the NGINX configuration file.

### NGINX directive `wallarm_block_page_add_dynamic_path`

The directive `wallarm_block_page_add_dynamic_path` is used to initialize the blocking page that has NGINX variables in its code and the path to this blocking page is also set using a variable. Otherwise, the directive is not used.

The directive  can be set inside the `http` block of the NGINX configuration file.

## Customizing sample blocking page

The sample blocking page provided by Wallarm looks as follows:

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

You can use the sample page as a start point for your customization enhancing it by:

* Adding your company logo – by default, no logo is presented on the page.
* Adding your company support email – by default, no email links are used and the `contact us` phrase is the simple text without any link.
* Changing any other HTML elements or adding your own.

!!! info "Custom blocking page variants"
    Instead of modifying the sample page provided by Wallarm, you can create a custom page from scratch.

### General procedure

If you modify the sample page itself, your modifications may be lost on Wallarm components update. Therefore, it is recommended to copy the sample page, give it a new name, and only then modify it. Act depending on your installation type as described in the sections below.

**<a name="copy"></a>Sample page for copying**

You can make a copy of the `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) located in the environment where your filtering node is installed. Alternatively, copy the code below and save it as your new file:

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
            // Optional: provide a support email address for the "Contact us" link.
            // You can also define the email subject and body text.
            const SUPPORT_EMAIL = "";
            var subject = "";
            var body = "";
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
    </html>
    ```

**Common file system**

You can make a copy of the `/usr/share/nginx/html/wallarm_blocked.html` (`/opt/wallarm/usr/share/nginx/html/wallarm_blocked.html`) under a new name wherever you want (NGINX should have read permission there) including the same folder.

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

See the detailed [example](#ingress-annotations).

### Frequent modifications

To add your company logo, in the `wallarm_blocked_renamed.html` file, modify and uncomment:

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

To add your company support email and customize the "Contact us" email content, edit the `wallarm_blocked_renamed.html` file by updating the `SUPPORT_EMAIL`, `subject`, and `body` variables:

```html
<script>
    // Optional: provide a support email address for the "Contact us" link.
    // You can also define the email subject and body text.
    const SUPPORT_EMAIL = "support@company.com";
    var subject = "Blocked request assistance";
    var body = "";
</script>
```

## Configuration examples

Below are examples of configuring the blocking page and error code via the directives `wallarm_block_page` and `wallarm_block_page_add_dynamic_path`.

The `type` parameter of the `wallarm_block_page` directive is explicitly specified in each example. If you remove the `type` parameter, then configured block page, message, etc will be returned only in the response to the request blocked by the filtering node in the blocking or safe blocking [mode](../configure-wallarm-mode.md).

### Path to the HTM or HTML file with the blocking page and error code

This example shows the following response settings:

* [Modified](#customizing-sample-blocking-page) sample Wallarm blocking page `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` and the error code 445 returned if the request is blocked by the filtering node in the blocking or safe blocking mode.
* Custom blocking page `/usr/share/nginx/html/block.html` and the error code 445 returned if the request originated from any denylisted IP address.

#### NGINX configuration file

```bash
wallarm_block_page &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container along with the `wallarm_blocked_renamed.html` and `block.html` files. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

Before adding the Ingress annotation:

1. [Prepare](#copy) your modified `wallarm_blocked_renamed.html` for blocked attacks and `wallarm_blocked_renamed-2.html` for blocked requests from denylisted IPs.
1. [Create ConfigMap from the files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files):

    ```
    kubectl -n <CONTROLLER_NAMESPACE> create configmap customized-pages --from-file=wallarm_blocked_renamed.html --from-file=wallarm_blocked_renamed-2.html
    ```

1. To [mount]((https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)) created ConfigMap to the pod with Wallarm Ingress controller, do the following:

    * Update values.yaml you use to deploy the ingress chart:

        ```
        controller:
            wallarm:
            <...>
            # -- Additional volumeMounts to the controller main container.
            extraVolumeMounts:
            - name: custom-block-pages
              mountPath: /usr/share/nginx/blockpages
            # -- Additional volumes to the controller pod.
            extraVolumes:
            - name: custom-block-pages
              configMap:
              name: customized-pages
            <...>
        ```

    * Apply changes to your controller release:

        ```
        helm -n <CONTROLLER_NAMESPACE> upgrade <CHART-RELEASE-NAME> wallarm/wallarm-ingress --reuse-values -f values.yaml
        ```
        
        !!! info "Directory for mounted ConfigMap"
            Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.

Ingress annotations:

```bash
kubectl -n <INGRESS_NAMESPACE> annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/blockpages/wallarm_blocked_renamed.html response_code=445 type=attack;&/usr/share/nginx/blockpages/wallarm_blocked_renamed-2.html response_code=445 type=acl_ip,acl_source"
```

#### Pod annotations (if using Sidecar controller)

The block page can be configured on the per-pod basis using the `sidecar.wallarm.io/wallarm-block-page` [annotation](../../installation/kubernetes/sidecar-proxy/pod-annotations.md), e.g.:

```yaml hl_lines="18"
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

### URL for the client redirection

This example shows settings to redirect the client to the page `host/err445` if the filtering node blocks the request originated from denylisted countries, regions or data centers.

#### NGINX configuration file

```bash
wallarm_block_page /err445 type=acl_source;
```

To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### Named NGINX `location`

This example shows settings to return to the client the message `The page is blocked` and the error code 445 regardless of the reason for request blocking (blocking or safe blocking mode, origin denylisted as a single IP / subnet / country or region / data center).

#### NGINX configuration file

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### Variable and error code

This configuration is returned to the client if the request originated from the source denylisted as a single IP or subnet. The Wallarm node returns the code 445 and the blocking page with the content that depends on the `User-Agent` header value:

* By default, the [modified](#customizing-sample-blocking-page) sample Wallarm blocking page `/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html` is returned. Since NGINX variables are used in the blocking page code, this page should be initialized via the directive `wallarm_block_page_add_dynamic_path`.
* For users of Firefox — `/usr/share/nginx/html/block_page_firefox.html` (if deploying Wallarm Ingress controller, it is recommended to create a separate directory for custom block page files, i.e. `/usr/custom-block-pages/block_page_firefox.html`):

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    Since NGINX variables are used in the blocking page code, this page should be initialized via the directive `wallarm_block_page_add_dynamic_path`.
* For users of Chrome — `/usr/share/nginx/html/block_page_chrome.html` (if deploying Wallarm Ingress controller, it is recommended to create a separate directory for custom block page files, i.e. `/usr/custom-block-pages/block_page_chrome.html`):

    ```bash
    You are blocked!
    ```

    Since NGINX variables are NOT used in the blocking page code, this page should NOT be initialized.

#### NGINX configuration file

```bash
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container along with the `wallarm_blocked_renamed.html`, `block_page_firefox.html`, and `block_page_chrome.html` files. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)

#### Ingress controller

1. Pass the parameter `controller.config.http-snippet` to the deployed Helm chart by using the command [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/):

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/opt/wallarm/usr/share/nginx/html/wallarm_blocked_renamed.html;}' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. [Create ConfigMap from the files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `wallarm_blocked_renamed.html`, `block_page_firefox.html`, and `block_page_chrome.html`.
3. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Directory for mounted ConfigMap"
        Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.
4. Add the following annotation to the Ingress:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> -n <INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```
