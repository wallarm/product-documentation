[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Wallarm Sidecar Yükseltme

Bu yönergeler, Wallarm Sidecar çözümünün yükseltilmesi için gereken adımları açıklamaktadır.

## Gereksinimler

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Gelen tüm K8s manifest değişikliklerini kontrol edin

Beklenmedik Sidecar davranış değişikliklerinden kaçınmak için, [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak gelen tüm K8s manifest değişikliklerini kontrol edin. Bu eklenti, dağıtılmış Sidecar sürümünün K8s manifestleri ile yeni sürüm arasındaki farkı gösterir.

Eklentiyi kurmak ve çalıştırmak için:

1. Eklentiyi kurun:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n wallarm-sidecar wallarm/wallarm-sidecar --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` Wallarm Sidecar Helm sürümünün adıdır.
    * `wallarm-sidecar`, Wallarm Sidecar çözümünün dağıtıldığı isim alanıdır. [Dağıtım](../installation/kubernetes/sidecar-proxy/deployment.md) kılavuzumuza göre, büyük olasılıkla `wallarm-sidecar` olarak ayarlanmıştır.
    * `<PATH_TO_VALUES>`: Sidecar ayarlarını tanımlayan `values.yaml` dosyasının yoludur - önceki Sidecar sürümünü çalıştırmak için oluşturulan dosyayı kullanabilirsiniz.
3. Çıktıdaki hataların dikkatlice incelendiğinden ve çalışan servislerin stabilitesini etkileyecek hiçbir değişikliğin olmadığından emin olun.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## 4.10.6 veya altı 4.10.x sürümünden yükseltme

[4.10.7 sürümü](/4.10/updating-migrating/node-artifact-versions/#helm-chart-for-sidecar) kırılma değişikliklerini tanıttı ve çözümün yeniden kurulmasını gerektirdi. Admission webhook sertifikası oluşturma için varsayılan yöntem, [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) süreci ile değiştirildi. Yükseltme sırasında, sertifikalar otomatik olarak yeni `certgen` süreci kullanılarak oluşturulacaktır.

Ek olarak, bu sürüm [`cert-manager` ile admission webhook sertifika sağlama veya sertifikaları manuel olarak belirtme](../installation/kubernetes/sidecar-proxy/customization.md#certificates-for-the-admission-webhook) imkanı sunar.

### Adım 3: Çözümün önceki sürümünü kaldırın

```
helm uninstall <RELEASE_NAME> -n wallarm-sidecar
```

### Adım 4: Önceki sertifika artefaktlarını kaldırın

```
kubectl delete MutatingWebhookConfiguration <RELEASE_NAME>-wallarm-sidecar
kubectl delete secret <RELEASE_NAME>-wallarm-sidecar-admission-tls -n wallarm-sidecar
```

### Adım 5: Yeni çözüm sürümünü dağıtın

``` bash
helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>` Helm sürümü için kullanılan addır. Çözümün ilk dağıtımında kullandığınız ismin yeniden kullanılması tavsiye edilir.
* `wallarm-sidecar` Helm sürümünün dağıtılacağı isim alanıdır. Çözümün ilk dağıtımında kullandığınız isim alanının yeniden kullanılması tavsiye edilir.
* `<PATH_TO_VALUES>` `values.yaml` dosyasının yoludur. Yükseltme için herhangi bir değişiklik yapmadan, ilk dağıtım sırasında oluşturulan dosyayı yeniden kullanabilirsiniz.

## 4.10.7 veya üstü sürümünden yükseltme

### Adım 3: Sidecar çözümünü yükseltin

Dağıtılmış Sidecar çözümü bileşenlerini yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 5.3.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Dağıtılmış Sidecar chart'ının Helm sürümünün adıdır.
* `<NAMESPACE>`: Sidecar'ın dağıtıldığı isim alanıdır.
* `<PATH_TO_VALUES>`: Önceki Sidecar 4.10 ayarlarını tanımlayan `values.yaml` dosyasının yoludur - önceki Sidecar sürümünü çalıştırırken oluşturulan dosyayı kullanabilirsiniz.

## Yükseltilen Sidecar Çözümünü Test Etme

1. Helm chart sürümünün yükseltildiğinden emin olun:

    ```bash
    helm list -n wallarm-sidecar
    ```

    Burada `wallarm-sidecar`, Sidecar'ın dağıtıldığı isim alanıdır. İsim alanı farklı ise bu değeri değiştirebilirsiniz.

    Chart sürümü `wallarm-sidecar-5.3.0` ile uyumlu olmalıdır.
1. Wallarm kontrol düzlemi ayrıntılarını alarak başarılı bir şekilde başlatıldığını kontrol edin:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her bir pod aşağıdaki gibi görünmelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Uygulama küme adresine [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırısını test edin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    İstenen uygulama Pod'u, `wallarm-sidecar: enabled` etiketine sahip olmalıdır.

    Yeni sürüm çözümün, önceki sürümde olduğu gibi kötü niyetli isteği işlediğini kontrol edin.