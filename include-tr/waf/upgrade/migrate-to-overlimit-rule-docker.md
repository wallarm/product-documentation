Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.

Sürüm 3.6'dan itibaren, Wallarm Console'daki kuralı kullanarak `overlimit_res` saldırı tespitini ince ayar yapabilirsiniz.

Earlier, the following options have been used:

Daha önce, aşağıdaki seçenekler kullanılmıştır:

* The [`wallarm_process_time_limit`][nginx-process-time-limit-docs] and [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX directives
<!-- * The [`process_time_limit`][envoy-process-time-limit-docs] and [`process_time_limit_block`][envoy-process-time-limit-block-docs] Envoy parameters -->

The listed directives and parameters are considered to be deprecated with the new rule release and will be deleted in future releases.

Listelenen yönergeler ve parametreler, yeni kural sürümü ile birlikte kullanımdan kaldırılmış sayılmaktadır ve gelecekteki sürümlerde silinecektir.

If the `overlimit_res` attack detection settings are customized via the listed parameters, it is recommended to transfer them to the rule as follows:

`overlimit_res` saldırı tespit ayarları listelenen parametreler aracılığıyla özelleştirildiyse, bunların kural üzerine aşağıdaki şekilde aktarılması tavsiye edilir:

1. Open Wallarm Console → **Rules** and proceed to the [**Limit request processing time**][overlimit-res-rule-docs] rule setup.

1. Wallarm Console'u açın → **Rules** bölümüne gidin ve [**Limit request processing time**][overlimit-res-rule-docs] kural ayarına geçin.

1. Configure the rule as done in the mounted configuration files:

1. Kuralı, monte edilmiş konfigürasyon dosyalarında yapıldığı gibi yapılandırın:

    <!-- * The rule condition should match the NGINX or Envoy configuration block with the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` directives or the `process_time_limit` and `process_time_limit_block` parameters specified. -->
    * The time limit for the node to process a single request (milliseconds): the value of `wallarm_process_time_limit` or `process_time_limit`.

    * Bir isteğin düğüm tarafından işlenmesi için zaman sınırı (milisaniye): `wallarm_process_time_limit` veya `process_time_limit` değeri.

        !!! warning "Risk of running out of system memory"
            The high time limit and/or continuation of request processing after the limit is exceeded can trigger memory exhaustion or out-of-time request processing.

        !!! warning "Sistem belleğinin tükenmesi riski"
            Yüksek zaman sınırı ve/veya sınır aşıldıktan sonra isteğin işlenmeye devam etmesi, bellek tükenmesine veya zamanında işlenemeyen isteklerin oluşmasına yol açabilir.

    * The node will either block or pass the `overlimit_res` attack depending on the [node filtration mode][waf-mode-instr]:

    * Düğüm, [node filtration mode][waf-mode-instr]'a bağlı olarak `overlimit_res` saldırısını engelleyebilir veya geçirebilir:

        * In the **monitoring** mode, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

        * **monitoring** modunda, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenmiş ve işlenmemiş istek bölümlerinde yer alan saldırılar tarafından hedef alınma riski taşır.

        * In the **safe blocking** mode, the node blocks the request if it is originated from the [graylisted][graylist-docs] IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

        * **safe blocking** modunda, istek [graylisted][graylist-docs] IP adresinden geliyorsa düğüm isteği engeller. Aksi takdirde, düğüm orijinal isteği uygulama adresine iletir. Uygulama, işlenmiş ve işlenmemiş istek bölümlerinde yer alan saldırılar tarafından hedef alınma riski taşır.

        * In the **block** mode, the node blocks the request.

        * **block** modunda, düğüm isteği engeller.

1. Delete the `wallarm_process_time_limit`, `wallarm_process_time_limit_block` NGINX directives from the mounted configuration file.

1. Monte edilmiş konfigürasyon dosyasından `wallarm_process_time_limit`, `wallarm_process_time_limit_block` NGINX yönergelerini silin.

    If the `overlimit_res` attack detection is fine-tuned using both the parameters and the rule, the node will process requests as the rule sets.

    Eğer `overlimit_res` saldırı tespiti hem parametreler hem de kural kullanılarak ince ayarlanmışsa, düğüm istekleri kuralda belirtilen şekilde işleyecektir.