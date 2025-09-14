[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

Filtreleme düğümü Wallarm Cloud ile etkileşime girer. Düğümü Cloud’a bağlamanın iki yolu vardır:
* [Filtreleme düğümü belirteci kullanma][anchor-token]
* [Wallarm hesabınıza ait e‑posta ve şifreyi kullanma][anchor-credentials]

!!! info "Gerekli erişim hakları"
    Wallarm hesabınızda **Administrator** veya **Deploy** rolünün etkin olduğundan ve iki faktörlü kimlik doğrulamanın devre dışı olduğundan emin olun; bu sayede bir filtreleme düğümünü Cloud’a bağlayabilirsiniz.

    Yukarıda bahsedilen parametreleri Wallarm Console içindeki kullanıcı hesap listesine giderek kontrol edebilirsiniz.
    
    * <https://my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki bağlantıya][link-wl-console-users-eu] gidin.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, kullanıcı ayarlarınızı kontrol etmek için [aşağıdaki bağlantıya][link-wl-console-users-us] gidin.
    ![Wallarm Console'da kullanıcı listesi][img-wl-console-users]

#### Filtreleme düğümü belirteci kullanarak bağlanma

Düğümü belirteç kullanarak Cloud’a bağlamak için aşağıdaki adımları uygulayın:

1. Wallarm Console’un **Nodes** bölümünde yeni bir düğüm oluşturun.
    1. **Create new node** düğmesine tıklayın.
    2. **Wallarm node** oluşturun.
2. Düğüm belirtecini kopyalayın.
3. Sanal makinede `addcloudnode` betiğini çalıştırın:
    
    !!! info
        Hangi Cloud’u kullandığınıza bağlı olarak çalıştırılacak betiği seçmeniz gerekir.
        
        * <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **ABD Cloud** sekmesindeki betiği çalıştırın.
        * <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **AB Cloud** sekmesindeki betiği çalıştırın.
    
    === "ABD Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "AB Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. Panonuzdan filtreleme düğümü belirtecini yapıştırın. 

Düğümünüz, varsayılan eşitleme yapılandırmasına göre artık her 2‑4 dakikada bir Cloud ile eşitlenecektir.

!!! info "Filtreleme düğümü ve Cloud eşitleme yapılandırması"
    `addcloudnode` betiğini çalıştırdıktan sonra, filtreleme düğümü ile Cloud eşitleme ayarlarını içeren `/etc/wallarm/syncnode` dosyası oluşturulacaktır. Filtreleme düğümü ve Cloud eşitleme ayarları `/etc/wallarm/syncnode` dosyası üzerinden değiştirilebilir.
    
    [Filtreleme düğümü ve Wallarm Cloud eşitleme yapılandırması hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### E‑posta adresiniz ve şifrenizi kullanarak bağlanma

Düğümü Wallarm Cloud’a hesap bilgilerinizi kullanarak bağlamak için aşağıdaki adımları izleyin:

1.  Sanal makinede `addnode` betiğini çalıştırın:
    
    !!! info
        Hangi Cloud’u kullandığınıza bağlı olarak çalıştırılacak betiği seçmeniz gerekir.
        
        * <https://us1.my.wallarm.com/> kullanıyorsanız, aşağıdaki **ABD Cloud** sekmesindeki betiği çalıştırın.
        * <https://my.wallarm.com/> kullanıyorsanız, aşağıdaki **AB Cloud** sekmesindeki betiği çalıştırın.
    
    === "ABD Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "AB Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  İstendiğinde Wallarm hesabınızın e‑posta adresini ve şifresini girin.

!!! info "API erişimi"
    Filtreleme düğümünüz için API seçimi, kullandığınız Cloud’a bağlıdır. Lütfen API’yi buna göre seçin:
    
    * <https://my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://api.wallarm.com:444` adresine erişmesi gerekir.
    * <https://us1.my.wallarm.com/> kullanıyorsanız, düğümünüzün `https://us1.api.wallarm.com:444` adresine erişmesi gerekir.
    
    Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

Düğümünüz, varsayılan eşitleme yapılandırmasına göre artık her 2‑4 dakikada bir Cloud ile eşitlenecektir.

!!! info "Filtreleme düğümü ve Cloud eşitleme yapılandırması"
    `addnode` betiğini çalıştırdıktan sonra, filtreleme düğümü ile Cloud eşitleme ayarlarını ve doğru bir Wallarm düğümü çalışması için gereken diğer ayarları içeren `/etc/wallarm/node.yaml` dosyası oluşturulacaktır. Filtreleme düğümü ve Cloud eşitleme ayarları `/etc/wallarm/node.yaml` dosyası ve sistem ortam değişkenleri üzerinden değiştirilebilir.
    
    [Filtreleme düğümü ve Wallarm Cloud eşitleme yapılandırması hakkında daha fazla bilgi →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)