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

## Prerequisites

To ensure the authenticity of Wallarm Docker images, [Cosign](https://docs.sigstore.dev/cosign/overview/) is used for both signing and verification. 

Before proceeding with Docker image signature verification, make sure to [install](https://docs.sigstore.dev/cosign/installation/) the Cosign command-line utility on your local machine or within your CI/CD pipeline.

## Running Docker image signature verification

To verify a Docker image signature, execute the following commands replacing the `WALLARM_DOCKER_IMAGE` value with the specific image tag:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-tarantool:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

The [output](https://docs.sigstore.dev/cosign/verify/) should provide the `docker-manifest-digest` object with the image digest, e.g.:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## Automation of verification procedure

To automate the verification of Docker images used in [NGINX-based Ingress Controller deployment](../admin-en/installation-kubernetes-en.md), you can use the provided script.

1. Before running the script, set the desired image tag in the `IMAGES_TAG` environment variable. All images used by the Helm chart share the same versions, so choose the appropriate one from the available [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx) image tags.

    ```bash
    export IMAGES_TAG="4.6.2-1"
    ```
1. Execute the script on your local machine or within your CI/CD pipeline to automatically verify all images used by the Helm chart:

    ```bash
    #!/usr/bin/env bash

    set +x

    if ! [[ -x "$(command -v cosign)" ]]; then
        echo "<cosign> could not be found"
        echo "Did you install it?"
        exit
    fi

    if [[ -z "$IMAGES_TAG" ]]; then
        echo "Please set the images' version to be verified in the env variable, e.g.:"
        echo "export IMAGES_TAG=\"4.6.2-1\" "
        exit 1
    fi

    IMAGES="ingress-ruby ingress-python ingress-tarantool ingress-collectd nginx-ingress-controller ingress-controller"

    for image in $IMAGES; do
        CURRENT_IMAGE="wallarm/$image:$IMAGES_TAG"
        echo "--------------------------"
        echo "Verifying $CURRENT_IMAGE"
        cosign verify --key https://repo.wallarm.com/cosign.pub "$CURRENT_IMAGE"
        echo;echo
    done
    ```

