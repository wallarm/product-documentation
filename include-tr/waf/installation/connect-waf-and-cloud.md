The Wallarm node, Wallarm Cloud ile etkileşime girer. Filtreleme node'unu Cloud'a bağlamak için aşağıdaki adımları izleyin:

1. Wallarm hesabınızın Wallarm Console'da **Administrator** veya **Deploy** rolünün etkinleştirildiğinden ve iki faktörlü doğrulamanın devre dışı bırakıldığından emin olun.
     
    Belirtilen ayarları [US Cloud](https://us1.my.wallarm.com/settings/users) veya [EU Cloud](https://my.wallarm.com/settings/users) üzerindeki kullanıcı listesine giderek kontrol edebilirsiniz.

    ![User list in Wallarm console][img-wl-console-users]

2. Wallarm node'unun yüklü olduğu bir sistemde `addnode` betiğini çalıştırın:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Wallarm Console hesabınızın e-posta adresini ve şifresini girin.
4. Filtreleme node'unun adını girin veya otomatik olarak oluşturulan adı kullanmak için Enter'a basın.

    Belirtilen ad, daha sonra Wallarm Console → **Nodes** bölümünden değiştirilebilir.
5. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerindeki Wallarm Console → **Nodes** bölümünü açın ve listenin içine yeni bir filtreleme node'u eklendiğini doğrulayın.