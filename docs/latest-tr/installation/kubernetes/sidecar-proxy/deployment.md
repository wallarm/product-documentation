# Wallarm Sidecar Dağıtımı

Kubernetes kümesinde bir Pod olarak dağıtılan bir uygulamayı korumak için, uygulamanın önünde yan konteyner kontrolörü olarak çalışan NGINX tabanlı Wallarm node'unu kullanabilirsiniz. Wallarm sidecar kontrolörü, uygulama Pod'una gelen trafiği, yalnızca meşru isteklerin geçmesine izin vererek ve kötü niyetli olanları azaltarak filtreleyecektir.

**Wallarm Sidecar çözümünün temel özellikleri:**

* Ayrık mikroservislerin ve bunların kopyalarının ve parçalarının korumasını, uygulamalara benzer dağıtım formatı sunarak basitleştirir
* Herhangi bir Ingress kontrolörüyle tamamen uyumlu
* Genellikle servis mesh yaklaşımında yaygın olarak görülen yüksek yükler altında stabil çalışır
* Uygulamalarınızı korumak için minimum hizmet yapılandırması gerektirir; yalnızca uygulama pod'una koruma eklemek için bazı ek açıklamalar (annotations) ve etiketler (labels) ekleyin
* Wallarm konteyner dağıtımının iki modunu destekler: orta yükler için tüm Wallarm servislerinin tek bir konteynerde çalıştığı mod ve yüksek yükler için Wallarm servislerinin birkaç konteynere bölündüğü mod
* Çoğu belleği tüketen Wallarm sidecar çözümü için yerel veri analitiği backend'i olan postanalytics modülü için özel bir varlık sağlar

## Kullanım Senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, aşağıdaki **kullanım senaryoları** için bu çözüm önerilmektedir:

* Mevcut Ingress kontrolörüne (örneğin AWS ALB Ingress Controller) sahip altyapıya dağıtılacak bir güvenlik çözümü arıyorsanız ve bu durum [Wallarm NGINX tabanlı][nginx-ing-controller-docs] veya [Wallarm Kong temelli Ingress kontrolörü][kong-ing-controller-docs] dağıtımına engel oluyorsa
* Her mikroservisin (iç API'ler dahil) güvenlik çözümü tarafından korunmasını gerektiren sıfır güven (zero-trust) ortamı

## Trafik Akışı

Wallarm Sidecar ile trafik akışı:

![Traffic flow with Wallarm Sidecar][traffic-flow-with-wallarm-sidecar-img]

## Çözüm Mimarisi

Wallarm Sidecar çözümü, aşağıdaki Dağıtım (Deployment) nesneleriyle düzenlenmiştir:

* **Sidecar kontrolörü** (`wallarm-sidecar-controller`), Helm chart değerlerine ve pod açıklamalarına (annotations) dayanarak Pod içine Wallarm sidecar kaynaklarını enjekte eden ve node bileşenlerini Wallarm Cloud ile bağlayan [mutable admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)'dur.

    Kubernetes'te `wallarm-sidecar: enabled` etiketiyle yeni bir pod başladığında, kontrolör otomatik olarak pod içine gelen trafiği filtreleyen ek konteyneri enjekte eder.
* **Postanalytics modülü** (`wallarm-sidecar-postanalytics`), Wallarm sidecar çözümünün yerel veri analitiği backend'idir. Modül, bellek içi depolama olan Tarantool ve bazı yardımcı konteynerlerden (örneğin collectd, saldırı ihbar servisleri) oluşan bir set kullanır.

![Wallarm deployment objects][sidecar-deployment-objects-img]

Wallarm Sidecar'ın yaşam döngüsünde 2 standart aşama vardır:

1. **Başlangıç** aşamasında, kontrolör Helm chart değerlerine ve pod açıklamalarına göre Pod içine Wallarm sidecar kaynaklarını enjekte eder ve node bileşenlerini Wallarm Cloud ile bağlar.
2. **Çalışma** aşamasında, çözüm postanalytics modülünü içeren istekleri analiz edip proxy'ler/yönlendirir.

Çözüm, Alpine Linux tabanlı Docker imajlarını ve Alpine tarafından sağlanan NGINX sürümünü kullanır. Şu anda, en güncel imajlar Alpine Linux 3.20 sürümünü kullanmakta ve bu sürüm NGINX stable 1.26.1 içermektedir.

## Gereksinimler

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## Dağıtım

Wallarm Sidecar çözümünü dağıtmak için:

1. Bir filtreleme node token'ı oluşturun.
2. Wallarm Helm chart'ını dağıtın.
3. Wallarm Sidecar'ı uygulama Pod'una ekleyin.
4. Wallarm Sidecar operasyonunu test edin.

### Adım 1: Filtreleme Node Token'ı Oluşturun

Wallarm Cloud ile bağlantı kuracak yan konteyner pod'larını bağlamak için [uygun tipte bir token][node-token-types] oluşturun:

=== "API token"
    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)'da açın.
    1. `Deploy` kaynak rolüne sahip bir API token bulun ya da oluşturun.
    1. Bu token'ı kopyalayın.
=== "Node token"
    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)'da açın.
    1. **Wallarm node** tipi ile bir filtreleme node'u oluşturun ve oluşturulan token'ı kopyalayın.
        
      ![Creation of a Wallarm node][create-wallarm-node-img]

### Adım 2: Wallarm Helm Chart'ını Dağıtın

1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm Sidecar yapılandırması](customization.md) ile `values.yaml` dosyasını oluşturun. Minimum yapılandırmaya sahip dosya örneği aşağıdadır.

    API token kullanırken, `nodeGroup` parametresinde bir node grubu adı belirtin. Yan konteyner pod'ları için oluşturulan node'lar, Wallarm Console'daki **Nodes** bölümünde gösterilen bu gruba atanacaktır. Varsayılan grup adı `defaultSidecarGroup`'dur. Gerekirse, korudukları uygulama pod'ları için filtreleme node grup adlarını, [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group) açıklamasını kullanarak daha sonradan belirleyebilirsiniz.

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
    
    `<NODE_TOKEN>`, Kubernetes'te çalıştırılacak Wallarm node'unun token'ıdır.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm chart'ını dağıtın:

    ``` bash
    helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm Sidecar chart'ının Helm sürümü için verilen isimdir.
    * `wallarm-sidecar`, Helm release'i Wallarm Sidecar chart ile dağıtmak için oluşturulan yeni isim alanıdır; çözümü ayrı bir isim alanında dağıtmanız önerilir.
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yoludur.

### Adım 3: Wallarm Sidecar'ı Uygulama Pod'una Ekleyin

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

* Eğer `wallarm-sidecar` uygulama Pod etiketinin değeri `disabled` olarak ayarlanmış veya açıkça belirtilmemişse, Wallarm Sidecar konteyneri pod içine enjekte edilmez ve bu nedenle Wallarm trafiği filtrelemez.
* Eğer `wallarm-sidecar` uygulama Pod etiketinin değeri `enabled` olarak ayarlanmışsa, Wallarm Sidecar konteyneri pod içine enjekte edilir ve böylece Wallarm gelen trafiği filtreler.

### Adım 4: Wallarm Sidecar Operasyonunu Test Edin

Wallarm Sidecar'ın doğru çalıştığını test etmek için:

1. Wallarm kontrol düzlemi detaylarını alarak başarılı bir şekilde başladığını kontrol edin:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Her pod, örneğin **READY: N/N** ve **STATUS: Running** bilgilerini göstermelidir:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Wallarm sidecar konteynerinin başarılı bir şekilde enjekte edildiğini kontrol etmek amacıyla uygulama pod detaylarını alın:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    Çıktıda, başarılı yan konteyner enjekte edilmesini gösteren **READY: 2/2** ve Wallarm Cloud ile başarılı bağlantıyı gösteren **STATUS: Running** görünmelidir:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Wallarm'ın trafik filtrelemesi için etkin olduğu uygulama küme adresine, [Path Traversal][ptrav-attack-docs] saldırısını test olarak gönderin:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Wallarm proxy, varsayılan olarak **monitoring** [filtration mode][filtration-mode-docs] modunda çalıştığı için, Wallarm node saldırıyı engellemeyecek ancak saldırıyı kaydedecektir.

    Saldırının kaydedildiğini doğrulamak için, Wallarm Console → **Attacks** bölümüne gidin:

    ![Attacks in the interface][attacks-in-ui-image]

## ARM64 Dağıtımı

Sidecar proxy'nin Helm chart sürümü 4.10.2 ile ARM64 işlemci uyumluluğu tanıtılmıştır. Başlangıçta x86 mimarileri için ayarlanmış olan bu yapılandırmanın ARM64 node'larında dağıtılması, Helm chart parametrelerinin değiştirilmesini gerektirir.

ARM64 ayarlarında, Kubernetes node'ları genellikle `arm64` etiketi taşır. Kubernetes scheduler'ın Wallarm iş yükünü uygun node tipine yerleştirmesine yardımcı olmak için, Wallarm Helm chart yapılandırmasında bu etikete `nodeSelector`, `tolerations` veya affinity kuralları ile referans verin.

Aşağıda, ilgili node'lar için `kubernetes.io/arch: arm64` etiketini kullanan Google Kubernetes Engine (GKE) için Wallarm Helm chart örneği verilmiştir. Bu şablon, diğer bulut kurulumlarıyla uyumluluk için ARM64 etiketleme kurallarına uygun şekilde modifiye edilebilir.

=== "nodeSelector"
    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          # If using an API token, uncomment the following line and specify your node group name
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
          # If using an API token, uncomment the following line and specify your node group name
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

Sidecar çözümü OpenShift platformuna kurulurken, platformun güvenlik gereksinimlerini karşılamak üzere özel bir Security Context Constraint (SCC) tanımlamak gereklidir. Varsayılan kısıtlamalar Wallarm çözümü için yetersiz kalabilir ve hatalara neden olabilir.

Aşağıda, OpenShift için özel olarak uyarlanmış Wallarm Sidecar çözümü için önerilen SCC yer almaktadır. Bu yapılandırma, iptables kullanılmadığı durumda ayrıcalıksız (non-privileged) modda çözümü çalıştırmak üzere tasarlanmıştır.

!!! warning "SCC'yi çözümü dağıtmadan önce uygulayın"
    SCC'nin, Wallarm Sidecar çözümü dağıtılmadan önce uygulandığından emin olun.

1. `wallarm-scc.yaml` dosyasında özel SCC'yi aşağıdaki gibi tanımlayın:

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
      type: MustRunAs
      uid: 101
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
1. Wallarm Sidecar çözümünün bu SCC politikasını kullanmasına izin verin:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:<WALLARM_SIDECAR_NAMESPACE>:<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>
    ```

    * `<WALLARM_SIDECAR_NAMESPACE>`, Wallarm Sidecar çözümünün dağıtılacağı isim alanıdır.
    * `<POSTANALYTICS_POD_SERVICE_ACCOUNT_NAME>`, otomatik olarak oluşturulur ve genellikle `<RELEASE_NAME>-wallarm-sidecar-postanalytics` formatını takip eder; burada `<RELEASE_NAME>`, `helm install` sırasında atayacağınız Helm release ismindir.

    Örneğin, isim alanı `wallarm-sidecar` ve Helm release ismi `wlrm-sidecar` ise, komut şu şekilde olacaktır:
    
    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:serviceaccount:wallarm-sidecar:wlrm-sidecar-wallarm-sidecar-postanalytics
    ```
1. [Dağıtım bölümüne](#deployment) devam edin; Sidecar çözümünü dağıtırken daha önce belirtilen aynı isim alanını ve Helm release ismini kullandığınızdan emin olun.
1. Ayrıcalıklı iptables konteynerine olan ihtiyacı ortadan kaldırmak için [iptables kullanımını devre dışı bırakın](customization.md#capturing-incoming-traffic-port-forwarding).

    === "values.yaml üzerinden iptables'in devre dışı bırakılması"
        1. `values.yaml` dosyasında `config.injectionStrategy.iptablesEnable` değerini `false` olarak ayarlayın.

            ```yaml
            config:
              injectionStrategy:
                iptablesEnable: false
              wallarm:
                api:
                  ...
            ```
        1. Service manifest'inizde `spec.ports.targetPort` ayarını `proxy` portuna yönlendirin. İptables tabanlı trafik yakalama devre dışı bırakılırsa, Wallarm sidecar konteyneri `proxy` isimli bir port yayınlayacaktır.

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
    === "Pod açıklaması (annotation) üzerinden iptables'in devre dışı bırakılması"
        1. Her pod için iptables'i devre dışı bırakmak üzere, ilgili Pod'un `sidecar.wallarm.io/sidecar-injection-iptables-enable` açıklamasını `"false"` olarak ayarlayın.
        1. Service manifest'inizde `spec.ports.targetPort` ayarını `proxy` portuna yönlendirin. İptables tabanlı trafik yakalama devre dışı bırakılırsa, Wallarm sidecar konteyneri `proxy` isimli bir port yayınlayacaktır.

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
1. Önceki adımda uygulanan postanalytics pod'una SCC'nin doğru uygulanıp uygulanmadığını doğrulamak için aşağıdaki komutları çalıştırın:

    ```
    WALLARM_SIDECAR_NAMESPACE="wallarm-sidecar"
    POD=$(kubectl -n ${WALLARM_SIDECAR_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=postanalytics" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_SIDECAR_NAMESPACE}  get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    Beklenen çıktı `wallarm-sidecar-deployment` olmalıdır.
1. Başlangıçtaki `wallarm-sidecar-deployment` politikasındaki izinlerle, özellikle `runAsUser` bloğunda UID 101'in izin verilmesiyle, uygulama pod'unuzun SCC'sini güncelleyin. Bu, dağıtım sırasında enjekte edilen Wallarm sidecar konteyneri UID 101 altında çalıştığı için kritik öneme sahiptir.

    Aşağıdaki komutu kullanarak, daha önce oluşturduğunuz `wallarm-sidecar-deployment` politikasını uygulayın. Genellikle, uygulamanızın ve Wallarm'ın gereksinimlerine göre özel olarak uyarlanmış bir politika geliştirirsiniz.

    ```
    oc adm policy add-scc-to-user wallarm-sidecar-deployment system:<APP_NAMESPACE>:<APP_POD_SERVICE_ACCOUNT_NAME>
    ```
1. Güncellenmiş SCC ile uygulamayı dağıtın, örneğin:

    ```
    kubectl -n <APP_NAMESPACE> apply -f <MANIFEST_FILE>
    ```

## Özelleştirme

Wallarm pod'ları, [varsayılan `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) ve dağıtımın 2. adımında belirttiğiniz özel yapılandırmaya göre enjekte edilmiştir.

Wallarm çözümünden en iyi verimi almak için, Wallarm proxy davranışını küresel ve pod bazında daha da özelleştirebilirsiniz.

Bunun için [Wallarm proxy çözüm özelleştirme kılavuzuna](customization.md) geçiş yapın.