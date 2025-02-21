# Wallarm Clouds List

FAST, çalışması için iki buluta dayanır. Bu bulutlar, coğrafi konumlarına göre ayrılmıştır. Bunlardır:
* American cloud (aka *US cloud*).
* European cloud (aka *EU cloud*).

Çalışması sırasında, FAST, bulutlardan birinde bulunan Wallarm portalı ve API sunucusu ile etkileşime girer:
* US cloud:
    * Wallarm portal: <https://us1.my.wallarm.com>
    * Wallarm API server: `us1.api.wallarm.com`
* EU cloud:
    * Wallarm portal: <https://my.wallarm.com>
    * Wallarm API server: `api.wallarm.com`

!!! warning "Lütfen dikkat edin"
    **Wallarm bulutları ile etkileşim kurma kuralları:**
        
    Yalnızca aynı bulutta bulunan bir Wallarm portalı ve API sunucusu ile etkileşime girebilirsiniz.
        
    **Wallarm bulutları ve FAST dokümantasyonu:** 

    * Sadelik adına, dokümantasyon boyunca FAST'ın Amerikan Wallarm bulutu ile etkileşime girdiği varsayılmıştır.
    * Dokümantasyondaki tüm bilgiler, aksi belirtilmedikçe mevcut olan tüm bulutlar için eşit derecede geçerlidir.
    * Eğer Avrupa bulutu ile etkileşime geçiyorsanız, FAST ile çalışırken ve dokümantasyonla birlikte Wallarm portalı ve API sunucusunun ilgili adreslerini kullanın.