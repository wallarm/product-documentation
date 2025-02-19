[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "有効な`ALLOWED_HOSTS`変数の値"
    `ALLOWED_HOSTS`変数で受け入れ可能なホスト形式は以下の通りです:

    * 完全修飾名 (例:`node.example.local`)
    * ピリオドで始まる値 (例:`.example.local`) はサブドメインワイルドカードとして認識されます
    * `*` の値は何にでも一致します（この場合、すべてのリクエストがFAST nodeによって記録されます）
    * 複数の値のセット、例えば: `"(node.example.local|example.com)"`
    * NGINXがサポートする[構文](http://nginx.org/en/docs/http/server_names.html#regex_names)による正規表現

    `ALLOWED_HOSTS`変数の値の詳細については、この[リンク][link-allowed-hosts]を参照してください。