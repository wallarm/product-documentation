#   Wallarm Bulut Listesi

FAST işleyişi için iki buluta güvenir. Bu bulutlar coğrafi konuma göre ayrılmıştır. Bunlar:
* Amerikan bulutu (veya *ABD bulutu*).
* Avrupa bulutu (veya *AB bulutu*).

İşlem sırasında, FAST bir bulutta bulunan Wallarm portalı ve API sunucusuyla etkileşime girer:
* ABD bulutu:
    * Wallarm portalı: <https://us1.my.wallarm.com>
    * Wallarm API sunucusu: `us1.api.wallarm.com`
* AB bulutu:
    * Wallarm portalı: <https://my.wallarm.com>
    * Wallarm API sunucusu: `api.wallarm.com`

!!! uyarı "Lütfen, dikkat edin"
    **Wallarm bulutları ile etkileşimin kuralları:**
        
    Yalnızca aynı bulutta bulunan bir Wallarm portalı ve API sunucusu ile etkileşime girebilirsiniz.
        
    **Wallarm bulutları ve FAST belgeleri:** 

    * Basitlik adına, belgeler boyunca FAST'ın Amerikan Wallarm bulutu ile etkileşime girdiği varsayılır.
    * Belgelerdeki tüm bilgiler, aksi belirtilmediği sürece tüm mevcut bulutlara eşit şekilde uygulanabilir.   
    * Avrupa bulutu ile etkileşime giriyorsanız, FAST ve belgelerle çalışırken Wallarm portalının ve API sunucusunun ilgili adreslerini kullanın.