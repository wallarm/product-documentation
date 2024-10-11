[img-qsg-deployment-scheme]:    ../../images/fast/qsg/en/deployment/5-qsg-fast-inst-scheme.png
[img-fast-create-node]:         ../../images/fast/qsg/common/deployment/6-qsg-fast-inst-create-node.png   
[img-firefox-options]:          ../../images/fast/qsg/common/deployment/9-qsg-fast-inst-ff-options-window.png
[img-firefox-proxy-options]:    ../../images/fast/qsg/common/deployment/10-qsg-fast-inst-ff-proxy-options.png
[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

[link-https-google-gruyere]:    https://google-gruyere.appspot.com
[link-docker-docs]:             https://docs.docker.com/
[link-wl-console]:              https://us1.my.wallarm.com
[link-ssl-installation]:        ../ssl/intro.md

[wl-cloud-list]:    ../cloud-list.md
      
[anchor1]:  #1-install-the-docker-software              
[anchor2]:  #2-obtain-a-token-that-will-be-used-to-connect-your-fast-node-to-the-wallarm-cloud
[anchor3]:  #3-prepare-a-file-containing-the-necessary-environment-variables 
[anchor4]:  #4-deploy-the-fast-node-docker-container 
[anchor5]:  #5-configure-the-browser-to-work-with-the-proxy
[anchor6]:  #6-install-ssl-certificates 
    
    
# FAST node deployment

Bu bölüm, FAST node'un kurulum ve ilk yapılandırma sürecinden sizi yönlendirecektir. Tüm gerekli adımlar tamamlandıktan sonra, HTTP ve HTTPS isteklerini [Google Gruyere][link-https-google-gruyere] uygulamasına proxy olarak hazır olan `localhost:8080` üzerinde dinleyen bir FAST node'unuz olacak. Node, Mozilla Firefox tarayıcısı ile birlikte makinenize kurulacak.
    
!!! info "Kullanılacak tarayıcıya dair not"
    Rehberde Mozilla Firefox tarayıcısının kullanılması önerilir. Ancak, tüm HTTP ve HTTPS trafiğini FAST node'a gönderecek şekilde başarıyla yapılandırdıysanız, seçiminiz dahilinde herhangi bir tarayıcıyı kullanabilirsiniz.

![Kullanımda FAST node dağıtım şeması][img-qsg-deployment-scheme]    
        
FAST node'u kurmak ve yapılandırmak için şu adımları izleyin:

1.  [Docker yazılımını kurun][anchor1].
2.  [FAST node'unuzu Wallarm buluta bağlamak için kullanılacak bir token edin][anchor2].
3.  [Gerekli ortam değişkenlerini içeren bir dosya hazırlayın][anchor3].
4.  [FAST node Docker konteynerini dağıtın][anchor4].
5.  [Proxy ile çalışmak için tarayıcıyı yapılandırın][anchor5].
6.  [SSL sertifikalarını yükleyin][anchor6].
            
##  1.  Docker yazılımını kurun 

Docker yazılımını makinenize kurun. Daha fazla bilgi için resmi Docker [kurulum rehberine][link-docker-docs] bakın.

Docker Community Edition (CE) kullanmanız önerilir. Ancak, herhangi bir Docker sürümü kullanılabilir.
    
    
##  2.  FAST node'unuzun Wallarm buluta bağlanmak için kullanılacak bir tokeni edinmek

1.  Wallarm hesabınızı kullanarak [My Wallarm portalına][link-wl-console] giriş yapın.

    If you do not have one, then contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access.

2.  “Düğümler” sekmesini seçin, ardından **FAST node oluştur** düğmesine tıklayın (veya **FAST node ekle** bağlantısına tıklayın).

    ![Yeni bir düğüm oluşturma][img-fast-create-node]

3.  Bir diyalog penceresi açılır. Düğüme anlamlı bir ad verin ve **Oluştur** düğmesini seçin. Rehber, `DEMO NODE` adını kullanmanızı önerir.
    
4.  Oluşturulan düğümün **Token** alanının üzerine fare imlecinizi getirin ve değeri kopyalayın.

    !!! info "Token hakkında not"
        Tokeni bir Wallarm API çağrısıyla da almak mümkündür. Ancak, bu belgenin kapsamı dışındadır. 
        
##  3.  Gerekli ortam değişkenlerini içeren bir dosya hazırlayın 

FAST node'un çalışabilmesi için bazı ortam değişkenlerini ayarlamanız gerekiyor.

Bunu yapmak için bir metin dosyası oluşturun ve aşağıdaki metni ekleyin:

```
WALLARM_API_TOKEN=<2. adımda elde ettiğiniz token değeri>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

Ortam değişkenlerini ayarladınız. Amaçlarını şöyle açıklayabiliriz:
* `WALLARM_API_TOKEN` — düğümün Wallarm buluta bağlanmak için kullanılan token değerini belirler
* `ALLOWED_HOSTS` — güvenlik testi oluşturacak isteklerin kapsamını sınırlar; güvenlik testleri yalnızca hedef uygulamanın bulunduğu `google-gruyere.appspot.com` alanına giden isteklerden oluşturulacak.
    
!!! info "`ALLOWED_HOSTS` ortam değişkenini kullanma"
    Tam etki alanı adının ayarlanması gerekli değildir. Bir alt dizeyi (ör. `google-gruyere` veya `appspot.com`) kullanabilirsiniz.

--8<-- "../include-tr/fast/wallarm-api-host-note.md"
   
##  4.  FAST node Docker konteynerini dağıtın

Bunu yapmak için aşağıdaki komutu çalıştırın:

```
docker run --name <adı> --env-file=<önceki adımda oluşturulan ortam değişkenleri dosyası> -p <hedef port>:8080 wallarm/fast
```

Komuta birkaç argüman sağlamanız gerekiyor:
    
* **`--name`** *`<adı>`*
        
    Docker konteynerinin adını belirtir.
    
    Mevcut tüm konteynerlerin adları arasında benzersiz olmalıdır.
    
* **`--env-file=`** *`<önceki adımda oluşturulan ortam değişkenleri dosyası>`*
    
    Konteynere dışarıdan aktarılacak tüm ortam değişkenlerini içeren bir dosyayı belirtir.
    
    [Önceki adımda][anchor3] oluşturduğunuz dosyanın yolunu belirtmelisiniz.

* **`-p`** *`<hedef port>`* **`:8080`**
    
    Konteynerin 8080 portunu hangi Docker ana bilgisayarının portuna eşleyeceğinizi belirtir. Varsayılan olarak ana bilgisayar, konteyner portlarına erişemez. 
    
    Bir konteyner portuna Docker ana bilgisayarından erişim sağlamak için, `-p` argümanını kullanarak konteynerin dahili portunu dış port ile yayınlamalısınız. 
    
    Ayrıca, konteynerin portunu dışarıdan da erişilebilir hale getirmek için `-p <ana bilgisayar IP>:<hedef port>:8080` argümanını sağlayarak ana bilgisayar üzerinde bir IP adresine de yayınlayabilirsiniz.        

!!! info "`docker run` komutunun bir örneği"
    Aşağıdaki komutun çalıştırılması, `/home/user/fast.cfg` ortam değişkenleri dosyasını kullanan `fast-node` adlı bir konteyneri başlatır ve portunu `localhost:8080` adresine yayınlar:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

Konteyner dağıtımı başarılıysa, aşağıdaki gibi bir konsol çıktısı almanız gerekir:

--8<-- "../include-tr/fast/console-include/qsg/fast-node-deployment-ok.md"

Şimdi Wallarm buluta bağlı ve `google-gruyere.appspot.com` alanına gelen HTTP ve HTTPS isteklerini temel olarak kabul ederek `localhost:8080` üzerinde gelen istekleri dinleyen çalışabilir durumda bir FAST node'unuz olmalı.
    
    
##  5.  Proxy ile çalışmak için tarayıcıyı yapılandırın

Tüm HTTP ve HTTPS isteklerini FAST node üzerinden proxy olarak yönlendirmek için tarayıcıyı yapılandırın.

Mozilla Firefox tarayıcısında proxy ayarlarını yapmak için aşağıdakileri yapın:

1.  Tarayıcıyı açın. Menüden “Tercihler”i seçin. “Genel” sekmesini seçin ve “Ağ Ayarları”na kadar aşağıya kaydırın. **Ayarlar** düğmesini seçin.

    ![Mozilla Firefox ayarları][img-firefox-options]

2.  “Bağlantı Ayarları” penceresi açılır. **Manuel proxy yapılandırması** seçeneğini seçin. Proxy’yi aşağıdaki değerleri girerek yapılandırın:

    * HTTP proxy adresi olarak **`localhost`** ve HTTP proxy portu olarak **`8080`**. 
    * SSL proxy adresi olarak **`localhost`** ve SSL proxy portu olarak **`8080`**.
        
    Yaptığınız değişiklikleri uygulamak için **OK** düğmesini seçin.

    ![Mozilla Firefox proxy ayarları][img-firefox-proxy-options]
    
    
##  6.  SSL Sertifikalarını Yükleyin

[Google Gruyere][link-https-google-gruyere] uygulamasıyla HTTPS üzerinden çalışırken, güvenli bağlantının kesildiğine dair aşağıdaki tarayıcı mesajıyla karşılaşabilirsiniz:

![“Güvencesiz bağlantı” mesajı][img-insecure-connection]

Web uygulamasıyla HTTPS üzerinden etkileşim kurabilmek için kendine imzalı bir FAST node SSL sertifikası eklemelisiniz. Bunu yapmak için bu [bağlantıya][link-ssl-installation] gidin, listeden tarayıcınızı seçin ve gerekli işlemleri yapın. Bu rehber, Mozilla Firefox tarayıcısının kullanılmasını önerir.
        
FAST node'unuzu çalıştırıp yapılandırdıysanız, artık bu bölümün tüm hedeflerini tamamlamış olmalısınız. Bir sonraki bölümde, birkaç temel istek temelinde bir dizi güvenlik testi oluşturmak için neyin gerekli olduğunu öğreneceksiniz.