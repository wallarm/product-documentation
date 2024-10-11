[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   Integration Prerequisites

To enable integrating FAST into a CI/CD workflow, you will need

* Contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access to the Wallarm account and FAST node management.
* The FAST node's Docker container should have access to the `us1.api.wallarm.com` Wallarm API server via the HTTPS protocol (`TCP/443`)
--8<-- "../include/fast/cloud-note.md"

 * Permissions to create and run Docker containers for your CI/CD workflow
    
* A web application or API to test for vulnerabilities (a *target application*)
    
    It is mandatory that this application use the HTTP or HTTPS protocol for communication.
    
    The target application should remain available until the FAST security testing finishes.
    
* A test tool that will test the target application using HTTP and HTTPS requests (a *request source*).
    
    A request source should be able to work with an HTTP or HTTPS proxy server.
    
    [Selenium][link-selenium] is an example of a test tool that satisfies the mentioned requirements.
    
* One or more [tokens][doc-about-token].
    <p id="anchor-token"></p>

    [Create a FAST node][doc-create-node] in the Wallarm cloud and use the corresponding token in the Docker container when performing a CI/CD task.  
    
    The token will be employed by the Docker container with the FAST node during the CI/CD job execution.

    If you have several CI/CD jobs that are running simultaneously, create an appropriate number of FAST nodes in the Wallarm cloud.

    !!! info "An example token"
        The `token_Qwe12345` value is used as an example of a token throughout this guide.    