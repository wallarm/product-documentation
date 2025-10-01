[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm modülleri entegre EOL NGINX Ingress controller’ı yükseltme

Bu talimatlar, dağıtılmış kullanım ömrü dolmuş (EOL) Wallarm Ingress Controller’ı (sürüm 3.6 ve altı) Wallarm node 6.x içeren yeni sürüme yükseltme adımlarını açıklar.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "Yükseltilen Community Ingress NGINX Controller sürümü"
    Node’u 3.4 veya daha düşük bir sürümden yükseltiyorsanız, Wallarm Ingress controller’ın temel aldığı Community Ingress NGINX Controller sürümünün 0.26.2’den 1.11.8’e yükseltildiğini lütfen unutmayın.
    
    Community Ingress NGINX Controller 1.11.8’in çalışma biçimi önemli ölçüde değiştiğinden, Wallarm Ingress controller yükseltmesi sırasında yapılandırmanın bu değişikliklere göre ayarlanması gerekir.

    Bu talimatlar, muhtemelen değiştirmeniz gereken Community Ingress NGINX Controller ayarlarının bir listesini içerir. Yine de, lütfen [Community Ingress NGINX Controller sürüm notlarına](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) dayanarak yapılandırma geçişi için bireysel bir plan hazırlayın. 

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Filtreleme node modüllerini yükselttiğinizi Wallarm teknik desteğine bildirin (yalnızca node 2.18 veya altını yükseltiyorsanız)

Node 2.18 veya altını yükseltiyorsanız, [Wallarm teknik desteğine](mailto:support@wallarm.com) filtreleme node modüllerini 6.x’e güncellediğinizi bildirin ve Wallarm hesabınız için yeni IP listeleri mantığının etkinleştirilmesini isteyin.

Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Console’u açın ve [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün mevcut olduğundan emin olun.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (yalnızca node 2.16 veya altını yükseltiyorsanız)

Wallarm node 2.16 veya altını yükseltiyorsanız, lütfen Wallarm Console → **Vulnerabilities** → **Configure** bölümünden [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması, yükseltme süreci sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Wallarm Helm chart deposunu güncelleyin

=== "Helm deposunu kullanıyorsanız"
    ```bash
    helm repo update wallarm
    ```
=== "Klonlanmış GitHub deposunu kullanıyorsanız"
    Aşağıdaki komutla tüm chart sürümlerini içeren [Wallarm Helm deposunu](https://charts.wallarm.com/) ekleyin. Wallarm Ingress controller ile sonraki çalışmalarda lütfen Helm deposunu kullanın.

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## Adım 5: `values.yaml` yapılandırmasını güncelleyin
<a id="step-5-update-the-valuesyaml-configuration"></a>

Wallarm Ingress controller 6.x’e geçmek için `values.yaml` dosyasında belirtilen aşağıdaki yapılandırmayı güncelleyin:

* Community Ingress NGINX Controller’ın standart yapılandırması
* Wallarm modülünün yapılandırması

### Community Ingress NGINX Controller’ın standart yapılandırması

1. [Community Ingress NGINX Controller sürüm notlarını](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) 0.27.0 ve sonrası için inceleyin ve `values.yaml` dosyasında değiştirilecek ayarları belirleyin.
2. Belirlenen ayarları `values.yaml` dosyasında güncelleyin.

Muhtemelen değiştirmeniz gereken ayarlar şunlardır:

* İstekler Wallarm Ingress controller’a gönderilmeden önce bir yük dengeleyiciden geçiyorsa, [son kullanıcı genel IP adresinin doğru raporlanması](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClasses yapılandırması](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). Yeni Ingress controller’da kullanılan Kubernetes API sürümü yükseltildi, bu da IngressClasses’in `.controller.ingressClass`, `.controller.ingressClassResource` ve `.controller.watchIngressWithoutClass` parametreleri ile yapılandırılmasını gerektirir.

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [ConfigMap (`.controller.config`) parametre seti](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/), örneğin: 

    ```diff
    controller:
    config:
    +  allow-backend-server-header: "false"
      enable-brotli: "true"
      gzip-level: "3"
      hide-headers: Server
      server-snippet: |
        proxy_request_buffering on;
        wallarm_enable_libdetection on;
    ```
* ["admission webhook" ile Ingress sözdizimi doğrulaması](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) artık varsayılan olarak etkindir.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress sözdizimi doğrulamasının devre dışı bırakılması"
        Ingress sözdizimi doğrulamasını yalnızca Ingress nesnelerinin çalışmasını istikrarsızlaştırıyorsa devre dışı bırakmanız önerilir. 
* [Etiket](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) biçimi. `values.yaml` dosyası pod yakınlık (affinity) kuralları belirtiyorsa, bu kurallardaki etiket biçimini değiştirin, örneğin:

    ```diff
    controller:
      affinity:
        podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
                matchExpressions:
    -            - key: app
    +            - key: app.kubernetes.io/name
                operator: In
                values:
                - waf-ingress
    -            - key: component
    +            - key: app.kubernetes.io/component
                operator: In
                values:
    -              - waf-ingress
    +              - controller
    -            - key: release
    +            - key: app.kubernetes.io/instance
                operator: In
                values:
                - waf-ingress-ingress
            topologyKey: kubernetes.io/hostname
            weight: 100
    ```

### Wallarm modülünün yapılandırması

`values.yaml` dosyasında ayarlanmış Wallarm modülü yapılandırmasını aşağıdaki gibi değiştirin:

* Sürüm 2.18 veya daha düşükten yükseltiyorsanız, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). `values.yaml` içinden potansiyel olarak silinecek şu parametreler vardır:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    IP listesi çekirdek mantığı Wallarm node 3.x’te önemli ölçüde değiştiğinden, IP listesi yapılandırmasının uygun şekilde ayarlanması gerekir.
* [Tarantool’dan wstore’a geçiş](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) nedeniyle, Helm değerleri yeniden adlandırıldı: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`. Eğer postanalytics belleği açıkça [tahsis edildiyse](../../admin-en/configuration-guides/allocate-resources-for-node.md), bu değişikliği `values.yaml` içinde uygulayın.
* [**Node deployment/Deployment** kullanımı] için bir API token oluşturun(../../user-guides/settings/api-tokens.md) ve değerini `controller.wallarm.token` parametresine geçirin.
* Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık geldiğinden emin olun:
      
      * [`wallarm_mode` yönergesi](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console’da yapılandırılan genel filtreleme kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Console’da yapılandırılan uç nokta hedefli filtreleme kuralları](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)

      Beklenen davranış filtreleme modu mantığındaki değişikliklerle uyuşmuyorsa, lütfen [Ingress açıklamalarını](../../admin-en/configure-kubernetes-en.md#ingress-annotations) ve [diğer ayarları](../../admin-en/configure-wallarm-mode.md) yayınlanan değişikliklere uyacak şekilde ayarlayın.
* Açık [izleme servisi yapılandırmasını](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) kaldırın. Yeni Wallarm Ingress controller sürümünde izleme servisi varsayılan olarak etkindir ve ek bir yapılandırma gerektirmez.

    ```diff
    controller:
    wallarm:
      enabled: true
    -  tarantool:
    +  wstore:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* ConfigMap ile yapılandırılmış `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenen isteklere döndürülüyorsa, yapılandırmasını yayınlanan değişikliklere göre [ayarlayın](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

    Yeni node sürümünde, Wallarm örnek engelleme sayfasının [güncellenmiş bir arayüzü](what-is-new.md#new-blocking-page) vardır; varsayılan olarak logo ve destek e-postası içermez.
* Eğer `overlimit_res` saldırı tespitini [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleriyle özelleştirdiyseniz, lütfen bu ayarları [kurala aktarın](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) ve `values.yaml` dosyasından silin.

## Adım 6: `overlimit_res` saldırı tespiti yapılandırmasını yönergelerden kurala aktarın
<a id="step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule"></a>

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## Adım 7: Gelecek tüm K8s manifest değişikliklerini inceleyin

Ingress controller davranışının beklenmedik şekilde değişmesini önlemek için, [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak gelecek tüm K8s manifest değişikliklerini inceleyin. Bu eklenti, dağıtılmış Ingress controller sürümünün K8s manifestleri ile yenisinin manifestleri arasındaki farkı çıktılar.

Eklentiyi kurup çalıştırmak için:

1. Eklentiyi kurun:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürüm adı
    * `<NAMESPACE>`: Ingress controller’ın dağıtıldığı namespace
    * `<PATH_TO_VALUES>`: [Ingress controller 6.x ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Hiçbir değişikliğin çalışan servislerin stabilitesini etkilemediğinden emin olun ve stdout’tan gelen hataları dikkatlice inceleyin.

    Stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

Lütfen aşağıdaki yapılandırmalardaki değişikliklere dikkat edin:

* Değiştirilemeyen (immutable) alanlar; örneğin Deployment ve/veya StatefulSet seçicileri.
* Pod etiketleri. Değişiklikler, örneğin aşağıdaki gibi, NetworkPolicy’nin çalışmasının durmasına yol açabilir:

    ```diff
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    spec:
      egress:
      - to:
        - namespaceSelector:
            matchExpressions:
            - key: name
              operator: In
              values:
              - kube-system # ${NAMESPACE}
          podSelector:
            matchLabels: # RELEASE_NAME=waf-ingress
    -         app: waf-ingress
    +         app.kubernetes.io/component: "controller"
    +         app.kubernetes.io/instance: "waf-ingress"
    +         app.kubernetes.io/name: "waf-ingress"
    -         component: waf-ingress
    ```
* Yeni etiketlerle Prometheus yapılandırması, örneğin:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Seçiciler
    -    - source_labels: [__meta_kubernetes_pod_label_app]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_release]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_instance]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_component]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
           action: keep
    -      regex: waf-ingress
    +      regex: controller
         - source_labels: [__meta_kubernetes_pod_container_port_number]
           action: keep
           regex: "10254|18080"
           # Değiştiriciler
         - action: replace
           target_label: __metrics_path__
           regex: /metrics
         - action: labelmap
           regex: __meta_kubernetes_pod_label_(.+)
         - source_labels: [__meta_kubernetes_namespace]
           action: replace
           target_label: kubernetes_namespace
         - source_labels: [__meta_kubernetes_pod_name]
           action: replace
           target_label: kubernetes_pod_name
         - source_labels: [__meta_kubernetes_pod_name]
           regex: (.*)
           action: replace
           target_label: instance
           replacement: "$1"
    ```
* Diğer tüm değişiklikleri analiz edin.

## Adım 8: Ingress controller’ı yükseltin

Wallarm Ingress controller’ı yükseltmenin üç yolu vardır. Ortamınızda bir yük dengeleyici olup olmamasına bağlı olarak yükseltme yöntemini seçin:

* Geçici Ingress controller dağıtımı
* Ingress controller sürümünün olağan şekilde yeniden oluşturulması
* Yük dengeleyiciyi etkilemeden Ingress controller sürümünün yeniden oluşturulması

!!! warning "Staging ortamı veya minikube kullanımı"
    Wallarm Ingress controller staging ortamınıza dağıtılmışsa, önce onu yükseltmeniz önerilir. Tüm servisler staging ortamında doğru şekilde çalışıyorsa, üretim ortamında yükseltme işlemine devam edebilirsiniz.

    Aksi takdirde, [Wallarm Ingress controller 6.x’i](../../admin-en/installation-kubernetes-en.md) güncellenmiş yapılandırmayla önce minikube veya başka bir servis kullanarak dağıtmanız önerilir. Tüm servislerin beklendiği gibi çalıştığından emin olun ve ardından üretim ortamında Ingress controller’ı yükseltin.

    Bu yaklaşım, üretim ortamındaki servislerin kesinti yaşamasını önlemeye yardımcı olur.

### Yöntem 1: Geçici Ingress controller dağıtımı

Bu yöntemle, Ingress Controller 6.x’i ortamınıza ek bir varlık olarak dağıtabilir ve trafiği ona kademeli olarak yönlendirebilirsiniz. Bu, servislerin geçici dahi olsa kesintiye uğramasını önlemeye ve güvenli bir geçiş sağlamaya yardımcı olur.

1. Ingress controller 6.x için `values.yaml` dosyasına, önceki sürümün `values.yaml` dosyasındaki IngressClass yapılandırmasını kopyalayın.

    Bu yapılandırmayla Ingress controller, Ingress nesnelerini tanıyacak ancak trafiğini işlemeyecektir.
2. Ingress controller 6.x’i dağıtın:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürüm adı
    * `<NAMESPACE>`: Ingress controller’ın dağıtılacağı namespace
    * `<PATH_TO_VALUES>`: [Ingress controller 6.x ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Tüm servislerin doğru şekilde çalıştığından emin olun.
4. Yükü yeni Ingress controller’a kademeli olarak taşıyın.

### Yöntem 2: Ingress controller sürümünün olağan şekilde yeniden oluşturulması

**Yük dengeleyici ve Ingress controller aynı Helm chart’ında tanımlı DEĞİLSE**, sadece Helm sürümünü yeniden oluşturabilirsiniz. Bu işlem birkaç dakika sürecek ve bu süre boyunca Ingress controller kullanılamayacaktır.

!!! warning "Helm chart bir yük dengeleyici yapılandırması da belirliyorsa"
    Helm chart, Ingress controller ile birlikte bir yük dengeleyici yapılandırması belirliyorsa, sürümün yeniden oluşturulması uzun bir yük dengeleyici kesintisine yol açabilir (bulut sağlayıcısına bağlıdır). Sabit bir adres atanmadıysa yükseltmeden sonra yük dengeleyici IP adresi değişebilir.

    Bu yöntemi kullanıyorsanız lütfen tüm potansiyel riskleri analiz edin.

Ingress controller sürümünü yeniden oluşturmak için:

=== "Helm CLI"
    1. Önceki sürümü silin:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürüm adı

        * `<NAMESPACE>`: Ingress controller’ın dağıtıldığı namespace

        Komutu çalıştırırken lütfen `--wait` seçeneğini kullanmayın; bu seçenek yükseltme süresini artırabilir.

    2. Ingress controller 6.x ile yeni bir sürüm oluşturun:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürüm adı

        * `<NAMESPACE>`: Ingress controller’ın dağıtılacağı namespace

        * `<PATH_TO_VALUES>`: [Ingress controller 6.x ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
=== "Terraform CLI"
    1. Yükseltme süresini azaltmak için Terraform yapılandırmasında `wait = false` seçenek değerini ayarlayın:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. Önceki sürümü silin:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Ingress controller 6.x ile yeni sürümü oluşturun:

        ```bash
        terraform apply -target=helm_release.release
        ```

### Yöntem 3: Yük dengeleyiciyi etkilemeden Ingress controller sürümünün yeniden oluşturulması

Bulut sağlayıcısı tarafından yapılandırılan bir yük dengeleyici kullanıyorsanız, yük dengeleyiciyi etkilemediği için Ingress controller’ı bu yöntemle yükseltmeniz önerilir.

Sürümün yeniden oluşturulması birkaç dakika sürecek ve bu süre boyunca Ingress controller kullanılamayacaktır.

1. Silinecek nesneleri (yük dengeleyici hariç) alın:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    `yq` aracını kurmak için lütfen [talimatları](https://pypi.org/project/yq/) kullanın.

    Silinecek nesneler `objects-to-remove.txt` dosyasına yazdırılacaktır.
2. Listelenen nesneleri silin ve sürümü yeniden oluşturun:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 6.5.1 -f `<PATH_TO_VALUES>`
    ```

    Servis kesintisini azaltmak için komutları ayrı ayrı çalıştırmanız ÖNERİLMEZ.
3. Tüm nesnelerin oluşturulduğundan emin olun:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    Çıktı, tüm nesnelerin zaten var olduğunu söylemelidir.

Komutlarda şu parametreler geçilir:

* `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürüm adı
* `<NAMESPACE>`: Ingress controller’ın dağıtıldığı namespace
* `<PATH_TO_VALUES>`: [Ingress controller 6.x ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu

## Adım 9: Yükseltilen Ingress controller’ı test edin

1. Helm chart sürümünün güncellendiğini kontrol edin:

    ```bash
    helm ls
    ```

    Chart sürümü `wallarm-ingress-6.5.1` ile uyumlu olmalıdır.
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

3. Wallarm Ingress controller adresine test [Path Traversal](../../attacks-vulns-list.md#path-traversal) saldırısı içeren isteği gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Filtreleme node’u `block` modunda çalışıyorsa, isteğe yanıtta `403 Forbidden` kodu döndürülür ve saldırı Wallarm Console → **Attacks** bölümünde görüntülenir.

## Adım 10: Ingress açıklamalarını (annotations) yayınlanan değişikliklere göre ayarlayın

Ingress controller 6.x’te yayınlanan değişikliklere göre aşağıdaki Ingress açıklamalarını ayarlayın:

1. Sürüm 2.18 veya daha düşükten yükseltiyorsanız, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). IP listesi çekirdek mantığı Wallarm node 3.x’te önemli ölçüde değiştiğinden, uygulanmışsa Ingress açıklamalarını değiştirerek IP listesi yapılandırmasını uygun şekilde ayarlamak gerekir.
1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık geldiğinden emin olun:
      
      * [`wallarm_mode` yönergesi](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console’da yapılandırılan genel filtreleme kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Console’da yapılandırılan uç nokta hedefli filtreleme kuralları](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)

      Beklenen davranış filtreleme modu mantığındaki değişikliklerle uyuşmuyorsa, lütfen [Ingress açıklamalarını](../../admin-en/configure-kubernetes-en.md#ingress-annotations) yayınlanan değişikliklere uyacak şekilde ayarlayın.
1. Ingress, `nginx.ingress.kubernetes.io/wallarm-instance` ile açıklanmışsa, bu açıklamanın adını `nginx.ingress.kubernetes.io/wallarm-application` olarak değiştirin.

    Yalnızca açıklama adı değişti, mantığı aynı kaldı. Eski adla açıklama yakında kullanımdan kaldırılacağından, daha önce yeniden adlandırmanız önerilir.
1. Ingress açıklamaları ile yapılandırılmış `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenen isteklere döndürülüyorsa, yapılandırmasını yayınlanan değişikliklere göre [ayarlayın](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

    Yeni node sürümlerinde, Wallarm engelleme sayfasının [güncellenmiş bir arayüzü](what-is-new.md#new-blocking-page) vardır; varsayılan olarak logo ve destek e-postası içermez.

## Adım 11: Threat Replay Testing modülünü yeniden etkinleştirin (yalnızca node 2.16 veya altını yükseltiyorsanız)

[Threat Replay Testing modülü kurulumu ile ilgili önerileri](../../vulnerability-detection/threat-replay-testing/setup.md) inceleyin ve gerekirse yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitiflere yol açmadığından emin olun. Yanlış pozitifler keşfederseniz, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.