[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! bilgi "Geçerli `ALLOWED_HOSTS` değişken değerleri"
    `ALLOWED_HOSTS` değişkeni aşağıdaki ana bilgisayar formatlarını kabul eder:

    * tam olarak nitelendirilmiş isimler (örneğin `node.example.local`)
    * bir nokta ile başlayan bir değer (örneğin `.example.local`) alt alan adı joker karakteri olarak tanınır
    * `*` değeri her şeyle uyumlu olur (bu durumda, tüm istekler FAST düğümü tarafından kaydedilir)
    * birden fazla değer kümesi, örneğin: `"(node.example.local|example.com)"`
    * [NGINX tarafından desteklenen sözdiziminde](http://nginx.org/en/docs/http/server_names.html#regex_names) düzenli ifade 

    `ALLOWED_HOSTS` değişken değerleri hakkında daha fazla bilgi için bu [bağlantıya][link-allowed-hosts] gidin.