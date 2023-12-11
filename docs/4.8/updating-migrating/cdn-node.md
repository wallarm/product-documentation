# Upgrading the CDN node

These instructions describe the steps to upgrade the Wallarm CDN node available starting with version 3.6.

1. Delete the Wallarm CNAME record from the DNS records of the protected domain.

    !!! warning "Malicious request mitigation will be stopped"
        Once the CNAME record is removed and changes take effect on the Internet, the Wallarm CDN node will stop request proxying, and legitimate and malicious traffic will go directly to the protected resource.

        It results in the risk of the protected server vulnerability exploitation when deleted DNS record took effect but the CNAME record generated for the new node version did not take effect yet.
1. Wait for the changes to be propagated. The actual CNAME record status is displayed in Wallarm Console → **Nodes** → **CDN** → **Delete node**.
1. Delete the CDN node from Wallarm Console → **Nodes**.

    ![Deleting the node](../images/user-guides/nodes/delete-cdn-node.png)
1. Create the CDN node of the newer version protecting the same domain following the [instructions](../installation/cdn-node.md).

Since all CDN node settings are saved in the Wallarm Cloud, the new CDN node will get them automatically. You do not need to move the node configuration manually if the protected domain did not change.
