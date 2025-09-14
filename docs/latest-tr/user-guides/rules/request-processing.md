[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# İsteklerin Ayrıştırılması

İstekleri analiz ederken, Wallarm filtreleme düğümü kapsamlı bir ayrıştırıcı seti kullanır. İstek bölümleri belirlendikten sonra, saldırı tespitinde daha sonra kullanılan istek meta parametrelerini sağlamak için ayrıştırıcılar her biri üzerinde sıralı olarak uygulanır. Kullanılabilir ayrıştırıcılar, kullanım mantıkları ve bu mantık için olası yapılandırmalar bu makalede açıklanmaktadır.

Etkili bir ayrıştırma için, Wallarm şu ilkelere uyar:

* Korumalı uygulama ile aynı verilerle çalışın. Örneğin:

    Bir uygulama bir JSON API sunuyorsa, işlenen parametreler de JSON formatında kodlanır. Parametre değerlerini almak için Wallarm JSON ayrıştırıcıyı kullanır. Verilerin birden fazla kez kodlandığı daha karmaşık durumlar da vardır — örneğin, JSON’dan Base64’e, tekrar JSON’a. Bu tür durumlar birden fazla ayrıştırıcı ile kod çözmeyi gerektirir.

* Veri işlemenin bağlamını göz önünde bulundurun. Örneğin:

    `name` parametresi, oluşturma isteklerinde hem ürün adı hem de kullanıcı adı olarak iletilebilir. Ancak, bu tür isteklerin işleme kodu farklı olabilir. Bu tür parametreleri analiz etme yöntemini tanımlamak için Wallarm, isteklerin gönderildiği URL’yi veya diğer parametreleri kullanabilir.

## İstek bölümlerinin tanımlanması ve ayrıştırılması

HTTP isteğinin en üst seviyesinden başlayarak, filtreleme düğümü her uygun ayrıştırıcıyı her bölüme sıralı olarak uygulamaya çalışır. Uygulanan ayrıştırıcıların listesi, verinin doğasına ve sistemin önceki eğitim sonuçlarına bağlıdır.

Ayrıştırıcılardan çıkan çıktı, benzer şekilde analiz edilmesi gereken ek bir parametre kümesi haline gelir. Ayrıştırıcı çıktısı bazen JSON, dizi veya ilişkisel dizi gibi karmaşık bir yapı haline gelir.

!!! info "Ayrıştırıcı etiketleri"
    Her ayrıştırıcının bir tanımlayıcısı (etiket) vardır. Örneğin, istek başlıklarının ayrıştırıcısı için `header`. İstek analizinde kullanılan etiket kümesi, Wallarm Console içinde olay detaylarında görüntülenir. Bu veriler, saldırının tespit edildiği istek bölümünü ve kullanılan ayrıştırıcıları gösterir.

    Örneğin, bir saldırı `SOAPACTION` başlığında tespit edildiyse:

    ![Etiket örneği](../../images/user-guides/rules/tags-example.png)

### URL

Her HTTP isteği bir URL içerir. Saldırıları bulmak için, filtreleme düğümü hem orijinal değeri hem de bunun bireysel bileşenlerini analiz eder: **path**, **action_name**, **action_ext**, **query**.

URL ayrıştırıcısına karşılık gelen etiketler şunlardır:

* **uri**, alan adını içermeyen orijinal URL değeri için (örneğin, `http://example.com/blogs/123/index.php?q=aaa` isteği için `/blogs/123/index.php?q=aaa`).
* **path**, `/` sembolü ile ayrılmış URL parçalarından oluşan bir dizi için (URL’nin son parçası diziye dahil edilmez). URL’de yalnızca bir parça varsa, dizi boş olur.
* **action_name**, `/` sembolünden sonraki ve ilk nokta (`.`) öncesindeki URL’nin son parçası için. Bu URL parçası istekte her zaman mevcuttur, değeri boş bir dize olsa bile.
* **action_ext**, URL’nin son noktasından (`.`) sonraki parçası için. İstekte olmayabilir.

    !!! warning "Birden fazla nokta bulunduğunda **action_name** ile **action_ext** arasındaki sınır"
        `/` sembolünden sonraki URL’nin son parçasında birden fazla nokta (`.`) varsa, **action_name** ile **action_ext** arasındaki sınırla ilgili sorunlar oluşabilir, örneğin:
        
        * Sınırın **ilk** noktaya göre belirlenmesi, örneğin:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * Ayrıştırma sonrasında bazı öğelerin kaybolması, yukarıdaki örnek için bu şöyle olabilir:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        Bunu düzeltmek için URI constructor’ın [advanced edit form](rules.md#advanced-edit-form) ekranında **action_name** ve **action_ext** noktalarını elle düzenleyin.

* **query**, `?` sembolünden sonraki [sorgu dizesi parametreleri](#query-string-parameters) için. 

Örnek:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### Sorgu dizesi parametreleri

Sorgu dizesi parametreleri, `key=value` formatında URL’de `?` karakterinden sonra uygulamaya iletilir. Ayrıştırıcıya karşılık gelen etiket **query**’dir.

İstek örneği | Sorgu dizesi parametreleri ve değerleri
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### İsteğin kaynak IP adresi

Wallarm kurallarında isteğin kaynak IP adresi için istek noktası `remote_addr`’dır. Bu nokta yalnızca IP başına istekleri sınırlamak için [**Advanced rate limiting**](rate-limiting.md) kuralında kullanılır.

### Başlıklar

Başlıklar HTTP isteğinde ve bazı diğer formatlarda (ör. **multipart**) bulunur. Ayrıştırıcıya karşılık gelen etiket **header**’dır. Başlık adları her zaman büyük harfe dönüştürülür.

Örnek:

```
GET / HTTP/1.1
Host: example.com
X-Test: aaa
X-Test: bbb
```

* `[header, 'HOST']` — `example.com`
* `[header, 'X-TEST', array, 0]` — `aaa`
* `[header, 'X-TEST', array, 1]` — `aaa`
* `[header, 'X-TEST', pollution]` — `aaa,bbb`

### Meta veriler

HTTP istek meta verileri için ayrıştırıcıya karşılık gelen etiketler şunlardır:

* **post** — HTTP istek gövdesi için
* **method** — HTTP istek yöntemi için: `GET`, `POST`, `PUT`, `DELETE`
* **proto** — HTTP protokol sürümü için
* **scheme**: http/https
* **application** — uygulama kimliği için

### Ek ayrıştırıcılar

Karmaşık istek bölümleri ek ayrıştırma gerektirebilir (örneğin, veri Base64 ile kodlandıysa veya dizi formatında sunulduysa). Bu tür durumlarda, aşağıda listelenen ayrıştırıcılar istek bölümlerine ek olarak uygulanır.

#### base64

Base64 ile kodlanmış verileri çözer ve isteğin herhangi bir bölümüne uygulanabilir.

#### gzip

GZIP ile kodlanmış verileri çözer ve isteğin herhangi bir bölümüne uygulanabilir.

#### htmljs

HTML ve JS sembollerini metin biçimine dönüştürür ve isteğin herhangi bir bölümüne uygulanabilir.

Örnek: `&#x22;&#97;&#97;&#97;&#x22;` ifadesi `"aaa"` olarak dönüştürülür.

#### json_doc

Veriyi JSON formatında ayrıştırır ve isteğin herhangi bir bölümüne uygulanabilir.

Filtreler:

* **json_array** veya **array**, dizi öğesinin değeri için
* **json_obj** veya **hash**, ilişkisel dizi anahtarının (`key:value`) değeri için

Örnek:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

Veriyi XML formatında ayrıştırır ve isteğin herhangi bir bölümüne uygulanabilir.

Filtreler:

* **xml_comment**, bir XML belgesinin gövdesindeki yorumlardan oluşan bir dizi için
* **xml_dtd**, kullanılan harici DTD şemasının adresi için
* **xml_dtd_entity**, Entity DTD belgesinde tanımlanan bir dizi için
* **xml_pi**, işlenecek yönergelerden oluşan bir dizi için
* **xml_tag** veya **hash**, etiketlerden oluşan ilişkisel bir dizi için

    !!! info "Ad alanlarıyla **xml_tag** biçimlendirme"
        **xml_tag** içinde URI, ad alanı ve etiket adını birlikte belirtirseniz, gerekli ayırıcı Wallarm düğümü sürümüne bağlıdır:

        * 6.3.0 ve sonraki sürümlerde `URI|namespace|tag_name`, ör. `https://www.w3.org/path|xhtml|html`
        * 6.3.0’dan önceki sürümlerde `URI:namespace:tag_name`, ör. `https://www.w3.org/path:xhtml:html`

* **xml_tag_array** veya **array**, etiket değerlerinden oluşan bir dizi için
* **xml_attr**, özniteliklerden oluşan ilişkisel bir dizi için; yalnızca **xml_tag** filtresinden sonra kullanılabilir

XML ayrıştırıcı, etiket içeriği ile etiketin değerleri dizisindeki ilk öğe arasında ayrım yapmaz. Yani, `[..., xml, xml_tag, 't1']` ve `[..., xml, xml_tag, 't1', array, 0]` parametreleri özdeştir ve birbirinin yerine kullanılabilir.

Örnek:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- deneme -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — ad = `xxe`, değer = `aaaa`
* `[..., xml, xml_pi, 0]` — ad = `xml-stylesheet`, değer = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` deneme `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

Veri dizisini ayrıştırır. İsteğin herhangi bir bölümüne uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

İlişkisel veri dizisini (`key:value`) ayrıştırır ve isteğin herhangi bir bölümüne uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

Aynı ada sahip parametrelerin değerlerini birleştirir ve isteğin herhangi bir bölümüne, başlangıç veya kodu çözülmüş formatta uygulanabilir.

Örnek:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

URL sembollerinin kodunu çözer ve yalnızca URL’nin **uri** bileşenine uygulanabilir.

#### cookie

Cookie istek parametrelerini ayrıştırır ve yalnızca istek başlıklarına uygulanabilir.

Örnek:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

`application/x-www-form-urlencoded` formatında iletilen istek gövdesini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

Örnek:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, form_urlencoded, 'p1']` — `1`
* `[post, form_urlencoded, 'p2', hash, 'a']` — `2`
* `[post, form_urlencoded, 'p2', hash, 'b']` — `3`
* `[post, form_urlencoded, 'p3', array, 0]` — `4`
* `[post, form_urlencoded, 'p3', array, 1]` — `5`
* `[post, form_urlencoded, 'p4', array, 0]` — `6`
* `[post, form_urlencoded, 'p4', array, 1]` — `7`
* `[post, form_urlencoded, 'p4', pollution]` — `6,7`

#### grpc<a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC API isteklerini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

Protocol Buffers verileri için **protobuf** filtresini destekler.

#### multipart

`multipart` formatında iletilen istek gövdesini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

İstek gövdesindeki başlıklar için **header** filtresini destekler.

Örnek:

```
p1=1&p2[a]=2&p2[b]=3&p3[]=4&p3[]=5&p4=6&p4=7
```

* `[post, multipart, 'p1']` — `1`
* `[post, multipart, 'p2', hash, 'a']` — `2`
* `[post, multipart, 'p2', hash, 'b']` — `3`
* `[post, multipart, 'p3', array, 0]` — `4`
* `[post, multipart, 'p3', array, 1]` — `5`
* `[post, multipart, 'p4', array, 0]` — `6`
* `[post, multipart, 'p4', array, 1]` — `7`
* `[post, multipart, 'p4', pollution]` — `6,7`

`Content-Disposition` başlığında bir dosya adı belirtilmişse, bu parametrede bir dosyanın yüklendiği kabul edilir. Parametre şöyle görünür:

* `[post, multipart, 'someparam', file]` — dosya içeriği

#### viewstate

Oturum durumunu analiz etmek için tasarlanmıştır. Teknoloji Microsoft ASP.NET tarafından kullanılır ve yalnızca istek gövdesine uygulanabilir.

Filtreler:

* **viewstate_array** — bir dizi için
* **viewstate_pair** — bir dizi için
* **viewstate_triplet** — bir dizi için
* **viewstate_dict** — bir ilişkisel dizi için
* **viewstate_dict_key** — bir dize için
* **viewstate_dict_value** — bir dize için
* **viewstate_sparse_array** — bir ilişkisel dizi için

#### jwt

JWT belirteçlerini ayrıştırır ve isteğin herhangi bir bölümüne uygulanabilir.

JWT ayrıştırıcısı, tespit edilen JWT yapısına göre sonucu aşağıdaki parametrelerde döndürür:

* `jwt_prefix`: desteklenen JWT değer öneklerinden biri — lsapi2, mobapp2, bearer. Ayrıştırıcı önek değerini büyük/küçük harf duyarsız okur.
* `jwt_header`: JWT üst bilgisi. Değeri aldıktan sonra Wallarm genellikle buna [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarını da uygular.
* `jwt_payload`: JWT yükü. Değeri aldıktan sonra Wallarm genellikle buna [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarını da uygular.

JWT’ler isteğin herhangi bir bölümünde iletilebilir. Bu nedenle, `jwt` ayrıştırıcısını uygulamadan önce Wallarm, ilgili istek bölümü ayrıştırıcısını kullanır; ör. [`query`](#query-string-parameters) veya [`header`](#headers).

`Authentication` başlığında iletilen JWT örneği:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

[rule](rules.md)’ün uygulanacağı bir istek öğesini tanımlarken:

* Önce JWT içeren istek bölümünün ayrıştırıcısını seçin
* `jwt` ayrıştırıcı değeri olarak listelenen `jwt_*` parametrelerinden birini belirtin, ör. `name` JWT yükü parametresi değeri için:

![Bir kuralda JWT param tanımı](../../images/user-guides/rules/request-element-desc.png)

#### gql

GraphQL yürütülebilir tanımlarını (sorgular, mutasyonlar, abonelikler ve parçalar) ayrıştırır; bu da GraphQL’e özgü istek noktalarında [girdi doğrulama saldırılarının](../../attacks-vulns-list.md#attack-types) gelişmiş tespitini sağlar. NGINX Node 5.3.0 veya üstü ya da native node 0.12.0 gerektirir.

Filtreler:

 * **gql_query** — bir sorgu işlemi için
 * **gql_mutation** — bir mutasyon işlemi için
 * **gql_subscription** — bir abonelik işlemi için
 * **gql_alias** — bir alan takma adı için
 * **gql_arg** — alan argümanları için
 * **gql_dir** — bir yönerge için
 * **gql_spread** — bir parça yayılımı için
 * **gql_fragment** — bir parça tanımı için
 * **gql_type** — bir parça tanımının veya satır içi parçanın adlandırılmış türü için
 * **gql_inline** — bir satır içi parça için
 * **gql_var** — bir değişken tanımı için

Örnekler:

```
query GetUser {
  user(id: "1") {
    ...UserFields @include(if: true)
  }
}
```

* `[..., gql, gql_query, 'GetUser', hash, 'user', gql_arg, hash, 'id']` — `1`
* `[..., gql, gql_query, 'GetUser', hash, 'user', gql_spread,` `'UserFields', gql_dir, 'include', gql_arg, hash, 'if']` — `true`

```
query GetAllUsers {
  users(limit: 10) {
    ...UserFields @include(if: true)
  }
}
```

* `[..., gql, gql_query, 'GetAllUsers', hash, 'users', gql_arg, hash, 'limit']` — `10`
* `[..., gql, gql_query, 'GetAllUsers', hash, 'users',` `gql_spread, 'UserFields', gql_dir, 'include', gql_arg, hash, 'if']` — `true`

```
fragment UserFields on User {
  id
  name
  email
  posts(status: "published") {
    title
    content
  }
}
```

* `[..., gql, gql_fragment, 'UserFields', gql_type,` `'User', hash, 'posts', gql_arg, hash, 'status']` — `published`

Ayrıştırıcı, [API Sessions](../../api-sessions/overview.md#graphql-requests-in-api-sessions) içinde GraphQL istek parametrelerinin değerlerini çıkarmayı ve görüntülemeyi ve isteklerin GraphQL’e özgü bölümlerine [kurallar](rules.md) uygulamayı sağlar:

![GraphQL istek noktasına uygulanan kural örneği](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

!!! info "Wallarm ile GraphQL koruması"
    Varsayılan olarak [her zaman etkin](#managing-parsers) ayrıştırıcı, GraphQL’de düzenli saldırıların (SQLi, RCE, vb.) tespitini sağlarken, Wallarm ayrıca GraphQL’e özgü saldırılara karşı korumayı [yapılandırmayı](../../api-protection/graphql-rule.md) da sağlar.

### Normlar

Normlar, dizi ve anahtar veri tipleri için ayrıştırıcılara uygulanır. Normlar, veri analizinin sınırlarını tanımlamak için kullanılır. Normun değeri ayrıştırıcı etiketinde belirtilir. Örneğin: **hash_all**, **hash_name**.

Norm belirtilmemişse, işlenmesi gereken varlığın tanımlayıcısı ayrıştırıcıya geçirilir. Örneğin: JSON nesnesinin adı veya diğer bir tanımlayıcı **hash**’ten sonra iletilir.

**all**

Tüm öğe, parametre veya nesne değerlerini almak için kullanılır. Örneğin:

* URL yolunun tüm parçaları için **path_all**
* Tüm sorgu dizesi parametre değerleri için **query_all**
* Tüm başlık değerleri için **header_all**
* Tüm dizi öğe değerleri için **array_all**
* Tüm JSON nesnesi veya XML öznitelik değerleri için **hash_all**
* Tüm JWT değerleri için **jwt_all**

**name**

Tüm öğe, parametre veya nesne adlarını almak için kullanılır. Örneğin:

* Tüm sorgu dizesi parametre adları için **query_name**
* Tüm başlık adları için **header_name**
* Tüm JSON nesnesi veya XML öznitelik adları için **hash_name**
* JWT içeren tüm parametrelerin adları için **jwt_name**

## Ayrıştırıcıların yönetimi

Varsayılan olarak, isteği analiz ederken Wallarm düğümü, isteğin her bir ögesine uygun [ayrıştırıcılardan](request-processing.md) her birini sıralı olarak uygulamaya çalışır. Ancak, bazı ayrıştırıcılar hatalı şekilde uygulanabilir ve bunun sonucunda Wallarm düğümü kodu çözülmüş değerde saldırı işaretleri tespit edebilir.

Örneğin: Wallarm düğümü, Base64 alfabesi sembolleri düzenli metinlerde, belirteç değerlerinde, UUID değerlerinde ve diğer veri formatlarında sıklıkla kullanıldığından, kodlanmamış veriyi [Base64](https://en.wikipedia.org/wiki/Base64) ile kodlanmış olarak yanlışlıkla tanımlayabilir. Kodlanmamış verinin kodunu çözüp ortaya çıkan değerde saldırı işaretleri tespit edilirse, [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) oluşur.

Bu tür yanlış pozitifleri önlemek için Wallarm, belirli istek ögelerine yanlışlıkla uygulanan ayrıştırıcıları devre dışı bırakmak amacıyla **Disable/Enable request parser** kuralını sağlar.

**Kuralın oluşturulması ve uygulanması**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Configure parsers** seçin.
1. **If request is** içinde, kuralın uygulanacağı kapsamı [açıklayın](rules.md#configuring).
1. `off`/`on` olacak ayrıştırıcıları ekleyin.
1. **In this part of request** içinde, kuralı ayarlamak istediğiniz istek noktalarını belirtin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri kısıtlayacaktır.

    Kullanılabilir tüm noktalar yukarıda bu makalede açıklanmıştır; belirli kullanım durumunuza uygun olanları seçebilirsiniz.

1. [Kuralın derlenmesinin ve filtreleme düğümüne yüklenmesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

**Kural örneği**

`https://example.com/users/` adresine yapılan isteklerin `X-AUTHTOKEN` kimlik doğrulama başlığını gerektirdiğini varsayalım. Başlık değeri, Wallarm tarafından `base64` ayrıştırıcısı ile potansiyel olarak kodu çözülebilecek (ör. sonda `=` gibi) belirli sembol kombinasyonları içerebilir ve bu da saldırı işaretlerinin yanlış tespit edilmesine yol açabilir. Yanlış pozitifleri önlemek için bu kod çözmeyi engellemeniz gerekir. 

Bunu yapmak için kuralı ekrandaki gibi ayarlayın:

![“Disable/Enable request parser” kuralı örneği](../../images/user-guides/rules/disable-parsers-example.png)