## Gereksinimler

* Bir AWS hesabı
* AWS EC2 ve Security Groups hakkında bilgi sahibi olmak
* Wallarm düğümünün dağıtımı için bölge üzerinde özel bir kısıtlama olmadığından, seçtiğiniz herhangi bir AWS bölgesi

    Wallarm, tekli kullanılabilirlik alanı (AZ) ve çoklu kullanılabilirlik alanı dağıtımlarını destekler. Çoklu AZ kurulumlarında, Wallarm Düğümleri ayrı kullanılabilirlik alanlarında başlatılabilir ve yüksek erişilebilirlik için bir Load Balancer arkasına yerleştirilebilir.
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adreslerine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Tüm komutların bir Wallarm örneğinde süper kullanıcı (örn. `root`) olarak yürütülmesi

## 1. AWS'te bir SSH anahtar çifti oluşturun

Dağıtım süreci sırasında, sanal makineye SSH üzerinden bağlanmanız gerekecektir. Amazon EC2, örneğe bağlanmak için kullanılabilecek adlandırılmış bir genel ve özel SSH anahtar çifti oluşturulmasına izin verir.

Bir anahtar çifti oluşturmak için:

1. Amazon EC2 panosunda **Key pairs** sekmesine gidin.
2. **Create Key Pair** düğmesine tıklayın.
3. Bir anahtar çifti adı girin ve **Create** düğmesine tıklayın.

PEM biçiminde özel bir SSH anahtarı otomatik olarak indirilmeye başlayacaktır. Daha sonra oluşturulan örneğe bağlanmak için anahtarı saklayın.

SSH anahtarlarının oluşturulmasına ilişkin ayrıntılı bilgi için [AWS belgelerine][link-ssh-keys] bakın.

## 2. Bir Security Group oluşturun

Bir Security Group, sanal makineler için izin verilen ve yasaklanan gelen ve giden bağlantıları tanımlar. Nihai bağlantı listesi, korunan uygulamaya bağlıdır (ör. TCP/80 ve TCP/443 portlarına gelen tüm bağlantıların izin verilmesi).

Wallarm AMI, en az izin kümesi ile çalışacak şekilde tasarlanmıştır. Örneği dağıtırken, bir IAM rolü atamanızı ve güvenlik gruplarını en az ayrıcalık ilkesine göre yapılandırmanızı, düğümün AWS güvenlik en iyi uygulamalarıyla uyumlu çalışması için gereken erişimleri vermenizi öneririz.

Filtreleme düğümü için bir security group oluşturmak üzere:

1. Amazon EC2 panosunda **Security Groups** sekmesine gidin ve **Create Security Group** düğmesine tıklayın.
2. Açılan iletişim penceresine bir security group adı ve isteğe bağlı bir açıklama girin.
3. Gerekli VPC’yi seçin.
4. **Inbound** ve **Outbound** sekmelerinde gelen ve giden bağlantı kurallarını yapılandırın.
5. Security group oluşturmak için **Create** düğmesine tıklayın.

![Bir security group oluşturma][img-create-sg]

!!! warning "Security group'tan giden bağlantılar için kurallar"
    Bir security group oluştururken, tüm giden bağlantılar varsayılan olarak izinlidir. Filtreleme düğümünden giden bağlantıları kısıtlarsanız, bir Wallarm API sunucusuna erişim verildiğinden emin olun. Kullanmakta olduğunuz Wallarm Cloud’a bağlı olarak Wallarm API sunucusu seçimi değişir:

    *   US Cloud kullanıyorsanız, düğümünüzün `us1.api.wallarm.com` adresine erişiminin olması gerekir.
    *   EU Cloud kullanıyorsanız, düğümünüzün `api.wallarm.com` adresine erişiminin olması gerekir.
    
    Filtreleme düğümü, doğru çalışması için bir Wallarm API sunucusuna erişime ihtiyaç duyar.

Security group oluşturma hakkında ayrıntılı bilgi için [AWS belgelerine][link-sg] bakın.

## 3. Bir Wallarm düğüm örneği başlatın

Wallarm filtreleme düğümü ile bir örnek başlatmak için bu [bağlantıya](https://aws.amazon.com/marketplace/pp/B073VRFXSD) gidin ve filtreleme düğümüne abone olun.

Örnek oluştururken, [önceden oluşturulan][anchor1] security group’u aşağıdaki şekilde belirtmeniz gerekir:

1. Launch Instance Wizard ile çalışırken, ilgili sekmeye tıklayarak **6. Configure Security Group** adımına ilerleyin.
2. **Assign a security group** ayarında **Select an existing security group** seçeneğini seçin.
3. Açılan listeden security group’u seçin.

Gerekli tüm örnek ayarlarını belirledikten sonra **Review and Launch** düğmesine tıklayın, örneğin doğru yapılandırıldığından emin olun ve **Launch** düğmesine tıklayın.

Açılan pencerede, [önceden oluşturulan][anchor2] anahtar çiftini aşağıdaki işlemleri gerçekleştirerek belirtin:

1. İlk açılır listede **Choose an existing key pair** seçeneğini seçin.
2. İkinci açılır listeden anahtar çiftinin adını seçin.
3. İkinci açılır listede belirttiğiniz anahtar çiftinden PEM biçimindeki özel anahtara erişiminiz olduğundan emin olun ve bunu onaylamak için onay kutusunu işaretleyin.
4. **Launch Instances** düğmesine tıklayın.

Örnek, önceden yüklenmiş filtreleme düğümü ile başlatılacaktır.

AWS’de örnek başlatma hakkında ayrıntılı bilgi için [AWS belgelerine][link-launch-instance] bakın.

## 4. Filtreleme düğümü örneğine SSH ile bağlanın

Bir örneğe SSH üzerinden bağlanma yöntemleri hakkında ayrıntılı bilgi için [AWS belgelerine](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html) bakın.

Örneğe bağlanmak için `admin` kullanıcı adını kullanmanız gerekir.

!!! info "SSH ile bağlanmak için anahtarın kullanılması"
    Örneğe SSH ile bağlanmak için, [daha önce oluşturduğunuz][anchor2] PEM biçimindeki özel anahtarı kullanın. Bu, bir örnek oluştururken belirttiğiniz SSH anahtar çiftine ait özel anahtar olmalıdır.

## 5. Filtreleme düğümünü Wallarm Cloud'a bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"