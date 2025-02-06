# Wallarm düğümü ile Cloud arasındaki senkronizasyonun yapılandırılması

Filtreleme düğümü, Wallarm Cloud ile düzenli olarak senkronize olarak:

* [traffic processing rules (LOM)](../user-guides/rules/rules.md) güncellemelerini almak,
* [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) güncellemelerini almak,
* Algılanan saldırılar ve açıklarla ilgili verileri göndermek,
* İşlenen trafik için metrikleri göndermek

amacına hizmet eder.

Bu talimatlar, filtreleme düğümü ile Wallarm Cloud arasındaki senkronizasyonu yapılandırmak için kullanılan parametreleri ve yöntemleri açıklar.

## Erişim Parametreleri

Filtreleme düğümünün adı, UUID'si ve Wallarm API gizli anahtarı gibi, Cloud'a erişimi sağlayan parametreler, `node.yaml` dosyasında açıkça belirlenmiştir. Bu dosya, `register-node` betiği tarafından otomatik olarak oluşturulur.

* Docker NGINX-temelli imaj, cloud imajları, NGINX Node all-in-one yükleyici ve Native Node kurulumları için, dosya [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) yönergesi ile geçersiz kılınmadıkça `/opt/wallarm/etc/wallarm/node.yaml` yolunda bulunur.
* Diğer kurulumlar için, `node.yaml` konumu farklılık gösterebilir veya [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) yönergesi ile geçersiz kılınabilir. Dosyayı bulmak için arama yapın veya `wallarm_api_conf` değerini kontrol edin.

`node.yaml` dosyası aşağıdaki erişim parametrelerini içerebilir:

| Parametre          | Açıklama                                                                                                                              | Varsayılan Değer                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `hostname`         | Filtreleme düğümünün adı. Bu değişkenin `node.yaml` dosyasında **zorunlu** olarak belirlenmesi gerekmektedir.                         | `register-node` tarafından sağlanır |
| `api.regtoken`     | Düğümün Wallarm API’ye erişebilmesi için gerekli token.                                                                              | `register-node` tarafından sağlanır |
| `api.uuid`         | Filtreleme düğümünün UUID'si. Bu değişkenin `node.yaml` dosyasında **zorunlu** olarak belirlenmesi gerekmektedir.                        | `regtoken` tarafından sağlanır  |
| `api.secret`       | Wallarm API’ye erişim için gizli anahtar. Bu değişkenin `node.yaml` dosyasında **zorunlu** olarak belirlenmesi gerekmektedir.             | `regtoken` tarafından sağlanır  |
| `api.host`         | Wallarm API uç noktası. Aşağıdakilerden biri olabilir:<ul><li>ABD Cloud için: `us1.api.wallarm.com`</li><li>AB Cloud için: `api.wallarm.com`</li></ul> | `api.wallarm.com`               |
| `api.port`         | Wallarm API portu.                                                                                                                     | `443`                           |
| `api.use_ssl`      | Wallarm API’ye bağlanırken SSL kullanılıp kullanılmayacağını belirtir.                                                                  | `true`                          |
| `api.ca_verify`    | Wallarm API sunucu sertifika doğrulamasının etkinleştirilip devre dışı bırakılacağını belirtir. Şu seçeneklerden biri olabilir:<ul><li>Doğrulama için `true`</li><li>Doğrulamayı devre dışı bırakmak için `false`</li></ul> | `true`                          |

Senkronizasyon parametrelerini değiştirmek için aşağıdaki adımları izleyin:

1. Gerekli parametreleri ekleyip istenen değerleri atayarak `node.yaml` dosyasında değişiklik yapın.
2. Güncellenen ayarların senkronizasyon sürecine uygulanabilmesi için NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## Senkronizasyon Aralığı

Varsayılan olarak, filtreleme düğümü Wallarm Cloud ile her 120‑240 saniyede (2‑4 dakikada) bir senkronize olur. Filtreleme düğümü ile Wallarm Cloud arasındaki senkronizasyon aralığını, sistem ortam değişkeni `WALLARM_SYNCNODE_INTERVAL` aracılığıyla değiştirebilirsiniz.

Filtreleme düğümü ile Wallarm Cloud senkronizasyon aralığını değiştirmek için:

1. `/etc/environment` dosyasını açın.
2. Dosyaya `WALLARM_SYNCNODE_INTERVAL` değişkenini ekleyin ve değeri saniye cinsinden istenen değere ayarlayın. Değer, varsayılan değer olan (`120` saniye) değerden düşük olmamalıdır. Örneğin:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. `/etc/environment` dosyasında yapılan değişiklikleri kaydedin. Yeni aralık değeri senkronizasyon sürecine otomatik olarak uygulanacaktır.

## Yapılandırma Örneği

--8<-- "../include/node-cloud-sync-configuration-example-5.x.md"