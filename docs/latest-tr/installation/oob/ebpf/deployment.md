```markdown
[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm eBPF Tabanlı Çözüm (Beta Sürüm)

Wallarm, Linux çekirdeğinin gücünden yararlanan ve Kubernetes ortamlarıyla sorunsuz bir şekilde entegre olan eBPF tabanlı güvenlik çözümünün beta sürümünü sunar. Bu makale, Helm chart kullanarak çözümün nasıl kullanılacağını ve dağıtılacağını açıklar.

## Trafik akışı

Wallarm eBPF tabanlı çözüm ile trafik akışı:

![eBPF traffic flow](../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

eBPF çözümü, aşağıdaki protokolleri kullanarak trafiği izlemek üzere tasarlanmıştır:

* HTTP 1.x veya HTTP 2
* Proxy v1 veya Proxy v2

Trafik, TLS/SSL şifrelemesini veya açık metin veri aktarımını kullanabilir. SSL trafik analizi, paylaşılan OpenSSL kütüphanesini kullanan sunucular (örneğin, NGINX, HAProxy) için sınırlıdır ve Envoy gibi diğer SSL uygulamalarını kullanan sunucular için mevcut değildir.

## Nasıl Çalışır

Linux işletim sistemi, donanım kaynaklarını ve kritik görevleri yöneten çekirdek ile uygulamaların çalıştığı kullanıcı alanından oluşur. Bu ortamda, eBPF (Extended Berkeley Packet Filter) güvenliğe odaklı olanlar da dahil olmak üzere özel programların Linux çekirdeği içerisinde çalıştırılmasını sağlar. [eBPF hakkında daha fazla bilgi edinin](https://ebpf.io/what-is-ebpf/)

Kubernetes, süreç izolasyonu, kaynak yönetimi ve ağ gibi kritik görevler için Linux çekirdeğinin yeteneklerinden yararlandığından, eBPF tabanlı güvenlik çözümlerinin entegre edilmesi için elverişli bir ortam oluşturur. Buna paralel olarak, Wallarm, çekirdek işlevselliğinden faydalanarak Kubernetes ile sorunsuz entegre olan eBPF tabanlı bir güvenlik çözümü sunar.

Çözüm, Wallarm node'una trafikin aynısını oluşturan ve onu ileten bir ajan içerir. Dağıtım sırasında, ayna seviyesini namespace veya pod düzeyinde belirtebilirsiniz. Wallarm node, aynalanan trafiği güvenlik tehditleri açısından inceler; herhangi bir kötü niyetli etkinliği engellemek yerine Wallarm Cloud üzerinde kaydeder ve Wallarm Console UI aracılığıyla trafiğin güvenliğine ilişkin görünürlük sağlar.

Aşağıdaki diyagram, çözüm bileşenlerini göstermektedir:

![eBPF components](../../../images/waf-installation/epbf/ebpf-components.png)

eBPF ajanı, her Kubernetes işçi düğümünde bir DaemonSet olarak dağıtılır. Uygun işlevsellik sağlamak için, ajan konteynerinin `SYS_PTRACE` ve `SYS_ADMIN` gibi gerekli yeteneklerle birlikte ayrıcalıklı modda çalışması gerekir.

Ayrıca, çözüm, Wallarm’ın çekirdek [API Discovery](../../../api-discovery/overview.md) modülünün API uç noktalarınızı tanımlaması, API envanterinizi oluşturması ve güncel kalmasını sağlaması için yanıt kodlarını işler.

## Kullanım Senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../../supported-deployment-options.md) arasında, bu çözüm, out-of-band (OOB) operasyonu için önerilmektedir. Trafiğin içinde çalışmak yerine aynalanan bir kopyasını yakalayarak çalışan eBPF tabanlı çözüm, kesintisiz trafik akışını sağlar. Bu yaklaşım, canlı trafik üzerindeki etkiyi minimize eder ve gecikmeyi etkileyebilecek ek gecikmelerin eklenmesini önler.

## Teknik Gereksinimler

eBPF çözümünün başarılı bir dağıtımı için aşağıdaki teknik önkoşulların karşılandığından emin olun:

* Desteklenen Kubernetes sürümü:
  
    * AWS - Kubernetes 1.24 ve üstü
    * Azure - Kubernetes 1.26 ve üstü
    * GCP - herhangi bir Kubernetes sürümü
    * Bare-metal server - Kubernetes 1.22 ve üstü
* Ajanın, yakalanan trafiği güvenli bir şekilde Wallarm işleme düğümüne aynalamayı etkinleştirmesi için [cert-manager](https://cert-manager.io/docs/installation/helm/) kurulmuş olmalıdır.
* [Helm v3](https://helm.sh/) paket yöneticisi.
* BTF (BPF Type Format) etkinleştirilmiş Linux çekirdek sürümü 5.10 veya 5.15. Ubuntu, Debian, RedHat, Google COS veya Amazon Linux 2 üzerinde desteklenir.
* x86_64 mimarisine sahip işlemci.
* Çözüm beta aşamasında olduğundan, tüm Kubernetes kaynakları etkili bir şekilde aynalanamayabilir. Bu nedenle, trafik aynalamayı özellikle Kubernetes içinde NGINX Ingress kontrolcüleri, Kong Ingress kontrolcüleri veya normal NGINX sunucuları için etkinleştirmenizi öneririz.
* Kullanıcı hesabınızın Wallarm Console için [**Administrator** erişimine](../../../user-guides/settings/users.md#user-roles) sahip olması gerekir.

Eğer kullanım senaryonuz listelenen gereksinimlerden farklıysa, ortamınız hakkında detaylı teknik bilgileri de içeren bilgilerle [sales engineers](mailto:sales@wallarm.com) ekibimizle iletişime geçerek ihtiyaçlarınıza uygun olası ayarlamaları görüşebilirsiniz.

## Ağ Erişimi

Çözümün kısıtlı dışa dönük trafik ortamlarında doğru çalışmasını sağlamak için, aşağıdaki dış kaynaklara erişim izni verecek şekilde ağ erişimini yapılandırın:

* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com`
* Docker Hub üzerinden Wallarm Docker imajlarını almak için `https://hub.docker.com/r/wallarm`
* ABD Wallarm Cloud kullanıcıları için `https://us1.api.wallarm.com`. AB Wallarm Cloud kullanıcıları için `https://api.wallarm.com`.
* Saldırı tespit kurallarının ve [API spesifikasyonlarının](../../../api-specification-enforcement/overview.md) güncellemelerini indirmek, ayrıca [allowlisted, denylisted veya graylisted](../../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak amacıyla aşağıdaki IP adresleri.

    --8<-- "../include/wallarm-cloud-ips.md"

## Dağıtım

Wallarm eBPF çözümünü dağıtmak için:

1. Wallarm node'unu oluşturun.
1. Wallarm Helm chart'ını dağıtın.
1. Trafik aynalamayı etkinleştirin.
1. Wallarm eBPF çalışmasını test edin.

### Adım 1: Wallarm Node'unu Oluşturun

1. Aşağıdaki bağlantılar üzerinden Wallarm Console → **Nodes** bölümünü açın:

    * ABD Cloud için: https://us1.my.wallarm.com/nodes 
    * AB Cloud için: https://my.wallarm.com/nodes
1. **Wallarm node** tipi ile bir filtreleme düğümü oluşturun ve oluşturulan token'ı kopyalayın.
    
    ![!Creation of a Wallarm node](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Adım 2: Wallarm Helm Chart'ını Dağıtın

1. Ortamınızın yukarıdaki gereksinimleri ve [cert-manager](https://cert-manager.io/docs/installation/helm/) tarafından karşılandığından emin olun.
1. [Wallarm chart deposunu](https://charts.wallarm.com/) ekleyin:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [Wallarm eBPF çözüm konfigürasyonu](helm-chart-for-wallarm.md) ile `values.yaml` dosyasını oluşturun.

    Minimum konfigürasyon örneği:

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
    
    `<NODE_TOKEN>` Kubernetes üzerinde çalıştırılacak Wallarm node'unun token'ıdır.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarm Helm chart'ını dağıtın:

    ``` bash
    helm install --version 0.10.28 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`, Wallarm eBPF chart'ının Helm release ismi
    * `wallarm-ebpf`, Wallarm eBPF chart'ı ile Helm release'in dağıtılacağı yeni namespace'dir; ayrı bir namespace'de dağıtılması önerilir
    * `<PATH_TO_VALUES>`, `values.yaml` dosyasının yoludur

### Adım 3: Trafik Aynalamayı Etkinleştirin

Wallarm eBPF tabanlı çözümün NGINX Ingress kontrolcüsü, Kong Ingress kontrolcüsü veya normal NGINX sunucuları için etkin kullanımı adına trafik aynalamayı etkinleştirmenizi öneririz.

Varsayılan olarak, dağıtılan çözüm hiçbir trafiği analiz etmemektedir. Trafik analizini etkinleştirmek için, istenen seviyede aynalamayı etkinleştirmeniz gerekir; bu seviye:

* Bir namespace için
* Bir pod için
* Bir node adı veya bir konteyner için olabilir

Aynalamayı etkinleştirmenin iki yolu vardır: namespace etiketleri veya pod anotasyonları kullanarak dinamik filtreler ile ya da `values.yaml` dosyasında yer alan `config.agent.mirror.filters` bloğu aracılığıyla kontrol ederek. Bu yaklaşımları da birleştirebilirsiniz. [Detaylar için bakın](selecting-packets.md)

#### Bir namespace'de etiket kullanarak

Bir namespace için aynalamayı etkinleştirmek amacıyla, namespace etiketini `wallarm-mirror` değeri `enabled` olarak ayarlayın:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### Bir pod'da anotasyon kullanarak

Bir pod için aynalamayı etkinleştirmek amacıyla, `mirror.wallarm.com/enabled` anotasyonunu `true` olarak ayarlayın:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### Bir namespace, pod, konteyner veya node için `values.yaml` kullanarak

Daha ince ayar kontrolü için, Wallarm eBPF'nin `values.yaml` dosyasında yer alan `config.agent.mirror.filters` bloğunu kullanarak aynalama seviyesini belirtebilirsiniz. Filtrelerin nasıl yapılandırılacağı ve Wallarm namespace etiketleri ile pod anotasyonlarıyla nasıl etkileşime girdiği hakkında bilgi için [makaleye bakın](selecting-packets.md)

### Adım 4: Wallarm eBPF Çalışmasını Test Edin

Wallarm eBPF’nin doğru çalıştığını test etmek için:

1. Wallarm pod ayrıntılarını alarak başarılı bir şekilde başlatıldıklarını kontrol edin:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    Her pod aşağıdakileri göstermelidir: **READY: N/N** ve **STATUS: Running**, örneğin:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   4/4     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   4/4     Running   0          30m
    ```
1. Uygulamaya, `<LOAD_BALANCER_IP_OR_HOSTNAME>` yerine yük dengeleyicinin gerçek IP adresini veya DNS adını yazarak [Path Traversal](../../../attacks-vulns-list.md#path-traversal) saldırısını gönderin:

    ```bash
    curl https://<LOAD_BALANCER_IP_OR_HOSTNAME>/etc/passwd
    ```

    Wallarm eBPF çözümü out-of-band yaklaşımında çalıştığından, saldırıları engellemez; yalnızca kaydeder.

    Saldırının kaydedildiğini kontrol etmek için, Wallarm Console → **Events** bölümüne gidin:

    ![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Sınırlamalar

* Out-of-band (OOB) operasyonu nedeniyle, trafiği gerçek akıştan bağımsız olarak analiz eden çözümün bazı doğal sınırlamaları vardır:

    * Kötü niyetli istekleri anında engellemez. Wallarm yalnızca saldırıları gözlemler ve size [Wallarm Console’daki detayları](../../../user-guides/events/check-attack.md) sağlar.
    * Hedef sunucular üzerindeki yükü sınırlamak imkansız olduğundan [Rate limiting](../../../user-guides/rules/rate-limiting.md) desteklenmemektedir.
    * [IP adreslerine göre filtreleme](../../../user-guides/ip-lists/overview.md) desteklenmemektedir.
* Sunucu yanıt gövdeleri aynalanmadığından:

    * [Pasif tespit](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) tabanlı zafiyet tespiti desteklenmemektedir.
    * API uç nokta [yanıt yapısının API Discovery](../../../api-discovery/exploring.md#endpoint-details) içerisinde gösterimi desteklenmemektedir.

* Çözüm beta aşamasında olduğundan, tüm Kubernetes kaynakları etkili bir şekilde aynalanamayabilir. Bu nedenle, trafik aynalamayı özellikle Kubernetes içindeki NGINX Ingress kontrolcüleri, Kong Ingress kontrolcüleri veya normal NGINX sunucuları için etkinleştirmenizi öneririz.
```