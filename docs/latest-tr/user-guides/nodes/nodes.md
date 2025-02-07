# Wallarm nodes

Wallarm Console kullanıcı arayüzündeki **Nodes** bölümü, kendi kendine barındırılan node örneklerini yönetmenizi sağlar.

Wallarm node modülleri, Wallarm'ın kötü niyetli trafiği engellemesi için müşterinin ortamına dağıtılmalıdır. Wallarm node, kötü niyetli istekleri engelleyerek ve meşru istekleri korunan kaynağa ileterek bir proxy olarak çalışır.

Wallarm node UI yönetim seçenekleri:

* Yeni node oluşturma
* Yüklenmiş node'ların özelliklerini ve metriklerini görüntüleme
* Node tokenlarını yeniden oluşturma
* Node'ları yeniden adlandırma
* Node'ları silme

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Yönetici erişimi"
    Wallarm node/token oluşturma, silme ve yeniden oluşturma işlemleri yalnızca **Administrator** veya **Global Administrator** rolüne sahip kullanıcılara açıktır. Yüklenmiş node'ların detaylarını görüntüleme tüm kullanıcılar tarafından yapılabilir.

!!! warning "Normal ve cloud türündeki node'lar kaldırıldı"
    4.6 sürümünden itibaren, yalnızca [**Wallarm node** türü mevcuttur](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

    **Wallarm node**, [desteklenen herhangi bir ortamda](../../installation/supported-deployment-options.md) kayıt ve yapılandırma işlemini tekilleştirilmiş bir yaklaşımla kullanır.

## Node Oluşturma

[Uygun token](#api-and-node-tokens-for-node-creation) kullanılarak bir Wallarm node oluşturmak için:

=== "API token ile"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden açın.
    1. `Deploy` kaynak rolüne sahip bir API token’ı bulun veya oluşturun.
    1. Bu token’ı kopyalayın.
    1. API token’ınızı kullanarak yeni node’u [uygun ortama](../../installation/supported-deployment-options.md) dağıtın. Node kaydedildikten sonra, Wallarm Console’daki **Nodes** bölümünde otomatik olarak görünecektir.

=== "Node token ile"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden açın ve **Wallarm node** türünde node oluşturun.

        ![Wallarm node creation](../../images/user-guides/nodes/create-cloud-node.png)
    
    1. Oluşturulan token’ı kopyalayın.
    1. Node token’ınızı kullanarak yeni node’u [uygun ortama](../../installation/supported-deployment-options.md) dağıtın.

!!! info "Multi-tenant seçeneği"
    **Multi-tenant** seçeneği, Wallarm’ın aynı anda birkaç bağımsız şirket altyapısı veya izole ortamı korumasına olanak tanır. [Daha fazla bilgi edinin](../../installation/multi-tenant/overview.md)

    === "API token kurulumu"

        Mevcut node menüsünden node kurulumundan sonra node’u multi-tenant moda geçirebilirsiniz.

    === "Node token kurulumu"
    
        Bir node’u multi-tenant moda, oluşturma sırasında veya mevcut node menüsünden geçirebilirsiniz.

## Bir Node’un Detaylarını Görüntüleme

Yüklenmiş filtreleme node’unun detayları, her filtreleme node’unun tablosunda ve kartında görüntülenir. Kartı açmak için ilgili tablo kaydına tıklayın.

Aşağıdaki node özellikleri ve metrikleri mevcuttur:

* Node oluşturulurken verilen node adı
* Saniyedeki ortalama istek sayısı (RPS)
* Node IP adresi
* Benzersiz node kimliği (UUID)
* Wallarm node token’ı (**Administrator** veya **Global Administrator** [rolüne](../settings/users.md) sahip kullanıcılara görüntülenir)
* Filtreleme node ile Wallarm Cloud arasındaki son senkronizasyon zamanı
* Filtreleme node oluşturulma tarihi
* Mevcut ay içerisinde node tarafından işlenen istek sayısı; ayrıca **Bugünkü bu node’dan gelen olayları görüntüle** seçeneği ile (bu, **Attacks** bölümüne geçiş yapar)
* Kullanılan LOM ve proton.db versiyonları
* Yüklenmiş Wallarm paketleri, NGINX ve Envoy versiyonları (varsa)

![Node card](../../images/user-guides/nodes/view-wallarm-node.png)

Eğer bir Wallarm node, birden fazla örnek için kurulmuşsa (örneğin, ilk trafik işleme ve farklı sunucu örnekleri tarafından gerçekleştirilen istek sonrası analitik için), ilgili filtreleme node’larına ait kayıt tablodaki tek bir kayıt altında gruplanır. Özellikler ve metrikler her bir örnek için ayrı ayrı gösterilir.

Wallarm'da, node örnekleri, `hostname_NodeUUID` formatında adlandırılır, burada:

* `hostname`, node örneğinin çalıştırıldığı makinenin adıdır
* `NodeUUID`, benzersiz node kimliğidir (UUID)

Node kurulumu sırasında `-n` parametresini kullanarak `hostname` değerini manuel olarak ayarlayabilirsiniz.

## Node Token’ını Yeniden Oluşturma

Token yeniden oluşturma, node için yeni bir token üretir.

1. Wallarm Console → **Nodes** bölümünü açın.
2. Node menüsünde veya kartında **Regenerate token** seçeneğine tıklayın.
3. Node altyapınızda zaten kurulu ise, yeni token değerini kopyalayın ve kurulu node ayarları içerisinde belirtin.

![Regenerating node token](../../images/user-guides/nodes/generate-new-token.png)

## Node Silme

Node silindiğinde, uygulamanıza gelen isteklerin filtrelenmesi duracaktır. Filtreleme node’unun silinmesi geri alınamaz. Node, node listesinden kalıcı olarak silinir.

1. Wallarm Console → **Nodes** bölümünü açın.
2. Bir veya daha fazla node seçin ve **Delete** seçeneğine tıklayın. Ayrıca, node menüsündeki veya node kartındaki düğme aracılığıyla da filtreleme node’u silebilirsiniz.
3. İşlemi onaylayın.

## API ve Node Token’ları ile Node Oluşturma

Wallarm filtreleme node’u, Wallarm Cloud ile etkileşime girer. Node’a Wallarm Cloud API erişimi sağlamak için, Cloud tarafında bir token oluşturmanız ve bu token’ı node’un bulunduğu makinede kullanmanız gerekir. Bu amaçla **API tokens** (tavsiye edilir) veya **node tokens** kullanın:

* [**API tokens**](../settings/api-tokens.md) `Deploy` rolü ile aşağıdaki durumlarda:

    * UI'da node'ları mantıksal olarak organize etmek için kullanılacak node gruplarının sayısı önceden bilinmediğinde (node grupları sürekli eklenip/çıkarılacaktır - API tokens ile `WALLARM_LABELS` değişkeni kullanılarak `group` etiket değeri kolayca yönetilebilir).
    * Token’ın yaşam döngüsünü kontrol etmeniz gerektiğinde (son kullanma tarihi belirleyebilir veya API token’larını devre dışı bırakabilirsiniz, böylece daha güvenli hale gelir).

        !!! info "API token'lar bazı dağıtım seçenekleri tarafından desteklenmemektedir"
            API token’lar şu anda [Kong Ingress controllers](../../installation/kubernetes/kong-ingress-controller/deployment.md) ve [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md) tabanlı AWS dağıtımları için kullanılamamaktadır. Bunun yerine node token kullanın.

* Node token’ları, hangi node gruplarının sunulacağını önceden bildiğinizde kullanın. **Nodes** → **Create node** seçeneğini kullanarak node grubunu oluşturup adlandırın. Node dağıtımı sırasında, gruba dahil etmek istediğiniz her node için grubun token’ını kullanın.

!!! info "Autoscaling desteği"
    Her iki token türü de bazı cloud/distribüsyon varyantlarında mevcut olan node autoscaling özelliğini destekler.