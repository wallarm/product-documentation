[old-ic]:                   https://github.com/kubernetes/ingress-nginx
[new-ic]:                   https://github.com/nginx/kubernetes-ingress
[whats-new]:                ../updating-migrating/what-is-new.md
[new-IC-installation]:      ../admin-en/installation-kubernetes-en.md
[new-IC-configuration]:     ../admin-en/configure-kubernetes-en.md
[IC-retirement]:            ../updating-migrating/nginx-ingress-retirement.md
[old-IC-maintenance]:        ../updating-migrating/nginx-ingress-retirement.md#wallarms-nginx-based-ingress-controller-support-timeline


# Migrating From the Community‑Based to F5‑Based Wallarm Ingress Controller

This topic explains why and how to migrate from the Wallarm Ingress Controller based on the [Community Ingress NGINX][old-ic] to the new controller based on [F5 NGINX Ingress Controller][new-ic].

## Why the migration is required

Previously, Wallarm provided an Ingress Controller based on the [Community Ingress NGINX][old-ic].

In November 2025, the Kubernetes community announced the [retirement][IC-retirement] of this project due to growing maintenance challenges and unresolved technical issues.

Wallarm will fully support this controller (including new feature releases) until **March 2026**. After that date, the controller will [remain functional][old-IC-maintenance] but will no longer receive updates, bug fixes, or security patches.

**Continuing to use it after March 2026 may expose your environment to unresolved defects and security vulnerabilities.**

To ensure ongoing support and security, we strongly recommend migrating to a supported deployment option, such as the Wallarm Ingress Controller based on the [F5 NGINX Ingress Controller][new-ic]. The sections below describe the migration steps and their benefits.

## About the new Ingress Controller

The new Wallarm Ingress Controller is based on the [F5 NGINX Ingress Controller][new-ic] and is the recommended replacement for the [Community NGINX-based deployment][old-ic].

It provides long-term stability, vendor-backed support, regular updates and security patches, and advanced traffic management.

For a detailed overview of the changes and new features, [see the What's New guide][whats-new].

!!! info "NGINX Plus is not supported"
    The Wallarm Ingress Controller uses the **open-source** edition of the F5 NGINX Ingress Controller. NGINX Plus is not included and is not supported.

## Choosing your migration strategy

You can migrate to the new Wallarm Ingress Controller using one of four strategies. The appropriate option depends on your infrastructure, IP requirements, and tolerance for downtime.

Review the summary table below to determine which approach best fits your environment. Detailed descriptions of each strategy follow.

| Strategy | Downtime | IP changes | Complexity | Best for | Est. time |
|----------|----------|-------------|------------|----------|----------|
| Load balancer | None | No | High | Environments with an external load balancer | 4–8 hours (includes staged rollout and monitoring) |
| DNS switch | None (DNS propagation applies) | Yes | Low | Environments where IP changes are acceptable | 3–4 hours plus DNS propagation time (depends on your TTL setting) |
| Selector swap | None | No | Medium | Production environments with strict IP requirements | 4–6 hours |
| Direct replacement | 5-15 minutes | Yes | Low | Development and staging environments | 2–3 hours (including the downtime window) |

!!! info "Recommendation"
    If unsure, use [selector swap](#strategy-c---selector-swap) for production environments and [direct replacement](#strategy-d---direct-replacement) for development or staging.

## Migration - part 1 (strategy independent)

This part of the migration includes steps that are **common to all strategies**. Completing these steps ensures a safe foundation before proceeding to strategy-specific traffic migration.

### Prerequisites

Before starting the migration, ensure the following components meet the minimum version requirements:

* Kubernetes CLI (kubectl) – v1.25+
* Helm – v3.10+
* cURL – 7.x+ (usually pre-installed on Linux/macOS)
* Basic shell utilities – grep, sed, awk

!!! info "Manual migration"
    These tools are required if you are migrating manually. CI/CD pipelines or automation tools (ArgoCD, Flux, Terraform) may already provide these capabilities. For CI/CD environments:

      * Ensure your runner/agent has kubectl and helm installed.
      * Verify kubeconfig access to the target cluster.
      * Consider using dedicated migration pipelines for better control and auditability.

Additionally, you need these **access and permissions**:

* **Namespace administration** – Can create, modify, and delete resources in target namespaces.
* **Wallarm API token** – Get it from the Wallarm Console (Settings → API tokens).
* **DNS management access** (required for strategies [B](#strategy-b---dns-switch) and [D](#strategy-d---direct-replacement)) – Ability to create/update A/CNAME records.
* **Load balancer access** (required for [strategy A](#strategy-a---load-balancer-traffic-splitting) – Access to your external load balancer configuration.
* **Monitoring/metrics access** – Ability to view logs and metrics.

### Step 0. Collect current Ingress deployment details and validate environment

Before starting the migration, gather the following information from your existing Ingress Controller deployment and complete basic environment validations. 

1. Gather deployment information and save it - you will need it throughout the migration:

    ```bash
    # 1. Identify the namespace of the current Ingress Controller
    kubectl get pods --all-namespaces | grep ingress
    # Note the namespace name (usually 'ingress-nginx')

    # 2. Record the current LoadBalancer external IP
    kubectl get svc -n <ingress-namespace> -o wide
    # Note the value in the EXTERNAL-IP column

    # 3. List all domains and hostnames handled by Ingress
    kubectl get ingress --all-namespaces -o jsonpath='{.items[*].spec.rules[*].host}' | tr ' ' '\n' | sort -u
    # Save this list

    # 4. Identify the Wallarm API endpoint in use
    kubectl get configmap -n <ingress-namespace> -o yaml | grep -i wallarm
    # Typical values: api.wallarm.com (US), api.wallarm.eu (EU), or us1.api.wallarm.com

    # 5. Determine the current Helm release name
    helm list -A | grep ingress
    # Note the release name (usually 'ingress-nginx')
    ```

1. Perform pre-flight validations.

    Complete these checks to verify the cluster and environment are ready for migration:

    * Back up all Ingress resources:

      ```bash
      kubectl get ingress --all-namespaces -o yaml > backup-ingresses-$(date +%Y%m%d).yaml
      echo "Backup saved to: backup-ingresses-$(date +%Y%m%d).yaml"
      ```

    * Export current Helm configuration:

      ```bash
      helm list -A | grep ingress  # Find your release name
      helm get values <release-name> -n <namespace> > backup-helm-values-$(date +%Y%m%d).yaml
      ```

    * Document current load balancer IP (critical for rollback):

      ```bash
      kubectl get svc -n <ingress-namespace> -o jsonpath='{.items[?(@.spec.type=="LoadBalancer")].status.loadBalancer.ingress[0].ip}'
      ```

    * Verify cluster resources:

      ```bash
      kubectl top nodes
      # Check: CPU < 70%, Memory < 80% on all nodes
      ```

    * Test Wallarm Console access. 
    
        To do so, log in to https://my.wallarm.com (or your regional console)
      
    * Reduce DNS TTL (critical for strategies [B](#strategy-b---dns-switch) and [D](#strategy-d---direct-replacement)) - Lower TTL 24-48 hours before migration:

      ```bash
      # Check current TTL
      dig your-domain.com | grep -A 1 "ANSWER SECTION"
      # Look for the number before IN A (that's your TTL in seconds)

      # Recommended: Set TTL to 300 seconds (5 minutes) before migration
      # This allows faster DNS propagation during the migration
      # Update in your DNS provider (Route53, Cloudflare, etc.)

      # After migration is stable (48h+), you can increase TTL back to normal (3600 or higher)
      ```

1. Identify a maintenance window:

    * Production: Prefer low-traffic period (e.g., weekends or off-hours)
    * Development and staging environments: Flexible, anytime is acceptable

1. Notify stakeholders about the following:

    * Migration schedule
    * Expected duration
    * Potential risks
    * Rollback plan

### Step 1: Review the new Ingress Controller documentation

1. [Read the comparison guide][whats-new] to understand the differences between the previous and new Ingress Controller implementations:

    Pay special attention to:

    * Annotation prefix changes (nginx.ingress.kubernetes.io/ → nginx.org/)
    * Postanalytics architecture (always deployed as a separate component in the new version)
    * New CRD capabilities: `VirtualServer`, `Policy`, `TransportServer`
    * Service selector differences
    * Load balancer IP preservation considerations

1. Read the new [Ingress Controller deployment guide][new-IC-installation] and the [installation parameters][new-IC-configuration].

    Key configuration areas include:

    * Wallarm API credentials (`config.wallarm.api.host`, `config.wallarm.api.token`)
    * API Firewall configuration (optional)
    * Resource limits and scaling
    * Metrics and monitoring endpoints

### Step 2: Deploy the new Controller

1. Deploy the new controller.

    Deploy the new Ingress Controller in your cluster using the provided `values.yaml` file:

    ```bash
    # Add the Wallarm Helm repository
    helm repo add wallarm https://charts.wallarm.com/
    helm repo update

    ## TODO: Replace with the actual release name when available 
    helm install wallarm-ingress-new wallarm/wallarm-ingress \
      -n wallarm-ingress-new \
      --create-namespace \
      -f values.yaml
    ```

    !!! info "IngressClass name"
        Use a different IngressClass name (e.g., `nginx-new`) to run the new controller alongside the old one during migration.

1. Verify the Ingress Controller deployment in Kubernetes:

    ```bash
    # Check controller pods
    kubectl get pods -n wallarm-ingress-new

    # Check Wallarm WCLI logs for cloud connectivity and errors
    kubectl logs -n wallarm-ingress-new deployment/wallarm-ingress-controller \
      -c wallarm-wcli --tail=50 | grep -i "sync\|connect\|error"

    # Check Postanalytics logs
    kubectl logs -n wallarm-ingress-new deployment/wallarm-ingress-postanalytics --tail=50
    ```

1. Verify the new Ingress Controller in the Wallarm Console.

    To do so, go to Wallarm Console → **Settings** → **Nodes** and check if the new Ingress Controller node appears. It should show up within 2–3 minutes of deployment.

If all checks pass, you are ready to proceed to Step 3.

### Step 3. Prepare your Ingress resources

Collect all Ingress resources that use the old Ingress Controller:

* **Simple method (no jq required)**:

    ```bash
    # List all Ingress resources across all namespaces
    kubectl get ingress --all-namespaces

    # Export all Ingress resources to a backup file
    kubectl get ingress --all-namespaces -o yaml > old-ingresses-backup.yaml
    echo "✅ Backup saved to: old-ingresses-backup.yaml"

    # Count the total number of Ingress resources
    kubectl get ingress --all-namespaces --no-headers | wc -l
    ```

* **Advanced method (requires jq – a JSON processor)**:

    ```bash
    # Filter only Ingress resources using the old controller
    # Breakdown:
    #   kubectl get ingress --all-namespaces -o json  → Get all Ingress as JSON
    #   jq '.items[]'                                  → Loop through each Ingress
    #   select(...)                                    → Filter by IngressClass
    kubectl get ingress --all-namespaces \
      -o json | jq '.items[] | select(
        .metadata.annotations["kubernetes.io/ingress.class"] == "nginx" or
        .spec.ingressClassName == "nginx" or
        (.metadata.annotations["kubernetes.io/ingress.class"] // "" | length == 0)
      )' > old-ingresses.json
    ```

!!! info "Default Ingress Controller"
    Ingress resources without an explicit IngressClass may be using the default ingress controller. Verify which controller is set as default: `kubectl get ingressclass -o yaml`.


### Step 4. Convert annotations

Update your Ingress resources to ensure compatibility with the new Ingress Controller.

1. Update `IngressClass`

    Change the IngressClass to match the new controller:

    ```yaml
    # Old
    metadata:
      annotations:
        kubernetes.io/ingress.class: nginx

    # New
    metadata:
      annotations:
        kubernetes.io/ingress.class: nginx-new
    ```

1. Update controller-specific annotations

    Modify annotations that use the old NGINX prefix to the new format:

    ```yaml
    # Old
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /$2
      nginx.ingress.kubernetes.io/ssl-redirect: "true"

    # New
    annotations:
      nginx.org/rewrites: "serviceName=myservice rewrite=/$2"
      nginx.org/redirect-to-https: "true"
    ```

1. Wallarm annotations

    Wallarm-related Annotations remain unchanged and continue to function with the new controller:

    ```yaml
    annotations:
      nginx.org/wallarm-mode: "block"
      nginx.org/wallarm-application: "1"
      nginx.org/wallarm-parse-response: "on"
    ```

### Step 5. Test converted Ingress resources

Before migrating production traffic, verify your converted Ingress resources in a test namespace.

1. Apply test Ingress:

    ```bash
    kubectl apply -f test-ingress-new.yaml -n test-namespace  
    ```

    If this step was successful, you will see:

    ```bash
    ingress.networking.k8s.io/test-ingress created
    ```

    or

    ```bash
    ingress.networking.k8s.io/test-ingress configured
    ```

    if you are updating an existing Ingress.

1. Check the NGINX configuration generated by the new controller:

    ```bash
    kubectl exec -n wallarm-ingress-new deployment/wallarm-ingress-controller \
      -- nginx -T | grep -A 20 "server_name test.example.com"
    ```

    `server_name test.example.com` in the output confirms the domain is configured correctly.

1. Test HTTP Connectivity.

    Get the new load balancer IP:

    ```bash
    NEW_LB_IP=$(kubectl get svc -n wallarm-ingress-new wallarm-ingress-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

    echo "New LoadBalancer IP: $NEW_LB_IP"
    ```

    and then test HTTP or HTTPS connectivity:

    ```bash
    # HTTP
    curl -H "Host: test.example.com" http://$NEW_LB_IP/
    # HTTPS
    curl -H "Host: test.example.com" https://$NEW_LB_IP/
    ```

    Expected outcome:

    * The HTTP response status is 200 OK.
    * Your application responds correctly, e.g.:
        * The homepage HTML is returned as expected.
        * API endpoints return the expected JSON or other responses.

1. Test Wallarm protection.

    Simulate a malicious request:

    ```bash
    curl -H "Host: test.example.com" "http://$NEW_LB_IP/?id=1' OR '1'='1"
    ```

    Wait 2–3 minutes and verify in Wallarm Console → **Events** → **Attacks** that the request is detected/blocked.

1. (Optional) Test using a local browser.

    If you want to test real domain names without changing DNS:

    ```bash
    # Get the new load balancer IP
    NEW_LB_IP=$(kubectl get svc -n wallarm-ingress-new wallarm-ingress-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    echo $NEW_LB_IP

    # Add mapping to /etc/hosts (macOS/Linux)
    sudo bash -c "echo '$NEW_LB_IP your-actual-domain.com' >> /etc/hosts"

    # For Windows, edit: C:\Windows\System32\drivers\etc\hosts
    # Add: <IP> your-actual-domain.com

    # Access domain in browser: https://your-actual-domain.com
    # Your browser will use the new controller instead of the old one

    # IMPORTANT: Remove this entry after testing!
    sudo sed -i '' '/your-actual-domain.com/d' /etc/hosts  # macOS
    sudo sed -i '/your-actual-domain.com/d' /etc/hosts     # Linux
    ```

    This allows you to test the new controller locally using real domain names before performing the DNS switch.

Congratulations! You have completed the strategy-independent portion of the migration. All common preparation, deployment, annotation conversion, and testing steps are now done.

The next phase, Migration Part 2, involves strategy-specific steps for shifting traffic to the new Ingress Controller. The procedure will differ depending on whether you are using [load balancer](#strategy-a---load-balancer-traffic-splitting), [DNS switch](#strategy-b---dns-switch), [selector swap](#strategy-c---selector-swap), or [direct replacement](#strategy-d---direct-replacement). 

## Migration - part 2 (strategy dependent)

This part of the migration covers steps that vary depending on the migration strategy you selected: [load balancer](#strategy-a---load-balancer-traffic-splitting), [DNS switch](#strategy-b---dns-switch), [selector swap](#strategy-c---selector-swap), or [direct replacement](#strategy-d---direct-replacement). 

### Strategy A - load balancer (traffic splitting)

This method uses an external load balancer (F5, HAProxy, cloud ALB, etc.) to gradually shift traffic from the old controller to the new one.

**Migration steps:**

1. Configure your external load balancer to split traffic:

    ```nginx
    # Example: NGINX upstream configuration
    upstream wallarm_ingress {
        server <old-lb-ip>:443 weight=100;  # Start: 100% to old
        server <new-lb-ip>:443 weight=0;    # Start: 0% to new
    }
    ```

1. Gradually adjust traffic weights:

    ```
    Phase 1: 90/10 (old/new) → Monitor for 2-4 hours
    Phase 2: 75/25           → Monitor for 2-4 hours
    Phase 3: 50/50           → Monitor for 4-8 hours
    Phase 4: 25/75           → Monitor for 2-4 hours
    Phase 5: 0/100           → Complete migration
    ```

1. Monitor during each phase:

    ```bash
    # Watch resource usage on both controllers
    kubectl top pods -n ingress-nginx
    kubectl top pods -n wallarm-ingress-new

    # Check for HTTP errors
    kubectl logs -n wallarm-ingress-new deployment/wallarm-ingress-controller \
      | grep -E "HTTP/[0-9.]+ (4|5)[0-9]{2}"
    ```

1. Complete migration by removing the old controller.

    Once 100% of traffic is routed to the new controller and all metrics are stable, you can safely remove the old controller.

### Strategy B - DNS switch

This method deploys the new controller with a new load balancer IP and updates DNS to point to it.

**Migration steps:**

1. Get the new load balancer IP:

    ```bash
    NEW_LB_IP=$(kubectl get svc -n wallarm-ingress-new wallarm-ingress-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    echo "New LoadBalancer IP: $NEW_LB_IP"
    ```

1. Update Ingress resources to use the new controller:

    ```bash
    # Update all Ingress resources in the target namespace
    kubectl get ingress -n <namespace> -o yaml | \
      sed 's/kubernetes.io\/ingress.class: nginx/kubernetes.io\/ingress.class: nginx-new/' | \
      kubectl apply -f -
    ```

1. Test the new setup:

    ```bash
    # Test HTTP connectivity directly against the new IP
    curl -H "Host: your-domain.com" http://$NEW_LB_IP/

    # Test with attack simulation
    curl -H "Host: your-domain.com" "http://$NEW_LB_IP/test?id=1' OR '1'='1"
    ```

1. Verify in Wallarm Console that attacks are detected.
1. Update DNS records to point to the new IP:

    ```bash
    # Example using AWS Route53:
    aws route53 change-resource-record-sets \
      --hosted-zone-id <zone-id> \
      --change-batch '{
        "Changes": [{
          "Action": "UPSERT",
          "ResourceRecordSet": {
            "Name": "your-domain.com",
            "Type": "A",
            "TTL": 300,
            "ResourceRecords": [{"Value": "'$NEW_LB_IP'"}]
          }
        }]
      }'
    ```

1. Monitor DNS propagation and traffic:

    ```bash
    # Check DNS resolution
    dig +short your-domain.com
    nslookup your-domain.com

    # Monitor logs and traffic on the new controller
    kubectl logs -n wallarm-ingress-new deployment/wallarm-ingress-controller -f
    ```

1. Wait for DNS TTL to expire while monitoring the old controller for declining traffic.
1. After 24–48 hours, remove the old Ingress Controller once all traffic has migrated.

### Strategy C - Selector Swap

This method preserves the existing load balancer IP by switching the Kubernetes service selector from the old controller pods to the new ones.

!!! info "Recommended timing"
    Perform the migration during a low-traffic window (e.g., Saturday morning).

**Migration steps:**

1. Get the current load balancer IP:

    ```bash
    OLD_LB_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    echo "Current LoadBalancer IP (must preserve): $OLD_LB_IP"
    ```

1. Update your values file (e.g., `values-same-namespace.yaml`) with the following configuration:

    ```yaml
    controller:
      podLabels:
        app.kubernetes.io/name: nginx-ingress-new
        app.kubernetes.io/instance: wallarm-new
        app.kubernetes.io/component: controller-new

      service:
        create: false  # Critical: Do not create a new LoadBalancer Service

      ingressClass: nginx-new

    config:
      wallarm:
        api:
          host: "api.wallarm.com"  # or api.wallarm.eu
          token: "YOUR_TOKEN"
    ```

1. Deploy the new Ingress Controller in the **same namespace as the old controller** using the updated values file:

    ```bash
    helm install wallarm-ingress-new wallarm/wallarm-ingress \
      -n ingress-nginx \
      -f values-same-namespace.yaml
    ```

1. Verify no new `LoadBalancer` service was created:

    ```bash
    kubectl get svc -n ingress-nginx
    # Only the OLD LoadBalancer Service should be visible
    ```

1. Verify new pods are running:

    ```bash
    kubectl get pods -n ingress-nginx -l app.kubernetes.io/instance=wallarm-new
    ```

1. Test new controller pods directly:

    ```bash
    NEW_POD=$(kubectl get pod -n ingress-nginx \
      -l app.kubernetes.io/instance=wallarm-new \
      -o jsonpath='{.items[0].metadata.name}')

    kubectl port-forward -n ingress-nginx $NEW_POD 8080:80 &
    curl -H "Host: your-domain.com" http://localhost:8080/
    killall kubectl  # Stop port-forward
    ```

1. Update Ingress resources to use the new controller and ensure traffic is routed correctly after the selector swap:

    ```bash
    kubectl patch ingress <ingress-name> -n <namespace> \
      -p '{"metadata":{"annotations":{"kubernetes.io/ingress.class":"nginx-new"}}}'
    ```

    !!! info "Important"
        The next steps switch traffic from the old controller to the new one. Verify all previous steps before proceeding.

1. Check the labels of the new controller pods. You will need them later to update the service selector:

    ```bash
    kubectl get pods -n ingress-nginx \
      -l app.kubernetes.io/instance=wallarm-new \
      --show-labels
    ```
    
    Example output:

    ```bash
    # NAME                           LABELS
    # wallarm-new-abc123             app.kubernetes.io/name=nginx-ingress-new,app.kubernetes.io/instance=wallarm-new,...
    ```

1. Update the `LoadBalancer` service to point to the new pods:

    ```bash
    kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{
      "spec": {
        "selector": {
          "app.kubernetes.io/name": "nginx-ingress-new",
          "app.kubernetes.io/instance": "wallarm-new",
          "app.kubernetes.io/component": "controller-new"
        }
      }
    }'
    ```

    Where:

    * `kubectl patch` - Updates an existing resource without replacing it entirely.
    * `svc ingress-nginx-controller` - The service name (your existing load balancer).
    * `-n ingress-nginx` - The namespace where the service exists.
    * `-p '{ "spec": { "selector": {...} } }'` - JSON patch to update the selector.
    * The selector labels MUST match your new controller pod labels exactly.

    Expected outcome:
  
    ```bash
    service/ingress-nginx-controller patched
    ```
  
    This confirms that the service selector was updated successfully and traffic will now be routed to the new controller pods.

1. Verify IP preservation:

    ```bash
    NEW_LB_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    echo "LoadBalancer IP after switch: $NEW_LB_IP"

    if [ "$OLD_LB_IP" == "$NEW_LB_IP" ]; then
      echo "✅ IP preserved successfully!"
    else
      echo "❌ IP changed - ROLLBACK IMMEDIATELY"
    fi
    ```

1. Monitor traffic on the new controller:

    ```bash
    # Watch logs on the new controller
    kubectl logs -n ingress-nginx -l app.kubernetes.io/instance=wallarm-new -f

    # Check metrics
    kubectl exec -n ingress-nginx \
      deployment/wallarm-ingress-new-controller \
      -c wallarm-wcli -- wcli metric
    ```

1. After validation period (24–48 hours), scale down the old controller:

    ```bash
    # Scale to zero (keeps configuration for potential rollback)
    kubectl scale deployment -n ingress-nginx \
      ingress-nginx-controller --replicas=0
    ```      

1. After an additional 24 hours of stable traffic, delete the old controller:

    ```bash
    helm uninstall ingress-nginx -n ingress-nginx
    ```

    !!! info "Recommended cleanup"
        After the migration has been stable for 30+ days, schedule a maintenance window to properly clean up the setup (see the steps below). This ensures the service is owned and managed by the new Helm chart. It also simplifies future upgrades and prevents operational confusion.

1. Create a new `LoadBalancer Service` managed by the new Helm chart:

    ```
    helm upgrade wallarm-ingress-new wallarm/wallarm-ingress \
      -n ingress-nginx \
      --set controller.service.create=true \
      --set controller.service.loadBalancerIP="<YOUR_CURRENT_IP>" \
      -f values.yaml
    ```

1. Wait for new load balancer to be assigned the same IP (cloud-provider dependent; typically takes 1–5 minutes).
1. Delete the old service:

    ```
    kubectl delete svc ingress-nginx-controller -n ingress-nginx
    ```

1. Verify that the new service has the same IP:

    ```
    kubectl get svc -n ingress-nginx
    ```

### Strategy D - direct replacement   

This method removes the old controller and deploys the new one in its place.

**Migration steps:**

!!! info "Recommendation"
    For major cloud providers, we strongly recommend reserving the load balancer IP **before** migration to prevent IP changes. See steps 1 and 2 in the procedure below.

1. Allocate or reserve a static public IP, depending on your cloud provider:

    === "AWS (NLB + Elastic IP)"
        ```
        EIP_ALLOC=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
        EIP=$(aws ec2 describe-addresses --allocation-ids $EIP_ALLOC --query 'Addresses[0].PublicIp' --output text)
        echo "Reserved EIP: $EIP (Allocation: $EIP_ALLOC)"
        ```
    === "GCP"
        ```
        gcloud compute addresses create wallarm-ingress-ip \
          --region <your-region>

        STATIC_IP=$(gcloud compute addresses describe wallarm-ingress-ip \
          --region <your-region> --format="value(address)")
        echo "Reserved IP: $STATIC_IP"
        ```
    === "Azure"
        ```
        az network public-ip create \
          --resource-group <resource-group> \
          --name wallarm-ingress-ip \
          --sku Standard \
          --allocation-method Static

        STATIC_IP=$(az network public-ip show \
          --resource-group <resource-group> \
          --name wallarm-ingress-ip \
          --query ipAddress \
          --output tsv)
        echo "Reserved IP: $STATIC_IP"
        ```

1. Deploy the new controller with the reserved IP:

    === "AWS (NLB + Elastic IP)"
        ```
        # In your values.yaml:
        controller:
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
              service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "<EIP_ALLOC>"
        ```
    === "GCP"
        ```
        # In your values.yaml:
        controller:
          service:
            loadBalancerIP: "<STATIC_IP>"
            annotations:
              cloud.google.com/load-balancer-type: "External"    
        ```
    === "Azure"
        ```
        # In your values.yaml:
        controller:
          service:
            loadBalancerIP: "<STATIC_IP>"
            annotations:
              service.beta.kubernetes.io/azure-load-balancer-resource-group: "<resource-group>"    
        ```

1. Back up the current configuration:

    ```bash
    # Export all Ingress resources
    kubectl get ingress --all-namespaces -o yaml > ingress-backup.yaml

    # Export current controller Helm values
    helm get values ingress-nginx -n ingress-nginx > old-values-backup.yaml
    ```

1. Prepare converted Ingress resources:

    * Update all IngressClass annotations as described in [Step 4](#step-4-convert-annotations).
    * Update annotation prefixes.
    * Save the updated resources to `new-ingresses.yaml`.

1. Schedule a maintenance window and notify users about the expected downtime.
1. Delete the old controller:

    ```bash
    # Downtime begins here
    helm uninstall ingress-nginx -n ingress-nginx

    # Verify resources are removed
    kubectl get pods -n ingress-nginx
    ```

1. Install the new controller immediately:

    ```bash
    helm install wallarm-ingress wallarm/wallarm-ingress \
      -n wallarm-ingress \
      --create-namespace \
      -f new-values.yaml

    # Wait for pods to become ready
    kubectl wait --for=condition=ready pod \
      -l app.kubernetes.io/name=nginx-ingress \
      -n wallarm-ingress \
      --timeout=300s
    ```

1. Apply the converted Ingress resources:

    ```bash
    kubectl apply -f new-ingresses.yaml
    ```

1. Verify that services are accessible:

    ```bash
    NEW_LB_IP=$(kubectl get svc -n wallarm-ingress wallarm-ingress-controller \
      -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

    # Test each domain
    curl -H "Host: app1.example.com" http://$NEW_LB_IP/
    curl -H "Host: app2.example.com" http://$NEW_LB_IP/
    ```

1. Update DNS records to point to the new load balancer IP (if not pre-reserved).
1. Test attack detection:

    ```bash
    # Test attack detection
    curl -H "Host: app1.example.com" "http://$NEW_LB_IP/?id=1' OR '1'='1"
    ```

1. Verify in Wallarm Console that attacks are detected.
