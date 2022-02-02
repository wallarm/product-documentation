# Configuration of the blocking page and error code (NGINX)

These instructions describe the method to customize the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above is originated from [greylisted IP address](../../user-guides/ip-lists/greylist.md) and the node filters requests in the safe blocking [mode](../configure-wallarm-mode.md).
* Request is originated from the [blacklisted IP address](../../user-guides/ip-lists/blacklist.md).

## Configuration limitations

Configuration of the blocking page and error code is supported in NGINX-based Wallarm node deployments but is not supported in Envoy-based Wallarm node deployments. Envoy-based Wallarm node always returns code `403` in the response to the blocked request.

## Configuration methods

By default, the response code 403 and default NGINX blocking page are returned to the client. You can change default settings by using the following NGINX directives:

* `wallarm_block_page`
* `wallarm_block_page_add_dynamic_path`

### NGINX directive `wallarm_block_page`

You can configure the blocking page and error code passing the following parameters in the `wallarm_block_page` NGINX directive:

* Path to the HTM or HTML file of the blocking page. You can specify the path either to a custom blocking page or the [default blocking page](#customizing-default-blocking-page) provided by Wallarm.
* The text of the message to be returned in response to a blocked request.
* URL for the client redirection.
* `response_code`: response code.
* `type`: the type of the blocked request in response to which the specified configuration must be returned. The parameter accepts one or several values (separated by commas) from the list:

    * `attack` (by default): for requests blocked by the filtering node when filtering requests in the blocking or safe blocking [mode](../configure-wallarm-mode.md).
    * `acl_ip`: for requests originated from IP addresses that are added to the [blacklist](../../user-guides/ip-lists/blacklist.md) as a single object or a subnet.
    * `acl_source`: for requests originated from IP addresses that are registered in [blacklisted](../../user-guides/ip-lists/blacklist.md) countries or data centers.

The `wallarm_block_page` directive accepts the listed parameters in the following formats:

* Path to the HTM or HTML file, error code (optional), and blocked request type (optional)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE> type=<BLOCKED_REQUEST_TYPE>;
    ```
    
    You can use [NGINX variables](https://nginx.org/en/docs/varindex.html) on the blocking page. For this, add the variable name in the format `${variable_name}` to the blocking page code. For example, `${remote_addr}` displays the IP address from which the blocked request was originated.

    Wallarm provides the default blocking page. To use this page, please specify the path `&/usr/share/nginx/html/wallarm_blocked.html` in the directive value.

    !!! warning "Important information for Debian and CentOS users"
        If you use an NGINX version lower than 1.11 installed from [CentOS/Debian](../../waf-installation/nginx/dynamic-module-from-distr.md) repositories, you should remove the `request_id` variable from the page code to display the dynamic blocking page correctly:
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

### Customizing default blocking page

 The default blocking page provided by Wallarm `/usr/share/nginx/html/wallarm_blocked.html` looks as follows:

![!Wallarm blocking page](images/blocking-page-provided-by-wallarm.png)

You can customize this page:

* add your company logo
* add your company support email
* change any other HTML elements or add your own

!!! info "Default vs custom blocking page"
    Instead of modifying the default page provided by Wallarm, you can create your own custom one and then set it to be used via the `path` property of the [wallarm_block_page](#nginx-directive-wallarm_block_page) directive.

To add your company logo, in the `wallarm_blocked.html` file, modify and uncomment:

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

To add your company support email, in the `wallarm_blocked.html` file, modify the `SUPPORT_EMAIL` variable:

```html
    <script>
        // Place your support email here
        const SUPPORT_EMAIL = "support@company.com";
    </script>
```

## Configuration examples

Below are examples of configuring the blocking page and error code via the directives `wallarm_block_page` and `wallarm_block_page_add_dynamic_path`.

The `type` parameter of the `wallarm_block_page` directive is explicitly specified in each example. If you remove the `type` parameter, then configured block page, message, etc will be returned only in the response to the request blocked by the filtering node in the blocking or safe blocking [mode](../configure-wallarm-mode.md).

### Path to the HTM or HTML file with the blocking page and error code

This example shows the following response settings:

* Default Wallarm blocking page and the error code 445 returned if the request is blocked by the filtering node in the blocking or safe blocking mode.
* Custom blocking page `/usr/share/nginx/html/block.html` and the error code 445 returned if the request is originated from any blacklisted IP address.

#### NGINX configuration file

```bash
wallarm_block_page &/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack;
wallarm_block_page &/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source;
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. If configuring the custom blocking page, this page should also be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

Before adding the Ingress annotation:

1. [Create ConfigMap from the file](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `block.html`.
2. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Directory for mounted ConfigMap"
        Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.

Ingress annotations:

```bash
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack;&/usr/share/nginx/html/block.html response_code=445 type=acl_ip,acl_source"
```

### URL for the client redirection

This example shows settings to redirect the client to the page `host/err445` if the filtering node blocks the request originated from blacklisted countries or data centers.

#### NGINX configuration file

```bash
wallarm_block_page /err445 type=acl_source;
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="/err445 type=acl_source"
```

### Named NGINX `location`

This example shows settings to return to the client the message `The page is blocked` and the error code 445 regardless of the reason for request blocking (blocking or safe blocking mode, origin blacklisted as a single IP / subnet / country / data center).

#### NGINX configuration file

```bash
wallarm_block_page @block type=attack,acl_ip,acl_source;
location @block {
    return 445 'The page is blocked';
}
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="@block type=attack,acl_ip,acl_source"
```

### Variable and error code

This configuration is returned to the client if the request is originated from the source blacklisted as a single IP or subnet. The Wallarm node returns the code 445 and the blocking page with the content that depends on the `User-Agent` header value:

* By default, the default Wallarm blocking page `/usr/share/nginx/html/wallarm_blocked.html` is returned. Since NGINX variables are used in the blocking page code, this page should be initialized via the directive `wallarm_block_page_add_dynamic_path`.
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
wallarm_block_page_add_dynamic_path /usr/share/nginx/html/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked.html;

map $http_user_agent $block_page {
  "~Firefox"  &/usr/share/nginx/html/block_page_firefox.html;
  "~Chrome"   &/usr/share/nginx/html/block_page_chrome.html;
  default     &/usr/share/nginx/html/wallarm_blocked.html;
}

wallarm_block_page $block_page response_code=445 type=acl_ip;
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. If configuring the custom blocking page, this page should also be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directives should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress controller

1. Pass the parameter `controller.config.http-snippet` to the deployed Helm chart by using the command [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/):

    ```bash
    helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked.html;}' <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
2. [Create ConfigMap from the files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `block_page_firefox.html` and `block_page_chrome.html`.
3. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Directory for mounted ConfigMap"
        Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.
4. Add the following annotation to the Ingress:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445 type=acl_ip'
    ```
