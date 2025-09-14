    * “Stop on first fail” onay kutusu, ilk güvenlik açığı bulunduğunda test çalıştırmasının durdurulup durdurulmayacağını belirler.
    * “Skip duplicated baselines” onay kutusu, daha önce alınan baseline isteklerinin kopyalarının yok sayılıp sayılmayacağını belirler. FAST node daha önce bu test çalıştırmasında alınanla aynı baseline isteğini alırsa, bunun temelinde hiçbir test isteği oluşturulmaz ve FAST node konsolu şu mesajı yazdırır: `[info] The baseline #8921 is duplicated and already was processed`.
    * “Skip following files extensions” onay kutusu, test sırasında değerlendirme sürecinden belirli dosya türlerinin hariç tutulup tutulmayacağını belirler. Bu dosya türleri düzenli ifadeyle belirtilir.
    
        Örneğin, hariç tutulacak dosya uzantısını `ico` olarak ayarlarsanız, `GET /favicon.ico` baseline isteği FAST tarafından kontrol edilmeyecek ve atlanacaktır.
        
        Düzenli ifade aşağıdaki birbirini dışlayan ifadelerden birini içerebilir:
        
        * `.`: herhangi bir karakterin herhangi bir sayıda tekrarı
        * `x*`: `x` karakterinin herhangi sayıda tekrarı
        * `x?`: tek bir `x` karakteri (veya hiç `x` karakteri olmaması)
        * herhangi tek bir dosya uzantısı (örn. `jpg`)
        * birden fazla uzantı; “|” veya “,” karakteriyle ayrılmış (örn. `jpg | png` veya `jpg, png`)
        
        Bir düzenli ifade belirtilmezse, FAST tüm dosya uzantılarına sahip baseline isteklerini kontrol eder.
    
    * “RPS per test run” kaydırıcısı, test çalıştırması için saniye başına istek sınırını belirler. Bu ayar `1` ile `1000` arasında değer alabilir. Varsayılan değer `1000`.
    * “RPS per baseline” kaydırıcısı, tek bir baseline isteği için saniye başına istek sınırını belirler. Bu ayar `1` ile `500` arasında değer alabilir. Varsayılan değer `500`.
    * “Stop baseline recording after” kaydırıcısı, test çalıştırmasının süre sınırını belirler. Bu ayar `5 min` (5 dakika) ile `1 day` (24 saat) arasında değer alabilir. Varsayılan değer `30 min` (30 dakika).