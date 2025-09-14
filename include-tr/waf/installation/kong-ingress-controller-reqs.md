* Kubernetes platformu sürüm 1.22-1.26
* Korumak istediğiniz mikro hizmetlere API çağrılarını yönlendirmesi için Kong'u yapılandıran K8s Ingress kaynakları
* K8s Ingress kaynaklarının Kong 3.1.x ile uyumluluğu 
* [Helm v3](https://helm.sh/) paket yöneticisi
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` üzerinden erişim
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlist'te, denylist'te veya graylist'te][ip-lists-docs] bulunan ülke, bölge veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim