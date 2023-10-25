1. İndirilen scripti çalıştırın:

    === "API belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh
        ```        

        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Konsolu Kullanıcı Arayüzündeki düğümlerin mantıksal gruplandırılması için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # x86_64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.x86_64-glibc.sh

        # ARM64 sürümünü kullanıyorsanız:
        sudo sh wallarm-4.8.0.aarch64-glibc.sh
        ```

1. [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) seçin.
1. Wallarm belirtecini girin.