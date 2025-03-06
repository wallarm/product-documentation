# Generating an SBOM for Wallarm Docker Images

The Software Bill of Materials (SBOM) is an inventory that lists the software components and their dependencies in an application, including versions, licenses, and vulnerabilities. This article guides you on generating SBOM for Wallarm Docker images.

You may need to obtain the SBOM for Wallarm Docker Images to assess and mitigate potential security risks associated with the dependencies used in the images. The SBOM offers transparency into the software components and helps to ensure compliance.

## The list of Wallarm Docker images

Below is the list of [signed](verify-docker-image-signature.md) Wallarm Docker images. You can generate SBOM for any tag of these images.

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 and above: [NGINX-based Docker image](../admin-en/installation-docker-en.md) that includes all Wallarm modules, serving as a standalone artifact for Wallarm deployment
* All Docker images used by the Helm chart for [NGINX-based Ingress Controller deployment](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* All Docker images used by the Helm chart for [Sidecar deployment](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio): the [Docker image for the self-hosted Native Node deployment](../installation/native-node/docker-image.md) for Wallarm connectors

## Requirements

To generate an SBOM for Wallarm Docker images, you will need to use the [syft](https://github.com/anchore/syft) CLI utility.

Before proceeding with SBOM generation, make sure to [install](https://github.com/anchore/syft#installation) **syft** on your local machine or within your CI/CD pipeline.

## SBOM generation procedure

To generate an SBOM for a Docker image, use the following command, replacing the specified image tag with the desired one:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

By default, **syft** returns the SBOM in text format. You can also generate it in other formats like CycloneDX, SPDX, and save the output to a file, e.g.:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

After generating the SBOM, you can leverage it within your CI/CD pipeline for various actions, such as vulnerability scanning, license compliance checks, security audits, or generating reports.

To verify that all dependencies truly belong to Wallarm, you can simply [check the image's signature](verify-docker-image-signature.md) as a whole. By digitally signing our images, we guarantee that the signed image is indeed ours. Consequently, this assurance extends to the SBOM, as it will be associated with Wallarm's verified image.
