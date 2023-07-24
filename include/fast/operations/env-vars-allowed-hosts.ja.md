[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "`ALLOWED_HOSTS`変数の有効な値"
    `ALLOWED_HOSTS`変数は、以下のホスト形式を受け入れます：

    * 完全修飾名（例：`node.example.local`）
    * ピリオドから始まる値（例：`.example.local`）。これはサブドメインのワイルドカードとして認識されます
    * どんなものにでもマッチする`*`の値（この場合、すべてのリクエストがFASTノードによって記録されます）
    * 複数の値のセット、たとえば：`"(node.example.local|example.com)"`
    * NGINXでサポートされている[syntaxによる正規表現](http://nginx.org/en/docs/http/server_names.html#regex_names)

    `ALLOWED_HOSTS`変数の値に関する詳細情報は、この[link][link-allowed-hosts]へ進んでください。