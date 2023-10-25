# Wallarm API Firewall için Helm Grafikleri

Bu grafikler, [Helm](https://helm.sh/) paket yöneticisi kullanılarak [Kubernetes](http://kubernetes.io/) kümesi üzerine Wallarm API Firewall dağıtımını başlatır.

Bu grafikler henüz resmi Helm deposuna yüklenmedi. Helm grafiği dağıtımı için bu depoyu kullanın lütfen.

## Gereklilikler

* Kubernetes 1.16 veya daha yüksek sürüm
* Helm 2.16 veya daha yüksek sürüm

## Dağıtım

Wallarm API Firewall Helm grafiklerini dağıtmak için:

1. Eğer daha önce eklememişseniz, lütfen depoyu ekleyin:

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. Helm grafiğinin en yeni sürümünü alın:

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. Kodu yorumladıktan sonra, `api-firewall/values.yaml` dosyasını değiştirebilir ve grafiğinizi ayarlayabilirsiniz.

4. Bu Helm grafiği üzerinden Wallarm API Firewall'ı dağıtın.

Bu Helm grafiği dağıtımının bir örneğini görmek isterseniz, [Kubernetes demomuzu](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes) çalıştırabilirsiniz.