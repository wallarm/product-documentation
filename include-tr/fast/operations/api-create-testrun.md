| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetkilendirme: | Gerekli | Token ile |
| Token içeren HTTP üstbilgisi: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `name` **(gerekli)** | Test çalıştırmasının adı |
|  | `test_record_name` | Test kaydının adı. Tüm baseline istekleri bu test kaydına yerleştirilecektir.<br>Varsayılan değer: test çalıştırmasının adı. |
|  | `desc` | Test çalıştırmasının ayrıntılı açıklaması.<br>Varsayılan değer: boş dize |
|  | `file_extensions_to_exclude` | Bu parametre, test sırasında değerlendirme sürecinden hariç tutulması gereken belirli dosya türlerinin belirtilmesine olanak tanır. Bu dosya türleri düzenli ifade ile belirtilir.<br>Örneğin, hariç tutulacak dosya uzantısı olarak `ico` ayarlanırsa, `GET /favicon.ico` baseline isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.<br>Düzenli ifade aşağıdaki formata sahiptir:<br>- `.`: herhangi bir karakterin herhangi bir sayıda (sıfır veya daha fazla)<br>- `x*`: `x` karakterinin herhangi bir sayıda (sıfır veya daha fazla)<br>- `x?`: tek bir `x` karakteri (ya da hiç)<br>- herhangi tek bir dosya uzantısı (ör. `jpg`)<br>- dikey çizgi ile ayrılmış birkaç uzantı (ör. `jpg` &#124; `png`)<br>Varsayılan değer: boş dize (FAST, herhangi bir dosya uzantısına sahip baseline isteklerini kontrol eder). |
|  | `policy_id` | Test politikasının tanımlayıcısı.<br>Parametre yoksa, varsayılan politika devreye girer |
|  | `stop_on_first_fail` | Bu parametre, bir güvenlik açığı tespit edildiğinde FAST’ın davranışını belirtir:<br>`true`: ilk tespit edilen güvenlik açığında test çalıştırmasının yürütülmesini durdur.<br>`false`: herhangi bir güvenlik açığı tespit edilip edilmediğine bakılmaksızın tüm baseline isteklerini işle.<br>Varsayılan değer: `false` |
|  | `skip_duplicated_baselines` | Bu parametre, yinelenen bir baseline isteğiyle karşılaşıldığında FAST’ın davranışını belirtir:<br>`true`: yinelenen baseline isteklerini atla (birkaç özdeş baseline isteği varsa, yalnızca ilk baseline isteği için test istekleri üretilir).<br>`false`: gelen her baseline isteği için test istekleri üretilir.<br>Varsayılan değer: `true` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek test isteklerinin sayısına ilişkin bir sınır belirtir (*RPS*, *saniye başına istek*) (ör. tek bir baseline isteğinden türetilmiş 100 test isteği olabilir).<br>Sınır, test çalıştırmasında baseline isteği başına belirlenir (tek bir baseline isteği için saniyede en fazla `N` test isteği gönderilir).<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre, yukarıda açıklanana benzer, ancak yalnızca tek bir baseline isteği için değil, test çalıştırması başına küresel olarak RPS’yi sınırlar.<br>Diğer bir deyişle, test çalıştırması sırasında kaç baseline isteği kaydedilmiş olursa olsun, saniye başına toplam test isteği sayısı belirtilen değeri aşmamalıdır.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `inactivity_timeout` | Bu parametre, FAST düğümünün yeni bir baseline isteğinin gelmesini beklediği süreyi saniye cinsinden belirtir.<br>Bu davranış ayrıntılı olarak [burada][doc-inactivity-timeout] açıklanmıştır.<br>Zaman aşımı, kaydedilen baseline istekleri için güvenlik testlerinin oluşturulması ve yürütülmesi süreçlerini etkilemez.<br>Minimum değer: `300` (300 saniye veya 5 dakika).<br>Maksimum değer: `86400` (86400 saniye veya 1 gün).<br>Varsayılan değer: `1800` (1800 saniye veya 30 dakika) |

**İstek örneği:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
	"name":"demo-testrun"
}'
```

**Yanıt örneği:**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "running",
    ...
}
```