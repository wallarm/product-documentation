1. İndirilen betiği çalıştırın:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.5.1.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'de düğümlerin mantıksal olarak gruplandırılması için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-6.5.1.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) seçin.
1. Wallarm token'ını girin.