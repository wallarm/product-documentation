# Düğüm eser sürümlerinin envanteri

Bu belge, farklı form faktörlerinde mevcut Wallarm düğümü 4.8'in [yama sürümlerini](versioning-policy.md#version-format) listeler. Bu belgeye dayanarak yeni yama sürümü yayınlarını takip edebilir ve zamanında yükseltmeler planlayabilirsiniz.

## Tüm bir arada yükleyici

Güncellemelerin tarihçesi aynı anda x86_64 ve ARM64 (beta) sürümlerine [tüm bir arada yükleyici](../installation/nginx/all-in-one.md) uygulanır.

[DEB/RPM paketlerinden nasıl geçilir](nginx-modules.md)

[Önceki tüm bir arada yükleyici sürümünden nasıl geçilir](all-in-one.md)

### 4.8.0 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## NGINX için DEB/RPM paketleri

[Yükseltme nasıl yapılır](nginx-modules.md)

### 4.8.0 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## NGINX Ingress controller için Helm chart

[Yükseltme nasıl yapılır](ingress-controller.md)

### 4.8.2 (2023-10-20)

* Standart olmayan HTTP portu (80) yukarı akımlarla bağlantılı özellikle engellenmiş istekler için istatistik hataları çözüldü

### 4.8.1 (2023-10-19)

* ARM64 işlemciler için destek eklendi
* Wallarm API belirteci `helm upgrade` tarafından uygulanamadığında hata düzeltildi
* Golang.org/x/net'teki bir sonraki CVE'leri düzeltildi: [CVE-2023-39325](https://github.com/advisories/GHSA-4374-p667-p6c8), [CVE-2023-3978](https://github.com/advisories/GHSA-2wrh-6pvc-2jm9), [CVE-2023-44487](https://github.com/advisories/GHSA-qppj-fm5r-hxr3)

### 4.8.0 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## Sidecar için Helm chart

[Yükseltme nasıl yapılır](sidecar-proxy.md)

### 4.8.0 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)
* Filtreleme düğümleri oluşturmak ve çözüm dağıtımı sırasında buluta bağlamak için [API belirtecine](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) destek eklendi. API belirteçlerine sahip olarak belirteçlerinizin ömrünü kontrol edebilir ve UI'da bir noda grup adı ayarlayarak düğüm organizasyonunu geliştirebilirsiniz.

    Düğüm grup adları, `config.wallarm.api.nodeGroup` parametresi **values.yaml** kullanılarak ayarlanır, `defaultSidecarGroup` ise varsayılan adıdır. İsteğe bağlı olarak, `sidecar.wallarm.io/wallarm-node-group` yazılım notu kullanılarak uygulamaların kapsayıcılarına dayalı düğüm gruplarının adlarını kontrol edebilirsiniz.
* [CVE-2023-38039](https://github.com/advisories/GHSA-99j9-jf36-9747) düzeltildi

## NGINX tabanlı Docker görüntüsü

[Yükseltme nasıl yapılır](docker-container.md)

### 4.8.0-1 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## Envoy tabanlı Docker görüntüsü

[Yükseltme nasıl yapılır](docker-container.md)

### 4.8.0-1 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## Amazon Makine Görüntüsü (AMI)

[Yükseltme nasıl yapılır](cloud-image.md)

### 4.8.0-1 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)

## Google Cloud Platform Görüntüsü

[Yükseltme nasıl yapılır](cloud-image.md)

### wallarm-node-4-8-20231019-221905 (2023-10-19)

* İlk yayın 4.8, [değişiklik günlüğüne bakın](what-is-new.md)