[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Wallarm modülleriyle entegre Kong Ingress controller'ın yükseltilmesi

Bu talimatlar, dağıtılmış Wallarm Kong-bazlı Ingress Controller 4.x'in Wallarm node 4.8 ile yeni versiyona yükseltme adımlarını tarif eder.

## Gereksinimler

--8<-- "../include-tr/waf/installation/kong-ingress-controller-reqs.md"

## Adım 1: Wallarm Helm haritası deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Tüm gelecek K8s manifest değişikliklerini kontrol edin

İnkontrol dışı değişen Ingress controller davranışından kaçınmak için, tüm gelecek K8s manifest değişikliklerini [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak kontrol edin. Bu plugin, dağıtılan Ingress controller versiyonu ve yeni olunun K8s manifestlerinin farkını çıktılar.

Plugini yükleyin ve çalıştırın:

1. Plugini yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Plugini çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller haritası ile Helm sürümünün adı
    * `<NAMESPACE>`: Ingress controller ile Helm haritasının dağıtıldığı ad alanı
    * `<PATH_TO_VALUES>`: Ingress controller 4.8 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller sürümünü çalıştırmak için oluşturduğunuzu kullanabilirsiniz.
3. Hiçbir değişikliğin çalışan hizmetlerin stabilitesini etkilemediğinden dahave dikkatlice stdout hatalarını inceleyin.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Ingress controller'ı yükseltin

Dağıtılmış Kong Ingress controller'ı yükseltin:

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controller haritası ile Helm sürümünün adı
* `<NAMESPACE>`: Ingress controller ile Helm haritasının dağıtıldığı ad alanı
* `<PATH_TO_VALUES>`: Ingress controller 4.8'1 ayarlarını tanımlayan `values.yaml` dosyasının yolu -önceki Ingress controller sürümünü çalıştırmak için oluşturduğunuz kullanabilirsiniz.

## Adım 4: Yükseltilmiş Ingress controller'ı test edin

1. Helm haritasının versiyonunun yükseltildiğinden emin olun:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Burada `<NAMESPACE>` Ingress controller ile Helm haritasının dağıtıldığı ad alanıdır.

    Harita versiyonu `kong-4.6.3`'e karşılık gelmelidir.
1. Başarıyla başlatıldıklarını kontrol etmek için Wallarm pod ayrıntılarını alın:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Her bir pod, aşağıdakini göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controller Service'ine test [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırıları gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Yeni versiyonun çözümünün, kötü niyetli isteği önceki versiyonda olduğu gibi işlediğini kontrol edin.
