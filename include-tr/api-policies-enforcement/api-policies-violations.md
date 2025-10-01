* **Tanımlanmamış bir uç noktaya istek** - bir istek, spesifikasyonunuzda yer almayan bir uç noktayı hedefler
* **Tanımlanmamış parametreye sahip uç noktaya istek** - bir istek, spesifikasyonunuzda bu uç nokta için sunulmamış bir parametre içerir
* **Gerekli parametre olmadan uç noktaya istek** - bir istek, spesifikasyonunuzda gerekli olarak işaretlenen parametreyi veya değerini içermez
* **Geçersiz parametre değeriyle uç noktaya istek** - bir istek parametresinin değeri, spesifikasyonunuzda tanımlanan tür/biçim ile uyumlu değildir
* **Kimlik doğrulama yöntemi olmadan uç noktaya istek** - bir istek, kimlik doğrulama yöntemi hakkında bilgi içermez
* **Geçersiz JSON ile uç noktaya istek** - bir istek geçersiz bir JSON içerir

Tutarsızlık tespit edilmesi durumunda sistem aşağıdaki eylemleri gerçekleştirebilir:

* **Block** - bir isteği engeller ve [**Attacks**](../user-guides/events/check-attack.md) bölümüne blocked olarak ekler

    !!! info "Filtreleme modu"
        Wallarm düğümü, hedef uç nokta için engelleme [filtreleme modu][waf-mode-instr] etkinleştirildiğinde istekleri engelleyecektir; aksi halde **Monitor** eylemi uygulanacaktır.

* **Monitor** - bir isteği hatalı olarak işaretler, ancak engellemez; **Attacks** bölümüne monitored olarak ekler
* **Not tracked** - hiçbir işlem yapmaz

Politikaları ayarlamak için birden fazla spesifikasyon kullanılabilir. Bir istek iki farklı spesifikasyon kapsamına girerse (aynı politika ve farklı spesifikasyonlarda farklı eylemler), aşağıdakiler gerçekleşir:

* **Block** ve **Block** - istek engellenecek ve **Attacks** bölümüne, engellemenin nedenini ve isteğin iki farklı spesifikasyonu ihlal ettiğini belirten `Blocked` durumuyla iki olay eklenecektir.
* **Monitor** ve **Block** - istek engellenecek ve **Attacks** bölümüne engellemenin nedenini açıklayan `Blocked` durumuyla bir olay eklenecektir.
* **Monitor** ve **Monitor** - istek engellenmeyecek ve **Attacks** bölümüne, belirli politikanın ihlal edildiğini belirten `Monitoring` durumuyla iki olay eklenecektir.