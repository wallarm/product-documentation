[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "API Erişimi"
    Filtreleme düğümünüz için API seçimi, kullandığınız Cloud’a bağlıdır. Lütfen buna uygun API’yi seçin:
    
    * <https://my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://api.wallarm.com:444` adresine erişmesi gerekir.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com:444` adresine erişmesi gerekir.
    
    Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

Filtreleme düğümü Wallarm Cloud ile etkileşime girer. 

Düğümü Cloud’a, bulut hesabı bilgilerinizi kullanarak bağlamak için aşağıdaki adımları izleyin:

1.  Wallarm hesabınızda **Administrator** veya **Deploy** rolünün etkin olduğundan ve iki faktörlü kimlik doğrulamanın devre dışı olduğundan emin olun; böylece bir filtreleme düğümünü Cloud’a bağlayabilirsiniz. 
     
    Bu parametreleri, Wallarm Console içindeki kullanıcı hesapları listesine giderek kontrol edebilirsiniz.
    
    * <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki bağlantıya][link-wl-console-users-eu] gidin.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki bağlantıya][link-wl-console-users-us] gidin.

    ![Wallarm Console’da kullanıcı listesi][img-wl-console-users]

2.  Filtreleme düğümünü kurduğunuz makinede `addnode` betiğini çalıştırın:
    
    !!! info
        Kullandığınız Cloud’a bağlı olarak çalıştırılacak betiği seçmeniz gerekir.
    
        * <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **ABD Cloud** sekmesindeki betiği çalıştırın.
        * <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **AB Cloud** sekmesindeki betiği çalıştırın.
    
    === "ABD Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "AB Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    Oluşturulan düğümün adını belirtmek için `-n <node name>` seçeneğini kullanın. Ayrıca, düğüm adı Wallarm Console → **Nodes** içinde değiştirilebilir.

3.  İstendiğinde Wallarm hesabınızın e-postasını ve parolasını girin.