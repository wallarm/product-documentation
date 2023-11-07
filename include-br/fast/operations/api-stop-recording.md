| Chamada de API: | `POST /v1/test_run/test_run_id/action/stop` |      |
| ------------- | ------------------------------------------ | ---- |
| Autorização: | Requerido | Com o token |
| Cabeçalho HTTP com o token: | `X-WallarmAPI-Token` | Serve para passar o valor do token para o servidor API |
| Parâmetros: | `test_run_id` **(obrigatório)** | O identificador do teste para parar de gravar as solicitações de linha de base |

**Exemplo de um pedido:**
```
curl --request GET \
  --url https://us1.api.wallarm.com/v1/test_run/tr_1234/action/stop \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345'
```

**Exemplo de uma resposta:**
```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    ...
    "recording": false,
    ...
  }
}
```