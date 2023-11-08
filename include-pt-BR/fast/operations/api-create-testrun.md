| Chamada de API: | `POST /v1/test_run` |      |
| ------------ | ------------------- | ---- |
| Autorização: | Requerida | Com o token |
| Cabeçalho HTTP com o token: | `X-WallarmAPI-Token` | Serve para transmitir o valor do token para o servidor API |
| Parâmetros: | `name` **(requerido)** | Nome da execução do teste |
|  | `test_record_name` | O nome do registro do teste. Todas as solicitações base serão colocadas neste registro de teste.<br>Valor padrão: o nome da execução do teste. |
|  | `desc` | Descrição detalhada da execução do teste.<br>Valor padrão: string vazia. |
|  | `file_extensions_to_exclude` | Este parâmetro permite especificar certos tipos de arquivos que precisam ser excluídos do processo de avaliação durante os testes. Esses tipos de arquivos são especificados pela expressão regular.<br>Por exemplo, se você definir a extensão do arquivo `ico` para ser excluído, então a solicitação base `GET /favicon.ico` não será verificada pelo FAST e será ignorada.<br>A expressão regular tem o seguinte formato:<br>- `.`: qualquer número (zero ou mais) de qualquer caracter<br>- `x*`: qualquer número (zero ou mais) do caractere `x`<br>- `x?`: o caractere `x` único (ou nenhum)<br>- qualquer extensão de arquivo única (por exemplo, `jpg`)<br>- várias extensões delimitadas pela barra vertical (por exemplo, `jpg` &#124; `png`)<br>Valor padrão: string vazia (o FAST verificará solicitações de base com qualquer extensão de arquivo). |
|  | `policy_id` | O identificador da política de teste.<br>Se o parâmetro estiver ausente, então a política padrão entra em ação |
|  | `stop_on_first_fail` | O parâmetro especifica o comportamento do FAST quando uma vulnerabilidade é detectada:<br>`true`: interrompe a execução da execução do teste na primeira vulnerabilidade detectada.<br>`false`: processa todas as solicitações base, independentemente de qualquer vulnerabilidade ser detectada ou não.<br>Valor padrão: `false` |
|  | `skip_duplicated_baselines` | Este parâmetro especifica o comportamento do FAST quando uma solicitação base duplicada é encontrada:<br>`true`: ignore as solicitações base duplicadas (se houver algumas solicitações base idênticas, então os pedidos de teste são gerados apenas para o primeiro pedido base).<br>`false`: os pedidos de teste são gerados para cada pedido de base recebido.<br>Valor padrão: `true` |
|  | `rps_per_baseline` | Este parâmetro especifica um limite ao número de solicitações de teste (*RPS*, *requests per second*) que serão enviadas para a aplicação alvo (por exemplo: podem haver 100 pedidos de teste derivados de uma única solicitação base).<br>O limite é definido por solicitação base (não mais que `N` solicitações de teste por segundo serão enviadas para uma solicitação base individual) na execução do teste.<br>Valor mínimo: `1`.<br>Valor máximo: `500`.<br>Valor padrão: `null` (RPS é ilimitado) |
|  | `rps` | Este parâmetro é semelhante ao descrito acima, exceto que limita o RPS globalmente, por execução de teste, não apenas uma única solicitação base.<br>Em outras palavras, o número total de solicitações de teste por segundo não deve exceder o valor especificado, não importa quantas solicitações base foram registradas durante a execução do teste.<br>Valor mínimo: `1`.<br>Valor máximo: `1000`.<br>Valor padrão: `null` (RPS é ilimitado) |
|  | `inactivity_timeout` | Este parâmetro especifica o intervalo de tempo em segundos durante o qual o nó FAST espera pela chegada de uma nova solicitação base.<br>Este comportamento é descrito [aqui][doc-inactivity-timeout] em detalhes.<br>O tempo limite não tem influência nos processos de criação e execução de testes de segurança para solicitações base que foram registradas.<br>Valor mínimo: `300` (300 segundos ou 5 minutos).<br>Valor máximo: `86400` (86400 segundos ou 1 dia).<br>Valor padrão: `1800` (1800 segundos ou 30 minutos) |

** Exemplo de uma solicitação: **

```
curl --request POST \
  --url https://us1.api.wallarm.com/v1/test_run \
  --header 'Content-Type: application/json' \
  --header 'Host: us1.api.wallarm.com' \
  --header 'X-WallarmAPI-Token: token_Qwe12345' \
  --data '{
	"name":"demo-testrun"
}'
```

**Exemplo de uma resposta:**

```
{
  "status": 200,
  "body": {
    "id": tr_1234,
    "name": "demo-testrun",
    ...
    "state": "running",
    ...
}
```