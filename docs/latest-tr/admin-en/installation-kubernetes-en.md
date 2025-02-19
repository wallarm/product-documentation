# Wallarm Servis Entegrasyonlu NGINX Ingress Controller Dağıtımı

Bu talimatlar, Wallarm NGINX tabanlı Ingress controller'ı K8s kümenize dağıtmanız için gerekli adımları sağlar. Çözüm, Wallarm Helm chart'ından dağıtılır.

Çözüm, entegre Wallarm servisleriyle birlikte çalışan [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) üzerine inşa edilmiştir. En son sürüm, NGINX stable 1.25.5 kullanan Community Ingress NGINX Controller 1.11.3'ü temel almaktadır.

Aşağıdaki mimariye sahiptir:

![Solution architecture][nginx-ing-image]

## Kullanım Senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki **kullanım senaryoları** için önerilmektedir:

* [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) ile uyumlu Ingress kaynaklarına trafik yönlendiren bir Ingress controller ve güvenlik katmanı bulunmamaktadır.
* Halihazırda Community Ingress NGINX Controller kullanıyorsanız ve hem standart controller işlevselliği hem de geliştirilmiş güvenlik özellikleri sunan bir güvenlik çözümü arıyorsanız. Bu durumda, mevcut yapılandırmanızı yeni bir dağıtıma geçirerek bu talimatlarda ayrıntıları verilen Wallarm-NGINX Ingress Controller'a kolayca geçiş yapabilirsiniz.

    Mevcut Ingress controller ile Wallarm controller'ın eşzamanlı kullanımı için, yapılandırma ayrıntıları konusunda [Ingress Controller chaining guide][chaining-doc]'a bakınız.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "Ayrıca bakınız"
    * [Ingress Nedir?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helm'in Kurulumu](https://helm.sh/docs/intro/install/)

## Bilinen Kısıtlamalar

* Postanalytics modülü olmadan çalışma desteklenmemektedir.
* Postanalytics modülünün ölçek küçültülmesi, kısmi bir saldırı verisi kaybına yol açabilir.

## Kurulum

1. Wallarm Ingress controller'ı [kurun](#step-1-installing-the-wallarm-ingress-controller).
2. Ingress'iniz için trafik analizini [etkinleştirin](#step-2-enabling-traffic-analysis-for-your-ingress).
3. Wallarm Ingress controller işlem durumunu [kontrol edin](#step-3-checking-the-wallarm-ingress-controller-operation).

### Adım 1: Wallarm Ingress Controller'ın Kurulması

Wallarm Ingress Controller'ı kurmak için:

1. [Uygun tipteki][node-token-types] bir filtering node token'ı oluşturun:

    === "API token (Helm chart 4.6.8 ve üzeri)"
        1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)'da açın.
        1. `Deploy` kaynak rolüne sahip bir API token'ı bulun ya da oluşturun.
        1. Bu token'ı kopyalayın.
    === "Node token"
        1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)'daki **Nodes** bölümünü açın.
        1. **Wallarm node** tipinde bir filtering node oluşturup oluşturulan token'ı kopyalayın.
            
            ![Creation of a Wallarm node][nginx-ing-create-node-img]
1. Helm chart'ı ile Wallarm Ingress controller'ı dağıtmak için bir Kubernetes namespace oluşturun:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. [Wallarm yapılandırması][configure-nginx-ing-controller-docs] ile `values.yaml` dosyasını oluşturun. Minimum yapılandırmaya sahip dosya örneği aşağıdadır.

    API token kullanılırken, `nodeGroup` parametresinde bir node grubu adı belirtin. Node'unuz, Wallarm Console'un **Nodes** bölümünde gösterilen bu gruba atanacaktır. Varsayılan grup adı `defaultIngressGroup`'dur.

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    Wallarm node token'ını Kubernetes secret'larında depolayarak Helm chart'a çekebilirsiniz. [Read more][controllerwallarmexistingsecret-docs]

    !!! info "Deployment from your own registries"    
        Wallarm Ingress controller'ı, [kendi depolarınızda](#deployment-from-your-own-registries) saklanan imajlardan kurmak için `values.yaml` dosyasındaki öğeleri geçersiz kılabilirsiniz.

1. Wallarm paketlerini kurun:

    ``` bash
    helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` Ingress controller chart'ının Helm release adı
    * `<KUBERNETES_NAMESPACE>` Wallarm Ingress controller ile Helm chart'ı için oluşturduğunuz Kubernetes namespace
    * `<PATH_TO_VALUES>` `values.yaml` dosyasının yolu

### Adım 2: Ingress'iniz için Trafik Analizinin Etkinleştirilmesi

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>` Ingress'inizin adı
* `<YOUR_INGRESS_NAMESPACE>` Ingress'inizin namespace'i
* `<APPLICATION_ID>` [uygulamalarınıza veya uygulama gruplarınıza][application-docs] özgü, pozitif bir sayı. Bu, ayrı istatistikler elde etmenize ve ilgili uygulamalara yönelik saldırıları ayırt etmenize olanak sağlayacaktır

### Adım 3: Wallarm Ingress Controller İşleyişinin Kontrol Edilmesi

1. Pod listesini alın:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Her pod şu bilgileri göstermelidir: **STATUS: Running** ve **READY: N/N**. Örneğin:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği Ingress Controller Servisine gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Filtreleme node'u `block` modunda çalışıyorsa, isteğe yanıt olarak `403 Forbidden` kodu dönecek ve saldırı Wallarm Console → **Attacks** bölümünde görüntülenecektir.

## ARM64 Dağıtımı

NGINX Ingress controller'ın Helm chart sürüm 4.8.2 ile ARM64 işlemci uyumluluğu tanıtılmıştır. Başlangıçta x86 mimarisi için ayarlanmış olan dağıtım, ARM64 node'larında dağıtım yapılırken Helm chart parametrelerinin değiştirilmesini gerektirir.

ARM64 ayarlarında, Kubernetes node'ları genellikle `arm64` etiketine sahiptir. Kubernetes scheduler'ın Wallarm iş yükünü uygun node tipine tahsis etmesine yardımcı olmak için, Wallarm Helm chart yapılandırmasında `nodeSelector`, `tolerations` veya affinity kuralları kullanılarak bu etikete referans verin.

Aşağıda, ilgili nodlar için `kubernetes.io/arch: arm64` etiketini kullanan Google Kubernetes Engine (GKE) için Wallarm Helm chart örneği verilmiştir. Bu şablon, diğer bulut kurulumlarının ARM64 etiketleme standartlarına uyum sağlayacak şekilde değiştirilebilir.

=== "nodeSelector"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        tarantool:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```
=== "tolerations"
    ```yaml
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
      admissionWebhooks:
        patch:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
      wallarm:
        tarantool:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```

## Kendi Depolarınızdan Dağıtım

Güvenlik politikalarınız gibi nedenlerle Wallarm genel deposundan Docker imajlarını çekemiyorsanız, bunun yerine:

1. Bu imajları kendi özel deponuza kopyalayın.
1. Wallarm NGINX tabanlı Ingress controller'ı bu imajları kullanarak kurun.

NGINX tabanlı Ingress Controller dağıtımı için Helm chart tarafından kullanılan Docker imajları şunlardır:

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

Kendi deponuzda saklanan imajları kullanarak Wallarm NGINX tabanlı Ingress controller'ı kurmak için, Wallarm Ingress controller Helm chart'ının `values.yaml` dosyasını aşağıdaki gibi geçersiz kılın:

```yaml
controller:
  image:
    ## The image and tag for wallarm nginx ingress controller
    ##
    registry: <YOUR_REGISTRY>
    image: wallarm/ingress-controller
    tag: <IMAGE_TAG>
  wallarm:
    helpers:
      ## The image and tag for the helper image
      ##
      image: <YOUR_REGISTRY>/wallarm/node-helpers
      tag: <IMAGE_TAG>
```

Ardından, değiştirilmiş `values.yaml` dosyasını kullanarak kurulumu gerçekleştirin.

## Yapılandırma

Wallarm Ingress controller başarılı bir şekilde kurulduktan ve kontrol edildikten sonra, aşağıdakiler gibi gelişmiş yapılandırmalar yapabilirsiniz:

* [Nihai kullanıcı genel IP adresinin doğru raporlanması][best-practices-for-public-ip]
* [IP adresi engelleme yönetimi][ip-lists-docs]
* [Yüksek erişilebilirlik hususları][best-practices-for-high-availability]
* [Ingress Controller izleme][best-practices-for-ingress-monitoring]

Gelişmiş yapılandırma için kullanılan parametreler ve ilgili talimatlar hakkında bilgi almak için lütfen [configure-nginx-ing-controller-docs][configure-nginx-ing-controller-docs]'a bakınız.