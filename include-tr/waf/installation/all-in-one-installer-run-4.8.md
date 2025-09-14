1. İndirilen betiği çalıştırın:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.10.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI içinde düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.10.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.10.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) seçin.
1. Wallarm token'ını girin.