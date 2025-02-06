## Gereksinimler

* Bir GCP hesabı  
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü doğrulama devre dışı bırakılmış ve **Administrator** rolüne sahip hesap erişimi  
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` erişimi. Erişimin yalnızca proxy sunucusu üzerinden yapılandırılabileceği durumlarda, [instructions][wallarm-api-via-proxy] yönergelerini kullanın.  
* Tüm komutları bir Wallarm örneğinde süper kullanıcı (örn. `root`) olarak çalıştırma

## 1. Filtreleme Düğüm Örneğini Başlatın

### Google Cloud UI Aracılığıyla Örneği Başlatma

Filtreleme düğüm örneğini Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace'de Wallarm node image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) sayfasını açın ve **GET STARTED** düğmesine tıklayın.

Örnek, önceden yüklü bir filtreleme düğümü ile başlatılacaktır. Google Cloud'da örnek başlatma hakkında ayrıntılı bilgi için lütfen [official Google Cloud Platform documentation][link-launch-instance] sayfasına gidin.

### Terraform veya Diğer Araçlar Aracılığıyla Örneği Başlatma

Wallarm GCP imajını kullanarak Terraform gibi bir araç ile filtreleme düğüm örneğini başlatırken, Terraform yapılandırmasına bu imajın adını sağlamanız gerekebilir.

* İmaj adı aşağıdaki formatta olmalıdır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğüm versiyonu 4.6 ile örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

İmaj adını almak için aşağıdaki adımları izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)'yi kurun.  
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. En son kullanılabilir imajın adındaki versiyon değerini kopyalayın ve kopyaladığınız değeri verilen imaj adı formatına yapıştırın. Örneğin, filtreleme düğüm versiyonu 4.6 imajı aşağıdaki adı alacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. Filtreleme Düğüm Örneğini Yapılandırma

Başlatılan filtreleme düğüm örneğini yapılandırmak için aşağıdaki adımları izleyin:

1. Menünün **Compute Engine** bölümünde yer alan **VM instances** sayfasına gidin.  
2. Başlatılan filtreleme düğüm örneğini seçin ve **Edit** düğmesine tıklayın.  
3. **Firewalls** ayarında ilgili onay kutularını işaretleyerek gerekli gelen trafik türlerine izin verin.  
4. Gerekirse, projedeki SSH anahtarları ile bağlanmayı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki adımları izleyin:  
    1. **SSH Keys** ayarında **Block project-wide** kutucuğunu işaretleyin.  
    2. **SSH Keys** ayarında **Show and edit** düğmesine tıklayarak SSH anahtarı giriş alanını genişletin.  
    3. Bir açık ve özel SSH anahtar çifti oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. Kullanılan anahtar oluşturma aracının arayüzünden OpenSSH formatında bir açık anahtarı kopyalayın (bu örnekte, oluşturulan açık anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.  
    5. Özel anahtarı kaydedin. Bu, ileride yapılandırılan örneğe bağlanmak için gerekecektir.  
5. Yapılan değişiklikleri uygulamak için sayfanın en altındaki **Save** düğmesine tıklayın.

## 3. Filtreleme Düğüm Örneğine SSH Üzerinden Bağlanma

Örneklerle bağlantı kurma yolları hakkında ayrıntılı bilgi için lütfen bu [link](https://cloud.google.com/compute/docs/instances/connecting-to-instance) sayfasına gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme Düğümünü Wallarm Cloud'a Bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"