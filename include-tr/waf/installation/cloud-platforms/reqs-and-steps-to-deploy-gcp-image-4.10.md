## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Saldırı tespiti kuralları ve [API spesifikasyonları][api-spec-enforcement-docs] güncellemelerini indirmek, ayrıca [allowlisted, denylisted veya graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutların bir Wallarm örneğinde süper kullanıcı (ör. `root`) olarak yürütülmesi

## 1. Bir filtreleme düğümü örneği başlatın

### Örneği Google Cloud UI üzerinden başlatın

Filtreleme düğümü örneğini Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace’teki Wallarm node imajını](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **GET STARTED**’a tıklayın.

Örnek, önceden kurulu bir filtreleme düğümü ile başlatılacaktır. Google Cloud’da örnek başlatma hakkında ayrıntılı bilgi için lütfen [resmi Google Cloud Platform belgelerine][link-launch-instance] göz atın.

### Örneği Terraform veya diğer araçlar üzerinden başlatın

Terraform gibi bir aracı kullanarak Wallarm GCP imajı ile filtreleme düğümü örneğini başlatırken, Terraform yapılandırmasında bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formata sahiptir:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü 4.10 sürümü ile örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK’yı](https://cloud.google.com/sdk/docs/install) kurun.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-10-*'" --no-standard-images
    ```
3. En son kullanılabilir imajın adından sürüm değerini kopyalayın ve kopyaladığınız değeri sağlanan imaj adı formatına yerleştirin. Örneğin, filtreleme düğümü 4.10 sürümü imajı şu ada sahip olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1.  Menüde **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2.  Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3.  **Firewalls** ayarındaki ilgili onay kutularını işaretleyerek gerekli gelen trafik türlerine izin verin.
4.  Gerekirse, projedeki SSH anahtarlarıyla örneğe bağlantıyı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki adımları uygulayın:
    1.  **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2.  Bir SSH anahtarı girme alanını genişletmek için **SSH Keys** ayarındaki **Show and edit** düğmesine tıklayın.
    3.  Bir genel ve bir özel SSH anahtarı çifti oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4.  Kullandığınız anahtar oluşturucunun arayüzünden OpenSSH formatında bir açık anahtarı kopyalayın (bu örnekte, oluşturulan genel anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5.  Özel anahtarı kaydedin. Gelecekte yapılandırılmış örneğe bağlanmak için gerekecektir.
5.  Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. Filtreleme düğümü örneğine SSH ile bağlanın

Örneklere bağlanma yöntemleri hakkında ayrıntılı bilgi için şu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Örneği Wallarm Cloud’a bağlamak için bir token oluşturun

Yerel Wallarm filtreleme düğümünün, [uygun türde][wallarm-token-types] bir Wallarm token’ı kullanarak Wallarm Cloud ile bağlantı kurması gerekir. Bir API token’ı, Wallarm Console UI içinde bir node grubu oluşturmanıza olanak tanır; bu da node örneklerinizi etkin şekilde organize etmenize yardımcı olur.

![Gruplandırılmış düğümler][img-grouped-nodes]

Token’ı aşağıdaki şekilde oluşturun:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens**’ı [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. `Node deployment/Deployment` kullanım türüne sahip bir API token’ı bulun veya oluşturun.
    1. Bu token’ı kopyalayın.
=== "Node token"

    1. Wallarm Console → **Nodes**’u [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. Şunlardan birini yapın: 
        * **Wallarm node** türünde bir node oluşturun ve üretilen token’ı kopyalayın.
        * Mevcut node grubunu kullanın - token’ı node’un menüsünden → **Copy token** ile kopyalayın.