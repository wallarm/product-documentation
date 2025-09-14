## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` erişimi. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Saldırı tespit kurallarının ve [API spesifikasyonlarının][api-spec-enforcement-docs] güncellemelerini indirmek ve [izinli listeye, yasaklı listeye veya gri listeye][ip-lists-docs] aldığınız ülkeler, bölgeler veya veri merkezleri için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutların bir Wallarm instance’ında süper kullanıcı (ör. `root`) olarak çalıştırılması

## 1. Filtreleme düğümü (filtering node) instance’ı başlatın

### Google Cloud UI üzerinden instance başlatma

Filtreleme düğümü instance’ını Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace’teki Wallarm node imajını](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **GET STARTED**’a tıklayın.

Instance, önceden kurulmuş bir filtreleme düğümü ile başlatılacaktır. Google Cloud’da instance başlatma hakkında ayrıntılı bilgi için lütfen [resmi Google Cloud Platform dokümantasyonu][link-launch-instance] sayfasına gidin.

### Terraform veya diğer araçlar ile instance başlatma

Terraform gibi bir aracı kullanarak Wallarm GCP imajını temel alan filtreleme düğümü instance’ı başlatırken, Terraform yapılandırmasında bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formattadır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü sürümü 5.x ile bir instance başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-6-5-1-20250908-174655
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK’yı](https://cloud.google.com/sdk/docs/install) kurun.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-6-5-*'" --no-standard-images
    ```
3. En son mevcut imajın adından sürüm değerini kopyalayın ve verilen imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü sürümü 4.10 imajı aşağıdaki ada sahip olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-6-5-1-20250908-174655
    ```

## 2. Filtreleme düğümü instance’ını yapılandırın

Başlatılan filtreleme düğümü instance’ını yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1.  Menüde **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2.  Başlatılan filtreleme düğümü instance’ını seçin ve **Edit** düğmesine tıklayın.
3.  **Firewalls** ayarındaki ilgili onay kutularını işaretleyerek gerekli türde gelen trafiğe izin verin.
4.  Gerekirse, instance’a proje SSH anahtarlarıyla bağlantıyı kısıtlayabilir ve bu instance’a bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için şu işlemleri gerçekleştirin:
    1.  **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2.  **SSH Keys** ayarında **Show and edit** düğmesine tıklayın ve SSH anahtarını girmek için alanı genişletin.
    3.  Genel ve özel SSH anahtarlarından oluşan bir çift üretin. Örneğin `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4.  Kullanılan anahtar üretici arayüzünden OpenSSH formatında açık anahtarı kopyalayın (bu örnekte, oluşturulan genel anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5.  Özel anahtarı kaydedin. Gelecekte yapılandırılmış instance’a bağlanmak için gerekecektir.
5.  Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. Filtreleme düğümü instance’ına SSH ile bağlanın

Instance’lara bağlanma yöntemleri hakkında ayrıntılı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Bir instance’ı Wallarm Cloud’a bağlamak için token oluşturun

Yerel Wallarm filtreleme düğümünün, [uygun türdeki][wallarm-token-types] bir Wallarm token’ı kullanarak Wallarm Cloud ile bağlantı kurması gerekir. Bir API token’ı, Wallarm Console UI içinde bir node grubu oluşturmanıza olanak tanır ve bu da node instance’larınızı etkili şekilde organize etmenize yardımcı olur.

![Gruplandırılmış node’lar][img-grouped-nodes]

Token’ı şu şekilde oluşturun:

=== "API belirteci"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. `Node deployment/Deployment` kullanım tipine sahip bir API token’ı bulun veya oluşturun.
    1. Bu token’ı kopyalayın.
=== "Node belirteci"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. Şunlardan birini yapın: 
        * **Wallarm node** tipinde bir node oluşturun ve oluşturulan token’ı kopyalayın.
        * Mevcut node grubunu kullanın - node’un menüsünden → **Copy token** ile token’ı kopyalayın.