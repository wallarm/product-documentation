# Compilation and Update of Security Rules

To analyze requests and detect attacks, the filtering node relies on the LOM (Local Object Module), which contains specially formatted rules from application profiles. Data in the LOM file is optimized to accelerate request analysis.

!!! warning "Changes in the analysis rules are not applied instantly"
    Before the rules can be applied, they need to be processed which means
    
    * The LOM file is compiled
    * The newly compiled version of the LOM is downloaded from the Wallarm Cloud to every Wallarm Node

The process of compiling the LOM typically takes from a few minutes for the simple application to up to an hour for resources with complex structures. Monitoring the progress of LOM assembly is currently unavailable, although it is on our roadmap. One indicator of the LOM processing progress is when and how it gets downloaded to the filter nodes. This information is accessible from the *Nodes* tab.

The LOM downloads happen during filter nodes with Wallarm Cloud synchronization. This synchronization is launched every 2‑4 minutes. [More details on the WAF node and Wallarm Cloud synchronization configuration →](../../admin-en/configure-cloud-node-synchronization-en.md)

You can verify the status of LOM downloads in the log found at `/var/log/wallarm/syncnode.log`.
