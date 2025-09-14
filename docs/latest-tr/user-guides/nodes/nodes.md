# Wallarm düğümleri

Wallarm Console UI'nin **Nodes** bölümü, kendi barındırdığınız düğüm örneklerini yönetmenize olanak tanır.

Wallarm node modülleri, kötü amaçlı trafiği azaltmak için müşterinin ortamına dağıtılmalıdır. Wallarm node, kötü amaçlı istekleri azaltıp meşru istekleri korunan kaynağa ileten bir proxy olarak çalışır.

Wallarm node UI yönetim seçenekleri:

* Yeni düğümler oluşturma
* Kurulu düğümlerin özelliklerini ve metriklerini görüntüleme
* Düğüm token'larını yeniden oluşturma
* Düğümleri yeniden adlandırma
* Düğümleri silme

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Yönetici erişimi"
    Wallarm düğümlerinin/token'larının oluşturulması, silinmesi ve yeniden oluşturulması yalnızca **Administrator** veya **Global Administrator** rolüne sahip kullanıcılar için kullanılabilir. Kurulu düğümlerin ayrıntılarını görüntüleme tüm kullanıcılar için mevcuttur.

!!! warning "Normal ve bulut düğüm türleri kaldırıldı"
    Sürüm 4.6'dan itibaren yalnızca [**Wallarm node** türü kullanılabilir](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

    **Wallarm node**, [desteklenen herhangi bir ortamda](../../installation/supported-deployment-options.md) kayıt ve yapılandırma için birleşik bir yaklaşım kullanır.

## Bir düğüm oluşturma

[uygun token](#api-and-node-tokens-for-node-creation) kullanarak bir Wallarm node oluşturmak için:

=== "API token ile"

    1. Wallarm Console → **Settings** → **API tokens**'ı [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)'da açın.
    1. Kullanım türü `Node deployment/Deployment` olan bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
    1. API token'ınızı kullanarak yeni düğümü [uygun ortama](../../installation/supported-deployment-options.md) dağıtın. Düğüm kaydedildikten sonra, Wallarm Console'un **Nodes** bölümünde otomatik olarak görünecektir.

=== "Node token ile"

    1. Wallarm Console → **Nodes**'u [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)'da açın ve **Wallarm node** türünde düğümü oluşturun.

        ![Wallarm node oluşturma](../../images/user-guides/nodes/create-cloud-node.png)
    
    1. Oluşturulan token'ı kopyalayın.
    1. Node token'ınızı kullanarak yeni düğümü [uygun ortama](../../installation/supported-deployment-options.md) dağıtın.

!!! info "Çok kiracılı (multi-tenant) seçenek"
    **multi-tenant** seçeneği, Wallarm'ı aynı anda birden fazla bağımsız şirket altyapısını veya izole ortamı korumak için kullanmanıza olanak tanır. [Daha fazla bilgi edinin](../../installation/multi-tenant/overview.md)

    === "API token ile kurulum"

        Bir düğümü kurulumdan sonra mevcut düğümün menüsünden multi-tenant moduna geçirebilirsiniz.

    === "Node token ile kurulum"
    
        Bir düğümü, oluşturma sırasında veya mevcut düğümün menüsünden multi-tenant moduna geçirebilirsiniz.

## Bir düğümün ayrıntılarını görüntüleme

Kurulu filtreleme düğümünün ayrıntıları, her filtreleme düğümünün tablosunda ve kartında görüntülenir. Kartı açmak için ilgili tablo kaydına tıklayın.

Aşağıdaki düğüm özellikleri ve metrikleri mevcuttur:

* Düğüm oluşturulurken düğüme verilen düğüm adı
* Saniye başına ortalama istek sayısı (RPS)
* Düğüm IP adresi
* Benzersiz düğüm tanımlayıcısı (UUID)
* Wallarm node token'ı (yalnızca **Administrator** veya **Global Administrator** [rolüne](../settings/users.md) sahip kullanıcılar için görünür)
* Filtreleme düğümünün Wallarm Cloud ile son eşitlenme zamanı
* Filtreleme düğümünün oluşturulma tarihi
* Düğüm tarafından cari ayda işlenen istek sayısı, ayrıca **View events from this node for the day** özelliğini kullanabilirsiniz (sizi **Attacks** bölümüne geçirir)
* Kullanılan LOM ve proton.db sürümleri
* Kurulu Wallarm paketleri ve NGINX sürümleri (varsa)

![Düğüm kartı](../../images/user-guides/nodes/view-wallarm-node.png)

Bir Wallarm node birden fazla örnek için kuruluysa (ör. başlangıç trafik işleme ve istek post-analitiği farklı sunucu örnekleri tarafından gerçekleştiriliyorsa), karşılık gelen filtreleme düğümü sayısı tabloda tek bir kayıtta gruplanır. Özellikler ve metrikler her örnek için mevcut olacaktır.

Wallarm'da, düğüm örnekleri `hostname_NodeUUID` olarak adlandırılır; burada: 

* `hostname`, düğüm örneğinin başlatıldığı çalışma makinesinin adıdır
* `NodeUUID`, benzersiz düğüm tanımlayıcısıdır (UUID)

## Düğüm token'ını yeniden oluşturma

Token'ı yeniden oluşturmak, düğüm için yeni bir token oluşturur. 

1. Wallarm Console → **Nodes**'u açın.
2. Düğüm menüsünde veya kartında **Regenerate token**'a tıklayın.
3. Düğüm zaten altyapınıza kurulmuşsa, yeni token değerini kopyalayın ve kurulu düğüm ayarları içinde belirtin.

![Düğüm token'ını yeniden oluşturma](../../images/user-guides/nodes/generate-new-token.png)

## Bir düğümü silme

Düğüm silindiğinde, uygulamanıza gelen isteklerin filtrasyonu duracaktır. Filtreleme düğümünü silme işlemi geri alınamaz. Düğüm, düğüm listesinden kalıcı olarak silinecektir.

1. Wallarm Console → **Nodes**'u açın.
1. Bir veya daha fazla düğümü seçin ve **Delete**'e tıklayın. Ayrıca düğümü düğüm menüsündeki veya düğüm kartındaki bir düğmeyi seçerek de silebilirsiniz.
1. İşlemi onaylayın.

<a id="api-and-node-tokens-for-node-creation"></a>
## Düğüm oluşturma için API ve node token'ları

Wallarm filtreleme düğümü, Wallarm Cloud ile etkileşime girer. Düğümün Wallarm Cloud API'sine erişebilmesi için Cloud tarafında bir token oluşturmanız ve düğümün bulunduğu makinede kullanmanız gerekir. Bu amaçla **API tokens** (önerilir) veya **Node tokens** kullanın:

* [`**API tokens**`](../settings/api-tokens.md) kullanım türü `Node deployment/Deployment` olduğunda:

    * UI'da düğümleri mantıksal olarak organize etmek için kullanılan düğüm grubu sayısı önceden bilinmiyorsa (düğüm grupları sürekli eklenecek/kaldırılacaksa - API tokens ile bu grupları `group` etiket değerini ayarlayan `WALLARM_LABELS` değişkeniyle kolayca yönetebilirsiniz).
    * Token'ın yaşam döngüsünü kontrol etmeniz gerekiyorsa (son kullanma tarihini belirtebilir veya API tokens'ı devre dışı bırakabilirsiniz; bu da onları daha güvenli yapar).

        !!! info "Bazı dağıtım seçenekleri API tokens'ı desteklemez"
            API tokens şu anda [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md) tabanlı AWS dağıtımları için kullanılamaz. Bunun yerine node tokens kullanın.

* Önceden hangi düğüm gruplarının bulunacağını biliyorsanız **Node tokens**. Düğüm grubunu oluşturmak ve adlandırmak için **Nodes** → **Create node**'u kullanın. Düğüm dağıtımı sırasında, gruba dahil etmek istediğiniz her düğüm için grubun token'ını kullanın.

!!! info "Otomatik ölçeklendirme desteği"
    Her iki token türü de bazı bulutlarda/kurulum varyantlarında mevcut olan düğüm otomatik ölçeklendirme özelliğini destekler.