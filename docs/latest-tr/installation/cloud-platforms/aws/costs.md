# AWS'de NGINX Node Dağıtımı için Maliyet Rehberi

Bu sayfa, AMI tabanlı EC2 instance'ları ve ECS tabanlı Docker container'ları gibi farklı yöntemlerle Wallarm NGINX Node'larının dağıtımıyla ilişkili tipik AWS altyapı maliyetlerini özetler.

Bunlar yalnızca AWS’e özgü maliyetlerdir ve [Wallarm abonelik ücretlerini](../../../about-wallarm/subscription-plans/) içermez.

## AMI tabanlı dağıtım (EC2 instance)

[NGINX Node AMI](ami.md) VPC’nizde bir EC2 instance olarak başlatılır. Yüksek erişilebilirlik için bir Application Load Balancer (ALB) arkasına birden fazla EC2 instance yerleştirebilirsiniz. Depolama için Amazon EBS ve standart AWS ağ bileşenlerini (VPC, subnets, security groups) da kullanırsınız.

Başlıca maliyet bileşenleri:

* EC2 instance saatleri: Maliyet, instance türüne, bölgeye ve çalışma süresine bağlıdır. Örneğin, `us-east` bölgesindeki bir `t3.medium` yaklaşık $0.0416/saat (~7/24 çalışırsa ~$/ay? düzeltme: ~$30/ay). Yedeklilik için birden fazla Node kullanıyorsanız instance sayısıyla çarpın.
* EBS depolama: 50 GB genel amaçlı SSD için tipik olarak ~$5/ay ekler.
* Elastic veya Application Load Balancer: Temel maliyet ~$16/ay olup trafiğe dayalı kullanım ücretleri (LCU’lar) eklenir; tipik toplam ~$22/ay olur. [ALB maliyetleri](https://aws.amazon.com/elasticloadbalancing/pricing/) daha yüksek trafikle artar.
* Veri transferi: EC2’den İnternet’e aylık ilk 100 GB giden trafik ücretsizdir; ek kullanım ~$0.09/GB olarak faturalandırılır. AZ’ler arası trafik (ör. bir başka AZ’deki EC2’ya ALB →) de bu oranda ücretlendirilir. Aynı AZ içindeki trafik ücretsizdir.

Bölge ve trafik temelinde kesin tahminler için [AWS Pricing Calculator](https://calculator.aws/) kullanın.

**Örnek tahmin:**

`us-east-1` bölgesinde, 7/24 çalışan bir `t3.medium` EC2 instance’ı, arkasında bir ALB ile, ayda ~10 milyon istek ve 200 GB dışa giden trafik:

* EC2 instance: ~$30/ay
* EBS depolama: ~$5/ay (50 GB SSD)
* ALB: ~$22/ay (temel + LCU kullanımı)
* Veri transferi: ~$9/ay (ilk 100 GB ücretsiz)
* Tahmini toplam: ~$60–70/ay ve ayrıca [Wallarm abonelik ücretleri](../../../about-wallarm/subscription-plans/)

## Amazon ECS (Docker container) dağıtımı

[Wallarm’ı (NGINX Node) AWS’de Amazon ECS kullanarak dağıtabilirsiniz](docker-container.md); bunu EC2 instance’ları üzerinde veya AWS Fargate ile yapabilirsiniz.

* EC2 üzerinde ECS: EC2 instance’larını siz yönetirsiniz, container orkestrasyonunu ECS üstlenir. Maliyetler [AMI tabanlı dağıtıma](#ami-based-deployment-ec2-instance) benzer — EC2, EBS, isteğe bağlı ALB ve veri transferi.
* Fargate üzerinde ECS: Tamamen yönetilen model. Ayrılan vCPU ve RAM için saniye bazında ödeme yaparsınız. EC2 instance yönetimi gerekmez.

AWS, ECS’nin kendisi için ücret almaz — yalnızca container’larınızın çalıştığı kaynaklar için ücret alınır.

Bölge ve trafik temelinde kesin tahminler için [AWS Pricing Calculator](https://calculator.aws/) kullanın.

**Örnek tahmin:**

`us-west-2` bölgesinde, 2 görev (her biri 1 vCPU ve 2 GB RAM), ayda ~10–15 milyon istek ve ~200 GB dışa giden trafik:

* Fargate işlem: ~$72/ay (2 görev × ~$36)
* ALB: ~$20/ay (temel + orta düzey trafik)
* Veri transferi: ~$9/ay (ilk 100 GB ücretsiz, sonraki 100 GB $0.09/GB)
* Tahmini toplam: ~$101/ay ve ayrıca [Wallarm abonelik ücretleri](../../../about-wallarm/subscription-plans/)

Wallarm imajlarını depolamak için Amazon ECR de kullanabilirsiniz (genellikle ihmal edilebilir maliyet).