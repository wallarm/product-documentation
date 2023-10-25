# Wallarm Node İçin Kaynak Ayırma

Filtreleme düğümü için ayrılan bellek ve CPU kaynaklarının miktarı, istek işlemenin kalitesini ve hızını belirler. Bu talimatlar, filtreleme düğümü bellek tahsisi için önerileri açıklar.

Bir filtreleme düğümünde iki ana bellek ve CPU tüketeni bulunmaktadır:

* [Tarantool](#tarantool), aynı zamanda **postanalytics modülü** olarak da adlandırılır. Bu, yerel veri analitik arka ucu ve bir filtreleme düğümünde ana bellek tüketeni.
* [NGINX](#nginx), ana filtreleme düğümü ve ters proxy bileşenidir. 

NGINX CPU kullanımı, RPS seviyesi, ortalama istek ve yanıt büyüklüğü, düğüm tarafından ele alınan özel kural seti kurallarının sayısı, Base64 gibi kullanılan veri kodlamalarının türleri ve katmanları veya veri sıkıştırması gibi birçok faktöre bağlıdır.

Ortalama olarak, bir CPU çekirdeği yaklaşık 500 RPS'yi işleyebilir. Üretim modunda çalışırken, NGINX süreci için en az bir CPU çekirdeği ve Tarantool süreci için bir çekirdek ayırmanız önerilir. Çoğu durumda, filtreleme düğümüne ilk başta aşırı tahsis etmek, gerçek üretim trafiği seviyeleri için CPU ve bellek kullanımını görmek ve tahsis edilen kaynakları makul bir seviyeye (en az 2x trafik dalgalanmaları ve düğüm yedekliliği için yer) azaltmak önerilir.

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Kubernetes Ingress Controller'da Kaynak Ayırma

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### Diğer Dağıtım Seçeneklerinde Kaynak Ayırma

Tarantool bellek boyutlandırması, `/etc/default/wallarm-tarantool` konfigürasyon dosyasındaki `SLAB_ALLOC_ARENA` özelliği kullanılarak kontrol edilir. Bellek ayırmak için:

<ol start="1"><li>Tarantool'un konfigürasyon dosyasını düzenlemek için açın:</li></ol>

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
=== "Amazon Linux 2.0.2021x ve altı"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li><code>SLAB_ALLOC_ARENA</code> özniteliğini bellek büyüklüğüne ayarlayın. Değer, bir tam sayı veya bir float (nokta <code>.</code> bir ondalık ayırıcıdır) olabilir. Örneğin:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>Tarantool'u yeniden başlatın:</li></ol>

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
=== "Amazon Linux 2.0.2021x ve altı"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

Mevcut filtreleme düğümü yük düzeyiyle bir Tarantool örneğinin trafiği ayrıntılarıyla ne kadar süre saklayabileceğini öğrenmek için, [`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds) izleme metriğini kullanabilirsiniz.


## NGINX

NGINX bellek tüketimi birçok faktöre bağlıdır. Ortalama olarak aşağıdaki gibi tahmin edilebilir:

```
Eşzamanlı istek sayısı * Ortalama istek boyutu * 3
```

Örneğin:

* Filtreleme düğümü, zirvede 10.000 eşzamanlı isteği işliyor,
* ortalama istek boyutu 5 kB.

NGINX bellek tüketimi aşağıdaki gibi tahmin edilebilir:

```
10000 * 5 kB * 3 = 150000 kB (veya ~150 MB)
```

**Bellek miktarını ayırmak için:**

* NGINX Ingress controller podu (`ingress-controller`) için, `helm install` veya `helm upgrade` komutlarının `--set` seçeneği kullanılarak `values.yaml` dosyasındaki aşağıdaki bölümleri yapılandırın:
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

    Parametreleri değiştiren komutların örneği:

    === "Ingress controller kurulumu"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Doğru Ingress controller kurulumu için [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) de gereklidir. Lütfen onları da `--set` seçeneğinde geçirin.
    === "Ingress controller parametrelerini güncelleme"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* diğer dağıtım seçenekleri için, NGINX yapılandırma dosyalarını kullanın.

## Sorun Giderme

Eğer bir Wallarm düğümü, beklenenden daha fazla bellek ve CPU tüketiyorsa, kaynak kullanımını azaltmak için [CPU yüksek kullanım sorun giderme](../../faq/cpu.md) makalesinden önerileri inceleyin ve bunları uygulayın.