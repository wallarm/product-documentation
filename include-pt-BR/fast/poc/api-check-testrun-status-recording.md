| Chamada API: | `GET /v1/test_run/test_run_id` |      |
| ------------- | ------------------------------------------ | ---- |
| Autorização: | Obrigatório | A autorização é fornecida pelo token |
| Cabeçalho HTTP com o token: | `X-WallarmAPI-Token` | Serve para passar o valor do token para o servidor API |
| Parâmetros: | `test_run_id` **(obrigatório)** | O identificador da execução de teste cujo estado deve ser obtido |


**Exemplo de um pedido:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234 \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Exemplo de uma resposta:**
```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "ready_for_recording": true,
    ...
  }
}
```