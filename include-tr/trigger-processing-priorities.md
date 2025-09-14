Koşulları aynı olan birden fazla tetikleyici (örneğin, **Brute force**, **Forced browsing**, **BOLA**) bulunduğunda ve bunların bazılarında URI’ye göre yuvalanma düzeyi filtresi varsa, daha düşük yuvalanma düzeyindeki URI’lere yönelik istekler yalnızca daha düşük yuvalanma düzeyindeki URI’ye göre filtreye sahip tetikleyici tarafından sayılır.

URI filtresi olmayan tetikleyiciler daha üst yuvalanma düzeyi olarak kabul edilir.

**Örnek:**

* Belirli bir koşula sahip ilk tetikleyicide URI’ye göre filtre yoktur (herhangi bir uygulamaya veya onun bir bölümüne yönelik istekler bu tetikleyici tarafından sayılır).
* Aynı koşula sahip ikinci tetikleyicide `example.com/api` URI’sine göre filtre vardır.

`example.com/api` adresine yönelik istekler, yalnızca `example.com/api` filtresine sahip ikinci tetikleyici tarafından sayılır.