1. İndirilen script dosyasını çalıştırın:

    === "API token"
        ```bash
        # Eğer x86_64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.x86_64-glibc.sh

        # Eğer ARM64 sürümü kullanılıyorsa:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.0.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'da düğümlerin mantıksal gruplanması için kullanılır).

    === "Node token"
        ```bash
        # Eğer x86_64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.x86_64-glibc.sh

        # Eğer ARM64 sürümü kullanılıyorsa:
        sudo sh wallarm-5.3.0.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) seçin.
1. Wallarm token'ınızı girin.