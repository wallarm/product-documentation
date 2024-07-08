# Backup e restauração do conjunto de regras personalizado

Para se proteger contra regras acidentalmente mal configuradas ou excluídas, você pode fazer o backup do seu conjunto de regras personalizado atual.

Existem as seguintes opções de backup de regras:

* Criação de backup automático após cada [compilação do conjunto de regras personalizado](rules.md). O número de backups automáticos é limitado a 7: para cada dia em que você altera as regras várias vezes, apenas o último backup é mantido.
* Criação de backup manual a qualquer momento. O número de backups manuais é limitado a 5 por padrão. Se você precisar de mais, entre em contato com a equipe de [suporte técnico da Wallarm](mailto:support@wallarm.com).

Você pode:

* Acessar backups atuais: na seção **Regras**, clique em **Backups**.
* Criar um novo backup manualmente: na janela **Backups**, clique em **Criar backup**.
* Definir um nome e uma descrição para o backup manual e editá-los a qualquer momento.

    !!! info "Nomenclatura para backups automáticos"
        Os backups automáticos são nomeados pelo sistema e não podem ser renomeados.

* Carregar a partir de um backup existente: clique em **Carregar** para o backup necessário. Ao carregar a partir do backup, sua configuração de regra atual é excluída e substituída pela configuração do backup.
* Excluir backup.

    ![Regras - Criando backup](../../images/user-guides/rules/rules-create-backup.png)

!!! Atenção "Restrições de modificação de regra"
    Você não pode criar ou modificar regras até que a criação do backup ou o carregamento a partir do backup estejam completos.