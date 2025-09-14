[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# Aynı Kubernetes kümesinde Wallarm ve ek Ingress denetleyicilerinin zincirlenmesi

Bu talimatlar, Wallarm Ingress denetleyicisini K8s kümenize dağıtma ve onu ortamınızda halihazırda çalışan diğer denetleyicilerle zincirleme adımlarını sağlar.

## Çözümün ele aldığı sorun

Wallarm, düğüm yazılımını farklı biçimlerde sunar; bunlardan biri de [Community Ingress NGINX Controller üzerine inşa edilmiş Ingress Controller](installation-kubernetes-en.md).

Zaten bir Ingress denetleyicisi kullanıyorsanız, mevcut Ingress denetleyicisini Wallarm denetleyicisiyle değiştirmek zor olabilir (ör. AWS ALB Ingress Controller kullanılıyorsa). Bu durumda, [Wallarm Sidecar çözümünü](../installation/kubernetes/sidecar-proxy/deployment.md) değerlendirebilirsiniz; ancak bu da altyapınıza uymuyorsa birden fazla Ingress denetleyicisini zincirlemek mümkündür.

Ingress denetleyicilerinin zincirlenmesi, son kullanıcı isteklerini kümeye ulaştırmak için mevcut bir denetleyiciyi kullanmanıza ve gerekli uygulama korumasını sağlamak için ek bir Wallarm Ingress denetleyicisi dağıtmanıza olanak tanır.

## Gereksinimler

* Kubernetes platformu sürüm 1.26-1.30
* [Helm](https://helm.sh/) paket yöneticisi
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart’larını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişim. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları ve [API spesifikasyonları](../api-specification-enforcement/overview.md) güncellemelerini indirmek ve [izin listesine, yasak listesine veya gri listeye alınmış](../user-guides/ip-lists/overview.md) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Bir Ingress denetleyicisi çalıştıran dağıtılmış Kubernetes kümesi

## Wallarm Ingress denetleyicisini dağıtma ve onu ek bir Ingress denetleyicisiyle zincirleme

Wallarm Ingress denetleyicisini dağıtmak ve ek denetleyicilerle zincirlemek için:

1. Resmi Wallarm denetleyici Helm chart’ını, mevcut Ingress denetleyicisinden farklı bir Ingress sınıfı değeri kullanarak dağıtın.
1. Şunlarla birlikte Wallarm’a özel Ingress nesnesi oluşturun:

    * Wallarm Ingress Helm chart’ının `values.yaml` dosyasında belirtilen `ingressClass` ile aynı değer.
    * Mevcut Ingress denetleyicisindekiyle aynı şekilde yapılandırılmış Ingress denetleyici istek yönlendirme kuralları.

    !!! info "Wallarm Ingress denetleyicisi küme dışına açılmayacaktır"
        Lütfen unutmayın, Wallarm Ingress denetleyicisi servisinde `ClusterIP` kullanır; bu da küme dışına açılmayacağı anlamına gelir.
1. Mevcut Ingress denetleyicisini, gelen istekleri uygulama servisleri yerine yeni Wallarm Ingress denetleyicisine iletecek şekilde yeniden yapılandırın.
1. Wallarm Ingress denetleyicisinin çalışmasını test edin.

### Adım 1: Wallarm Ingress denetleyicisini dağıtın

1. [Uygun türde][node-token-types] bir filtreleme düğümü belirteci oluşturun:

    === "API token (Helm chart 4.6.8 ve üzeri)"
        1. Wallarm Console → **Settings** → **API tokens** öğesini [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
        1. Kullanım türü `Node deployment/Deployment` olan bir API token’ını bulun veya oluşturun.
        1. Bu token'ı kopyalayın.
    === "Node token"
        1. Wallarm Console → **Nodes** öğesini [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
        1. **Wallarm node** türünde bir filtreleme düğümü oluşturun ve üretilen token'ı kopyalayın.
            
            ![Bir Wallarm düğümünün oluşturulması][nginx-ing-create-node-img]
1. [Wallarm Helm chart’ları deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. Aşağıdaki Wallarm yapılandırmasıyla `values.yaml` dosyasını oluşturun:

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
    
    * `<NODE_TOKEN>`, Wallarm düğüm belirtecidir.
    * API token kullanırken, `nodeGroup` parametresinde bir düğüm grup adı belirtin. Düğümünüz bu gruba atanır ve Wallarm Console’un **Nodes** bölümünde görüntülenir. Varsayılan grup adı `defaultIngressGroup` değeridir.

    Daha fazla yapılandırma seçeneği için lütfen şu [bağlantıyı](configure-kubernetes-en.md) kullanın.
1. Wallarm Ingress Helm chart’ını yükleyin:
    ``` bash
    helm install --version 6.5.1 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress`, Helm sürümünün adıdır
    * `values.yaml`, önceki adımda oluşturulan Helm değerlerini içeren YAML dosyasıdır
    * `wallarm-ingress`, Helm chart’ın yükleneceği ad alandır (oluşturulacaktır)
1. Wallarm Ingress denetleyicisinin çalışır durumda olduğunu doğrulayın: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Wallarm pod durumu **STATUS: Running** ve **READY: N/N** olmalıdır:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```

### Adım 2: Wallarm’a özel `ingressClassName` ile Ingress nesnesi oluşturun

Önceki adımda `values.yaml` içinde yapılandırdığınızla aynı `ingressClass` adına sahip Ingress nesnesini oluşturun.

Ingress nesnesi, uygulamanızın dağıtıldığı ad alanıyla aynı ad alanında olmalıdır; örneğin:

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

### Adım 3: Mevcut Ingress denetleyicisini istekleri Wallarm’a iletecek şekilde yeniden yapılandırın

Mevcut Ingress denetleyicisini, gelen istekleri uygulama servisleri yerine yeni Wallarm Ingress denetleyicisine iletecek şekilde aşağıdaki gibi yeniden yapılandırın:

* `ingressClass` adı `nginx` olacak şekilde Ingress nesnesi oluşturun. Bu değerin varsayılan olduğunu lütfen unutmayın; farklıysa kendi değerinizle değiştirebilirsiniz. 
* Ingress nesnesi, Wallarm Ingress Chart ile aynı ad alanında olmalıdır; bu örnekte `wallarm-ingress`.
* `spec.rules[0].http.paths[0].backend.service.name` değerinin, Helm sürüm adı ve `.Values.nameOverride` birleşiminden oluşan Wallarm Ingress denetleyici servisinin adı olması gerekir.

    Adı almak için aşağıdaki komutu kullanabilirsiniz:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    Bizim örneğimizde ad `internal-ingress-wallarm-ingress-controller` şeklindedir.

Ortaya çıkan yapılandırma örneği:

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

### Adım 4: Wallarm Ingress denetleyicisinin çalışmasını test edin

Mevcut harici Ingress denetleyicisinin Load Balancer genel IP’sini alın; örneğin `ingress-nginx` ad alanına dağıtıldığını varsayalım:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

Mevcut Ingress denetleyicisi adresine bir test isteği gönderin ve sistemin beklendiği gibi çalıştığını doğrulayın:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```