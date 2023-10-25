[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "API Erişimi"
    Filtreleme düğümünüz için API seçimi, kullandığınız Buluta bağlıdır. Lütfen API'yi buna göre seçin:
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://api.wallarm.com:444`e erişimine ihtiyaç duyar.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com:444`e erişimine ihtiyaç duyar.
    
    Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

Filtreleme düğümü, Wallarm Bulutu ile etkileşim kurar. 

Düğümü bulut hesap bilgileriniz ile buluta bağlamak için aşağıdaki adımları izleyin:

1.  Wallarm hesabınızın **Yönetici** veya **Yayın** rolüne sahip olduğunu ve iki faktörlü kimlik doğrulamanın devre dışı olduğunu, böylece bir filtreleme düğümünü Buluta bağlamanıza izin verdiğini kontrol edin. 
     
    Yukarıda belirtilen parametreleri Wallarm Konsolunda kullanıcı hesabı listesine giderek kontrol edebilirsiniz.
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [ilgili linke][link-wl-console-users-eu] gidin.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [ilgili linke][link-wl-console-users-us] gidin.

    ![Wallarm konsolundaki kullanıcı listesi][img-wl-console-users]

2.  Filtreleme düğümünü kurduğunuz makinede `addnode` betiğini çalıştırın:
    
    !!! info
        Hangi bulutu kullandığınıza bağlı olarak hangi betiği çalıştıracağınızı seçmelisiniz.
    
        * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Cloud** sekmesinden betiği çalıştırın.
        * Eğer <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Cloud** sekmesinden betiği çalıştırın.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    Oluşturulan düğümün adını belirtmek için `-n <düğüm adı>` seçeneğini kullanın. Ayrıca, düğüm adı Wallarm Konsolu → **Düğümler**'de de değiştirilebilir.

3.  İstenildiğinde Wallarm hesabınızın e-postasını ve şifresini sağlayın.