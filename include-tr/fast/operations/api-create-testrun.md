| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetkilendirme: | Gerekli | Token ile |
| Token içeren HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna iletmek için kullanılır |
| Parametreler: | `name` **(gerekli)** | Test çalışmasının adı |
|  | `test_record_name` | Test kaydı adı. Tüm temel istekler bu test kaydına yerleştirilecektir.<br>Varsayılan değer: test çalışmasının adı. |
|  | `desc` | Test çalışmasının detaylı açıklaması.<br>Varsayılan değer: boş string |
|  | `file_extensions_to_exclude` | Bu parametre, test sırasında değerlendirme sürecinden hariç tutulması gereken belirli dosya türlerini belirtmenizi sağlar. Bu dosya türleri düzenli ifade kullanılarak belirtilir.<br>Örneğin, eğer `ico` dosya uzantısının hariç tutulmasını ayarlarsanız, o zaman `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmez ve atlanır.<br>Düzenli ifadenin formatı şöyledir:<br>- `.`: herhangi bir karakterin (sıfır veya daha fazla) herhangi bir sayısı<br>- `x*`: `x` karakterinden sıfır veya daha fazla adet<br>- `x?`: tek bir `x` karakteri (veya hiçbiri)<br>- herhangi tek bir dosya uzantısı (ör. `jpg`)<br>- dikey çubukla ayrılmış birkaç uzantı (ör. `jpg` &#124; `png`)<br>Varsayılan değer: boş string (FAST, temel istekleri herhangi bir dosya uzantısıyla kontrol eder). |
|  | `policy_id` | Test politikasının tanımlayıcısı.<br>Eğer parametre eksikse, varsayılan politika devreye girer |
|  | `stop_on_first_fail` | Bu parametre, FAST’in bir güvenlik açığı tespit edildiğinde gösterdiği davranışı belirtir:<br>`true`: tespit edilen ilk güvenlik açığında test çalışmasının yürütülmesi durdurulur.<br>`false`: herhangi bir güvenlik açığı tespit edilse de temel isteklerin tamamı işlenir.<br>Varsayılan değer: `false` |
|  | `skip_duplicated_baselines` | Bu parametre, aynı olan temel isteklerle karşılaşıldığında FAST’in gösterdiği davranışı belirtir:<br>`true`: aynı olan temel istekler atlanır (birkaç aynı temel istek varsa, test istekleri yalnızca ilk temel istek için oluşturulur).<br>`false`: gelen her temel istek için test istekleri oluşturulur.<br>Varsayılan değer: `true` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek test isteklerinin sayısına (*RPS*, saniyedeki istek sayısı) bir sınır getirilmesini sağlar (örneğin, tek bir temel isteğe bağlı 100 test isteği oluşturulabilir).<br>Sınır, temel istek başına belirlenir (bireysel bir temel istek için saniyede `N`'den fazla test isteği gönderilmez) test çalışmasında.<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre yukarıda açıklananla benzerdir, ancak temel istekle sınırlı kalmadan test çalışması başına global olarak RPS sınırı getirir.<br>Özetle, test çalışması sırasında kaç temel istek kaydedilmiş olursa olsun, saniyedeki toplam test isteği sayısı belirtilen değeri geçmemelidir.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `inactivity_timeout` | Bu parametre, FAST düğümünün yeni bir temel isteğin gelmesini beklediği saniye cinsinden zaman aralığını belirtir.<br>Bu davranışın detayları [here][doc-inactivity-timeout] açıklanmıştır.<br>Timeout, kaydedilmiş temel istekler için güvenlik testlerinin oluşturulması ve yürütülmesi süreçleri üzerinde etkili değildir.<br>Minimum değer: `300` (300 saniye veya 5 dakika).<br>Maksimum değer: `86400` (86400 saniye veya 1 gün).<br>Varsayılan değer: `1800` (1800 saniye veya 30 dakika) |

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

**Bir cevabın örneği:**

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