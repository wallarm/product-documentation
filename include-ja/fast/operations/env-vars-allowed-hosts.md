[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "`ALLOWED_HOSTS` 変数の有効な値"
    `ALLOWED_HOSTS`変数は次のホスト形式を受け入れます：

    * 完全に限定された名前（例：`node.example.local`）
    * ピリオドで始まる値（例：`.example.local`）。これはサブドメインのワイルドカードとして認識されます
    * 何でも一致する`*`の値（この場合、すべてのリクエストはFASTノードに記録されます）
    * 複数の値のセット、例：`"(node.example.local|example.com)"`
    * NGINXによってサポートされている[syntaxでの正規表現](http://nginx.org/en/docs/http/server_names.html#regex_names)

    `ALLOWED_HOSTS`変数の値についての詳細情報は、次の[リンク][link-allowed-hosts]をご覧ください。