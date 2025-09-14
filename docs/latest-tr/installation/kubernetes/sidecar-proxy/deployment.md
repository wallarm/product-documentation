# Wallarm Sidecar'ı Dağıtma

Kubernetes kümesinde Pod olarak dağıtılmış bir uygulamayı güvenceye almak için, uygulamanın önünde sidecar denetleyicisi olarak NGINX tabanlı Wallarm düğümünü çalıştırabilirsiniz. Wallarm sidecar denetleyicisi, uygulama Pod'una gelen trafiği filtreleyerek yalnızca meşru istekleri kabul eder ve kötü niyetli olanları sınırlar.

Wallarm Sidecar çözümünün ana özellikleri:

* Uygulamalara benzer bir dağıtım formatı sağlayarak ayrık mikro hizmetlerin ve bunların replikalarının ve shard'larının korunmasını basitleştirir
* Herhangi bir Ingress controller ile tamamen uyumludur
* Genellikle service mesh yaklaşımı için yaygın olan yüksek yükler altında kararlı çalışır
* Uygulamalarınızı güvenceye almak için minimum hizmet yapılandırması gerektirir; korumak istediğiniz uygulama pod'una yalnızca bazı açıklamalar (annotations) ve etiketler ekleyin
* Wallarm konteyner dağıtımının iki modunu destekler: Wallarm servislerinin tek konteynerde çalıştığı orta yükler ve Wallarm servislerinin birkaç konteynere bölündüğü yüksek yükler için
* Wallarm sidecar çözümü için yerel veri analitiği arka ucu olan ve belleğin çoğunu tüketen postanalytics modülü için özel bir varlık sağlar

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki kullanım senaryoları için önerilir:

* Mevcut Ingress controller'lı (ör. AWS ALB Ingress Controller) altyapıya dağıtılacak bir güvenlik çözümü arıyorsunuz ve bu durum [Wallarm NGINX tabanlı Ingress Controller][nginx-ing-controller-docs] veya [Kong Ingress controller için Wallarm bağlayıcı][kong-ing-controller-docs] dağıtımını engelliyor
* Her mikro hizmetin (dahili API'ler dahil) güvenlik çözümüyle korunmasını gerektiren sıfır güven (zero-trust) ortamı

## Trafik akışı

Wallarm Sidecar ile trafik akışı:

![Wallarm Sidecar ile trafik akışı][traffic-flow-with-wallarm-sidecar-img]

## Çözüm mimarisi

Wallarm Sidecar çözümü aşağıdaki Deployment nesneleriyle düzenlenir:

* Sidecar controller (`wallarm-sidecar-controller`), Pod'a Wallarm sidecar kaynaklarını enjekte eden, onu Helm chart değerleri ve pod açıklamalarına göre yapılandıran ve düğüm bileşenlerini Wallarm Cloud'a bağlayan [mutating admission webhook'tur](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks).

    Kubernetes'te `wallarm-sidecar: enabled` etiketi bulunan yeni bir pod başlatıldığında, denetleyici gelen trafiği filtreleyen ek konteyneri otomatik olarak pod'a enjekte eder.
* Postanalytics modülü (`wallarm-sidecar-postanalytics`), Wallarm sidecar çözümü için yerel veri analitiği arka ucudur. Modül, bellek içi depolama wstore'u ve saldırı dışa aktarma servisleri gibi bazı yardımcı konteynerleri kullanır.

![Wallarm dağıtım nesneleri][sidecar-deployment-objects-img]

Wallarm Sidecar'ın yaşam döngüsünde 2 standart aşama vardır:

1. Başlangıç aşamasında, denetleyici Wallarm sidecar kaynaklarını Pod'a enjekte eder, onu Helm chart değerleri ve pod açıklamalarına göre yapılandırır ve düğüm bileşenlerini Wallarm Cloud'a bağlar.
1. Çalışma zamanında, çözüm postanalytics modülünü kullanarak istekleri analiz eder ve proxy'ler/iletir.

Çözüm, Alpine Linux ve Alpine'in sağladığı NGINX sürümüne dayalı Docker imajlarını kullanır. Şu anda en yeni imajlar, NGINX kararlı sürüm 1.28.0'ı içeren Alpine Linux sürüm 3.22'yi kullanmaktadır.

## Gereksinimler

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## Dağıtım

Wallarm Sidecar çözümünü dağıtmak için:

1. Bir filtreleme düğümü belirteci (token) oluşturun.
1. Wallarm Helm chart'ını dağıtın.
1. Wallarm Sidecar'ı uygulama Pod'una ekleyin.
1. Wallarm Sidecar çalışmasını test edin.

### Adım 1: Bir filtreleme düğümü belirteci oluşturun

Sidecar pod'larını Wallarm Cloud'a bağlamak için [uygun türde][node-token-types] bir filtreleme düğümü belirteci oluşturun:

=== "API token"
    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. Kullanım türü `Node deployment/Deployment` olan bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
=== "Node token"
    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. **Wallarm node** türünde bir filtreleme düğümü oluşturun ve üretilen token'ı kopyalayın.
        
      ![Bir Wallarm düğümünün oluşturulması][create-wallarm-node-img]

### Adım 2: Wallarm Helm chart'ını dağıtın

1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm Sidecar yapılandırmasını](customization.md) içeren `values.yaml` dosyasını oluşturun. Minimum yapılandırmaya sahip dosya örneği aşağıdadır.

    API token kullanırken, `nodeGroup` parametresinde bir düğüm grup adı belirtin. Sidecar pod'ları için oluşturulan düğümleriniz, Wallarm Console'un **Nodes** bölümünde gösterilen bu gruba atanacaktır. Varsayılan grup adı `defaultSidecarGroup`'tur. Gerekirse, daha sonra korudukları uygulamaların pod'ları için [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group) açıklamasını kullanarak filtreleme düğümü grup adlarını pod bazında ayrı ayrı ayarlayabilirsiniz.

    === "US Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "EU Cloud"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
    `<NODE_TOKEN>`, Kubernetes'te çalışacak Wallarm düğümünün token'ıdır.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm chart'ını dağıtın:

    ``` bash
    helm install --version 6.5.1 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm Sidecar chart'ının Helm sürüm adı
    * `wallarm-sidecar`, Wallarm Sidecar chart'ının Helm sürümünün dağıtılacağı yeni ad alanı; ayrı bir ad alanına dağıtılması önerilir
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yolu

### Adım 3: Wallarm Sidecar'ı uygulama Pod'una ekleyin

Wallarm'ın uygulama trafiğini filtrelemesi için, ilgili uygulama Pod'una `wallarm-sidecar: enabled` etiketini ekleyin:

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

* `wallarm-sidecar` uygulama Pod etiketi `disabled` olarak ayarlanmışsa veya açıkça belirtilmemişse, Wallarm Sidecar konteyneri bir pod'a enjekte edilmez ve dolayısıyla Wallarm trafiği filtrelemez.
* `wallarm-sidecar` uygulama Pod etiketi `enabled` olarak ayarlanmışsa, Wallarm Sidecar konteyneri bir pod'a enjekte edilir ve dolayısıyla Wallarm gelen trafiği filtreler.

### Adım 4: Wallarm Sidecar çalışmasını test edin

Wallarm Sidecar'ın doğru çalıştığını test etmek için:

1. Başarıyla başlatıldığını kontrol etmek üzere Wallarm kontrol düzlemi ayrıntılarını alın:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her pod aşağıdakileri göstermelidir: **READY: N/N** ve **STATUS: Running**, ör.:

    ```
    NAME                                             READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   3/3     Running   0          91m
    ```
1. Wallarm sidecar konteynerinin başarıyla enjekte edildiğini kontrol etmek için uygulama pod ayrıntılarını alın:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    Çıktı, başarılı sidecar konteyner enjeksiyonunu gösteren **READY: 2/2** ve Wallarm Cloud'a başarılı bağlantıyı gösteren **STATUS: Running** içermelidir:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarm'ın trafiği filtrelemek üzere etkin olduğu uygulama kümesi adresine test amaçlı bir [Path Traversal][ptrav-attack-docs] saldırısı gönderin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarm proxy varsayılan olarak **monitoring** [filtreleme modunda][filtration-mode-docs] çalıştığından, Wallarm düğümü saldırıyı engellemeyecek ancak kaydedecektir.

    Saldırının kaydedildiğini kontrol etmek için Wallarm Console → **Attacks** bölümüne gidin:

    ![Arayüzde Attacks][attacks-in-ui-image]

## ARM64 dağıtımı

Sidecar proxy'nin Helm chart sürümü 4.10.2 ile ARM64 işlemci uyumluluğu sunulmuştur. Başlangıçta x86 mimarileri için ayarlanmış olan dağıtım, ARM64 düğümlerinde Helm chart parametrelerinin değiştirilmesini gerektirir.

ARM64 ayarlarında, Kubernetes düğümleri genellikle `arm64` etiketi taşır. Kubernetes zamanlayıcısının Wallarm iş yükünü uygun düğüm türüne atamasına yardımcı olmak için bu etikete Wallarm Helm chart yapılandırmasında `nodeSelector`, `tolerations` veya affinity kuralları kullanılarak referans verin.

Aşağıda, ilgili düğümler için `kubernetes.io/arch: arm64` etiketini kullanan Google Kubernetes Engine (GKE) için Wallarm Helm chart örneği bulunmaktadır. Bu şablon, kendi ARM64 etiketleme kurallarına saygı göstererek diğer bulut yapılandırmalarıyla uyum için değiştirilebilir.

=== "nodeSelector"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # API token kullanıyorsanız, aşağıdaki satırın yorum işaretini kaldırın ve düğüm grup adınızı belirtin
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        nodeSelector:
          kubernetes.io/arch: arm64
      controller:
        nodeSelector:
          kubernetes.io/arch: arm64
    ```
=== "tolerations"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # API token kullanıyorsanız, aşağıdaki satırın yorum işaretini kaldırın ve düğüm grup adınızı belirtin
          # nodeGroup: "defaultSidecarGroup"
      postanalytics:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
      controller:
        tolerations:
          - key: kubernetes.io/arch
            operator: Equal
            value: arm64
            effect: NoSchedule
    ```

## OpenShift'te Security Context Constraints (SCC)

Sidecar çözümünü OpenShift üzerinde dağıtırken, platformun güvenlik gereksinimlerine uygun özel bir Security Context Constraint (SCC) tanımlamak gerekir. Varsayılan kısıtlamalar Wallarm çözümü için yetersiz olabilir ve hatalara yol açabilir.

Aşağıda, OpenShift'e uyarlanmış Wallarm Sidecar çözümü için önerilen özel SCC bulunmaktadır. Bu yapılandırma, [iptables](customization.md#capturing-incoming-traffic-port-forwarding) kullanılmadan ayrıcalıksız modda çözümü çalıştırmak için tasarlanmıştır.

!!! warning "Sidecar'ı dağıtmadan önce SCC'yi uygulayın"
    SCC'nin Wallarm Sidecar çözümünü dağıtmadan önce uygulanmış olduğundan emin olun.

1. Özel SCC'yi aşağıdaki gibi `wallarm-scc.yaml` dosyasında tanımlayın:

    ```yaml
    allowHostDirVolumePlugin: false
    allowHostIPC: false
    allowHostNetwork: false
    allowHostPID: false
    allowHostPorts: false
    allowPrivilegeEscalation: false
    allowPrivilegedContainer: false
    allowedCapabilities:
    - NET_BIND_SERVICE
    apiVersion: security.openshift.io/v1
    defaultAddCapabilities: null
    fsGroup:
      type: MustRunAs
    groups: []
    kind: SecurityContextConstraints
    metadata:
      annotations:
        kubernetes.io/description: wallarm-sidecar-deployment
      name: wallarm-sidecar-deployment
    priority: null
    readOnlyRootFilesystem: false
    requiredDropCapabilities:
    - ALL
    runAsUser:
      type: MustRunAsRange
      uidRangeMin: 101
      uidRangeMax: 65532
    seLinuxContext:
      type: MustRunAs
    seccompProfiles:
    - runtime/default
    supplementalGroups:
      type: RunAsAny
    users: []
    volumes:
    - configMap
    - emptyDir
    - secret
    ```
1. Bu politikayı kümeye uygulayın:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. Sidecar'ın dağıtılacağı bir Kubernetes ad alanı oluşturun, ör.:

    ```bash
    kubectl create namespace wallarm-sidecar
    ```
1. Wallarm Sidecar iş yüklerinin SCC politikasını kullanmasına izin verin:

    ```bash    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z <RELEASE_NAME>-wallarm-sidecar-postanalytics -n wallarm-sidecar
    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z <RELEASE_NAME>-wallarm-sidecar-admission -n wallarm-sidecar
    ```

    * `<RELEASE_NAME>`: `helm install` sırasında kullanacağınız Helm sürüm adı.

        !!! warning "`wallarm-sidecar` sürüm adında geçiyorsa"
            Sürüm adı `wallarm-sidecar` içeriyorsa, bunu servis hesabı adlarından çıkarın.
            
            Hesap adları `wallarm-sidecar-postanalytics` ve `wallarm-sidecar-admission` olacaktır.
    
    * `-n wallarm-sidecar`: Sidecar'ın dağıtılacağı ad alanı (yukarıda oluşturuldu).

    Örneğin, ad alanı `wallarm-sidecar` ve Helm sürüm adı `wlrm-sidecar` ise:
    
    ```bash    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z wlrm-sidecar-wallarm-sidecar-postanalytics -n wallarm-sidecar
    
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      -z wlrm-sidecar-wallarm-sidecar-admission -n wallarm-sidecar
    ```
1. Yukarıda belirtilen ad alanını ve Helm sürüm adını kullanarak [Wallarm Sidecar'ı dağıtın](#deployment).
1. Ayrıcalıklı iptables konteyneri çalıştırmaktan kaçınmak için iptables kullanımını [devre dışı bırakın](customization.md#capturing-incoming-traffic-port-forwarding). Bu, `values.yaml` içinde global olarak veya anotasyonlar aracılığıyla pod bazında yapılabilir.

    === "iptables'ı `values.yaml` üzerinden devre dışı bırakma"
        1. `values.yaml` içinde `config.injectionStrategy.iptablesEnable` değerini `false` olarak ayarlayın.

            ```yaml
            config:
              injectionStrategy:
                iptablesEnable: false
              wallarm:
                api:
                  ...
            ```
        1. Uygulamanızın Service manifest'inde `spec.ports.targetPort` değerini `proxy` olarak ayarlayın. iptables devre dışıyken, Sidecar bu portu açığa çıkarır.

            ```yaml hl_lines="9"
            apiVersion: v1
            kind: Service
            metadata:
              name: myapp-svc
              namespace: default
            spec:
              ports:
                - port: 80
                  targetPort: proxy
                  protocol: TCP
                  name: http
              selector:
                app: myapp
            ```

            Uygulamayı bir OpenShift Route üzerinden yayımlarken, `spec.ports.targetPort` değerini `26001` olarak ayarlayın.
    === "Pod anotasyonu ile iptables'ı devre dışı bırakma"
        1. Pod'un açıklamasında `sidecar.wallarm.io/sidecar-injection-iptables-enable` anahtarını `"false"` olarak ayarlayarak iptables'ı pod bazında devre dışı bırakın.
        1. Uygulamanızın Service manifest'inde `spec.ports.targetPort` değerini `proxy` olarak ayarlayın. iptables devre dışıyken, Sidecar bu portu açığa çıkarır.

        ```yaml hl_lines="16-17 34"
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
              annotations:
                sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
            spec:
              containers:
                - name: application
                  image: kennethreitz/httpbin
                  ports:
                    - name: http
                      containerPort: 80
        ---
        apiVersion: v1
        kind: Service
        metadata:
          name: myapp-svc
          namespace: default
        spec:
          ports:
            - port: 80
              targetPort: proxy
              protocol: TCP
              name: http
          selector:
            app: myapp
        ```

        Uygulamayı bir OpenShift Route üzerinden yayımlarken, `spec.ports.targetPort` değerini `26001` olarak ayarlayın.
1. Güncellenmiş yapılandırma ile uygulamayı dağıtın:

    ```bash
    kubectl -n <APP_NAMESPACE> apply -f <MANIFEST_FILE>
    ```
1. Doğru SCC'nin Wallarm pod'larına uygulandığını doğrulayın:

    ```bash
    WALLARM_SIDECAR_NAMESPACE="wallarm-sidecar"
    POD=$(kubectl -n ${WALLARM_SIDECAR_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=postanalytics" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_SIDECAR_NAMESPACE}  get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    Beklenen çıktı `wallarm-sidecar-deployment`'tır.
1. Enjekte edilen Sidecar konteyneri bu UID aralığında çalıştığından, uygulama pod'unuza `wallarm-sidecar-deployment` ile aynı SCC'yi verin; gerekli UID aralığına izin verdiğinden emin olun.

    `wallarm-sidecar-deployment` politikasını atamak için aşağıdaki komutu kullanın:

    ```bash
    APP_NAMESPACE=<APP_NAMESPACE>
    POD_NAME=<POD_NAME>
    APP_POD_SERVICE_ACCOUNT_NAME=$(oc get pod $POD_NAME -n $APP_NAMESPACE -o jsonpath='{.spec.serviceAccountName}')
    oc adm policy add-scc-to-user wallarm-sidecar-deployment \
      system:serviceaccount:$APP_NAMESPACE:$APP_POD_SERVICE_ACCOUNT_NAME
    ```

    Prod ortamında, uygulamanızın ve Wallarm'ın ihtiyaçlarına uygun özel bir SCC oluşturun.

## Özelleştirme

Wallarm pod'ları, [varsayılan `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) ve 2. dağıtım adımında belirttiğiniz özel yapılandırmaya göre enjekte edilmiştir.

Wallarm proxy davranışını hem global hem de pod bazında daha da özelleştirerek, şirketiniz için Wallarm çözümünden en iyi şekilde yararlanabilirsiniz.

Sadece [Wallarm proxy çözümü özelleştirme kılavuzuna](customization.md) ilerleyin.