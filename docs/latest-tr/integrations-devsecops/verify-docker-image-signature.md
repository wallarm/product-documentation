# Wallarm Docker Görüntü İmzalarını Doğrulama

Wallarm, Docker görüntüleri için [public key](https://repo.wallarm.com/cosign.pub)'ı imzalar ve paylaşır; bu sayede, görüntülerin doğruluğunu teyit edebilir, tehlikeye uğramış görüntüler ve tedarik zinciri saldırıları gibi riskleri azaltabilirsiniz. Bu makale, Wallarm Docker görüntü imzalarını doğrulama konusunda talimatlar sunar.

## İmzalanan Görüntülerin Listesi

Wallarm, aşağıdaki Docker görüntülerini imzalar:

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 ve üzeri: Tüm Wallarm modüllerini içeren, Wallarm dağıtımı için bağımsız bir artefakt olarak hizmet veren [NGINX-based Docker image](../admin-en/installation-docker-en.md)
* [NGINX-based Ingress Controller dağıtımı](../admin-en/installation-kubernetes-en.md) için Helm şablonunda kullanılan tüm Docker görüntüleri:

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecar dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm şablonunda kullanılan tüm Docker görüntüleri:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio): Wallarm konektörleri için [self-hosted Native Node dağıtımı](../installation/native-node/docker-image.md) Docker görüntüsü

## Gereksinimler

Wallarm Docker görüntülerinin orijinalliğini sağlamak için, imzalama ve doğrulama işlemleri [Cosign](https://docs.sigstore.dev/cosign/overview/) kullanılarak gerçekleştirilir.

Docker görüntü imza doğrulamasına geçmeden önce, yerel makinada veya CI/CD hattınızda Cosign komut satırı aracını [kurduğunuzdan](https://docs.sigstore.dev/cosign/installation/) emin olun.

## Docker Görüntü İmza Doğrulamasını Çalıştırma

Bir Docker görüntü imzasını doğrulamak için, `WALLARM_DOCKER_IMAGE` değerini ilgili görüntü etiketiyle değiştirerek aşağıdaki komutları çalıştırın:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[Output](https://docs.sigstore.dev/cosign/verify/), görüntü özetini (`docker-manifest-digest`) içeren `docker-manifest-digest` nesnesini sağlamalıdır, örneğin:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## İmza Doğrulaması için Kubernetes Politikası Motorunun Kullanılması

Kyverno veya Open Policy Agent (OPA) gibi motorlar, Kubernetes kümeniz içinde Docker görüntü imza doğrulaması yapmanıza olanak tanır. Doğrulama kuralları içeren bir politika oluşturarak, Kyverno tanımlanan kriterlere, örneğin depo veya etiketlere dayalı olarak, görüntü imza doğrulamasını başlatır. Doğrulama, Kubernetes kaynaklarının dağıtımı sırasında gerçekleştirilir.

Aşağıda, Wallarm Docker görüntü imza doğrulaması için Kyverno politikasının nasıl kullanılacağına dair bir örnek verilmiştir:

1. Kümenize [Kyverno'yu kurun](https://kyverno.io/docs/installation/methods/) ve tüm pod'ların çalışır durumda olduğundan emin olun.
1. Aşağıdaki Kyverno YAML politikasını oluşturun:

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
1. Politikayı uygulayın:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. İhtiyacınıza bağlı olarak Wallarm [NGINX Ingress controller](../admin-en/installation-kubernetes-en.md) veya [Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md) dağıtımını gerçekleştirin. Dağıtım sırasında Kyverno politikası, görüntünün imzasını kontrol etmek üzere uygulanacaktır.
1. Doğrulama sonuçlarını analiz etmek için aşağıdaki komutu çalıştırın:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

Aşağıdaki gibi, imza doğrulama durumunu özetleyen bilgiler alacaksınız:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

Sağlanan `verify-wallarm-images` politikasında `failurePolicy: Fail` parametresi bulunmaktadır. Bu, imza doğrulaması başarılı olmazsa, tüm şablon dağıtımının başarısız olacağı anlamına gelir.