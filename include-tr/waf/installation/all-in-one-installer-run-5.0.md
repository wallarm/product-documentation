1. İndirilen betiği çalıştırın:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.16.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.16.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'de düğümlerin mantıksal olarak gruplanması için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-5.3.16.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-5.3.16.aarch64-glibc.sh
        ```

1. [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) seçin.
1. Wallarm belirtecini girin.