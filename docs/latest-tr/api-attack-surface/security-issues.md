# Güvenlik Sorunlarını Tespit Etme <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

[API Surface Discovery](api-surface.md) etki alanlarınızın dış ana bilgisayarlarını bulduktan sonra, Wallarm bu ana bilgisayarların herhangi bir güvenlik sorunu olup olmadığını kontrol eder. Sorunlar tespit edildikten sonra **Security Issues** bölümünde listelenir ve açıklanır. Bu makale, sunulan bilgilerin nasıl kullanılacağını açıklamaktadır.

## Güvenlik Sorunlarını Keşfetme

Dış ana bilgisayarlarınız için tespit edilen güvenlik sorunlarını incelemek üzere, Wallarm Console’da AASM'nin **Security Issues** bölümüne gidin.

![Security Issues](../images/api-attack-surface/security-issues.png)

Burada, tespit edilen sorunlara ilişkin detaylı bilgiler sunulmaktadır; bunlar:

* Kısa ve ayrıntılı sorun açıklaması
* Risk seviyesi değerlendirmesi ve bu seviyelere göre güvenlik sorunlarının dağılımı
* En savunmasız ana bilgisayarlar listesi

## Güvenlik Sorunlarını Aramak İçin Etki Alanlarınızı Tanımlayın

Güvenlik sorunlarını aramak istediğiniz kök etki alanlarınızın bir listesini tanımlayabilirsiniz:

1. **API Attack Surface** veya **Security Issues** bölümünde, **Configure**'a tıklayın.
1. **Scope** sekmesinde, etki alanlarınızı ekleyin.

Wallarm, etki alanı altında yayınlanan alt alan adları ve sızmış kimlik bilgilerini aramaya başlayacaktır. Arama ilerlemesi ve sonuçları **Status** sekmesinde gösterilecektir.

![Security issues - configuring scope](../images/api-attack-surface/security-issues-configure-scope.png)

## API Sızıntıları

Wallarm, API sızıntısı güvenlik sorunlarını aşağıdaki iki aşamalı prosedürle arar:

1. **Passive scan**: Bu etki alanlarıyla ilgili yayınlanmış (sızmış) verileri kontrol etmek için genel kaynakları tarar.
1. **Active scan**: Listelenen etki alanlarında otomatik olarak alt alan adlarını arar. Sonrasında – kimliği doğrulanmamış bir kullanıcı olarak – uç noktalara istek gönderir ve yanıtları ile sayfa kaynak kodlarını hassas verilerin varlığı açısından kontrol eder. Aşağıdaki veriler aranır: kimlik bilgileri, API keys, client secrets, authorization tokens, e-posta adresleri, genel ve özel API şemaları (API specifications).

Bulunan sızıntılarla ilgili ne yapılacağına dair kararları yönetebilirsiniz:

* Eğer dağıtılmış bir Wallarm [node(s)](../user-guides/nodes/nodes.md) varsa, sızmış API kimlik bilgilerini kullanma girişimlerini engellemek için sanal bir yama uygulayın.

    Bir [virtual patch rule](../user-guides/rules/vpatch-rule.md) oluşturulacaktır.
    
    Not: Sanal yama oluşturmak, sızmış gizli değerin 6 veya daha fazla sembol içermesi ya da düzenli ifadenin 4096 sembolden az olması durumunda mümkündür – bu koşullar karşılanmazsa `Not applicable` iyileştirme durumu görüntülenecektir. Bu sınırlamalar, meşru trafiğin engellenmesini önlemeye yöneliktir.

* Sızıntının yanlışlıkla eklendiğini düşünüyorsanız, sızıntıyı yanlış olarak işaretleyin.
* Sorunun çözüldüğünü belirtmek için sızıntıları kapatın.
* Bir sızıntı kapatılsa bile silinmez. Sorunun hâlâ devam ettiğini belirtmek için tekrar açın.

## Sanal Yamalar Tarafından Engellenen İstekleri Görüntüleme

Wallarm Console → **Attacks** bölümünde, **Type** filtresini `Virtual patch` (`vpatch`) olarak ayarlayarak [virtual patches](../user-guides/rules/vpatch-rule.md) tarafından engellenen istekleri görüntüleyebilirsiniz.

![Events - Security issues (API leaks) via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

Not: Bu filtre, yalnızca **Security Issues** işlevselliği nedeniyle oluşan virtual patch olaylarını değil, aynı zamanda farklı amaçlarla oluşturulan diğer tüm virtual patch'leri de listeleyecektir.