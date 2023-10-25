# Wallarm Docker İmaj İmzalarının Doğrulanması

Wallarm, Docker imageleri için [genel anahtarını](https://repo.wallarm.com/cosign.pub) imzalar ve paylaşır, böylece bunların orijinalliğini doğrulayabilir ve tehlikelere karşı koruma sağlayabilirsiniz. Bu makale, Wallarm Docker imaj imzalarını doğrulama talimatlarını içermektedir.

## İmzalı imajların listesi

4.4 sürümünden itibaren Wallarm, aşağıdaki Docker imagelerini imzalar:

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): Wallarm modüllerini içeren [NGINX tabanlı Docker imajı] ve bağımsız bir Wallarm dağıtımı olarak hizmet verir -->
* [NGINX tabanlı Ingress Controller dağıtımı](../admin-en/installation-kubernetes-en.md) için Helm tablosunda kullanılan tüm Docker imageleri:

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [Sidecar dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm tablosunda kullanılan tüm Docker imageleri:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## Gereklilikler

Wallarm Docker imagelerinin orijinalliğini sağlamak için hem imzalamada hem de doğrulamada [Cosign](https://docs.sigstore.dev/cosign/overview/) kullanılır.

Docker İmaj imza doğrulamasına başlamadan önce, Cosign komut satırı yardımcı programını yerel makinenize veya CI/CD boru hattınıza [kurduğunuzdan](https://docs.sigstore.dev/cosign/installation/) emin olun.

## Docker İmaj İmza Doğrulamasını Çalıştırma

Bir Docker İmaj imzasını doğrulamak için aşağıdaki komutları çalıştırın ve `WALLARM_DOCKER_IMAGE` değerini belirli imaj etiketi ile değiştirin:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

[Çıktı](https://docs.sigstore.dev/cosign/verify/), İmaj özütü ile `docker-manifest-digest` nesnesini sağlamalıdır, örneğin:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## İmza Doğrulaması için Kubernetes Politika Motorunun Kullanılması

Kyverno veya Açık Politika Ajanı (OPA) gibi motorlar, Docker imajı imza doğrulamasını Kubernetes kümenizde gerçekleştirmenize olanak sağlar. Doğrulama kurallarını içeren bir politika oluşturarak, Kyverno, belirlenen kriterlere dayanarak imaj imza doğrulamasını başlatır.

Wallarm Docker İmaj İmza Doğrulaması için Kyverno politikasını nasıl kullanacağınıza dair bir örnek aşağıda verilmiştir:

1. Kyverno'yu kümenize [kurun](https://kyverno.io/docs/installation/methods/) ve tüm podların aktif olduğundan emin olun.
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
1. Gereksinimlerinize bağlı olarak Wallarm [NGINX Ingress controller](../admin-en/installation-kubernetes-en.md) veya [Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md) dağıtın. Kyverno politikası dağıtım sırasında uygulanarak imajın imzasını kontrol eder.
1. Doğrulama sonuçlarını listelemek için aşağıdaki komutu çalıştırın:

```
kubectl describe ClusterPolicy verify-wallarm-images
``` 

İmza doğrulama durumunu ayrıntılandıran bir özet alacaksınız:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

Verilen `verify-wallarm-images` politikasında `failurePolicy: Fail` parametresi bulunmaktadır. Bu, eğer imza kimlik doğrulaması başarılı olmazsa, tüm grafik dağıtımının başarısız olacağı anlamına gelir.