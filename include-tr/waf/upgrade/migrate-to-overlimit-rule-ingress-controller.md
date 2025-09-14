Sürüm 3.6 itibarıyla, Wallarm Console içindeki kuralı kullanarak `overlimit_res` saldırı tespitini ince ayar yapabilirsiniz.

Daha önce, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılıyordu. Listelenen yönergeler yeni kuralın yayınlanmasıyla kullanım dışı olarak kabul edilmektedir ve gelecekteki sürümlerde kaldırılacaktır.

`overlimit_res` saldırı tespiti ayarları listelenen yönergelerle özelleştirildiyse, bunları aşağıdaki şekilde kurala taşımanız önerilir:

1. Wallarm Console → **Rules** öğesini açın ve [**Limit request processing time**][overlimit-res-rule-docs] kuralının yapılandırmasına geçin.
1. Kuralı NGINX yönergelerinde yapıldığı şekilde yapılandırın:

    * Kural koşulu, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` yönergelerinin belirtildiği NGINX yapılandırma bloğuyla eşleşmelidir.
    * Düğümün tek bir isteği işlemesi için zaman sınırı (milisaniye): `wallarm_process_time_limit` değeri.
    
        !!! warning "Sistem belleğinin tükenme riski"
            Yüksek zaman sınırı ve/veya sınır aşıldıktan sonra istek işlemeye devam edilmesi, bellek tükenmesine veya isteklerin zamanında işlenememesine yol açabilir.
        
    * Düğüm, [düğüm filtreleme moduna][waf-mode-instr] bağlı olarak `overlimit_res` saldırısını ya engeller ya da geçirir:

        * **monitoring** modunda, düğüm özgün isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerine dahil olan saldırılar tarafından sömürülme riski taşır.
        * **safe blocking** modunda, istek [graylisted][graylist-docs] IP adresinden geliyorsa düğüm isteği engeller. Aksi halde, düğüm özgün isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerine dahil olan saldırılar tarafından sömürülme riski taşır.
        * **block** modunda, düğüm isteği engeller.
1. `values.yaml` yapılandırma dosyasından `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX yönergelerini silin.

    `overlimit_res` saldırı tespiti hem yönergeler hem de kural kullanılarak ince ayarlandıysa, düğüm istekleri kuralın belirlediği şekilde işleyecektir.