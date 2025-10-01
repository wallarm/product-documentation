[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "Geçerli `ALLOWED_HOSTS` değişken değerleri"
    `ALLOWED_HOSTS` değişkeni aşağıdaki ana makine ad biçimlerini kabul eder:

    * tam nitelikli adlar (örn. `node.example.local`)
    * bir nokta ile başlayan ve alt alan adı jokeri olarak kabul edilen değer (örn. `.example.local`)
    * her şeyle eşleşen `*` değeri (bu durumda, tüm istekler FAST node tarafından kaydedilir)
    * birden fazla değerden oluşan küme, örneğin: `"(node.example.local|example.com)"`
    * NGINX tarafından desteklenen [sözdiziminde](http://nginx.org/en/docs/http/server_names.html#regex_names) düzenli ifade

    `ALLOWED_HOSTS` değişken değerleri hakkında daha fazla bilgi için bu [bağlantıya][link-allowed-hosts] gidin.