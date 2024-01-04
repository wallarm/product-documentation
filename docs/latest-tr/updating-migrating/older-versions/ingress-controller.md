[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# EOL NGINX Ingress controller'ını Wallarm modülleriyle güncelleme

Bu talimatlar, dağıtılmış son ömür Wallarm Ingress Denetleyicisi'nin (versiyon 3.6 ve altı) yeni versiyonuna Wallarm düğümü 4.8 ile yükseltme adımlarını açıklar.

--8<-- "../include-tr/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "Community Ingress NGINX Controller'ın yükseltilmiş versiyonu"
    Eğer düğümü 3.4 veya altı bir versiyondan yükseltiyorsanız, lütfen not alın ki Wallarm Ingress denetleyicisinin üzerine kurulduğu Community Ingress NGINX Controller'ın versiyonu 0.26.2'den 1.9.5'e yükseltilmiştir.
    
    Community Ingress NGINX Controller 1.9.5 işleminin çokça değiştiğinden dolayı, yapılandırması bu değişikliklere uygulanmalıdır Wallarm Ingress denetleyicisi yükseltme süresince.

    Bu talimatlarda Community Ingress NGINX Controller'ın ayarlarının listesi bulunur ki muhtemelen değişmesi gerekebilir. Yine de, lütfen [Community Ingress NGINX Controller yayın notlarına](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) dayanan bir yapılandırma göç planını çıkarın.

## Gereklilikler

--8<-- "../include-tr/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Adım 1: Wallarm teknik destek ekibine filtreleme düğümü modüllerini yükselttiğinizi bildirin (yalnızca düğüm 2.18 veya altı yükseltiliyorsa)

Eğer düğüm 2.18 veya altı bir versiyon yükseltiliyorsa, Wallarm teknik destek ekibine 4.8'deki filtreleme düğümü modüllerini güncellediğinizi bildirin ve Wallarm hesabınızdaki yeni IP listeleri mantığını etkinleştirmelerini isteyin.

Yeni IP listeleri mantığı etkinleştirildiğinde, lütfen Wallarm Console'u açın ve [**IP listeleri**](../../user-guides/ip-lists/overview.md) bölümünün ulaşılabilir olduğundan emin olun.

## Adım 2: Etkin tehdit teyit etme modülünü devre dışı bırakın (yalnızca düğüm 2.16 veya daha alt bir versiyon yükseltiliyorsa)

Eğer Wallarm düğüm 2.16 veya daha düşük bir versiyon yükseltiliyorsa, lütfen Wallarm Console → **Zafiyetler** → **Configure**'da [Etkin tehdit teyit etme](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülünü devre dışı bırakın.

Bu modülün çalışması, yükseltme süreci sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) sebep olabilir. Modülü devre dışı bırakma, bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

## Adım 4: Wallarm Helm tablosu deposunu güncelleyin

=== "Helm deposunu kullanıyorsanız"
    ```bash
    helm repo update wallarm
    ```
=== "GitHub deposunu kullanıyorsanız"
    Tüm tablo sürümlerini içeren [Wallarm Helm deposunu](https://charts.wallarm.com/) aşağıdaki komutu kullanarak ekleyin. Lütfen Wallarm Ingress denetleyicisi ile daha fazla çalışmak için Helm deposunu kullanın.

    ```bash
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

## Adım 5: `values.yaml` yapılandırmasını güncelleyin

Wallarm Ingress denetleyicisi 4.8'e geçiş yapmak için, `values.yaml` dosyasında belirtilen aşağıdaki yapılandırmayı güncelleyin:

* Community Ingress NGINX Controller'ın standart yapılandırması
* Wallarm modülü yapılandırması

### Community Ingress NGINX Controller'ın standart yapılandırması

1. Community Ingress NGINX Controller'ın [yayın notlarına](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) hızlıca göz atın ve `values.yaml` dosyasında değiştirilecek ayarları belirleyin.
2. `values.yaml` dosyasındaki belirlenen ayarları güncelleyin.

Aşağıdakiler muhtemelen değiştirilmesi gereken ayarlardır:

* Wallarm Ingress denetleyicisine gönderilmeden önce bir yük dengeleyicisi tarafından geçirilen isteklerde [son kullanıcının kamu IP adresinin doğru raporlanması](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClasses yapılandırması](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). Kullanılan Kubernetes API'sinin sürümü yeni Ingress denetleyicisinde yükseltildi ki bu, IngressClasses'ın `.controller.ingressClass`, `.controller.ingressClassResource` ve `.controller.watchIngressWithoutClass` parametreleri ile yapılandırılmasını gerektirir.

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
* ["admission webhook" ile Ingress sözdiziminin doğrulanması](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) artık varsayılan olarak etkinleştirilmiştir.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Ingress sözdiziminin doğrulamasının devre dışı bırakılması"
        Yalnızca Ingress nesnelerinin işleyişini istikrarsızlaştırıyorsa Ingress sözdiziminin doğrulamasını devre dışı bırakmanız önerilir. 
* [Etiket](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) formatı. Eğer `values.yaml` dosyası pod afinite kurallarını belirliyorsa, bu kurallardaki etiket formatını değiştirin, örneğin:

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

### Wallarm modülü yapılandırması

`values.yaml` dosyasında belirtilen Wallarm modülü yapılandırmasını aşağıdaki şekilde değiştirin:

* Eğer 2.18 veya daha düşük bir versiyondan yükseltiliyorsa, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). Aşağıdaki parametreler `values.yaml` dosyasından muhtemelen silinmelidir:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Wallarm düğüm 3.x'teki IP listesi çekirdek mantığı önemli ölçüde değiştiği için, IP listesi yapılandırmasının uygun biçimde ayarlanması gerekmektedir.
* Listelenen ayarların beklenen davranışının [değiştirilmiş `off` ve `monitoring` filtrasyon modları mantığına](what-is-new.md#filtration-modes) uygun olduğundan emin olun:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console'da yapılandırılan genel filtrasyon kuralı](../../user-guides/settings/general.md)
      * [Wallarm Console'da yapılandırılan düşük seviyeli filtrasyon kuralları](../../user-guides/rules/wallarm-mode-rule.md)

      Eğer beklenen davranış, değiştirilen filtrasyon modu mantığına uymuyorsa, lütfen [Ingress notlarını](../../admin-en/configure-kubernetes-en.md#ingress-annotations) ve [diğer ayarları](../../admin-en/configure-wallarm-mode.md) yayımlanan değişikliklere ayarlayın.
* Açık bir şekilde [monitoring servis yapılandırması](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) yaptıysanız, bundan kurtulun. Yeni Wallarm Ingress denetleyicisi versiyonunda, monitoring servisi varsayılan olarak etkinleştirilmiştir ve herhangi bir ek yapılandırmayı gerektirmez.

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
* Bloke olan isteklere ConfigMap üzerinden yapılandırılan `&/usr/share/nginx/html/wallarm_blocked.html` sayfası dönüyorsa, [yapılandırmasını](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) yayımlanan değişikliklere ayarlayın.

    Yeni düğüm versiyonunda, Wallarm'ın örnek bloklama sayfası [güncellenmiş](what-is-new.md#new-blocking-page) bir kullanıcı arayüzüne sahiptir ve varsayılan olarak logosu ve destek e-postası belirtilmemiştir.
* Eğer [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX direktifleri üzerinden özelleştirilmiş `overlimit_res` saldırı tespiti yapıldıysa, lütfen bu ayarları kurala [taşıyın](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) ve `values.yaml` dosyasından silin.

## Adım 6: `overlimit_res` saldırı tespiti yapılandırmasını direktiflerden kurallara taşıma

--8<-- "../include-tr/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## Adım 7: Tüm gelen K8s manifost değişikliklerini kontrol edin

Beklenmeyen şekilde değişen Ingress denetleyici davranışını önlemek için, dağıtılmış Ingress denetleyici versiyonunun ve yeni olanın K8s manifostları arasındaki farkı [Helm Diff Plugin](https://github.com/databus23/helm-diff) ile kontrol edin. Bu eklenti, Ingress denetleyici versiyonunun ve yeni birinin K8s manifostları arasındaki farkı çıkarır.

Eklentiyi kurmak ve çalıştırmak için:

1. Eklentiyi kurun:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Eklentiyi çalıştırın:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress denetleyici tablosu ile Helm sürümünün adı
    * `<NAMESPACE>`: Ingress denetleyicisinin dağıtılı olduğu ad alanı
    * `<PATH_TO_VALUES>`: [Ingress denetleyici 4.8 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Hiçbir değişikliğin hizmetlerin istikrarını etkileyemeyeceğinden ve stdout hatalarını dikkatlice inceleyin.

    Eğer stdout boşsa, `values.yaml` dosyasının geçerli olduğundan emin olun.

Lütfen aşağıdaki yapılandırmanın değişikliklerine dikkat edin:

* Değişmez alan, örneğin dağıtım ve/veya StatefulSet seçicileri.
* Pod etiketleri. Bu değişiklikler, NetworkPolicy işleminin durmasına yol açabilir, örneğin:

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
* Yeni etiketlerle yeni Prometheus yapılandırması, örneğin:

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
* Tüm diğer değişiklikleri analiz edin.

## Adım 8: Ingress denetleyicisini yükseltin

Wallarm Ingress denetleyicisini yükseltmenin üç yolu vardır. Ortamınıza bir yük dengeleyicisi dağıtılıp dağıtılmadığına bağlı olarak, yükseltme yöntemini seçin:

* Geçici Ingress denetleyicisinin dağıtımı
* Ingress denetleyicisi sürümünün düzenli yeniden oluşturulması
* Yük dengeleyicisini etkilemeden Ingress denetleyicisi sürümünün yeniden oluşturulması

!!! warning "Staging ortamını kullanma veya minikube"
    Eğer Wallarm Ingress denetleyicisi sizin staging ortamınıza dağıtılmışsa, öncelikle onu yükseltmeniz önerilir. Staging ortamındaki tüm hizmetler doğru bir şekilde çalıştığından emin olduktan sonra, üretim ortamındaki yükseltme prosedürüne devam edebilirsiniz.

    Aksi takdirde önce minikube veya başka bir hizmet kullanarak [güncellenmiş yapılandırma ile Wallarm Ingress denetleyicisi 4.8'i](../../admin-en/installation-kubernetes-en.md) dağıtmanız önerilir. Tüm hizmetlerin beklendiği gibi çalıştığından emin olduktan sonra üretim ortamında Ingress denetleycisini yükseltin.

    Bu yaklaşım, üretim ortamındaki hizmetlerin çalışmamasını önlemeye yardımcı olur.

### Yöntem 1: Geçici Ingress denetleyicisinin dağıtımı

Bu yöntemi kullanarak, Ingress Denetleyicisi 4.8'i ortamınıza ek bir varlık olarak dağıtabilir ve trafiği yavaş yavaş ona geçirebilirsiniz. Hizmetlerin hatta geçici olarak bile çökmesini önler ve güvenli bir geçiş sağlar.

1. Önceki versiyonun `values.yaml` dosyasından IngressClass yapılandırmasını Ingress denetleyicisi 4.8 için `values.yaml` dosyasına kopyalayın.

    Bu yapılandırmayla, Ingress denetleyicisi Ingress nesnelerini tanımlayacaktır fakat onların trafiğini işlemez.
2. Ingress denetleyicisi 4.8'i dağıtın:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress denetleyici tablosunun Helm sürümü için ad
    * `<NAMESPACE>`: Ingress denetleyicisinin dağıtılacağı ad alanı
    * `<PATH_TO_VALUES>`: [Ingress denetleyici 4.8 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
3. Tüm hizmetlerin doğru bir şekilde çalıştığından emin olun.
4. Yükü yeni Ingress denetleyicisine yavaşça geçirin.

### Yöntem 2: Ingress denetleyicisi sürümünün düzenli yeniden oluşturulması

**Eğer yük dengeleyicisi ve Ingress denetleyici AYNI Helm tablosunda tanımlanmamışsa**, yalnızca Helm sürümünü yeniden oluşturabilirsiniz. Bu birkaç dakika sürecek ve Ingress denetleyicisi bu süre zarfında kullanılamaz olacaktır.

!!! warning "Eğer Helm tablosu yük dengeleyicisinin yapılandırmasını belirtiyor"
    Eğer Helm tablosu yük dengeleyicisinin yapılandırmasını, Ingress denetleyicisiyle birlikte belirtiyorsa, sürüm yeniden oluşturulduğunda uzun bir yük dengeleyicisii çöküşüne (bulut sağlayıcısına bağlıdır) yol açabilir. Yükseltmeden sonra sabit bir adres atanmadıysa, yük dengeleyicisi IP adresi değişebilir.

    Bu yöntemi kullanırken lütfen tüm olası riskleri analiz edin.

Ingress denetleyicisi sürümünü yeniden oluşturmak için:

=== "Helm CLI"
    1. Önceki sürümü silin:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: Ingress denetleyici tablosu ile Helm sürümünün adı

        * `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı ad alanı

        Bu komutu çalıştırırken `--wait` seçeneğini kullanmayın çünkü bu, yükseltme süresini artırabilir.

    2. Ingress denetleyicisi 4.8 ile yeni bir sürüm oluşturun:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f `<PATH_TO_VALUES>`
        ```

        * `<RELEASE_NAME>`: Ingress denetleyici tablosunun Helm sürümü için ad

        * `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı ad alanı

        * `<PATH_TO_VALUES>`: [Ingress denetleyici 4.8 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu
=== "Terraform CLI"
    1. Güncelleme süresini azaltmak için Terraform yapılandırmasında `wait = false` seçeneğini ayarlayın:
        
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
    
    3. Ingress denetleyicisi 4.8 ile yeni sürümü oluşturun:

        ```bash
        terraform apply -target=helm_release.release
        ```

### Yöntem 3: Yük dengeleyicisini etkilemeden Ingress denetleyicisi sürümünün yeniden oluşturulması

Bulut sağlayıcısı tarafından yapılandırılan bir yük dengeleyici kullanılıyorsa, Ingress denetleyicisini yükseltmek için bu yöntemi kullanmanız önerilir çünkü bu, yük dengeleyiciyi etkilemez.

Sürüm yeniden oluşturulduğunda birkaç dakika sürecek ve Ingress denetleyicisi bu süre boyunca kullanılamaz olacaktır.

1. Silinecek olan nesneleri alın (yük dengeleyicisi hariç):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    Utility `yq` kurmak için [talimatlara]((https://pypi.org/project/yq/) göz atın.

    `objects-to-remove.txt` dosyasına silinecek olan nesneler çıktı olarak yazdırılacaktır.
2. Listelenen nesneleri silin ve sürümü yeniden oluşturun:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f `<PATH_TO_VALUES>`
    ```

    Hizmetin çökme süresini azaltmak için, komutları ayrı ayrı çalıştırmamanız önerilir.
3. Tüm nesnelerin oluşturulduğundan emin olun:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    Çıktı, tüm nesnelerin zaten var olduğunu söylemelidir.

Aşağıdaki parametreler komutlarda geçer:

* `<RELEASE_NAME>`: Ingress denetleyici tablosu ile Helm sürümünün adı
* `<NAMESPACE>`: Ingress denetleyicisinin dağıtıldığı ad alanı
* `<PATH_TO_VALUES>`: [Ingress denetleyici 4.8 ayarlarını](#step-5-update-the-valuesyaml-configuration) tanımlayan `values.yaml` dosyasının yolu

## Adım 9: Yükseltilmiş Ingress Denetleyicisini test edin

1. Helm tablosunun sürümünün güncellendiğinden emin olun:

    ```bash
    helm ls
    ```

    Tablo sürümü, `wallarm-ingress-4.8.2'ye karşılık gelmelidir.
2. Aşağıdaki komutu kullanarak, Wallarm Ingress denetleyicisinin adı olan `<INGRESS_CONTROLLER_NAME>` belirleyin ve podların listesini alın:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Her pod durumunun **STATUS: Running** veya **READY: N/N** olması gerekir. Örneğin:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. Wallarm Ingress denetleyici adresine test [Path Traversal](../../attacks-vulns-list.md#path-traversal) saldırısı ile bir istek gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Eğer filtreleme düğümü `block` modunda çalışıyorsa, isteğe yanıt olarak `403 Forbidden` kodu dönecektir ve saldırı Wallarm Console → **Events**'de görüntülenecektir.

## Adım 10: Ingress notlarını yayımlanan değişikliklere ayarlayın

Ingress notlarını Ingress denetleyicisi 4.8'de yayımlanan değişikliklere ayarlayın:

1. Eğer 2.18 veya daha düşük bir versiyondan yükseltiliyorsa, IP listesi yapılandırmasını [taşıyın](../migrate-ip-lists-to-node-3.md). Wallarm düğüm 3.x'teki IP listesi çekirdek mantığı önemli ölçüde değiştiği için, uygun biçimde IP listesi yapılandırmasını ayarlamak gerekmektedir. Bunun için, Ingress notları (uygulanmışsa) değiştirilerek IP listesi yapılandırması ayarlanmalıdır.
1. Listelenen ayarların beklenen davranışının [değiştirilmiş `off` ve `monitoring` filtrasyon modları mantığına](what-is-new.md#filtration-modes) uygun olduğundan emin olun:
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console'da yapılandırılan genel filtrasyon kuralı](../../user-guides/settings/general.md)
      * [Wallarm Console'da yapılandırılan düşük seviyeli filtrasyon kuralları](../../user-guides/rules/wallarm-mode-rule.md)

      Eğer beklenen davranış, değiştirilen filtrasyon modu mantığına uymuyorsa, lütfen [Ingress notlarını](../../admin-en/configure-kubernetes-en.md#ingress-annotations) ve [diğer ayarları](../../admin-en/configure-wallarm-mode.md) yayımlanan değişikliklere ayarlayın.
1. Eğer Ingress, `nginx.ingress.kubernetes.io/wallarm-instance` ile not edilmişse, bu notu `nginx.ingress.kubernetes.io/wallarm-application` olarak yeniden adlandırın.

    Yalnızca notun adı değişmiştir, mantığı aynı kalmıştır. Önceki adlı not yakında kullanımdan kalkacaktır, bu yüzden bu notu önceden yeniden adlandırmanız önerilir.
1. Eğer Ingress notları üzerinden yapılandırılan `&/usr/share/nginx/html/wallarm_blocked.html` sayfası bloke olan isteklere dönüyorsa, [yapılandırmasını](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) yayımlanan değişikliklere ayarlayın.

    Yeni düğüm versiyonlarında, Wallarm'ın bloklama sayfası [güncellenmiş](what-is-new.md#new-blocking-page) bir kullanıcı arayüzüne sahiptir ve varsayılan olarak logosu ve destek e-postası belirtilmemiştir.

## Adım 11: Etkin tehdit teyit etme modülünü yeniden etkinleştirin (yalnızca düğüm 2.16 veya daha alt bir versiyon yükseltiliyorsa)

[Etkin tehdit teyit etme modülü kurulumu hakkında öneriyi](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) öğrenin ve gerekiyorsa modülü yeniden etkinleştirin.

Bir süre sonra, modülün işleminin yanlış pozitiflere sebep olmadığından emin olun. Eğer yanlış pozitifler bulunursa, lütfen [Wallarm teknik destek)](mailto:support@wallarm.com) ile iletişime geçin.