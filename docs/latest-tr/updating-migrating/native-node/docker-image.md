[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Wallarm Native Node'un Docker İmajı ile Güncellenmesi

Bu talimatlar, [Docker imajından dağıtılan Native Node](../../installation/native-node/docker-image.md)'un nasıl güncelleneceğini açıklamaktadır.

[Docker imajı sürümlerini görüntüle](node-artifact-versions.md)

## Gereksinimler

* Ana işletim sisteminizde yüklü [Docker](https://docs.docker.com/engine/install/)
* API yönetim platformunuzdan konteynerleştirilmiş ortama gelen erişim
* Konteynerleştirilmiş ortamınızdan aşağıdakilere giden çıkış erişimi:

    * Dağıtım için gerekli Docker imajlarını indirmek üzere `https://hub.docker.com/r/wallarm`
    * US/EU Wallarm Cloud için `https://us1.api.wallarm.com` veya `https://api.wallarm.com`
    * Saldırı tespit kuralları güncellemelerini ve [API specification][api-spec-enforcement-docs] indirmeyi, ayrıca [izin verilen, engellenen veya gri listeye alınmış][ip-list-docs] ülkeler, bölgeler ya da veri merkezleri için kesin IP'leri almak üzere aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"
* Yukarıdakilere ek olarak, Wallarm Console'da **Administrator** rolüne sahip olmalısınız

## 1. Yeni Docker imajı sürümünü indirin

```
docker pull wallarm/node-native-aio:0.11.0
```

## 2. Çalışan konteyneri durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 3. Yeni imajı kullanarak konteyneri çalıştırın

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```

Ortam değişkeni | Açıklama | Gereklilik
--- | ---- | ----
`WALLARM_API_TOKEN` | `Deploy` rolüne sahip API token'ı. | Evet
`WALLARM_LABELS` | Node örneği gruplaması için `group` etiketini ayarlar, örneğin:<br>`WALLARM_LABELS="group=<GROUP>"` komutu node örneğini `<GROUP>` adlı var olan ya da mevcut değilse oluşturulacak grup içine yerleştirir. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul>Varsayılan: `api.wallarm.com`. | Hayır

* `-p` seçeneği, ana makine ve konteyner portlarını eşler:

    * İlk değer (`80`), harici trafiğe açık ana makine portudur.
    * İkinci değer (`5050`), konteyner portudur ve `wallarm-node-conf.yaml` dosyasındaki `connector.address` ayarıyla uyuşmalıdır.
* Yapılandırma dosyası, konteyner içinde `/opt/wallarm/etc/wallarm/go-node.yaml` olarak bağlanmalıdır.

    Yapılandırma dosyası için, ilk kurulumda kullanılan dosyayı yeniden kullanabilirsiniz. Yalnızca gerekli ise yeni parametreler ekleyin veya mevcut olanları değiştirin - bkz. [desteklenen yapılandırma seçenekleri](../../installation/native-node/all-in-one-conf.md).

## 4. Güncellemeyi Doğrulayın

Node'un doğru çalıştığını doğrulamak için:

1. Hata olup olmadığını kontrol etmek amacıyla logları inceleyin:

    * Loglar varsayılan olarak `/opt/wallarm/var/log/wallarm/go-node.log` yoluna yazılır, ek çıktılar stdout üzerinden de temin edilmektedir.
    * Wallarm Cloud'a veri gönderilip gönderilmediği, saldırıların tespit edilip edilmediği gibi filtreleme node'unun [Standart logları](../../admin-en/configure-logging.md), konteynerin içindeki `/opt/wallarm/var/log/wallarm` dizininde yer alır.
1. Korunan bir kaynak adresine test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://localhost/etc/passwd
    ```
    
    Trafik `example.com` adresine proxy olarak yönlendirildiyse, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Güncellenen node'un, önceki sürüme kıyasla beklenildiği gibi çalıştığını doğrulayın.