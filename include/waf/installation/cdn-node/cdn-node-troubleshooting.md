### What do CDN node statuses mean?

The following statuses may appear in Wallarm Console → **Nodes** for CDN nodes:

* **Registering**: Wallarm registers the CDN node in the cloud provider.

    Required action: wait for the **Requires CNAME** status to add the Wallarm CNAME record to the protected domain's DNS records.
* **Requires CNAME**: Wallarm CNAME record is not added to the DNS records of the protected domain or it is added but not propagated yet.

    Required action: add the CNAME record provided by Wallarm to the DNS records of the protected domain or wait for the changes to take effect on the Internet.
    
    If changes do not take effect for more than 24 hours, please check that your domain provider successfully updated the DNS records. If so, but the **Not propagated yet** status is still displayed in Wallarm Console, please contact the [Wallarm technical support](mailto:support@wallarm.com).

    The next expected status is **Active**.
* **Configuring**: Wallarm processes changed origin address or SSL/TLS certificate.

    Required action: wait for the **Active** status.
* **Active**: Wallarm CDN node mitigates the malicious traffic.

    Required action: none. You can monitor the [events][events-docs] the CDN node detects.
* **Deleting**: Wallarm deletes the CDN node.

    Required action: none, please wait for deletion to be finished.

### How to identify the CNAME record propagated?

The **Nodes** section of Wallarm Console displays the actual status of whether the Wallarm CNAME record took effect on the Internet. If the CNAME record is propagated, the CDN node status is **Active**.

In addition, you can check the HTTP response headers with the following request:

```bash
curl -v <PROTECTED_DOMAIN>
```

If the Wallarm CNAME record is propagated, the response will contain the `section-io-*` headers.

If the CNAME record is not propagated for more than 24 hours, please check that your domain provider successfully updated the DNS records. If so, but the **Not propagated yet** status is still displayed in Wallarm Console, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### The CDN node is highlighted in red in the **Nodes** section. What does it mean?

If the CDN node is highlighted in red in the **Nodes** section, an error occurred during its registration or configuration due to the following possible reasons:

* Unknown error while registering the node in the third-party cloud provider

    Required action: contact the [Wallarm technical support](mailto:support@wallarm.com).
* Invalid custom SSL/TLS certificate

    Required action: make sure the uploaded certificate is valid. If not, upload the valid one.

The CDN node highlighted in red does not proxy requests and as a result, does not mitigate malicious traffic.

### Why the CDN node could disappear from the node list in Wallarm Console?

Wallarm deletes CDN nodes with CNAME records left unchanged for 10 or more days since the moment of the node creation.

If you find the CDN node disappeared, create a new node.