[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

# Regras para Mascaramento de Dados

O nó da Wallarm envia os seguintes dados para a Nuvem Wallarm:

* Solicitações serializadas com ataques
* Contadores do sistema Wallarm
* Estatísticas do sistema: carga da CPU, uso de RAM, etc.
* Estatísticas do sistema Wallarm: número de solicitações NGINX processadas, estatísticas do Tarantool, etc.
* Informações sobre a natureza do tráfego que a Wallarm precisa para detectar corretamente a estrutura do aplicativo

Alguns dados não devem ser transferidos para fora do servidor em que são processados. Normalmente, esta categoria inclui autorização (cookies, tokens, senhas), dados pessoais e credenciais de pagamento.

O nó da Wallarm suporta o mascaramento de dados nas solicitações. Esta regra corta o valor original do ponto de solicitação especificado antes de enviar a solicitação para o módulo de pós-análise e Nuvem Wallarm. Este método garante que os dados sensíveis não possam vazar fora do ambiente confiável.

Isso pode afetar a exibição de ataques, verificação de ataque ativo (ameaça) e a detecção de ataques de força bruta.

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

## Exemplo: Mascaramento de um Valor de Cookie

**Se** as seguintes condições ocorrerem:

* o aplicativo está acessível no domínio *example.com*
* o aplicativo usa um cookie *PHPSESSID* para autenticação do usuário
* as políticas de segurança negam o acesso a essas informações para os funcionários que utilizam a Wallarm

**Então**, para criar uma regra de mascaramento de dados para este cookie, as seguintes ações devem ser executadas:

1. Vá para a guia *Regras*
1. Encontre o ramo para `example.com/**/*.*` e clique em *Adicionar regra*
1. Escolha *Mascarar dados sensíveis*
1. Selecione o parâmetro *Header* e digite seu valor `COOKIE`; selecione o parâmetro *cookie* e digite seu valor `PHPSESSID` após *nesta parte da solicitação*

     --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"

1. Clique em *Criar*

![Marcando dados sensíveis][img-masking]