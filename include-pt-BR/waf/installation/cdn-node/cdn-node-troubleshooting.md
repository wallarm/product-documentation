### O que significam os status do nó CDN?

Os seguintes status podem aparecer no Console Wallarm → **Nós** para nós CDN:

* **Registrando**: Wallarm registra o nó CDN no provedor de nuvem.

    Ação necessária: aguarde pelo status **Requer CNAME** para adicionar o registro Wallarm CNAME aos registros DNS do domínio protegido.
* **Requer CNAME**: o registro Wallarm CNAME não está adicionado aos registros DNS do domínio protegido ou está adicionado, mas ainda não propagado.

    Ação necessária: adicione o registro CNAME fornecido pela Wallarm aos registros DNS do domínio protegido ou aguarde as mudanças surtirem efeito na Internet.
    
    Se as mudanças não surtirem efeito em mais de 24 horas, verifique se o seu provedor de domínio atualizou com sucesso os registros DNS. Se sim, mas o status **Ainda não propagado** ainda é exibido no Console Wallarm, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

    O próximo status esperado é **Ativo**.
* **Configurando**: Wallarm processa o endereço de origem alterado ou certificado SSL/TLS.

    Ação necessária: aguarde o status **Ativo**.
* **Ativo**: o nó CDN da Wallarm mitiga o tráfego mal-intencionado.

    Ação necessária: nenhuma. Você pode monitorar os [eventos][events-docs] que o nó CDN detecta.
* **Excluindo**: Wallarm exclui o nó CDN.

    Ação necessária: nenhuma, aguarde a exclusão ser concluída.

### Como identificar o registro CNAME propagado?

A seção **Nós** do Console Wallarm exibe o status atual de se o registro Wallarm CNAME surtiu efeito na Internet. Se o registro CNAME estiver propagado, o status do nó CDN é **Ativo**.

Além disso, você pode verificar os cabeçalhos de resposta HTTP com a seguinte solicitação:

```bash
curl -v <DOMINIO_PROTEGIDO>
```

Se o registro Wallarm CNAME estiver propagado, a resposta conterá os cabeçalhos `section-io-*`.

Se o registro CNAME não for propagado em mais de 24 horas, verifique se o seu provedor de domínio atualizou com sucesso os registros DNS. Se sim, mas o status **Ainda não propagado** ainda é exibido no Console Wallarm, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

### O nó CDN está destacado em vermelho na seção **Nós**. O que isso significa?

Se o nó CDN estiver destacado em vermelho na seção **Nós**, ocorreu um erro durante seu registro ou configuração pelos seguintes motivos possíveis:

* Erro desconhecido durante o registro do nó no provedor de nuvem de terceiros

    Ação necessária: contate o [suporte técnico da Wallarm](mailto:support@wallarm.com).
* Certificado SSL/TLS personalizado inválido

    Ação necessária: certifique-se de que o certificado carregado é válido. Se não for, faça o upload do válido.

O nó CDN destacado em vermelho não faz proxy de solicitações e, como resultado, não mitiga o tráfego mal-intencionado.

### Por que o nó CDN pode desaparecer da lista de nós no Console Wallarm?

Wallarm exclui nós CDN com registros CNAME que permanecem inalterados por 10 ou mais dias desde o momento da criação do nó.

Se você descobrir que o nó CDN desapareceu, crie um novo nó.

### Por que há um atraso na atualização do conteúdo protegido pelo nó CDN?

Se o seu site é protegido pelo nó CDN e você notar que, ao mudar seus dados, o site é atualizado com um atraso sensível, a provável razão pode ser o [Varnish Cache][using-varnish-cache] que acelera a entrega do seu conteúdo, mas a cópia armazenada em cache no CDN pode ser atualizada com um atraso.

Exemplo:

1. Você tem o Varnish Cache ativado para o seu nó CDN.
1. Você atualizou os preços em seu site.
1. Todas as solicitações são feitas via proxy via CDN, e o cache não é atualizado imediatamente.
1. Os usuários do site veem os preços antigos por algum tempo.

Para resolver o problema, você pode desativar o Varnish Cache. Para fazer isso, vá para **Nós** → menu do nó CDN → **Desativar Varnish Cache**.