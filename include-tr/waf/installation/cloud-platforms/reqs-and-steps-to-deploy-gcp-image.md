## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda **Yönetici** rolü ve iki faktörlü doğrulama devre dışı bırakılmış hesaba erişim
* ABD Wallarm Bulutu ile çalışırken `https://us1.api.wallarm.com:444` veya AB Wallarm Bulutu ile çalışırken `https://api.wallarm.com:444` adresine erişim. Eğer erişim sadece proxy sunucusu üzerinden yapılandırılabilirse, [yönergeleri][wallarm-api-via-proxy] kullanın.
* Tüm komutların Wallarm örneğinde süper kullanıcı (örneğin `root`) olarak yürütülmesi

## 1. Bir filtreleme düğümü örneği başlatın

### Google Cloud UI aracılığıyla örneği başlatın

Filtreleme düğümü örneğini Google Cloud UI aracılığıyla başlatmak için lütfen [Google Cloud Marketplace'teki Wallarm düğümü resmini](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **BAŞLAT**'a tıklayın.

Örneği, önceden yüklenmiş bir filtreleme düğümü ile başlatır. Google Cloud'da örneklerin nasıl başlatıldığına dair ayrıntılı bilgi için lütfen [resmi Google Cloud Platform belgelerine][link-launch-instance] geçiş yapın.

### Terraform veya diğer araçlar aracılığıyla örneği başlatın

Terraform gibi bir araç kullanarak Wallarm GCP imajını kullanarak filtreleme düğümü örneğini başlatırken, bu imajın adını Terraform yapılandırmasında belirtmeniz gerekebilir.

* Image adı aşağıdaki formatta olmalıdır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümünün 4.8 sürümüyle örneği başlatmak için lütfen aşağıdaki image adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

Image adını almak için ayrıca bu adımları da izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)'yi yükleyin.
2. Aşağıdaki parametrelerle birlikte [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. Son kullanılabilir imajın adındaki sürüm değerini kopyalayın ve kopyalanan değeri sağlanan resim adı formatına yapıştırın. Örneğin, filtreleme düğümünün 4.8 sürümü resmi şu adı taşıyacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki eylemleri gerçekleştirin:

1. Menünün **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Düzenle** düğmesine tıklayın.
3. **Firewall** ayarında ilgili kutuları işaretleyerek gerekli türde gelen trafiğe izin verin.
4. Gerekirse, örneğe proje SSH anahtarlarıyla bağlanmayı sınırlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki eylemleri gerçekleştirin:
    1. **SSH Keys** ayarında **Block project-wide** kutusunu işaretleyin.
    2. **SSH Keys** ayarında bir SSH anahtarı girme alanını genişletmek için **Show and edit** düğmesine tıklayın.
    3. Bir çift genel ve özel SSH anahtarı oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarlarını oluşturmak][img-ssh-key-generation]

    4. Kullanılan anahtar üretecinin arayüzünden bir açık anahtarı OpenSSH formatında kopyalayın (mevcut örnekte, oluşturulan genel anahtarın PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanması gerekir) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Gelecekte yapılandırılmış örneğe bağlanmak için gerekli olacaktır.
5. Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. SSH üzerinden filtreleme düğümü örneğine bağlanın

Örneklere bağlanma yolları hakkında ayrıntılı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) geçiş yapın.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme düğümünü Wallarm Cloud'a bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"
