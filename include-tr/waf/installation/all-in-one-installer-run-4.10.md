1. İndirilen betiği çalıştırın:

    === "API token"
        ```bash
        # If using the x86_64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh
        ```        

        WALLARM_LABELS değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'da düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-4.10.13.x86_64-glibc.sh

        # If using the ARM64 version:
        sudo sh wallarm-4.10.13.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) seçin.
1. Wallarm token'ını girin.