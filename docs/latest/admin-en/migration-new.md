[old-ic]:         https://github.com/kubernetes/ingress-nginx
[new-ic]:         https://github.com/nginx/kubernetes-ingress

# Migrating to the Wallarm Ingress Controller (F5 NGINX)

This topic explains why and how to migrate from the Wallarm Ingress Controller based on the [Community Ingress NGINX][old-ic] to the new controller based on [F5 NGINX Ingress Controller][new-ic].

## Why the migration is required

Previously, Wallarm provided an Ingress Controller based on the [Community Ingress NGINX][old-ic].

In November 2025, the Kubernetes community announced the retirement of this project due to growing maintenance challenges and unresolved technical issues.

Wallarm will fully support this controller (including new feature releases) until **March 2026**. After that date, the controller will remain functional but will no longer receive updates, bug fixes, or security patches.

**Continuing to use it after March 2026 may expose your environment to unresolved defects and security vulnerabilities.**

To ensure ongoing support and security, we strongly recommend migrating to a supported deployment option, such as the Wallarm Ingress Controller based on the [F5 NGINX Ingress Controller][new-ic]. The sections below describe the migration steps and their benefits.

## About the new Ingress Controller

The new Wallarm Ingress Controller is based on the [F5 NGINX Ingress Controller][new-ic] and is the recommended replacement for the Community Ingress NGINX–based deployment.

It provides long-term stability and vendor-backed support, including:

* Official support and maintenance by NGINX (F5)
* Regular updates and security patches
* Guaranteed long-term maintenance
* Advanced traffic management and routing capabilities

Beyond the upstream project retirement, the new controller also provides:

* Architecture and performance: cleaner codebase, better component separation, and improved performance
* Extended functionality: advanced routing with Custom Resources (CRDs), enhanced API protection, flexible configuration, and optional NGINX Plus support
* Operations: improved monitoring and metrics, more efficient resource usage, and easier troubleshooting

!!! info "NGINX Plus features"
    The Wallarm Ingress Controller is based on the free, open-source F5 NGINX Ingress Controller. NGINX Plus features are not included. To use NGINX Plus functionality, purchase a license directly from F5/NGINX.

## Migration

The migration can be roughly divided into two stages:

1. Deploy the new Wallarm Ingress Controller alongside the existing one.

    Install the new controller without affecting the currently running controller.

1. Migrate traffic:

    * **(Option A)** Gradual migration behind an external load balancer

      Use this option when a load balancer sits in front of the Ingress Controller and can gradually shift traffic between backends.

    * **(Option B)** Swap (cutover) migration

      Use this option when traffic cannot be shifted gradually or when a planned cutover is preferred.

### Step 1. Deploy the new Wallarm Ingress Controller alongside the existing one.

1. Prepare the `values.yaml` file for the new Ingress Controller with the following values.

    ```yaml
    # Adapted from values-old.yml for the new wallarm-ingress chart
    # Original: kubernetes/ingress-nginx (community)
    # Target: F5 NGINX Ingress Controller with Wallarm

    # Wallarm WAF configuration (top-level)
    config:
      wallarm:
        enabled: true
        api:
          # Original: controller.wallarm.apiHost, apiPort, apiSSL
          host: "wallarm-apigw-apigw.wallarm.svc"
          port: 80
          ssl: false
          token: ""  # TODO: adjust --set cmd; will be supplied via CI/CD variables

      images:
        controller:
          # Original: controller.image.pullPolicy
          pullPolicy: Always
        helper:
          pullPolicy: Always

      # Original: controller.wallarm.wcliPostanalytics.commands
      wcliPostanalytics:
        logLevel: "WARN"
        commands:
          botexp:
            logLevel: WARN

      # Original: controller.wallarm.wcliController.commands
      wcliController:
        logLevel: "WARN"
        commands:
          apispec:
            logLevel: INFO

      apiFirewall:
        enabled: true

    controller:
      # Original: controller.name
      name: wlrm-common

      kind: deployment

      # Original: controller.replicaCount
      replicaCount: 2

      # Original: controller.minReadySeconds
      minReadySeconds: 10

      # Original: controller.affinity
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app.kubernetes.io/name
                  operator: In
                  values:
                  - wlrm-common
                - key: app.kubernetes.io/component
                  operator: In
                  values:
                  - controller
                - key: app.kubernetes.io/instance
                  operator: In
                  values:
                  - wlrm-common-ingress
              topologyKey: kubernetes.io/hostname
            weight: 100

      # Original: controller.autoscaling
      autoscaling:
        enabled: true
        minReplicas: 2
        maxReplicas: 10
        targetCPUUtilizationPercentage: 100

      # Original: controller.config (ConfigMap entries)
      # WARNING: Many keys from community ingress-nginx are NOT supported by F5 NGINX IC
      # See: https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/configmap-resource/
      config:
        entries:
          # ===================== SUPPORTED KEYS =====================
          hsts: "true"
          hsts-include-subdomains: "true"
          hsts-max-age: "63072000"
          server-tokens: "false"
          ssl-ciphers: DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:TLS_AES_128_CCM_8_SHA256:TLS_AES_128_CCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_DHE_RSA_WITH_AES_128_CBC_SHA:TLS_DHE_RSA_WITH_AES_128_CBC_SHA256:TLS_DHE_RSA_WITH_AES_128_GCM_SHA256:TLS_DHE_RSA_WITH_AES_256_CBC_SHA:TLS_DHE_RSA_WITH_AES_256_CBC_SHA256:TLS_DHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
          ssl-protocols: TLSv1.2 TLSv1.3
          # PROXY Protocol (replaces use-proxy-protocol: "true")
          proxy-protocol: "True"
          # Real IP config - when using proxy-protocol, real-ip-header MUST be "proxy_protocol"
          real-ip-header: "proxy_protocol"
          set-real-ip-from: "10.0.0.0/8"
          # Hide headers (replaces hide-headers)
          proxy-hide-headers: "Server"
          # Snippets (replaces server-snippet)
          http-snippets: |
            wallarm_enable_libdetection on;
          server-snippets: |
            proxy_request_buffering on;
          # ===================== NOT SUPPORTED / NO EQUIVALENT =====================
          # allow-backend-server-header: "false"    # No equivalent in F5 NGINX IC; doesn't seem important, it is false anyway
          # compute-full-forwarded-for: "true"      # No equivalent (use real-ip-header); possible to copy-paste from old IC .tmpl
          # enable-brotli: "true"                   # Not supported; module is not shipped with new IC, building separately is PITA
          # enable-ocsp: "true"                     # Not supported; implemented in Lua in old IC, PITA
          # enable-real-ip: "true"                  # Replaced by real-ip-header above; ok already
          # gzip-level: "3"                         # Not supported (no gzip config); can be manually added through snippets
          # use-gzip: "true"                        # Not supported; can be added, same as above

      # Original: controller.extraArgs.default-ssl-certificate
      defaultTLS:
        secret: "kube-system/wlrm-common-ingress-default-tls"

      # Original: controller.ingressClass, controller.ingressClassResource
      ingressClass:
        name: wlrm-common
        create: true
        # Original: controller.ingressClassResource.default
        setAsDefaultIngress: true

      # Original: controller.electionID
      reportIngressStatus:
        enable: true
        enableLeaderElection: true
        leaderElectionLockName: "wlrm-common-leader"

      # Original: controller.resources
      resources:
        limits:
          cpu: 1500m
          memory: 2000Mi
        requests:
          cpu: 500m
          memory: 1000Mi

      # Original: controller.updateStrategy
      strategy:
        rollingUpdate:
          maxUnavailable: 1
        type: RollingUpdate

      # Original: controller.minAvailable (via PDB)
      podDisruptionBudget:
        enabled: true
        minAvailable: 1

      # Original: controller.service
      service:
        create: true
        type: ClusterIP
        loadBalancerIP: "34.74.73.20"
        httpPort:
          enable: true
        httpsPort:
          enable: true

      # Original: controller.podAnnotations
      pod:
        annotations: {}

      # Wallarm controller-specific settings
      wallarm:
        # Original: controller.wallarm.metrics
        metrics:
          enabled: true

        # Original: controller.wallarm.init.resources
        initContainer:
          resources:
            limits:
              cpu: 200m
              memory: 300Mi
            requests:
              cpu: 100m
              memory: 100Mi

        # Original: controller.wallarm.wcliController.resources
        wcli:
          resources:
            limits:
              cpu: 500m
              memory: 400Mi
            requests:
              cpu: 300m
              memory: 200Mi

        # Original: controller.wallarm.apiFirewall.resources
        apiFirewall:
          resources:
            limits:
              cpu: 50m
              memory: 60Mi
            requests:
              cpu: 20m
              memory: 30Mi

      # Original: controller.allowSnippetAnnotations
      enableSnippets: true

    # Original: controller.wallarm.postanalytics, wcliPostanalytics, wallarm-appstructure
    postanalytics:
      replicaCount: 1

      # Original: controller.wallarm.postanalytics.resources
      resources:
        limits:
          cpu: 2000m
          memory: 4096Mi
        requests:
          cpu: 500m
          memory: 2048Mi

      # Original: controller.wallarm.wcliPostanalytics.resources
      wcli:
        resources:
          limits:
            cpu: 2000m
            memory: 400Mi
          requests:
            cpu: 1500m
            memory: 200Mi

      # Original: controller.wallarm.wallarm-appstructure.resources
      appstructure:
        resources:
          limits:
            cpu: 2000m
            memory: 1200Mi
          requests:
            cpu: 1000m
            memory: 600Mi

    # Prometheus metrics
    prometheus:
      create: true

    # Original: nameOverride
    nameOverride: wlrm-common

    # ============================================================================
    # SETTINGS THAT COULD NOT BE MIGRATED (review required):
    # ============================================================================
    #
    # 1. defaultBackend - The new chart doesn't have a defaultBackend section.
    #    Original settings:
    #      defaultBackend:
    #        enabled: true
    #        name: wlrm-common-default-backend
    #        resources:
    #          limits:
    #            cpu: 1
    #            memory: 400Mi
    #          requests:
    #            cpu: 50m
    #            memory: 200Mi
    #    Action: Deploy default backend separately or check if new chart supports it
    #
    # 2. controller.wallarm.wallarm-antibot - No direct mapping found in new chart
    #    Original settings:
    #      wallarm-antibot:
    #        resources:
    #          limits:
    #            cpu: 200m
    #            memory: 512Mi
    #          requests:
    #            cpu: 100m
    #            memory: 256Mi
    #    Action: Check if antibot is now integrated differently or deprecated
    #
    # 3. controller.stats.enabled - No direct mapping (metrics handles this now)
    #
    # 4. controller.metrics.annotations - Now handled via prometheus section
    #
    # 5. controller.watchIngressWithoutClass - Behavior may be controlled by
    #    ingressClass.setAsDefaultIngress in new chart
    #
    # ============================================================================
    ```

1. (Optional) If you plan to use Custom Resources (for example, `VirtualServer`, `VirtualServerRoute`, `TransportServer`), install the CRDs before deploying the controller:

    ```bash
    kubectl apply -f <NGINX_IC_CRDS_MANIFEST>
    ```

1. Deploy the new controller in the same namespace as the old one (`kube-system`): 

    !!! info "New release name"
        Use a different Helm release name for the new controller to avoid overwriting the old one.

    ```bash
    helm upgrade --install <NEW_RELEASE_NAME> wallarm/wallarm-ingress \
      --version <NEW_CHART_VERSION> \
      -n <NAMESPACE> --create-namespace \
      -f values-new.yaml
    ```

    This installs the new Wallarm Ingress Controller without affecting the existing one, allowing a safe migration.

1. Validate the new controller.

    Check that the new pods are running:

    ```bash
    kubectl -n <NAMESPACE> get pods -l app.kubernetes.io/instance=<NEW_RELEASE_NAME>,app.kubernetes.io/component=controller
    kubectl -n <NAMESPACE> describe pod <NEW_CONTROLLER_POD_NAME>
    ```

    Also check the new controller using the [following checklist](https://docs.wallarm.com/admin-en/uat-checklist-en/).

The next step differs depending on your deployment type.

### Step 2. Traffic migration

**(Option A) Gradual migration behind an external load balancer**

1. Migrate application routing to the new controller:

    * Create new Ingress resources (or use Custom Resources such as `VirtualServer` and `VirtualServerRoute`) targeting the new IngressClass.
    * Update annotations and configuration to match the new controller.
    * Implement explicit catch-all routing if required.

1. Shift traffic at the external load balancer from the old controller endpoints to the new controller endpoints. The exact procedure depends on your load balancer implementation.
1. When traffic is fully drained and stable, uninstall the old controller:

    ```bash
    helm -n <NAMESPACE> uninstall <OLD_RELEASE_NAME>
    ```

**(Option B) Swap (cutover) migration** 

1. Prepare application routing for the new controller:

    * Set `spec.ingressClassName` to the new class.
    * Update annotations and configuration to match the new controller.
    * Ensure required host configuration and explicit catch-all routing (if needed).

1. Perform the cutover by switching the external entrypoint to the new controller (load balancer or DNS). The exact procedure depends on your infrastructure.
   
    If your provider supports static IP reuse, preconfigure the new controller Service accordingly (for example, via `controller.service.loadBalancerIP` in `values-new.yaml`).

4. After the cutover is confirmed, uninstall the old controller:

  ```bash
    helm -n <NAMESPACE> uninstall <OLD_RELEASE_NAME>
  ```