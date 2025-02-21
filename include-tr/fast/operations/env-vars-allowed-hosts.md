[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "Geçerli `ALLOWED_HOSTS` değişken değerleri"
    `ALLOWED_HOSTS` değişkeni aşağıdaki ana bilgisayar formatlarını kabul eder:

    * tam nitelikli adlar (ör. `node.example.local`)
    * bir nokta ile başlayan bir değer (ör. `.example.local`) ve bu, alt alan adı joker karakteri olarak tanınır
    * her şeyi eşleştiren `*` değeri (bu durumda, tüm istekler FAST node tarafından kaydedilir)
    * birkaç değerin kümesi, örneğin: `"(node.example.local|example.com)"`
    * [NGINX tarafından desteklenen sözdiziminde](http://nginx.org/en/docs/http/server_names.html#regex_names) düzenli ifade

    `ALLOWED_HOSTS` değişken değerleri hakkında daha fazla bilgi için, bu [link][link-allowed-hosts]'e göz atın.