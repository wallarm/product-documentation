# Meşru bir istek engellendi

Kullanıcınız Wallarm önlemlerine rağmen meşru bir talebin engellendiğini bildiriyorsa, bu makalede anlatıldığı gibi taleplerini gözden geçirebilir ve değerlendirebilirsiniz.

Wallarm tarafından engellenen meşru bir talebin sorununu çözmek için aşağıdaki adımları izleyin:

1. Kullanıcıdan, engellenen taleple ilgili bilgileri **metin olarak** (ekran görüntüsü değil) sunmasını isteyin, bu bilgilerden birisi aşağıdakiler olabilir:

    * Eğer yapılandırılmış ise Wallarm [engelleme sayfası](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) tarafından sağlanan bilgiler (kullanıcının IP adresini, istek UUID'isini ve diğer önceden yapılandırılmış öğeleri içerebilir).

        ![Wallarm engelleme sayfası](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "Engelleme sayfası kullanımı"
            Eğer varsayılan ya da özelleştirilmiş Wallarm engelleme sayfasını kullanmıyorsanız, kullanıcıdan uygun bilgileri almak için [yapılandırmanız](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) çok önemlidir. Unutmayın ki, hatta bir örnek sayfa bile engellenen taleple ilgili anlamlı bilgileri toplar ve kolayca kopyalanmasına olanak sağlar. Ayrıca, kullanıcılara bilgilendirici bir engelleme mesajı döndürmek için böyle bir sayfayı özelleştirebilir veya tamamen yeniden inşa edebilirsiniz.
    
    * Kullanıcının istemci talebinin ve yanıtının kopyası. Tarayıcı sayfa kaynak kodu veya terminal istemcisi metin girişi ve çıkışı iyi uyar.

1. Wallarm Konsolu → [**Olaylar**](../user-guides/events/check-attack.md) bölümünde, engellenen taleple ilgili olayı [arama](../user-guides/search-and-filters/use-search.md) yapın. Örneğin, [talep ID'si ile arama yapın](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. Yanlış veya meşru engellemeyi belirlemek için olayı inceleyin.
1. Eğer yanlış bir engelleme ise, problemi şu önlemlerden birini veya bir kombinasyonunu uygulayarak çözün: 

    * [Yanlış pozitiflere](../user-guides/events/false-attack.md) karşı önlemler
    * [Kural](../user-guides/rules/rules.md)ları yeniden yapılandırma
    * [Tetikleyicileri](../user-guides/triggers/triggers.md) yeniden yapılandırma
    * [IP listelerini](../user-guides/ip-lists/overview.md) düzenleme

1. Eğer kullanıcı tarafından başlangıçta sağlanan bilgi eksikse veya hangi önlemlerin güvenli bir şekilde uygulanabileceğinden emin değilseniz, detayları [Wallarm destek](mailto:support@wallarm.com) ile paylaşın ve daha fazla yardım ve inceleme için destek alın.
