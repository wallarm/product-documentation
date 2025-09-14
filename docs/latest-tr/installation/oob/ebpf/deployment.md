[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm eBPF Tabanlı Çözüm (Beta Sürümü)

Wallarm, Linux çekirdeğinin gücünden yararlanan ve Kubernetes ortamlarıyla sorunsuz entegre olan eBPF tabanlı güvenlik çözümünün beta sürümünü sunar. Bu makale, çözümün Helm chart kullanılarak nasıl kullanılacağını ve dağıtılacağını açıklar.

!!! warning "4.10 sürümüyle sınırlıdır"
    Wallarm eBPF tabanlı çözüm, şu anda yalnızca [Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/) ile sunulan özellikleri desteklemektedir.

## Trafik akışı

Wallarm eBPF tabanlı çözüm ile trafik akışı:

![eBPF trafik akışı](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

eBPF çözümü, aşağıdaki protokolleri kullanarak trafiği izlemek üzere tasarlanmıştır:

* HTTP 1.x veya HTTP 2
* Proxy v1 veya Proxy v2

Trafik TLS/SSL şifreleme veya düz metin veri transferi kullanabilir. SSL trafiğinin analizi, paylaşılan OpenSSL kütüphanesini kullanan sunucularla (ör. NGINX, HAProxy) sınırlıdır ve Envoy gibi diğer SSL uygulamalarını kullanan sunucular için mevcut değildir.

## Nasıl çalışır

Linux işletim sistemi çekirdek ve kullanıcı alanından oluşur; çekirdek donanım kaynaklarını ve kritik görevleri yönetirken uygulamalar kullanıcı alanında çalışır. Bu ortamda eBPF (Extended Berkeley Packet Filter), güvenliğe odaklananlar da dahil olmak üzere özel programların Linux çekirdeğinde yürütülmesini sağlar. [eBPF hakkında daha fazlasını okuyun](https://ebpf.io/what-is-ebpf/)

Kubernetes, süreç izolasyonu, kaynak yönetimi ve ağ oluşturma gibi kritik görevler için Linux çekirdeğinin yeteneklerinden yararlandığından, eBPF tabanlı güvenlik çözümlerinin entegrasyonu için elverişli bir ortam oluşturur. Bu doğrultuda Wallarm, çekirdeğin işlevselliklerinden yararlanarak Kubernetes ile sorunsuz entegre olan eBPF tabanlı bir güvenlik çözümü sunar.

Çözüm, bir trafik aynası üreten ve bunu Wallarm node’una ileten bir ajandan oluşur. Dağıtım sırasında, yansıtma seviyesini ad alanı (namespace) veya pod düzeyinde belirtebilirsiniz. Wallarm node’u, yansıtılan trafiği güvenlik tehditleri açısından inceler; kötü amaçlı etkinliği engellemez. Bunun yerine, tespit edilen etkinliği Wallarm Cloud’a kaydederek Wallarm Console UI üzerinden trafik güvenliğine görünürlük sağlar.

Aşağıdaki diyagram çözüm bileşenlerini göstermektedir:

![eBPF bileşenleri](../../../images/waf-installation/epbf/ebpf-components.png)

eBPF ajanı, her Kubernetes işçi (worker) düğümünde bir DaemonSet olarak dağıtılır. Doğru işlevselliği sağlamak için ajan konteynerinin ayrıcalıklı modda çalışması ve şu temel yeteneklere sahip olması gerekir: `SYS_PTRACE` ve `SYS_ADMIN`.

Ayrıca çözüm, yanıt kodlarını işler ve Wallarm’ın temel [API Discovery](../../../api-discovery/overview.md) modülünün API uç noktalarınızı tanımlamasına, API envanterinizi oluşturmasına ve güncel tutmasına olanak tanır.

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../../supported-deployment-options.md) arasında bu çözüm, out-of-band çalışma için önerilen seçenektir. Trafiğin içinde çalışmak yerine yansıtılmış bir kopyasını yakalayarak eBPF tabanlı çözüm kesintisiz trafik akışı sağlar. Bu yaklaşım, canlı trafik üzerindeki etkiyi en aza indirir ve gecikmeyi etkileyebilecek ek gecikmelerin önüne geçer.

## Teknik gereksinimler

eBPF çözümünün başarıyla dağıtılması için aşağıdaki teknik önkoşulların karşılandığından emin olun:

* Desteklenen Kubernetes sürümü:
  
    * AWS - Kubernetes 1.24 ve üzeri
    * Azure - Kubernetes 1.26 ve üzeri
    * GCP - herhangi bir Kubernetes sürümü
    * Bare-metal sunucu - Kubernetes 1.22 ve üzeri
* Ajanın yakalanan trafiği güvenli bir şekilde Wallarm işleme düğümüne yansıtmasını sağlamak için [cert-manager](https://cert-manager.io/docs/installation/helm/) kurulmuş olmalıdır.
* [Helm v3](https://helm.sh/) paket yöneticisi.
* BTF (BPF Type Format) etkin 5.10 veya 5.15 Linux çekirdeği. Ubuntu, Debian, RedHat, Google COS veya Amazon Linux 2 üzerinde desteklenir.
* x86_64 mimarisine sahip işlemci.
* Çözüm beta aşamasında olduğundan, tüm Kubernetes kaynakları etkin biçimde yansıtılamayabilir. Bu nedenle trafiğin özellikle Kubernetes içindeki NGINX Ingress controller’ları, Kong Ingress controller’ları veya normal NGINX sunucuları için yansıtılmasını öneriyoruz.
* Kullanıcı hesabınızın Wallarm Console üzerinde [**Administrator** erişimi](../../../user-guides/settings/users.md#user-roles) olmalıdır.

Kullanım senaryonuz listelenen gereksinimlerden farklıysa, özel ihtiyaçlarınızı karşılamak için yapılabilecek olası uyarlamaları değerlendirmek üzere ortamınız hakkında ayrıntılı teknik bilgiler vererek [satış mühendislerimizle](mailto:sales@wallarm.com) iletişime geçin.

## Ağ erişimi

Sınırlı dışa giden trafik bulunan ortamlarda çözümün doğru çalışmasını sağlamak için, aşağıdaki harici kaynaklara erişime izin verecek şekilde ağ erişimini yapılandırın:

* Wallarm Helm chart’larını eklemek için `https://charts.wallarm.com`.
* Wallarm Docker imajlarını Docker Hub’dan çekmek için `https://hub.docker.com/r/wallarm`.
* US Wallarm Cloud kullanıcıları `https://us1.api.wallarm.com` adresine erişmelidir. EU Wallarm Cloud kullanıcıları `https://api.wallarm.com` adresine erişmelidir.
* Saldırı tespit kurallarına ve [API spesifikasyonlarına](../../../api-specification-enforcement/overview.md) yönelik güncellemeleri indirmek, ayrıca [izinli, yasaklı veya gri listeye alınmış](../../../user-guides/ip-lists/overview.md) ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak için aşağıdaki IP adresleri.

    --8<-- "../include/wallarm-cloud-ips.md"

## Dağıtım

Wallarm eBPF çözümünü dağıtmak için:

1. Wallarm node’unu oluşturun.
1. Wallarm Helm chart’ını dağıtın.
1. Trafik yansıtmayı etkinleştirin.
1. Wallarm eBPF çalışmasını test edin.

### Adım 1: Wallarm node’unu oluşturun

1. Aşağıdaki bağlantı aracılığıyla Wallarm Console → **Nodes** bölümünü açın:

    * US Cloud için https://us1.my.wallarm.com/nodes
    * EU Cloud için https://my.wallarm.com/nodes
1. **Wallarm node** türünde bir filtreleme düğümü oluşturun ve üretilen token’ı kopyalayın.
    
    ![!Bir Wallarm node'unun oluşturulması](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Adım 2: Wallarm Helm chart’ını dağıtın

1. Ortamınızın yukarıdaki gereksinimleri karşıladığından ve [cert-manager](https://cert-manager.io/docs/installation/helm/) kurulu olduğundan emin olun.
1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm eBPF çözüm yapılandırması](helm-chart-for-wallarm.md) ile `values.yaml` dosyasını oluşturun.

    Minimum yapılandırmalı dosya örneği:

    === "US Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>`, Kubernetes’te çalıştırılacak Wallarm node’unun token’ıdır.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm chart’ını dağıtın:

    ``` bash
    helm install --version 0.10.28 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm eBPF chart’ının Helm sürümü için isimdir
    * `wallarm-ebpf`, Wallarm eBPF chart’ı ile Helm sürümünün dağıtılacağı yeni ad alanıdır; ayrı bir ad alanına dağıtılması önerilir
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yoludur

### Adım 3: Trafik yansıtmayı etkinleştirin

NGINX Ingress controller, Kong Ingress controller veya normal NGINX sunucuları için Wallarm eBPF tabanlı çözümden etkin şekilde yararlanmak amacıyla trafik yansıtmayı etkinleştirmenizi öneririz.

Varsayılan olarak, dağıtılan çözüm herhangi bir trafiği analiz etmez. Trafik analizini etkinleştirmek için, istediğiniz seviyede trafik yansıtmayı etkinleştirmeniz gerekir; seçenekler:

* Bir ad alanı (namespace) için
* Bir pod için
* Bir düğüm adı veya bir konteyner için

Trafik yansıtmayı etkinleştirmenin iki yolu vardır: ad alanı etiketleri veya pod açıklamaları (annotation) olarak dinamik filtreler kullanmak ya da `values.yaml` dosyasındaki `config.agent.mirror.filters` bloğu üzerinden kontrol etmek. Bu yaklaşımları birleştirebilirsiniz. [Daha fazla bilgi](selecting-packets.md)

#### Bir ad alanı için bir etiket kullanarak

Bir ad alanı için yansıtmayı etkinleştirmek üzere, ad alanı etiketi `wallarm-mirror` değerini `enabled` olarak ayarlayın:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### Bir pod için bir açıklama kullanarak

Bir pod için yansıtmayı etkinleştirmek üzere, `mirror.wallarm.com/enabled` açıklamasını `true` olarak ayarlayın:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### `values.yaml` kullanarak ad alanı, pod, konteyner veya düğüm için

Daha ayrıntılı kontrol için, Wallarm eBPF’in `values.yaml` dosyasındaki `config.agent.mirror.filters` bloğunu kullanarak yansıtma seviyesini belirtebilirsiniz. Filtrelerin nasıl yapılandırılacağını ve Wallarm ad alanı etiketleri ile pod açıklamalarıyla nasıl etkileşime girdiğini anlatan [makaleyi](selecting-packets.md) okuyun.

### Adım 4: Wallarm eBPF çalışmasını test edin

Wallarm eBPF’in doğru çalıştığını test etmek için:

1. Başarıyla başlatıldıklarını kontrol etmek üzere Wallarm pod ayrıntılarını alın:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    Her pod aşağıdakileri göstermelidir: **READY: N/N** ve **STATUS: Running**, örn.:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. Uygulamaya test [Path Traversal](../../../attacks-vulns-list.md#path-traversal) saldırısını, `<LOAD_BALANCER_IP_OR_HOSTNAME>` değerini trafiği ona yönlendiren yük dengeleyicinin gerçek IP adresi veya DNS adıyla değiştirerek gönderin:

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    Wallarm eBPF çözümü out-of-band yaklaşımıyla çalıştığından saldırıları engellemez, yalnızca kaydeder.

    Saldırının kaydedildiğini doğrulamak için Wallarm Console → **Events** bölümüne gidin:

    ![!Arayüzde saldırılar](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Sınırlamalar

* Trafiği gerçek akıştan bağımsız analiz eden out-of-band (OOB) çalışma nedeniyle çözümün bazı doğal sınırlamaları vardır:

    * Kötü amaçlı istekleri anında engellemez. Wallarm yalnızca saldırıları gözlemler ve size [Wallarm Console'daki ayrıntıları](../../../user-guides/events/check-attack.md) sağlar.
    * Hedef sunuculardaki yükü sınırlamak mümkün olmadığından [Hız sınırlama](../../../user-guides/rules/rate-limiting.md) desteklenmez.
    * [IP adreslerine göre filtreleme](../../../user-guides/ip-lists/overview.md) desteklenmez.
* Sunucu yanıt gövdeleri yansıtılmadığından:

    * [Pasif tespit](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) temelli zafiyet tespiti desteklenmez.
    * API Discovery’de API uç noktasının [yanıt yapısının gösterimi](../../../api-discovery/exploring.md#endpoint-details) desteklenmez.

* Çözüm beta aşamasında olduğundan, tüm Kubernetes kaynakları etkin biçimde yansıtılamayabilir. Bu nedenle trafiğin özellikle Kubernetes içindeki NGINX Ingress controller’ları, Kong Ingress controller’ları veya normal NGINX sunucuları için yansıtılmasını öneriyoruz.