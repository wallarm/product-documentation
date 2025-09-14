# Sihirbaz için Cloudflare

Wallarm Edge node'u Cloudflare'a bağlayarak trafiği ya [senkron](../inline/overview.md) ya da [asenkron](../oob/overview.md) modda inceleyebilirsiniz - herhangi bir isteği engellemeden.

Bağlantıyı kurmak için aşağıdaki adımları izleyin.

1. Platformunuz için sağlanan kod paketini indirin.
1. İndirilen kodu kullanarak [Cloudflare worker oluşturun](https://developers.cloudflare.com/workers/get-started/dashboard/).
1. `wallarm_node` parametresinde Wallarm node URL'sini ayarlayın.
1. [Asenkron (out-of-band)](../oob/overview.md) mod kullanılıyorsa, `wallarm_mode` parametresini `async` olarak ayarlayın.
1. Gerekirse, [diğer parametreleri](cloudflare.md#configuration-options) değiştirin.
1. **Website** → alan adınız bölümünde, **Workers Routes** → **Add route**'a gidin:

    * **Route** içinde, Wallarm'a analiz için yönlendirilecek yolları belirtin (ör. tüm yollar için `*.example.com/*`).
    * **Worker** içinde, oluşturduğunuz Wallarm worker'ı seçin.

[Daha fazla bilgi](cloudflare.md)

<style>
  h1#cloudflare-for-wizard {
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