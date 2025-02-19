[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# Aynı Kubernetes kümesinde Wallarm ve ek Ingress Denetleyicilerinin Zincirleme Yapılandırılması

Bu talimatlar, K8s kümenize Wallarm Ingress denetleyicisini dağıtmanız ve mevcut ortamınızda çalışan diğer Denetleyicilerle zincirlemeniz için gerekli adımları sağlamaktadır.

## Çözümün Ele Aldığı Sorun

Wallarm, [Community Ingress NGINX Controller üzerine inşa edilmiş Ingress Controller](installation-kubernetes-en.md) dahil olmak üzere çeşitli form faktörlerinde düğüm yazılımını sunmaktadır.

Zaten bir Ingress denetleyicisi kullanıyorsanız, mevcut Ingress denetleyicisini Wallarm denetleyicisiyle değiştirmek zor olabilir (örneğin, AWS ALB Ingress Controller kullanılıyorsa). Bu durumda, [Wallarm Sidecar çözümünü](../installation/kubernetes/sidecar-proxy/deployment.md) inceleyebilirsiniz; ancak bu da altyapınıza uymuyorsa, birden fazla Ingress denetleyicisini zincirleme yapılandırmak mümkündür.

Ingress denetleyici zincirlemesi, son kullanıcı isteklerini kümeye ulaştırmak için mevcut bir denetleyiciden yararlanmanızı, gerekli uygulama korumasını sağlamak için ek bir Wallarm Ingress denetleyicisi dağıtmanızı mümkün kılar.

## Gereksinimler

* Kubernetes platformu sürümü 1.24-1.30
* [Helm](https://helm.sh/) paket yöneticisi
* Wallarm Console’da **Administrator** rolüne sahip ve iki faktörlü doğrulamanın devre dışı bırakıldığı bir hesaba erişim ( [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) )
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi
* Wallarm Helm grafiklerini eklemek için `https://charts.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* Wallarm’ın Docker Hub’daki `https://hub.docker.com/r/wallarm` deposuna erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* Saldırı tespit kuralları ve [API spesifikasyonlarını](../api-specification-enforcement/overview.md) indirmek ile [izin verilen, reddedilen veya gri listeye alınan](../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için hassas IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Ingress denetleyicisi çalışan dağıtılmış bir Kubernetes kümesi

## Wallarm Ingress Denetleyicisinin Dağıtılması ve Ek Bir Ingress Denetleyicisi ile Zincirleme Yapılandırılması

Wallarm Ingress denetleyicisini dağıtmak ve ek denetleyicilerle zincirlemek için:

1. Mevcut Ingress denetleyicisinden farklı bir Ingress sınıfı değeri kullanarak resmi Wallarm denetleyici Helm grafiğini dağıtın.
1. Aşağıdaki özelliklere sahip Wallarm’a özgü Ingress nesnesini oluşturun:

    * Wallarm Ingress Helm grafiğinin `values.yaml` dosyasında belirtilen ile aynı `ingressClass`.
    * Mevcut Ingress denetleyicisi ile aynı şekilde yapılandırılmış Ingress denetleyici istek yönlendirme kuralları.

    !!! info "Wallarm Ingress denetleyicisi küme dışında erişime açılmayacaktır"
        Lütfen, Wallarm Ingress denetleyicisinin hizmeti için `ClusterIP` kullandığını ve bunun da demek olduğunun farkında olun; yani küme dışında erişime açılmayacaktır.
1. Gelen istekleri uygulama servisleri yerine yeni Wallarm Ingress denetleyicisine yönlendirmek için mevcut Ingress denetleyicisini yeniden yapılandırın.
1. Wallarm Ingress denetleyicisinin çalışmasını test edin.

### Adım 1: Wallarm Ingress Denetleyicisini Dağıtın

1. [Uygun türdeki][node-token-types] bir filtreleme düğüm token’ı oluşturun:

    === "API token (Helm chart 4.6.8 ve üzeri)"
        1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
        1. `Deploy` kaynak rolüne sahip API token'ı bulun veya oluşturun.
        1. Bu token’ı kopyalayın.
    === "Node token"
        1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
        1. **Wallarm node** türünde bir filtreleme düğümü oluşturun ve üretilen token’ı kopyalayın.
            
            ![Creation of a Wallarm node][nginx-ing-create-node-img]
1. [Wallarm Helm charts repository](https://charts.wallarm.com/) ekleyin:
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
    
    * `<NODE_TOKEN>` Wallarm düğüm token’ıdır.
    * API token kullanıldığında, `nodeGroup` parametresinde bir düğüm grubu adı belirtin. Düğümünüz bu gruba atanacak, Wallarm Console’un **Nodes** bölümünde gösterilecektir. Varsayılan grup adı `defaultIngressGroup`’dir.

    Daha fazla yapılandırma seçeneğini öğrenmek için lütfen [linki](configure-kubernetes-en.md) kullanın.
1. Wallarm Ingress Helm grafiğini kurun:
    ``` bash
    helm install --version 5.3.0 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` Helm sürümü adıdır.
    * `values.yaml` önceki adımda oluşturulan Helm değerleri içeren YAML dosyasıdır.
    * `wallarm-ingress` Helm grafiğinin yükleneceği ad alanıdır (oluşturulacaktır).
1. Wallarm ingress denetleyicisinin çalışır durumda olduğunu doğrulayın: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Her bir pod durumu **STATUS: Running** veya **READY: N/N** olmalıdır. Örneğin:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### Adım 2: Wallarm’a Özgü `ingressClassName` ile Ingress Nesnesi Oluşturma

Önceki adımda `values.yaml` dosyasında yapılandırılan ile aynı `ingressClass` adıyla Ingress nesnesini oluşturun.

Ingress nesnesi uygulamanızın dağıtıldığı aynı ad alanında yer almalıdır, örneğin:

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

### Adım 3: Mevcut Ingress Denetleyicisini Wallarm’e Yönlendirecek Şekilde Yeniden Yapılandırma

Gelen istekleri uygulama servisleri yerine yeni Wallarm Ingress denetleyicisine yönlendirmek için mevcut Ingress denetleyicisini yeniden yapılandırın:

* İsim alanı `nginx` olan bir Ingress nesnesi oluşturun. Lütfen bunun varsayılan değer olduğunu ve değer sizin ortamınıza göre farklıysa kendi değerinizi kullanabileceğinizi unutmayın. 
* Ingress nesnesi, Wallarm Ingress Grafiğinin kurulu olduğu aynı ad alanında yer almalıdır; örneğimizde bu `wallarm-ingress`’tir.
* `spec.rules[0].http.paths[0].backend.service.name` değeri, Helm sürüm adı ile `.Values.nameOverride` bileşiminden oluşan Wallarm Ingress denetleyici servisi adı olmalıdır.

    İsmi almak için aşağıdaki komutu kullanabilirsiniz:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    Örneğimizde isim `internal-ingress-wallarm-ingress-controller`’dir.

Aşağıdaki yapılandırma örneği:

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

### Adım 4: Wallarm Ingress Denetleyicisinin Çalışmasını Test Etme

Mevcut dış Ingress denetleyicisinin Yük Dengeleyici (Load Balancer) genel IP adresini alın, örneğin, bunun `ingress-nginx` ad alanında dağıtıldığını varsayalım:

```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

Mevcut Ingress denetleyici adresine test isteği gönderin ve sistemin beklendiği gibi çalıştığını doğrulayın:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```