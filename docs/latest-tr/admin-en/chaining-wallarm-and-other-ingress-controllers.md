[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# Aynı Kubernetes Kümesinde Wallarm ve Ek İngress Denetleyicilerinin Zincirlenmesi
Bu öğreticiler, Wallarm Ingress denetleyicisini K8s kümenize dağıtmanın ve onu ortamınızda zaten çalışan diğer Denetleyicilerle zincirlemenin adımlarını sunar.

## Çözümün Adreslediği Sorun

Wallarm, düğüm yazılımını [Topluluk İngress NGINX Denetleyicisi'nin üstüne inşa edilmiş Ingress Denetleyicisi](installation-kubernetes-en.md) dahil olmak üzere çeşitli form faktörlerinde sunmaktadır.

Zaten bir Ingress denetleyicisi kullanıyorsanız, mevcut Ingress denetleyicisini Wallarm denetleyicisiyle değiştirmek zorlayıcı olabilir (örneğin, AWS ALB Ingress Denetleyicisini kullanırken). Bu durumda, [Wallarm Sidecar çözümünü](../installation/kubernetes/sidecar-proxy/deployment.md) keşfedebilirsiniz ancak bu da altyapınıza uymuyorsa, birden çok Ingress denetleyicisini zincirlemek mümkün olabilir.

Ingress denetleyicisi zincirlemesi, mevcut bir denetleyiciyi uygulama koruması sağlamak için ilave bir Wallarm Ingress denetleyicisini dağıtmak ve bir kümeleyiciye son kullanıcı isteklerini almak için kullanmanızı sağlar.

## Gereksinimler

* Kubernetes platform sürümü 1.24-1.27
* [Helm](https://helm.sh/) paket yöneticisi
* İki faktörlü kimlik doğrulamanın devre dışı olduğu Wallarm Konsolu'ndaki **Yönetici** rolüne sahip hesaba erişim [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` 'a erişim
* Wallarm Helm grafiklerini eklemek için `https://charts.wallarm.com` 'a erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Dağıtılmış bir Kubernetes kümesi çalışan bir Ingress denetleyicisi

## Wallarm Ingress Denetleyicisini Dağıtma ve Ek Ingress Denetleyicisi ile Zincirleme

Wallarm Ingress denetleyicisini dağıtmak ve ek denetleyicilerle zincirlemek için:

1. Var olan Ingress denetleyicisinden farklı bir Ingress sınıfı değeri kullanarak resmi Wallarm denetleyicisini Helm tablosunu dağıtın.
1. Wallarm'ın Ingress Helikopter tablosu `values.yaml`ında belirtildiği gibi aynı `ingressClass` ile Wallarm'a özgü Ingress nesnesi oluşturun.
   
   * Çalışan kuralların aynı şekilde yapılandırıldığı Ingress denetleyici isteklerinin yönlendirme kuralları.

    !!! info "Wallarm Ingress denetleyicisi küme dışında açıklanmayacak"
       Lütfen Wallarm Ingress denetleyicisinin hizmeti için `ClusterIP`'yi kullandığını unutmayın, bu kümeyi dışında açıklanmayacaktır.
1. Mevcut Ingress denetleyicisini, gelen istekleri, uygulama hizmetlerinin yerine yeni Wallarm Ingress denetleyicisine iletmesi için yeniden yapılandırın.
1. Wallarm Ingress denetleyicisi işlemi test edin.

### Adım 1: Wallarm Ingress Denetleyicisini Dağıtma

1. Uygun türdeki bir filtreleme düğümü belirteci oluşturun[node-token-types]:

    === "API belirteci (Helm grafik 4.6.8 ve üstü)"
        1. Wallarm Konsolu'nu açın → **Ayarlar** → **API belirteçleri** [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. `Dağıtım` kaynak rolü olan API belirteci bulun veya oluşturun.
        1. Bu belirteci kopyalayın.
    === "Düğüm belirteci"
        1. Wallarm Konsolu → **Düğümleri** açın [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes).
        1. **Wallarm düğümü** türünde bir filtreleme düğümü oluşturun ve oluşturulan belirteci kopyalayın.
            
            ![Wallarm düğümünün oluşturulması][nginx-ing-create-node-img]
1. [Wallarm Helm grafik deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. Aşağıdaki Wallarm yapılandırması ile `values.yaml` dosyasını oluşturun:

    === "US Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"  
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: ClusterIP
        nameOverride: wallarm-ingress
        ```
    === "EU Cloud"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: "ClusterIP"
        nameOverride: wallarm-ingress
        ```    
    
    * `<NODE_TOKEN>` Wallarm düğüm belirtecidir.
    * API belirteci kullanılırken, `nodeGroup` parametresinde bir düğüm grubu adı belirtin. Düğümünüz, Wallarm Konsolu'nun **Düğümler** bölümünde gösterilen bu gruba atanır. Varsayılan grup adı `defaultIngressGroup` 'dur.

    Daha fazla yapılandırma seçeneklerini öğrenmek için lütfen [bağlantıyı](configure-kubernetes-en.md) kullanın.
1. Wallarm Ingress Helm tablosunu yükleyin:
    ``` bash
    helm install --version 4.8.2 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` Helm derlemesi adıdır
    * `values.yaml` Önceki adımda oluşturulan Helm değerleri ile YAML dosyasıdır
    * `wallarm-ingress` Helm tablosunu yükleyeceğiniz ad alanıdır (oluşturulacaktır)
1. Wallarm ingress denetleyicisinin çalışıyor olduğunu doğrulayın: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Her bir pod durumu **DURUM: Çalışıyor** veya **HAZIR: N/N** olmalıdır. Örneğin:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### Adım 2: Wallarm'a Özgü `ingressClassName` ile Ingress Nesnesi Oluşturma

Önceki adımda `values.yaml` 'da yapılandırılan aynı `ingressClass` adıyla Ingress nesnesini oluşturun.

Ingress nesnesi, uygulamanızın dağıtıldığı aynı ad alanında olmalıdır, örneğin:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-application: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
  name: myapp-internal
  namespace: myapp
spec:
  ingressClassName: wallarm-ingress
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### Adım 3: Mevcut Ingress Denetleyicisini Wallarm'a İstekleri İletmek Üzere Yeniden Yapılandırın

Mevcut Ingress denetleyicisini, gelen istekleri yeni Wallarm Ingress denetleyicisine uygulama hizmetlerinin yerine iletmesi için aşağıdaki şekilde yeniden yapılandırın:

* `ingressClass` adının `nginx` olduğu Ingress nesnesi oluşturun. Lütfen bu varsayılan değerdir, farklı olursa kendi değerinizle değiştirebilirsiniz. 
* Ingress nesnesi, örneğimizdeki gibi Wallarm Ingress Tablosunun aynı ad alanında olmalıdır, bu `wallarm-ingress` ’dir.
* `spec.rules[0].http.paths[0].backend.service.name` değeri, .Values.nameOverride'in yanı sıra Helm derlemesi adının oluşturduğu Wallarm Ingress Kontrolleri hizmetinin adı olmalıdır.

   İsmi almak için aşağıdaki komutu kullanabilirsiniz:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    Örneğimizde isim `internal-ingress-wallarm-ingress-controller`’dir.

Sonuçta elde edilen yapılandırma örneği:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-external
  namespace: wallarm-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: internal-ingress-wallarm-ingress-controller
                port:
                  number: 80
```

### Adım 4: Wallarm Ingress denetleyicisi İşleminin Test Edilmesi 

Mevcut dış Ingress denetleyicisinin yük dengesileyici genel IP'sini alın, örneğin; `ingress-nginx` ad alanında dağıtıldığını varsayalım:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

Mevcut Ingress denetleyici adresine bir test isteği gönderin ve sistemin beklendiği gibi çalıştığını doğrulayın:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```