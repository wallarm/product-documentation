## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış ve **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` ya da EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, lütfen [instructions][wallarm-api-via-proxy] bağlantısını kullanın
* Tüm komutları Wallarm örneğinde süper kullanıcı (ör. `root`) olarak çalıştırma

## 1. Filtreleme düğümü örneği başlatma

### Google Cloud UI üzerinden örneği başlatma

Filtreleme düğümü örneğini Google Cloud UI üzerinden başlatmak için, lütfen [Wallarm node image on the Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) sayfasını açın ve **GET STARTED** butonuna tıklayın.

Örnek, önceden yüklenmiş bir filtreleme düğümü ile başlatılacaktır. Google Cloud'da örnek başlatma hakkında detaylı bilgi için lütfen [official Google Cloud Platform documentation][link-launch-instance] sayfasına gidin.

### Terraform veya diğer araçlar ile örneği başlatma

Wallarm GCP imajını kullanarak filtreleme düğümü örneğini başlatmak için Terraform gibi bir araç kullanıyorsanız, Terraform yapılandırmanıza bu imajın adını sağlamanız gerekebilir.

* İmaj adı aşağıdaki formatta olmalıdır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü sürüm 4.8 ile örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

İmaj adını almak için ayrıca aşağıdaki adımları izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) yükleyin.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. En güncel imajın adından sürüm değerini kopyalayın ve kopyaladığınız değeri sağlanan imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü sürüm 4.8 imajı aşağıdaki adı taşıyacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. Filtreleme düğümü örneğini yapılandırma

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki adımları izleyin:

1. Menüdeki **Compute Engine** bölümünde **VM instances** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Edit** butonuna tıklayın.
3. **Firewalls** ayarında ilgili onay kutularını işaretleyerek gerekli gelen trafik türlerine izin verin.
4. Gerekirse, proje SSH anahtarlarıyla bağlantıyı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunun için aşağıdaki adımları izleyin:
    1. **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2. **SSH Keys** ayarında bulunan **Show and edit** butonuna tıklayarak SSH anahtarının girileceği alanı genişletin.
    3. Bir çift açık ve özel SSH anahtarı oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. Kullanılan anahtar oluşturucusunun arayüzünden OpenSSH formatında bir açık anahtarı kopyalayın (bu örnekte, oluşturulan açık anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Bu anahtar, gelecekte yapılandırılan örneğe bağlanmak için gerekecektir.
5. Değişiklikleri uygulamak için sayfanın altındaki **Save** butonuna tıklayın.

## 3. SSH ile filtreleme düğümü örneğine bağlanma

Örneklere bağlanmanın çeşitli yolları hakkında detaylı bilgi için lütfen bu [link](https://cloud.google.com/compute/docs/instances/connecting-to-instance) bağlantısına gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme düğümünü Wallarm Cloud ile bağlama

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"