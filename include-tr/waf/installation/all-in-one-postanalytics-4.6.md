Tek bir yükleyici ile postanalytics'i ayrıca kurmak için, aşağıdakileri kullanın:

=== "API belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.6.15.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GRUP>' sh wallarm-4.6.15.aarch64-glibc.sh postanalytics
    ```        

    `WALLARM_LABELS` değişkeni, nodun ekleneceği grubu belirler (Wallarm Konsol UI'da nodların mantıksal gruplanması için kullanılır).

=== "Nod belirteci"
    ```bash
    # x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.6.15.x86_64-glibc.sh postanalytics

    # ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.6.15.aarch64-glibc.sh postanalytics
    ```