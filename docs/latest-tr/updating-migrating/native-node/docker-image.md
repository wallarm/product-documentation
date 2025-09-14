[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Docker İmajı ile Wallarm Native Node'u Yükseltme

Bu talimatlar, [Docker imajından dağıtılmış Native Node'un](../../installation/native-node/docker-image.md) yükseltilmesine yönelik adımları açıklar.

[Docker imajı sürümlerini görüntüleyin](node-artifact-versions.md)

## Gereksinimler

* Anasisteminizde [Docker](https://docs.docker.com/engine/install/) yüklü
* API yönetim platformunuzdan konteynerleştirilmiş ortamınıza gelen (inbound) erişim
* Konteynerleştirilmiş ortamınızdan dışa doğru (outbound) erişim:

    * Dağıtım için gerekli Docker imajlarını indirmek üzere `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları ve [API spesifikasyonları][api-spec-enforcement-docs] güncellemelerini indirmek, ayrıca [izinli, yasaklı veya gri listeye alınmış][ip-list-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Yukarıdakilere ek olarak, Wallarm Console'da size atanmış **Administrator** rolüne sahip olmalısınız

## 1. Yeni Docker imajı sürümünü indirin

```
docker pull wallarm/node-native-aio:0.17.1
```

## 2. Çalışan konteyneri durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 3. Konteyneri yeni imajla çalıştırın

!!! info "Node sürümü 0.12.x veya daha düşükten yükseltiyorsanız"
    Node sürümü 0.12.x veya daha düşükten yükseltiyorsanız, ilk yapılandırma dosyasındaki (`wallarm-node-conf.yaml`, varsayılan kurulum talimatlarına göre) `version` değerinin güncellendiğinden ve `tarantool_exporter` bölümünün `postanalytics_exporter` olarak yeniden adlandırıldığından (açıkça belirtilmişse) emin olun:

    ```diff
    -version: 2
    +version: 4

    -tarantool_exporter:
    +postanalytics_exporter:
        address: 127.0.0.1:3313
        enabled: true
    
    ...
    ```

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | `Node deployment/Deployment` kullanım türüne sahip API token'ı. | Evet
`WALLARM_LABELS` | Node örneklerini gruplamak için `group` etiketini ayarlar, örneğin:<br>`WALLARM_LABELS="group=<GROUP>"` node örneğini `<GROUP>` örnek grubuna yerleştirir (varsa mevcut, yoksa oluşturulur). | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul>Varsayılan: `api.wallarm.com`. | Hayır

* `-p` seçeneği ana makine ve konteyner portlarını eşler:

    * İlk değer (`80`), dış trafiğe açılan ana makinenin portudur.
    * İkinci değer (`5050`), konteynerin portudur ve `wallarm-node-conf.yaml` dosyasındaki `connector.address` ayarıyla eşleşmelidir.
* Yapılandırma dosyası, konteyner içinde `/opt/wallarm/etc/wallarm/go-node.yaml` olarak bağlanmalıdır.

    Yapılandırma dosyası için, ilk kurulum sırasında kullandığınızın aynısını yeniden kullanabilirsiniz. Yalnızca gerekli ise yeni parametreler ekleyin veya mevcut olanları değiştirin - [desteklenen yapılandırma seçeneklerine](../../installation/native-node/all-in-one-conf.md) bakın.

## 4. Yükseltmeyi doğrulayın

Node'un doğru çalıştığını doğrulamak için:

1. Hatalar için logları kontrol edin:

    * Loglar varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yazılır, ek çıktı stdout'ta mevcuttur.
    * Verilerin Wallarm Cloud'a gönderilip gönderilmediği, tespit edilen saldırılar vb. gibi filtreleme node'una ait [standart loglar](../../admin-en/configure-logging.md) konteyner içinde `/opt/wallarm/var/log/wallarm` dizininde bulunur.
1. Korunan bir kaynak adresine test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://localhost/etc/passwd
    ```
    
    Trafik `example.com` adresine proxy'lenmek üzere yapılandırılmışsa, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Yükseltilen node'un, önceki sürümle karşılaştırıldığında beklendiği gibi çalıştığını doğrulayın.