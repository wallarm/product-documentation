## Listeye bir nesne ekleme

Listeye bir IP address, subnet veya IP address'leri grubunu eklemek için:

1. **Add object** düğmesine tıklayın.
2. Aşağıdaki yöntemlerden biriyle bir IP address veya IP address'leri grubunu belirtin:

    * Tek bir **IP address** veya bir **subnet** girin
        
        !!! info "Supported subnet masks"
            IPv6 adresleri için maksimum desteklenen alt ağ maskesi `/32` ve IPv4 adresleri için `/12`'dir.
    
    * Bu ülke/bölgeye kayıtlı tüm IP address'leri eklemek için bir **country** veya bir **region** (geolocation) seçin.
    * Bu türe ait tüm IP address'leri eklemek için **source type**'ı seçin, örneğin:
        * **Tor**: Tor ağının IP address'leri
        * **Proxy**: Kamuya açık veya web proxy sunucularının IP address'leri
        * **Search Engine Spiders**: Arama motoru tarayıcılarının IP address'leri
        * **VPN**: Sanal özel ağların (VPN) IP address'leri
        * **AWS**: Amazon AWS'e kayıtlı IP address'leri
3. Listeye eklenecek IP address veya IP address'leri grubunun kalacağı süreyi seçin. Minimum değer 5 dakika, maksimum değer ise süresizdir.
4. Listeye IP address veya IP address'leri grubu eklemenin nedenini belirtin.
5. IP address veya IP address'leri grubunun listeye eklenmesini onaylayın.

![Add IP to the list (without app)](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

## Listeye Eklenen Nesnelerin Analizi

Wallarm Console, listeye eklenen her nesne için aşağıdaki verileri gösterir:

* **Object** - Listeye eklenen IP address, subnet, country/region veya IP source.
* **Application** - Nesnenin erişim yapılandırmasının uygulandığı uygulama. [Belirli uygulamalara nesne erişim yapılandırması uygulamanın sınırlı olması](overview.md#known-caveats-of-ip-lists-configuration) nedeniyle, bu sütun her zaman **All** değerini gösterir.
* **Reason** - Listeye bir IP address veya IP address'leri grubunun eklenme nedeni. Neden, nesneler listeye eklenirken manuel olarak belirtilir veya IP'ler [triggers](../triggers/triggers.md) tarafından listeye eklendiğinde otomatik olarak oluşturulur.
* **Adding date** - Bir nesnenin listeye eklendiği tarih ve saat.
* **Remove** - Bir nesnenin listeden silineceği süre.

## Listenin Filtrelenmesi

Listede bulunan nesneleri şu kriterlere göre filtreleyebilirsiniz:

* Arama stringinde belirtilen IP address veya subnet
* Listenin durumunu almak istediğiniz süre
* Bir IP address veya subnet'in kayıtlı olduğu country/region
* Bir IP address veya subnet'in ait olduğu source

## Bir Nesnenin Listede Kalma Süresinin Değiştirilmesi

Bir IP address'in listede kalma süresini değiştirmek için:

1. Listeden bir nesne seçin.
2. Seçili nesne menüsünde, **Change time period**'a tıklayın.
3. Bir nesnenin listeden silineceği yeni tarihi seçin ve işlemi onaylayın.

## Listeden Bir Nesnenin Silinmesi

Listeden bir nesneyi silmek için:

1. Listeden bir veya birkaç nesne seçin.
2. **Delete**'ye tıklayın.