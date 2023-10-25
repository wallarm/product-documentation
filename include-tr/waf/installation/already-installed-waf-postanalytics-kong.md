!!! info "Eğer birden fazla Wallarm düğümü kullanıyorsanız"
    Ortamınıza konuşlanan tüm Wallarm düğümlerinin aynı **versiyonlarda** olması gerekir. Ayrı sunuculara kurulan postanalytics modülleri de aynı **versiyonlarda** olmalıdır.

    Ek bir düğüm kurulumundan önce, lütfen versiyonunun zaten konuşlanmış modüllerin versiyonuyla eşleştiğinden emin olun. Eğer konuşlanmış modül versiyonu, [deprecated veya yakın zamanda deprecated olacak (`4.0` veya daha düşük)][versioning-policy], tüm modülleri en son versiyona yükseltin.

    Aynı sunucuya kurulu filtreleme düğümünün ve postanalytics modülünün versiyonunu kontrol etmek için:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Farklı sunucularda kurulu filtreleme düğümünün ve postanalytics modülünün versiyonunu kontrol etmek için:

    === "Debian"
        ```bash
        # Wallarm filtering node installed serverdan çalıstırın
        apt list wallarm-node-nginx
        # Postanalytics installed sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # Wallarm filtering node installed serverdan çalıstırın
        apt list wallarm-node-nginx
        # Postanalytics installed sunucudan çalıştırın
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # Wallarm filtering node installed serverdan çalıstırın
        yum list wallarm-node-nginx
        # Postanalytics installed sunucudan çalıştırın
        yum list wallarm-node-tarantool
        ```