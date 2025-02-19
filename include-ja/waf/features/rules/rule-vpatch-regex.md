たとえば、`example.com`ドメイン上でアクセス可能なアプリケーションが、ユーザー認証に32桁の十六進数字形式の`X-AUTHENTICATION`ヘッダーを使用し、誤った形式のトークンを拒否したいとします。

そのためには、スクリーンショットに表示されているように、**Create regexp-based attack indicator**ルールを設定し、**Virtual patch**に設定します。以下の内容を含めます:

* Regular expression: `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
* Request part: `header` - `X-AUTHENTICATION`

![Regex rule first example][img-regex-example1]