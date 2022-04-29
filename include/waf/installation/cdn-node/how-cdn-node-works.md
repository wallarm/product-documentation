Wallarm CDN node operates as a reverse proxy to the protected server. It analyzes incoming traffic, mitigates malicious requests and forwards legitimate requests to the protected server.

![!CDN node operation scheme][cdn-node-operation-scheme]

As for the other characteristics of the Wallarm CDN node:

* The CDN node is hosted by the third-party cloud provider, so no resources are required from your infrastructure to deploy the CDN node.

    !!! info "Uploading request data to the third-party cloud provider"
        Some data on processed requests is uploaded to the Lumen service.
* The CDN node uploads some request data to the Wallarm Cloud. [Learn more about uploaded data and cutting the sensitive data][data-to-wallarm-cloud-docs]
* The default [operation mode][operation-modes-docs] of the CDN node is **blocking**. It blocks all malicious requests with the code `403`. To change the mode, use the corresponding [rule][operation-mode-rule-docs].
* The CDN node is fully configured via Wallarm Console UI. The only setting to be changed in another way is adding the Wallarm CNAME record to the protected resource's DNS records.
