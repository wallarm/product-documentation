[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Wallarm modülleri entegre edilmiş NGINX Ingress controller'ın yükseltilmesi

Bu talimatlar, dağıtılmış Wallarm NGINX tabanlı Ingress Controller 4.x'in Wallarm node 5.0 içeren yeni sürüme nasıl yükseltileceğini açıklar.

Ömrünü tamamlamış node'u (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/ingress-controller.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Wallarm Helm grafik deposunu güncelleyin

```bash
helm repo update wallarm
```

## Adım 2: Tüm gelecek K8s manifest değişikliklerini gözden geçirin

Beklenmeyen Ingress controller davranışı değişikliklerini önlemek için, dağıtılmış Ingress controller sürümü ile yeni sürüm arasındaki farkları gösteren [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanılarak tüm gelecek K8s manifest değişikliklerini gözden geçirin.

Eklentiyi yüklemek ve çalıştırmak için:

1. Eklentiyi yükleyin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller grafiğini içeren Helm sürümünün adı
    * `<NAMESPACE>`: Ingress controller'ın dağıtıldığı namespace
    * `<PATH_TO_VALUES>`: Ingress controller 5.0 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller sürümünü çalıştırmak için oluşturulmuş olanı kullanabilirsiniz
3. Çalışan servislerin kararlılığını etkileyecek hiçbir değişiklik olmadığından emin olun ve stdout'daki hataları dikkatle inceleyin.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

## Adım 3: Ingress controller'ı güncelleyin

Dağıtılmış NGINX Ingress controller'ı yükseltin:

```bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: Ingress controller grafiğini içeren Helm sürümünün adı
* `<NAMESPACE>`: Ingress controller'ın dağıtıldığı namespace
* `<PATH_TO_VALUES>`: Ingress controller 5.0 ayarlarını tanımlayan `values.yaml` dosyasının yolu - önceki Ingress controller sürümünü çalıştırmak için oluşturulmuş olanı kullanabilirsiniz

## Adım 4: Güncellenmiş Ingress controller'ı test edin

1. Helm grafiğinin sürümünün güncellendiğinden emin olun:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Burada `<NAMESPACE>`, Ingress controller grafiğinin dağıtıldığı namespace'tir.

    Grafik sürümü `wallarm-ingress-5.3.0` ile eşleşmelidir.
1. Pod listesini alın:
    
    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Her pod'un durumu **STATUS: Running** veya **READY: N/N** olmalıdır. Örneğin:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
1. Wallarm Ingress controller adresine test [Path Traversal](../attacks-vulns-list.md#path-traversal) saldırısı ile istek gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Yeni sürümün, kötü niyetli isteği önceki sürümde olduğu gibi işlediğini kontrol edin.