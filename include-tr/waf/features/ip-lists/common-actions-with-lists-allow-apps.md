```markdown
[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## IP Liste Nesnelerini Getirmek, Doldurmak ve Silmek için API Çağrıları

IP liste nesnelerini getirmek, doldurmak ve silmek için Wallarm Console UI'nın yanı sıra [Wallarm API'yi doğrudan çağırabilirsiniz](../../api/overview.md). Aşağıda ilgili API çağrılarına ait bazı örnekler bulunmaktadır.

### API İstek Parametreleri

IP listelerini okumak ve değiştirmek için API isteklerine geçilecek parametreler:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### `.csv` Dosyasından Girdileri Listeye Ekleyin

`.csv` dosyasından IP'leri veya alt ağları listeye eklemek için aşağıdaki bash betiğini kullanın:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Tek Bir IP veya Alt Ağı Listeye Ekleyin

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Birden Fazla Ülkeyi Listeye Ekleyin

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Birden Fazla Proxy Servisini Listeye Ekleyin

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IP Listeden Bir Nesneyi Silin

Nesneler, IP listelerinden ID'leri kullanılarak silinir.

Bir nesne ID'si almak için, IP liste içeriğini sorgulayın ve yanıt içerisinden gerekli nesnenin `objects.id` değerini kopyalayın:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Nesne ID'sine sahip olduktan sonra, liste üzerinden silmek için aşağıdaki isteği gönderin:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Silme isteğinde ID'leri bir dizi olarak geçirerek bir seferde birden fazla nesneyi silebilirsiniz.
```