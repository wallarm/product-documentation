[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   Configuration of Proxying Rules

!!! warning "Attention"
    Perform the steps described in this chapter only if FAST node is being deployed either via [API][doc-node-deployment-api] or via [CI Mode (recording mode)][doc-fast-recording-mode].

Configure your request source to use the FAST node as an HTTP proxy for all the requests issued towards the target application.

Depending on the way your CI/CD infrastructure interacts with the FAST node’s Docker container, you can address the node by one of the following means:
*   IP address.
*   Domain name.

!!! info "Example"
    If your test tool runs as a Linux Docker container, you can pass the following environment variable into the container to enable proxying of all the HTTP requests from that container through the FAST node:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```