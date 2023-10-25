3.6 versiyonundan itibaren, `overlimit_res` saldırı algılama ayarlarını Wallarm Console'daki kuralı kullanarak ince ayar yapabilirsiniz.

Daha önce aşağıdaki seçenekler kullanılmıştı:

* [`wallarm_process_time_limit`] [nginx-process-time-limit-docs] ve [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX direktifleri
* [`process_time_limit`][envoy-process-time-limit-docs] ve [`process_time_limit_block`][envoy-process-time-limit-block-docs] Envoy parametreleri

Listelenen direktifler ve parametreler, yeni kuralın yayınlanmasıyla birlikte kullanımdan kaldırılmış sayılır ve gelecekteki sürümlerde silinecektir.

Eğer `overlimit_res` saldırı algılama ayarları listelenen parametreler aracılığıyla özelleştirildiyse, onları aşağıdaki gibi kurala aktarmanız önerilir:

1. Wallarm Konsolu'nu açın → **Kurallar** ve [**Fine-tune the overlimit_res attack detection**][overlimit-res-rule-docs] kural ayarına geçin.
1. Kuralı, monte edilmiş yapılandırma dosyalarında yapıldığı gibi yapılandırın:

   * Kural durumu, belirtilen `wallarm_process_time_limit` ve `wallarm_process_time_limit_block` direktifleri veya `process_time_limit` ve `process_time_limit_block` parametreleriyle NGINX veya Envoy yapılandırma bloğuna eşleşmelidir.
   * Bir düğümün tek bir isteği işlemek için zaman sınırı (milisaniye): `wallarm_process_time_limit` veya `process_time_limit` değeri.
   * İstek işleme: **İşlemeyi durdur** seçeneği önerilir.
  
       !!! uyarı "Sistem belleğinin tükenme riski"
           Yüksek zaman sınırı ve/veya sınır aşıldıktan sonra istek işlemenin devam etmesi belleğin tükenmesine veya zamanında olmayan istek işlemeye neden olabilir.
   
   * Overlimit_res saldırısını kaydet: **Kaydet ve olaylarda göster** seçeneği önerilir.

       Eğer `wallarm_process_time_limit_block` veya `process_time_limit_block` değeri `kapalı` ise, **Saldırı etkinliği oluşturma** seçeneğini seçin.
   
   * Kural, `wallarm_process_time_limit_block` (`Envoy'deki process_time_limit_block`) direktifi için açıkça belirtilmiş bir seçeneğe sahip değildir. Eğer kural **Kaydet ve olaylarda göster** ayarlarını yaparsa, düğüm [düğüm filtrasyon moduna][waf-mode-instr] bağlı olarak `overlimit_res` saldırısını ya engeller veya geçirir:

       * **İzleme** modunda, düğüm orijinal isteği uygulama adresine yönlendirir. Uygulamanın, işlenen ve işlenmeyen istek parçaları içerisindeki saldırılardan zarar görmesi riski vardır.
       * **Güvenli engelleme** modunda, düğüm, isteğin [gri listeye][graylist-docs] alınmış IP adresinden gelmesi durumunda isteği engeller. Aksi takdirde, düğüm orijinal isteği uygulama adresine iletir. Uygulamanın, işlenen ve işlenmeyen istek parçaları içerisindeki saldırılardan zarar görmesi riski vardır.
       * **Engelle** modunda, düğüm isteği engeller.
1. Monte edilmiş yapılandırma dosyasından `wallarm_process_time_limit`, `wallarm_process_time_limit_block` NGINX direktiflerini ve `process_time_limit`, `process_time_limit_block` Envoy parametrelerini silin.

   Eğer `overlimit_res` saldırı algılama hem parametreler hem de kural kullanılarak ince ayarlanırsa, düğüm istekleri kuralın belirttiği gibi işler.