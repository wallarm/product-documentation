## Listeye bir nesne ekleme

Listeye bir IP adresi, alt ağ veya IP adresleri grubu eklemek için:

1. **Add object** düğmesine tıklayın.
2. Bir IP adresini veya IP adresleri grubunu aşağıdaki yollardan biriyle belirtin:

    * Tek bir **IP adresi** veya bir **alt ağ** girin
        
        !!! info "Desteklenen alt ağ maskeleri"
            Desteklenen en büyük alt ağ maskesi IPv6 adresleri için `/32`, IPv4 adresleri için `/12`'dir.
    
    * Bu ülke/bölgede kayıtlı tüm IP adreslerini eklemek için bir **ülke** veya **bölge**yi (coğrafi konum) seçin
    * Bu türe ait tüm IP adreslerini eklemek için **kaynak türünü** seçin, örneğin:
        * **Tor**: Tor ağının IP adresleri için
        * **Proxy**: genel veya web proxy sunucularının IP adresleri için
        * **Search Engine Spiders**: arama motoru botlarının IP adresleri için
        * **VPN**: sanal özel ağların IP adresleri için
        * **AWS**: Amazon AWS’de kayıtlı IP adresleri için
3. IP adresinin veya IP adresleri grubunun listeye ekleneceği süreyi seçin. Minimum değer 5 dakikadır, maksimum değer süresizdir.
4. Bir IP adresini veya IP adresleri grubunu listeye ekleme nedenini belirtin.
5. Bir IP adresini veya IP adresleri grubunu listeye eklemeyi onaylayın.

![Listeye IP ekleme (uygulama olmadan)](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

## Listeye eklenen nesneleri analiz etme

Wallarm Console, listeye eklenen her nesne için aşağıdaki verileri gösterir:

* **Object** - listeye eklenen IP adresi, alt ağ, ülke/bölge veya IP kaynağı.
* **Application** - nesnenin erişim yapılandırmasının uygulandığı uygulama. [Nesne erişim yapılandırmasının belirli uygulamalara uygulanması sınırlı olduğundan](overview.md#known-caveats-of-ip-lists-configuration), bu sütunda her zaman **All** değeri görüntülenir.
* **Reason** - bir IP adresini veya IP adresleri grubunu listeye ekleme nedeni. Neden, nesneler listeye eklenirken elle belirtilir ya da [tetikleyiciler](../triggers/triggers.md) IP’leri listeye eklediğinde otomatik olarak oluşturulur.
* **Adding date** - bir nesnenin listeye eklendiği tarih ve saat.
* **Remove** - bu sürenin sonunda nesnenin listeden silineceği zaman aralığı.

## Listeyi filtreleme

Listedeki nesneleri şu ölçütlere göre filtreleyebilirsiniz:

* arama dizesinde belirtilen IP adresi veya alt ağ
* liste durumunu görmek istediğiniz zaman aralığı
* bir IP adresinin veya alt ağın kayıtlı olduğu ülke/bölge
* bir IP adresinin veya alt ağın ait olduğu kaynak

## Bir nesnenin listede kalma süresini değiştirme

Bir IP adresinin listede kalma süresini değiştirmek için:

1. Listeden bir nesne seçin.
2. Seçilen nesnenin menüsünde **Change time period**’a tıklayın.
3. Nesnenin listeden kaldırılacağı yeni bir tarih seçin ve işlemi onaylayın.

## Listeden bir nesneyi silme

Bir nesneyi listeden silmek için:

1. Listeden bir veya birden fazla nesne seçin.
2. **Delete**’e tıklayın.