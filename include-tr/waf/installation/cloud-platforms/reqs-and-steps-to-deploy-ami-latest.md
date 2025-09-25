## Gereksinimler

* Bir AWS hesabı
* AWS EC2 ve Security Group'lar hakkında bilgi
* İstediğiniz herhangi bir AWS bölgesi; Wallarm Node dağıtımı için bölgeye özel bir kısıtlama yoktur.

    Wallarm, tek erişilebilirlik bölgesi (AZ) ve çoklu erişilebilirlik bölgesi dağıtımlarını destekler. Çoklu-AZ kurulumlarında, Wallarm Node'ları ayrı erişilebilirlik bölgelerinde başlatılabilir ve yüksek erişilebilirlik için bir Load Balancer arkasına yerleştirilebilir.
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* Tüm komutların bir Wallarm instance'ında süper kullanıcı (ör. `root`) olarak çalıştırılması
 
## Kurulum

### 1. Bir Wallarm Node instance'ı başlatın

[Wallarm NGINX Node AMI](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe) kullanarak bir EC2 instance'ı başlatın.

Önerilen yapılandırma: 

* Mevcut en güncel [AMI sürümü][latest-node-version]
* Tercih ettiğiniz herhangi bir AWS bölgesi
* EC2 instance türü: `t3.medium` (test için) veya `m4.xlarge` (prod için), ayrıntılar için [maliyet rehberine bakın][aws-costs]
* Instance'a erişim için [SSH anahtar çifti](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html)
* Altyapınıza bağlı olarak uygun [VPC ve alt ağ](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) üzerinden 22, 80 ve 443 numaralı portlara inbound erişim

    !!! info "Wallarm tarafından önceden yapılandırılmış bir Security Group kullanma"
        Instance'ı dağıtıp bir Security Group oluşturduğunuzda, AWS size Wallarm tarafından önceden yapılandırılmış olanı kullanmayı önerir. Bu grup, inbound erişim için gerekli tüm portları zaten açık durumda sağlar.

        ![!Önceden yapılandırılmış Security Group][img-security-group]

* [Security Group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html) üzerinden aşağıdakilere outbound erişim:

    * Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com`
    * US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com`. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
    * Saldırı tespit kurallarına ve [API spesifikasyonlarına][api-spec-enforcement-docs] yönelik güncellemeleri indirmek ve [izinli, yasaklı veya gri listede olan][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adresleri

        --8<-- "../include/wallarm-cloud-ips.md"

### 2. SSH ile Wallarm Node instance'ına bağlanın

Çalışan EC2 instance’ınıza bağlanmak için [seçtiğiniz SSH anahtarını kullanın](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-to-linux-instance.html):

```bash
ssh -i <your-key.pem> admin@<your-ec2-public-ip>
```

Instance'a bağlanmak için `admin` kullanıcı adını kullanmanız gerekir.

### 3. Bir instance'ı Wallarm Cloud'a bağlamak için bir token oluşturun

Wallarm node’unun Wallarm Cloud'a uygun türde bir [Wallarm token][wallarm-token-types] ile bağlanması gerekir. Bir API token, Wallarm Console UI içinde bir node grubu oluşturmanıza olanak tanır; bu, node instance’larınızı daha etkili şekilde organize etmenize yardımcı olur.

![Gruplandırılmış node'lar][img-grouped-nodes]

Token’ı şu şekilde oluşturun:

=== "API belirteci"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) içinde açın.
    1. Kullanım türü `Node deployment/Deployment` olan bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
=== "Node token'ı"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) içinde açın.
    1. Şunlardan birini yapın: 
        * **Wallarm node** türünde bir node oluşturun ve üretilen token'ı kopyalayın.
        * Mevcut node grubunu kullanın - node'un menüsünü kullanarak → **Copy token** ile token'ı kopyalayın.