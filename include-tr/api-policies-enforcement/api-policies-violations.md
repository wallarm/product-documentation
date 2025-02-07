* **Belirlenmemiş uç noktaya istek** - bir istek, spesifikasyonunuzda tanımlanmayan bir uç noktaya gönderilir
* **Tanımlanmamış parametre ile uç noktaya istek** - bir istek, spesifikasyonunuzda bu uç nokta için belirtilmeyen bir parametre içerir
* **Gerekli parametre olmadan uç nokta isteği** - bir istek, spesifikasyonunuzda gerekli olarak işaretlenmiş parametre veya değerini içermez
* **Geçersiz parametre değeri ile uç noktaya istek** - bir istek parametresinin değeri, spesifikasyonunuzda tanımlanan tür/format ile uyumlu değildir
* **Kimlik doğrulama yöntemi olmadan uç noktaya istek** - bir istek, kimlik doğrulama yöntemi hakkında bilgi içermez
* **Geçersiz JSON ile uç noktaya istek** - bir istek, geçersiz bir JSON içerir

Sistem, tespit edilen tutarsızlık durumunda aşağıdaki işlemleri gerçekleştirebilir:

* **Block** - isteği engeller ve [**Attacks**](../user-guides/events/check-attack.md) bölümüne engellenmiş olarak ekler

    !!! info "Filtration mode"
        Wallarm node, yalnızca hedef uç nokta için engelleme [filtration mode][waf-mode-instr] etkinleştirildiğinde isteği engeller - aksi takdirde, **Monitor** eylemi uygulanır.

* **Monitor** - isteği yanlış olarak işaretler, ancak engellemez; **Attacks** bölümüne izlenen olarak ekler
* **Not tracked** - herhangi bir işlem yapmaz

Bir politikanın belirlenmesinde birden fazla spesifikasyonun kullanılabileceğini unutmayın. Bir istek iki farklı spesifikasyona (aynı politika ve farklı spesifikasyonlardaki farklı eylemler) uyması durumunda, aşağıdaki durumlar gerçekleşir:

* **Block** ve **Block** - istek engellenecek ve **Attacks** bölümüne `Blocked` durumu ile iki etkinlik eklenecek; bu etkinlikler engelleme nedenini ve isteğin iki farklı spesifikasyonu ihlal ettiğini gösterecektir.
* **Monitor** ve **Block** - istek engellenecek ve **Attacks** bölümüne `Blocked` durumu ile tek bir etkinlik eklenecek; bu etkinlik engelleme nedenini açıklayacaktır.
* **Monitor** ve **Monitor** - istek engellenmeyecek ve **Attacks** bölümüne `Monitoring` durumu ile iki etkinlik eklenecek; bu etkinlikler belirli politikanın ihlal edildiğini gösterecektir.