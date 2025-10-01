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
    
    
# FAST düğümü dağıtımı

Bu bölüm, FAST düğümünün kurulumu ve ilk yapılandırma sürecinde size yol gösterecektir. Gerekli tüm adımları tamamladığınızda çalışır durumda bir FAST düğümüne sahip olacaksınız. Düğüm, HTTP ve HTTPS isteklerini [Google Gruyere][link-https-google-gruyere] uygulamasına proxy’lemek üzere `localhost:8080` üzerinde dinliyor olacak. Düğüm, Mozilla Firefox tarayıcısı ile birlikte makinenize kurulacaktır.
    
!!! info "Kullanılacak tarayıcı hakkında not"
    Kılavuzda Mozilla Firefox tarayıcısını kullanmanız önerilir. Ancak, tüm HTTP ve HTTPS trafiğini FAST düğümüne gönderecek şekilde başarıyla yapılandırmanız koşuluyla dilediğiniz tarayıcıyı kullanabilirsiniz.

![Kullanımda FAST düğümü dağıtım şeması][img-qsg-deployment-scheme]    
        
FAST düğümünü kurmak ve yapılandırmak için aşağıdakileri yapın:

1.  [Docker yazılımını kurun][anchor1].
2.  [FAST düğümünüzü Wallarm cloud’a bağlamak için kullanılacak bir belirteç (token) edinin][anchor2].
3.  [Gerekli ortam değişkenlerini içeren bir dosya hazırlayın][anchor3].
4.  [FAST düğümü Docker konteynerini dağıtın][anchor4].
5.  [Tarayıcıyı proxy ile çalışacak şekilde yapılandırın][anchor5].
6.  [SSL sertifikalarını kurun][anchor6].
            
##  1.  Docker yazılımını kurun 

Makinenize Docker yazılımını kurun. Daha fazla bilgi için resmi Docker [kurulum kılavuzuna][link-docker-docs] bakın.

Docker Community Edition (CE) kullanmanız önerilir. Ancak, herhangi bir Docker sürümü de kullanılabilir.
    
    
##  2.  FAST düğümünüzü Wallarm cloud’a bağlamak için kullanılacak bir belirteç (token) edinin

1.  Wallarm hesabınızı kullanarak [My Wallarm portaline][link-wl-console] giriş yapın.

    Hesabınız yoksa, erişim almak için [Wallarm Sales Team](mailto:sales@wallarm.com) ile iletişime geçin.

2.  “Nodes” sekmesini seçin, ardından **Create FAST node** düğmesine (veya **Add FAST node** bağlantısına) tıklayın.

    ![Yeni bir düğümün oluşturulması][img-fast-create-node]

3.  Bir diyalog penceresi açılacaktır. Düğüme anlamlı bir ad verin ve **Create** düğmesini seçin. Kılavuz, `DEMO NODE` adını kullanmanızı önerir.
    
4.  Oluşturulan düğümün **Token** alanının üzerine fare imlecini getirin ve değeri kopyalayın.

    !!! info "Belirteç (token) hakkında not"
        Belirteç, bir Wallarm API çağrısı ile de alınabilir. Ancak bu, bu belgenin kapsamı dışındadır. 
        
##  3.  Gerekli ortam değişkenlerini içeren bir dosya hazırlayın 

FAST düğümünün çalışması için birkaç ortam değişkenini ayarlamanız gerekir.

Bunu yapmak için bir metin dosyası oluşturun ve aşağıdaki metni ekleyin:

```
WALLARM_API_TOKEN=<2. adımda edindiğiniz belirteç değeri>
ALLOWED_HOSTS=google-gruyere.appspot.com
```

Ortam değişkenlerini ayarladınız. Amaçları aşağıdaki gibidir:
* `WALLARM_API_TOKEN` — düğümü Wallarm cloud’a bağlamak için kullanılan belirteç değerini ayarlar
* `ALLOWED_HOSTS` — güvenlik testi üretilecek isteklerin kapsamını sınırlar; güvenlik testleri yalnızca hedef uygulamanın bulunduğu `google-gruyere.appspot.com` alan adına yapılan isteklerden üretilecektir.
    
!!! info "`ALLOWED_HOSTS` ortam değişkeninin kullanımı"
    Tam nitelikli alan adını belirtmek zorunlu değildir. Bir alt dizi de kullanabilirsiniz (örn. `google-gruyere` veya `appspot.com`).

--8<-- "../include/fast/wallarm-api-host-note.md"
   
##  4.  FAST düğümü Docker konteynerini dağıtın

Bunu yapmak için aşağıdaki komutu çalıştırın:

```
docker run --name <ad> --env-file=<önceki adımda oluşturulan ortam değişkenleri dosyası> -p <hedef bağlantı noktası>:8080 wallarm/fast
```

Komuta birkaç argüman sağlamalısınız:
    
* **`--name`** *`<ad>`*
        
    Docker konteynerinin adını belirtir.
    
    Tüm mevcut konteyner adları arasında benzersiz olmalıdır.
    
* **`--env-file=`** *`<önceki adımda oluşturulan ortam değişkenleri dosyası>`*
    
    Konteynere aktarılacak tüm ortam değişkenlerini içeren bir dosyayı belirtir.
    
    [Önceki adımda][anchor3] oluşturduğunuz dosyanın yolunu belirtmelisiniz.

* **`-p`** *`<hedef bağlantı noktası>`* **`:8080`**
    
    Konteynerin 8080 numaralı bağlantı noktasının eşleneceği Docker host’unun bağlantı noktasını belirtir. Varsayılan olarak konteyner bağlantı noktalarının hiçbiri Docker host’una açık değildir. 
    
    Belli bir konteyner bağlantı noktasına Docker host’undan erişim vermek için `-p` argümanını kullanarak konteynerin dahili bağlantı noktasını harici bir bağlantı noktasına yayımlamalısınız. 
    
    Ayrıca `-p <host IP>:<hedef bağlantı noktası>:8080` argümanını vererek konteynerin bağlantı noktasını host üzerindeki bir loopback olmayan IP adresine yayımlayabilir ve Docker host’u dışından da erişilebilir hale getirebilirsiniz.        

!!! info "`docker run` komutu örneği"
    Aşağıdaki komutun çalıştırılması, `/home/user/fast.cfg` ortam değişkenleri dosyasını kullanarak `fast-node` adlı bir konteyneri başlatacak ve bağlantı noktasını `localhost:8080` olarak yayımlayacaktır:

    ```
    docker run --name fast-node --env-file=/home/user/fast.cfg -p 8080:8080 wallarm/fast
    ```

Konteyner dağıtımı başarılı olursa, aşağıdakine benzer bir konsol çıktısı göreceksiniz:

--8<-- "../include/fast/console-include/qsg/fast-node-deployment-ok.md"

Artık Wallarm cloud’a bağlı, çalışmaya hazır bir FAST düğümüne sahip olmalısınız. Düğüm, `google-gruyere.appspot.com` alanına yönelik istekleri temel (baseline) olarak tanıyarak `localhost:8080` üzerinde gelen HTTP ve HTTPS isteklerini dinlemektedir.
    
    
##  5.  Tarayıcıyı proxy ile çalışacak şekilde yapılandırın

Tarayıcıyı tüm HTTP ve HTTPS isteklerini FAST düğümü üzerinden proxy’leyecek şekilde yapılandırın. 

Mozilla Firefox tarayıcısında proxy kurulumu için aşağıdakileri yapın:

1.  Tarayıcıyı açın. Menüden “Preferences” öğesini seçin. “General” sekmesini seçin ve “Network Settings” bölümüne kadar aşağı kaydırın. **Settings** düğmesini seçin.

    ![Mozilla Firefox seçenekleri][img-firefox-options]

2.  “Connection Settings” penceresi açılmalıdır. **Manual proxy configuration** seçeneğini seçin. Proxy’yi aşağıdaki değerleri girerek yapılandırın:

    * **`localhost`** adresini HTTP proxy adresi, **`8080`** değerini HTTP proxy bağlantı noktası olarak.
    * **`localhost`** adresini SSL proxy adresi, **`8080`** değerini SSL proxy bağlantı noktası olarak.
        
    Yaptığınız değişiklikleri uygulamak için **ОК** düğmesini seçin.

    ![Mozilla Firefox proxy ayarları][img-firefox-proxy-options]
    
    
##  6.  SSL sertifikalarını kurun

[Google Gruyere][link-https-google-gruyere] uygulamasıyla HTTPS üzerinden çalışırken, güvenli bağlantının kesilmesine ilişkin aşağıdaki tarayıcı mesajıyla karşılaşabilirsiniz:

![“Güvenli olmayan bağlantı” mesajı][img-insecure-connection]

Web uygulamasıyla HTTPS üzerinden etkileşim kurabilmek için, kendinden imzalı FAST düğümü SSL sertifikasını eklemeniz gerekir. Bunu yapmak için bu [bağlantıya][link-ssl-installation] gidin, listeden tarayıcınızı seçin ve açıklanan gerekli adımları uygulayın. Bu kılavuz, Mozilla Firefox tarayıcısını kullanmanızı önerir.
        
FAST düğümünüzü çalıştırıp yapılandırdıktan sonra, bu bölümün tüm hedeflerini tamamlamış olmalısınız. Bir sonraki bölümde, birkaç temel isteğe dayanarak bir dizi güvenlik testi oluşturmak için gerekenleri öğreneceksiniz.