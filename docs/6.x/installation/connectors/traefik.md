# Wallarm Connector for Traefik

To secure APIs managed by [Traefik](https://doc.traefik.io/traefik/), Wallarm provides a connector implemented as an in-process Traefik middleware plugin. The plugin routes ingress traffic through a [Wallarm Native Node](../native-node/helm-chart.md) for real-time API attack detection, without sidecars, DaemonSets, or traffic mirroring infrastructure. One shared Node deployment serves every Traefik replica in the cluster.

```
client ──▶ Traefik ──▶ [wallarm middleware] ──▶ upstream service
                            │        ▲
                       copy │        │ verdict (block mode)
                            ▼        │
                     Wallarm Native Node (connector-server)
```

The connector supports both [out-of-band](../oob/overview.md) and [in-line](../inline/overview.md) traffic analysis, selected with the `mode` value:

* `oob` — a copy of each request is sent to the Node asynchronously. Traffic latency is unaffected, and attacks appear in Wallarm Console.
* `block` — the Node verdict is enforced in-line. The `403` response is returned to the client before the request reaches your service.

Response inspection is enabled by default: the upstream response is mirrored to the Node on a second, correlated leg. [API Discovery](../../api-discovery/overview.md) and [API Sessions](../../api-sessions/overview.md) rely on this data.

The plugin caps request body buffering at 1 MiB and applies a configurable timeout to Node calls. If the Node does not answer within the timeout, the plugin fails open and the request proceeds to the upstream service.

## Requirements

To proceed with the deployment, ensure that the following requirements are met:

* Traefik deployed in a Kubernetes cluster and managing your API traffic
* [Helm v3](https://helm.sh/) package manager
* Wallarm Native Node 0.25.8 or later
* Access to `https://charts.wallarm.com` to add the Wallarm Helm chart
* Access to `https://us1.api.wallarm.com` (US Wallarm Cloud) or `https://api.wallarm.com` (EU Wallarm Cloud)

## Deployment

### 1. Deploy a Wallarm Native Node

Deploy the Wallarm Native Node in `connector-server` mode as a separate service in your Kubernetes cluster:

```bash
helm repo add wallarm https://charts.wallarm.com
helm install native wallarm/wallarm-node-native -n wallarm-node --create-namespace \
  --set config.connector.mode=connector-server --set config.api.token=<TOKEN>
```

`<TOKEN>` is your Wallarm [API token](../../user-guides/settings/api-tokens.md).

For the full set of deployment and configuration options, see the [Native Node Helm chart instructions](../native-node/helm-chart.md).

### 2. Obtain the Wallarm Traefik connector

Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Traefik connector code bundle.

### 3. Deploy the connector

Install the connector chart, which creates the plugin ConfigMap and the Traefik `Middleware` resource:

```bash
helm install wallarm-traefik-connector ./charts/wallarm-traefik-connector \
  -n traefik --set mode=oob
```

Set `mode` to `oob` for out-of-band analysis or to `block` to enforce Node verdicts in-line.

### 4. Load the plugin into Traefik

Apply the values file supplied with the connector bundle to register the plugin with Traefik:

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

`<name>` is the name of your Ingress resource.

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
