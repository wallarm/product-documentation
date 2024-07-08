# İstekleri Analiz Etme ve Ayrıştırma

Etkili bir istek analizi için Wallarm, aşağıdaki prensipleri takip eder:

* Korunan uygulamanın aynı verileriyle çalışır. Örneğin:
    Eğer bir uygulama bir JSON API sağlıyorsa, işlenen parametreler de JSON formatında kodlanmış olur. Parametre değerlerini almak için Wallarm, JSON ayrıştırıcısını kullanır. Verinin birkaç kez kodlandığı daha karmaşık durumlar da bulunmaktadır — örneğin, JSON'dan Base64'e JSON'a. Bu tür durumlar, birden fazla ayrıştırıcıyla kod çözme gerektirir.

* Veri işleme bağlamını dikkate alır. Örneğin:

    `name` parametresi, ürün adı ve kullanıcı adı olarak yaratma isteklerinde geçebilir. Ancak, bu tür isteklerin işleme kodları farklı olabilir. Bu tür parametreleri analiz etme yöntemini belirlemek için Wallarm, isteklerin gönderildiği URL'yi veya diğer parametreleri kullanabilir.

## İstek Parçalarını Tanımlama ve Ayrıştırma

HTTP isteğinin en üst seviyesinden başlayarak, filtreleme düğümü her bir parçaya uygun ayrıştırıcıları sıralı olarak uygulamaya çalışır. Uygulanan ayrıştırıcıların listesi, verinin doğası ve sistemin önceki eğitiminin sonuçlarına bağlıdır.

Ayrıştırıcıların çıktısı, benzer şekilde analiz edilmesi gereken ek bir parametre kümesi olur. Ayrıştırıcı çıktısı bazen JSON, dizi veya ilişkisel dizi gibi karmaşık bir yapıya dönüşür.

!!! info "Ayrıştırıcı Etiketleri"
    Her ayrıştırıcının bir kimliği (etiketi) vardır. Örneğin, istek başlıklarının ayrıştırıcısı için `header`. İstek analizi sırasında kullanılan etiket seti, Wallarm Konsolu'ndaki olay detayları içerisinde görüntülenir. Bu veri, tespit edilen saldırıyla birlikte istek parçasını ve kullanılan ayrıştırıcıları gösterir.

    Örneğin, bir saldırı `SOAPACTION` başlığında tespit edildiyse:

    ![Etiket örneği](../../images/user-guides/rules/tags-example.png)

### URL

Her HTTP isteği bir URL içerir. Saldırıları bulmak için filtreleme düğümü, hem orijinal değeri hem de tekil bileşenlerini analiz eder: **path**, **action_name**, **action_ext**, **query**.

URL ayrıştırıcısına aşağıdaki etiketler karşılık gelir:

* **uri**, alan adı olmadan orijinal URL değeri için (örneğin, `http://example.com/blogs/123/index.php?q=aaa` adresine gönderilen istek için `/blogs/123/index.php?q=aaa`).
* **path**, URL parçalarını `/` sembolü ile ayıran bir dizi için (son URL parçası bu diziye dahil edilmez). URL'de yalnızca bir parça varsa, dizi boş olacaktır.
* **action_name**, `/` sembolünden sonra ve ilk nokta (`.`) öncesi olan URL'nin son parçası için. Bu URL parçası, değeri boş bir dize bile olsa, her zaman istekte bulunur.
* **action_ext**, son noktadan (`.`) sonra olan URL parçası için. İstekte eksik olabilir.

    !!! warning "**action_name** ile **action_ext** arasındaki sınır, birden fazla nokta olduğunda"
        `/` sembolünden sonraki URL'nin son parçasında birden fazla nokta (`.`) varsa, **action_name** ve **action_ext** arasındaki sınırda sorunlar olabilir, örneğin:

        * Sınır, **ilk** noktaya göre belirlenebilir, örneğin:

            `/modern/static/js/cb-common.ffc63abe.chunk.js.map` →

            * ...
            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe.chunk.js.map`

        * Ayrıştırma sonrası bazı öğeler eksik olabilir, yukarıdaki örnekte bu, şu şekilde olabilir:

            * `action_name` — `cb-common`
            * `action_ext` — `ffc63abe`
        
        Bu sorunu çözmek için, URI yapıcısının [gelişmiş düzenleme formu](rules.md#advanced-edit-form)nda **action_name** ve **action_ext** noktalarını manuel olarak düzenleyin.

* `?` sembolünden sonraki [sorgu dizesi parametreleri](#query-string-parameters) için **query**.

Örnek:

`/blogs/123/index.php?q=aaa`

* `[uri]` — `/blogs/123/index.php?q=aaa`
* `[path, 0]` — `blogs`
* `[path, 1]` — `123`
* `[action_name]` — `index`
* `[action_ext]` — `php`
* `[query, 'q']` — `aaa`

### Sorgu Dizesi Parametreleri

Sorgu dizesi parametreleri, `key=value` formatında `?` karakterinden sonra istek URL'sine uygulamaya geçirilir. **query** etiketi, ayrıştırıcıya karşılık gelir.

İstek örneği | Sorgu dizesi parametreleri ve değerleri
---- | -----
`/?q=some+text&check=yes` | <ul><li>`[query, 'q']` — `some text`</li><li>`[query, 'check']` — `yes`</li></ul>
`/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb` | <ul><li>`[query, 'p1', hash, 'x']` — `1`</li><li>`[query, 'p1', hash, 'y']` — `2`</li><li>`[query, 'p2', array, 0]` — `aaa`</li><li>`[query, 'p2', array, 1]` — `bbb`</li></ul>
`/?p3=1&p3=2` | <ul><li>`[query, 'p3', array, 0]` — `1`</li><li>`[query, 'p3', array, 1]` — `2`</li><li>`[query, 'p3', pollution]` — `1,2`</li></ul>

### İstek Kaynağının IP Adresi

Bir istek kaynağının IP adresi için istek noktası, Wallarm kurallarında `remote_addr` olarak geçer. Bu nokta, yalnızca [**Rate limit**](rate-limiting.md) kuralında IP'ler için istekleri sınırlamak amacıyla kullanılır.

### Başlıklar

Başlıklar, HTTP isteğinde ve bazı diğer formatlarda (örn. **multipart**) sunulur. **header** etiketi, ayrıştırıcıya karşılık gelir. Başlık adları her zaman büyük harflere dönüştürülür.

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

### Meta veri

Aşağıdaki etiketler, HTTP istek meta verisi için ayrıştırıcıya karşılık gelir:

* **post** HTTP istek gövdesi için
* **method** HTTP istek yöntemi için: `GET`, `POST`, `PUT`, `DELETE`
* **proto** HTTP protokol sürümü için
* **scheme**: http/https
* **application** uygulama ID'si için

### Ek Ayrıştırıcılar

Karmaşık istek parçaları, ek ayrıştırma gerektirebilir (örneğin, veri Base64 ile kodlanmışsa veya dizi formatında sunulmuşsa). Bu durumlarda, aşağıda listelenen ayrıştırıcılar, istek parçalarına ek olarak uygulanır.

#### base64

Base64 ile kodlanmış veriyi çözer ve herhangi bir istek parçasına uygulanabilir.

#### gzip

GZIP ile kodlanmış veriyi çözer ve herhangi bir istek parçasına uygulanabilir.

#### htmljs

HTML ve JS sembollerini metin formatına dönüştürür ve herhangi bir istek parçasına uygulanabilir.

Örnek: `&#x22;&#97;&#97;&#97;&#x22;` ifadesi `"aaa"` olarak dönüştürülür.

#### json_doc

JSON formatındaki veriyi ayrıştırır ve herhangi bir istek parçasına uygulanabilir.

Filtreler:

* Dizi elemanının değeri için **json_array** veya **array**
* İlişkisel dizi anahtarının (`key:value`) değeri için **json_obj** veya **hash**

Örnek:

```
{"p1":"value","p2":["v1","v2"],"p3":{"somekey":"somevalue"}}
```

* `[..., json_doc, hash, 'p1']` — `value`
* `[..., json_doc, hash, 'p2', array, 0]` — `v1`
* `[..., json_doc, hash, 'p2', array, 1]` — `v2`
* `[..., json_doc, hash, 'p3', hash, 'somekey']` — `somevalue`

#### xml

XML formatındaki veriyi ayrıştırır ve herhangi bir istek parçasına uygulanabilir.

Filtreler:

* XML belgesinin gövdesindeki yorumlar için bir dizi **xml_comment**
* Kullanılan harici DTD şemasının adresi için **xml_dtd**
* Entity DTD belgesinde tanımlanan bir dizi için **xml_dtd_entity**
* İşlem talimatlarının bir dizisi için **xml_pi**
* İlişkisel dizi etiketleri için **xml_tag** veya **hash**
* Etiket değerlerinin bir dizisi için **xml_tag_array** veya **array**
* Niteliklerin ilişkisel bir dizisini sadece **xml_attr**; **xml_tag** filtreden sonra sadece kullanılabilir

XML ayrıştırıcısı, etiketin içeriği ve etiket için değerlerin dizisinin ilk öğesi arasındaki farkı belirleyemez. Yani, `[..., xml, xml_tag, 't1']` ve `[..., xml, xml_tag, 't1', array, 0]` parametreleri aynıdır ve birbiriyle değiştirilebilir.

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
 
* `[..., xml, xml_dtd_entity, 0]` — isim = `xxe`, değer = `aaaa`
* `[..., xml, xml_pi, 0]` — isim = `xml-stylesheet`, değer = `type="text/xsl" href="style.xsl"`
* `[..., xml, xml_comment, 0]` — ` test `
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodName']` — `aaaa`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs']` — `123`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', xml_attr, 'check']` — `true`
* `[..., xml, xml_tag, 'methodCall', xml_tag, 'methodArgs', array, 1]` — `234`

#### array

Veri dizisini ayrıştırır. Herhangi bir istek parçasına uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p2', array, 0]` — `aaa`
* `[query, 'p2', array, 1]` — `bbb`

#### hash

İlişkisel veri dizisini (`key:value`) ayrıştırır ve herhangi bir istek parçasına uygulanabilir.

Örnek:

```
/?p1[x]=1&p1[y]=2&p2[]=aaa&p2[]=bbb
```

* `[query, 'p1', hash, 'x']` — `1`
* `[query, 'p1', hash, 'y']` — `2`

#### pollution

Aynı isme sahip parametrelerin değerlerini birleştirir ve herhangi bir istek parçasına, ilk veya çözülmüş formatta uygulanabilir.

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

* `[header, 'COOKIE', cookie, 'a']` = `1`;
* `[header, 'COOKIE', cookie, 'b']` = `2`.

#### form_urlencoded

İstek gövdesini `application/x-www-form-urlencoded` formatında geçirir ve yalnızca istek gövdesine uygulanabilir.

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

#### grpc <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;height: 21px;margin-bottom: -4px;"></a>

gRPC API isteklerini ayrıştırır ve yalnızca istek gövdesine uygulanabilir.

Protocol Buffers verisi için **protobuf** filtreyi destekler.

#### multipart

İstek gövdesini `multipart` formatında geçirir ve yalnızca istek gövdesine uygulanabilir.

İstek gövdesindeki başlıklar için **header** filtreyı destekler.

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

`Content-Disposition` başlığında bir dosya adı belirtilmişse, bu parametrede bir dosya yüklendiği düşünülür. Parametre şu şekilde görünür:

* `[post, multipart, 'someparam', file]` — dosya içeriği

#### viewstate

Oturum durumunu analiz etmek için tasarlanmıştır. Bu teknoloji, Microsoft ASP.NET tarafından kullanılır ve yalnızca istek gövdesine uygulanabilir.

Filtreler:

* Bir dizi için **viewstate_array**
* Bir dizi için **viewstate_pair**
* Bir dizi için **viewstate_triplet**
* İlişkisel bir dizi için **viewstate_dict**
* Bir dizi için **viewstate_dict_key**
* Bir dizi için **viewstate_dict_value**
* İlişkisel bir dizi için **viewstate_sparse_array**

#### jwt

JWT tokenlerini ayrıştırır ve herhangi bir istek parçasına uygulanabilir.

JWT ayrıştırıcısı, tespit edilen JWT yapısına göre sonucu aşağıdaki parametrelerde döndürür:

* `jwt_prefix`: desteklenen JWT değeri ön eklerinden biri - lsapi2, mobapp2, taşıyıcı. Ayrıştırıcı ön ek değerini herhangi bir kayıtta okur.
* `jwt_header`: JWT başlığı. Değeri aldıktan sonra, Wallarm genellikle bunu [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarına da uygular.
* `jwt_payload`: JWT yükü. Değeri aldıktan sonra, Wallarm genellikle bunu [`base64`](#base64) ve [`json_doc`](#json_doc) ayrıştırıcılarına da uygular.

JWT'ler herhangi bir istek parçasında geçebilir. Yani, Wallarm `jwt` ayrıştırıcısını uygulamadan önce özel istek parçası ayrıştırıcısını kullanır, örneğin [`query`](#query-string-parameters) veya [`header`](#headers).

Authentication başlığında geçen JWT'nin örneği:

```bash
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

* `[header, AUTHENTICATION, jwt, 'jwt_prefix']` — `Bearer`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'alg']` — `HS256`
* `[header, AUTHENTICATION, jwt, 'jwt_header', base64,  json_doc, hash, 'typ']` — `JWT`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'sub']` — `1234567890`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'name']` — `John Doe`
* `[header, AUTHENTICATION, jwt, 'jwt_payload', base64,  json_doc, hash, 'iat']` — `1516239022`

Uygulanacak [kural](rules.md)ı tanımlarken bir istek öğesi:

* İlk olarak JWT içeren bir istek parçasının ayrıştırıcısını seçin
* `jwt` ayrıştırıcısının değeri olarak listelenen `jwt_*` parametrelerinden birini belirtin, örneğin, `name` JWT yük parametresinin değeri için:

![JWT param desc in a rule](../../images/user-guides/rules/request-element-desc.png)

### Normlar

Normlar, dizi ve anahtar veri türleri için ayrıştırıcılara uygulanır. Normlar, veri analizinin sınırlarını belirlemek için kullanılır. Normun değeri, ayrıştırıcı etiketinde belirtilir. Örneğin: **hash_all**, **hash_name**.

Norm belirtilmemişse, işlenmesi gereken varlığın tanımlayıcısı ayrıştırıcıya geçirilir. Örneğin: JSON nesnesinin adı veya başka bir tanımlayıcı **hash** kelimesinden sonra girilir.

#### all

Tüm öğelerin, parametrelerin veya nesnelerin değerlerini almak için kullanılır. Örneğin:

* URL yolu için **path_all**
* Tüm sorgu dizi parametre değerleri için **query_all**
* Tüm başlık değerleriiçin **header_all**
* Tüm dizi öğesi değerleri için **array_all**
* Tüm JSON nesnesi veya XML nitelik değerleri için **hash_all**
* Tüm JWT değerleri için **jwt_all**

#### name

Tüm öğelerin, parametrelerin veya nesnelerin adlarını almak için kullanılır. Örneğin:

* Tüm sorgu dizi parametre isimleri için **query_name**
* Tüm başlık isimleri için **header_name**
* Tüm JSON nesnesi veya XML nitelik isimleri için **hash_name**
* Tüm JWT'lerle parametre isimleri için **jwt_name**