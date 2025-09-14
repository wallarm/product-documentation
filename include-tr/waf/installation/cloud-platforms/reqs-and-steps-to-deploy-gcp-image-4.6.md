## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, lütfen [talimatlar][wallarm-api-via-proxy]ı kullanın
* Tüm komutların Wallarm örneğinde süper kullanıcı olarak (örn. `root`) yürütülmesi

## 1. Bir filtreleme düğümü örneği başlatın

### Örneği Google Cloud UI üzerinden başlatın

Filtreleme düğümü örneğini Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace'teki Wallarm node imajını](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **GET STARTED**’a tıklayın.

Örnek, önceden kurulu bir filtreleme düğümü ile başlatılacaktır. Google Cloud’da örnek başlatma hakkında ayrıntılı bilgi için lütfen [resmi Google Cloud Platform belgeleri][link-launch-instance]ne bakın.

### Örneği Terraform veya diğer araçlar ile başlatın

Wallarm GCP imajını kullanarak bir araç (ör. Terraform) ile filtreleme düğümü örneği başlatırken, Terraform yapılandırmasında bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formata sahiptir:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümünün 4.6 sürümü ile örnek başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)’yı kurun.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. Mevcut en son imajın adından sürüm değerini kopyalayın ve kopyalanan değeri sağlanan imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü 4.6 sürüm imajının adı aşağıdaki gibi olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1.  Menünün **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2.  Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3.  **Firewalls** ayarındaki ilgili onay kutularını işaretleyerek gerekli türde gelen trafiğe izin verin.
4.  Gerekirse, projeye ait SSH anahtarları ile bu örneğe bağlantıyı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki adımları uygulayın:
    1.  **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2.  Bir SSH anahtarı girmek için alanı genişletmek üzere **SSH Keys** ayarındaki **Show and edit** düğmesine tıklayın.
    3.  Genel ve özel SSH anahtarlarından oluşan bir çift oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4.  Kullanılan anahtar üreticisinin arayüzünden OpenSSH formatında bir açık anahtarı kopyalayın (mevcut örnekte, üretilen genel anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5.  Özel anahtarı kaydedin. İleride yapılandırılmış örneğe bağlanmak için gerekli olacaktır.
5.  Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. Filtreleme düğümü örneğine SSH üzerinden bağlanın

Örneklere bağlanma yöntemleri hakkında ayrıntılı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme düğümünü Wallarm Cloud'a bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"