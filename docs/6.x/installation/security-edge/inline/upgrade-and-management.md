# Managing Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

You can manage your Security Edge Inline deployment in the Wallarm Console, including updating configuration settings, upgrading node versions, monitoring deployment statuses, and deleting the deployment.

## Statuses

The Edge node section provides real-time statuses of the deployment and configuration state for your origins, hosts, and regions:

=== "Hosts"
    ![!](../../../images/waf-installation/security-edge/inline/host-statuses.png)
=== "Origins"
    ![!](../../../images/waf-installation/security-edge/inline/origin-statuses.png)
=== "Regions"
    ![!](../../../images/waf-installation/security-edge/inline/region-statuses.png)
=== "Nodes"
    The **Nodes** tab provides technical details for each Edge node. This view is primarily for Wallarm Support to assist in troubleshooting. The number of nodes depends on traffic demand and is managed automatically by Wallarm's autoscaling.

    ![!](../../../images/waf-installation/security-edge/inline/nodes-tab.png)

* **Pending cert CNAME**: Waiting for the certificate CNAME records to be added to DNS for certificate issuance (if applicable).
* **Pending traffic CNAME**: The deployment is complete, awaiting the addition of the traffic CNAME or proxy target record to route traffic to the Edge node.
* **Deploying**: The Edge node is currently being set up and will be available soon.
* **Active**: The Edge node is fully operational and filtering traffic as configured.
* **Cert CNAME error**: There was an issue verifying the certificate CNAME in DNS. Please check that the CNAME is correctly configured (if applicable).
* **Deployment failed**: The Edge node deployment did not succeed, e.g. due to the certificate CNAME not added within 14 days. Check configuration settings and try to redeploy or contact the [Wallarm Support team](https://support.wallarm.com) to get help.
* **Degraded**: The Edge node is active in the region but may have limited functionality or be experiencing minor issues. Please contact the [Wallarm Support team](https://support.wallarm.com) to get help.

RPS and request amount per hosts and origins are returned starting from the [version](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer) 5.3.0.

## Upgrading the Edge Inline

When **Auto update** is enabled in **Admin settings**, the Edge node is automatically upgraded as soon as a new minor or patch version is released (depending on the selected option). All your initial settings are preserved. Auto update is off by default.

![!](../../../images/waf-installation/security-edge/inline/admin-settings.png)

To manually upgrade the Edge node, go to **Configure** → **Admin settings** and select a version from the list. Using the latest version is recommended for optimal performance and security.

Upgrading to a new major version can only be done manually.

For the changelog of versions, refer to the [article](../../../updating-migrating/node-artifact-versions.md#all-in-one-installer). The Edge node version follows the `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` format, corresponding to the same version in the linked article. The build number in the Edge node version indicates minor changes.

## Deleting the Edge Inline

To delete your Edge deployment, click **Configure** → **Admin settings** → **Delete inline**.

If you intend to delete and re-create the nodes, you can adjust the settings of the existing deployment, and the nodes will be re-deployed with the updated configuration.

If your subscription expires, the Edge node will be automatically deleted after 14 days.
