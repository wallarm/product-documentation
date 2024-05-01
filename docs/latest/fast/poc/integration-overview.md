[doc-integration-api]:          integration-overview-api.md
[doc-integration-ci-mode]:      integration-overview-ci-mode.md
[doc-concurrent-pipelines]:     ci-mode-concurrent-pipelines.md

[img-api-mode]:                 ../../images/fast/poc/en/integration-overview/api-mode-common.png
[img-ci-mode]:                  ../../images/fast/poc/en/integration-overview/ci-mode-common.png
[img-ci-mode-build-id]:         ../../images/fast/poc/en/integration-overview/ci-build-id-common.png

[anchor-build-id]:              #deploying-the-fast-node-with-ci-mode-for-use-in-concurrent-cicd-workflows

[doc-qsg]:              ../qsg/deployment-options.md

#   A CI/CD Workflow with FAST

If you integrate FAST into a CI/CD workflow, several extra steps will be added to the existing CI/CD workflow. These steps can be part of either an existing CI/CD job or a separate job.   

The exact extra steps will differ depending on the test run creation scenario in action. All possible scenarios are described below.

##  Integration via the Wallarm API (aka “Deployment via API”)

In this scenario, the FAST node is managed via the Wallarm API. The API is also employed to manage test runs. The FAST node can either record baseline requests or work with already recorded baseline requests:
    
![Integration via API][img-api-mode] 

In this scenario, FAST demonstrates the following behavior:
* A single FAST node Docker container is bound to a single corresponding cloud FAST node. To run multiple containers with a FAST node simultaneously, you need the same number of cloud FAST nodes and tokens as the number of containers you are planning to deploy.
* If you create a new FAST node for a cloud FAST node and there is another FAST node tied to that cloud node, the test run execution will be aborted for the latter node.
* A test policy and a test record may be used by several test runs and FAST nodes.
    
See [this document][doc-integration-api] for details on how FAST integration is made in this case. 

##  Integration via the FAST Node (aka “Deployment with CI MODE”)

In this scenario, the FAST node is used in the testing and recording modes. The operation mode is switched by manipulating the `CI_MODE` environment variable when deploying a container with the node. The FAST node manages test runs by itself; therefore there is no need for a CI/CD tool to interact with the Wallarm API.

See the image below for a schematic explanation of this scenario:

![Integration with CI MODE][img-ci-mode]

In this scenario, FAST demonstrates the following behavior:
* A single FAST node Docker container is bound to a single corresponding cloud FAST node. To run multiple containers with a FAST node simultaneously, you need the same number of cloud FAST nodes and tokens as the number of containers you plan to deploy.
    To correctly deploy many FAST nodes for use in concurrent CI/CD workflows, you will need to use a different approach that is similar to the CI MODE [described below][anchor-build-id].
* If you create a new FAST node for a cloud FAST node and there is another FAST node tied to that cloud node, the test run execution will be aborted for the latter node.
* A test policy and a test record may be used by several test runs and FAST nodes.

See [this document][doc-integration-ci-mode] for details on how FAST integration is made in this case. 
    

### Deploying the FAST Node with CI MODE for Use in Concurrent CI/CD Workflows

To deploy FAST node in a way that is suitable for concurrent CI/CD workflows, you should use CI MODE as described above and pass the additional `BUILD_ID` environment variable to the node's container.

The `BUILD_ID` parameter allows recording to several different test records while using a single cloud FAST node, and reusing these test records later to fire up a few concurrent test runs.

See the image below for a schematic explanation of this scenario:

![Integration with BUILD_ID][img-ci-mode-build-id]

In this scenario, FAST demonstrates the following behavior:
* A few FAST nodes can operate via a single cloud FAST node to work in concurrent CI/CD workflows. Note that **the same token is used** by all of these FAST nodes.
* Test runs use different test records marked with distinct `BUILD_ID` identifiers.
* These test runs execute in parallel; moreover, they may employ different test policies, if necessary.

See [this document][doc-concurrent-pipelines] for detailed explanation about how to use FAST in concurrent CI/CD workflows.


!!! info "HTTPS support"
    This instruction describes the integration of FAST with CI/CD to test the application working over HTTP protocol.
    
    FAST node also supports testing applications working over HTTPS protocol. More details are described in the [Quick Start guide][doc-qsg].
