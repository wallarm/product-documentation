# API Abuse Prevention Setup <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, kötü niyetli botları tespit edip etkisiz hale getirmek ve meşru aktivitelerin engellenmesini önlemek amacıyla [API Abuse Prevention](../api-abuse-prevention/overview.md) modülünün nasıl etkinleştirileceğini ve yapılandırılacağını açıklamaktadır.

## Etkinleştirme

API Abuse Prevention modülü, **Advanced API Security** [subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) kapsamında sunulmaktadır. Varsayılan olarak devre dışıdır.

API Abuse Prevention'ı etkinleştirmek için:

1. Wallarm node'unuzun 4.2 veya daha sonraki bir sürümde olduğundan emin olun.
2. Wallarm Console → **API Abuse Prevention** bölümünde, en az bir [API Abuse profile](#creating-profiles) oluşturun veya etkinleştirin.

## Profillerin Oluşturulması

API abuse profilleri, Wallarm'ın **API Abuse Prevention** modülünün kötü niyetli botları tespit etme ve etkisiz hale getirme yöntemini yapılandırmak için kullanılır. Farklı uygulamalar için farklı profiller oluşturabilirsiniz. Her uygulamanın yalnızca bir ilişkili profili olabilir.

Bir profil, hangi bot türlerinden korunulacağını, her bot türü için hangi hassasiyetin uygulanacağını ve bu botların faaliyetlerine verilecek tepkinin ne olacağını tanımlar.

Bir API abuse profili oluşturmak için:

1. **API Abuse Prevention** bölümünde, **Profiles** sekmesine geçin.
2. **Create profile** seçeneğine tıklayın.
3. Korunacak [automated threats](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) öğesini seçin, **Reaction** ayarını belirleyin:
    
    * **Disabled** - Wallarm bu bot türünden korumayacaktır. 
    * **Register attack** - Tespit edilen kötü niyetli bot aktiviteleri Wallarm Console'daki [**Attacks**](../user-guides/events/check-attack.md) bölümünde görüntülenecek, istekler engellenmeyecektir.

        Bu tür olay ayrıntılarından, **Add source IP to denylist** düğmesiyle botu hızlıca engelleyebilirsiniz. IP, denylist'e süresiz eklenir; ancak **IP Lists** bölümünde bu IP'yi silebilir veya listede kalma süresini değiştirebilirsiniz.

    * **Denylist IP** veya **Graylist IP** - Botun IP'si, seçilen süre boyunca ilgili listeye eklenir ve istekler engellenir. Denylist ile graylist arasındaki farkı [buradan](../user-guides/ip-lists/overview.md) öğrenebilirsiniz.

4. Gerekirse her bot türü için tespit **Sensitivity** ayarını değiştirin:
    
    * **Paranoid** - Yüksek hassasiyet, daha AZ botun uygulamalarınıza erişmesine neden olur ancak yanlış pozitifler yüzünden bazı meşru istekler engellenebilir.
    * **Normal** (varsayılan, önerilen) - Birçok yanlış pozitifi önleyen ve kötü niyetli bot isteklerinin API'lara ulaşmasını engelleyen optimal kuralları kullanır.
    * **Safe mode** - Düşük hassasiyet, daha FAZLA botun uygulamalarınıza erişmesine izin verir, ancak meşru istekler reddedilmez.

        ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

5. Uygulama(ları) seçin.
6. **Analyze behavior by** parametresini ayarlayın:

    * **Applications** - Uygulamadaki tüm alanlara yapılan istekleri birlikte analiz eder.
    * **Domains** - Uygulamadaki her bir alan adına yapılan istekleri ayrı ayrı analiz eder.

<a name="per-profile-traffic"></a>Oluşturulduktan sonra, profiller seçtiğiniz uygulamaları, belirlenen bot türlerinin kötü niyetli botlarından korur. Koruma ve veri analizi, profilin uygulama trafiğinin varlığına ve miktarına bağlıdır. Profil başına duruma dikkat edin:

![API abuse prevention - profiles](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-profiles-per-profile-status.png)

## Profillerin Devre Dışı Bırakılması ve Silinmesi

Devre dışı bırakılmış profiller, trafik analizi sırasında **API Abuse Prevention** modülünün kullanmadığı ancak profil listesinde gösterilmeye devam edilen profillerdir. İstediğiniz anda devre dışı bırakılmış profilleri yeniden etkinleştirebilirsiniz. Etkin profiller olmadığında, modül kötü niyetli botları engellemez.

Silinmiş profiller, geri yüklenemeyen ve **API Abuse Prevention** modülünün trafik analizi sırasında kullanmadığı profillerdir.

**Disable** ve **Delete** seçeneklerini profil menüsünde bulabilirsiniz.

## İstisnalar

Meşru botları işaretleyerek ve belirli hedef URL'ler ile istek türleri için bot korumasını devre dışı bırakarak, [istisnalar oluşturabilirsiniz](exceptions.md).

## Oturum Mekanizmasını İyileştirme

API Abuse Prevention, bot davranışını analiz ederken [API Sessions](../api-sessions/overview.md) mekanizmasını kullanır.

API Abuse Prevention işlevselliğinin daha hassas çalışması için, istekleri oturumlara birleştirirken kimliği doğrulanmamış trafiğin daha iyi tanımlanması amacıyla [JA3 fingerprinting](../admin-en/enabling-ja3.md) etkinleştirilmesi önerilir.