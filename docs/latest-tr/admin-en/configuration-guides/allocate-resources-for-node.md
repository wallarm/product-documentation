# Wallarm NGINX Node için Kaynak Ayırma

Wallarm NGINX düğümü için ayrılan bellek ve CPU kaynak miktarı, isteklerin işlenme kalitesini ve hızını belirler. Bu talimatlar, kendi kendine barındırılan NGINX düğümü için bellek tahsisi ile ilgili önerileri açıklamaktadır.

Bir filtreleme düğümünde iki ana bellek ve CPU tüketicisi bulunmaktadır:

* [Tarantool](#tarantool), **postanalytics module** olarak da adlandırılır. Bu, yerel veri analiz arka planı ve bir filtreleme düğümündeki birincil bellek tüketicisidir.
* [NGINX](#nginx) asıl filtreleme düğümü ve ters proxy bileşenidir.

NGINX CPU kullanımı, RPS seviyesi, istek ve yanıt ortalama boyutu, düğüm tarafından işlenen özel kurallar seti sayısı, Base64 gibi veri kodlamalarının veya veri sıkıştırmanın kullanılan tipleri ve katmanları gibi birçok faktöre bağlıdır.

Ortalama olarak, bir CPU çekirdeği yaklaşık 500 RPS işleyebilir. Üretim modunda çalışırken, NGINX işlemi için en az bir CPU çekirdeği ve Tarantool işlemi için bir çekirdek tahsis edilmesi önerilir. Çoğu durumda, başlangıçta bir filtreleme düğümünün kaynaklarının aşırı tahsis edilmesi, gerçek üretim trafiği seviyeleri için gerçek CPU ve bellek kullanımının izlenmesi ve tahsis edilen kaynakların kademeli olarak makul bir seviyeye (trafik zirveleri ve düğüm yedekliliği için en az 2 kat boşluklu) düşürülmesi önerilir.

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Kubernetes Ingress Controller’da Kaynak Tahsisi

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### All-in-One Installer Kullanılıyorsa Kaynak Tahsisi

Tarantool belleğinin boyutlandırılması, `/opt/wallarm/env.list` yapılandırma dosyasındaki `SLAB_ALLOC_ARENA` özniteliği kullanılarak kontrol edilir. Bellek tahsis etmek için:

1. `/opt/wallarm/env.list` dosyasını düzenleme modunda açın:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. `SLAB_ALLOC_ARENA` özniteliğini bellek boyutuna ayarlayın. Değer bir tam sayı veya ondalık sayı (ondalık ayırıcı olarak nokta `.` kullanılır) olabilir. Örneğin:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. Wallarm servislerini yeniden başlatın:

    ```
    sudo systemctl restart wallarm.service
    ```

### Diğer Dağıtım Seçeneklerinde Kaynak Tahsisi

Tarantool belleğinin boyutlandırılması, `/etc/default/wallarm-tarantool` yapılandırma dosyasındaki `SLAB_ALLOC_ARENA` özniteliği kullanılarak kontrol edilir. Bellek tahsis etmek için:

<ol start="1"><li>Tarantool yapılandırma dosyasını düzenleme modunda açın:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li><code>SLAB_ALLOC_ARENA</code> özniteliğini bellek boyutuna ayarlayın. Değer bir tam sayı veya ondalık sayı (ondalık ayırıcı olarak <code>.</code> kullanılır) olabilir. Örneğin:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>Tarantool’u yeniden başlatın:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

Mevcut filtreleme düğümü yükü seviyesiyle, bir Tarantool örneğinin trafik detaylarını saklayabileceği süreyi öğrenmek için, [`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds) izleme metriğini kullanabilirsiniz.

## NGINX

NGINX’in bellek tüketimi birçok faktöre bağlıdır. Ortalama olarak, aşağıdaki gibi tahmin edilebilir:

```
Eşzamanlı istek sayısı * Ortalama istek boyutu * 3
```

Örneğin:

* Filtreleme düğümü, zirvede 10000 eşzamanlı isteği işlemektedir,
* ortalama istek boyutu 5 kB’dır.

NGINX bellek tüketimi şu şekilde tahmin edilebilir:

```
10000 * 5 kB * 3 = 150000 kB (veya ~150 MB)
```

**Bellek miktarını tahsis etmek için:**

* NGINX Ingress controller pod’u (`ingress-controller`) için, `values.yaml` dosyasında aşağıdaki bölümleri `helm install` veya `helm upgrade` komutlarının `--set` seçeneği ile yapılandırın:
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

    === "Ingress controller kurulumu"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Doğru Ingress controller kurulumu için [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) de gereklidir. Lütfen bunları da `--set` seçeneğine ekleyin.
    === "Ingress controller parametrelerini güncelleme"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* Diğer dağıtım seçenekleri için, NGINX yapılandırma dosyalarını kullanın.

## Sorun Giderme

Bir Wallarm düğümü beklenenden daha fazla bellek ve CPU tüketiyorsa, kaynak kullanımını azaltmak için [CPU yüksek kullanım sorun giderme](../../faq/cpu.md) makalesindeki önerileri inceleyin ve uygulayın.