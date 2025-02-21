# Entegre Wallarm Servisleri ile Kong Ingress Controller Dağıtımı

Kong API Gateway tarafından yönetilen API'leri güvence altına almak için, Kubernetes kümesinde entegre Wallarm servisleriyle Kong Ingress Controller'ı dağıtabilirsiniz. Çözüm, varsayılan Kong API Gateway işlevselliğini gerçek zamanlı kötü niyetli trafik azaltma katmanı ile birleştirir.

Çözüm, [Wallarm Helm chart](https://github.com/wallarm/kong-charts) üzerinden dağıtılır.

Kong Ingress Controller'ın entegre Wallarm servisleriyle **ana özellikleri**:

* Gerçek zamanlı [saldırı tespiti ve azaltımı][attack-detection-docs]
* [Güvenlik açığı tespiti][vulnerability-detection-docs]
* [API envanteri keşfi][api-discovery-docs]
* Wallarm servisleri, açık kaynak [Kong API Gateway](https://docs.konghq.com/gateway/latest/) sürümüne doğal olarak entegre edilmiştir
* Bu çözüm, Kong API Gateway özelliklerinin tam desteğini sağlayan [resmi Kong Ingress Controller for Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) üzerine kuruludur
* Kong API Gateway 3.1.x desteği
* Wallarm katmanının Wallarm Console UI üzerinden ve her Ingress için açıklamalar yoluyla ince ayarlanması

    !!! warning "Açıklama desteği"
        Ingress açıklaması yalnızca açık kaynak temelli Kong Ingress Controller çözümünde desteklenir. [Desteklenen açıklamaların listesi sınırlıdır](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* CPU'nun çoğunu tüketen postanalytics modülü için yerel veri analitiği arka planı oluşturacak özel bir varlık sağlar

## Kullanım Durumları

[Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki **kullanım durumları** için önerilmektedir:

* Kong tarafından yönetilen Ingress kaynaklarına trafiği yönlendiren bir Ingress controller ve güvenlik katmanı mevcut değildir.
* Açık kaynak resmi Kong Ingress Controller'ı kullanıyor ve teknoloji yığınına uyumlu bir güvenlik çözümü arıyorsanız.

    Mevcut Kong Ingress Controller'ı, yalnızca yapılandırmanızı yeni bir dağıtıma taşıyarak bu talimatlarda tarif edilen sürümle sorunsuz bir şekilde değiştirebilirsiniz.

## Çözüm Mimarisi

Çözüm aşağıdaki mimariye sahiptir:

![Solution architecture][kong-ing-controller-scheme]

Çözüm, resmi Kong Ingress Controller üzerine kuruludur; mimarisi [resmi Kong dokümantasyonunda](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/) açıklanmıştır.

Entegre Wallarm servisleriyle Kong Ingress Controller, aşağıdaki Deployment nesneleri tarafından düzenlenir:

* **Ingress controller** (`wallarm-ingress-kong`), Helm chart değerlerine göre Kong API Gateway ve Wallarm kaynaklarını K8s kümesine enjekte eder ve düğüm bileşenlerini Wallarm Cloud'a bağlar.
* **Postanalytics modülü** (`wallarm-ingress-kong-wallarm-tarantool`), çözüm için yerel veri analitiği arka planını oluşturur. Modül, bellek içi depolama Tarantool ve bazı yardımcı kapsayıcılar (örneğin collectd, attack export servisleri) setini kullanır.

## Kısıtlamalar

Aşağıdaki Wallarm özellikleri mevcut değildir:

* [Özel engelleme sayfası ve kod ayarı][custom-blocking-page-docs]
* [Kimlik bilgisi doldurma tespiti][cred-stuffing-detection]

## Gereksinimler

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## Dağıtım

Entegre Wallarm servisleriyle Kong Ingress Controller'ı dağıtmak için:

1. Wallarm düğümünü oluşturun.
1. Kong Ingress Controller ve Wallarm servisleriyle birlikte Wallarm Helm chart'ını dağıtın.
1. Ingress'iniz için trafik analizini etkinleştirin.
1. Entegre Wallarm servisleriyle Kong Ingress Controller'ı test edin.

### Adım 1: Wallarm Düğümünü Oluşturma

1. Aşağıdaki linkten Wallarm Console → **Nodes** bölümünü açın:

    * https://us1.my.wallarm.com/nodes for the US Cloud
    * https://my.wallarm.com/nodes for the EU Cloud
1. **Wallarm node** tipiyle bir filtreleme düğümü oluşturun ve oluşturulan token'ı kopyalayın.
    
    ![Creation of a Wallarm node][create-wallarm-node-img]

### Adım 2: Wallarm Helm Chart'ını Dağıtma

1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Çözüm yapılandırması](customization.md) ile `values.yaml` dosyasını oluşturun.

    Entegre Wallarm servisleriyle **Open-Source** Kong Ingress Controller'ı çalıştırmak için minimum yapılandırmaya sahip dosya örneği:

    === "US Cloud"
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
    === "EU Cloud"
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
            
    `<NODE_TOKEN>` kopyaladığınız Wallarm Console UI'dan almış olduğunuz Wallarm düğüm token'ıdır

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"

1. Wallarm Helm chart'ını dağıtın:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Kong Ingress Controller chart için Helm sürümünün adıdır
    * `<KUBERNETES_NAMESPACE>`, Helm release'inin Kong Ingress Controller chart ile dağıtılacağı yeni namespace'tir
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yoludur

### Adım 3: Ingress'iniz için Trafik Analizini Etkinleştirme

Dağıtılan çözüm, açık kaynak Kong Ingress Controller tabanlı ise Wallarm modunu `monitoring` olarak ayarlayarak Ingress'iniz için trafik analizini etkinleştirin:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

Burada `<KONG_INGRESS_NAME>`, korunmasını istediğiniz mikroservislere API çağrılarını yönlendiren K8s Ingress kaynağının adıdır.

### Adım 4: Entegre Wallarm Servisleriyle Kong Ingress Controller'ı Test Etme

Entegre Wallarm servisleriyle Kong Ingress Controller'ın doğru çalıştığını test etmek için:

1. Başlatıldıklarından emin olmak için Wallarm pod detaylarını alın:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Her pod aşağıdakileri göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controller Servisine [Path Traversal][ptrav-attack-docs] saldırılarını test gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Wallarm katmanı **monitoring** [filtrasyon modunda][available-filtration-modes-docs] çalıştığından, Wallarm düğümü saldırıyı engellemez, ancak kayıt altına alır.

    Saldırının kaydedildiğini kontrol etmek için, Wallarm Console → **Attacks** bölümüne gidin:

    ![Attacks in the interface][attacks-in-ui-image]

## Özelleştirme

Wallarm pod'ları, [varsayılan `values.yaml`](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) ve ikinci dağıtım adımında belirttiğiniz özel yapılandırmaya dayanarak enjekte edilmiştir.

Hem Kong API Gateway'in hem de Wallarm davranışının daha fazla özelleştirilmesiyle, şirketiniz için Wallarm'dan maksimum verimi alabilirsiniz.

Sadece [Kong Ingress Controller çözüm özelleştirme kılavuzuna](customization.md) başvurun.