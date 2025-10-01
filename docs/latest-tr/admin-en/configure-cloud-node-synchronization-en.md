# Wallarm düğümü ile Cloud arasındaki eşzamanlamayı yapılandırma

Filtreleme düğümü, şunlar için düzenli olarak Wallarm Cloud ile eşzamanlanır:

* [trafik işleme kuralları (LOM)](../user-guides/rules/rules.md) güncellemelerini almak
* [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) güncellemelerini almak
* Tespit edilen saldırılar ve güvenlik açıklarına ilişkin verileri göndermek
* İşlenen trafik için metrikleri göndermek

Bu talimatlar, filtreleme düğümü ile Wallarm Cloud arasındaki eşzamanlamayı yapılandırmak için kullanılan parametreleri ve yöntemleri açıklar.

## Erişim parametreleri

Filtreleme düğümünün Cloud’a erişmesini sağlayan filtreleme düğümü adı, UUID ve Wallarm API gizli anahtarı gibi parametreler `node.yaml` içinde açıkça ayarlanır. Bu dosya `register-node` betiği tarafından otomatik olarak oluşturulur.

* Docker NGINX tabanlı imaj, cloud imajları, NGINX Node all-in-one installer ve Native Node kurulumları için, dosyayı `/opt/wallarm/etc/wallarm/node.yaml` konumunda bulun, aksi belirtilmedikçe [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) direktifi ile geçersiz kılınır.
* Diğer kurulumlar için, `node.yaml` konumu değişebilir veya [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) direktifi ile geçersiz kılınabilir. Dosyayı bulmak için arama yapın veya `wallarm_api_conf` değerini kontrol edin.

`node.yaml` dosyası aşağıdaki erişim parametrelerini içerebilir:

| Parametre | Açıklama | Varsayılan değer |
| --------- | ----------- | ------------- |
| `api.regtoken`       | Düğümün Wallarm API'ye erişebilmesi için belirteç. | `register-node` tarafından sağlanır |
| `api.uuid`           | Filtreleme düğümü UUID'si. Bu değişkenin `node.yaml` dosyasında **ayarlanması zorunludur**. | `regtoken` tarafından sağlanır |
| `api.secret`         | Wallarm API'ye erişmek için gizli anahtar. Bu değişkenin `node.yaml` dosyasında **ayarlanması zorunludur**. | `regtoken` tarafından sağlanır |
| `api.host`       | Wallarm API uç noktası. Şunlar olabilir:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul> | `api.wallarm.com` |
| `api.port`       | Wallarm API portu. | `443` |
| `api.use_ssl`  | Wallarm API'ye bağlanırken SSL kullanılıp kullanılmayacağı. | `true` |
| `api.ca_verify`  | Wallarm API sunucusu sertifika doğrulamasını etkinleştirip/devre dışı bırakma. Şunlar olabilir:<ul><li>Doğrulamayı etkinleştirmek için `true`</li><li>Doğrulamayı devre dışı bırakmak için `false`</li></ul>. | `true` |

Eşzamanlama parametrelerini değiştirmek için şu adımları izleyin:

1. Gerekli parametreleri ekleyip onlara istenen değerleri atayarak `node.yaml` dosyasında değişiklik yapın.
1. Güncellenen ayarları eşzamanlama sürecine uygulamak için NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## Eşzamanlama aralığı

Varsayılan olarak, filtreleme düğümü Wallarm Cloud ile her 120‑240 saniyede (2‑4 dakika) bir eşzamanlanır. Eşzamanlama aralığını `WALLARM_SYNCNODE_INTERVAL` sistem ortam değişkeni ile değiştirebilirsiniz.

Filtreleme düğümü ile Wallarm Cloud eşzamanlamaları arasındaki aralığı değiştirmek için:

1. `/etc/environment` dosyasını açın.
2. `WALLARM_SYNCNODE_INTERVAL` değişkenini dosyaya ekleyin ve değişkene saniye cinsinden istenen değeri atayın. Değer, varsayılan değerden (`120` saniye) küçük olamaz. Örneğin:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. Değiştirilen `/etc/environment` dosyasını kaydedin. Yeni aralık değeri eşzamanlama işlemine otomatik olarak uygulanacaktır.

## Yapılandırma örneği

--8<-- "../include/node-cloud-sync-configuration-example-5.x.md"