[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Entegre Wallarm modülleri ile NGINX Ingress controller'ın yükseltme

Bu talimatlar, dağıtılmış Wallarm NGINX tabanlı Ingress Controller 4.x'ın Wallarm düğümü 4.8 ile yeni versiyona yükseltilmesi için adımları açıklar.

Son kullanma tarihi geçmiş düğümü (3.6 veya düşük) yükseltmek için, lütfen [farklı talimatları](older-versions/ingress-controller.md) kullanın.

## Gereksinimler

--8<-- "../include-tr/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Gelecek tüm K8s manifest değişikliklerini kontrol edin

Beklenmedik bir şekilde değişen Ingress controller davranışından kaçınmak için, gelecekteki tüm K8s manifest değişikliklerini [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak kontrol edin. Bu eklenti, dağıtılan Ingress controller versiyonu ve yeni olanın K8s manifestları arasındaki farkı çıktılar.

Eklentiyi yüklemek ve çalıştırmak için:

1. Eklentiyi yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller tablosu ile Helm sürümünün adı
    * `<NAMESPACE>`: Ingress controller'ın dağıtıldığı ad alanı
    * `<PATH_TO_VALUES>`: Ingress controller 4.8 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller versiyonunu çalıştırmak için oluşturduğunuz dosyayı kullanabilirsiniz
3. Hiçbir değişikliğin çalışan hizmetlerin stabilitesini etkilemeyeceğinden emin olun ve stdout'dan gelen hataları dikkatle inceleyin.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Ingress controller'ı yükseltin

Dağıtılmış NGINX Ingress controller'ı yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controller tablosu ile Helm sürümünün adı
* `<NAMESPACE>`: Ingress controller'ın dağıtıldığı ad alanı
* `<PATH_TO_VALUES>`: Ingress controller 4.8 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller versiyonunu çalıştırmak için oluşturduğunuz dosyayı kullanabilirsiniz

## Adım 4: Yükseltilmiş Ingress controller'ı test edin

1. Helm tablosunun versiyonunun yükseltildiğinden emin olun:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Burada `<NAMESPACE>`, Ingress controller ile Helm tablosunun dağıtıldığı ad alanıdır.

    Tablo versiyonu `wallarm-ingress-4.8.2` ile eşleşmelidir.
1. Podların listesini alın:
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Her pod durumunun **STATUS: Running** veya **READY: N/N** olması gerekir. Örneğin:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. Test için [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırısı olan isteği Wallarm Ingress controller adresine gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Yeni versiyondaki çözümün kötü niyetli isteği önceki versiyondaki gibi işlediğini kontrol edin.

## Adım 5: Wallarm engelleme sayfasını güncelleyin

Eğer Ingress annotations üzerinden tarafından yapılandırılmış `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenen isteklere geri dönerse, [yapılandırmasını](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) yayınlanan değişikliklere göre ayarlayın.

Yeni düğüm versiyonlarında, Wallarm engelleme sayfası [artık](what-is-new.md#new-blocking-page) güncellenmiş UI ile varsayılan olarak logo ve destek e-postası belirtmeksizin gelmektedir.