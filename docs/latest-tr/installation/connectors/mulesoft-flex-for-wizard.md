# Sihirbaz için MuleSoft Flex

Wallarm Edge node, MuleSoft Flex Gateway'inize [eşzamanlı](../inline/overview.md) veya [asenkron](../oob/overview.md) modda - hiçbir isteği engellemeden - bağlanabilir.

Bağlantıyı kurmak için aşağıdaki adımları izleyin.

**1. Wallarm politikasını MuleSoft Exchange'e yükleyin**

1. Platformunuz için sağlanan kod paketini indirin.
1. Politika arşivini çıkarın.
1. Politikayı yayımlamak için kullanacağınız makinenin [tüm gerekli gereksinimleri](mulesoft-flex.md#requirements) karşıladığından emin olun.
1. MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → kuruluşunuzu seçin → **business group ID** değerini kopyalayın.
1. Çıkarılan politika dizininde → `Cargo.toml` → `[package.metadata.anypoint]` → `group_id` içinde, kopyaladığınız grup ID'sini belirtin:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. Politika üzerinde çalıştığınız aynı terminal oturumunda [Anypoint CLI ile kimlik doğrulayın](https://docs.mulesoft.com/anypoint-cli/latest/auth):

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. Politikayı derleyin ve yayımlayın:

    ```bash
    make setup      # Bağımlılıkları ve PDK CLI'yi kurar
    make build      # Politikayı derler
    make release    # Politikayı Anypoint'e yeni bir üretim sürümü olarak yayımlar
    ```

Özel politikanız artık MuleSoft Anypoint Platform Exchange'de kullanılabilir.

**2. Wallarm politikasını API'nize ekleyin**

Wallarm politikasını tek bir API'ye veya tüm API'lere ekleyebilirsiniz.

1. Politikayı tek bir API'ye uygulamak için Anypoint Platform → **API Manager** → istediğiniz API'yi seçin → **Policies** → **Add policy**.
1. Politikayı tüm API'lere uygulamak için Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy** yoluna gidin.
1. Exchange'den Wallarm politikasını seçin.
1. `wallarm_node` parametresinde, `http://` veya `https://` dahil olmak üzere Wallarm düğüm URL'sini belirtin.
1. Gerekirse, [diğer parametreleri](mulesoft-flex.md#configuration-options) değiştirin.
1. Politikayı uygulayın.

[Daha fazla bilgi](mulesoft-flex.md)

<style>
  h1#mulesoft-flex-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>