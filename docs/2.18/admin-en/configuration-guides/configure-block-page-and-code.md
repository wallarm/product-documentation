# Configuration of the blocking page and error code

These instructions describe the method to customize the blocking page and error code returned to the client in response to a blocked request.

## Configuration methods

The blocking page and error code are configured via NGINX directives. The set of directives depends on the reason and method of request blocking:

* If the request has attack signs and the filtering node operates in blocking [mode](../configure-wallarm-mode.md) → directives `wallarm_block_page` and `wallarm_block_page_add_dynamic_path`
* If the request is originated from a [blocked IP address](../configure-ip-blocking-en.md) → directives `wallarm_acl_block_page` and `wallarm_block_page_add_dynamic_path`

By default, the response code 403 and default NGINX blocking page are returned to the client.

## NGINX directives

### wallarm_block_page

The directive `wallarm_block_page` lets you set up the response to the request [blocked](../configure-wallarm-mode.md) by the filtering node due to detected attack signs.

This directive value should correspond to the following format:

* Path to the HTM or HTML file and error code (optional)

    ```bash
    wallarm_block_page &/<PATH_TO_FILE/HTML_HTM_FILE_NAME> response_code=<CUSTOM_CODE>;
    ```

    You can use [NGINX variables](https://nginx.org/en/docs/varindex.html) on the blocking page. For this, add the variable name in the format `${variable_name}` to the blocking page code. For example, `${remote_addr}` displays the IP address from which the blocked request was originated.

    Wallarm provides the default blocking page. To use this page, please specify the path `&/usr/share/nginx/html/wallarm_blocked.html` in the directive value.

    !!! warning "Important information for Debian and CentOS users"
        If you use an NGINX version lower than 1.11 installed from [CentOS/Debian](../../waf-installation/nginx/dynamic-module-from-distr.md) repositories, you should remove the `request_id` variable from the page code to display the dynamic blocking page correctly:
        ```
        UUID ${request_id}
        ```

        This applies to both `wallarm_blocked.html` and to the custom block page.

* URL for the client redirection

    ``` bash
    wallarm_block_page /<REDIRECT_URL>;
    ```

* Named NGINX `location`

    ``` bash
    wallarm_block_page @<NAMED_LOCATION>;
    ```

* Variable and error code (optional)

    ``` bash
    wallarm_block_page &<VARIABLE_NAME> response_code=<CUSTOM_CODE>;
    ```

    !!! warning "Initializing the blocking page with NGINX variables in the code"
        If using this method to set the blocking page with [NGINX variables](https://nginx.org/en/docs/varindex.html) in its code, please initialize this page via the directive [`wallarm_block_page_add_dynamic_path`](#wallarm_block_page_add_dynamic_path).

The directive `wallarm_block_page` can be set inside the `http`, `server`, `location` blocks of the NGINX configuration file.

### wallarm_acl_block_page

The directive `wallarm_acl_block_page` lets you set up the response to the request originated from a [blocked IP address](../configure-ip-blocking-en.md).

This directive value has the same format as [`wallarm_block_page`](#wallarm_block_page).

### wallarm_block_page_add_dynamic_path

The directive `wallarm_block_page_add_dynamic_path` is used to initialize the blocking page that has NGINX variables in its code and the path to this blocking page is also set using a variable. Otherwise, the directive is not used.

The directive  can be set inside the `http` block of the NGINX configuration file.

## Configuration examples

Below are examples of configuring the blocking page and error code via the directives `wallarm_block_page` and `wallarm_block_page_add_dynamic_path`. Example settings are applied to requests [blocked](../configure-wallarm-mode.md) by the filtering node due to detected attack signs.

When configuring the response to requests originated from [blocked IP addresses](../configure-ip-blocking-en.md), please replace the directive `wallarm_block_page` with `wallarm_acl_block_page`.

### Path to the HTM or HTML file with the blocking page and error code

This example shows the following response settings:

* Default Wallarm blocking page and the error code 445
* Custom blocking page `/usr/share/nginx/html/block.html` and the error code 445

#### NGINX configuration file

=== "Default Wallarm blocking page"
    ```bash
    wallarm_block_page &/usr/share/nginx/html/wallarm_blocked.html response_code=445;
    ```
=== "Custom blocking page"
    ```bash
    wallarm_block_page &/usr/share/nginx/html/block.html response_code=445;
    ```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. If configuring the custom blocking page, this page should also be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

=== "Default Wallarm blocking page"
    ```bash
    kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='&/usr/share/nginx/html/wallarm_blocked.html response_code=445'
    ```
=== "Custom blocking page"
    ```bash
    kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='&/usr/share/nginx/html/block.html  response_code=445'
    ```

    Before adding the Ingress annotation:
    
    1. [Create ConfigMap from the file](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `block.html`.
    2. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

        !!! info "Directory for mounted ConfigMap"
            Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.

### URL for the client redirection

This example shows settings to redirect the client to the page `host/err445`.

#### NGINX configuration file

```bash
wallarm_block_page /err445;
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='/err445'
```

### Named NGINX `location`

This example shows settings to return to the client the message `The page is blocked` and the error code 445.

#### NGINX configuration file

```bash
wallarm_block_page @block;
location @block {
    return 445 'The page is blocked';
}
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directive should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress annotations

```bash
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/server-snippet="location @block {return 445 'The page is blocked';}"
kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='@block'
```

### Variable and error code

This example shows settings to return to the client code 445 and different blocking pages depending on the `User-Agent` header value:

* By default, the default Wallarm blocking page `/usr/share/nginx/html/wallarm_blocked.html` is returned. Since NGINX variables are used in the blocking page code, this page should be initialized via the directive `wallarm_block_page_add_dynamic_path`.
* For users of Firefox — `/usr/share/nginx/html/block_page_firefox.html`:

    ```bash
    You are blocked!

    IP ${remote_addr}
    Blocked on ${time_iso8601}
    UUID ${request_id}
    ```

    Since NGINX variables are used in the blocking page code, this page should be initialized via the directive `wallarm_block_page_add_dynamic_path`.
* For users of Chrome — `/usr/share/nginx/html/block_page_chrome.html`:

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

wallarm_block_page $block_page response_code=445;
```

* To apply the settings to the Docker container, the NGINX configuration file with appropriate settings should be mounted to the container. If configuring the custom blocking page, this page should also be mounted to the container. [Running the container mounting the configuration file →](../installation-docker-en.md#run-the-container-mounting-the-configuration-file)
* To apply the settings to Wallarm sidecar container, the directives should be passed in Wallarm ConfigMap (see the instructions for Kubernetes deployment based on [Helm charts](../installation-guides/kubernetes/wallarm-sidecar-container-helm.md#step-1-creating-wallarm-configmap) or [Manifests](../installation-guides/kubernetes/wallarm-sidecar-container-manifest.md#step-1-creating-wallarm-configmap)).

#### Ingress controller

1. Add the following parameter to the [`config`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml#L20) object in **values.yaml** of the [cloned Wallarm Helm chart repository](../installation-kubernetes-en.md#step-1-installing-the-wallarm-ingress-controller):

    ```bash
    config: {
        http-snippet: 'wallarm_block_page_add_dynamic_path /usr/test-block-page/blocked.html /usr/share/nginx/html/wallarm_blocked.html; map $http_user_agent $block_page { "~Firefox" &/usr/share/nginx/html/block_page_firefox.html; "~Chrome" &/usr/share/nginx/html/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked.html;}'
    }
    ```
2. Execute the command `helm install` as described in step 4 of the [installation instructions](../installation-kubernetes-en.md#step-1-installing-the-wallarm-ingress-controller).
3. [Create ConfigMap from the files](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) `block_page_firefox.html` and `block_page_chrome.html`.
4. Mount created ConfigMap to the pod with Wallarm Ingress controller. For this, please update the Deployment object relevant for Wallarm Ingress controller following the [instructions](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap).

    !!! info "Directory for mounted ConfigMap"
        Since existing files in the directory used to mount ConfigMap can be deleted, it is recommended to create a new directory for the files mounted via ConfigMap.
5. Add the following annotation to the Ingress:

    ```bash
    kubectl annotate ingress <INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='$block_page response_code=445'
    ```
