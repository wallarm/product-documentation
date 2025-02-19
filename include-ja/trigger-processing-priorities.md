When there are several triggers with identical conditions (for example, **Brute force**, **Forced browsing**, **BOLA**) and some of them have nesting level URI, requests to lower nesting level URI will be counted only in the trigger with the filter by the lower nesting level URI.

Triggers without URI filter are considered to be the higher nesting level.

**例:**

* 最初のトリガーは特定の条件を持っており、URIフィルタが設定されていません（任意のアプリケーションまたはその一部へのリクエストがこのトリガーで計上されます）。
* 同じ条件を持つ2つ目のトリガーはURIフィルタとして`example.com/api`を指定しています。

`example.com/api`へのリクエストは、`example.com/api`フィルタを持つ2つ目のトリガーのみで計上されます。