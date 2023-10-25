* "İlk hatada dur" seçeneği, ilk zafiyet bulunduktan sonra testin durdurulup durdurulmayacağını belirler.
* "Yinelenen temel çizgileri atla" seçeneği, daha önce alınan temel isteklerin yinelenmesinin yoksayılıp yoksayılmayacağını belirler. Eğer FAST düğümü, bu test çalıştırması sırasında daha önce alınanla aynı temel isteği alırsa, bu isteğe dayanarak test istekleri oluşturulmaz ve FAST düğüm konsolu aşağıdaki mesajı yazdırır: `[info] The baseline #8921 is duplicated and already was processed`.
* "Aşağıdaki dosya uzantılarını atla" seçeneği, belirli dosya türlerinin test sırasında değerlendirme sürecinden çıkarılıp çıkarılmayacağını belirler. Bu dosya türleri düzenli ifade ile belirlenir.
    
    Örneğin, `ico` dosya uzantısının hariç tutulmasını seçerseniz, `GET /favicon.ico` temel isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.
        
    Düzenli ifade, aşağıdakilerden birini içerebilir:
    
    * `.`: herhangi bir karakterin herhangi bir sayısı
    * `x*`: `x` karakterinin herhangi bir sayısı
    * `x?`: tek bir `x` karakteri (veya hiç `x` karakteri)
    * herhangi tek bir dosya uzantısı (örneğin, `jpg`)
    * birkaç uzantı, "|" veya "," karakteri ile ayrılmış (örneğin, `jpg | png` veya `jpg, png`)
        
    Düzenli ifade belirtilmezse, FAST her dosya uzantısına sahip temel istekleri kontrol edecektir.
    
* "Testteki RPS" kaydırıcısı, test çalışması için saniye başına istek sınırlamasını belirler. Bu ayar `1`'den `1000`'e kadar değer alabilir. Varsayılan değer `1000`'dir.
* "Her temel için RPS" kaydırıcısı, bir temel istek için saniye başına istek sınırlamasını belirler. Bu ayar `1`'den `500`'e kadar değer alabilir. Varsayılan değer `500`'dür.
* "Temel kaydı durdurma sonrası" kaydırıcısı, test çalıştırmasının zaman limitini belirler. Bu ayar `5 dk` (5 dakika)'dan `1 gün` (24 saat)'e kadar değer alabilir. Varsayılan değer `30 dk` (30 dakika)'dır.