# Deploying NGINX Ingress Controller with Integrated Wallarm Services

# Migrating from the Community Ingress NGINX-based Controller to Ingress Controller based on the open-source Ingress NGINX

This guide compares the old community `ingress-nginx` controller (repo: `ingress`) with the new F5 NGINX Ingress Controller (repo: `ingress-new-poc`) and outlines two migration paths:

- Gradual migration when a load balancer sits in front of the NGINX Ingress Controller.
- A full swap (cutover) migration.

## What changes between the controllers

### Controller and chart differences

- **Default backend**: the community chart ships an optional `defaultBackend` deployment; the new controller does not ship a default backend component, so “catch-all” routing must be implemented explicitly.  
  ```1376:1404:charts/ingress-nginx/values.yaml
  ## Default 404 backend
  ##
  defaultBackend:
    ##
    enabled: false
    name: defaultbackend
    image:
      registry: registry.k8s.io
      image: defaultbackend-amd64
      # ...
  ```
- **IngressClass behavior**: the old controller can watch resources without an IngressClass (`watchIngressWithoutClass`), while the new controller uses `setAsDefaultIngress` to assign a default class to new Ingresses.  
  ```76:149:charts/ingress-nginx/values.yaml
  # -- Process Ingress objects without ingressClass annotation/ingressClassName field
  watchIngressWithoutClass: false
  # -- This section refers to the creation of the IngressClass resource.
  ingressClassResource:
    name: nginx
    enabled: true
    default: false
    controllerValue: k8s.io/ingress-nginx
  # -- For backwards compatibility with ingress.class annotation, use ingressClass.
  ingressClass: nginx
  ```
  ```555:570:../ingress-new-poc/charts/nginx-ingress/values.yaml
  ingressClass:
    name: nginx
    create: true
    ## New Ingresses without an ingressClassName field specified will be assigned the class
    setAsDefaultIngress: false
  ```
- **Custom resources**: the new controller supports CRDs like `VirtualServer`, `VirtualServerRoute`, and `TransportServer` for advanced routing and policy control.  
  ```581:588:../ingress-new-poc/charts/nginx-ingress/values.yaml
  ## Enable the custom resources.
  enableCustomResources: true
  ## Enable TLS Passthrough on port 443. Requires controller.enableCustomResources.
  enableTLSPassthrough: false
  ```
  ```1:28:../ingress-new-poc/docs/crd/k8s.nginx.org_virtualservers.md
  # VirtualServer
  ...
  The `VirtualServer` resource defines a virtual server for the NGINX Ingress Controller. It provides advanced configuration
  capabilities beyond standard Kubernetes Ingress resources...
  ...
  | `host` | `string` | The host (domain name) ... The host value needs to be unique among all Ingress and VirtualServer resources. |
  ```

### Operational differences to plan for

Use this as a checklist before you migrate:

- **Host requirements**: In the new controller, `host` is required on Ingress resources and must be unique across Ingresses. If you split a host across multiple Ingresses, you must migrate to mergeable Ingresses or to `VirtualServer`/`VirtualServerRoute`.
- **Annotation changes**: `nginx.ingress.kubernetes.io/*` annotations do not map 1:1 to `nginx.org/*`. Some features only exist in NGINX Plus or require CRDs.
- **Feature gaps**: session stickiness, JWT auth, Brotli, and OCSP are not available in the open-source controller or require alternative configuration.
- **Observability**: log formats, metrics endpoints, and dashboards differ. Plan for changes in dashboards and alerting.
- **Default route**: if you used a default backend, implement an explicit “catch-all” host and path in the new controller (or use a dedicated LB listener that rejects unknown hosts).

## Migration prep (both scenarios)

1. **Inventory Ingresses**:
   - Identify Ingresses with no `spec.rules.host`.
   - Identify multiple Ingresses sharing the same host.
   - List all annotations in use and map them to new equivalents.
2. **Decide resource model**:
   - Keep using standard `Ingress` where possible.
   - Move complex routing to `VirtualServer`/`VirtualServerRoute`.
3. **Decide IngressClass**:
   - Pick a new class name (for parallel migration) or reuse `nginx` (for swap).
4. **Plan your “default route”**:
   - If you relied on the community default backend, implement an explicit catch-all host/path service in the new controller.
5. **Update application manifests**:
   - Update Ingress annotations and `ingressClassName`.
   - Ensure every Ingress has a unique host.

## Migration case 1: load balancer in front (gradual shift)

Use this when you have a cloud LB/NLB/ALB in front of the controller and want a controlled traffic shift.

1. **Install the new controller in parallel**:
   - Use a **different namespace** and **different IngressClass** (for example, `nginx-new`).
   - Enable CRDs only if you plan to use them now.
2. **Update application manifests**:
   - Change Ingress annotations to the new controller’s format.
   - Set `ingressClassName: nginx-new`.
   - Ensure hosts are unique. If multiple Ingresses share a host, convert to mergeable Ingress or VirtualServer.
3. **Deploy updated manifests**:
   - Apply updated Ingresses or CRDs while old controller keeps serving old resources.
4. **Shift traffic at the load balancer**:
   - Add the new controller Service/pods to the LB target group.
   - Gradually shift traffic weights to new pods.
   - Monitor error rate, latency, and NGINX config reload errors.
5. **Finalize**:
   - Once traffic fully shifts, delete old Ingresses (or change their class).
   - Remove the old controller.

## Migration case 2: swap (cutover)

Use this when you need a fast replacement with a short, planned interruption.

1. **Prepare a maintenance window**:
   - Freeze deployments and config changes.
2. **Update all manifests ahead of time**:
   - Change Ingress annotations to the new controller equivalents.
   - Ensure every Ingress has a unique host.
   - Add `ingressClassName` if needed.
3. **Swap the controller**:
   - Uninstall or scale down the old controller.
   - Install the new controller **with the same Service name/annotations** so the external LB keeps its address.
   - If you must reuse the same IngressClass name (`nginx`), ensure the new controller’s class is created before applying Ingresses.
4. **Apply manifests and validate**:
   - Apply updated Ingresses/CRDs.
   - Validate controller readiness, NGINX reload status, and test key routes.

## Quick mapping checklist

- **Ingress class handling**: decide `ingressClassName` vs default class behavior.
- **Host uniqueness**: merge or convert duplicate-host Ingresses.
- **Annotations**: migrate to `nginx.org/*` (and NGINX Plus where required).
- **Default backend**: add explicit catch-all host/path.
- **Advanced routing**: consider `VirtualServer`/`VirtualServerRoute`.

## Validation and rollback

- **Validation**: test health checks, TLS termination, and at least one request per host/path.
- **Rollback**:
  - Gradual migration: shift LB weights back to old controller.
  - Swap: keep old controller chart values ready to reinstall if needed.

### Config-level differences that impact migration

These come from a configuration comparison report and should be validated against your cluster’s rendered NGINX configs:

- **Scripting model**: old uses Lua (OpenResty) and dynamic upstream balancing; new uses NJS with static upstreams and reloads.
- **Traffic tuning**: old is explicitly tuned for high traffic (worker limits, keepalive, proxy buffer settings); new relies on defaults.
- **TLS posture**: old has explicit SSL hardening; new defaults are minimal with `ssl_reject_handshake` on the default server.
- **Compression**: old enables Brotli and Gzip; new has no compression enabled by default.
- **Client IPs**: old commonly uses PROXY protocol; new typically uses `X-Real-IP`. LB configuration must match.
- **Logging**: old logs to files; new logs to stdout/stderr (container-friendly).
- **Monitoring**: endpoints and formats differ (stub status vs JSON/Prometheus Wallarm metrics).