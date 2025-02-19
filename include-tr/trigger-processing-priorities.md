When there are several triggers with identical conditions (for example, **Brute force**, **Forced browsing**, **BOLA**) and some of them have nesting level URI, requests to lower nesting level URI will be counted only in the trigger with the filter by the lower nesting level URI.

Aynı koşullara sahip birden fazla tetikleyici olduğunda (örneğin, **Brute force**, **Forced browsing**, **BOLA**) ve bunlardan bazıları URI hiyerarşi düzeyi filtresine sahipse, daha düşük hiyerarşi düzeyine sahip URI’ye yapılan istekler yalnızca daha düşük hiyerarşi düzeyli URI filtresi bulunan tetikleyici tarafından sayılır.

Triggers without URI filter are considered to be the higher nesting level.

URI filtresi olmayan tetikleyiciler, daha yüksek hiyerarşi düzeyi olarak kabul edilir.

**Example:**

**Örnek:**

* The first trigger with some condition has no filter by the URI (requests to any application or its part are counted by this trigger).

* Belirli bir koşula sahip ilk tetikleyicide URI filtresi bulunmaz (herhangi bir uygulamaya veya uygulamanın herhangi bir parçasına yapılan istekler bu tetikleyici tarafından sayılır).

* The second trigger with the same condition has the filter by the URI `example.com/api`.

* Aynı koşula sahip ikinci tetikleyici, `example.com/api` URI filtresine sahiptir.

Requests to `example.com/api` are counted only by the second trigger with the filter by `example.com/api`.

`example.com/api`’ye yapılan istekler yalnızca `example.com/api` filtresine sahip ikinci tetikleyici tarafından sayılır.