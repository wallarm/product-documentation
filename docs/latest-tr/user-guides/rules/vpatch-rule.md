[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# Sanal Yama

Sanal bir yama, izleme ve güvenli blokaj modlarından veya bir isteğin herhangi bilinen saldırı vektörünü içermediği gibi durumlarda dahi kötü niyetli istekleri engellemeyi sağlar. Sanal yamaların engellemediği tek istekler, [beyaz listeye](../ip-lists/allowlist.md) alınmış IP'lerden gelen isteklerdir.

Sanal yamalar, kodda bir kritik açığı düzeltmenin veya gerekli güvenlik güncellemelerini hızlı bir şekilde yüklemenin imkansız olduğu durumlarda özellikle faydalıdır.

Saldırı türleri seçilirse, istek yalnızca filtre düğümü ilgili parametrede belirtilen türlerden birinin saldırısını algılarsa engellenecektir.

*Herhangi bir istek* ayarı seçilirse, sistem saldırı vektörü içermese bile belirli bir parametreyle istekleri engelleyecektir.

## Kuralın oluşturulması ve uygulanması

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

## Örnek: Sorgu Dizesi Parametresi `id` İçindeki SQLi Saldırılarını Engelleme

**Eğer** aşağıdaki koşullar yerine getirilirse:

* uygulama *example.com* alan adında erişilebilir durumdadır
* uygulamanın *id* parametresi SQL enjeksiyon saldırılarına karşı savunmasızdır
* filtre düğümü izleme moduna ayarlanmıştır
* açıklığın istismar girişimleri engellenmelidir

**Sonra**, bir sanal yama oluşturmak için

1. *Kurallar* sekmesine gidin
1. `example.com/**/*.*` dalını bulun ve *Kural ekle*'yi tıklayın
1. *Sanal bir yama oluştur* seçeneğini seçin
1. Saldırı türü olarak *SQLi* seçin
1. *QUERY* parametresini seçin ve *bu istek bölümünde* seçeneğinden sonra `id` değerini girin

    --8<-- "../include-tr/waf/features/rules/request-part-reference.md"

1. *Oluştur*'a tıklayın

![Belirli bir istek türü için sanal yama][img-vpatch-example1]


## Örnek: Sorgu Dizesi Parametresi `refresh` Olan Tüm İstekleri Engelle

**Eğer** aşağıdaki koşullar yerine getirilirse:

* uygulama *example.com* alan adında erişilebilir durumdadır
* uygulama, sorgu dizesi parametresi `refresh` işlendiğinde çöküyor
* açıklığın istismar girişimleri engellenmelidir

**Sonra**, bir sanal yama oluşturmak için

1. *Kurallar* sekmesine gidin
1. `example.com/**/*.*` dalını bulun ve *Kural ekle*'yi tıklayın
1. *Sanal bir yama oluştur* seçeneğini seçin
1. *Herhangi bir istek* seçin
1. *QUERY* parametresini seçin ve *bu istek bölümünde* seçeneğinden sonra `refresh` değerini girin

    --8<-- "../include-tr/api-request-examples/create-rule-en.md"

1. *Oluştur*'a tıklayın

![Herhangi bir istek türü için sanal yama][img-vpatch-example2]

## Kuralı oluşturmak için API çağrıları

Sanal yama kuralını oluşturmak için, Wallarm Console UI'yi kullanmanın yanı sıra Wallarm API'sini [doğrudan çağırabilirsiniz](../../api/overview.md). Aşağıda, bu API çağrılarının bazı örnekleri bulunmaktadır.

**Tüm istekleri engellemek için sanal yama oluştur `/my/api/*` adresine gönderilen**

--8<-- "../include-tr/api-request-examples/create-rule-en.md"

**Belirli bir uygulama örneği ID için sanal yama oluştur `/my/api/*` adresine tüm istekleri engelleyin**

Bir uygulama, bu isteği göndermeden önce [yapılandırılmalıdır](../settings/applications.md). `action.point[instance].value`'da mevcut bir uygulamanın ID'sini belirtin.

--8<-- "../include-tr/api-request-examples/create-rule-for-app-id.md"