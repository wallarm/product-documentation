[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# İsteklerin Ayrıştırılması

İstekleri analiz ederken, Wallarm filtreleme düğümü kapsamlı bir ayrıştırıcı seti kullanır. İstek bölümleri belirlendikten sonra, saldırı tespitinde kullanılan istek meta parametrelerini sağlamak amacıyla her birine sırayla ayrıştırıcılar uygulanır. Kullanılabilir ayrıştırıcılar, bunların kullanım mantıkları ve bu mantık için olası yapılandırmalar bu belgede açıklanmıştır.

Etkili bir ayrıştırma için, Wallarm şu ilkelere uyar:

* Korunan uygulamayla aynı veriler üzerinde çalışır. Örneğin:

    Bir uygulama JSON API sağlıyorsa, işlenen parametreler de JSON formatında kodlanmış olacaktır. Parametre değerlerini almak için Wallarm, JSON ayrıştırıcısını kullanır. Verinin birkaç kez kodlandığı daha karmaşık durumlar da vardır — örneğin, JSON'dan Base64'e, sonra tekrar JSON. Bu tür durumlar, birkaç ayrıştırıcı ile kod çözmeyi gerektirir.

* Veri işleme bağlamını göz önünde bulundurur. Örneğin:

    `name` parametresi, oluşturma isteklerinde hem ürün adı hem de kullanıcı adı olarak geçebilir. Ancak bu tür istekler için işleme kodu farklı olabilir. Bu parametrelerin analiz yöntemini tanımlamak için Wallarm, isteklerin gönderildiği URL veya diğer parametreleri kullanabilir.

## İstek Bölümlerinin Tanımlanması ve Ayrıştırılması

HTTP isteğinin en üst seviyesinden başlayarak, filtreleme düğümü uygun her bir ayrıştırıcıyı her bölüm için sırayla uygulamaya çalışır. Uygulanan ayrıştırıcıların listesi, verinin doğasına ve sistemin önceki eğitim sonuçlarına bağlıdır.

Ayrıştırıcıların çıktısı, benzer şekilde analiz edilmesi gereken ek parametre seti haline gelir. Ayrıştırıcı çıktısı bazen JSON, dizi veya ilişkilendirilmiş dizi gibi karmaşık bir yapı olur.

!!! info "Ayrıştırıcı Etiketleri"
    Her ayrıştırıcının bir tanımlayıcısı (etiket) vardır. Örneğin, istek başlıkları ayrıştırıcısı için `header`. İstek analizinde kullanılan etiket seti, olay ayrıntıları içinde Wallarm Console'da görüntülenir. Bu veriler, tespit edilen saldırı ve kullanılan ayrıştırıcılarla birlikte istek bölümünü gösterir.

    Örneğin, `SOAPACTION` başlığında bir saldırı tespit edilirse:

    ![Tag example](../../images/user-guides/rules/tags-example.png)

### URL

Her HTTP isteği bir URL içerir. Saldırıları bulmak için, filtreleme düğümü hem orijinal değeri hem de onun bileşenlerini analiz eder: **path**, **action_name**, **action_ext**, **query**.

URL ayrıştırıcısına karşılık gelen etiketler:

* **uri**: Alan adı olmadan orijinal URL değeri (örneğin, `http://example.com/blogs/123/index.php?q=aaa` isteği için `/blogs/123/index.php?q=aaa`).
* **path**: `/` sembolüyle ayrılmış URL bölümlerini içeren bir dizi (son URL bölümü diziye dahil edilmez). URL'de sadece bir bölüm varsa, dizi boş olacaktır.
* **action_name**: URL'nin `/` sembolünden sonraki ve ilk nokta (`.`) öncesindeki son parçası. Bu URL parçası, değeri boş bir dize olsa bile, isteklerde her zaman bulunur.
* **action_ext**: URL'nin son nokta (`.`) sonrasındaki kısmı. İstekte eksik olabilir.

    !!! warning "**action_name** ve **action_ext** arasındaki sınır, birden fazla nokta olduğunda"
        URL'nin `/` sembolünden sonraki son bölümünde birden fazla nokta (`.`) varsa, **action_name** ile **action_ext** arasındaki sınırda şu gibi sorunlar meydana gelebilir:
        
        * Sınır, **ilk** noktaya göre belirlenmiş, örneğin:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * Ayrıştırma sonrası bazı elemanlar eksik olabilir, yukarıdaki örnek için:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        Bunu düzeltmek için, URI yapıcısının [advanced edit form](rules.md#advanced-edit-form) bölümünde **action_name** ve **action_ext** noktalarını manuel olarak düzenleyin.

* **query**: `?` sembolünden sonraki [query string parametrelerine](#query-string-parameters) karşılık gelir. 

Örnek:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### Query String Parametreleri

Query string parametreleri, istek URL'sinde `?` karakterinden sonra `key=value` formatında uygulamaya iletilir. **query** etiketi, bu ayrıştırıcıya karşılık gelir.

İstek örneği | Query string parametreleri ve değerleri
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### İstek Kaynağının IP Adresi

Wallarm kurallarında, istek kaynağının IP adresi için nokta `remote_addr` olarak belirlenmiştir. Bu nokta, yalnızca IP başına istek sayısını sınırlandırmak için kullanılan [**Set rate limit**](rate-limiting.md) kuralında kullanılır.

### Headers

Başlıklar, HTTP isteğinde ve bazı diğer formatlarda (örneğin, **multipart**) sunulur. **header** etiketi bu ayrıştırıcıya karşılık gelir. Başlık isimleri her zaman büyük harfe dönüştürülür.

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

### Metadata

HTTP istek meta verileri için ayrıştırıcıya karşılık gelen etiketler:

* **post**: HTTP istek gövdesi
* **method**: HTTP istek metodu: `GET`, `POST`, `PUT`, `DELETE`
* **proto**: HTTP protokol sürümü
* **scheme**: http/https
* **application**: uygulama ID'si

### Ekstra Ayrıştırıcılar

Karmaşık istek bölümleri ek ayrıştırma gerektirebilir (örneğin, verinin Base64 kodlu olması veya dizi formatında sunulması durumunda). Bu tür durumlarda, aşağıda listelenen ayrıştırıcılar istek bölümlerine ek olarak uygulanır.

#### base64

Base64 kodlu verileri çözer ve istek içindeki herhangi bir bölüme uygulanabilir.

#### gzip

GZIP ile kodlanmış verileri çözer ve istek içindeki herhangi bir bölüme uygulanabilir.

#### htmljs

HTML ve JS sembollerini metin formatına dönüştürür ve istek içindeki herhangi bir bölüme uygulanabilir.

Örnek: `&#x22;&#97;&#97;&#97;&#x22;` `"aaa"` olarak dönüştürülecektir.

#### json_doc

Veriyi JSON formatında ayrıştırır ve istek içindeki herhangi bir bölüme uygulanabilir.

Filtreler:

* **json_array** veya **array**: dizinin eleman değeri için
* **json_obj** veya **hash**: ilişkisel dizideki anahtarın (`key:value`) değeri için

Örnek:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

Veriyi XML formatında ayrıştırır ve istek içindeki herhangi bir bölüme uygulanabilir.

Filtreler:

* **xml_comment**: XML belgesinin gövdesindeki yorumları içeren dizi
* **xml_dtd**: Kullanılan harici DTD şemasının adresi
* **xml_dtd_entity**: Entity DTD belgesinde tanımlı dizi
* **xml_pi**: İşlenecek talimatları içeren dizi
* **xml_tag** veya **hash**: etiketlerin ilişkisel dizisi
* **xml_tag_array** veya **array**: etiket değerlerinin dizisi
* **xml_attr**: ilişkisel dizi şeklinde öznitelikler; yalnızca **xml_tag** filtresinden sonra kullanılabilir

XML ayrıştırıcısı, etiket içeriği ile etiket değerlerinin dizisinin ilk elemanı arasında ayrım yapmaz. Yani, `[..., xml, xml_tag, 't1']` ve `[..., xml, xml_tag, 't1', array, 0]` parametreleri aynı ve birbirlerinin yerine kullanılabilir.

Örnek:

```
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "aaaa">]>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!-- test -->
<methodCall>
  <methodName>&xxe;</methodName>
  <methodArgs check="true">123</methodArgs>
  <methodArgs>234</methodArgs>
</methodCall>
```

* `[..., xml, xml_dtd_entity, 0]` — name = `xxe`, value = `aaaa`
* `[..., xml, xml_pi, 0]` — name = `xml-stylesheet`, value = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

Veri dizisini ayrıştırır. İstek içindeki herhangi bir bölüme uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

İlişkisel veri dizisini (`key:value`) ayrıştırır ve istek içindeki herhangi bir bölüme uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

Aynı isimdeki parametrelerin değerlerini birleştirir ve hem ilk hem de çözümlenmiş formatta istek içindeki herhangi bir bölüme uygulanabilir.

Örnek:

```
/?p3=1&p3=2
```

* `[query, 'p3', pollution]` — `1,2`

#### percent

URL sembollerini çözer ve yalnızca URL'nin **uri** bileşenine uygulanabilir.

#### cookie

Cookie istek parametrelerini ayrıştırır ve yalnızca istek başlıklarına uygulanabilir.

Örnek:

```
GET / HTTP/1.1
Cookie: a=1; b=2
```

* `[header, 'COOKIE', cookie, 'a']` = `1`
* `[header, 'COOKIE', cookie, 'b']` = `2`

#### form_urlencoded

`application/x-www-form-urlencoded` formatında gönderilen istek gövdesini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

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

**grpc** <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC API isteklerini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

Protocol Buffers verileri için **protobuf** filtresini destekler.

#### multipart

`multipart` formatında gönderilen istek gövdesini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

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

Eğer `Content-Disposition` başlığında bir dosya adı belirtilmişse, dosyanın bu parametreye yüklendiği kabul edilir. Parametre şu şekilde görünecektir:

* `[post, multipart, 'someparam', file]` — dosya içeriği

#### viewstate

Oturum durumunu analiz etmek üzere tasarlanmıştır. Teknoloji, Microsoft ASP.NET tarafından kullanılır ve yalnızca istek gövdesine uygulanabilir.

Filtreler:

* **viewstate_array**: dizi için
* **viewstate_pair**: dizi için
* **viewstate_triplet**: dizi için
* **viewstate_dict**: ilişkisel dizi için
* **viewstate_dict_key**: dize için
* **viewstate_dict_value**: dize için
* **viewstate_sparse_array**: ilişkisel dizi için

#### jwt

JWT tokenlarını ayrıştırır ve istek içindeki herhangi bir bölüme uygulanabilir.

JWT ayrıştırıcı, tespit edilen JWT yapısına göre aşağıdaki parametreleri döndürür:

* `jwt_prefix`: desteklenen JWT değer öneklerinden biri - lsapi2, mobapp2, bearer. Ayrıştırıcı önek değerini herhangi bir biçimde okur.
* `jwt_header`: JWT başlığı. Değer alındıktan sonra, Wallarm genellikle buna [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarını uygular.
* `jwt_payload`: JWT yükü. Değer alındıktan sonra, Wallarm genellikle buna [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarını uygular.

JWT'ler, istek içindeki herhangi bir bölümde iletilebilir. Bu nedenle, `jwt` ayrıştırıcısını uygulamadan önce Wallarm, örneğin [`query`](#query-string-parameters) veya [`header`](#headers) gibi belirli istek bölümü ayrıştırıcısını kullanır.

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

Bir istek öğesi tanımlanırken aşağıdaki [kural](rules.md) uygulanır:

* JWT içeren istek bölümünün ayrıştırıcısını ilk önce seçin
* `jwt` ayrıştırıcı değeri olarak listelenen `jwt_*` parametrelerinden birini belirtin, örneğin `name` JWT yükü parametre değeri için:

![JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

#### gql

GraphQL yürütülebilir tanımlamalarını (sorgular, mutasyonlar, abonelikler ve fragmentler) ayrıştırır; bu, GraphQL'e özgü istek noktalarında [input validation saldırılarının](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) iyileştirilmiş tespitini sağlar. NGINX Node 5.3.0 veya daha üstünü gerektirir, Native Node henüz desteklememektedir.

Filtreler:

 * **gql_query**: bir sorgu işlemi için
 * **gql_mutation**: bir mutasyon işlemi için
 * **gql_subscription**: bir abonelik işlemi için
 * **gql_alias**: bir alan takma adı için
 * **gql_arg**: alan argümanları için
 * **gql_dir**: bir direktif için
 * **gql_spread**: bir fragment yayılımı için
 * **gql_fragment**: bir fragment tanımı için
 * **gql_type**: bir fragment tanımının veya satı içi fragmentin adlandırılmış türü için
 * **gql_inline**: satı içi fragment için
 * **gql_var**: değişken tanımı için

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

Ayrıştırıcı, [API Sessions](../../api-sessions/overview.md#graphql-requests-in-api-sessions) içindeki GraphQL istek parametrelerinin değerlerini çıkarmaya ve görüntülemeye olanak tanır ve GraphQL'e özgü istek bölümlerine [kuralların](rules.md) uygulanmasını sağlar:

![Example of the rule applied to GraphQL request point"](../../images/user-guides/rules/rule-applied-to-graphql-point.png)

!!! info "Wallarm ile GraphQL Koruması"
    [Her zaman etkin olan](#managing-parsers) ayrıştırıcı, varsayılan olarak GraphQL'deki normal saldırıları (SQLi, RCE, vb.) tespit ederken, Wallarm ayrıca [GraphQL'e özgü saldırılardan](../../api-protection/graphql-rule.md) korumayı **yapılandırmanıza** olanak tanır.

### Normlar

Normlar, dizi ve anahtar veri tipleri için ayrıştırıcılara uygulanır. Normlar, veri analiz sınırlarını tanımlamak için kullanılır. Norm değeri, ayrıştırıcı etiketinde belirtilir. Örneğin: **hash_all**, **hash_name**.

Norm belirtilmemişse, işleme gereksinimi olan varlığın tanımlayıcısı ayrıştırıcıya iletilir. Örneğin: JSON nesnesinin adı veya başka bir tanımlayıcı, **hash** sonrasında iletilir.

**all**

Tüm eleman, parametre veya nesne değerlerini almak için kullanılır. Örneğin:

* URL yolundaki tüm parçalar için **path_all**
* Tüm query string parametre değerleri için **query_all**
* Tüm başlık değerleri için **header_all**
* Tüm dizi eleman değerleri için **array_all**
* Tüm JSON nesnesi veya XML öznitelik değerleri için **hash_all**
* Tüm JWT değerleri için **jwt_all**

**name**

Tüm eleman, parametre veya nesne isimlerini almak için kullanılır. Örneğin:

* Tüm query string parametre isimleri için **query_name**
* Tüm başlık isimleri için **header_name**
* Tüm JSON nesnesi veya XML öznitelik isimleri için **hash_name**
* Tüm JWT parametre isimleri için **jwt_name**

## Ayrıştırıcıların Yönetimi

Varsayılan olarak, Wallarm düğümü isteği analiz ederken uygun [ayrıştırıcılardan](request-processing.md) her birini istek öğesine sırayla uygulamaya çalışır. Ancak, bazı ayrıştırıcılar yanlışlıkla uygulanabilir ve sonuç olarak Wallarm düğümü, çözümlenen değerde saldırı belirtilerini tespit edebilir.

Örneğin: Wallarm düğümü, Base64 alfabesindeki sembollerin normal metin, token değerleri, UUID değerleri ve diğer veri formatlarında sıklıkla kullanılması nedeniyle, kodlanmamış veriyi yanlışlıkla Base64 kodlanmış olarak algılayabilir. Kodlanmamış verinin kodunun çözülmesi ve ortaya çıkan değerde saldırı belirtileri tespit edilirse, [yanlış pozitif](../../about-wallarm/protecting-against-attacks.md#false-positives) oluşur.

Bu tür durumlarda yanlış pozitifleri önlemek için Wallarm, belirli istek öğelerine yanlışlıkla uygulanan ayrıştırıcıları devre dışı bırakmak/etkinleştirmek amacıyla **Disable/Enable request parser** kuralını sağlar.

**Kuralın Oluşturulması ve Uygulanması**

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Configure parsers** seçeneklerini seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [describe](rules.md#configuring) edin.
1. `off`/`on` olarak ayarlanacak ayrıştırıcıları ekleyin.
1. **In this part of request** bölümünde, kuralı uygulamak istediğiniz istek parametrelerini belirtin. Wallarm, seçilen istek parametreleri için aynı değerlere sahip istekleri kısıtlayacaktır.

    Mevcut tüm noktalar yukarıdaki bu belgede açıklanmıştır, özel kullanım durumunuza uyanları seçebilirsiniz.

1. [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle) işleminin tamamlanmasını bekleyin.

**Kural Örneği**

Diyelim ki, `https://example.com/users/` adresine yapılan isteklerde `X-AUTHTOKEN` kimlik doğrulama başlığı gerekmektedir. Başlık değeri, örneğin sonunda `=` gibi Wallarm tarafından Base64 ayrıştırıcısı ile potansiyel olarak kodu çözülebilecek belirli sembol kombinasyonlarını içerebilir; bu da saldırı belirtisinin yanlış tespitine neden olabilir. Bunu önlemek için, bu kod çözmenin engellenmesi, yanlış pozitifleri önlemek açısından gereklidir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi kuralı ayarlayın:

![Example of the rule "Disable/Enable request parser"](../../images/user-guides/rules/disable-parsers-example.png)