[doc-inactivity-timeout]:           internals.md#test-run

| API çağrısı: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Yetki: | Gerekli | Yetki token ile sağlanır |
| Token ile HTTP başlığı: | `X-WallarmAPI-Token` | Token değerini API sunucusuna taşımak için kullanılır |
| Parametreler: | `name` **(Zorunlu)** | Test çalışmasının adı |
| | `test_record_id` **(Zorunlu)** | Varolan bir test kaydının identifikatörü |
|  | `desc` | Test çalışmasının ayrıntılı açıklaması.<br>Varsayılan değer: boş dize |
|  | `file_extensions_to_exclude` | Bu parametre belirli dosya türlerinin belirlenmiş düzenli ifadeye göre test sırasında değerlendirme sürecinden çıkarılabilmesine izin vermektedir.<br>Örneğin, `ico` dosya uzantısını hariç tutarsanız, `GET /favicon.ico` baz istek FAST tarafından kontrol edilmez ve atlanır.<br>Regular ifade aşağıdaki formatlara sahipti:<br>- `.`: herhangi (sıfır veya daha fazla) sayıda karakter<br>- `x*`: herhangi sayıda `x` karakteri<br>- `x?`: tek `x` karakteri (veya hiçbiri)<br>- herhangi bir tek dosya uzantısı (örneğin, `jpg`)<br>- dikey çizgi ile ayrılmış birkaç uzantı (örneğin, `jpg` &#124; `png`)<br>Default value: empty string (FAST will check baseline requests with any file extension). | 
|  | `policy_id` | Test politikasının identifikatörü.<br>Bu parametre eksikse, varsayılan politika etkin olur |
|  | `stop_on_first_fail` | Bu parametre, bir güvenlik açığı algılandığında FAST’ın davranışını belirler:<br>`true`: ilk tespit edilen zayıflıkta test çalışmasının gerçekleşmesini durdurur.<br>`false`: herhangi bir güvenlik açığı algılanmış olup olmamasına bakılmaksızın, tüm baz isteklerini işler.<br>Default value: `false` |
|  | `rps_per_baseline` | Bu parametre, hedef uygulamaya gönderilecek olan test isteklerinin (*RPS*, *saniyedeki istekler*) sayısının sınırını belirtir (örneğin, tek bir baz istektan 100 test isteği türetebilirsiniz).<br>Limit, test çalışması sırasında tek bir baz isteği başına belirlenir (tek bir baz istek için saniyede `N` den fazla test isteği gönderilmeyecektir).<br>Minimum değer: `1`.<br>Maksimum değer: `500`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |
|  | `rps` | Bu parametre, yukarıda açıklanan parametreye benzerdir ancak RPS sınırını test çalışması genelinde, yani tek bir baz istek için değil, belirler.<br>Diğer bir deyişle, toplam test isteği sayısı, saniyede kaç tane baz isteğinin kaydedildiğine bakılmaksızın belirlenen değeri aşmamalıdır.<br>Minimum değer: `1`.<br>Maksimum değer: `1000`.<br>Varsayılan değer: `null` (RPS sınırsızdır) |

**Bir istek örneği:**

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

**Bir yanıt örneği: test çalışmasını kopyalama devam ediyor**

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

`cloning` durumu, başlık isteklerinin orijinal test çalışmasından onun kopyasına ( `tr_1234` identifikatörüne sahip test çalışması) klonlandığı anlamına gelir.  

**Bir yanıt örneği: test çalışmasını kopyalama başarısız oldu**

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

`not_ready_for_cloning` hatası, orijinal test çalışmasında kayıt süreci hala aktif olduğundan ( `rec_0001` identifikatörüne sahip test kaydını dahil ederek) başlık isteklerinin orijinal test çalışmasından onun kopyasına klonlanmasının mümkün olmadığı anlamına gelir.