# Wallarm NGINX node için Kaynak Ayırma

Wallarm NGINX node için ayrılan bellek ve CPU kaynaklarının miktarı istek işleme kalitesini ve hızını belirler. Bu talimatlar, self-hosted NGINX node bellek tahsisine yönelik önerileri açıklar.

Bir NGINX filtreleme düğümünde bellek ve CPU kaynaklarını tüketen iki ana bileşen vardır:

* [wstore](#wstore), **post-analiz modülü** olarak da adlandırılır. Bu, yerel veri analitiği arka ucu olup filtreleme düğümündeki birincil bellek tüketicisidir.
* [NGINX](#nginx) ana filtreleme düğümü ve ters proxy bileşenidir.

NGINX CPU kullanımı; RPS düzeyi, istek ve yanıtın ortalama boyutu, düğümün işlediği özel kurallar kümesindeki kural sayısı, Base64 veya veri sıkıştırma gibi kullanılan veri kodlamalarının türleri ve katmanları vb. birçok faktöre bağlıdır.

Ortalama olarak bir CPU çekirdeği yaklaşık 500 RPS işleyebilir. Production modda çalışırken NGINX süreci için en az 1 CPU çekirdeği ve wstore süreci için 1 çekirdek ayırmanız önerilir. Çoğu durumda, önce filtreleme düğümünü fazla tahsis etmek, gerçek production trafik seviyeleri için fiili CPU ve bellek kullanımını gözlemlemek ve ayrılan kaynakları kademeli olarak makul bir seviyeye düşürmek (trafik sıçramaları ve düğüm yedekliliği için en az 2x marjla) önerilir.

## wstore

--8<-- "../include/allocate-resources-for-waf-node/wstore-memory.md"

### Kubernetes Ingress denetleyicisinde Kaynak Ayırma

--8<-- "../include/allocate-resources-for-waf-node/wstore-memory-ingress-controller.md"

### All-in-One Installer kullanılıyorsa Kaynak Ayırma

wstore belleğinin boyutlandırılması, `/opt/wallarm/env.list` yapılandırma dosyasındaki `SLAB_ALLOC_ARENA` özniteliği kullanılarak kontrol edilir. Bellek ayırmak için:

1. `/opt/wallarm/env.list` dosyasını düzenlemek üzere açın:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. `SLAB_ALLOC_ARENA` özniteliğini bellek boyutuna ayarlayın. Değer tam sayı veya kayan nokta olabilir (ondalık ayırıcı nokta `.` olmalıdır). Örneğin:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. Wallarm servislerini yeniden başlatın:

    ```
    sudo systemctl restart wallarm.service
    ```

### Amazon Machine Image kullanılıyorsa Kaynak Ayırma

* Wallarm node, ayrılan kaynakları wstore ve NGINX arasında otomatik olarak dağıtır.
* [Wallarm NGINX Node AMI](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) üzerinden bir Wallarm node örneği başlatırken, test için `t3.medium` ve production için `m4.xlarge` örnek tiplerini kullanmanızı öneririz.

## NGINX

NGINX bellek tüketimi birçok faktöre bağlıdır. Ortalama olarak aşağıdaki şekilde tahmin edilebilir:

```
Eşzamanlı istek sayısı * Ortalama istek boyutu * 3
```

Örneğin:

* Filtreleme düğümü, zirvede 10000 eşzamanlı isteği işliyor,
* ortalama istek boyutu 5 kB.

NGINX bellek tüketimi aşağıdaki gibi tahmin edilebilir:

```
10000 * 5 kB * 3 = 150000 kB (veya ~150 MB)
```

**Bellek miktarını ayarlamak için:**

* NGINX Ingress denetleyici pod'u (`ingress-controller`) için, `helm install` veya `helm upgrade` komutlarının `--set` seçeneğini kullanarak `values.yaml` dosyasındaki aşağıdaki bölümleri yapılandırın:
    ```
    controller:
      resources:
        limits:
          cpu: 400m
          memory: 3280Mi
        requests:
          cpu: 200m
          memory: 1640Mi
    ```

    Parametreleri değiştiren komut örnekleri:

    === "Ingress denetleyicisinin kurulumu"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Doğru Ingress denetleyicisi kurulumu için [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) de gereklidir. Lütfen bunları da `--set` seçeneğinde iletin.
    === "Ingress denetleyicisi parametrelerini güncelleme"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* diğer dağıtım seçenekleri için NGINX yapılandırma dosyalarını kullanın.

## Sorun Giderme

Bir Wallarm node beklenenden daha fazla bellek ve CPU tüketiyorsa, kaynak kullanımını azaltmak için [CPU yüksek kullanım sorun giderme](../../troubleshooting/performance.md#wallarm-node-consumes-too-much-cpu) makalesindeki önerileri inceleyip uygulayın.