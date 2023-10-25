# Wallarm API Güvenlik Duvarı için Helm grafiği

Bu grafik, bir [Kubernetes](http://kubernetes.io/) kümesi üzerinde Wallarm API Güvenlik Duvarı dağıtımını [Helm](https://helm.sh/) paket yöneticisi kullanarak başlatır.

Bu grafik henüz herhangi bir genel Helm kaydı'na yüklenmemiştir. Helm grafiğini dağıtmak için lütfen bu depoyu kullanın.

## Gereksinimler

* Kubernetes 1.16 veya sonrası
* Helm 2.16 veya sonrası

## Dağıtım

Wallarm API Güvenlik Duvarı Helm grafiğini dağıtmak için:

1. Henüz eklenmemişse depomuzu ekleyin:

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. Helm grafiğinin son versiyonunu getirin:

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. Kod yorumlarını takip ederek `api-firewall/values.yaml` dosyasını değiştirerek grafiği yapılandırın.

4. Bu Helm grafiği üzerinden Wallarm API Güvenlik Duvarı'nı dağıtın.

Bu Helm grafiği dağıtımının bir örneğini görmek için, [Kubernetes demo'muzu](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes) çalıştırabilirsiniz.