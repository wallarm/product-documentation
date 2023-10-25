[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarm Sidecar'ı Yükseltme

Bu talimatlar Wallarm Sidecar 4.x'in Wallarm node 4.8 ile yeni sürüme yükseltilmesi adımlarını anlatır.

## Gereksinimler

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Gelecek K8s manifest değişikliklerini kontrol edin

Beklenmedik bir şekilde değişen Sidecar davranışını önlemek için, gelecek K8s manifest değişikliklerini [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak kontrol edin. Bu eklenti, dağıtılmış Sidecar sürümü ve yeni olanın K8s manifestlarının arasındaki farkı çıkarır.

Eklentiyi yüklemek ve çalıştırmak için:

1. Eklentiyi yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Sidecar chart ile Helm sürümünün adı
    * `<NAMESPACE>`: Sidecar'ın dağıtıldığı ad alanı
    * `<PATH_TO_VALUES>`: Sidecar 4.8 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Sidecar sürümünü çalıştırmak için oluşturduğunuzı kullanabilirsiniz
3. Hiçbir değişikliğin çalışan hizmetlerin istikrarını etkilememesini sağlayın ve stdout'tan gelen hataları dikkatlice inceleyin.

     Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Sidecar çözümünü yükseltin

Sidecar çözümünün dağıtılmış bileşenlerini yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: dağıtılan Sidecar chart ile Helm sürümünün adı
* `<NAMESPACE>`: Sidecar'ın dağıtıldığı ad alanı
* `<PATH_TO_VALUES>`: Sidecar 4.8 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Sidecar sürümünü çalıştırmak için oluşturduğunuzı kullanabilirsiniz

## Adım 4: Yükseltilmiş Sidecar çözümünü test edin

1. Helm chart'ın sürümünün yükseldiğinden emin olun:

    ```bash
    helm list -n wallarm-sidecar
    ```

    Burada `wallarm-sidecar` Sidecar'ın dağıtıldığı ad alanıdır. Ad alanı farklıysa bu değeri değiştirebilirsiniz.

    Chart versiyonu `wallarm-sidecar-1.1.5` ile eşleşmelidir.
1. Başarılı bir şekilde başlatıldıklarını kontrol etmek için Wallarm pod detaylarını alın:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her bir pod aşağıdakini göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Uygulama kümesi adresine test [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırısını gönderin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    İstenilen uygulama Pod'un `wallarm-sidecar: enabled` etiketi olmalıdır.

    Yeni versiyonun çözümünün kötü niyetli isteği önceki versiyonda olduğu gibi işlediğinden emin olun.