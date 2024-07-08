# Brüt güç korumasının yapılandırılması

Davranışsal saldırı (brüt-kuvvet saldırısı) Wallarm'ın uygun şekilde yapılandırılmışsa algılayabileceği saldırı türlerinden biridir. Bu talimatlar, Wallarm düğümünü, brüt-kuvvet saldırılara karşı uygulamalarınızı korumak üzere yapılandırmak için adımlar sunar. Varsayılan olarak, Wallarm düğümü brüt-kuvvet saldırılarını algılamaz.

Aşağıdaki sınıflarında brüt-kuvvet saldırıları bulunur:

* [Düzenli brüt-kuvvet saldırıları](../../attacks-vulns-list.md#brute-force-attack): parola brüt-kuvvetleme, oturum tanımlayıcı brüt-kuvvetleme, kimlik bilgileri doldurma. Bu saldırılar, kısıtlı bir zaman çerçevesinde tipik bir URI'ye farklı zor tanımlama değerlerine sahip bir dizi istekle karakterizedir.
* [Zorla gezinme](../../attacks-vulns-list.md#forced-browsing). Bu saldırılar, kısıtlı bir zaman çerçevesinde farklı URI'lara yönlendirilen isteklere bir dizi 404 yanıt kodu ile karakterizedir.
    
    Bu saldırının amacı, gizli kaynakları (ör. uygulama bileşenleri hakkında bilgi içeren dizinler ve dosyalar) numaralandırmaktır ve erişim sağlamaktır. Zorla gezinme saldırı türü genellikle saldırganların, uygulama hakkında bilgi toplamalarına ve bu bilgileri istismar ederek diğer saldırı türlerini gerçekleştirmelerine izin verir.

[Detaylı brüt kuvvet açıklaması →](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)

!!! warning "Brüt kuvvet koruma kısıtlamaları"
    Brüt-kuvvet saldırı belirtilerini ararken, Wallarm düğümleri yalnızca diğer saldırı türlerinin belirtilerini içermeyen HTTP isteklerini analiz eder. Örneğin, aşağıdaki durumlarda isteklerin bir brüt-kuvvet saldırısının parçası olduğu düşünülmez:

    * Bu istekler [giriş doğrulama saldırıları](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) belirtileri içerir.
    * Bu istekler, [**Düzenli ifade tabanlı saldırı göstergesi oluştur** kuralındaki](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) belirtilen düzenli ifadeyle eşleşir.

## Yapılandırma adımları

1. Filtreleme düğümü bir proxy sunucusu veya yük dengeleyicinin arkasına konumlandırılmışsa, istemcinin gerçek IP adresinin [görüntülenmesini yapılandırın](../using-proxy-or-balancer-en.md).
1. Tetiği **Brüt Kuvvet** veya **Zorlanmış Gezinme** için [yapılandırın](#configuring-the-trigger-to-identify-brute-force).
1. Brüt kuvvet korumasinin [yapılandırılmasını test edin](#testing-the-configuration-of-brute-force-protection).

## Brüt kuvveti belirlemek için tetiğin yapılandırılması

!!! info "İstek sayısı için tetikleyiciler"
    Aşağıda, brüt-kuvvet korumasının basitleştirilmiş yapılandırılması açıklanmıştır. Tetik koşulu **İstek sayısı** şimdi farklı brüt-kuvvet saldırı sınıfı algılaması için iki koşul ile değiştirilmiştir. Ayrıca, **Zorla gezinme / brüt-kuvvet saldırısı olarak istekleri etiketle** kurallarını kurma artık gerekli değildir.
    
    **İstek sayısı** için tetikleyici ve saldırıları etiketleme kuralları yapılandırıldıysa, hala çalışırlar ama kurallar güncellenemez veya yeniden oluşturulamaz. Bununla birlikte, geçerli yapılandırmayı aşağıda açıklanan şekilde basitleştirmenizi ve eski tetikleyicileri devre dışı bırakmanızı öneririz.

Tetikleyiciler, brüt-kuvvet saldırısının algılanması için koşulları belirler. Algılanacak brüt-kuvvet saldırı sınıfına bağlı olarak, aşağıdaki koşulları ayarlayabilirsiniz:

* **Brüt Kuvvet** aynı IP adresinden kaynaklanan istek sayısına dayalı düzenli brüt-kuvvet saldırılarını algılamak için.
* **Zorla Gezinme** aynı kökenli IP isteklerine yanıt olarak geri dönen 404 yanıt kodlarının sayısına dayalı zorla gezinme saldırılarını algılamak için.

Tetiği yapılandırma adımları:

1. Wallarm Konsolunu açın → **Tetikleyiciler** bölümünü ve tetikleyici oluşturma penceresini açın.
2. Algılanacak brüt-kuvvet saldırı sınıfına bağlı olarak **Brüt Kuvvet** veya **Zorla Gezinme** koşulunu seçin.
3. Eşiği ayarlayın:
   
    * Tetik koşulu **Brüt Kuvvet** ise - Eşik, belirli bir süre boyunca aynı IP adresinden kaynaklanan istek sayısı içindir.
    * Tetik koşulu **Zorla Gezinme** ise - Eşik, aynı kökenli IP isteklerine geri dönen 404 yanıt kodlarının sayısı içindir.
4. Gerekirse, belirli uç noktalara gönderilen istekler için tetiği yalnızca etkinleştirmek üzere **URI** belirtin, örneğin:

    * Parola brüt-kuvvetlemesi korumasını yapılandırıyorsanız, kimlik doğrulama için kullanılan URI'yi belirtin.
    * Zorla gezinme saldırılarına karşı koruma yapılandırıyorsanız, kaynak dosya dizininin URI'sini belirtin.
    * Eğer URI belirtilmemişse, istek sayısı eşiği aşan herhangi bir uç noktada tetikleyici etkinleştirilir.

   URI, tetikleyici oluşturma penceresinde [URI yapıcısı](../../user-guides/rules/rules.md#uri-constructor) veya [gelişmiş düzenleme formu](../../user-guides/rules/rules.md#advanced-edit-form) aracılığıyla yapılandırılabilir.

    !!! warning "İç içe URI'lerle tetikleyiciler"
       Eşleşen koşullara sahip tetikleyicilerde iç içe URI'ler belirtilirse, daha düşük iç içe seviye URI'ye yapılan istekler yalnızca daha düşük iç içe seviye URI ile filtreye sahip tetikleyicide sayılır. Aynı şey 404 yanıt kodları için de geçerlidir.

        Koşullarında URI olmayan tetikleyiciler daha yüksek iç içe seviye olarak kabul edilir.

        **Örnek:**

        * **Brüt Kuvvet** koşulu ile ilk tetikleyicinin URI'ye yönelik bir filtresi yoktur (bu tetikleyici tarafından herhangi bir uygulamaya veya onun bir parçasına yapılan tüm istekler sayılır).
        * **Brüt Kuvvet** koşulu ile ikinci tetikleyicinin `example.com/api` URI'sine yönelik bir filtresi vardır.

         `example.com/api` adresine yapılan istekler yalnızca, `example.com/api` filtresi olan ikinci tetikleyici tarafından sayılır.
5. Gerekirse, diğer tetikleyici filtrelerini ayarlayın:
  
   * İsteklerin hitap ettği **Uygulama**.
   * Tek veya daha fazla isteğin gönderildiği **IP**.
6. Tetikleyici tepkilerini seçin:

    * Tetikleyici koşulu **Brüt Kuvvet** ise - tepki **Brüt kuvvet olarak işaretle**. Eşik aşıldıktan sonra alınan istekler brüt-kuvvet saldırısı olarak işaretlenir ve Wallarm Konsolu'nun **Etkinlikler** bölümünde gösterilir.
    * Tetikleyici koşulu **Zorla Gezinme** ise - tepki **Zorla Gezinme olarak işaretle**. Eşik aşıldıktan sonra alınan istekler Zorla Gezinme saldırısı olarak işaretlenir ve Wallarm Konsolu'nun **Etkinlikler** bölümünde gösterilir.
    * **IP adresini reddet** ve IP adresinin engelleneceği süre, kötü amaçlı istek kaynaklarının IP adreslerini [reddetme listesine](../../user-guides/ip-lists/denylist.md) eklemek için. Wallarm düğümü, eşiği aştıktan sonra reddetme listesine eklenen IP'den kaynaklanan tüm istekleri engeller.
    * **IP adresini gri liste yap** ve [gri liste](../../user-guides/ip-lists/graylist.md) yapılacak kötü amaçlı istek kaynaklarının IP adresleri için süreyi ayarlayın. Wallarm düğümü, isteklerin [giriş doğrulaması](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [`vpatch`](../../user-guides/rules/vpatch-rule.md) veya [özel](../../user-guides/rules/regex-rule.md) saldırı belirtileri içermesi durumunda gri listeye eklenen IP'lerden kaynaklanan istekleri engeller. Gri listeye eklenen IP'lerden kaynaklanan brüt-kuvvet saldırıları engellenmez.
6. Tetiği kaydedin ve [Bulut ve düğüm senkronizasyonu tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

`https://example.com/api/v1/login` adresine yöneltilen düzenli brüt-kuvvet saldırılarını engellemek için **Brüt Kuvvet** tetiğinin örneği:

![Brüt Kuvvet tetikleyici örneği](../../images/user-guides/triggers/trigger-example6.png)

Sağlanan örneğin açıklaması ve brüt kuvvet koruması için kullanılan diğer tetikleyici örnekleri bu [link](../../user-guides/triggers/trigger-examples.md#mark-requests-as-a-bruteforce-attack-if-31-or-more-requests-are-sent-to-the-protected-resource) içinde mevcuttur.

Brüt kuvvet koruması için birkaç tetikleyici yapılandırabilirsiniz.

## Brüt kuvvet korumasının yapılandırılmasının test edilmesi

1. Korunan URI'ye, yapılandırılan eşiği aşan sayıda istek gönderin. Örneğin, `example.com/api/v1/login` adresine 50 istek:

   ```bash
   for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/v1/login ; done
   ```
2. Tetikleyici tepkisi **IP adresini reddet** ise, Wallarm Konsolunu açın → **IP listeleri** → **Reddetme Listesi** ve kaynak IP adresinin engellendiğini kontrol edin.

   Tetikleyici tepkisi **IP adresini gri liste yap** ise, Wallarm Konsolu'nun **IP listeleri** → **Gri Liste** bölümünü kontrol edin.
3. **Etkinlikler** bölümünü açın ve isteklerin listeye brüt-kuvvet veya zorla gezinme saldırısı olarak eklenmiş olduğunu kontrol edin.

   ![Arayüzdeki zorla gezinme saldırısı](../../images/user-guides/events/forced-browsing-attack.png)

   Gösterilen isteklerin sayısı, tetikleyici eşiğinin aşıldıktan sonra gönderilen istek sayısına denk gelir ([davranışsal saldırıları algılama hakkında daha fazla detay](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Eğer bu sayı 5'ten fazlaysa, örnek alma uygulanır ve istek ayrıntıları yalnızca ilk 5 isabet için gösterilir ([isteklerin örnekleme hakkında daha fazla detay](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

   Saldırıları aramak için, örneğin: zorla gezinme saldırıları için `dirbust`, brüt-kuvvet saldırıları için `brute` filtrelerini kullanabilirsiniz. Tüm filtreler, [arama kullanım talimatları](../../user-guides/search-and-filters/use-search.md)nda açıklanmıştır.