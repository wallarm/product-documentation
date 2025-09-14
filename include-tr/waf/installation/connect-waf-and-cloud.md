Wallarm node, Wallarm Cloud ile etkileşime girer. Filtreleme düğümünü Cloud'a bağlamak için aşağıdaki adımları izleyin:

1. Wallarm hesabınızda, Wallarm Console içinde **Administrator** veya **Deploy** rolünün etkin ve two-factor authentication'ın devre dışı olduğundan emin olun.
     
    Bu ayarları, [US Cloud](https://us1.my.wallarm.com/settings/users) veya [EU Cloud](https://my.wallarm.com/settings/users) içindeki users list sayfasına giderek kontrol edebilirsiniz.

    ![Wallarm Console'da kullanıcı listesi][img-wl-console-users]

2.  Wallarm node yüklü olan bir sistemde `addnode` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarm Console içindeki hesabınız için e-posta ve parolayı girin.
4. Filtreleme düğümünün adını girin veya otomatik olarak oluşturulan adı kullanmak için Enter tuşuna basın.

    Belirtilen ad daha sonra Wallarm Console → Nodes içinde değiştirilebilir.
5. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içindeki Wallarm Console → Nodes bölümünü açın ve yeni bir filtreleme düğümünün listeye eklendiğinden emin olun.