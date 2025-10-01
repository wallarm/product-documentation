1. Wallarm Console → **Nodes** bölümünde, postanalytics modülü düğümünüzü seçip **Delete**'e tıklayarak eski postanalytics modülünü silin.
1. Eylemi onaylayın.
    
    postanalytics modülü düğümü Wallarm Cloud'dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesine katılmayı durduracaktır. Silme işlemi geri alınamaz. postanalytics modülü düğümü düğüm listesinden kalıcı olarak silinecektir.

1. Eski postanalytics modülü içeren makineyi silin veya sadece Wallarm postanalytics modül bileşenlerini kaldırın:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node-tarantool
        ```
    === "CentOS veya Amazon Linux 2.0.2021x ve altı"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node-tarantool
        ```