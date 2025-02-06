```markdown
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Entegre Wallarm modülleriyle EOL NGINX Ingress denetleyicisinin yükseltilmesi

Bu talimatlar, dağıtılmış kullanım ömrünü tamamlamış Wallarm Ingress Denetleyici (sürüm 3.6 ve altı) 'yu Wallarm node 5.0 içeren yeni sürüme yükseltme adımlarını tanımlar.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "Yükseltilmiş Community Ingress NGINX Controller Sürümü"
    Eğer node sürümünüz 3.4 veya altından yükseltiyorsanız, lütfen unutmayın ki, Wallarm Ingress denetleyicisinin dayandığı Community Ingress NGINX Controller sürümü 0.26.2'den 1.11.3'e yükseltilmiştir.
    
    Community Ingress NGINX Controller 1.11.3'ün işleyişinde önemli değişiklikler yapıldığından, Wallarm Ingress denetleyicisinin yükseltilmesi sırasında bu değişikliklere uygun olarak yapılandırmasının ayarlanması gerekmektedir.

    Bu talimatlar, muhtemelen değiştirmeniz gereken Community Ingress NGINX Controller ayarlarının listesini içermektedir. Yine de, lütfen [Community Ingress NGINX Controller sürüm notlarına](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) dayanarak, yapılandırma geçişi için bireysel bir plan hazırlayın.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Wallarm teknik desteğine, filtreleme node modüllerini yükselttiğinizi bildirin (sadece node 2.18 veya altını yükseltiyorsanız)

Eğer node 2.18 veya altında yükseltiyorsanız, [Wallarm teknik desteğini](mailto:support@wallarm.com) Wallarm hesabınız için yeni IP listeleri mantığının etkinleştirilmesiyle birlikte filtreleme node modüllerini 5.0'a kadar güncellediğinizi bildirin.

Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Console'u açın ve [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün mevcut olduğunu doğrulayın.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (sadece node 2.16 veya altını yükseltiyorsanız)

Eğer Wallarm node 2.16 veya altını yükseltiyorsanız, lütfen Wallarm Console → **Vulnerabilities** → **Configure** üzerinden [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması, yükseltme işlemi sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülü devre dışı bırakmak bu riski azaltır.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Wallarm Helm chart deposunu güncelleyin

=== "Helm deposu kullanılıyorsa"
    ```bash
    helm repo update wallarm
    ```
=== "Çoğaltılmış GitHub deposu kullanılıyorsa"
    Aşağıdaki komutu kullanarak, tüm chart sürümlerini içeren [Wallarm Helm repository](https://charts.wallarm.com/) ekleyin. Wallarm Ingress Controller ile sonraki işlemler için lütfen Helm deposunu kullanın.

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## Adım 5: `values.yaml` yapılandırmasını güncelleyin

Wallarm Ingress denetleyicisini 5.0 sürümüne geçirmek için, `values.yaml` dosyasında belirtilen aşağıdaki yapılandırmaları güncelleyin:

* Community Ingress NGINX Controller'ın standart yapılandırması
* Wallarm modül yapılandırması

### Community Ingress NGINX Controller'ın standart yapılandırması

1. [Community Ingress NGINX Controller sürüm notlarını](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) (0.27.0 ve sonrası) kontrol edin ve `values.yaml` dosyasında değiştirilmesi gereken ayarları belirleyin.
2. `values.yaml` dosyasındaki belirlenen ayarları güncelleyin.

Muhtemelen değiştirmeniz gereken ayarlar şunlardır:

* Eğer istekler Wallarm Ingress Controller'a gönderilmeden önce bir yük dengeleyici tarafından geçiriliyorsa, [son kullanıcı genel IP adresinin doğru raporlanması](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClasses yapılandırması](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). Kullanılan Kubernetes API sürümü, yeni Ingress denetleyicisinde IngressClasses'in `.controller.ingressClass`, `.controller.ingressClassResource` ve `.controller.watchIngressWithoutClass` parametreleri ile yapılandırılmasını gerektirecek şekilde yükseltilmiştir.

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
* Artık varsayılan olarak etkin olan "admission webhook" üzerinden Ingress sözdiziminin doğrulanması.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress sözdizimi doğrulamasını devre dışı bırakma"
        Ingress sözdizimi doğrulamasının, Ingress nesnelerinin işleyişini istikrarsızlaştırması durumunda devre dışı bırakılması önerilir.
* [Label](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) formatı. Eğer `values.yaml` dosyası pod affinity kuralları belirliyorsa, bu kurallardaki etiket formatını şu şekilde değiştirin, örneğin:

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

### Wallarm modül yapılandırması

`values.yaml` dosyasında yer alan Wallarm modül yapılandırmasını aşağıdaki şekilde değiştirin:

* Eğer sürüm 2.18 veya altından yükseltiyorsanız, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). `values.yaml` dosyasından potansiyel olarak kaldırılması gereken aşağıdaki parametreler mevcuttur:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Çünkü Wallarm node 3.x'te IP listelerinin çekirdek mantığı önemli ölçüde değiştirildiğinden, IP listesi yapılandırmasının buna uygun olarak ayarlanması gerekmektedir.
* **Deploy** rolü için [API token'ı oluşturun](../../user-guides/settings/api-tokens.md) ve değerini `controller.wallarm.token` parametresine iletin.
* Aşağıda listelenen ayarların beklenen davranışının, [kapalı ("off") ve "monitoring" filtrasyon modlarının değişen mantığına](what-is-new.md#filtration-modes) uygun olduğundan emin olun:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console üzerinden yapılandırılan genel filtrasyon kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Console üzerinden yapılandırılan endpoint’e yönelik filtrasyon kuralları](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)

      Beklenen davranış, değişen filtrasyon modu mantığı ile uyuşmuyorsa, lütfen [Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations) ve [diğer ayarları](../../admin-en/configure-wallarm-mode.md) değişikliklere göre ayarlayın.
* Açıkça belirtilmiş [monitoring service yapılandırmasını](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) ortadan kaldırın. Yeni Wallarm Ingress denetleyici sürümünde monitoring service varsayılan olarak etkinleştirilmiştir ve ek bir yapılandırma gerektirmez.

    ```diff
    controller:
    wallarm:
      enabled: true
      tarantool:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* Eğer ConfigMap aracılığıyla yapılandırılmış `&/usr/share/nginx/html/wallarm_blocked.html` sayfası, engellenmiş isteklere döndürülüyorsa, lütfen yayımlanan değişikliklere göre [yapılandırmasını ayarlayın](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

    Yeni node sürümünde Wallarm örnek engelleme sayfası, varsayılan olarak logolu olmayan ve destek e-postası belirtilmeyen güncellenmiş bir kullanıcı arayüzüne [sahiptir](what-is-new.md#new-blocking-page).
* Eğer [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX direktifleri ile özelleştirilmiş `overlimit_res` saldırı tespiti yaptıysanız, lütfen bu ayarları [kural üzerine taşıyın](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) ve `values.yaml` dosyasından silin.

## Adım 6: `overlimit_res` saldırı tespit yapılandırmasını direktiflerden kurala taşıyın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## Adım 7: Tüm gelecek K8s manifest değişikliklerini kontrol edin

Beklenmedik Ingress denetleyici davranışları yaşamamak için, dağıtılmış Ingress denetleyici sürümü ile yeni sürüm arasındaki K8s manifest değişikliklerini [Helm Diff Plugin](https://github.com/databus23/helm-diff) kullanarak kontrol edin. Bu eklenti, dağıtılmış Ingress denetleyici sürümü ile yeni sürüm arasındaki K8s manifestleri arasındaki farkı gösterir.

Eklentiyi kurmak ve çalıştırmak için:

1. Eklentiyi kurun:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress denetleyici chart'ının Helm release adı
    * `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı namespace
    * `<PATH_TO_VALUES>`: [Ingress denetleyici 5.0 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Hiçbir değişikliğin çalışan servislerin istikrarını etkilemediğinden emin olun ve stdout üzerinden gelen hataları dikkatlice inceleyin.

    Eğer stdout boş ise, `values.yaml` dosyasının geçerli olduğundan emin olun.

Lütfen aşağıdaki yapılandırma değişikliklerini not edin:

* Değiştirilemeyen (immutable) alanlar, örn. Deployment ve/veya StatefulSet seçicileri.
* Pod etiketleri. Bu değişiklikler, NetworkPolicy işleyişinin sonlanmasına yol açabilir, örn.:

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
* Yeni etiketlerle yapılandırılan Prometheus, örn.:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Selectors
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
           # Replacers
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

## Adım 8: Ingress denetleyicisini yükseltin

Wallarm Ingress denetleyicisini yükseltmenin üç farklı yolu vardır. Ortamınızda bir yük dengeleyici dağıtılmış olup olmamasına bağlı olarak, yükseltme yöntemi seçin:

* Geçici Ingress denetleyicisinin dağıtılması
* Ingress denetleyici release'inin düzenli yeniden oluşturulması
* Yük dengeleyiciyi etkilemeden Ingress denetleyici release'inin yeniden oluşturulması

!!! warning "Staging ortamı veya minikube kullanılması durumunda"
    Eğer Wallarm Ingress denetleyicisi staging ortamınıza dağıtıldıysa, önce onu yükseltmeniz önerilir. Tüm servisler staging ortamında sorunsuz çalıştığında, üretim ortamında yükseltme işlemine geçebilirsiniz.

    Minikube veya başka bir servis kullanılarak güncellenmiş yapılandırma ile [Wallarm Ingress denetleyicisinin 5.0 sürümünün dağıtılması](../../admin-en/installation-kubernetes-en.md) önerilse bile, önce tüm servislerin beklendiği gibi çalıştığından emin olun ve ardından üretim ortamında Ingress denetleyicisini yükseltin.

    Bu yaklaşım, üretim ortamındaki servislerin kesintiye uğrama riskini önlemeye yardımcı olur.

### Yöntem 1: Geçici Ingress denetleyicisinin dağıtılması

Bu yöntemi kullanarak, Ingress Controller 5.0'ı ortamınızda ek bir varlık olarak dağıtabilir ve trafiği kademeli olarak ona yönlendirebilirsiniz. Bu yöntem, servislerde geçici kesinti yaşanmasını bile önlemeye yardımcı olur ve güvenli geçişi sağlar.

1. Önceki sürüme ait `values.yaml` dosyasındaki IngressClass yapılandırmasını, Ingress denetleyicisi 5.0 için kullanılacak `values.yaml` dosyasına kopyalayın.

    Bu yapılandırma ile Ingress denetleyicisi Ingress nesnelerini tanımlar fakat trafiklerini işlemez.
2. Ingress denetleyicisini 5.0 olarak dağıtın:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress denetleyici chart'ının Helm release'ı için belirlenen isim
    * `<NAMESPACE>`: Ingress denetleyicisinin dağıtılacağı namespace
    * `<PATH_TO_VALUES>`: [Ingress denetleyici 5.0 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Tüm servislerin doğru çalıştığından emin olun.
4. Trafiği yeni Ingress denetleyicisine kademeli olarak yönlendirin.

### Yöntem 2: Ingress denetleyicisi release'inin düzenli yeniden oluşturulması

**Eğer yük dengeleyici ve Ingress denetleyicisi aynı Helm chart içinde tanımlı DEĞİLSE**, sadece Helm release'ini yeniden oluşturabilirsiniz. Bu işlem birkaç dakika sürecek ve Ingress denetleyicisi bu süre zarfında kullanılamaz olacaktır.

!!! warning "Eğer Helm chart, yük dengeleyici yapılandırmasını da ayarlıyorsa"
    Eğer Helm chart, Ingress denetleyicisi ile birlikte yük dengeleyici yapılandırmasını ayarlıyorsa, release'in yeniden oluşturulması uzun süreli bir yük dengeleyici kesintisine yol açabilir (cloud provider'a bağlıdır). Sabit bir adres atanmadıysa, yükseltme sonrası yük dengeleyici IP adresi değişebilir.

    Bu yöntemi kullanırken tüm olası riskleri analiz ediniz.

Ingress denetleyici release'ini yeniden oluşturmak için:

=== "Helm CLI"
    1. Önceki release'i silin:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: Ingress denetleyici chart'ının Helm release'ının adı

        * `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı namespace

        Komutu yürütürken `--wait` seçeneğini kullanmayın çünkü bu yükseltme süresini artırabilir.

    2. Ingress denetleyici 5.0 ile yeni release'i oluşturun:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: Ingress denetleyici chart'ının Helm release'ı için belirlenen isim
        * `<NAMESPACE>`: Ingress denetleyicisinin dağıtılacağı namespace
        * `<PATH_TO_VALUES>`: [Ingress denetleyici 5.0 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
=== "Terraform CLI"
    1. Yükseltme süresini kısaltmak için Terraform yapılandırmasında `wait = false` seçeneğini ayarlayın:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. Önceki release'i silin:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Ingress denetleyicisi 5.0 ile yeni release'i oluşturun:

        ```bash
        terraform apply -target=helm_release.release
        ```

### Yöntem 3: Yük dengeleyiciyi etkilemeden Ingress denetleyici release'inin yeniden oluşturulması

Cloud provider tarafından yapılandırılmış yük dengeleyici kullanılıyorsa, bu yöntem Ingress denetleyicisini yükseltirken yük dengeleyiciyi etkilemediği için önerilir.

Release'in yeniden oluşturulması birkaç dakika sürecek ve bu süre zarfında Ingress denetleyicisi kullanılamayacaktır.

1. Silinecek objeleri edinin (yük dengeleyici hariç):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    `yq` aracını yüklemek için lütfen [aşağıdaki talimatları](https://pypi.org/project/yq/) kullanın.

    Silinecek objeler `objects-to-remove.txt` dosyasına yazdırılacaktır.
2. Listelenen objeleri silin ve release'i yeniden oluşturun:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.0 -f `<PATH_TO_VALUES>`
    ```

    Servis kesintisini azaltmak için komutların ayrı ayrı yürütülmesi önerilmez.
3. Tüm objelerin oluşturulduğundan emin olun:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    Çıktı, tüm objelerin zaten var olduğunu belirtmelidir.

Komutlarda geçen parametreler:

* `<RELEASE_NAME>`: Ingress denetleyici chart'ının Helm release'ının adı
* `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı namespace
* `<PATH_TO_VALUES>`: [Ingress denetleyici 5.0 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu

## Adım 9: Yükseltilmiş Ingress denetleyicisini test edin

1. Helm chart sürümünün güncellendiğini kontrol edin:

    ```bash
    helm ls
    ```

    Chart sürümü `wallarm-ingress-5.3.0` ile uyumlu olmalıdır.
2. `<INGRESS_CONTROLLER_NAME>` ismi ile Wallarm Ingress denetleyicisine ait pod listesini alın:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Her podun durumu **STATUS: Running** veya **READY: N/N** olmalıdır. Örneğin:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. Wallarm Ingress denetleyici adresine, test [Path Traversal](../../attacks-vulns-list.md#path-traversal) saldırısını içeren isteği gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Eğer filtreleme node, `block` modunda çalışıyorsa, isteğe cevaben `403 Forbidden` kodu dönecektir ve saldırı Wallarm Console → **Attacks** bölümünde görüntülenecektir.

## Adım 10: Yayınlanan değişikliklere göre Ingress annotations ayarlarını düzenleyin

Aşağıdaki Ingress annotations ayarlarını Ingress denetleyicinin 5.0 sürümünde yayınlanan değişikliklere göre ayarlayın:

1. Eğer sürüm 2.18 veya altından yükseltiyorsanız, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). Wallarm node 3.x’te IP listeleri çekirdek mantığı önemli ölçüde değiştirildiğinden, uygulanmış ise Ingress annotations üzerinden IP listesi yapılandırmasının buna uygun olarak değiştirilmesi gerekir.
2. Aşağıda listelenen ayarların beklenen davranışının, [kapalı ("off") ve "monitoring" filtrasyon modlarının değişen mantığına](what-is-new.md#filtration-modes) uygun olduğundan emin olun:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console üzerinden yapılandırılan genel filtrasyon kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Wallarm Console üzerinden yapılandırılan endpoint’e yönelik filtrasyon kuralları](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)

      Beklenen davranış, değişen filtrasyon modu mantığı ile uyuşmuyorsa, lütfen [Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations) 'ı değişikliklere göre ayarlayın.
3. Eğer Ingress, `nginx.ingress.kubernetes.io/wallarm-instance` ile etiketlenmişse, bu annotation'ı `nginx.ingress.kubernetes.io/wallarm-application` olarak yeniden adlandırın.

    Yalnızca annotation ismi değişmiştir, mantığı aynı kalmaktadır. Eski isimdeki annotation yakın zamanda kullanımdan kaldırılacaktır, bu nedenle yeniden adlandırmanız önerilir.
4. Eğer Ingress annotations üzerinden yapılandırılmış `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenmiş isteklerde döndürülüyorsa, lütfen yayımlanan değişikliklere göre [yapılandırmasını ayarlayın](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

    Yeni node sürümlerinde Wallarm engelleme sayfası, varsayılan olarak logolu olmayan ve destek e-postası belirtilmeyen güncellenmiş bir kullanıcı arayüzüne [sahiptir](what-is-new.md#new-blocking-page).

## Adım 11: Threat Replay Testing modülünü yeniden etkinleştirin (sadece node 2.16 veya altını yükseltiyorsanız)

[Threat Replay Testing modülü kurulumu ile ilgili önerileri](../../vulnerability-detection/threat-replay-testing/setup.md) inceleyin ve gerekiyorsa yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitiflere neden olmadığından emin olun. Yanlış pozitifler tespit ederseniz, lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.
```