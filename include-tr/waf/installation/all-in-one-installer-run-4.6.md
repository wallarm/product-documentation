1. İndirilen betiği çalıştırın:

    === "API belirteci"
        ```bash
        # Eğer x86_64 versiyonunu kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.14.x86_64-glibc.sh

        # Eğer ARM64 versiyonunu kullanıyorsanız:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.14.aarch64-glibc.sh
        ```
        
        `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu belirler (Wallarm Console UI'da düğümlerin mantıksal gruplanması için kullanılır).

    === "Düğüm belirteci"
        ```bash
        # Eğer x86_64 versiyonunu kullanıyorsanız:
        sudo sh wallarm-4.6.14.x86_64-glibc.sh

        # Eğer ARM64 versiyonunu kullanıyorsanız:
        sudo sh wallarm-4.6.14.aarch64-glibc.sh
        ```

1. [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) seçin.
1. Wallarm belirtecini girin.