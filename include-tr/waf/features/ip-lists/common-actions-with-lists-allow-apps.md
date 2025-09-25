[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

## IP listesi nesnelerini alma, doldurma ve silme için API çağrıları

IP listesi nesnelerini almak, doldurmak ve silmek için Wallarm Console UI kullanmanın yanı sıra, [Wallarm API'yi doğrudan çağırabilirsiniz](../../api/overview.md). Aşağıda ilgili API çağrılarına bazı örnekler yer almaktadır.

### API istek parametreleri

IP listelerini okumak ve değiştirmek için API isteklerinde iletilecek parametreler:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Listeye `.csv` dosyasındaki girdileri ekleme

`.csv` dosyasındaki IP'leri veya alt ağları listeye eklemek için aşağıdaki bash betiğini kullanın:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Listeye tek bir IP veya alt ağ ekleme

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Listeye birden fazla ülke ekleme

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Listeye birden fazla proxy hizmeti ekleme

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### IP listesinden bir nesne silme

Nesneler IP listelerinden kimlikleri (ID’leri) ile silinir.

Bir nesnenin ID’sini almak için IP listesi içeriğini isteyin ve yanıttan gerekli nesnenin `objects.id` değerini kopyalayın:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Nesnenin ID’si elinizdeyken, onu listeden silmek için aşağıdaki isteği gönderin:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

Silme isteğinde ID’lerini bir dizi olarak geçirerek birden fazla nesneyi aynı anda silebilirsiniz.