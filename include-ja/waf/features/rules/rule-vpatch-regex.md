たとえば、`example.com`ドメインでアクセス可能なアプリケーションが、ユーザー認証に32文字の16進数形式の`X-AUTHENTICATION`ヘッダーを使用しており、不正な形式のトークンを拒否したいとします。

そのためには、スクリーンショットのとおり、**Create regexp-based attack indicator**ルールを**Virtual patch**に設定し、次の値を指定します:

* Regular expression: `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
* Request part: `header` - `X-AUTHENTICATION`

![正規表現ルールの例1][img-regex-example1]