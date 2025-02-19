Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.

Daha önce, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılmıştı. Yeni kural sürümüyle birlikte listelenen yönergeler kullanımdan kaldırılmış kabul edilmekte ve gelecekteki sürümlerde silinecektir.

Eğer `overlimit_res` saldırı tespit ayarları yukarıdaki yönergelerle özelleştirildiyse, bunların kural üzerinden aktarılması önerilir:

1. Wallarm Console → **Kurallar** bölümünü açın ve [**Limit request processing time**][overlimit-res-rule-docs] kural ayarlarına gidin.
1. Kuralı, NGINX yönergeleri ile yapılandırıldığı gibi ayarlayın:
    * Kural koşulu, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` yönergelerinin belirtildiği NGINX yapılandırma bloğuyla eşleşmelidir.
    * Tek bir isteğin işlenmesi için düğüm zaman sınırı (milisaniye): `wallarm_process_time_limit` değeri.
    
        !!! warning "Sistem belleğinin tükenme riski"
            Yüksek zaman sınırı ve/veya sınır aşıldıktan sonra isteğin işlenmeye devam etmesi, bellek tükenmesine veya süresiz istek işlenmesine neden olabilir.
    
    * Düğüm, [node filtration mode][waf-mode-instr]'e bağlı olarak `overlimit_res` saldırısını engelleyecek veya geçecektir:
    
        * **monitoring** modunda, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek parçalarında yer alan saldırılara maruz kalma riski taşır.
        * **safe blocking** modunda, istek [graylisted][graylist-docs] IP adresinden geliyorsa düğüm isteği engeller. Aksi takdirde, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek parçalarında yer alan saldırılara maruz kalma riski taşır.
        * **block** modunda, düğüm isteği engeller.
1. NGINX yapılandırma dosyasından `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX yönergelerini silin.

Eğer `overlimit_res` saldırı tespiti hem yönergeler hem de kural kullanılarak ince ayar yapıldıysa, düğüm istekleri kuralın belirlediği şekilde işleyecektir.