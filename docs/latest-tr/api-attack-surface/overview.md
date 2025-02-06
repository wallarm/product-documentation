# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm'ın **API Attack Surface Management** (**AASM**), tüm dış hostları API'leriyle keşfetmek, Web ve API tabanlı saldırılara karşı korumalarını değerlendirmek, eksik WAF/WAAP çözümlerini belirlemek ve keşfedilen uç noktaların güvenlik sorunlarını tespit etmek üzere tasarlanmış ajan gerektirmeyen bir tespit çözümüdür.

API Attack Surface Management şunları içerir:

* [API Attack Surface Discovery (AASD)](api-surface.md)
* [Security Issues Detection](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## Nasıl Çalışır

API Attack Surface Management ile çalışma aşağıdaki gibidir:

* Abonelik satın alırsınız.
* Tarama yapılacak root alan adlarınızı belirlersiniz.
* Belirtilen alan adları için, Wallarm alt alan adları/hostları arar ve listeler.

    AASM sistemi, pasif DNS analizi, SSL/TLS sertifika analizi, Certificate Transparency Logs analizi gibi çeşitli OSINT yöntemleri ile, arama motorları aracılığıyla ve en sık karşılaşılan alt alan adlarının sayımlanması yoluyla alt alan adlarını toplar.

* Wallarm, her host için coğrafi konum ve veri merkezini belirler.
* Wallarm, her host üzerindeki açığa çıkan API'leri tanımlar.
* Wallarm, hostu koruyan güvenlik çözümleri (WAF/WAAP) belirler ve verimliliklerini değerlendirir.
* Wallarm, bulunan alan adları/hostlar için [güvenlik sorunlarını](security-issues.md) kontrol eder.
* Eğer tespit edilirse, güvenlik sorunları listelenir ve çözebilmeniz için açıklanır.

## Etkinleştirme ve Kurulum

AASM'i kullanmak için, Wallarm'ın [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) abonelik planının şirketinizde aktif olması gerekir. Etkinleştirmek için aşağıdakilerden birini yapın:

* Eğer henüz bir Wallarm hesabınız yoksa, fiyatlandırma bilgilerini alın ve Wallarm'ın resmi sitesinde [buradan](https://www.wallarm.com/product/aasm) AASM'i etkinleştirin.

    Etkinleştirme sırasında, kullanılan e-posta alan adının taranması satış ekibi ile görüşürken hemen başlar. Etkinleştirmeden sonra, ek alan adlarını kapsamınıza ekleyebilirsiniz.

* Eğer zaten bir Wallarm hesabınız varsa, [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

Abonelik etkinleştirildikten sonra, alan tespiti yapılandırmak ve güvenlik sorunlarını aramaya başlamak için Wallarm Console → AASM → **API Attack Surface** veya **Security Issues** bölümünde **Configure**'a tıklayın. Alan adlarınızı kapsamınıza ekleyin, tarama durumunu kontrol edin.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Wallarm, tüm alt alan adlarını listeleyecek ve varsa onlarla ilgili güvenlik sorunlarını gösterecektir. Alan adlarının günlük olarak otomatik yeniden tarandığını unutmayın - yeni alt alan adları otomatik olarak eklenecek, daha önce listelenip yeniden taramada bulunamayanlar listede kalacaktır.

Herhangi bir alan için **Configure** → **Status** bölümüne giderek taramayı yeniden başlatabilir, duraklatabilir veya devam ettirebilirsiniz.