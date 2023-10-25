# Wallarm düğümü ve Cloud arasında senkronizasyonun yapılandırılması

Filtreleme düğümü düzenli olarak Wallarm Cloud ile senkronize olarak:

* [Trafik işleme kuralları (LOM)](../about-wallarm/protecting-against-attacks.md#custom-rules-for-request-analysis) için güncellemeler alır
* [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) güncellemelerini alır
* Algılanan saldırılar ve zafiyetler hakkında veri gönderir
* İşlenmiş trafik için metrikler gönderir

Bu talimatlar, filtreleme düğümününde ve Wallarm Cloud'da senkronizasyonu yapılandırmak için kullanılan parametreleri ve yöntemleri anlatır.

## Erişim parametreleri

`node.yaml` dosyası, filtreleme düğümünün Cloud'ye erişimini sağlayan parametreleri içerir.

Bu dosya, `register-node` betiğini çalıştırdıktan sonra otomatik olarak oluşturulur. Filtreleme düğümü adı ve UUID, ve Wallarm API gizli anahtarını içerir. Dosyanın varsayılan yolu `/etc/wallarm/node.yaml`'dır. Bu yol, [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) yönergesi ile değiştirilebilir.

`node.yaml` dosyası, aşağıdaki erişim parametrelerini içerebilir:

| Parametre | Açıklama | Varsayılan değer |
| --------- | ----------- | ------------- |
| `hostname`       | Filtreleme düğümü adı. Bu değişkenin `node.yaml` dosyasında **ayarlanması gereklidir**. | `register-node` tarafından sağlanır |
| `regtoken`       | Düğümün Wallarm API'ye erişebilmesi için token. | `register-node` tarafından sağlanır |
| `uuid`           | Filtreleme düğümü UUID. Bu değişkenin `node.yaml` dosyasında **ayarlanması gereklidir**. | `regtoken` tarafından sağlanır |
| `secret`         | Wallarm API'ye erişim için gizli anahtar. Bu değişkenin `node.yaml` dosyasında **ayarlanması gereklidir**. | `regtoken` tarafından sağlanır |
| `api.host`       | Wallarm API end noktası. Şu şekilde olabilir:<ul><li>`us1.api.wallarm.com` için ABD Cloud</li><li>`api.wallarm.com` için AB Cloud</li></ul> | `api.wallarm.com` |
| `api.port`       | Wallarm API portu. | `443` |
| `api.use_ssl`  | Wallarm API'ye bağlanırken SSL'in kullanılıp kullanılmadığı. | `true` |
| `api.ca_verify`  | Wallarm API sunucu sertifikasının doğrulamasının etkinleştirilip etkinleştirilmeyeceği. Şu şekilde olabilir:<ul><li>`true` doğrulamayı etkinleştirir</li><li>`false` doğrulamayı devre dışı bırakır</li></ul>. | `true` |
| `api.ca_file`  | SSL sertifikası dosyasının yolu. | `/usr/share/wallarm-common/ca.pem` |
| `api.localhost` | Wallarm API'ye yapılan isteklerin gönderildiği ağ arayüzünün yerel IP adresi. Bu parametre, varsayılan olarak kullanılan ağ arayüzünün Wallarm API'ye erişimi kısıtlaması durumunda gereklidir (örneğin, İnternete erişim kapalı olabilir). | - |
| `api.localport` | Wallarm API'ye yapılan isteklerin gönderildiği ağ arayüzünün portu. Bu parametre, varsayılan olarak kullanılan ağ arayüzünün Wallarm API'ye erişimi kısıtlaması durumunda gereklidir (örneğin, İnternete erişim kapalı olabilir). | - |

Senkronizasyon parametrelerini değiştirmek için aşağıdaki adımları izleyin:

1. Gerekli parametreleri ekleyerek ve onlara istediğiniz değerleri atayarak `node.yaml` dosyasında değişiklikler yapın.
1. Güncellenmiş ayarların senkronizasyon sürecine uygulanabilmesi için NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## Senkronizasyon aralığı

Varsayılan olarak, filtreleme düğümü her 120‑240 saniyede bir (2‑4 dakika) Wallarm Cloud ile senkronize edilir. Senkronizasyon aralığını `WALLARM_SYNCNODE_INTERVAL` sistem ortam değişkeni üzerinden değiştirebilirsiniz.

Filtreleme düğümü ve Wallarm Cloud arasındaki senkronizasyon aralığını değiştirmek için:

1. `/etc/environment` dosyasını açın.
2. Dosyaya `WALLARM_SYNCNODE_INTERVAL` değişkenini ekleyin ve değişkenin değeri olarak istenen değeri saniye olarak belirleyin. Değer, varsayılan değerden (`120` saniye) düşük olamaz. Örneğin:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. Değiştirilmiş `/etc/environment` dosyasını kaydedin. Yeni aralık değeri senkronizasyon sürecine otomatik olarak uygulanacaktır.

## Yapılandırma örneği

`node.yaml` dosyasının, filtreleme düğümüne Cloud'a erişim sağlayan parametrelerin (genel ve `api` bölümleri, bu makalede anlatıldığı gibi) yanı sıra, düğümün işlemi için gerekli olan dosyalara erişimi sağlayan parametreler (`syncnode` bölümü) olabileceğini unutmayın. 

--8<-- "../include/node-cloud-sync-configuration-example.md"