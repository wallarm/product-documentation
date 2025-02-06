[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

Filtreleme düğümü, Wallarm Cloud ile etkileşime girer. Düğümü Cloud'a bağlamanın iki yolu vardır:
* [Filtreleme düğümü tokenı kullanarak][anchor-token]
* [Wallarm hesabınızın e-posta adresi ve şifresi ile][anchor-credentials]

!!! info "Gerekli erişim hakları"
    Wallarm hesabınızın **Administrator** veya **Deploy** rolüne sahip olduğundan ve iki faktörlü kimlik doğrulamanın devre dışı bırakıldığından emin olun; böylece bir filtreleme düğümünü Cloud'a bağlayabilirsiniz.

    Söz konusu parametreleri Wallarm Console'da kullanıcı hesabı listesine giderek kontrol edebilirsiniz.
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki linke][link-wl-console-users-eu] gidin.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki linke][link-wl-console-users-us] gidin.
    ![Wallarm console'da kullanıcı listesi][img-wl-console-users]

#### Filtreleme düğüm tokenı kullanarak bağlantı kurma

Token kullanarak düğümü Cloud'a bağlamak için aşağıdaki adımları uygulayın:

1. Wallarm Console'daki **Nodes** bölümünde yeni bir düğüm oluşturun.
    1. **Create new node** butonuna tıklayın.
    2. **Wallarm node** oluşturun.
2. Düğüm tokenını kopyalayın.
3. Sanal makinede `addcloudnode` betiğini çalıştırın:
    
    !!! info
        Hangi betiği çalıştıracağınızı kullandığınız Cloud'a bağlı olarak seçmeniz gerekir.
        
        * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Cloud** sekmesinden betiği çalıştırın.
        * Eğer <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Cloud** sekmesinden betiği çalıştırın.
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. Panonuzdaki filtreleme düğümü tokenını yapıştırın. 

Artık düğümünüz, varsayılan senkronizasyon konfigürasyonuna göre her 2‑4 dakikada bir Cloud ile senkronize olacaktır.

!!! info "Filtreleme düğümü ve Cloud senkronizasyon konfigürasyonu"
    `addcloudnode` betiğini çalıştırdıktan sonra, filtreleme düğümü ve Cloud senkronizasyon ayarlarını içeren `/etc/wallarm/syncnode` dosyası oluşturulacaktır. Filtreleme düğümü ve Cloud senkronizasyon ayarlarını `/etc/wallarm/syncnode` dosyası aracılığıyla değiştirebilirsiniz.
    
    [Filtreleme düğümü ve Wallarm Cloud senkronizasyon konfigürasyonu hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### E-posta ve şifre kullanarak bağlantı kurma

Hesap bilgilerinizle Wallarm Cloud'a düğüm bağlamak için aşağıdaki adımları uygulayın:

1. Sanal makinede `addnode` betiğini çalıştırın:
    
    !!! info
        Hangi betiği çalıştıracağınızı kullandığınız Cloud'a bağlı olarak seçmeniz gerekir.
        
        * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **US Cloud** sekmesinden betiği çalıştırın.
        * Eğer <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **EU Cloud** sekmesinden betiği çalıştırın.
    
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2. İstendiğinde Wallarm hesabınızın e-posta adresini ve şifresini girin.

!!! info "API erişimi"
    Filtreleme düğümünüz için API seçimi, kullandığınız Cloud'a bağlıdır. Lütfen ilgili API'yi seçin:
    
    * Eğer <https://my.wallarm.com/> kullanıyorsanız, düğümünüz `https://api.wallarm.com:444` erişimine ihtiyaç duyar.
    * Eğer <https://us1.my.wallarm.com/> kullanıyorsanız, düğümünüz `https://us1.api.wallarm.com:444` erişimine ihtiyaç duyar.
    
    Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

Artık düğümünüz, varsayılan senkronizasyon konfigürasyonuna göre her 2‑4 dakikada bir Cloud ile senkronize olacaktır.

!!! info "Filtreleme düğümü ve Cloud senkronizasyon konfigürasyonu"
    `addnode` betiğini çalıştırdıktan sonra, filtreleme düğümü ve Cloud senkronizasyon ayarlarını ve Wallarm düğümünün doğru çalışması için gerekli diğer ayarları içeren `/etc/wallarm/node.yaml` dosyası oluşturulacaktır. Filtreleme düğümü ve Cloud senkronizasyon ayarlarını `/etc/wallarm/node.yaml` dosyası ve sistem ortam değişkenleri aracılığıyla değiştirebilirsiniz.
    
    [Filtreleme düğümü ve Wallarm Cloud senkronizasyon konfigürasyonu hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)