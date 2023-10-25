3.6 sürümünden itibaren, Wallarm Konsolu'nda bulunan kuralı kullanarak `overlimit_res` saldırı tespitini ince ayar yapabilirsiniz.

Daha önce, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX direktifleri kullanıldı. Listelenen direktifler, yeni kural sürümü ile kullanımdan kaldırıldı ve gelecekteki sürümlerde silineceklerdir. 

`Overlimit_res` saldırı tespit ayarları listelenen direktifler aracılığıyla özelleştirilmişse, tavsiye edilen şey ayarları şu şekilde kurala aktarmaktır:

1. Wallarm Konsolu'nu açın → **Kurallar** ve [**Overlimit_res saldırı tespitini ince ayarla**][overlimit-res-rule-docs] kural kurulumuna devam edin.
1. Kuralları NGINX direktifleri aracılığıyla yapılandırın:

    * Kural koşulları, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` direktiflerini belirten NGINX yapılandırma bloğunu eşlemelidir.
    * Bir düğümün tek bir isteği işlemek için süre limiti (milisaniye): `wallarm_process_time_limit` değeri.
    * İstek işleme: **İşlemeyi durdur** seçeneği önerilir.
    
        !!! warning "Sistem belleğinin tükenme riski"
            Yüksek süre limiti ve/veya limit aşıldıktan sonra isteğin işlemeye devam etmesi, hafızanın tükenmesine ya da zamanında işleme alınamayan isteğe neden olabilir.
    
    * Overlimit_res saldırısını kaydedin: **Kaydet ve olaylarda göster** seçeneği önerilir.

        Eğer `wallarm_process_time_limit_block` veya `process_time_limit_block` değeri `off` ise, **Saldırı etkinliği oluşturma** seçeneğini seçin.
    
    * Kural, `wallarm_process_time_limit_block` direktifi için açık eşleyici bir seçeneğe sahip değildir. Kural **Kaydet ve olaylarda göster** seçeneğini belirlerse, düğüm [düğüm filtreleme modu][waf-mode-instr]na bağlı olarak `overlimit_res` saldırısı ya engeller ya da geçer:

        * **İzleme** modunda, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulamanın, işlenmiş ve işlenmemiş istek bölümlerinde yer alan saldırılardan yararlanma riski vardır.
        * **Güvenli engelleme** modunda, düğüm isteği [grilisteye][graylist-docs] eklenmiş IP adresinden geldiyse engeller. Aksi takdirde, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulamanın, işlenmiş ve işlenmemiş istek bölümlerinde yer alan saldırılardan yararlanma riski vardır.
        * **Engelleme** modunda, düğüm isteği engeller.
1. `Wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX direktiflerini `values.yaml` yapılandırma dosyasından silin.

    Eğer `overlimit_res` saldırı tespiti, hem direktifler hem de kural kullanılarak ince ayar yapılırsa, düğüm istekleri kuralın belirlediği şekliyle işleyecektir.
