# Wallarm AMI Kurulumu: Inline ve OOB Modları İçin AWS Üzerinde Dağıtım

Bu makale, Amazon Machine Image (AMI) kullanarak AWS üzerinde bir Wallarm filtering node’un nasıl dağıtılacağını açıklamaktadır. Aşağıdaki adımları izleyerek Wallarm kurulumu gerçekleştirebilirsiniz.

## Ön Koşullar

- AWS hesabınızın olması
- EC2 anahtar çiftleri oluşturma bilgisine sahip olmanız  
  Daha fazla bilgi için [Create a Key Pair][link-ssh-keys] sayfasına bakın ([1. SSH anahtar çiftinizi AWS’de oluşturma][anchor2]).
- Temel bir güvenlik grubu oluşturmanız  
  Bununla ilgili detaylar [Create a Base Security Group][link-sg] sayfasında yer almaktadır ([2. Güvenlik grubunu oluşturma][anchor1]).

## Adım 1: Anahtar Çifti ve Güvenlik Grubunu Oluşturma

1. **Anahtar Çifti Oluşturma:**  
   AWS EC2 instance’ınıza SSH ile güvenli erişim sağlamak için bir anahtar çifti oluşturmanız gerekmektedir. Belirtilen adımları [Create a Key Pair][link-ssh-keys] sayfasından takip edebilirsiniz.

2. **Güvenlik Grubunu Oluşturma:**  
   Temel erişim kurallarını belirlemeniz için bir güvenlik grubu oluşturmanız gerekir. Bu işlemle ilgili detaylı talimatlar için [Create a Base Security Group][link-sg] sayfasını inceleyin. Aşağıdaki görsel, güvenlik grubunun nasıl oluşturulacağına dair örnek adımları göstermektedir:  
   ![Güvenlik Grubu Oluşturma][img-create-sg]

## Adım 2: EC2 Instance’ını Başlatma

Wallarm filtering node’unuzu çalıştırmak için AWS üzerinde bir EC2 instance’ı başlatmanız gerekmektedir:

- EC2 instance’ınızı başlatma ve AMI seçimi ile ilgili bilgi için [Launch an Instance][link-launch-instance] sayfasına göz atın.
- Instance oluşturma sırasında [Create a Cloud Node][img-create-wallarm-node] görselinden yararlanabilirsiniz.

## Adım 3: Dağıtım Seçeneklerini ve Ek Ayarları Yapılandırma

Kurulum sırasında çeşitli yapılandırma adımlarını gerçekleştirmeniz gerekmektedir:

- **Dağıtım Platformu Seçenekleri:**  
  Wallarm’ın desteklediği dağıtım seçeneklerini öğrenmek için lütfen [Supported Deployment Options][deployment-platform-docs] sayfasını inceleyin.

- **Wallarm Filtering Node Kurulumu:**  
  Wallarm filtering node’u dağıtmak için gerekli adımlara [Deploy the Wallarm Filtering Node][node-token] sayfasından ulaşabilirsiniz.

- **API ve Node Token Yapılandırması:**  
  API erişimi için gerekli token’ları oluşturmak üzere [API Tokens][api-token] ve [API and Node Tokens for Node Creation][wallarm-token-types] dökümantasyonlarına bakın.

- **Gelişmiş Ayarlar:**  
  Daha detaylı yapılandırma seçenekleri için:
  - [Wallarm Nginx Directives][wallarm-nginx-directives]
  - [Autoscaling Overview][autoscaling-docs]
  - [Real IP Document][real-ip-docs]
  - [Allocate Resources for Node][allocate-memory-docs]
  - [Configure Overlimit Resource Detection][limiting-request-processing]
  - [Configure Logging][logs-docs]

## Adım 4: Inline ve OOB Modlarının Yapılandırılması

Kurulumu gerçekleştirirken, Wallarm’ın iki farklı modunu (Inline ve Out-of-Band) yapılandırabilirsiniz:

- **OOB (Out-of-Band) Modu:**  
  OOB modu ile ilgili avantaj ve sınırlamalar hakkında [Overview][oob-docs] sayfası ile [Limitations][oob-advantages-limitations] bölümüne göz atın.

- **Inline Modu:**  
  Inline modu ile ilgili ayrıntılı bilgiye [Overview][inline-docs] sayfasından ulaşabilirsiniz.

## Adım 5: Ek Erişim ve Yönlendirme Ayarları

- **Wallarm API’ye Proxy Üzerinden Erişim:**  
  Proxy kullanarak Wallarm API erişimini yapılandırmak için [Access to Wallarm API via Proxy][wallarm-api-via-proxy] rehberini inceleyin.

- **Traffic Mirroring Konfigürasyonu:**  
  Trafik yansıtma örnek yapılandırmaları için [Configuration Examples for Traffic Mirroring][web-server-mirroring-examples] bölümüne bakabilirsiniz.

- **Node Gruplama:**  
  Birden fazla node, gruplar halinde yönetilebilmektedir. Grup halinde node’ların nasıl göründüğünü görmek için aşağıdaki görsele bakın:  
  ![Grouped Nodes][img-grouped-nodes]

## Adım 6: Cloud-init ve Diğer Ek Yapılandırmalar

- **Cloud-init Kullanımı:**  
  Instance başlatma sırasında yapılandırma için [Cloud-init Specification][cloud-init-spec] dökümantasyonunu inceleyin.

- **Zorlayıcı Yapılandırmalar:**  
  Gerektiğinde Wallarm’ın yapılandırmasını zorlamak için [wallarm_force_directive] bağlantısını kontrol edin.

- **IP Listeleri ve API Spesifikasyonu Uygulamaları:**  
  - IP listelerini yönetmek için [IP Lists Overview][ip-lists-docs] belgesine bakın.
  - API spesifikasyonu uygulamasını sağlamak için [Enforcement Overview][api-spec-enforcement-docs] dökümantasyonunu inceleyin.

## Sonuç

Yukarıdaki adımları tamamladıktan sonra, AWS üzerinde başarılı bir şekilde Wallarm filtering node’unuzu çalıştırmış olacaksınız. Tüm yapılandırmalar yapıldıktan sonra, sisteminiz istenen modda (Inline veya OOB) sorunsuz bir şekilde çalışmaya başlayacaktır.

Daha fazla destek ve detaylı bilgi için ilgili bağlantılara göz atmanız önerilir.

[link-ssh-keys]:            https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-key-pair
[link-sg]:                  https://docs.aws.amazon.com/en_us/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html#create-a-base-security-group
[link-launch-instance]:     https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance

[anchor1]:      #2-create-a-security-group
[anchor2]:      #1-create-a-pair-of-ssh-keys-in-aws

[img-create-sg]:                ../../images/installation-ami/common/create_sg.png
[versioning-policy]:            ../../updating-migrating/versioning-policy.md#version-list
[img-wl-console-users]:         ../../images/check-user-no-2fa.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[deployment-platform-docs]:     ../../installation/supported-deployment-options.md
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[wallarm-nginx-directives]:         ../../admin-en/configure-parameters-en.md
[autoscaling-docs]:                 ../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md
[real-ip-docs]:                     ../../admin-en/using-proxy-or-balancer-en.md
[allocate-memory-docs]:             ../../admin-en/configuration-guides/allocate-resources-for-node.md
[limiting-request-processing]:      ../../user-guides/rules/configure-overlimit-res-detection.md
[logs-docs]:                        ../../admin-en/configure-logging.md
[oob-advantages-limitations]:       ../oob/overview.md#limitations
[wallarm-mode]:                     ../../admin-en/configure-wallarm-mode.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[wallarm-api-via-proxy]:            ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[cloud-init-spec]:                  ../cloud-platforms/cloud-init.md
[wallarm_force_directive]:          ../../admin-en/configure-parameters-en.md#wallarm_force
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md