[link-regex]:       https://github.com/yandex/pire

[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png

# Regras de Detecção Definidas pelo Usuário

Em alguns casos, pode ser útil adicionar uma assinatura para detecção de ataque manualmente ou criar um chamado *patch virtual*. Como tal, a Wallarm não usa expressões regulares para detectar ataques, mas permite aos usuários adicionar assinaturas adicionais com base em expressões regulares.

## Adicionando uma Nova Regra de Detecção

Para fazer isso, você precisa criar a regra *Criar indicador de ataque baseado em regexp* e preencher os campos:

* *Expressão regular*: expressão regular (assinatura). Se o valor do seguinte parâmetro corresponder à expressão, essa solicitação é detectada como um ataque. A sintaxe e especificidades das expressões regulares são descritas nas [instruções sobre a adição de regras](rules.md#condition-type-regex).

    !!! alert "Alterando a expressão regular especificada na regra"
        A modificação da expressão regular especificada na regra existente do tipo **Criar indicador de ataque baseado em regexp** resulta na eliminação automática das regras [**Desativar detecção de ataque baseada em regexp**](#partial-disabling-of-a-new-detection-rule) que usam a expressão anterior.

        Para desativar a detecção de ataque por uma nova expressão regular, por favor, crie uma nova regra **Desativar detecção de ataque baseada em regexp** com a nova expressão regular especificada.

* *Experimental*: este indicador permite que você verifique com segurança o acionamento de uma expressão regular sem bloquear solicitações. As solicitações não serão bloqueadas mesmo quando o nó do filtro estiver definido para o modo de bloqueio. Essas solicitações serão consideradas como ataques detectados pelo método experimental e estarão ocultas da lista de eventos por padrão. Eles podem ser acessados usando a consulta de pesquisa `ataques experimentais`.

* *Ataque*: o tipo de ataque que será detectado quando o valor do parâmetro na solicitação corresponder à expressão regular.

* *nesta parte da solicitação*: determina um ponto na solicitação onde o sistema deve detectar os ataques correspondentes.

    --8<-- "../include-pt-BR/waf/features/rules/request-part-reference.md"

### Exemplo: Bloqueando Todas as Solicitações com um Cabeçalho X-Authentication Incorreto

**Se** as seguintes condições ocorrerem:

* o aplicativo está acessível no domínio *example.com*
* o aplicativo usa o cabeçalho *X-Authentication* para autenticação do usuário
* o formato do cabeçalho é de 32 símbolos hexadecimais

**Então**, para criar uma regra para rejeitar tokens de formato incorreto:

1. Vá para a aba *Regras*
2. Encontre o ramo para `example.com/**/*.*` e clique em *Adicionar regra*
3. Selecione *Definir como um ataque com base em uma expressão regular*
4. Defina o valor *Regex* como `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
5. Escolha `Patch virtual` como o tipo de *Ataque*
6. Defina o ponto `Cabeçalho X-AUTENTICAÇÃO`
7. Clique em *Criar*

![Primeiro exemplo de regra Regex][img-regex-example1]

### Exemplo: Bloquear todas as solicitações com os parâmetros de corpo `class.module.classLoader.*`

Uma das maneiras de explorar a vulnerabilidade 0-day no [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) é enviar a solicitação POST com certos payloads maliciosos injetados nos seguintes parâmetros do corpo:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

Se você usar o Spring Core Framework vulnerável e o [modo](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) do nó Wallarm for diferente de bloqueio, você pode prevenir a exploração da vulnerabilidade usando o patch virtual. A seguinte regra bloqueará todas as solicitações com parâmetros de corpo listados até mesmo nos modos de monitoramento e bloqueio seguro:

![Virtual patch for specific post params](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

O valor do campo de expressão regular é:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

O nó Wallarm operando no [modo](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) de bloqueio bloqueia tais tentativas de exploração de vulnerabilidade por padrão.

O componente Spring Cloud Function também possui a vulnerabilidade ativa (CVE-2022-22963). Se usar este componente e o modo do nó Wallarm for diferente de bloqueio, crie o patch virtual conforme descrito [abaixo](#example-block-all-requests-with-the-class-cloud-function-routing-expression-header).

### Exemplo: Bloqueie todas as solicitações com o cabeçalho `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`

O componente Spring Cloud Function tem a vulnerabilidade ativa (CVE-2022-22963) que pode ser explorada injetando payloads maliciosos no cabeçalho `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` ou `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`.

Se usar este componente e o [modo](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) do nó Wallarm for diferente de bloqueio, você pode evitar a exploração da vulnerabilidade usando o patch virtual. A seguinte regra bloqueará todas as solicitações contendo o cabeçalho `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`:

![Virtual patch for specific header](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "Bloqueando solicitações com o cabeçalho `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`"
    Esta regra não bloqueia solicitações com o cabeçalho `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`, mas o NGINX descarta solicitações com este cabeçalho como inválidas por padrão.

O nó Wallarm operando no [modo](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) de bloqueio bloqueia tais tentativas de exploração de vulnerabilidade por padrão.

There is also the 0-day vulnerability in [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell). Learn how to block its exploitation attempts with the [reqexp-based virtual patch](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters).

## Desativação Parcial de uma Nova Regra de Detecção

Se a regra criada deve ser parcialmente desativada para um ramo específico, isso pode ser feito facilmente criando a regra *Desativar detecção de ataque baseada em regexp* com os seguintes campos:

- *Expressão regular*: expressões regulares criadas anteriormente que devem ser ignoradas.

    !!! alert "Comportamento da regra se a expressão regular foi alterada"
        A modificação da expressão regular especificada na regra existente do tipo [**Criar indicador de ataque baseado em regexp**](#adding-a-new-detection-rule) resulta na eliminação automática das regras **Desativar detecção de ataque baseada em regexp** que usam a expressão anterior.

        Para desativar a detecção de ataque por uma nova expressão regular, por favor, crie uma nova regra **Desativar detecção de ataque baseada em regexp** com a nova expressão regular especificada.

- *nesta parte da solicitação*: indica o parâmetro que requer a configuração de uma exceção.

**Exemplo: Permitir um Cabeçalho X-Authentication Incorreto para uma URL Designada**

Vamos supor que você tem um script em `example.com/test.php`, e quer mudar o formato dos tokens para ele.

Para criar a regra relevante:

1. Vá para a aba *Regras*
1. Encontre ou crie o ramo para `example.com/test.php` e clique em *Adicionar regra*
1. Escolha *Desativar detecção de ataque baseada em regexp*
1. Selecione a expressão regular que você deseja desativar
1. Defina o ponto `Cabeçalho X-AUTENTICAÇÃO`
1. Clique em *Criar*

![Segundo exemplo de regra Regex][img-regex-example2] 

## Chamada de API para criar a regra

Para criar o indicador de ataque baseado em regexp, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar a UI do Console Wallarm. Abaixo estão os exemplos da chamada de API correspondente.

A seguinte solicitação criará o indicador de ataque personalizado com base na regexp `^(~(44[.]33[.]22[.]11))$`.

Se solicitações ao domínio `MY.DOMAIN.COM` tiverem o cabeçalho HTTP `X-FORWARDED-FOR: 44.33.22.11`, o nó Wallarm as considerará como ataques de scanner e bloqueará ataques se o [modo de filtragem](../../admin-en/configure-wallarm-mode.md) correspondente tiver sido definido.

--8<-- "../include-pt-BR/api-request-examples/create-rule-scanner.md"