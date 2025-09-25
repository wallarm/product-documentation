Sürüm 3.6'dan itibaren, Wallarm Console içindeki kuralı kullanarak `overlimit_res` saldırı tespitine ince ayar yapabilirsiniz.

Daha önce, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılıyordu. Yeni kuralın yayımlanmasıyla birlikte listelenen yönergeler kullanımdan kaldırılmış sayılır ve gelecekteki sürümlerde kaldırılacaktır.

`overlimit_res` saldırı tespiti ayarları listelenen yönergelerle özelleştirildiyse, bunları aşağıdaki şekilde kurala taşımanız önerilir:

1. Wallarm Console → **Rules** bölümünü açın ve [**Limit request processing time**][overlimit-res-rule-docs] kuralı yapılandırmasına ilerleyin.
1. Kuralı NGINX yönergelerinde yaptığınız gibi yapılandırın:

    * Kural koşulu, `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` yönergelerinin belirtildiği NGINX yapılandırma bloğu ile eşleşmelidir.
    * Düğümün tek bir isteği işlemesi için zaman sınırı (milisaniye): `wallarm_process_time_limit` değeri.
    
        !!! warning "Sistem belleğinin tükenme riski"
            Zaman sınırının yüksek olması ve/veya sınır aşıldıktan sonra isteğin işlenmesine devam edilmesi, bellek tükenmesine veya isteklerin zamanında işlenememesine yol açabilir.
    
    * Düğüm, [node filtration mode][waf-mode-instr] değerine bağlı olarak `overlimit_res` saldırısını engeller veya geçirir:

        * **monitoring** modunda düğüm orijinal isteği uygulama adresine iletir. Uygulama, hem işlenmiş hem de işlenmemiş istek parçalarına dahil edilen saldırılar tarafından istismar edilme riski taşır.
        * **safe blocking** modunda, istek [graylisted][graylist-docs] IP adresinden geliyorsa düğüm isteği engeller. Aksi halde, düğüm orijinal isteği uygulama adresine iletir. Uygulama, hem işlenmiş hem de işlenmemiş istek parçalarına dahil edilen saldırılar tarafından istismar edilme riski taşır.
        * **block** modunda düğüm isteği engeller.
1. NGINX yapılandırma dosyasından `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` NGINX yönergelerini silin.

    `overlimit_res` saldırı tespiti hem yönergeler hem de kural kullanılarak ince ayar yapılıyorsa, düğüm istekleri kuralın belirlediği şekilde işler.