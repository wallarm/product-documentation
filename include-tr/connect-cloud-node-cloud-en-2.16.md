[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

Filtreleme düğümü, Wallarm Buluta ile etkileşim kurar. Düğümü Buluta bağlamanın iki yolu vardır:
* [Filtreleme düğümü belirteci kullanarak][anchor-token]
* [Wallarm hesabınızın e-postası ve şifresi kullanılarak][anchor-credentials]

!!! info "Gerekli erişim hakları"
    Wallarm hesabınızda **Yönetici** veya **Dağıtım** rolünün etkinleştirildiğinden ve iki faktörlü kimlik doğrulamanın devre dışı bırakıldığından emin olun, böylece bir filtreleme düğümünü Buluta bağlamanıza izin verir.

    Söz konusu parametreleri Wallarm Konsol'daki kullanıcı hesabı listesinde kontrol edebilirsiniz.
    
    * <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [bu bağlantıyı][link-wl-console-users-eu] takip ediniz.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [bu bağlantıyı][link-wl-console-users-us] takip ediniz.
    ![Wallarm konsolunda kullanıcı listesi][img-wl-console-users]

#### Filtreleme düğümü belirteci kullanarak bağlanın

Düğümü belirteci kullanarak Buluta bağlamak için aşağıdaki adımları izleyin:

1. Wallarm Konsolunun **Düğümler** bölümünde yeni bir düğüm oluşturun.
    1. **Yeni düğüm oluştur** düğmesine tıklayın.
    2. **Wallarm düğümü** oluşturun.
2. Düğüm belirteci kopyalayın.
3. Sanal makinede `addcloudnode` komut dosyasını çalıştırın:
    
    !!! info
        Hangi komut dosyasını çalıştıracağınızı Bulut'a göre seçmeniz gerekir.
        
        * <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Bulut** sekmesindeki komutu çalıştırın.
        * <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Bulut** sekmesindeki komutu çalıştırın.
    
    === "US Bulut"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Bulut"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. Panodan filtreleme düğümü belirtecini yapıştırın. 

Düğümünüz şimdi her 2–4 dakikada bir varsayılan senkronizasyon yapılandırmasıyla Bulut ile senkronize olacak.

!!! info "Filtreleme düğümü ve Bulut senkronizasyon yapılandırması"
    `addcloudnode` komut dosyasını çalıştırdıktan sonra, filtreleme düğümü ve Bulut senkronizasyon ayarlarını içeren `/etc/wallarm/syncnode` dosyası oluşturulur. Filtreleme düğümü ve Bulut senkronizasyonunun ayarları `/etc/wallarm/syncnode` dosyası üzerinden değiştirilebilir.
    
    [Filtreleme düğümü ve Wallarm Bulut senkronizasyon yapılandırmaları hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### E-postanız ve şifreniz kullanarak bağlanın

Düğümü hesap bilgilerinizle Wallarm Buluta bağlamak için aşağıdaki adımları izleyin:

1.  Sanal makinede `addnode` komut dosyasını çalıştırın:
    
    !!! info
        Hangi komut dosyasını çalıştıracağınızı Bulut'a göre seçmeniz gerekir.
        
        * <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Bulut** sekmesindeki komutu çalıştırın.
        * <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Bulut** sekmesindeki komutu çalıştırın.
    
    === "US Bulut"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Bulut"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  İstenildiğinde Wallarm hesabınızın e-postasını ve şifresini sağlayın.

!!! info "API erişimi"
    Filtreleme düğümünüzün API seçimi kullandığınız Buluta bağlıdır. Lütfen, API'yi buna göre seçin:
    
    * <https://my.wallarm.com/> kullanıyorsanız, düğümünüz `https://api.wallarm.com:444` erişimine ihtiyaç duyar.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, düğümünüz `https://us1.api.wallarm.com:444` erişimine ihtiyaç duyar.
    
    Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

Düğümünüz şimdi her 2–4 dakikada bir varsayılan senkronizasyon yapılandırmasıyla Bulut ile senkronize olacak.

!!! info "Filtreleme düğümü ve Bulut senkronizasyon yapılandırması"
    `addnode` komut dosyasını çalıştırdıktan sonra, filtreleme düğümü ve Bulut senkronizasyon ayarları ve Wallarm düğümünün doğru bir şekilde çalışması için gereken diğer ayarları içeren `/etc/wallarm/node.yaml` dosyası oluşturulacaktır. Filtreleme düğümü ve Bulut senkronizasyonunun ayarları `/etc/wallarm/node.yaml` dosyası ve sistem ortam değişkenleri üzerinden değiştirilebilir.
    
    [Filtreleme düğümü ve Wallarm Bulut senkronizasyon yapılandırmaları hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)