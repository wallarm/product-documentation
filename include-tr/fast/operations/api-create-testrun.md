| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetkilendirme: | Gerekli | Token ile |
| Token ile HTTP başlığı: | `X-WallarmAPI-Token` |  Token’in değerini API sunucusuna geçirmek için kullanılır |
| Parametreler: | `name` **(zorunlu)** | Test dizisinin adı |
|  | `test_record_name` | Test kayıt adı. Tüm temel istekler bu test kaydına yerleştirilecektir.<br>Varsayılan değer: test dizisinin adı. |
|  | `desc` | Testin detaylı açıklaması.<br>Varsayılan değer: boş dize |
|  | `file_extensions_to_exclude` | Bu parametre, test sırasında değerlendirme sürecinden hariç tutulması gereken belirli dosya türlerinin belirlenmesine olanak sağlar. Bu dosya türleri, düzenli ifade tarafından belirlenir.<br>Örneğin, `ico` dosya uzantısını hariç tutmak için ayarladığınızda, `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.<br>Düzenli ifadenin aşağıdaki formatı vardır:<br>- `.`: herhangi bir sayıda (sıfır veya daha fazla) herhangi bir karakter<br>- `x*`: herhangi bir sayıda (sıfır veya daha fazla) `x` karakteri<br>- `x?`: tek `x` karakteri (veya hiçbiri)<br>- herhangi bir tek dosya uzantısı (örneğin, `jpg`)<br>- dikey çubukla ayrılmış birkaç uzantı (örneğin, `jpg` &#124; `png`)<br>Varsayılan değer: boş dize (FAST, herhangi bir dosya uzantısına sahip temel istekleri kontrol eder). |
|  | `policy_id` | Test politikasının belirleyicisi.<br>Eğer parametre eksikse, o zaman varsayılan politika etkinleştirilir |
|  | `stop_on_first_fail` | Bu parametre, bir güvenlik açığı tespit edildiğinde FAST'ın davranışını belirtir:<br>`true`: ilk tespit edilen güvenlik açığından sonra test dizisinin uygulanmasını durdurun.<br>`false`: herhangi bir güvenlik açığı tespit edilmiş olsun veya olmasın, tüm temel istekleri işleme alınır.<br>Varsayılan değer: `false` |
|  | `skip_duplicated_baselines` | Bu parametre, çoğaltılmış bir temel istekle karşılaşıldığında FAST'ın davranışını belirtir:<br>`true`: çoğaltılmış temel istekleri atla (eğer birkaç aynı temel istek varsa, o zaman test istekleri sadece ilk temel istek için oluşturulur).<br>`false`: her gelen temel istek için test istekleri oluşturulur.<br>Varsayılan değer: `true` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek test isteklerinin sayıda bir sınırla belirtir (*RPS*, *saniyedeki istekler*) (örneğin, tek bir temel istekten 100 test isteği türetilebilir).<br>Sınır, her bir temel istek için (test sırasında bir temel istek için fazla `N` test isteği gönderilmez) belirlenir.<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre, yukarıda açıklanan parametreye benzer, fakat yalnızca tek bir temel istek yerine, test dizinine göre küresel olarak RPS'yi sınırlar.<br>Başka bir deyişle, test sırası boyunca test isteklerinin toplam sayısı, test sırasında kaydedilen temel isteklerin sayısı ne olursa olsun belirtilen değeri aşmamalıdır.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `inactivity_timeout` | Bu parametre, FAST düğümünün yeni bir temel isteğin gelmesini beklemek için beklediği saniye cinsinden zaman aralığını belirtir.<br>Bu davranış, [burada][doc-inactivity-timeout] detaylı olarak açıklanmıştır.<br>Zaman aşımının, kaydedilmiş olan temel istekler için güvenlik testlerinin oluşturulması ve uygulanması süreci üzerinde bir etkisi yoktur.<br>Minimum değer: `300` (300 saniye veya 5 dakika).<br>Maksimum değer: `86400` (86400 saniye veya 1 gün).<br>Varsayılan değer: `1800` (1800 saniye veya 30 dakika) |

**Bir isteğin örneği:**

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

**Bir yanıtın örneği:**

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