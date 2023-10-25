Tümleşik yükleyiciyle postanalytics'i ayrı ayrı yüklemek için kullanın:

=== "API belirteci"
    ```bash
    # Eğer x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Eğer ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu ayarlar (Wallarm Konsol Arayüzünde düğümlerin mantıksal gruplaması için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # Eğer x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Eğer ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```