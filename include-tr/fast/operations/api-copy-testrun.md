[doc-inactivity-timeout]:           internals.md#test-run

| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetkilendirme: | Gerekli | Yetkilendirme token ile sağlanır |
| Token içeren HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `name` **(zorunlu)** | Test çalıştırmasının adı |
| | `test_record_id` **(zorunlu)** | Mevcut bir test kaydının tanımlayıcısı |
|  | `desc` | Test çalıştırmasının ayrıntılı açıklaması.<br>Varsayılan değer: boş dize |
|  | `file_extensions_to_exclude` | Bu parametre, test sırasında değerlendirme sürecinden hariç tutulması gereken belirli dosya türlerini belirtmenize olanak tanır. Bu dosya türleri, düzenli ifade ile belirtilir.<br>Örneğin, hariç tutulacak dosya uzantısı olarak `ico` ayarlanırsa, `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmez ve atlanır.<br>Düzenli ifadenin formatı aşağıdaki gibidir:<br>- `.`: herhangi bir karakterin herhangi bir sayıda (sıfır veya daha fazla)<br>- `x*`: `x` karakterinin herhangi bir sayıda (sıfır veya daha fazla)<br>- `x?`: tek bir `x` karakteri (ya da hiçbiri)<br>- herhangi tek bir dosya uzantısı (örn., `jpg`)<br>- dikey çizgi ile ayrılmış birden çok uzantı (örn., `jpg` &#124; `png`)<br>Varsayılan değer: boş dize (FAST, herhangi bir dosya uzantısına sahip temel istekleri kontrol eder). | 
|  | `policy_id` | Test politikasının tanımlayıcısı.<br>Bu parametre yoksa varsayılan politika devreye girer |
|  | `stop_on_first_fail` | Bu parametre, bir güvenlik açığı tespit edildiğinde FAST'in davranışını belirtir:<br>`true`: ilk tespit edilen güvenlik açığında test çalıştırmasının yürütmesini durdurur.<br>`false`: herhangi bir güvenlik açığı tespit edilip edilmediğine bakılmaksızın tüm temel istekleri işler.<br>Varsayılan değer: `false` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek test isteklerinin sayısı için bir sınır belirtir (*RPS*, *saniye başına istek*; örneğin tek bir temel istekten türetilmiş 100 test isteği olabilir).<br>Sınır, test çalıştırması içinde temel istek başına belirlenir (tek bir temel istek için saniyede `N` test isteğinden fazlası gönderilmeyecektir).<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre, yukarıda açıklananla benzerdir; ancak RPS'yi yalnızca tek bir temel istek için değil, test çalıştırması genelinde sınırlar.<br>Başka bir deyişle, saniye başına toplam test isteği sayısı, test çalıştırması sırasında kaç temel istek kaydedildiğinden bağımsız olarak belirtilen değeri aşmamalıdır.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |

**İstek örneği:**

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

**Yanıt örneği: test çalıştırmasının kopyalanması sürüyor**

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

`cloning` durumu, temel isteklerin özgün test çalıştırmasından kopyasına (tanımlayıcısı `tr_1234` olan test çalıştırmasına) kopyalanmakta olduğu anlamına gelir.  

**Yanıt örneği: test çalıştırmasının kopyalanması başarısız oldu**

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

`not_ready_for_cloning` hatası, özgün test çalıştırmasında kayıt işlemi etkin olduğu (tanımlayıcısı `rec_0001` olan test kaydını içeren) için temel isteklerin özgünden kopyasına kopyalanmasının mümkün olmadığını ifade eder.