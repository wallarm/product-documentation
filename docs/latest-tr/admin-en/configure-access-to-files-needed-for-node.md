# Düğüm işlemleri için gerekli dosyalara erişim haklarını yapılandırma

`wallarm-worker` ve `nginx` hizmetleri genellikle, proton.db ve özel kurallar dosyası gibi filtreleme düğümünün işlemesi için gerekli dosyaların içeriğini otomatik olarak okuma iznine sahip olur. Ancak, testler erişim olmadığını gösterirse, aşağıda izinlerin nasıl sağlandığını ve manuel olarak nasıl yapılandırılabileceğine dair açıklamayı okuyun.

## Dosya erişimini yapılandırma

Düğüm operasyonu için gereken dosyalara erişimi sağlayan parametreler, `node.yaml` dosyasında açıkça belirlenebilir. Bu dosya, `register-node` scriptinin çalıştırılmasının ardından otomatik olarak oluşturulur. Dosyanın varsayılan yolu `/etc/wallarm/node.yaml`'dir. Bu yol, [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) yönergesi ile  değiştirilebilir. 

`node.yaml` dosyası aşağıdaki dosya erişim parametrelerini içerebilir: 

| Parametre  | Açıklama |
|--------------|-------------|
| `syncnode.owner` | Filtreleme düğümü işlemesi için gereken dosyaların sahibi. |
| `syncnode.group` | Filtreleme düğümü işlemesi için gereken dosyaların grubu. |
| `syncnode.mode`  | Filtreleme düğümü işlemesi için gereken dosyalara erişim hakları. |

Algoritma, dosya izinlerini ararken aşağıdaki adımları gerçekleştirir (önceki adım sonuç vermediyse bir sonraki adıma geçer):

1. `node.yaml` dosyasında açıkça belirlenmiş `syncnode.(TYPE).(user,group,mode)` parametreleri.

    `(TYPE)`, parametrenin belirlendiği belirli bir dosyayı belirtmenize olanak sağlar. Olası değerler `proton.db` veya `lom`dur.
    
    !!! uyarı "`lom` değer anlamı"
        `lom` değerinin [özel kurallar seti](../user-guides/rules/rules.md) dosyası `/etc/wallarm/custom_ruleset`'i işaret ettiğine dikkat edin.

1. `node.yaml` dosyasında açıkça belirlenmiş `syncnode.(user,group,mode)` parametreleri.
1. NGINX tabanlı kurulumda, `/usr/share/wallarm-common/engine/*` dosyasındaki `nginx_group` değeri.

    Tüm kurulan motor paketleri, `nginx_group=<VALUE>` içeren `/usr/share/wallarm-common/engine/*` dosyasını sağlar.

    Modül ile her paket, amacına bağlı olarak NGINX için `group` parametresinin değerini belirler:

    * NGINX için nginx.org'dan modüller `group` değerini `nginx` olarak belirler.
    * NGINX dağıtımları için modüller `group` değerini `www-data` olarak belirler.
    * Özel modüller, müşteri tarafından sağlanan değerleri kullanır.
    
1. Varsayılanlar:
    * `owner`: `root`
    * `group`: `wallarm`
    * `mode`: `0640`

Algoritmanın otomatik olarak elde ettiği sonuç, ihtiyaçlarınızı karşılamıyorsa, erişim haklarına açıkça yapılandırma yapmanız gerektiğini unutmayın. Erişim haklarını yapılandırdıktan sonra, `wallarm-worker` ve `nginx` hizmetlerinin filtreleme düğümünün işlemesi için gerekli dosyaların içeriğini okuyabildiğinden emin olun.

## Yapılandırma örneği

Dosya erişim parametrelerinin yanı sıra (`syncnode` bölümü, bu makalede açıklanmıştır), `node.yaml` dosyası, filtreleme düğümüne [Buluta erişim hakları](configure-cloud-node-synchronization-en.md) sağlayacak parametreleri de içerecektir(general ve `api` bölümleri).

--8<-- "../include-tr/node-cloud-sync-configuration-example.md"