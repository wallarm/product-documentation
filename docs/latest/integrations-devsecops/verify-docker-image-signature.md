# Verifying Wallarm Docker Image Signatures

Wallarm signs and shares the [public key](https://repo.wallarm.com/cosign.pub) for its Docker images, enabling you to verify their authenticity and mitigate risks like compromised images and supply chain attacks. This article provides instructions for verifying Wallarm Docker image signatures.

## The list of signed images

Starting from the release 4.4, Wallarm signs the following Docker images:

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): [NGINX-based Docker image] that includes all Wallarm modules, serving as a standalone artifact for Wallarm deployment -->
* All Docker images used by the Helm chart for [NGINX-based Ingress Controller deployment](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* All Docker images used by the Helm chart for [Sidecar proxy deployment](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## Requirements

To ensure the authenticity of Wallarm Docker images, [Cosign](https://docs.sigstore.dev/cosign/overview/) is used for both signing and verification. 

Before proceeding with Docker image signature verification, make sure to [install](https://docs.sigstore.dev/cosign/installation/) the Cosign command-line utility on your local machine or within your CI/CD pipeline.

## Running Docker image signature verification

To verify a Docker image signature, execute the following commands replacing the `WALLARM_DOCKER_IMAGE` value with the specific image tag:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

The [output](https://docs.sigstore.dev/cosign/verify/) should provide the `docker-manifest-digest` object with the image digest, e.g.:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

<!-- ## Using Kubernetes policy engine for signature verification

Kubernetes Engine Policy, such as Kyverno or Open Policy Agent (OPA), enables Docker image signature verification within your Kubernetes cluster. By defining a policy with rules for verification, Kyverno evaluates the deployed resources and triggers the image signature verification process based on specified criteria like repositories or tags.

Here is an example of how to use Kyverno policy for Wallarm Docker image signature verification using the Cosign utility:

1. [Install Kyverno](https://kyverno.io/docs/installation/methods/).
1. policy
1. Deploy ingerss controller resources/sidecar proxy resources
1. Check the Wallarm Ingress controller installation status.
By default, verify-wallarm-images policy, has a failurePolicy:

the same namespace??
  failurePolicy: Fail


Which means if the verification fails, the entire chart/manifest installation fails too. -->
