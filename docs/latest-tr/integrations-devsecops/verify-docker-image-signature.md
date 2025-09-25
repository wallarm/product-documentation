# Wallarm Docker İmaj İmzalarını Doğrulama

Wallarm, Docker imajları için [genel anahtarı](https://repo.wallarm.com/cosign.pub) imzalar ve paylaşır; bu sayede imajların özgünlüğünü doğrulayabilir ve ele geçirilmiş imajlar ile tedarik zinciri saldırıları gibi riskleri azaltabilirsiniz. Bu makale, Wallarm Docker imaj imzalarının doğrulanmasına yönelik talimatları sağlar.

## İmzalanan imajların listesi

Wallarm aşağıdaki Docker imajlarını imzalar:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 ve üzeri: tüm Wallarm modüllerini içeren, Wallarm dağıtımı için bağımsız bir artefakt görevi gören [NGINX tabanlı Docker imajı](../admin-en/installation-docker-en.md)
* [NGINX-based Ingress Controller deployment](../admin-en/installation-kubernetes-en.md) için Helm chart tarafından kullanılan tüm Docker imajları:

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecar deployment](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm chart tarafından kullanılan tüm Docker imajları:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio): Wallarm bağlayıcıları için [self-hosted Native Node dağıtımı için Docker imajı](../installation/native-node/docker-image.md)

## Gereksinimler

Wallarm Docker imajlarının özgünlüğünü sağlamak için, hem imzalama hem de doğrulama amacıyla [Cosign](https://docs.sigstore.dev/cosign/overview/) kullanılır. 

Docker imaj imzası doğrulamasına geçmeden önce, Cosign komut satırı aracını yerel makinenize veya CI/CD hattınıza [kurduğunuzdan](https://docs.sigstore.dev/cosign/installation/) emin olun.

## Docker imajı imza doğrulamasını çalıştırma

Bir Docker imajı imzasını doğrulamak için, aşağıdaki komutları çalıştırın ve `WALLARM_DOCKER_IMAGE` değerini ilgili imaj etiketiyle değiştirin:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[Çıktı](https://docs.sigstore.dev/cosign/verify/) örneğin imaj özetiyle `docker-manifest-digest` nesnesini sağlamalıdır:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## İmza doğrulaması için Kubernetes policy motorunu kullanma

Kyverno veya Open Policy Agent (OPA) gibi motorlar, Kubernetes kümeniz içinde Docker imajı imza doğrulamasına olanak tanır. Doğrulamaya yönelik kuralları olan bir policy hazırlayarak, Kyverno depo veya etiketler dahil tanımlanan ölçütlere göre imaj imza doğrulamasını başlatır. Doğrulama, Kubernetes kaynağı dağıtımı sırasında gerçekleşir.

Wallarm Docker imajı imza doğrulaması için Kyverno policy kullanımına bir örnek:

1. Kümenize [Kyverno’yu yükleyin](https://kyverno.io/docs/installation/methods/) ve tüm pod’ların çalışır durumda olduğundan emin olun.
1. Aşağıdaki Kyverno YAML policy’sini oluşturun:

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
1. Policy’yi uygulayın:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. Gereksinimlerinize bağlı olarak Wallarm [NGINX Ingress controller](../admin-en/installation-kubernetes-en.md) veya [Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md)’ı dağıtın. Kyverno policy’si, imajın imzasını kontrol etmek için dağıtım sırasında uygulanacaktır.
1. Doğrulama sonuçlarını analiz etmek için şunu çalıştırın:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

İmza doğrulama durumunu özetleyen bir çıktı alacaksınız:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

Sağlanan `verify-wallarm-images` policy’sinde `failurePolicy: Fail` parametresi bulunur. Bu, imza kimlik doğrulaması başarılı olmazsa tüm chart dağıtımının başarısız olacağı anlamına gelir.