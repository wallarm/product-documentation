# Verifying Wallarm Docker Image Signatures

Wallarm signs and shares the [public key](https://repo.wallarm.com/cosign.pub) for its Docker images, enabling you to verify their authenticity and mitigate risks like compromised images and supply chain attacks. This article provides instructions for verifying Wallarm Docker image signatures.

## The list of signed images

Wallarm signs the following Docker images:

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

## Using Kubernetes policy engine for signature verification

Engines such as Kyverno or the Open Policy Agent (OPA) allow for Docker image signature verification within your Kubernetes cluster. By crafting a policy with rules for verification, Kyverno initiates the image signature verification based on defined criteria, including repositories or tags. The verification takes place during the Kubernetes resource deployment.

Here is an example of how to use Kyverno policy for Wallarm Docker image signature verification:

1. [Install Kyverno](https://kyverno.io/docs/installation/methods/) on your cluster and ensure all pods are operational.
1. Create the following Kyverno YAML policy:

    ```yaml
    apiVersion: kyverno.io/v1
    kind: ClusterPolicy
    metadata:
      name: verify-wallarm-images
    spec:
      webhookTimeoutSeconds: 30
      validationFailureAction: Enforce
      background: false
      failurePolicy: Fail
      rules:
        - name: verify-wallarm-images
          match:
            any:
              - resources:
                  kinds:
                    - Pod
          verifyImages:
            - imageReferences:
                - docker.io/wallarm/ingress*
                - docker.io/wallarm/sidecar*
              attestors:
                - entries:
                    - keys:
                        kms: https://repo.wallarm.com/cosign.pub
    ```
1. Apply the policy:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. Deploy either the Wallarm [NGINX Ingress controller](../admin-en/installation-kubernetes-en.md) or [Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md), depending on your requirements. The Kyverno policy will be applied during deployment to check the image's signature.
1. Analyze the verification results by executing:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

You will receive a summary detailing the signature verification status:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

The provided `verify-wallarm-images` policy has the `failurePolicy: Fail` parameter. This implies that if the signature authentication does not succeed, the entire chart deployment fails.
