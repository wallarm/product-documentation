# Entegre Wallarm Hizmetleriyle Kong Ingress Controller'ın Dağıtımı

Kong API Gateway tarafından yönetilen API'leri güvence altına almak için, bir Kubernetes kümesinde entegre Wallarm hizmetleri ile Kong Ingress kontrollerini dağıtabilirsiniz. Bu çözüm, gerçek zamanlı zararlı trafik azaltma katmanıyla birlikte varsayılan Kong API Gateway işlevi içerir.

Çözüm, [Wallarm Helm grafiği](https://github.com/wallarm/kong-charts) üzerinden dağıtılır.

Entegre Wallarm hizmetleri ile Kong Ingress Controller'ın **ana özellikleri** şunlardır:

* Gerçek zamanlı [saldırı tespiti ve azaltma][attack-detection-docs]
* [Zaafiyet tespiti][vulnerability-detection-docs]
* [API envanteri keşfi][api-discovery-docs]
* Wallarm hizmetleri, hem Açık Kaynak hem de Kurumsal [Kong API Gateway](https://docs.konghq.com/gateway/latest/) sürümlerine yerel olarak entegre edildi.
* Bu çözüm, Kong API Gateway'ın tüm özellikleri için tam destek sağlayan [resmi Kong Ingress Controller for Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) üzerine kurulmuştur.
* Kong API Gateway 3.1.x için destek (hem Açık Kaynak hem de Kurumsal sürümler için)
* Wallarm katmanının, Wallarm Console UI ve her Ingress bazında açıklamalar aracılığıyla ince ayarı

    !!! Uyarı "Açıklama desteği"
        Ingress açıklama desteği, sadece Açık Kaynak Kong Ingress controller tabanlı çözüm tarafından desteklenmektedir. [Desteklenen açıklamaların listesi sınırlıdır](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* En fazla CPU'yu tüketen çözüm için yerel veri analitiği backend'i olan postanalytics modülü için adanmış bir birim sağlar.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki **kullanım durumları** için önerilendir:

* Ingress kaynaklarına yönlendirilen trafiği yönlendiren Ingress controller ve güvenlik katmanı yok.
* Geleneksel ya da Kurumsal resmi Kong Ingress controller kullanıyorsunuz ve teknoloji yığınınızla uyumlu bir güvenlik çözümü arıyorsunuz.

    Sadece konfigürasyonunuzu yeni bir dağıtıma taşıyarak dağıtılmış Kong Ingress Controller'ı bu talimatlarda tarif edilenlerle sorunsuz bir şekilde değiştirebilirsiniz.

## Çözüm Mimarisi

Çözümün aşağıdaki mimarisi bulunmaktadır:

![Çözüm mimarisi][kong-ing-controller-scheme]

Çözüm resmi Kong Ingress Controller temel alınarak oluşturulmuş olup, mimarisi [resmi Kong belgelerinde](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/) açıklanmıştır.

Entegre Wallarm hizmetleri ile Kong Ingress Controller, aşağıdaki Dağıtım nesnesi ile düzenlenmiştir:

* **Ingress controller** (`wallarm-ingress-kong`) Kong API Gateway ve Wallarm kaynaklarını K8s kümesine enjekte eder ve bunları Helm grafik değerlerine dayalı olarak yapılandırır ve node bileşenlerini Wallarm Buluta bağlar.
* **Postanalytics modülü** (`wallarm-ingress-kong-wallarm-tarantool`) çözümün yerel veri analitiği backend'idir. Modül, in-memory depolama Tarantool ve bazı yardımcı konteynerler (örneğin, collectd, saldırı dışa aktarma hizmetleri) setini kullanır.

## Kurumsal Kong Ingress controller'ın Sınırlamaları

Kurumsal Kong Ingress controller için tanımlanan çözüm, Wallarm katmanının ince ayarını yalnızca Wallarm Console UI üzerinden sağlar.

Ancak, Wallarm platformunun bazı özellikleri, mevcut Kurumsal çözüm uygulamasında desteklenmeyen konfigürasyon dosyalarının değiştirilmesini gerektirir. Bu, aşılıdaki Wallarm özelliklerinin kullanılamaz hale gelmesine neden olur:

* [Çoklu kiracılık özelliği][multitenancy-overview]
* [Uygulama yapılandırması][applications-docs]
* [Özel engelleme sayfası ve kod kurulumu][custom-blocking-page-docs] - Wallarm hizmetleri ile hem Kurumsal hem de Açık Kaynak Kong Ingress controller'lar tarafından desteklenmez

Açık Kaynak Kong Ingress controller ile Wallarm hizmetleri söz konusu olduğunda, çoklu kiracılığı ve uygulama yapılandırmasını her Ingress bazında [açıklamalar](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition) aracılığıyla destekler.

## Gereksinimler

--8<-- "../include-tr/waf/installation/kong-ingress-controller-reqs.md"

## Dağıtım

Entegre Wallarm hizmetleri ile Kong Ingress Controller'ı dağıtmak için:

1. Wallarm düğümünü oluşturun.
1. Kong Ingress Controller ve Wallarm hizmetleri ile Wallarm Helm grafiğini dağıtın.
1. Ingress'iniz için trafik analizini etkinleştirin.
1. Entegre Wallarm hizmetleri ile Kong Ingress Controller'ı test edin.

### Adım 1: Wallarm Düğümünü Oluşturun

1. Aşağıdaki link üzerinden Wallarm Console → **Nodes**'a gidin:

    * ABD Bulutu için https://us1.my.wallarm.com/nodes
    * AB Bulutu için https://my.wallarm.com/nodes
1. **Wallarm düğümü** türünde bir filtreleme düğümü oluşturun ve oluşturulan belirteci kopyalayın.
    
    ![Wallarm düğümünün oluşturulması][create-wallarm-node-img]

### Adım 2: Wallarm Helm Grafiğini Dağıtın

1. [Wallarm grafiği deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. [Çözüm yapılandırması](customization.md) ile `values.yaml` dosyasını oluşturun.

    Wallarm hizmetleri ile entegre olan **Açık Kaynak** Kong Ingress controller'ı çalıştırmak için dosyanın minimum yapılandırma örneği:

    === "ABD Bulutu"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```
    === "AB Bulutu"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```  
        
    Wallarm hizmetleri ile entegre olan **Kurumsal** Kong Ingress controller'ı çalıştırmak için dosyanın minimum yapılandırma örneği:

    === "ABD Bulutu"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "AB Bulutu"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```  
    
    * `<NODE_TOKEN>` Wallarm Console UI'dan kopyaladığınız Wallarm düğüm belirteci

        --8<-- "../include-tr/waf/installation/info-about-using-one-token-for-several-nodes.md"
    
    * `<KONG--LICENSE>` [Kong  Lisansı](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong--license)
1. Wallarm Helm grafiğini dağıtın:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` Kong Ingress Controller grafiğinin Helm sürümünün adı
    * `<KUBERNETES_NAMESPACE>` Kong Ingress Controller grafiği ile Helm sürümünü dağıtmak için yeni isim alanı
    * `<PATH_TO_VALUES>` `values.yaml` dosyasının yolunu belirtir.

### Adım 3: Ingress'iniz İçin Trafik Analizini Etkinleştirin

Dağıtılan çözüm, Açık Kaynak Kong Ingress controller tabanlıysa, Wallarm modunu `monitoring` olarak ayarlayarak Ingress'iniz için trafik analizini etkinleştirin:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

Burada `<KONG_INGRESS_NAME>` korumak istediğiniz mikroservislere API çağrılarını yönlendiren K8s Ingress kaynağının adıdır.

Kurumsal Kong Ingress controller söz konusu olduğunda, trafik analizi, tüm Ingress kaynakları için varsayılan olarak izleme modunda etkinleştirilir.

### Adım 4: Entegre Wallarm Hizmetleri ile Kong Ingress Controller'ı Test Edin

Entegre Wallarm hizmetleri ile Kong Ingress Controller'ın doğru bir şekilde çalıştığını test etmek için:

1. Wallarm pod detaylarını alın ve başarıyla başlatıldıklarını kontrol edin:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Her bir pod aşağıdakileri göstermelidir: **READY: N/N** ve **STATUS: Running**, örn:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m   
    ```
1. Kong Ingress Controller Hizmetine test [Path Traversal][ptrav-attack-docs] saldırıları gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Wallarm katmanı **monitoring** [filtration mode][available-filtration-modes-docs] modunda çalıştığından, Wallarm node saldırıyı engellemeyecek, ancak onu kaydedecektir.

    Saldırının kaydedildiğini kontrol etmek için, Wallarm Console → **Events**lara gidin:

    ![Kullanıcı arayüzündeki saldırılar][attacks-in-ui-image]

## Özelleştirme

Wallarm podları, [varsayılan `values.yaml'](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) ve 2. dağıtım adımında belirttiğiniz özel yapılandırmaya dayalı olarak enjekte edilmiştir.

Hem Kong API Gateway hem de Wallarm'ın davranışını daha fazla özelleştirebilir ve şirketiniz için Wallarm'ın sunduğu tüm avantajları elde edebilirsiniz.

Sadece [Kong Ingress Controller çözüm özelleştirme kılavuzuna](customization.md) gidin.