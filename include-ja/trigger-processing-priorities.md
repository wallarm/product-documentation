同一の条件を持つtriggerが複数存在し(例えば、**Brute force**、**Forced browsing**、**BOLA**)、その一部がURIのネストレベルでフィルターを設定している場合、より下位のネストレベルのURIへのリクエストは、その下位ネストレベルのURIでフィルターするtriggerでのみカウントされます。

URIフィルターのないtriggerは、より上位のネストレベルと見なされます。

**例:**

* ある条件を持つ最初のtriggerにはURIによるフィルターがありません(任意のアプリケーションまたはその一部へのリクエストがこのtriggerでカウントされます)。
* 同じ条件を持つ2つ目のtriggerにはURI`example.com/api`によるフィルターがあります。

`example.com/api`へのリクエストは、`example.com/api`でフィルターする2つ目のtriggerでのみカウントされます。