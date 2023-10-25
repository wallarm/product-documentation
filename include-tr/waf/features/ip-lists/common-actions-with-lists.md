## Liste Ye Bir Nesne Ekleme

Bir IP adresi, alt ağı veya IP adresleri grubunu listeye eklemek için:

1. **Nesne ekle** düğmesini tıklayın.
2. Aşağıdaki yollardan biriyle bir IP adresi veya IP adresleri grubunu belirtin:

    * Tek bir **IP adresi** veya bir **alt ağ** girin
        
        !!! bilgi "Desteklenen alt ağ maskeleri"
            Maksimum desteklenen alt ağ maskesi IPv6 adresleri için `/32` ve IPv4 adresleri için `/12`'dir.
    
    * Tüm IP adreslerini eklemek için bir **ülke** veya **bölge** (coğrafi konum) seçin
    * Bu tipe ait tüm IP adreslerini eklemek için **kaynak tipi**ni seçin, örneğin:
        * Tor ağının IP adresleri için **Tor**
        * Kamu veya web proxy sunucularının IP adresleri için **Proxy**
        * Arama motoru örümceklerinin IP adresleri için **Arama Motoru Örümcekleri**
        * Sanal özel ağların IP adresleri için **VPN**
        * Amazon AWS'de kayıtlı IP adresleri için **AWS**
3. Bir IP adresinin veya IP adresleri grubunun listeye ekleneceği süreyi seçin. Minumum değer 5 dakikadır, maksimum değer sonsuzluktur.
4. Bir IP adresinin veya IP adresleri grubunun listeye eklenme sebebini belirtin.
5. Bir IP adresinin veya IP adresleri grubunun listeye eklenmesini onaylayın.

![Listeye IP ekleme (uygulama olmadan)](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

## Listeye Eklenen Nesnelerin Analizi

Wallarm Konsolu, listeye eklenen her nesne üzerinde aşağıdaki bilgileri görüntüler:

* **Nesne** - Listeye eklenen IP adresi, alt ağ, ülke/bölge veya IP kaynağı.
* **Uygulama** - Nesnenin erişim konfigürasyonunun uygulandığı uygulama. [Nesne erişim konfigürasyonunun belirli uygulamalara uygulanması sınırlıdır](overview.md#known-caveats-of-ip-lists-configuration) olduğu için, bu sütun her zaman **Tümü** değerini görüntüler.
* **Sebep** - Bir IP adresinin veya IP adresleri grubunun listeye eklenme nedeni. Neden, nesneler listeye eklendiğinde manuel olarak belirlenir veya IP'ler [tetikleyiciler](../triggers/triggers.md) tarafından listeye eklendiğinde otomatik olarak oluşturulur.
* **Ekleme tarihi** - Bir nesnenin listeye eklendiği tarih ve saat.
* **Kaldır** - Bir nesnenin listenin tamamından silinmesinden sonra geçecek zaman.

## Listeyi Filtreleme

Listedeki nesneleri şunlara göre filtreleyebilirsiniz:

* Arama dizesinde belirtilen IP adresi veya alt ağ
* Listeye bir durum almak istediğiniz süre
* Bir IP adresinin veya alt ağın kayıtlı olduğu ülke/bölge
* Bir IP adresinin veya bir alt ağın ait olduğu kaynak

## Bir Nesnenin Listede Olduğu Zamanı Değiştirme

Bir IP adresinin listede olduğu süreyi değiştirmek için:

1. Listeden bir nesne seçin.
2. Seçilen nesne menüsünde, **Zaman dilimini değiştir**'i tıklayın.
3. Bir nesneyi listeden kaldırmak için yeni bir tarih seçin ve işlemi onaylayın.

## Bir Nesneyi Listeden Silme

Bir nesneyi listeden silmek için:

1. Listeden bir veya birkaç nesne seçin.
2. **Sil**'i tıklayın.