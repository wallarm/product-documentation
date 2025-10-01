[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Entegre Wallarm modülleriyle NGINX Ingress controller'ı yükseltme

Bu talimatlar, dağıtılmış Wallarm NGINX tabanlı Ingress Controller'ı en son 6.x sürümüne yükseltme adımlarını açıklar.

Ömrü dolmuş node’u (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/ingress-controller.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Wallarm Helm chart deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Gelecek tüm K8s manifest değişikliklerini inceleyin

Ingress controller davranışının beklenmedik şekilde değişmesini önlemek için, [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak gelecek tüm K8s manifest değişikliklerini inceleyin. Bu eklenti, dağıtılmış Ingress controller sürümünün K8s manifestleri ile yenisinin manifestleri arasındaki farkı çıktılar.

Eklentiyi yüklemek ve çalıştırmak için:

1. Eklentiyi yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller chart’ına ait Helm sürümünün adı.
    * `<NAMESPACE>`: Ingress controller’ın dağıtıldığı namespace.
    * `<PATH_TO_VALUES>`: Ingress Controller 6.x ayarlarını içeren `values.yaml` dosyasının yolu. Önceki sürümün dosyasını yeniden kullanabilir, [Tarantool'dan wstore'a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) için güncelleyebilirsiniz.

        Helm değerleri yeniden adlandırıldı: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`. Postanalytics belleğini açıkça [ayırdıysanız](../admin-en/configuration-guides/allocate-resources-for-node.md), bu değişikliği `values.yaml` içinde uygulayın.

3. Çalışan servislerin kararlılığını etkileyebilecek hiçbir değişiklik olmadığından emin olun ve stdout’taki hataları dikkatlice inceleyin.

    stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Ingress controller’ı yükseltin

!!! info ""
    Değişiklikleri üretime almadan önce doğrulamak için NGINX Ingress Controller'ı önce bir hazırlık (staging) Kubernetes ortamında yükseltmeniz önerilir.

Dağıtılmış NGINX Ingress controller’ı yükseltin:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controller chart’ına ait Helm sürümünün adı
* `<NAMESPACE>`: Ingress controller’ın dağıtıldığı namespace
* `<PATH_TO_VALUES>`: Ingress Controller 6.x ayarlarını içeren `values.yaml` dosyasının yolu. Önceki sürümün dosyasını yeniden kullanabilir, [Tarantool'dan wstore'a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) için güncelleyebilirsiniz:
    
    Helm değerleri yeniden adlandırıldı: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`. Postanalytics belleğini açıkça [ayırdıysanız](../admin-en/configuration-guides/allocate-resources-for-node.md), bu değişikliği `values.yaml` içinde uygulayın.

## Adım 4: Yükseltilmiş Ingress controller’ı test edin

1. Helm chart sürümünün yükseltildiğinden emin olun:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Burada `<NAMESPACE>`, Ingress controller ile Helm chart’ın dağıtıldığı namespace’tir.

    Chart sürümü `wallarm-ingress-6.5.1` ile karşılık gelmelidir.
1. Wallarm pod’unu alın:
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Pod durumu **STATUS: Running** ve **READY: N/N** olmalıdır:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```

    5.x veya daha düşük bir sürümden yükseltme yapıyorsanız, artık ayrı bir Tarantool pod’u olmadığını fark edeceksiniz; wstore, ana `<CHART_NAME>-wallarm-ingress-controller-xxx` pod’u içinde çalışır.
1. Wallarm Ingress controller adresine test amaçlı [Yol Geçişi](../attacks-vulns-list.md#path-traversal) saldırısı içeren isteği gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Yeni sürümün çözümünün kötü amaçlı isteği önceki sürümde olduğu gibi işlediğini kontrol edin.

Yükseltme hazırlık ortamında başarıyla doğrulandıktan sonra üretim ortamını yükseltmeye devam edin.