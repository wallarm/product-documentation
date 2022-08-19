# Customizing the Wallarm Kubernetes Sidecar proxy 2.0

This article instructs you on safe and effective customization of the [Wallarm Kubernetes Sidecar proxy solution 2.0](deployment.md) providing example for some common customization use cases.

## Configuration area

The Wallarm Sidecar proxy solution can be configured globally and on the per-application pod basis.

### Global settings

Global configuration options apply to all sidecar resources created by the Wallarm controller.

Global settings are set by the [default Helm chart values](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml). This configuration can be overridden by the `values.yaml` file provided by the user during `helm install` or `helm upgrade`.

There is no fixed number of available global configuration options. The Wallarm Sidecar proxy solution is based on the standard Kubernetes components, thus the global solution configuration is largely similar to the Kubernetes stack configuration. Care should be taken when customizing the solution since it allows complete change of the resulting Pod and improper solution function as a result. Please rely on the Helm and Kubernetes documentation when changing global settings.

### Per-pod settings

Per-application pod settings are set via application Pod's annotations.

Pod's annotations are available to override the global configuration options on individual pods. Annotations take precedence over global settings. If the same option is specified globally and via the annotation, the value from annotation will be applied.

[There is the list of supported per-pod's annotations](pod-annotations.md)

## Configuration use cases

As mentioned above, you can customize the solution in many ways. To make the most common and crucial of them easier to implement, we have prepared more detailed configuration descriptions with examples.

### Single and split deployment of containers

Wallarm provides two options for deployment of Wallarm containers to a Pod:

* Single deployment (by default)
* Split deployment

You can set the container deployment options both on the global and per-pod basis:

* Globally by setting the Helm chart value `config.injectionStrategy.schema` to `single` (default) or `split`.
* On the per-pod basis by setting the appropriate application Pod's annotation `sidecar.wallarm.io/sidecar-injection-schema` to `"single"` or `"split"`.

#### Single deployment (by default)

With the single deployment of Wallarm containers, only one container will run in a Pod, apart from the optional init container with **iptables**.

As a result, there are two running containers:

* `sidecar-init-iptables` is the init container running iptables. By default, this container starts but you can [disable it](#incoming-traffic-interception-port-redirection).
* `sidecar-proxy` runs NGINX proxy with Wallarm modules and some helper services. All these processes run and manage by [supervisord](http://supervisord.org/).

#### Split deployment

With the split deployment of Wallarm containers, two additional containers will run in a Pod, apart from two init containers.

This option moves all helper services out from the `sidecar-proxy` container and remains only NGINX services to be started by the container.

Split container deployment provides more granular control over resources consumed by NGINX and helper services. It is the recommended option for highly loaded applications where dividing the CPU/Memory/Storage namespaces between the Wallarm and helper containers is necessary.

As a result, there are four running containers:

* `sidecar-init-iptables` is the init container running iptables. By default, this container starts but you can [disable it](#incoming-traffic-interception-port-redirection).
* `sidecar-init-helper` is the init container with helper services tasked with connecting the Wallarm node to the Wallarm Cloud.
* `sidecar-proxy` is the container with NGINX services.
* `sidecar-helper` is the container with some other helper services.

### Application container port auto-discovery

The protected application port can be configured in many ways. To handle and forward incoming traffic properly, the Wallarm sidecar proxy must be aware about TCP port the application container accepts incoming requests.

By default, the sidecar controller automatically discovers the port in the following priority order:

1. If the port is defined via the `sidecar.wallarm.io/application-port` pod's annotation, the Wallarm controller uses this value.
1. If there is the port defined under the `name: http` application container setting, the Wallarm controller uses this value.
1. If there is no port defined under the `name: http` setting, the Wallarm controller uses the port value found first in the application container settings.
1. If there are not ports defined in the application container settings, the Wallarm controller uses the value of `config.nginx.applicationPort` from the Wallarm Helm chart.

If application container port auto-discovery does not work as expected, explicitly specify the port using the 1st or the 4th option.

### Incoming traffic interception (port redirection)

By default, the Wallarm sidecar controller routes traffic as follows:

1. Intercepts incoming traffic coming to the attached Pod's IP and application container port.
1. Redirects this traffic to the sidecar proxy container using iptables.
1. Sidecar proxy mitigates malicious requests and forwards legitimate traffic to application container.

Incoming traffic interception is implemented using the init container running iptables. You can change the default behavior as follows:

* Globally by setting the Helm chart value `config.injectionStrategy.iptablesEnable` to `"false"`
* On the per-pod basis by setting the Pod's annotation `sidecar.wallarm.io/sidecar-injection-iptables-enable` to `"false"`

If incoming traffic interception is disabled, the Wallarm sidecar proxy container will publish port with name `proxy`. For incoming traffic to come from Kubernetes service to the `proxy` port, specify the `spec.ports.targetPort` setting in your Service manifest as follows:

```yaml hl_lines="34"
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
        sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
  namespace: default
spec:
  ports:
    - port: 80
      targetPort: proxy
      protocol: TCP
      name: http
  selector:
    app: myapp
```

### Allocating resources for containers

The amount of memory allocated for the Wallarm sidecar containers determines the quality and speed of request processing. To allocate anough resources for memory requests and limits, [learn our recommendations](../../../admin-en/configuration-guides/allocate-resources-for-waf-node.md).

Resource allocation is allowed on both the global and per-pod levels.

#### Global allocation via Helm chart values

| Container deployment pattern | Container name        | Chart value                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Split, Single](#single-and-split-deployment-of-containers)     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split, Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

Example of Helm chart values for managing resources (requests & limits) globally:

```yaml
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

#### Per-pod basis allocation via Pod's annotations

| Container deployment pattern | Container name        | Annotation                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split](#single-and-split-deployment-of-containers)     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Single, Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Example of annotations to manage resources (requests & limits) on the per-pod basis (with the `single` container pattern enabled):

```yaml hl_lines="16-24"
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
        sidecar.wallarm.io/proxy-cpu: 200m
        sidecar.wallarm.io/proxy-cpu-limit: 500m
        sidecar.wallarm.io/proxy-memory: 256Mi
        sidecar.wallarm.io/proxy-memory-limit: 512Mi
        sidecar.wallarm.io/init-iptables-cpu: 50m
        sidecar.wallarm.io/init-iptables-cpu-limit: 100m
        sidecar.wallarm.io/init-iptables-memory: 32Mi
        sidecar.wallarm.io/init-iptables-memory-limit: 64Mi
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Enabling additional NGINX modules

Docker image of the Wallarm sidecar proxy is distributed with the following additional NGINX modules disabled by default:

* ngx_http_auth_digest_module.so
* ngx_http_brotli_filter_module.so
* ngx_http_brotli_static_module.so
* ngx_http_geoip2_module.so
* ngx_http_influxdb_module.so
* ngx_http_modsecurity_module.so
* ngx_http_opentracing_module.so

Ypu can enable additional modules only on the per-pod basis by setting Pod's annotation `sidecar.wallarm.io/nginx-extra-modules`.

The format of annotation's value is the JSON array. Example with additional modules enabled:

```yaml hl_lines="16-17"
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
        sidecar.wallarm.io/nginx-extra-modules: "['ngx_http_brotli_filter_module.so','ngx_http_brotli_static_module.so', 'ngx_http_opentracing_module.so']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Using custom NGINX configuration

You can provide additional configuration into NGINX configuration of the Wallarm sidecar proxy via the per-pod's basis **snippets** and **includes**.

#### Snippet

Snippets is a conevnient way to add one-line changes to the NGINX configuration. For more complex changes, includes is a recommended option.

To specify custom settings via anippets, use the following per-pod's annotations:

| NGINX config section | Annotation                                  | 
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

Example of the annotation changing the [`disable_acl`](../../../admin-en/configure-parameters-en.md#disable_acl) NGINX directive value:

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
        sidecar.wallarm.io/nginx-location-snippet: "disable_acl on"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

To specify more than one directive, use the `;` symbol, e.g.:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### Include

This option allows to mount additional configuration files into the sidecar proxy container from Kubernetes ConfigMap or Secret.

| NGINX config section | Annotation                                  | Value type |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | JSON array  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | JSON array  |
| location             | `sidecar.wallarm.io/nginx-location-include` | JSON array  |

Providing additional configuration files into sidecar proxy container achieves by using extra Volumes and Volumes mounts:

| Item          |  Annotation                                    | Value type  |
|---------------|------------------------------------------------|-------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON object |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON object |

Below is the example with mounted configuration file included on the `http` level of NGINX config. This example assumes that the `nginx-http-include-cm` ConfigMap was created in advance and contains valid NGINX configuration directives.

```yaml hl_lines="16-19"
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
        sidecar.wallarm.io/proxy-extra-volumes: "[{'name': 'nginx-http-extra-config', 'configMap': {'name': 'nginx-http-include-cm'}}]"
        sidecar.wallarm.io/proxy-extra-volume-mounts: "[{'name': 'nginx-http-extra-config', 'mountPath': '/nginx_include/http.conf', 'subPath': 'http.conf'}]"
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

## Other configurations via annotations

In addition to the listed configuration use cases, you can fine-tune the Wallarm sidecar proxy solution for application pods using other annotations.

[There is the list of supported per-pod's annotations](pod-annotations.md)
