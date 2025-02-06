Postanalytics'i tümünü bir arada yükleyiciyle ayrı olarak yüklemek için, aşağıdakileri kullanın:

=== "API belirteci"
    ```bash
    # Eğer x86_64 sürümü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # Eğer ARM64 sürümü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Console UI'daki düğümlerin mantıksal gruplandırılması için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # Eğer x86_64 sürümü kullanıyorsanız:
    sudo sh wallarm-4.10.13.x86_64-glibc.sh postanalytics

    # Eğer ARM64 sürümü kullanıyorsanız:
    sudo sh wallarm-4.10.13.aarch64-glibc.sh postanalytics
    ```