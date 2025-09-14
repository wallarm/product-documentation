[api-discovery-enable-link]:    ../../api-discovery/setup.md#enable

# İstek İşleme Süresini Sınırlama

Wallarm düğümü, tek bir gelen isteğin işlenmesine sınırlı zaman harcar ve zaman sınırı aşılırsa, isteği [resource overlimit (`overlimit_res`)](../../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretler. Tek bir isteğin işlenmesine ayrılan zaman sınırını ve sınır aşıldığında düğümün davranışını özelleştirebilirsiniz.

İstek işleme süresini sınırlamak, Wallarm düğümlerini hedefleyen atlatma saldırılarını engeller. Bazı durumlarda `overlimit_res` olarak işaretlenen istekler, Wallarm düğümü modüllerine ayrılan kaynakların yetersiz olduğunu ve bunun da uzun istek işlemeye yol açtığını gösterebilir.

## Resource overlimit saldırılarına yanıt verme

Düğüm sürümü 5.1.0'dan itibaren, yapılandırılan işleme süresi sınırlarını aşan tüm istekler, **Attacks** bölümünde `overlimit_res` anahtar kelimesi altında listelenir. Aşağıdaki bilgiler, bu isteklere yanıt olarak varsayılan düğüm davranışının uygun olup olmadığını veya ayarlama gerekip gerekmediğini belirlemenize yardımcı olacaktır:

* Bu uç nokta büyük verilerle (dosyalar vb.) mi çalışıyor ve bu nedenle daha fazla zamana mı ihtiyaç duyuyor?

    * Eğer **evet** ise, zaman sınırını [özellikle bu uç nokta için](#specific-endpoint-configuration) artırın. Bu, isteğin işlenmemiş kısmını azaltacak ve böylece orada gizlenmiş saldırı riskini düşürecektir.
    * Eğer **hayır** ise, uç nokta saldırı altında olabilir; korumasını ve bu uç noktayla ilgili etkinlikleri [**API Discovery**](../../api-discovery/overview.md), [**API Sessions**](../../api-sessions/overview.md) ve [**Attacks**](../../user-guides/events/check-attack.md) içinde araştırın. Korumayı [burada](../../user-guides/events/check-attack.md#responding-to-attacks) açıklandığı gibi ayarlayın.

* Bu uç nokta, **çok sayıda başka** uç noktayla birlikte `overlimit_res` sorunu yaşıyor mu? Eğer **evet** ise, istek işleme süresini azaltacak Wallarm düğümü modülleri için [daha fazla kaynak ayırmayı](../../admin-en/configuration-guides/allocate-resources-for-node.md) düşünün veya genel yapılandırmanın doğruluğunu kontrol edin.

* Bu uç nokta kullanıcı deneyimini ve memnuniyetini doğrudan etkiliyor mu?

    * Eğer **evet** ise, varsayılan **engellememe** davranışını değiştirmeyin. Meşru trafik kesinlikle engellenmeyecek ve yine de sorunlarla ilgili bilgileri **Attacks** içinde `overlimit_res` olarak alacaksınız.
    * Eğer **hayır** ise, [özellikle bu uç nokta için](#specific-endpoint-configuration) yanıtı **Block** olarak değiştirmeyi değerlendirin.

Uç noktalarda `overlimit_res` saldırılarının varlığı genellikle normaldir ancak beklenen sınırlar içinde kalmalıdır. Yüksek hacimler, yukarıda açıklanan analiz ve eylemleri gerçekleştirmenin faydalı olabileceğini gösterir.

<a name="general-configuration"></a>
## Genel yapılandırma

Wallarm Console → **Settings** → **General** → **Limit request processing time** içinde, istek işleme süresi sınırı için genel yapılandırmayı kontrol edebilirsiniz. Bu yapılandırma, [belirli uç nokta yapılandırması](#specific-endpoint-configuration) ile geçersiz kılınmadıkça tüm uç noktaları etkiler.

Varsayılan olarak şunlardır: 

* Tek bir gelen isteğin işlenmesi için **1.000 milisaniye**.
* Aşıma verilen yanıt **Interrupt Wallarm processing and bypass** olup bu, Wallarm'ın: 

    * İstek işlemeyi durdurduğu,
    * İsteği `overlimit_res` saldırısı olarak işaretleyip **Attacks** içinde gösterdiği anlamına gelir. İşlenen istek kısmı başka [saldırı türleri](../../attacks-vulns-list.md) içeriyorsa, ilgili türlerin saldırıları da görüntülenecektir.
    * Orijinal isteğin uygulamaya ulaşmasına izin verdiği (korumanın atlatılması) anlamına gelir.<!-- Note that the application has the risk to be exploited by the attacks included in both processed and unprocessed request parts. The default general configuration and [adjusting for specific endpoints](#specific-endpoint-configuration) minimizes this risk.-->

![İstek işleme süresini sınırla - Genel yapılandırma](../../images/user-guides/rules/fine-tune-overlimit-detection-generic.png)

Genel yapılandırmayı zaman sınırını ayarlayarak ve yanıtı değiştirerek değiştirebilirsiniz.

!!! warning "Korumanın atlatılması veya sistem belleğinin tükenmesi riski"
    * Varsayılan düğüm davranışını yalnızca gerçekten gerekli olan, örneğin büyük dosyaların yüklendiği ve korumanın atlatılması ile zafiyet istismarının riske atılmadığı kesinlikle [belirli yerlerde](#specific-endpoint-configuration) değiştirmeniz önerilir.
    * Yüksek zaman sınırı, bellek tükenmesine yol açabilir.

Yanıtı **Block request** olarak değiştirmek, Wallarm'ın: 

* İstek işlemeyi durdurduğu,
* İsteği `overlimit_res` saldırısı olarak işaretleyip **Attacks** içinde gösterdiği. İşlenen istek kısmı başka [saldırı türleri](../../attacks-vulns-list.md) içeriyorsa, ilgili türlerin saldırıları da görüntülenecektir.
* İsteği engellediği anlamına gelir. Meşru isteklerin engellenme riski olduğunu unutmayın. Varsayılan genel yapılandırmayı korumak ve [yalnızca belirli uç noktalar](#specific-endpoint-configuration) için engellemeyi ayarlamak bu riski en aza indirir.

!!! info "Engelleme için filtreleme modu gereklidir"
    Engellemenin yalnızca düğüm **blocking** filtreleme [mode](../../admin-en/configure-wallarm-mode.md) içinde olduğunda veya [graylisted](../ip-lists/overview.md) IP adreslerinden gelen istekler için **safe blocking** olduğunda çalışacağını unutmayın.

<a name="specific-endpoint-configuration"></a>
## Belirli uç nokta yapılandırması

[Varsayılan genel yapılandırma](#general-configuration) iyi test edilmiş ortalama bir yaklaşımdır ve değiştirilmesi asla önerilmez. Ancak, hem koruma sağlayan hem de meşru trafiği engellemeyen daha iyi bir dengeye ulaşabilirsiniz. Bunu, ortalamanın dışında işleme süresine sahip uç noktalar için zaman sınırını **özellikle** ayarlayarak ve hemen riskli olmadığı yerlerde yanıtı **özellikle** **engellemeye** çevirerek yapın.

**Limit request processing time** [kuralı](../../user-guides/rules/rules.md), belirli bir uç nokta için farklı ayarlayarak [genel](#general-configuration) veya üst yapılandırmayı geçersiz kılmanızı sağlar. Şunları yapabilirsiniz:

* Tek bir istek işlemeye özel bir sınır belirlemek
* Sistem yanıtını değiştirmek (her birinin açıklamaları [yukarıdadır](#general-configuration))

İstek işleme süresi sınırı için belirli uç nokta yapılandırmasını ayarlamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Limit request processing time** öğesini seçin.
1. **If request is** içinde, kuralın uygulanacağı kapsamı [açıklayın](rules.md#configuring).
1. Parametreleri ayarlayın.

## Kural örneği

Varsayılan genel yapılandırmanızın **1.000 milisaniye** ve yanıtın **Interrupt Wallarm processing and bypass** olduğunu ve `https://example.com/upload` için çok sayıda `overlimit_res` saldırınız olduğunu varsayalım. İnceleme, uç noktanın büyük dosya yükleme için kullanıldığını ve meşru isteklerin, işleme süresinin aşılması nedeniyle `overlimit_res` saldırıları olarak işaretlendiğini gösteriyor.

Gereksiz `overlimit_res` bildirimlerinin sayısını azaltmak ve isteğin işlenmemiş kısmında gizlenen kötü amaçlı yüklerin olasılığını düşürmek için, özellikle bu uç nokta için istek işlemeye ayrılan süreyi artırmamız gerekir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Limit request processing time** kuralını ayarlayın.

![“Register and display in the events” kural örneği](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)