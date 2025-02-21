[doc-inactivity-timeout]:           internals.md#test-run

| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetkilendirme: | Gerekli | Yetkilendirme, token aracılığıyla sağlanır |
| Token içeren HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `name` **(gerekli)** | Test çalıştırmasının adı |
|  | `test_record_id` **(gerekli)** | Mevcut bir test kaydının tanımlayıcısı |
|  | `desc` | Test çalıştırmasının ayrıntılı açıklaması.<br>Varsayılan değer: boş string |
|  | `file_extensions_to_exclude` | Bu parametre, test sırasında değerlendirme sürecinden hariç tutulması gereken belirli dosya tiplerinin belirtilmesine olanak tanır. Bu dosya tipleri, düzenli ifade (regex) ile belirtilir.<br>Örneğin, hariç tutulacak `ico` dosya uzantısını ayarlarsanız, `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.<br>Düzenli ifadenin formatı şöyledir:<br>- `.`: herhangi bir karakterin herhangi bir sayıda (sıfır veya daha fazla) bulunması<br>- `x*`: `x` karakterinin herhangi bir sayıda (sıfır veya daha fazla) bulunması<br>- `x?`: tek `x` karakteri (veya hiç olmaması)<br>- herhangi bir tek dosya uzantısı (örneğin, `jpg`)<br>- dikey çizgi ile ayrılmış birkaç uzantı (örneğin, `jpg` &#124; `png`)<br>Varsayılan değer: boş string (FAST, herhangi bir dosya uzantısına sahip temel istekleri kontrol eder). | 
|  | `policy_id` | Test politikasının tanımlayıcısı.<br>Bu parametre eksikse, varsayılan politika devreye girer |
|  | `stop_on_first_fail` | Bu parametre, bir güvenlik açığı tespit edildiğinde FAST’in davranışını belirtir:<br>`true`: tespit edilen ilk güvenlik açığında test çalıştırmasını durdurur.<br>`false`: herhangi bir güvenlik açığı tespit edilip edilmediğine bakılmaksızın tüm temel istekleri işler.<br>Varsayılan değer: `false` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek test isteklerinin (*RPS*, saniyede istek) sayısında sınırlama getirir (örneğin, tek bir temel istekten türetilmiş 100 test isteği olabilir).<br>Sınırlama, test çalıştırması içinde bireysel temel istek başına belirlenir (tek bir temel istek için saniyede `N`'den fazla test isteği gönderilmez).<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre, yukarıda açıklananla benzerdir, ancak RPS’i yalnızca tek bir temel istek için değil, tüm test çalıştırması genelinde sınırlar.<br>Yani, test çalıştırması sırasında kaydedilen temel istek sayısı ne olursa olsun, saniyede gönderilen toplam test isteği sayısı belirtilen değeri aşmamalıdır.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |

**Örnek bir istek:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
    "name":"demo-testrun",
    "test_record_id":"rec_0001"
}'
```

**Örnek bir yanıt: test çalıştırması kopyalanıyor**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "cloning",
    ...
    "test_record_id": "rec_0001",
    ...
}
```

"cloning" durumu, temel isteklerin orijinal test çalıştırmasından kopyaya (kimliği `tr_1234` olan test çalıştırması) klonlandığı anlamına gelir.  

**Örnek bir yanıt: test çalıştırması kopyalanamadı**

```
{
  "status": 400,
  "body": {
    "test_record_id": {
      "error": "not_ready_for_cloning",
      "value": "rec_0001"
    }
  }
}
```

"not_ready_for_cloning" hatası, orijinal test çalıştırmasında kaydetme sürecinin devam etmesi nedeniyle temel isteklerin orijinal test çalıştırmasından kopyaya klonlanmasının mümkün olmadığını belirtir (bu, `rec_0001` tanımlayıcılı test kaydını içerir).