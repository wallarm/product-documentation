* “Stop on first fail” onay kutusu, test çalışması sırasında ilk güvenlik açığı tespit edildikten sonra çalışmanın durdurulup durdurulmayacağını belirler.
* “Skip duplicated baselines” onay kutusu, daha önce alınan temel isteklerin kopyalarının göz ardı edilip edilmeyeceğini tanımlar. FAST node, bu test çalışmasında daha önce alınan temel istekle aynı temel isteği alırsa, bu temel isteğe dayanarak herhangi bir test isteği oluşturulmaz ve FAST node konsolu aşağıdaki mesajı yazdırır: `[info] The baseline #8921 is duplicated and already was processed`.
* “Skip following files extensions” onay kutusu, test sırasında değerlendirme sürecine belirli dosya türlerinin dahil edilip edilmeyeceğini belirler. Bu dosya türleri, düzenli ifade ile belirtilmiştir.
  
    Örneğin, `ico` dosya uzantısını hariç tutacak şekilde ayarlarsanız, `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.
    
    Düzenli ifade aşağıdaki, birbirini dışlayan ifadelerden birini içerebilir:
    
    * `.`: herhangi bir karakterin herhangi bir sayıda
    * `x*`: `x` karakterinden herhangi bir sayıda
    * `x?`: tek bir `x` karakteri (ya da hiç `x` karakteri olmaması)
    * herhangi bir tek dosya uzantısı (örneğin, `jpg`)
    * “|” veya “,” karakteri ile ayrılmış birkaç uzantı (örneğin, `jpg | png` veya `jpg, png`)
    
    Eğer bir düzenli ifade belirtilmemişse, FAST herhangi bir dosya uzantısına sahip temel istekleri kontrol edecektir.
* “RPS per test run” kaydırıcısı, test çalışması için saniyedeki istek limitini tanımlar. Bu ayar `1` ile `1000` arasında değer alabilir. Varsayılan değer `1000`'dir.
* “RPS per baseline” kaydırıcısı, bir temel istek için saniyedeki istek limitini tanımlar. Bu ayar `1` ile `500` arasında değer alabilir. Varsayılan değer `500`'dür.
* “Stop baseline recording after” kaydırıcısı, test çalışması zaman sınırını tanımlar. Bu ayar `5 min` (5 dakika)'dan `1 day` (24 saat)'e kadar değer alabilir. Varsayılan değer `30 min` (30 dakika)'dır.