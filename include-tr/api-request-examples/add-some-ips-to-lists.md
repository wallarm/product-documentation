Belirli IP'leri veya alt ağları IP listesine eklemek için, her IP/alt ağ için aşağıdaki isteği gönderin:

=== "US Bulut"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<IP_LISTESI_TURU>","reason":"<LISTEYE_GIRIŞ_EKLEME_NEDENI>","pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":<KALDIRMA_TARIHI_ZAMAN_DAMGASI>,"rule_type":"ip_range","subnet":"<IP_VEYA_ALT_AG>"}}'
    ```
=== "EU Bulut"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"force":false,"ip_rule":{"list":"<IP_LISTESI_TURU>","reason":"<LISTEYE_GIRIŞ_EKLEME_NEDENI>","pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":<KALDIRMA_TARIHI_ZAMAN_DAMGASI>,"rule_type":"ip_range","subnet":"<IP_VEYA_ALT_AG>"}}'
    ```