[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users


!!! info "API Erişimi"
    Filtering node'unuz için kullanılacak API seçimi, kullandığınız Cloud'a bağlıdır. Lütfen API'yi buna göre seçin:
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, node'unuzun `https://api.wallarm.com:444` adresine erişimi gerekir.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, node'unuzun `https://us1.api.wallarm.com:444` adresine erişimi gerekir.
    
    Erişimin bir firewall tarafından engellenmediğinden emin olun.

Filtering node, Wallarm Cloud ile etkileşime geçer. 

Cloud hesabınızın gereksinimlerini kullanarak node'u Cloud'a bağlamak için aşağıdaki adımları izleyin:

1.  Wallarm hesabınızın **Administrator** veya **Deploy** rolüne sahip olduğundan ve iki faktörlü doğrulamanın devre dışı bırakıldığından emin olun, böylece Filtering node'u Cloud'a bağlayabilirsiniz. 
     
    Yukarıda belirtilen parametreleri Wallarm Console'daki kullanıcı hesap listesine giderek kontrol edebilirsiniz.
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki linke][link-wl-console-users-eu] gidin.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki linke][link-wl-console-users-us] gidin.

    ![Wallarm console'da kullanıcı listesi][img-wl-console-users]

2.  Filtering node'u kurduğunuz makinede `addnode` script'ini çalıştırın:
    
    !!! info
        Çalıştırılacak script'i, kullandığınız Cloud'a bağlı olarak seçmeniz gerekmektedir.
    
        * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Cloud** sekmesinden script'i çalıştırın.
        * Eğer <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Cloud** sekmesinden script'i çalıştırın.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    Oluşturulan node'un adını belirtmek için `-n <node name>` seçeneğini kullanın. Ayrıca, node adı Wallarm Console → **Nodes** üzerinden değiştirilebilir.

3.  İstendiğinde Wallarm hesabınızın e-posta adresini ve şifresini girin.