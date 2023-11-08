Variável de ambiente | Descrição| Obrigatório
--- | ---- | ----
`WALLARM_API_TOKEN` | Token de nó Wallarm ou API. | Sim
`WALLARM_API_HOST` | Servidor API Wallarm:<ul><li>`us1.api.wallarm.com` para a Nuvem dos EUA</li><li>`api.wallarm.com` para a Nuvem da UE</li></ul>Por padrão: `api.wallarm.com`. | Não
`WALLARM_LABELS` | <p>Disponível a partir do nó 4.6. Funciona apenas se `WALLARM_API_TOKEN` estiver configurado para [token da API][api-token] com a função `Deploy`. Define a etiqueta `group` para agrupamento de instâncias de nó, por exemplo:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...colocará a instância de nó no grupo de instâncias `<GROUP>` (existente, ou, se não existir, será criado).</p> | Sim (para tokens de API)