# Entegre Wallarm Hizmetleri ile NGINX Ingress Controller'ı Kurma

Bu talimatlar, Wallarm NGINX tabanlı Ingress controller'ınızı K8s kümenize kurmak için izlemeniz gereken adımları sağlar. Çözüm, entegre Wallarm hizmetleri ile beraber [Topluluk İnwingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) özelliğini içerir.

Çözüm aşağıdaki mimariye sahiptir:

![Çözüm Mimarisi][nginx-ing-image]

Çözüm, Wallarm Helm chart'dan kurulmaktadır.

## Kullanım Senaryoları

Tüm desteklenen [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki **kullanım senaryoları** için önerilen çıkmıştır:

* [Topluluk İnwingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) ile uyumlu Ingress kaynaklarını yönlendirmek üzere bir Ingress controller ve güvenlik katmanı yok.
* Teknolojik alt yapınızla uyumlu bir güvenlik çözümü arıyorsunuz ve [Topluluk Inwingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) kullanıyorsunuz.

    Bu talimatların tarif ettiği NGINX Ingress Controller ile mevcut olanını sorunsuz bir şekilde değiştirebilirsiniz. Yapmanız gereken tek şey konfigürasyonunuzu yeni bir kuruluma taşımak. 

## Gereksinimler

--8<-- "../include-tr/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "Ayrıca bakınız"
    * [Ingress Nedir?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helm Kurulumu](https://helm.sh/docs/intro/install/)

## Bilinen Kısıtlamalar

* Postanalytics modülü olmadan çalışma desteklenmemektedir.
* Postanalytics modülünü ölçeklendirmek, saldırı verilerinin kısmi olarak kaybedilmesine neden olabilir.

## Kurulum

1. Wallarm Ingress controller'ını [kurun](#step-1-installing-the-wallarm-ingress-controller).
2. Ingress için trafik analizini [etkinleştirin](#step-2-enabling-traffic-analysis-for-your-ingress).
3. Wallarm Ingress controller işlemini [kontrol edin](#step-3-checking-the-wallarm-ingress-controller-operation).

### Adım 1: Wallarm Ingress Controller'ın Kurulumu

Wallarm Ingress Controller'ını kurmak için:

1. [Uygun tipte](node-token-types)  bir filtreleme düğümü tokeni oluşturun:

    === "API tokeni (Helm chart 4.6.8 ve üzeri)"
        1. Wallarm Console açın → **Ayarlar** → **API tokenleri** [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) yada [Avrupa Bulutu](https://my.wallarm.com/settings/api-tokens) adımlarını izleyin.
        1. 'Yerleştir' kaynak rolü ile bir API tokeni bulun veya oluşturun.
        1. Bu tokeni kopyalayın.
    === "Düğüm tokeni"
        1. Wallarm Console açın → **Düğümler** [ABD Bulutu](https://us1.my.wallarm.com/nodes) ya da [Avrupa Bulutu](https://my.wallarm.com/nodes).
        1. **Wallarm düğümü** tipi ile bir filtreleme düğümü oluşturun ve oluşturulan tokeni kopyalayın.
            
            ![Wallarm düğümü oluşturma][nginx-ing-create-node-img]
1. Wallarm Ingress controller ile Helm chart kurulumu için bir Kubernetes ayırma birimine oluşturun:

    ```bash
    kubectl create namespace <KUBERNETES_AYIRMA_BIRIMI>
    ```
1. [Wallarm chart deposu](https://charts.wallarm.com/)'nu ekleyin:
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. [Wallarm yapılandırma] ile `values.yaml` dosyasını oluşturun. Azami yapılandırmaya sahip dosyanın bir örneği aşağıda bulunabilir.

    API tokeni kullanırken, düğüm grubu adını `nodeGroup` parametresine belirtin. Düğümünüz bu gruba atanacak ve Wallarm Console'ın **Düğümler** bölümünde görünecektir. Varsayılan grup ismi `defaultIngressGroup`'tur.

    === "ABD Bulutu"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<DÜĞÜM_TOKENİ>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "Avrupa Bulutu"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<DÜĞÜM_TOKENİ>"
            # nodeGroup: defaultIngressGroup
        ```
    
    Ayrıca, Wallarm düğüm tokenini Kubernetes secrets'ta saklayabilir ve Helm chart'a çekebilirsiniz. [Daha fazlasını oku][controllerwallarmexistingsecret-docs]
1. Wallarm paketlerini yükleyin:

    ``` bash
    helm install --version 4.8.2 <SERVİS_ADı> wallarm/wallarm-ingress -n <KUBERNETES_AYIRMA_BIRIMI> -f <KONUM_DEĞERLER>
    ```

    * `<SERVİS_ADı>` Ingress controller chart'ı için Helm sürümünün adıdır.
    * `<KUBERNETES_AYIRMA_BIRIMI>` Wallarm Ingress controller ile Helm chart için oluşturduğunuz Kubernetes ayırma birimidir.
    * `<KONUM_DEĞERLER>` `values.yaml` dosyasının yoludur.

### Adım 2: Ingress İçin Trafik Analizini Etkinleştirme

``` bash
kubectl annotate ingress <SIZIN_INGRESS_ADINIZ> -n <SIZIN_INGRESS_AYIRMA_BIRIMINIZ> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <SIZIN_INGRESS_ADINIZ> -n <SIZIN_INGRESS_AYIRMA_BIRIMINIZ> nginx.ingress.kubernetes.io/wallarm-application=<UYGULAMA>
```
* `<SIZIN_INGRESS_ADINIZ>` Ingress'in adıdır.
* `<SIZIN_INGRESS_AYIRMA_BIRIMINIZ>` Ingress'inin ayırma birimidir.
* `<UYGULAMA>` [uygulamalarınızdan ya da uygulama gruplarınızdan](application-docs) her birine özgü olan pozitif bir numaradır. Bu, ayrı ayrı istatistik almanıza ve ilgili uygulamalara yönelik saldırıları ayırt etmenize olanak sağlar.

### Adım 3: Wallarm Ingress Controller İşlemini Kontrol Etme

1. Pod'ların listesini alın:
    ```
    kubectl get pods -n <AYIRMA_BIRIMI> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Her pod aşağıdaki durumu gösterecektir:  **DURUM: Çalışıyor** ve **HAZIR: N/N**. Örneğin:

    ```
    NAME                                                              HAZIR     DURUM    YENİDEN BAŞLAMA   YAŞ
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Çalışıyor   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Çalışıyor   0          5m
    ```
2. Ingress Controller Servisi'ne test [Path Traversal][ptrav-attack-docs] saldırısı içeren bir talep gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Filtering düğümü 'block' modunda çalışıyorsa, talebin yanıtında `403 Yasak` kodu dönecek ve saldırı Wallarm Console → **Olaylar**'da görünecektir.

## Yapılandırma

Wallarm Ingress controller başarılı bir şekilde kurulduktan ve kontrol edildikten sonra, çözüm için ileri seviye yapılandırmalar yapabilirsiniz:

* [Son kullanıcının genel IP adresinin doğru bildirilmesi][best-practices-for-public-ip]
* [IP adreslerinin engellenmesinin yönetilmesi][ip-lists-docs]
* [Yüksek erişilebilirlik düşünceleri][best-practices-for-high-availability]
* [Ingress Controller izleme][best-practices-for-ingress-monitoring]

İleri yapılandırma için kullanılan parametreleri ve uygun talimatları bulmak için [bu linke][configure-nginx-ing-controller-docs] gidin.