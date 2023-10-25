!!! info "Eğer birden çok Wallarm düğümü yerleştiriyorsanız"
    Ortamınıza yerleştirilen tüm Wallarm düğümlerinin **aynı versiyonlarda** olması gerekmektedir. Ayrı sunucularda kurulu olan postanalytics modülleri de **aynı versiyonlarda** olmalıdır.

    Ek bir düğümün yüklemesinden önce, versiyonunun zaten yerleştirilmiş modüllerin versiyonuyla eşleştiğinden emin olun. Eğer yerleştirilmiş modül versiyonu [yakında kullanım dışı bırakılacak veya kullanım dışı (`4.0` veya daha düşük)][versioning-policy] ise, tüm modülleri en son versiyona yükseltin.

    Aynı sunucuya yerleştirilen filtreleme düğümünün ve postanalytics modülünün versiyonunu kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunuculara yerleştirilen filtreleme düğümünün ve postanalytics modülünün versiyonunu kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtreleme düğümünün kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-nginx
        # postanalytics'in kurulu olduğu sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```
