1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Add connector**.
1. Specify the node deployment settings:

    * **Regions**: select one or more regions to deploy the Wallarm node for the connector. We recommend choosing regions close to where your APIs or applications are deployed. Multiple regions improve geo-redundancy by balancing the load if an instance becomes unavailable.
    * **Filtration mode**: [traffic analysis mode][filtration-mode-docs].
    * **Application**: general application ID. In Wallarm, applications help identify and organize parts of your infrastructure (e.g., domains, locations, instances).
    
        Each node requires a general application ID, with the option to assign specific IDs for locations or instances.
    
    * **Allowed hosts**: specify which hosts the node will accept and analyze traffic from.
    * **Location configuration**: assign unique application IDs to specific hosts and locations, if needed.
1. Once saved, it will take 3-5 minutes for Wallarm to deploy and configure the node for the connector.

    The status will change from **Pending** to **Active** when deployment is complete.
1. Copy the node endpoint as you will need it later to route traffic from your platform.

![!][se-connector-setup-img]