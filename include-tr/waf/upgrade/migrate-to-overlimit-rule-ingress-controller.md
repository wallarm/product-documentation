Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.

Önceki sürümlerde, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılıyordu. Listelenen yönergeler, yeni kural sürümüyle birlikte kullanımdan kaldırılmış sayılmakta olup, gelecekteki sürümlerde kaldırılacaktır.

Eğer `overlimit_res` saldırı tespiti ayarları liste halinde belirtilen yönergeler aracılığıyla özelleştirildiyse, bunların aşağıdaki gibi kurala aktarılması önerilir:

1. Wallarm Console → **Rules** bölümünü açın ve [**Limit request processing time**][overlimit-res-rule-docs] kural kurulumuna geçin.
1. Kuralı, NGINX yönergeleri kullanılarak yapılandırıldığı gibi ayarlayın:

    * Kural koşulu, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` yönergelerinin belirtildiği NGINX yapılandırma bloğu ile eşleşmelidir.
    * Bir düğümün tek bir isteği işlemek için harcadığı süre (milisaniye): `wallarm_process_time_limit` değeri.

        !!! warning "Sistem belleğinin tükenme riski"
            Yüksek zaman limiti ve/veya limit aşıldıktan sonra isteğin işlenmeye devam etmesi, bellek tükenmesine veya zaman aşımında istek işlenmesine neden olabilir.
        
    * Düğüm, [node filtration mode][waf-mode-instr]'a bağlı olarak `overlimit_res` saldırısını ya engeller ya da iletir:

        * **monitoring** modunda, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerini içeren saldırılara maruz kalma riski taşır.
        * **safe blocking** modunda, isteğin [graylisted][graylist-docs] IP adresinden geldiği durumda düğüm isteği engeller. Aksi halde, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerini içeren saldırılara maruz kalma riski taşır.
        * **block** modunda, düğüm isteği engeller.
1. `values.yaml` yapılandırma dosyasından `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX yönergelerini silin.

Eğer `overlimit_res` saldırı tespiti, hem yönergeler hem de kural kullanılarak ince ayarlandıysa, düğüm istekleri kuralda belirtildiği şekilde işleyecektir.