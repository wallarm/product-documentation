# Meşru İstek Engellendi

Kullanıcınız, Wallarm önlemlerine rağmen meşru bir isteğin engellendiğini bildiriyorsa, bu makalenin açıkladığı şekilde isteklerini gözden geçirip değerlendirebilirsiniz.

Wallarm tarafından meşru bir isteğin engellenmesi sorununun çözümü için aşağıdaki adımları izleyin:

1. Kullanıcıdan **metin olarak** (ekran görüntüsü değil) engellenen istek ile ilgili bilgileri sağlamasını isteyin; bu, aşağıdakilerden biri olabilir:

    * Wallarm [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) tarafından sağlanan bilgi (yapılandırılmışsa) (kullanıcının IP adresi, istek UUID'si ve önceden yapılandırılmış diğer öğeleri içerebilir).

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "Blocking page usage"
            Eğer varsayılan veya özelleştirilmiş Wallarm blocking page'i kullanmıyorsanız, kullanıcıdan uygun bilgiyi alabilmek için bunun [yapılandırılmasını](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) şiddetle tavsiye ederiz. Unutmayın, örnek bir sayfa bile engellenen isteğe ilişkin anlamlı bilgilerin toplanmasını ve kolay kopyalanmasını sağlar. Ek olarak, kullanıcıya bilgilendirici bir engelleme mesajı döndürmek için bu sayfayı özelleştirebilir veya tamamen yeniden oluşturabilirsiniz.
    
    * Kullanıcının istemci isteğinin ve yanıtının kopyası. Tarayıcı sayfa kaynak kodu veya terminal istemci metin girişi ve çıkışı gayet uygundur.

2. Wallarm Console → [**Attacks**](../user-guides/events/check-attack.md) veya [**Incidents**](../user-guides/events/check-incident.md) bölümünde, engellenen istekle ilgili olayı [arama](../user-guides/search-and-filters/use-search.md). Örneğin, [request ID'ye göre arama](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

3. Yanlış bir engelleme veya meşru engelleme olduğunu belirlemek üzere olayı inceleyin.
4. Yanlış bir engelleme durumu varsa, şu önlemlerden birini veya birkaçını uygulayarak sorunu çözün:

    * [False positives](../user-guides/events/check-attack.md#false-positives) a karşı önlemler
    * [Rules](../user-guides/rules/rules.md) yeniden yapılandırması
    * [Triggers](../user-guides/triggers/triggers.md) yeniden yapılandırması
    * [IP lists](../user-guides/ip-lists/overview.md) düzenlemesi

5. Kullanıcı tarafından başta sağlanan bilgi eksikse veya güvenli bir şekilde uygulanabilecek önlemler konusunda emin değilseniz, daha fazla yardım ve araştırma için detayları [Wallarm support](mailto:support@wallarm.com)'a iletin.