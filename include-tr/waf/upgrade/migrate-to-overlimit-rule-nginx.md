3.6 sürümünden itibaren, `overlimit_res` saldırı tespitini Wallarm Konsolu'ndaki kuralı kullanarak ince ayar yapabilirsiniz.

Daha önce, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılmıştı. Listelenen yönergeler, yeni kuralın çıkışıyla modası geçmiş sayılır ve gelecekteki sürümlerde silinecektir.

`overlimit_res` saldırı tespit ayarları listelenen yönergelerle düzenlendiğinde, onları aşağıdaki şekilde kurala aktarmaları önerilir:

1. Wallarm Konsolu'nu açın → **Rules** ve [**Fine-tune the overlimit_res attack detection**][overlimit-res-rule-docs] kural kurulumuna gidin.
1. Kuralı tıpkı NGINX yönergeleri üzerinde olduğu gibi yapılandırın:

    * Kural koşulu, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` yönergelerinin belirtildiği NGINX yapılandırma bloğuyla eşleşmelidir.
    * Bir nodun tek bir isteği işlemek için zaman limiti (milisaniye): `wallarm_process_time_limit` değeri.
    * İstek işleme: **İşlemeyi durdur** seçeneği önerilir.
    
        !!! uyarı "Sistem belleğinin tükenme riski"
            Yüksek zaman limiti ve/veya limit aşıldıktan sonra istek işleme devam etme durumu belleğin tükenmesine veya zaman aşımına uğramış istek işlemeye tetikleyebilir.
    
    * Overlimit_res saldırısını kaydet: **Register and display in the events** seçeneği önerilir.

        `wallarm_process_time_limit_block` veya `process_time_limit_block` değeri `off` ise, **Do not create attack event** seçeneğini seçin.
    
    * Kural, `wallarm_process_time_limit_block` yönergesi için açık bir eşdeğer seçeneğe sahip değildir. Kural, **Register and display in the events**'ı belirlerse, düğüm [node filtration mode][waf-mode-instr]'ye bağlı olarak `overlimit_res` saldırısını engeller veya geçer:

        * **monitoring** modunda, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulama, hem işlenmiş hem de işlenmemiş istek parçalarında yer alan saldırılara maruz kalma riski taşır.
        * **safe blocking** modunda, düğüm isteği [graylisted][graylist-docs] IP adresinden oluşturulmuşsa engeller. Aksi taktirde, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulama, hem işlenmiş hem de işlenmemiş istek parçalarında yer alan saldırılara maruz kalma riski taşır.
        * **block** modunda, düğüm isteği bloklar.
1. `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX yönergelerini NGINX yapılandırma dosyasından silin.

    Eğer `overlimit_res` saldırı tespiti hem yönergeler hem de kural kullanılarak ayarlanırsa, düğüm istekleri kuralın belirlediği gibi işler.