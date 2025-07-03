For proper traffic routing for analysis and forwarding, you need to define the Wallarm Node and backend hosts in the Fastly service configuration:

1. Go to **Fastly** UI → **Compute** → **Compute services** → Wallarm service → **Edit configuration**.
1. Go to **Origins** and **Create hosts**:

    * Add the Wallarm node URL as the `wallarm-node` host to route traffic to the Wallarm node for analysis.
    * Add your backend address as another host (e.g., `backend`) to forward traffic from the node to your origin backend.

    ![](../../images/waf-installation/gateways/fastly/hosts.png)
1. **Activate** the new service version.
