Wallarm düğümü, Wallarm Bulutu ile etkileşim kurar. Filtreleme düğümünü Buluta bağlamak için aşağıdaki adımları izleyin:

1. Wallarm hesabınızın Wallarm Konsolu'nda **Yönetici** veya **Yayınlama** rolüne sahip olduğunu ve iki faktörlü kimlik doğrulamanın devre dışı bırakıldığını kontrol edin.
    
    Bahsedilen ayarları [ABD Bulutu](https://us1.my.wallarm.com/settings/users) veya [AB Bulutu](https://my.wallarm.com/settings/users) kullanıcı listesine giderek kontrol edebilirsiniz.

    ![Wallarm konsolunda kullanıcı listesi][img-wl-console-users]

2. Kurulu Wallarm düğümü olan bir sistemde `addnode` betiğini çalıştırın:
   
    === "ABD Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "AB Bulutu"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarm Konsolu'ndaki hesabınız için e-posta ve parola girin.
4. Filtreleme düğümü adını girin veya otomatik olarak oluşturulan bir ismi kullanmak için Enter'a tıklayın.

    Belirtilen ad Wallarm Konsolu → **Düğümler** kısmında daha sonra değiştirilebilir.
5. [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes) Wallarm Konsolu → **Düğümler** bölümünü açın ve yeni bir filtreleme düğümünün listeye eklendiğinden emin olun.