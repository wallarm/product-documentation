[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Wallarm Sidecar’ı Yükseltme

Bu talimatlar, Wallarm Sidecar çözümünü en son 6.x sürümüne yükseltme adımlarını açıklar.

## Gereksinimler

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Gelecek tüm K8s manifest değişikliklerini kontrol edin

Beklenmedik Sidecar davranışı değişikliklerinden kaçınmak için, [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak gelecek tüm K8s manifest değişikliklerini kontrol edin. Bu eklenti, dağıtılmış Sidecar sürümünün K8s manifestleri ile yenisinin manifestleri arasındaki farkı çıktılar.

Eklentiyi yüklemek ve çalıştırmak için:

1. Eklentiyi yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n wallarm-sidecar wallarm/wallarm-sidecar --version 6.5.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm Sidecar Helm sürümünün adıdır.
    * `wallarm-sidecar`, Wallarm Sidecar çözümünün dağıtıldığı ad alanıdır. [Dağıtım](../installation/kubernetes/sidecar-proxy/deployment.md) kılavuzumuza göre büyük olasılıkla `wallarm-sidecar` olarak ayarlanmıştır.
    * `<PATH_TO_VALUES>`, Sidecar Helm chart 6.x ayarlarını içeren `values.yaml` dosyasının yoludur. Önceki sürümün dosyasını, [Tarantool’dan wstore’a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) için güncelleyerek yeniden kullanabilirsiniz:
    
        Helm değerleri yeniden adlandırıldı: `postanalytics.tarantool` → `postanalytics.wstore`. Postanalytics belleği açıkça [ayrılmışsa](../installation/kubernetes/sidecar-proxy/scaling.md), bu değişikliği `values.yaml` içinde uygulayın.

3. Çalışan servislerin stabilitesini etkileyebilecek herhangi bir değişiklik olmadığından emin olun ve stdout’taki hataları dikkatle inceleyin.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## 4.10.6 veya daha düşük sürümden yükseltme

4.10.7 sürümü kırılma değişikliklerini tanıttı ve çözümün yeniden kurulmasını gerektirdi. Admission webhook sertifikası oluşturma için varsayılan yöntem, [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) süreci ile değiştirildi. Yükseltme sırasında, sertifikalar otomatik olarak yeni `certgen` süreci kullanılarak oluşturulacaktır.

Ek olarak, bu sürüm, admission webhook sertifikası sağlamak için [`cert-manager` kullanmanızı veya sertifikaları manuel olarak belirtmenizi](../installation/kubernetes/sidecar-proxy/customization.md#certificates-for-the-admission-webhook) sağlar.

### Adım 3: Çözümün önceki sürümünü kaldırın

```
helm uninstall <RELEASE_NAME> -n wallarm-sidecar
```

### Adım 4: Önceki sertifika yapıtlarını kaldırın

```
kubectl delete MutatingWebhookConfiguration <RELEASE_NAME>-wallarm-sidecar
kubectl delete secret <RELEASE_NAME>-wallarm-sidecar-admission-tls -n wallarm-sidecar
```

### Adım 5: Yeni çözüm sürümünü dağıtın

``` bash
helm install --version 6.5.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`, Helm sürümü için addır. Çözümün ilk dağıtımında kullandığınız adı yeniden kullanmanız önerilir.
* `wallarm-sidecar`, Helm sürümünün dağıtılacağı ad alanıdır. Çözümün ilk dağıtımında kullandığınız ad alanını yeniden kullanmanız önerilir.
* `<PATH_TO_VALUES>`, Sidecar Helm chart 6.x ayarlarını içeren `values.yaml` dosyasının yoludur. Önceki sürümün dosyasını, [Tarantool’dan wstore’a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) için güncelleyerek yeniden kullanabilirsiniz:
    
    Helm değerleri yeniden adlandırıldı: `postanalytics.tarantool` → `postanalytics.wstore`. Postanalytics belleği açıkça [ayrılmışsa](../installation/kubernetes/sidecar-proxy/scaling.md), bu değişikliği `values.yaml` içinde uygulayın.

### Adım 6: Sidecar Proxy ekli dağıtımları yeniden başlatın

Uygulama pod’larına zaten enjekte edilmiş proxy konteynerlerini yükseltmek için ilgili deployment’ları yeniden başlatın:

```
kubectl rollout restart deployment <DEPLOYMENT_NAME> -n <NAMESPACE>
```

* `<DEPLOYMENT_NAME>`, uygulama deployment’ının adıdır
* `<NAMESPACE>`, deployment’ın bulunduğu ad alanıdır

## 4.10.7 veya üzeri sürümden yükseltme

### Adım 3: Sidecar çözümünü yükseltin

Sidecar çözümünün dağıtılmış bileşenlerini yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 6.5.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Dağıtılmış Sidecar chart’ının Helm sürümünün adı
* `<NAMESPACE>`: Sidecar’ın dağıtıldığı ad alanı
* `<PATH_TO_VALUES>`, Sidecar Helm chart 6.x ayarlarını içeren `values.yaml` dosyasının yoludur. Önceki sürümün dosyasını, [Tarantool’dan wstore’a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) için güncelleyerek yeniden kullanabilirsiniz:
    
    Helm değerleri yeniden adlandırıldı: `postanalytics.tarantool` → `postanalytics.wstore`. Postanalytics belleği açıkça [ayrılmışsa](../installation/kubernetes/sidecar-proxy/scaling.md), bu değişikliği `values.yaml` içinde uygulayın.

### Adım 4: Sidecar Proxy ekli dağıtımları yeniden başlatın

Uygulama pod’larına zaten enjekte edilmiş proxy konteynerlerini yükseltmek için ilgili deployment’ları yeniden başlatın:

```
kubectl rollout restart deployment <DEPLOYMENT_NAME> -n <NAMESPACE>
```

* `<DEPLOYMENT_NAME>`, uygulama deployment’ının adıdır
* `<NAMESPACE>`, deployment’ın bulunduğu ad alanıdır

## Yükseltilmiş Sidecar çözümünü test edin

1. Helm chart sürümünün yükseltildiğinden emin olun:

    ```bash
    helm list -n wallarm-sidecar
    ```

    Burada `wallarm-sidecar`, Sidecar’ın dağıtıldığı ad alanıdır. Ad alanı farklıysa bu değeri değiştirebilirsiniz.

    Chart sürümü `wallarm-sidecar-6.5.1` ile uyumlu olmalıdır.
1. Başarıyla başlatıldığını kontrol etmek için Wallarm kontrol düzlemi ayrıntılarını alın:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her pod aşağıdakileri göstermelidir: READY: N/N ve STATUS: Running, örn.:

    ```
    NAME                                             READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   3/3     Running   0          91m
    ```
1. Uygulama kümesi adresine test [Yol Geçişi (Path Traversal)](../attacks-vulns-list.md#path-traversal) saldırısını gönderin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    İstenen uygulama Pod’unun `wallarm-sidecar: enabled` etiketi olmalıdır.

    Çözümün yeni sürümünün kötü amaçlı isteği önceki sürümde olduğu gibi işlediğini kontrol edin.