[doc-inactivity-timeout]:           internals.md#test-run

| Chamada da API: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Autorização: | Obrigatório | A autorização é fornecida pelo token |
| Cabeçalho HTTP com o token: | `X-WallarmAPI-Token` | Serve para passar o valor do token para o servidor da API |
| Parâmetros: | `name` **(requerido)** | O nome do teste a ser executado |
| | `test_record_id` **(requerido)** | O identificador de um registro de teste existente |
|  | `desc` | Descrição detalhada do teste a ser executado.<br>Valor padrão: string vazia |
|  | `file_extensions_to_exclude` | Este parâmetro permite especificar certos tipos de arquivos que devem ser excluídos do processo de avaliação durante o teste. Esses tipos de arquivo são especificados pela expressão regular.<br>Por exemplo, se você definir a extensão de arquivo `ico` para ser excluída, a solicitação básica `GET /favicon.ico` não será verificada pelo FAST e será ignorada.<br>A expressão regular tem o seguinte formato:<br>- `.`: qualquer número (zero ou mais) de qualquer caractere<br>- `x*`: qualquer número (zero ou mais) do caractere `x`<br>- `x?`: o único caractere `x` (ou nenhum)<br>- qualquer única extensão de arquivo (por exemplo, `jpg`)<br>- várias extensões delimitadas pela barra vertical (por exemplo, `jpg` &#124; `png`)<br>Valor padrão: string vazia (o FAST verificará solicitações básicas com qualquer extensão de arquivo). | 
|  | `policy_id` | O identificador da política de teste.<br>Se este parâmetro estiver ausente, então a política padrão entra em ação |
|  | `stop_on_first_fail` | Este parâmetro especifica o comportamento do FAST quando uma vulnerabilidade é detectada:<br>`true`: interrompe a execução do teste na primeira vulnerabilidade detectada.<br>`false`: processa todas as solicitações básicas, independentemente de qualquer vulnerabilidade ser detectada.<br>Valor padrão: `false` |
|  | `rps_per_baseline` | Este parâmetro especifica um limite no número de solicitações de teste (*RPS*, *requests per second*) a serem enviadas para o aplicativo alvo (por exemplo, pode haver 100 solicitações de teste derivadas de uma única solicitação básica).<br>O limite é definido por solicitação básica (não mais do que `N` solicitações de teste por segundo serão enviadas para uma solicitação básica individual) no teste.<br>Valor mínimo: `1`.<br>Valor máximo: `500`.<br>Valor padrão: `null` (RPS é ilimitado) |
|  | `rps` | Este parâmetro é semelhante ao descrito acima, exceto que limita o RPS globalmente por teste, não apenas para uma única solicitação básica.<br>Em outras palavras, o número total de solicitações de teste por segundo não deve exceder o valor especificado, independentemente de quantas solicitações básicas foram registradas durante o teste.<br>Valor mínimo: `1`.<br>Valor máximo: `1000`.<br>Valor padrão: `null` (RPS é ilimitado) |

**Exemplo de uma requisição:**

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
    "name":"demo-testrun",
    "test_record_id":"rec_0001"
}'
```

**Exemplo de uma resposta: a cópia do teste está em andamento**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "cloning",
    ...
    "test_record_id": "rec_0001",
    ...
}
```

O estado `cloning` significa que as solicitações básicas estão sendo clonadas do teste original para a sua cópia (teste com o identificador `tr_1234`).  

**Exemplo de uma resposta: a cópia do teste falhou**

```
{
  "status": 400,
  "body": {
    "test_record_id": {
      "error": "not_ready_for_cloning",
      "value": "rec_0001"
    }
  }
}
```

O erro `not_ready_for_cloning` significa que não é possível clonar as solicitações básicas do teste original para a sua cópia porque o processo de gravação está ativo no teste original (envolvendo o registro de teste com o identificador `rec_0001`).