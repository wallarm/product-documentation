# Wallarm Yan Arabası İmplemantasyonu

Kubernetes kümelenmesinde bir Pod olarak yerleştirilen bir uygulamayı güvenceye almak için, uygulamanın önünde bir yan araba denetleyicisi olarak NGINX-tabanlı Wallarm düğümünü çalıştırabilirsiniz. Wallarm yan araba denetleyicisi uygulama Pod'una gelen trafiği filtreler ve sadece meşru talepleri izin vererek kötü amaçlı olanları azaltır. 

Wallarm Yan Araba çözümünün **ana özellikleri**:

* Uygulamalara benzer yerleştirme formatı sağlayarak ayrı ayrı mikrohizmetlerin ve onların replikalarının ve parçalarının korumasını basitleştirir
* Herhangi bir Giriş denetleyicisi ile tamamen uyumludur
* Hizmet ızgarası yaklaşımı için genellikle ortak olan yüksek yükler altında stabil çalışır
* Uygulamalarınızı güvenceye almak için minimum hizmet yapılandırmasına ihtiyaç duyar; sadece korumak için uygulama pod'una bazı notlar ve etiketler ekleyin
* Wallarm kabının yerleştirilmesi için iki modu destekler: Wallarm hizmetlerinin tek bir kabda çalıştığı orta yükler ve Wallarm hizmetlerinin birkaç kabda bölündüğü yüksek yükler için
* Çoğunlukla hafızayı tüketen Wallarm yan araba çözümü için yerel veri analitik arka ucudur 

!!! bilgi "Eğer daha önceden Wallarm Yan Araba çözümünü kullanıyorsanız"
    Eğer Wallarm Yan Araba çözümünün önceki sürümünü kullanıyorsanız, sizin yeni olanı kullanmanızı öneririz. Bu sürümle birlikte, Sidecar çözümümüzü yeni Kubernetes yeteneklerinden ve çok sayıda müşteri geri bildiriminden yararlanmak üzere güncelledik. Yeni çözüm, önemli Kubernetes manifest değişikliklerini gerektirmez, bir uygulamayı korumak için sadece çizelgeyi yerleştirin ve pod'a etiketler ve notlar ekleyin.

    Wallarm Yanaraba çözümü v2.0'a geçiş konusunda yardım için lütfen [Wallarm Teknik Destek](mailto:support@wallarm.com) ile iletişime geçin.

## Kullanım durumları

Desteklenen tüm [Wallarm İmplantasyon seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki **kullanım durumları** için tavsiye edilen çözümdür:

* Mevcut Giriş denetleyicisi (ör. AWS ALB Giriş Denetleyicisi) ile altyapıya yerleştirilecek güvenlik çözümü arıyorsunuz ve size [Wallarm NGINX-tabanlı][nginx-ing-controller-docs] veya [Wallarm Kong-tabanlı Giriş denetleyicisi][kong-ing-controller-docs] ile değiştirme imkanı vermiyorsunuz
* Her bir mikrohizmetin (dahili API'ler dahil) güvenlik çözümü tarafından korunması gereken Sıfır-güven ortamı

## Trafik akışı

Wallarm Yan Araba ile Trafik akışı:

![Wallarm Yan Araba ile Trafik akışı][traffic-flow-with-wallarm-sidecar-img]

## Çözüm mimarisi

Wallarm Yan Araba çözümü aşağıdaki İmplantasyon nesneleri tarafından düzenlenir:

* **Yan Araba denetleyici** (`wallarm-sidecar-controller`), Helm diagram değerlerine ve pod notlarına dayalı olarak yapılandırılarak ve düğüm bileşenlerini Wallarm Cloud'a bağlayarak pod'a Wallarm yan araba kaynaklarını enjekte eden [dönüştürülmüş kabul web kancasıdır](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks).

    Kubernetes'da `wallarm-sidecar: enabled` etiketi ile yeni bir pod başladığında, denetleyici otomatik olarak pod'a ilave kabı enjekte eder ve bu da gelen trafiği filtreler.
* **Sonrası analitik modülü** (`wallarm-sidecar-postanalytics`), Wallarm yan araba çözümü için yerel veri analitiği arka ucudur.

![Wallarm İmplantasyon nesneleri][sidecar-deployment-objects-img]

Wallarm Yan Araba'nın yaşam döngüsünde 2 standart aşama vardır:

1. **Başlangıç** aşamasında, denetleyici, Helm diagram değerlerine ve pod notlarına dayalı olarak pod'a Wallarm yan Araba kaynaklarını enjekte eder ve düğüm bileşenlerini Wallarm Cloud'a bağlar.
1. **Çalışma süresi** aşamasında, çözüm sonrası analitik modülünün dahil olduğu istekleri analiz eder ve proxyleri/iletir.

## Gereksinimler

--8<-- "../include-tr/waf/installation/sidecar-proxy-reqs.md"

## İmplantasyon

Wallarm Yan Araba çözümünü yerleştirmek için:

1. Bir filtreleme düğümü belirteci oluşturun.
1. Wallarm Helm çizelgesini implemantasyon yapın.
1. Wallarm Yan Araba'yı uygulama Pod'a ekleyin.
1. Wallarm Yan Araba işleminin test edin.

### Adım 1: Bir filtreleme düğüm belirteci oluşturun

Yan Araba podlarını Wallarm Cloud'a bağlamak için [uygun tip] [node-token-types] filtreleme düğüm belirteci oluşturun:

=== "API belirteci"
    1. Wallarm Konsolunu açın → **Ayarlar** → **API belirteçleri** [ABD Bulutunda](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutunda](https://my.wallarm.com/settings/api-tokens).
    1. `Kurulum` kaynak rolü ile API belirtecini bulun veya oluşturun.
    1. Bu belirteci kopyalayın.
=== "Düğüm belirteci"
    1. Wallarm Konsolunu açın → **Düğümler** [ABD Bulutunda](https://us1.my.wallarm.com/nodes) veya [AB Bulutunda](https://my.wallarm.com/nodes).
    1. **Wallarm düğümü** tipinde bir filtreleme düğümü oluşturun ve oluşturulan belirteci kopyalayın.
        
      ![Bir Wallarm düğümü oluşturma][create-wallarm-node-img]

### Adım 2: Wallarm Helm çizelgesini implemantasyon yapın

1. [Wallarm çizelge deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. [Wallarm Yan Araba yapılandırmasını](customization.md) içeren `values.yaml` dosyasını oluşturun. Minimum yapılandırmayı içeren dosyanın örneği aşağıdadır.

    Bir API belirteci kullanırken, `nodeGroup` parametresinde bir düğüm grubu adı belirtin. Yan Araba podları için oluşturulan düğümleriniz bu gruba atanır, Wallarm Konsolu'nun **Düğümler** bölümünde gösterilir. Varsayılan grup adı `defaultSidecarGroup`'dur. Gerekirse, daha sonra uygulamalarının podlarında korunması için onların filtreleme düğüm grubu isimlerini [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group) notasyonunu kullanarak ayrı ayrı belirleyebilirsiniz.

    === "US Bulutu"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "EU Bulutu"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>`, Kubernetes'te çalışacak olan Wallarm düğümünün belirtecini ifade eder.

    --8<-- "../include-tr/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm chartini yerleştirin:

    ``` bash
    helm install --version 4.8.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm Yan Araba çizelgesinin Helm sürümünün adı
    * `wallarm-sidecar`, Wallarm Yan Araba çizelgesi ile Helm sürümünü yerleştirecek olan ve yeni alan adı, onu ayrı bir alana yerleştirmeniz önerilir
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yolu

### Adım 3: Wallarm Yan Araba'yı uygulama Pod'a ekleyin

Wallarm'ın uygulama trafiğini filtrelemesi için, ilgili uygulama Pod'a `wallarm-sidecar: enabled` etiketini ekleyin:

```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="15"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

* `wallarm-sidecar` uygulaması Pod etiketi `disabled` olarak ayarlanmışsa veya açıkça belirtilmemişse, Wallarm Yan Araba kabı bir pod'a enjekte edilmez ve bu nedenle Wallarm trafiği filtrelemez.
* `wallarm-sidecar` uygulaması Pod etiketi `enabled` olarak ayarlanmışsa, Wallarm Yan Araba kabı bir pod'un içerisine enjekte edilir ve bu nedenle Wallarm gelen trafiği filtreler.

### Adım 4: Wallarm Yan Araba işleminin test edin

Wallarm Yan Araba'nın düzgün bir şekilde çalıştığını test etmek için:

1. Wallarm pod detaylarını kontrol edin ve başarıyla başlatıldıklarını onaylayın:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her bir pod aşağıdaki durumu göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Uygulama kabını kontrol etmek ve Wallarm yan araba denetleyicisinin başarıyla enjekte edildiğini doğrulamak için uygulama pod detaylarını alın:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    Çıktı başarılı bir yan araba kabı enjeksiyonunu belirten **READY: 2/2** ve başarılı bir şekilde Wallarm Cloud'a bağlantıyı belirten **STATUS: Running** şeklinde olmalıdır:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarm trafiği filtrelemek üzere aktif hale getirilen uygulama küme adresine test [Path Traversal][ptrav-attack-docs] saldırısını gönderin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarm proxy varsayılan olarak **izleme** [filtrasyon modunda][filtration-mode-docs] çalışır, bu yüzden Wallarm düğümü saldırıyı engellemez ama parlaklık kaydedilir.

    Saldırının kaydedildiğini kontrol etmek için Wallarm Konsoluna → **Etkinlikler** gidin:

    ![Arayüzde saldırılar][attacks-in-ui-image]

## Özelleştirme

Wallarm podları, [varsayılan `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) ve 2. implantasyon adımında belirttiğiniz özel yapılandırmaya dayanarak enjekte edilmiştir.

Wallarm proxy davranışını hem global hem de kişiye özel pod seviyelerinde daha da özelleştirebilir ve şirketiniz için Wallarm çözümünden en iyi şekilde yararlanabilirsiniz.

Sadece [Wallarm proxy çözümü özelleştirme rehberine](customization.md) devam ediniz.
