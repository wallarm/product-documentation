[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes

# Wallarm Connector for Traefik

To secure APIs managed by [Traefik](https://doc.traefik.io/traefik/), Wallarm provides a connector implemented as an in-process Traefik middleware plugin. The plugin routes ingress traffic through a [Wallarm Native Node](../native-node/helm-chart.md) for real-time API attack detection, without sidecars, DaemonSets, or traffic mirroring infrastructure. One shared Node deployment serves every Traefik replica in the cluster.

The connector supports both [synchronous (in-line)](../inline/overview.md) and [asynchronous (out-of-band)](../oob/overview.md) traffic analysis, selected with the `mode` value:

* `block` (default) — the Node verdict is enforced in-line. The `403` response is returned to the client before the request reaches your service.
* `oob` — a copy of each request is sent to the Node asynchronously. Traffic latency is unaffected, and attacks appear in Wallarm Console.

=== "Synchronous traffic flow"
    ![Traefik with synchronous traffic flow to the Wallarm Node](../../images/waf-installation/gateways/traefik/traffic-flow-sync.png)
=== "Asynchronous traffic flow"
    ![Traefik with asynchronous traffic flow to the Wallarm Node](../../images/waf-installation/gateways/traefik/traffic-flow-async.png)

## Use cases

This connector is the optimal choice when you need protection for APIs exposed through Traefik in a Kubernetes cluster, and you want one shared Wallarm Node to serve every Traefik replica.

## Limitations

* The connector requires a self-hosted Wallarm Native Node. It is not available with Security Edge.
* Only the first 1 MiB of a request body is sent to the Node for analysis. The cap is configurable with `maxBodyBytes`.
* The plugin fails open by default. If the Node does not answer within `timeoutMs`, the request proceeds to the upstream service without a Wallarm verdict. Set `failOpen` to `false` to fail closed instead.
* Traefik strips the `X-Real-IP` and `X-Forwarded-*` headers from peers it does not trust, and it does so before middleware runs. The connector cannot restore them, so the trusted peers have to be configured on the Traefik side. See [Configuring the real client IP](#configuring-the-real-client-ip).

## Requirements

To proceed with the deployment, ensure that the following requirements are met:

* Traefik 2.x or 3.x deployed in a Kubernetes cluster and managing your API traffic, installed with the official [Traefik Helm chart](https://github.com/traefik/traefik-helm-chart)
* [Helm v3](https://helm.sh/) package manager
* Wallarm Native Node 0.25.8 or later. Earlier Node versions do not accept the `traefik` connector type
* Access to `https://charts.wallarm.com` to add the Wallarm Helm chart
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to `https://us1.api.wallarm.com` (US Wallarm Cloud) or `https://api.wallarm.com` (EU Wallarm Cloud)
* **Administrator** access to Wallarm Console for [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)

## Deployment

To secure APIs managed by Traefik, follow these steps:

1. Deploy the Wallarm Native Node service in your Kubernetes cluster.
1. Obtain the Wallarm Traefik connector, deploy it, load the plugin into Traefik, and attach the middleware to the Ingress resources you want to analyze.

### 1. Deploy a Wallarm Native Node

Deploy the Wallarm Native Node in `connector-server` mode as a separate service in your Kubernetes cluster:

```bash
helm repo add wallarm https://charts.wallarm.com
helm install native wallarm/wallarm-node-native -n wallarm-node --create-namespace \
  --set config.connector.mode=connector-server --set config.api.token=<TOKEN>
```

`<TOKEN>` is your Wallarm [API token](../../user-guides/settings/api-tokens.md).

The connector-server endpoint defaults to `http://native-processing.wallarm-node.svc.cluster.local:5000`.

For the full set of deployment and configuration options, see the [Native Node Helm chart instructions](../native-node/helm-chart.md).

### 2. Obtain the Wallarm Traefik connector

Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Traefik connector code bundle.

### 3. Deploy the connector

Install the connector chart, which creates the plugin ConfigMap and the Traefik `Middleware` resource:

```bash
helm install wallarm-traefik-connector ./charts/wallarm-traefik-connector \
  -n traefik \
  --set nodeURL=http://native-processing.wallarm-node.svc.cluster.local:5000 \
  --set mode=block
```

Set `mode` to `block` to enforce Node verdicts in-line, or to `oob` for out-of-band analysis.

### 4. Load the plugin into Traefik

Apply the values file supplied with the connector bundle to register the plugin with Traefik. It mounts the plugin ConfigMap into the Traefik pod:

```bash
helm upgrade traefik traefik/traefik -n traefik --reuse-values \
  -f examples/traefik-values.yaml
```

### 5. Protect an Ingress

Attach the Wallarm middleware to the Ingress resources you want to analyze:

```bash
kubectl annotate ingress <name> \
  traefik.ingress.kubernetes.io/router.middlewares=traefik-wallarm@kubernetescrd
```

`<name>` is the name of your Ingress resource. For an `IngressRoute`, reference the middleware in the route definition instead.

## Configuring the real client IP

Traefik strips the `X-Real-IP` and `X-Forwarded-*` headers from peers it does not trust, and it does so before middleware runs. If a load balancer or CDN fronts Traefik, list the trusted peers in the Traefik Helm values. Otherwise, Wallarm Console attributes every attack to the load balancer instead of the real client:

```yaml
ports:
  web:
    forwardedHeaders:
      trustedIPs:
        - 10.0.0.0/8        # your load balancer or CNI range
```

!!! warning "Headers cannot be recovered later"
    The connector cannot restore these headers on its own, because Traefik removes them before the plugin receives the request.

## Configuration options

In the connector chart values, you can customize the following optional parameters:

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `nodeURL` | Address of the Wallarm Native Node `connector-server` endpoint. | `http://native-processing.wallarm-node.svc.cluster.local:5000` |
| `mode` | Traffic analysis mode: `block` to enforce the Node verdict in-line, or `oob` to send a copy of each request asynchronously. | `block` |
| `timeoutMs` | The maximum time (in milliseconds) the plugin waits for a response from the Wallarm Node. | `1000` |
| `failOpen` | Whether to let the request through when the Node does not answer within `timeoutMs`. When `false`, the request is rejected instead. | `true` |
| `maxBodyBytes` | The maximum size (in bytes) of the request body sent to the Node for analysis. | `1048576` (1 MiB) |
| `inspectResponse` | Sends the upstream response status and headers to the Node on a second, correlated leg. Required for [API Discovery](../../api-discovery/overview.md) and [API Sessions](../../api-sessions/overview.md): API Discovery ignores requests that have no response. | `true` |
| `inspectResponseBody` | Also sends the response body, capped by `maxBodyBytes`. Requires `inspectResponse`. | `true` |
| `middleware.name` | Name of the Traefik `Middleware` resource created by the chart. | `wallarm` |
| `plugin.configMapName` | Name of the ConfigMap holding the plugin source, mounted into the Traefik pod. | `wallarm-traefik-plugin` |

## Testing

To test the functionality of the deployed connector, follow these steps:

1. Verify that the Wallarm pods are up and running:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node` is the namespace where the Wallarm node service is deployed.

    Each pod status should be **STATUS: Running** or **READY: N/N**.
1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your Traefik ingress:

    ```
    curl -H "Host: <YOUR_APP_DOMAIN>" "http://$INGRESS_IP/etc/passwd"
    ```

    The result depends on the connector mode and on the [Wallarm node filtration mode][available-filtration-modes]:

    | Connector mode | Node filtration mode | Result |
    | --- | --- | --- |
    | `block` | blocking | `403` returned by the Node, the request never reaches the application |
    | `block` | monitoring | `200` from the application, the attack is registered in Wallarm Console |
    | `oob` | any | `200` from the application, the attack is registered in Wallarm Console asynchronously |

1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]

## Upgrading the Wallarm Traefik connector

To upgrade the deployed connector:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the updated Wallarm Traefik connector code bundle.
1. Upgrade the connector chart, which refreshes the plugin ConfigMap:

    ```
    helm upgrade wallarm-traefik-connector ./charts/wallarm-traefik-connector -n traefik --reuse-values
    ```
1. Restart Traefik so that it reloads the plugin source:

    ```
    kubectl rollout restart deployment/traefik -n traefik
    ```

Connector upgrades may require a Wallarm node upgrade, especially for major version updates. See the [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for release updates and upgrade instructions. Regular node updates are recommended to avoid deprecation and simplify future upgrades.
