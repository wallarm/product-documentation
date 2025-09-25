# Entegre Wallarm Servisleri ile NGINX Ingress Controller Dağıtımı

Bu talimatlar, Wallarm NGINX tabanlı Ingress controller'ını K8s kümenize dağıtmanız için gereken adımları sağlar. Çözüm, Wallarm Helm chart’ından dağıtılır.

Çözüm, entegre Wallarm servisleri ile [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) üzerine inşa edilmiştir. En son sürüm, NGINX stable 1.25.5 ile Community Ingress NGINX Controller 1.11.8’i, upstream Helm chart 4.11.8’i ve temel imaj olarak Alpine Linux 3.22.0’ı kullanır.

Aşağıdaki mimariye sahiptir:

![Çözüm mimarisi][nginx-ing-image]

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri][deployment-platform-docs] arasında, bu çözüm aşağıdaki kullanım senaryoları için önerilir:

* [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) ile uyumlu Ingress kaynaklarına trafiği yönlendiren bir Ingress controller'ınız ve güvenlik katmanınız yok.
* Hâlihazırda Community Ingress NGINX Controller kullanıyor ve hem standart controller işlevselliğini hem de gelişmiş güvenlik özelliklerini sunan bir güvenlik çözümü arıyorsunuz. Bu durumda, bu talimatta detaylandırılan Wallarm‑NGINX Ingress Controller’a zahmetsizce geçiş yapabilirsiniz. Değişimi tamamlamak için mevcut yapılandırmanızı yeni dağıtıma taşımanız yeterlidir.

    Hem mevcut Ingress controller’ı hem de Wallarm controller’ı aynı anda kullanmak için yapılandırma detayları için [Ingress Controller zincirleme kılavuzuna][chaining-doc] bakın.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "Ayrıca bakınız"
    * [Ingress nedir?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helm'in kurulumu](https://helm.sh/docs/intro/install/)

## Bilinen kısıtlamalar

* Postanalytics modülü olmadan çalıştırma desteklenmez.
* Postanalytics modülünün küçültülmesi saldırı verilerinin kısmi kaybına yol açabilir.

## Kurulum {#installation}

1. Wallarm Ingress controller’ı [kurun](#step-1-installing-the-wallarm-ingress-controller).
2. Ingress’iniz için trafik analizini [etkinleştirin](#step-2-enabling-traffic-analysis-for-your-ingress).
3. Wallarm Ingress controller’ın çalışmasını [kontrol edin](#step-3-checking-the-wallarm-ingress-controller-operation).

### Adım 1: Wallarm Ingress Controller'ın kurulumu {#step-1-installing-the-wallarm-ingress-controller}

Wallarm Ingress Controller’ı kurmak için:

1. [Uygun türde][node-token-types] bir filtreleme düğümü belirteci (token) oluşturun:

    === "API belirteci (Helm chart 4.6.8 ve üzeri)"
        1. Wallarm Console → **Settings** → **API tokens**’ı [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
        1. Kullanım türü `Node deployment/Deployment` olan bir API belirtecini bulun veya oluşturun.
        1. Bu belirteci kopyalayın.
    === "Düğüm belirteci"
        1. Wallarm Console → **Nodes**’u [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
        1. **Wallarm node** türünde bir filtreleme düğümü oluşturun ve üretilen belirteci kopyalayın.
            
            ![Bir Wallarm düğümünün oluşturulması][nginx-ing-create-node-img]
1. Wallarm Ingress controller ile Helm chart’ı dağıtmak için bir Kubernetes namespace’i oluşturun:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. [Wallarm yapılandırmasıyla][configure-nginx-ing-controller-docs] `values.yaml` dosyasını oluşturun. Minimum yapılandırmaya sahip örnek dosya aşağıdadır.

    Bir API belirteci kullanırken, `nodeGroup` parametresinde bir düğüm grubu adı belirtin. Düğümünüz bu gruba atanacak ve Wallarm Console’un **Nodes** bölümünde görünecektir. Varsayılan grup adı `defaultIngressGroup`’dur.

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
    
    Wallarm düğüm belirtecini Kubernetes secrets içinde saklayabilir ve Helm chart’a çekebilirsiniz. [Daha fazla bilgi][controllerwallarmexistingsecret-docs]

    !!! info "Kendi kayıtlarınızdan dağıtım"    
        Wallarm Ingress controller’ı [kendi kayıtlarınızdaki imajlardan](#deployment-from-your-own-registries) kurmak için `values.yaml` dosyasının öğelerini ezebilirsiniz.

1. Wallarm paketlerini kurun:

    ``` bash
    helm install --version 6.5.1 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: Ingress controller chart’ının Helm sürümü için ad
    * `<KUBERNETES_NAMESPACE>`: Wallarm Ingress controller ile Helm chart’ı için oluşturduğunuz Kubernetes namespace’i
    * `<PATH_TO_VALUES>`: `values.yaml` dosyasının yolu

### Adım 2: Ingress’iniz için trafik analizini etkinleştirme {#step-2-enabling-traffic-analysis-for-your-ingress}

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>`: Ingress’inizin adı
* `<YOUR_INGRESS_NAMESPACE>`: Ingress’inizin namespace’i
* `<APPLICATION_ID>`: [Uygulamalarınız veya uygulama gruplarınızdan][application-docs] her biri için benzersiz olan pozitif bir sayıdır. Bu, ayrı istatistikler almanıza ve ilgili uygulamalara yönelik saldırıları ayırt etmenize olanak tanır

### Adım 3: Wallarm Ingress Controller’ın çalışmasını kontrol etme {#step-3-checking-the-wallarm-ingress-controller-operation}

1. Pod listesini alın:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Wallarm pod durumu **STATUS: Running** ve **READY: N/N** olmalıdır:

    ```
    NAME                                                                  READY   STATUS    RESTARTS   AGE
    ingress-controller-wallarm-ingress-controller-6d659bd79b-952gl        3/3     Running   0          8m7s
    ingress-controller-wallarm-ingress-controller-wallarm-wstore-7ddmgbfm 3/3     Running   0          8m7s
    ```
2. Ingress Controller Service’e test [Yol Geçişi][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Filtreleme düğümü `block` modunda çalışıyorsa, isteğe verilen yanıtta `403 Forbidden` kodu döner ve saldırı Wallarm Console → **Attacks** içinde görüntülenir.

## ARM64 dağıtımı

NGINX Ingress controller’ın Helm chart sürümü 4.8.2 ile ARM64 işlemci uyumluluğu sunulmuştur. Başlangıçta x86 mimarileri için ayarlanmışken, ARM64 düğümlerine dağıtım Helm chart parametrelerinin değiştirilmesini gerektirir.

ARM64 ayarlarında, Kubernetes düğümleri genellikle `arm64` etiketi taşır. Kubernetes scheduler’ın Wallarm iş yükünü uygun düğüm türüne atamasına yardımcı olmak için, Wallarm Helm chart yapılandırmasında bu etikete `nodeSelector`, `tolerations` veya affinity kurallarıyla referans verin.

Aşağıda, ilgili düğümler için `kubernetes.io/arch: arm64` etiketini kullanan Google Kubernetes Engine (GKE) için Wallarm Helm chart örneği verilmiştir. Bu şablon, ARM64 etiketleme kurallarına saygı duyularak diğer bulut kurulumlarıyla uyumlu olacak şekilde değiştirilebilir.

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
        postanalytics:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # EU Cloud kullanıyorsanız bu satırı yorumlayın
        # Bir API belirteci kullanıyorsanız, aşağıdaki satırı yorumdan çıkarın ve düğüm grup adınızı belirtin
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
        postanalytics:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # EU Cloud kullanıyorsanız bu satırı yorumlayın
        # Bir API belirteci kullanıyorsanız, aşağıdaki satırı yorumdan çıkarın ve düğüm grup adınızı belirtin
        # nodeGroup: defaultIngressGroup
    ```

## Kendi kayıtlarınızdan dağıtım {#deployment-from-your-own-registries}

Bazı nedenlerle, örneğin şirket güvenlik politikanız herhangi bir harici kaynağın kullanımını kısıtladığı için Wallarm genel deposundan Docker imajlarını çekemiyorsanız, bunun yerine:

1. Bu imajları özel kayıtlarınıza klonlayın.
1. Bunları kullanarak Wallarm NGINX tabanlı Ingress controller’ı kurun.

NGINX tabanlı Ingress Controller dağıtımı için Helm chart tarafından aşağıdaki Docker imajları kullanılır:

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

Kayıtlarınızda depolanan imajları kullanarak Wallarm NGINX tabanlı Ingress controller’ı kurmak için, Wallarm Ingress controller Helm chart’ının `values.yaml` dosyasını aşağıdaki şekilde değiştirin:

```yaml
controller:
  image:
    ## Wallarm nginx ingress controller için imaj ve etiket
    ##
    registry: <YOUR_REGISTRY>
    image: wallarm/ingress-controller
    tag: <IMAGE_TAG>
  wallarm:
    helpers:
      ## Yardımcı imaj için imaj ve etiket
      ##
      image: <YOUR_REGISTRY>/wallarm/node-helpers
      tag: <IMAGE_TAG>
```

Ardından, değiştirilmiş `values.yaml` dosyanızı kullanarak kurulumu çalıştırın.

## OpenShift’te Security Context Constraints (SCC)

NGINX Ingress Controller’ı OpenShift üzerinde dağıtırken, platformun güvenlik gereksinimlerine uygun özel bir Security Context Constraint (SCC) tanımlamak gerekir. Varsayılan kısıtlamalar Wallarm çözümü için yetersiz kalabilir ve hatalara yol açabilir.

Aşağıda, Wallarm NGINX Ingress Controller için önerilen özel SCC yer almaktadır.

!!! warning "Controller'ı dağıtmadan önce SCC'yi uygulayın"
    SCC’nin Wallarm NGINX Ingress controller dağıtımından **önce** uygulanmış olduğundan emin olun.

1. Özel SCC’yi aşağıdaki gibi `wallarm-scc.yaml` dosyasında tanımlayın:

    ```yaml
    ---
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
        kubernetes.io/description: wallarm-ingress-admission provides features similar to restricted-v2 SCC
          but pins user id to 65532 and is more restrictive for volumes
      name: wallarm-ingress-admission
    priority: null
    readOnlyRootFilesystem: false
    requiredDropCapabilities:
    - ALL
    runAsUser:
      type: MustRunAs
      uid: 65532
    seLinuxContext:
      type: MustRunAs
    seccompProfiles:
    - runtime/default
    supplementalGroups:
      type: RunAsAny
    users: []
    volumes:
    - projected
    ---
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
        kubernetes.io/description: wallarm-ingress-controller provides features similar to restricted-v2 SCC
          but pins user id to 101 and is a little more restrictive for volumes
      name: wallarm-ingress-controller
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
    - secret
    - emptyDir
    ```
1. Bu politikayı kümeye uygulayın:

    ```
    kubectl apply -f wallarm-scc.yaml
    ```
1. NGINX Ingress controller’ın dağıtılacağı bir Kubernetes namespace’i oluşturun, örneğin:

    ```bash
    kubectl create namespace wallarm-ingress
    ```
1. Wallarm Ingress controller iş yüklerinin bu SCC politikasını kullanmasına izin verin:

    ```bash
    oc adm policy add-scc-to-user wallarm-ingress-admission \
      -z <RELEASE_NAME>-wallarm-ingress-admission -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z <RELEASE_NAME>-wallarm-ingress -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z default -n wallarm-ingress
    ```

    * `<RELEASE_NAME>`: `helm install` sırasında kullanacağınız Helm sürüm adı.
    * `-n wallarm-ingress`: NGINX Ingress controller’ın dağıtılacağı namespace (yukarıda oluşturuldu).

    Örneğin, `wallarm-ingress` namespace’i ve `wlrm-ingress` Helm sürüm adıyla:
    
    ```bash
    oc adm policy add-scc-to-user wallarm-ingress-admission \
      -z wlrm-ingress-wallarm-ingress-admission -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z wlrm-ingress-wallarm-ingress -n wallarm-ingress

    oc adm policy add-scc-to-user wallarm-ingress-controller \
      -z default -n wallarm-ingress
    ```
1. Yukarıda belirtilen aynı namespace ve Helm sürüm adını kullanarak [Wallarm NGINX Ingress controller’ı dağıtın](#installation).
1. Doğru SCC’nin Wallarm pod’larına uygulandığını doğrulayın:

    ```bash
    WALLARM_INGRESS_NAMESPACE="<WALLARM_INGRESS_NAMESPACE>"
    POD=$(kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=controller" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'

    WALLARM_INGRESS_NAMESPACE="<WALLARM_INGRESS_NAMESPACE>"
    POD=$(kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pods -o name -l "app.kubernetes.io/component=controller-wallarm-wstore" | cut -d '/' -f 2)
    kubectl -n ${WALLARM_INGRESS_NAMESPACE} get pod ${POD} -o jsonpath='{.metadata.annotations.openshift\.io\/scc}{"\n"}'
    ```

    Beklenen çıktı `wallarm-ingress-controller`’dır.

## Yapılandırma

Wallarm Ingress controller başarıyla kurulduktan ve kontrol edildikten sonra aşağıdakiler gibi gelişmiş yapılandırmalar yapabilirsiniz:

* [Son kullanıcı herkese açık IP adresinin doğru raporlanması][best-practices-for-public-ip]
* [IP adreslerinin engellenmesinin yönetimi][ip-lists-docs]
* [Yüksek erişilebilirlik ile ilgili hususlar][best-practices-for-high-availability]
* [Ingress Controller izleme][best-practices-for-ingress-monitoring]

Gelişmiş yapılandırma için kullanılan parametreleri ve ilgili talimatları bulmak üzere lütfen [bağlantıyı][configure-nginx-ing-controller-docs] takip edin.