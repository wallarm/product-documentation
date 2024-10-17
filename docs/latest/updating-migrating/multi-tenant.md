[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png

# Upgrading the multi-tenant node

These instructions describe the steps to upgrade the multi-tenant node 4.x up to 5.0.

To upgrade the end‑of‑life multi-tenant node (3.6 or lower), please use the [different instructions](older-versions/multi-tenant.md).

## Requirements

* Execution of further commands by the user with the **Global administrator** role added under the [technical tenant account](../installation/multi-tenant/overview.md#tenant-accounts)
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall
* Access to the IP addresses below for downloading updates to attack detection rules and API specifications, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers.

    --8<-- "../include/wallarm-cloud-ips.md"

## Follow standard upgrade procedure

Standard procedures are the ones for:

* [Upgrading Wallarm from DEB/RPM packages](nginx-modules.md)
* [Upgrading Wallarm with all-in-one installer](nginx-modules.md)
* [Upgrading the postanalytics module](separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX-based image](docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
* [Upgrading Sidecar proxy](sidecar-proxy.md)
* [Upgrading the cloud node image](cloud-image.md)

!!! warning "Creating the multi-tenant node"
    During the Wallarm node creation, please select the **Multi-tenant node** option:

    ![Multi-tenant node creation](../images/user-guides/nodes/create-multi-tenant-node.png)

