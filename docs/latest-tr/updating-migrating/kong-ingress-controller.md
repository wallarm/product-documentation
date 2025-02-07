[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Entegre Wallarm modülleriyle Kong Ingress controller'ının Yükseltilmesi

Bu talimatlar, dağıtılmış Wallarm Kong tabanlı Ingress Controller 4.x'in, Wallarm node 4.6 ile gelen yeni sürüme yükseltilmesi adımlarını açıklar.

## Gereksinimler

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Tüm gelecek K8s manifest değişikliklerini kontrol edin

Beklenmedik Ingress controller davranışlarından kaçınmak için, Helm Diff Plugin kullanarak ortaya çıkabilecek tüm K8s manifest değişikliklerini kontrol edin. Bu eklenti, dağıtılmış Ingress controller sürümü ile yeni sürüm arasındaki K8s manifest farklarını gösterir.

Eklentiyi kurmak ve çalıştırmak için:

1. Eklentiyi kurun:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller chart'ının yer aldığı Helm sürümünün adı
    * `<NAMESPACE>`: Ingress controller içeren Helm chart'ın dağıtıldığı namespace
    * `<PATH_TO_VALUES>`: Ingress controller 4.6 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller sürümünü çalıştırmak için oluşturulan dosyayı kullanabilirsiniz
3. Çalışan hizmetlerin kararlılığını etkileyecek herhangi bir değişiklik olmadığından emin olun ve stdout'daki hataları dikkatlice inceleyin.

    Eğer stdout boş ise, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Ingress controller'ı yükseltin

Dağıtılmış Kong Ingress controller'ı yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controller chart'ının yer aldığı Helm sürümünün adı
* `<NAMESPACE>`: Ingress controller içeren Helm chart'ın dağıtıldığı namespace
* `<PATH_TO_VALUES>`: Ingress controller 6 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller sürümünü çalıştırmak için oluşturulan dosyayı kullanabilirsiniz

## Adım 4: Yükseltilen Ingress controller'ı test edin

1. Helm chart'ın sürümünün yükseltildiğinden emin olun:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Burada `<NAMESPACE>`, Ingress controller içeren Helm chart'ın dağıtıldığı namespace'dir.

    Chart sürümü `kong-4.6.3` ile uyumlu olmalıdır.
1. Podların başarıyla başlatıldığını kontrol etmek için Wallarm pod detaylarını alın:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Her pod aşağıdaki bilgileri göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controller Servisine test [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırılarını gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Yeni sürümün çözümünün, önceki sürümde olduğu gibi zararlı isteği işlediğini kontrol edin.