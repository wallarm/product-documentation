=== "US Bulut"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IP_LISTESI_TURU>","rule_type":"country","source_values":[<ULKELER_BOLGELER_DIZISI>],"pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":"<ZAMAN_DAMGASI_SİL_TARIHI>","reason":"<LISTEYE_GIRISLER_EKLEME_NEDENI>"},"force":false}'
    ```
=== "AB Bulut"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<YOUR_CLIENT_ID>,"ip_rule":{"list":"<IP_LISTESI_TURU>","rule_type":"country","source_values":[<ULKELER_BOLGELER_DIZISI>],"pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":"<ZAMAN_DAMGASI_SİL_TARIHI>","reason":"<LISTEYE_GIRISLER_EKLEME_NEDENI>"},"force":false}'
    ```