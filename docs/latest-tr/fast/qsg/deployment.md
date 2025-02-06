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
    
    
# FAST node dağıtımı

Bu bölüm, FAST node'un kurulum ve ilk yapılandırma sürecinde size rehberlik edecektir. Gerekli tüm adımları tamamladıktan sonra çalışır durumda bir FAST node'a sahip olacaksınız. Node, HTTP ve HTTPS isteklerini [Google Gruyere][link-https-google-gruyere] uygulamasına yönlendirmeye hazır, `localhost:8080` üzerinde dinlemede olacaktır. Node, makinenize Mozilla Firefox tarayıcısı ile birlikte kurulmuş olacaktır.
    
!!! info "Kullanılacak tarayıcı hakkında not"
    Kılavuzda Mozilla Firefox tarayıcısının kullanılması önerilmektedir. Ancak, FAST node'un tüm HTTP ve HTTPS trafiğini yönlendirecek şekilde yapılandırmanız koşuluyla tercih ettiğiniz herhangi bir tarayıcıyı kullanmanız mümkündür.

![FAST node dağıtım şeması][img-qsg-deployment-scheme]    
        
FAST node'un kurulumu ve yapılandırılması için aşağıdakileri yapın:

1.  [Docker yazılımını kurun][anchor1].
2.  [FAST node'unuzu Wallarm cloud ile bağlamak için kullanılacak bir token alın][anchor2].
3.  [Gerekli ortam değişkenlerini içeren bir dosya hazırlayın][anchor3].
4.  [FAST node Docker konteynerini dağıtın][anchor4].
5.  [Tarayıcıyı proxy ile çalışacak şekilde yapılandırın][anchor5].
6.  [SSL sertifikalarını yükleyin][anchor6].
            
##  1.  Docker yazılımını kurun

Makinenize Docker yazılımını kurun. Daha fazla bilgi için resmi Docker [kurulum kılavuzuna][link-docker-docs] bakın.

Docker Community Edition (CE) kullanmanız önerilmektedir. Ancak, herhangi bir Docker sürümü kullanılabilir.
    
    
##  2.  FAST node'unuzu Wallarm cloud ile bağlamak için kullanılacak bir token alın

1.  Wallarm hesabınızı kullanarak [My Wallarm portalına][link-wl-console] giriş yapın.

    Eğer bir hesabınız yoksa, erişim sağlamak için [Wallarm Sales Team](mailto:sales@wallarm.com) ile iletişime geçin.

2.  “Nodes” sekmesini seçin, ardından **Create FAST node** düğmesine (veya **Add FAST node** bağlantısına) tıklayın.

    ![Yeni bir node oluşturma][img-fast-create-node]

3.  Bir iletişim kutusu açılacaktır. Node için anlamlı bir isim verin ve **Create** düğmesini seçin. Kılavuz, `DEMO NODE` adının kullanılmasını önermektedir.
    
4.  Oluşturulan node'un **Token** alanının üzerine fare imlecinizi getirin ve değeri kopyalayın.

    !!! info "Token hakkında not"
        Token, Wallarm API çağrısı yoluyla da alınabilir. Ancak, bu belgenin kapsamı dışındadır.
        
##  3.  Gerekli ortam değişkenlerini içeren bir dosya hazırlayın

FAST node'un çalışması için birkaç ortam değişkeni ayarlamanız gerekmektedir.

Bunu yapmak için, bir metin dosyası oluşturun ve aşağıdaki metni ekleyin:

```
WALLARM_API_TOKEN=<adım 2'de aldığınız token değeri>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

Ortam değişkenlerini ayarlamış oldunuz. Amaçları şu şekildedir:
* `WALLARM_API_TOKEN` — node'un Wallarm cloud'a bağlanması için kullanılan token değerini ayarlar.
* `ALLOWED_HOSTS` — güvenlik testi üretilmesi için isteklerin kapsamını sınırlar; güvenlik testleri yalnızca hedef uygulamanın bulunduğu `google-gruyere.appspot.com` alanına yapılan isteklerden üretilecektir.
    
!!! info "`ALLOWED_HOSTS` ortam değişkeninin kullanımı"
    Tam etki alanı adı belirlemek zorunlu değildir. Bir alt dize (örneğin `google-gruyere` veya `appspot.com`) de kullanılabilir.

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  FAST node Docker konteynerini dağıtın

Bunu yapmak için aşağıdaki komutu çalıştırın:

```
docker run --name <name> --env-file=<önceki adımda oluşturulan ortam değişkenleri dosyası> -p <hedef port>:8080 wallarm/fast
```

Komuta birkaç argüman sağlamanız gerekmektedir:
    
* **`--name`** *`<name>`*
        
    Docker konteynerinin adını belirtir.
    
    Tüm mevcut konteyner isimleri arasında benzersiz olmalıdır.
    
* **`--env-file=`** *`<önceki adımda oluşturulan ortam değişkenleri dosyası>`*
    
    Konteynere aktarılacak tüm ortam değişkenlerini içeren dosyayı belirtir.
    
    [Önceki adımda][anchor3] oluşturduğunuz dosyanın yolunu belirtmelisiniz.

* **`-p`** *`<hedef port>`* **`:8080`**
    
    Docker host'unun konteynerin 8080 portunun eşleneceği portu belirtir. Varsayılan olarak konteyner portlarına Docker host tarafından erişilemez.
    
    Docker host tarafından belirli bir konteyner portuna erişim sağlamak için, konteynerin dahili portunu dış porta yayınlamanız gerekmektedir. Bunun için `-p` argümanını kullanmalısınız.
    
    Konteynerin portunu dışarıdan erişilebilecek şekilde, Docker host üzerindeki bir non-loopback IP adresine de eşleyebilirsiniz. Bunun için `-p <host IP>:<hedef port>:8080` argümanını kullanın.

!!! info "`docker run` komutu örneği"
    Aşağıdaki komutun çalıştırılması, adı `fast-node` olan, `/home/user/fast.cfg` ortam değişkenleri dosyasını kullanan ve portunu `localhost:8080` olarak eşleyen bir konteyner çalıştıracaktır:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

Konteyner dağıtımı başarılı olursa, aşağıdaki gibi bir konsol çıktısı alacaksınız:

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

Artık Wallarm cloud ile bağlantılı, çalışmaya hazır bir FAST node'unuz olmalıdır. Node, `google-gruyere.appspot.com` alan adına yapılan istekleri temel istekler olarak tanıyarak `localhost:8080` üzerinden gelen HTTP ve HTTPS isteklerini dinlemektedir.
    
    
##  5.  Tarayıcıyı proxy ile çalışacak şekilde yapılandırın

FAST node üzerinden tüm HTTP ve HTTPS isteklerini proxy'lemek için tarayıcıyı yapılandırın.

Mozilla Firefox tarayıcısında proxy ayarlarını yapmak için aşağıdakileri yapın:

1.  Tarayıcıyı açın. Menüden “Preferences” öğesini seçin. “General” sekmesini seçin ve “Network Settings” bölümüne kadar aşağı kaydırın. **Settings** düğmesine tıklayın.

    ![Mozilla Firefox seçenekleri][img-firefox-options]

2.  “Connection Settings” penceresi açılacaktır. **Manual proxy configuration** seçeneğini seçin. Aşağıdaki değerleri girerek proxy'yi yapılandırın:

    * HTTP proxy adresi olarak **`localhost`** ve HTTP proxy portu olarak **`8080`**.
    * SSL proxy adresi olarak **`localhost`** ve SSL proxy portu olarak **`8080`**.
        
    Yaptığınız değişiklikleri uygulamak için **ОК** düğmesine tıklayın.

    ![Mozilla Firefox proxy ayarları][img-firefox-proxy-options]
    
    
##  6.  SSL sertifikalarını yükleyin

HTTPS üzerinden [Google Gruyere][link-https-google-gruyere] uygulaması ile çalışırken, güvenli bağlantının kesintiye uğradığını belirten bir tarayıcı mesajıyla karşılaşabilirsiniz:

![“Güvensiz bağlantı” mesajı][img-insecure-connection]

Web uygulaması ile HTTPS üzerinden etkileşimde bulunabilmek için, self-signed FAST node SSL sertifikasını eklemeniz gerekmektedir. Bunu yapmak için, bu [linke][link-ssl-installation] gidin, listedeki tarayıcınızı seçin ve açıklanan gerekli adımları takip edin. Kılavuz Mozilla Firefox tarayıcısının kullanılmasını önermektedir.
        
FAST node'unuzu çalıştırıp yapılandırdıktan sonra, bölümdeki tüm hedeflere ulaşmış olmalısınız. Bir sonraki bölümde, birkaç temel isteğe dayalı olarak bir dizi güvenlik testi oluşturmak için neler gerektiğini öğreneceksiniz.