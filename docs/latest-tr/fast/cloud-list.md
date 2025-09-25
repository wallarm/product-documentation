#   Wallarm Bulutları Listesi

FAST'in çalışması iki buluta dayanır. Bu bulutlar coğrafi konuma göre ayrılmıştır. Şunlardır:
* Amerikan bulutu (diğer adıyla *US cloud*).
* Avrupa bulutu (diğer adıyla *EU cloud*).

Çalışması sırasında FAST, bulutlardan birinde bulunan Wallarm portalı ve API sunucusuyla etkileşim kurar:
* US bulutu:
    * Wallarm portalı: <https://us1.my.wallarm.com>
    * Wallarm API sunucusu: `us1.api.wallarm.com`
* EU bulutu:
    * Wallarm portalı: <https://my.wallarm.com>
    * Wallarm API sunucusu: `api.wallarm.com`

!!! warning "Lütfen dikkat edin"
    **Wallarm bulutlarıyla etkileşim kurma kuralları:**
        
    Yalnızca aynı bulutta bulunan Wallarm portalı ve API sunucusuyla etkileşim kurabilirsiniz.
        
    **Wallarm bulutları ve FAST dokümantasyonu:** 

    * Basitlik adına, dokümantasyonun tamamında FAST'in Amerikan Wallarm bulutuyla etkileşim kurduğu varsayılmaktadır.
    * Aksi belirtilmedikçe, dokümantasyondaki tüm bilgiler mevcut tüm bulutlar için eşit şekilde geçerlidir.   
    * Avrupa bulutuyla etkileşim kuruyorsanız, FAST ve dokümantasyonla çalışırken Wallarm portalı ve API sunucusunun ilgili adreslerini kullanın.