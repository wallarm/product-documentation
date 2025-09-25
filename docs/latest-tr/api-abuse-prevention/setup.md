# API Abuse Prevention Kurulumu <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, kötü niyetli botları tespit edip azaltmak ve meşru faaliyetlerin engellenmesini önlemek için [API Abuse Prevention](../api-abuse-prevention/overview.md) modülünün nasıl etkinleştirileceğini ve yapılandırılacağını açıklar.

## Etkinleştirme

API Abuse Prevention modülü, **Advanced API Security** [abonelik planında](../about-wallarm/subscription-plans.md#core-subscription-plans) mevcuttur. Varsayılan olarak devre dışıdır.

API Abuse Prevention'ı etkinleştirmek için:

1. Wallarm node'unuzun 4.2 veya daha yeni olduğundan emin olun.
1. Wallarm Console → **API Abuse Prevention** içinde, en az bir [API Abuse profili](#creating-profiles) oluşturun veya etkinleştirin.

<a name="creating-profiles"></a>
## Profiller oluşturma

API kötüye kullanım profilleri, Wallarm'ın **API Abuse Prevention** özelliğinin kötü niyetli botları nasıl tespit edip etkisizleştireceğini yapılandırmak için kullanılır. Farklı uygulamalar için farklı profiller oluşturabilirsiniz. Her uygulamanın yalnızca bir ilişkilendirilmiş profili olabilir.

Bir profil, hangi bot türlerine karşı korunulacağını, her bot türünün hangi duyarlılıkla tespit edileceğini ve bu botun etkinliklerine verilecek tepkiyi tanımlar.

Bir API kötüye kullanım profili oluşturmak için:

1. **API Abuse Prevention** bölümünde, **Profiles** sekmesine geçin.
1. **Create profile**'ı tıklayın.
1. Korunmak istediğiniz [otomatik tehditleri](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) seçin, **Reaction** değerini belirleyin:
    
    * **Disabled** - Wallarm bu bot türüne karşı koruma sağlamaz.
    * **Register attack** - tespit edilen kötü niyetli bot etkinlikleri Wallarm Console'un [**Attacks**](../user-guides/events/check-attack.md) bölümünde görüntülenir, istekler engellenmez.

        Bu tür olay ayrıntılarından, **Add source IP to denylist** düğmesiyle botu hızlıca engelleyebilirsiniz. IP kalıcı olarak denylist'e eklenir, ancak **IP Lists** bölümünde silebilir veya listede kalma süresini değiştirebilirsiniz.

    * **Denylist IP** veya **Graylist IP** - botun IP'si seçilen süre için ilgili listeye eklenir ve istekler engellenir. Denylist ile graylist arasındaki farka dair daha fazlasını [burada](../user-guides/ip-lists/overview.md) öğrenin.

1. Gerekirse her bot türü için tespit **Sensitivity** ayarını değiştirin:
    
    * **Paranoid** - daha yüksek duyarlılık, uygulamalarınıza DAHA AZ botun erişeceği anlamına gelir, ancak yanlış pozitifler nedeniyle bazı meşru istekler engellenebilir.
    * **Normal** (varsayılan, önerilir) - pek çok yanlış pozitifi önlemek ve çoğu kötü niyetli bot isteğinin API'lere ulaşmasını engellemek için en uygun kuralları kullanır.
    * **Safe mode** - daha düşük duyarlılık, uygulamalarınıza DAHA FAZLA botun erişeceği anlamına gelir, ancak bu durumda herhangi bir meşru istek düşürülmez.

        ![API Abuse prevention profili](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

1. Uygulama(ları) seçin.
1. **Analyze behavior by** parametresini ayarlayın:

    * **Applications** - uygulamanın tüm alan adlarına gelen istekleri birlikte analiz eder.
    * **Domains** - uygulamanın her bir alan adına gelen istekleri ayrı ayrı analiz eder.

<a name="per-profile-traffic"></a>Oluşturulduktan sonra, profiller seçilen türdeki kötü niyetli botlara karşı seçtiğiniz uygulamaları korur. Koruma ve veri analizi, profilin uygulama trafiğinin varlığına ve miktarına bağlıdır. Profil başına duruma dikkat edin:

![API Abuse prevention - profiller](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-profiles-per-profile-status.png)

## Profilleri devre dışı bırakma ve silme

Devre dışı profiller, trafik analizi sırasında **API Abuse Prevention** modülünün kullanmadığı ancak profil listesinde gösterilmeye devam edenlerdir. Devre dışı profilleri dilediğiniz an yeniden etkinleştirebilirsiniz. Etkin profil yoksa, modül kötü niyetli botları engellemez.

Silinmiş profiller geri yüklenemez ve **API Abuse Prevention** modülü tarafından trafik analizi sırasında kullanılmaz.

Profil menüsünde Disable ve Delete seçeneklerini bulabilirsiniz.

## İstisnalar

[İstisnalar yaparak](exceptions.md) API Abuse Prevention'ı ince ayarlarla özelleştirebilirsiniz: meşru botları işaretlemek ve belirli hedef URL'ler ile istek türleri için bot korumasını devre dışı bırakmak.

## Oturum mekanizmasını iyileştirme

API Abuse Prevention, bot davranışını analiz ederken [API Sessions](../api-sessions/overview.md) mekanizmasını kullanır.

API Abuse Prevention işlevselliğini daha hassas hale getirmek için, istekleri oturumlara birleştirirken kimliği doğrulanmamış trafiğin daha iyi tanımlanması amacıyla [JA3 fingerprinting](../admin-en/enabling-ja3.md) özelliğini etkinleştirmeniz önerilir.