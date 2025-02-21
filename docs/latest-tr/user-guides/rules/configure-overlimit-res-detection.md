[api-discovery-enable-link]:    ../../api-discovery/setup.md#enable

# İstek İşleme Süresini Sınırlandırma

Wallarm düğümü, gelen tek bir isteğin işlenmesi üzerinde sınırlı zaman harcar ve zaman sınırı aşıldığında, isteği [resource overlimit (`overlimit_res`)](../../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretler. Tek bir isteğin işlenmesi için ayrılan zaman sınırını ve sınır aşıldığında düğümün davranışını özelleştirebilirsiniz.

İstek işleme süresinin sınırlandırılması, Wallarm düğümlerine yönelik atlatma saldırılarını önler. Bazı durumlarda, `overlimit_res` olarak işaretlenen istekler, Wallarm düğüm modülleri için ayrılan kaynakların yetersiz olduğunu ve bunun uzun istek işlemeye yol açtığını gösterebilir.

## Kaynak Aşımı Saldırılarına Tepki Verme

Düğüm sürüm 5.1.0'dan itibaren, yapılandırılmış işleme süresi sınırlarını aşan tüm istekler, `overlimit_res` anahtar kelimesi altında **Attacks** bölümünde listelenir. Aşağıdaki bilgiler, bu isteklere verilen varsayılan düğüm davranışının uygun olup olmadığını veya ayarlamalar yapılması gerekip gerekmediğini belirlemenize yardımcı olacaktır:

* Bu uç nokta, büyük veri (dosyalar vb.) ile uğraşıyor ve bu nedenle daha fazla zamana mı ihtiyaç duyuyor?

    * Eğer **evet** ise, [bu uç nokta için özel olarak](#specific-endpoint-configuration) zaman sınırını artırın. Bu, isteğin işlenmemiş kısmını azaltacak ve burada gizlenen saldırı riskini düşürecektir.
    * Eğer **hayır** ise, uç noktanın saldırıya uğramış olabileceğini göz önünde bulundurarak, [**API Discovery**](../../api-discovery/overview.md), [**API Sessions**](../../api-sessions/overview.md) ve [**Attacks**](../../user-guides/events/check-attack.md) bölümlerinde korumasını ve ilgili aktiviteleri inceleyin. Korumayı [burada](../../user-guides/events/check-attack.md#responding-to-attacks) açıklanan şekilde ayarlayın.

* Bu uç nokta, diğer birçok uç noktayla birlikte `overlimit_res` sorununu yaşıyor mu? Eğer **evet** ise, Wallarm düğüm modülleri için [daha fazla kaynak tahsis etmeyi](../../admin-en/configuration-guides/allocate-resources-for-node.md) veya genel yapılandırmanın doğruluğunu kontrol etmeyi dikkate alın; bu, istek işleme süresini azaltacaktır.

* Bu uç nokta, doğrudan kullanıcı deneyimi ve memnuniyetini etkiliyor mu?

    * Eğer **evet** ise, varsayılan **engellemeyen** davranışı değiştirmeyin. Geçerli trafik kesinlikle engellenmeyecek ve yine de **Attacks** bölümünde `overlimit_res` bilgilerini alacaksınız.
    * Eğer **hayır** ise, [bu uç nokta için özel olarak](#specific-endpoint-configuration) yanıtı **Block** olarak değiştirmeyi düşünün.

Uç noktalarda `overlimit_res` saldırılarının bulunması genel olarak normaldir ancak beklenen sınırlar içinde kalmalıdır. Yüksek hacimler, yukarıda belirtilen analiz ve eylemlerin yapılmasının faydalı olabileceğini gösterir.

## Genel Yapılandırma

Wallarm Console → **Settings** → **General** → **Limit request processing time** bölümünde, istek işleme süresi sınırı için genel yapılandırmayı kontrol edebilirsiniz. Bu yapılandırma, [özel uç nokta yapılandırması](#specific-endpoint-configuration) ile geçersiz kılınmadığı sürece tüm uç noktaları etkiler.

Varsayılan olarak, bu yapılandırma:

* Gelen tek bir istek işlemesi için **1,000 milliseconds**.
* Aşım durumunda yanıt **Interrupt Wallarm processing and bypass** şeklindedir; bu da Wallarm'ın:

    * İstek işlemesini durdurur.
    * İsteği `overlimit_res` saldırısı olarak işaretler ve **Attacks** bölümünde görüntüler. İşlenen isteğin kısmı diğer [attack types](../../attacks-vulns-list.md) içeriyorsa, karşılık gelen türlerin saldırıları da görüntülenecektir.
    * Orijinal isteğin uygulamaya ulaşmasına izin verir (protection bypass).<!-- Note that the application has the risk to be exploited by the attacks included in both processed and unprocessed request parts. The default general configuration and [adjusting for specific endpoints](#specific-endpoint-configuration) minimizes this risk.-->

![Limit request processing time - General configuration](../../images/user-guides/rules/fine-tune-overlimit-detection-generic.png)

Zaman sınırını ayarlayarak ve yanıtı değiştirerek genel yapılandırmayı değiştirebilirsiniz.

!!! warning "Koruma atlatma veya sistem belleğinin tükenme riski"
    * Varsayılan düğüm davranışını yalnızca gerçekten gerekli olduğunda, örneğin büyük dosyaların yüklendiği ve koruma atlatma ile güvenlik açığı istismarı riski bulunmayan [özel alanlarda](#specific-endpoint-configuration) değiştirmeniz önerilir.
    * Yüksek zaman sınırı, bellek tükenmesine neden olabilir.

Yanıtın **Block request** olarak değiştirilmesi, Wallarm'ın:

* İstek işlemesini durdurması,
* İsteği `overlimit_res` saldırısı olarak işaretleyip **Attacks** bölümünde görüntülemesi. İşlenen isteğin kısmı diğer [attack types](../../attacks-vulns-list.md) içeriyorsa, karşılık gelen türlerin saldırıları da görüntülenecektir,
* İsteği engellemesidir. Geçerli isteklerin engellenme riski olduğunu unutmayın. Varsayılan genel yapılandırma ve yalnızca [özel uç noktalar için](#specific-endpoint-configuration) engelleme ayarlarının yapılması, bu riski en aza indirir.

!!! info "Engelleme için gereken filtreleme modu"
    Engellemenin yalnızca düğüm **blocking** filtreleme [modu](../../admin-en/configure-wallarm-mode.md) veya [graylisted](../ip-lists/overview.md) IP adreslerinden gelen istekler için **safe blocking** modundayken çalışacağını unutmayın.

## Özel Uç Nokta Yapılandırması

Varsayılan [genel yapılandırma](#general-configuration) iyi test edilmiş, ortalama bir yaklaşımdır ve değiştirilmesi asla önerilmez. Ancak, hem korumayı sağlarken hem de geçerli trafiği engellemeyen daha iyi bir denge elde edebilirsiniz. Bunu, ortalamanın dışında işlem süresi olan uç noktalar için özel olarak zaman sınırını ayarlayarak ve doğrudan risk taşımayan durumlarda yanıtı engelleme olarak değiştirerek yapabilirsiniz.

**Limit request processing time** [kuralı](../../user-guides/rules/rules.md), belirli uç nokta için farklı ayarlar yaparak [genel](#general-configuration) veya üst yapılandırmanın üzerine geçmenizi sağlar. Yapabilecekleriniz:

* Tek bir istek işlemesi için özel sınır belirlemek
* Sistem yanıtını değiştirmek (her birinin açıklamaları [yukarıda](#general-configuration) verilmiştir)

Özel uç nokta yapılandırmasını, istek işleme süresi sınırı için ayarlamak üzere:

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Limit request processing time** seçeneğini seçin.
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [tanımlayın](rules.md#configuring).
1. Parametreleri ayarlayın.

## Kural Örneği

Varsayılan genel yapılandırmanızın **1,000 milliseconds** ve **Interrupt Wallarm processing and bypass** yanıtı olduğunu ve `https://example.com/upload` için birçok `overlimit_res` saldırısı aldığınızı varsayalım. Yapılan inceleme, uç noktanın büyük dosya yüklemeleri için kullanıldığını ve geçerli isteklerin işleme süresi aşıldığı için `overlimit_res` saldırısı olarak işaretlendiğini göstermektedir.

Gereksiz `overlimit_res` bildirimlerinin sayısını azaltmak ve işlenmemiş isteğin içerisinde kötü amaçlı yüklerin saklanma olasılığını düşürmek için, bu uç nokta için özel olarak istek işleme süresinin artırılması gerekmektedir.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Limit request processing time** kuralını ayarlayın.

![The "Register and display in the events" rule example](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)