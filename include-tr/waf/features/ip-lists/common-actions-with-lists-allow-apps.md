[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## Listeye eklenen nesnelerin analizi

Wallarm Console, listeye eklenen her nesne hakkında aşağıdaki verileri görüntüler:

* **Nesne** - Listeye eklenen IP adresi, alt ağ, ülke/bölge veya IP kaynağı.
* **Uygulama** - Nesnenin erişim yapılandırması uygulamaya uygulanan uygulama.
* **Neden** - Bir IP adresini veya bir grup IP adresini listeye ekleme nedeni. Neden, nesneleri listeye eklerken manuel olarak belirtilir veya IP'ler [tetikleyiciler](../triggers/triggers.md) ile listeye eklendiğinde otomatik olarak oluşturulur.
* **Ekleme tarihi** - Bir nesnenin listeye eklendiği tarih ve saat.
* **Kaldırma** - Bir nesnenin listeden silineceği zaman dilimi.

## IP listesi değişikliklerinin geçmişini gözden geçirme

Belirli tarihleri seçerek IP listesi içeriğini incelediğinizde, sistem, değişikliklerin ayrıntılı bir geçmişini döndürür, bu da hem manuel hem de otomatik ekleme yöntemini, tam zamanlamasını içerir. Rapor ayrıca, değişikliklerden sorumlu olan kişiler hakkında ve her dahil edilmenin ardındaki nedenler hakkında bilgiler sunar. Bu tür bilgiler, uyumluluk ve raporlama için bir denetim izi sürdürmeye yardımcı olur.

![IP Listesi geçmişi](../../images/user-guides/ip-lists/ip-list-history.png)

**Şimdi** sekmesine geri dönmek sizi IP listesinin mevcut durumuna götürür ve listeye dahil edilmiş olan nesneleri görüntülemenizi sağlar.

## Listeyi filtreleme

Listedeki nesneleri aşağıdakilerle filtreleyebilirsiniz:

* Arama dizesinde belirtilen IP adresi veya alt ağ
* Listeden bir durum almak istediğiniz dönem
* Bir IP adresinin veya bir alt ağın kayıtlı olduğu ülke/bölge
* Bir IP adresinin veya bir alt ağın ait olduğu kaynak

## Bir nesnenin listede olduğu süreyi değiştirme

Bir IP adresinin listede olduğu süreyi değiştirmek için:

1. Listeden bir nesne seçin.
2. Seçili nesne menüsünde, **Zaman dilimini değiştir**'i tıklayın.
3. Bir nesneyi listeden kaldırmak için yeni bir tarih seçin ve işlemi onaylayın.

## Bir nesneyi listeden silme

Bir nesneyi listeden silmek için:

1. Listeden bir ya da birkaç nesne seçin.
2. **Sil**'i tıklayın.

!!! Uyarı "Silinmiş IP adresini yeniden ekleme"
    [Tetikleyici](../triggers/triggers.md) ile listeye eklenen IP adresini manuel olarak sildikten sonra, tetikleyici yalnızca IP adresinin listede olduğu önceki sürenin yarısından sonra tekrar çalışır.
    
    Örneğin:

    1. 3 saatte bu IP adresinden 4 farklı saldırı vektörü alındığından IP adresi 1 saatliğine gri listeye otomatik olarak eklendi (bu [tetikleyici](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)'de yapılandırıldığı gibi).
    2. Kullanıcı, bu IP adresini Wallarm Console vasıtasıyla gri listeden sildi.
    3. Bu IP adresinden 30 dakika içinde 4 farklı saldırı vektörü gönderilirse, bu IP adresi gri listeye eklenmez.

## IP listesi nesnelerini almak, doldurmak ve silmek için API çağrıları

IP listesi nesnelerini almak, doldurmak ve silmek için, Wallarm Console UI'ı kullanmanın yanında doğrudan Wallarm API'sini [çağırabilirsiniz](../../api/overview.md). Aşağıda ilgili API çağrılarının bazı örnekleri yer almaktadır.

### API istek parametreleri

IP listelerini okumak ve değiştirmek için API isteklerine geçirilmesi gereken parametreler:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv` dosyasından girişleri listeye ekleme

`.csv` dosyasından IP'leri veya alt ağları listeye eklemek için aşağıdaki bash betiğini kullanın:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Listeye tek bir IP veya alt ağ ekleyin

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Listeye birden çok ülke ekleyin

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Listeye birden çok proxy hizmeti ekleyin

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IP listesinden bir nesneyi silme

Nesneler, IP listelerinden kimlikleriyle silinir.

Bir nesne ID'si almak için, IP listesi içeriklerini isteyin ve gerekli nesnenin bir yanıttan `objects.id`'sini kopyalayın:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Nesne ID'si elde edildikten sonra, onu listeden silmek için aşağıdaki isteği gönderin:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Bir silme isteğinde kimlikleri bir dizi olarak geçirerek birden çok nesneyi bir kerede silebilirsiniz.