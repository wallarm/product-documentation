Sürüm 3.6'dan itibaren, Wallarm Console'daki kuralı kullanarak `overlimit_res` saldırı tespitini ince ayar yapabilirsiniz.

Önceden, [`wallarm_process_time_limit`][nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX yönergeleri kullanılıyordu.

Listelenen yönergeler ve parametreler, yeni kuralın yayınlanmasıyla kullanımdan kaldırılmış sayılır ve gelecekteki sürümlerde silinecektir.

`overlimit_res` saldırı tespiti ayarları listelenen parametreler aracılığıyla özelleştirildiyse, bunları aşağıdaki şekilde kurala taşımanız önerilir:

1. Wallarm Console → **Rules** öğesini açın ve [**Limit request processing time**][overlimit-res-rule-docs] kuralının kurulumuna ilerleyin.
1. Kuralı, mount edilmiş yapılandırma dosyalarında yapıldığı gibi yapılandırın:

    * Düğümün tek bir isteği işlemesi için zaman sınırı (milisaniye): `wallarm_process_time_limit` veya `process_time_limit` değeri.
    
        !!! warning "Sistem belleğinin tükenmesi riski"
            Yüksek zaman sınırı ve/veya sınır aşıldıktan sonra isteğin işlenmesine devam edilmesi, bellek tükenmesine veya zamanında tamamlanamayan istek işlemeye neden olabilir.
    
    * Düğüm, [node filtration mode][waf-mode-instr] değerine bağlı olarak `overlimit_res` saldırısını engeller veya geçirir:

        * **monitoring** modunda düğüm, orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerinde yer alan saldırılar tarafından istismar edilme riski taşır.
        * **safe blocking** modunda, istek [graylisted][graylist-docs] bir IP adresinden geliyorsa düğüm isteği engeller. Aksi halde, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenen ve işlenmeyen istek bölümlerinde yer alan saldırılar tarafından istismar edilme riski taşır.
        * **block** modunda düğüm isteği engeller.
1. Mount edilmiş yapılandırma dosyasından `wallarm_process_time_limit`, `wallarm_process_time_limit_block` NGINX yönergelerini silin.

    `overlimit_res` saldırı tespiti hem parametreler hem de kural kullanılarak ince ayar yapılmışsa, düğüm istekleri kuralın belirlediği şekilde işleyecektir.