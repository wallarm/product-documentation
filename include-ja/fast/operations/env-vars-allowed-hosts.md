[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "有効な`ALLOWED_HOSTS`変数の値"
    `ALLOWED_HOSTS`変数は、次のホスト形式を受け付けます。

    * 完全修飾名（例: `node.example.local`）
    * 先頭がドットの値（例: `.example.local`）は、サブドメインのワイルドカードとして認識されます
    * すべてに一致する`*`の値（この場合、すべてのリクエストはFAST nodeによって記録されます）
    * 複数の値のセット（例: `"(node.example.local|example.com)"`）
    * [NGINXでサポートされている構文](http://nginx.org/en/docs/http/server_names.html#regex_names)の正規表現

    `ALLOWED_HOSTS`変数の値の詳細については、この[リンク][link-allowed-hosts]をご参照ください。