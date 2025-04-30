# Projeto EL-EG

Este repositório documenta as implementações realizadas e as funcionalidades planejadas para o projeto EL-EG. A seguir, você encontrará um histórico detalhado das features concluídas (organizadas por datas) e as próximas melhorias e atualizações a serem desenvolvidas.

---

## Histórico de Implementações

### Features Iniciais (EL-EG)

- **DESABILITAR PÁGINA DE CADASTRO:** ok
- **DESABILITAR PÁGINA DE ESQUECI SENHA:** ok
- **SOLUCIONAR ERRO AO EXCLUIR USUÁRIO:** ok
- **SOLUCIONAR ERRO DE BOTÃO DE ADICIONAR EQUIPE:** ok
- **RETIRAR URL DE IMAGENS DE TELAS DE EDIÇÃO:** ok
- **VERIFICAR ERRO AO EDITAR INFORMAÇÕES DE EQUIPE:** ok
- **RETIRAR RECORRÊNCIA MENOR QUE 1 MÊS NA CRIAÇÃO DAS ROTINAS:** ok
- **TRADUZIR DE TASK PARA TAREFAS NA ROTA DINÂMICA DA ROTINA:** ok
- **CORRIGIR ERRO AO EDITAR ROTINAS:** ok
- **DEFINIR COR DE FUNDO DE INPUTS PARA PADRÃO:** ok
- **FECHAR ROTAS DE ADMIN E CONFIGURAÇÕES:** ok
- **MELHORAR TELA DE FINALIZAÇÃO DE ORDEM DE SERVIÇO:** ok
- **ENCAMINHAR PARA DETERMINADA PÁGINA APÓS FINALIZAÇÃO DE ORDEM DE SERVIÇO:** ok
- **DEFINIR AVISO DE CRIAÇÃO DE OS EM UM TOAST:** ok
- **CORRIGIR INPUTS COM LETRAS ESCURAS AO INVÉS DE CLARAS:** ok
- **SERVIÇO PRESTADO DENTRO DE CADASTRO DE OS DEVE SER UM SELECT:** ok
- **SALVAR "ORDEM DE SERVIÇO" / MUDAR A LETRA DO BOTÃO:** ok
- **TROCAR NOME DA TELA DE ORDEM DE SERVIÇO DE ROTINA PARA ORDEM DE SERVIÇO:** ok
- **MELHORAR LAYOUT DA TELA DE FECHAMENTO DE ORDEM DE SERVIÇO:** ok
- **ADICIONAR REFRIGERAÇÃO COMERCIAL:** ok
- **TROCAR SOLAR POR GERAÇÃO DE ENERGIA:** ok
- **ADICIONAR OPÇÃO DE EXCLUIR EQUIPE:** ok
- **ADICIONAR OPÇÃO DE EXCLUIR EMPRESA:** ok
- **ADICIONAR OPÇÃO DE EXCLUIR ROTINA:** ok
- **TROCAR NÚMERO DE PREGÃO POR NÚMERO DO CONTRATO:** ok
- **DEFINIR TIPOS GLOBAIS (ROUTINES, COMPANY, TEAM, SERVICE ORDER):** ok
- **ADICIONAR TEMPO ESTIMADO DA ROTINA:** ok
- **ADICIONAR EQUIPAMENTOS PARA A ROTINA:** ok
- **ADICIONAR EPI PARA A ROTINA:** ok
- **ADICIONAR TEMPO TOTAL DA TAREFA NA OS:** ok
- **CRIAR INPUT DE IDENTIFICAÇÃO E CARGO DE QUEM FISCALIZOU A ROTINA:** ok
- **ADICIONAR TEMPO ESTIMADO COMO UM SELECT:** ok

---

### 20-01

- **UTILIZAR SELECTS NAS ABAS DE EDIÇÃO:** ok
- **MELHORAR LAYOUT DE OBSERVAÇÕES NA TELA DA ORDEM DE SERVIÇO:** ok
- **OBRIGAR ADIÇÃO DE UMA IMAGEM AO CONCLUIR A ROTINA:** ok
- **EXIBIR TEMPO EMPREGADO COMO UM RELÓGIO:** ok
- **CRIAR TABELA DE IMAGENS E ASSOCIAR À ROTINA:** ok
- **UTILIZAR TABELAS ISOLADAS PARA TAREFAS E IMAGENS:** ok

---

### 21-01

- **LISTAR ÚLTIMAS ORDENS DE SERVIÇO NA TELA INICIAL:** ok
- **CRIAR FORMA DE ASSINATURA PARA QUEM FISCALIZOU A ROTINA:** ok

---

### 22-01

- **ADICIONAR ASSINATURA DO RESPONSÁVEL TÉCNICO PELA TAREFA CONCLUÍDA:** ok
- **IMPLEMENTAR UPLOAD DE IMAGEM DE PERFIL DO USUÁRIO:** ok
- **EXIBIR DADOS DO USUÁRIO LOGADO:** ok
- **ADICIONAR ENVIO DE ARQUIVOS DA "EMPRESA":** ok
- **SUBSTITUIR OPÇÃO DE ENVIAR IMAGEM DE EMPRESA POR DOCUMENTAÇÃO:** ok
- **CRIAR TELA DE EDIÇÃO DE PERFIL (INFORMAÇÕES, UPLOAD DE IMAGEM, ETC.):** ok

---

### 23-01

- **MODIFICAR O BANCO PARA ENVIAR IMAGENS EXEMPLO DAS ROTINAS:** ok
- **ADICIONAR TABELA DE TAREFAS DAS ROTINAS NO BANCO:** ok
- **ENVIAR IMAGENS EXEMPLO DAS ROTINAS E DOCUMENTAÇÃO (parcial):** ok _(Falta envio de documentação)_

---

### 27-01

- **VERIFICAR POR QUE A EQUIPE NÃO ESTÁ SENDO EXCLUIDA:** ok
- **CORRIGIR TROCA DE TEMPO ESTIMADO E TIPO DE SERVIÇO EM ROTINAS:** ok
- **AJUSTAR TELA DE VISUALIZAÇÃO DE ROTINAS:** ok
- **ADICIONAR OPÇÃO DE ENVIO E DOWNLOAD DE ARQUIVOS NA VISUALIZAÇÃO DE ROTINAS:** ok
- **CONVERTER IMAGENS PARA WEBP ANTES DE ENVIAR PARA O BANCO:** ok

---

### 28-01

- **ADICIONAR CAMPOS DE INFORMAÇÕES DA EMPRESA (Endereço, Email, Telefone):** ok
- **ADICIONAR FOTO DE PERFIL (Tela do próprio perfil):** ok
- **VISUALIZAR/TROCAR ASSINATURA (Tela do próprio perfil):** ok
- **REALIZAR AJUSTES NAS TELAS DE PERFIL DO USUÁRIO:** ok
- **CRIAR PADRONIZAÇÃO PARA RELATÓRIOS:** ok
- **VISUALIZAR FOTO DE PERFIL:** ok
- **ADICIONAR RESPONSÁVEL PELA FINALIZAÇÃO DA TAREFA NA OS:** ok
- **AJUSTAR LAYOUT DAS LISTAS DE ROTINAS NA PÁGINA PRINCIPAL:** ok

---

### 29-01

- **DEPLOY DA APLICAÇÃO:** _(pendente)_
- **CONVERSÃO DA APLICAÇÃO EM PWA:** _(pendente)_

---

### 30-01

- **CORRIGIR ERRO NO NOME DE USUÁRIO NA PÁGINA DE CADASTRAR EMPRESAS:** ok

---

### 31-01

- **CHECKLIST DO SISTEMA:** ok
- **CRIAR MIDLEWARES:** ok
- **DEPLOY E ENTREGA DA APLICAÇÃO VERSÃO 1:** ok
- **CRIAR ANIMAÇÃO DE ENVIO DE OS (URGENTE):** ok
- **OTIMIZAR LISTA DE ORDENS DE SERVIÇO NA TELA INICIAL:** ok
- **ALTERAR TERMINOLOGIA DE "USER" PARA "OPERADOR" NA GESTÃO DE COLABORADORES:** ok

---

## Próximas Features

### Features de Atualização (A)

- Menu Mobile para todos os usuários
- Tabelas relacionais de empresas
- Implementação do usuário Superadmin
- Revisão completa do design responsivo
- Permitir edição da recorrência das rotinas e das tarefas associadas
- Definir e corrigir níveis de acesso (converter para "int")
- Criar página de relatórios de ordens de serviço realizadas

---

### Features de Atualizações (B)

- Adicionar últimas observações dentro da OS (não apenas a primeira)
- Permitir exclusão da OS no modo "Admin" para interromper a recorrência mensal da rotina
- Carregar URL para a assinatura do usuário cadastrado
- Implementar loading inicial da aplicação
- Permitir edição de membros de equipe na área de edição
- Criar componente (boilerplate) para envio de imagens com descrição
- Criar componente (boilerplate) para envio de documentos com descrição
- Desenvolver função para adicionar e excluir campos dinamicamente (ex.: tasks, imagens e documentos)
- Exibir imagens exemplo da rotina na tela de visualização da OS com link para detalhes da rotina
- Implementar exclusão de imagens no banco ao excluir rotina, perfil ou OS
- Criar funcionalidade para enquadrar a imagem de perfil para recorte
- Transformar parte da assinatura em modal, exibindo-a somente ao fechar o modal
- Adicionar campo de observações na seção de relatórios
- Basear layout das demais telas no design da visualização da OS
- Adicionar últimas observações na tela de visualização da OS
- Incluir funções adicionais (tasks, membros, etc.) na tela de edição

---

### Features de Atualizações Simples (B)

- Remover amostragem de impressão na tela de visualização da OS
- Remover opção de impressão de OS enquanto a rotina estiver ativa
- Remover consulta de empresas do nível de acesso do usuário
- Ajustar layout da área de inserção de documentos na rotina
- Adicionar assinatura do responsável técnico na seção de relatório (evitando repetições)
- Criar animações para o carregamento das rotinas
- Implementar loading no modelo de usuário
- Adicionar loading durante o envio/carregamento de imagens
- Redirecionar para a tela de equipes após cadastro de time
- Redirecionar para a lista de rotinas a vencer após cadastro de rotina
- Implementar paginação (exibindo os itens mais recentes na frente)
- Configurar gráficos de ajustes

---

### Features Correcionais (C)

- Investigar impedimentos para cadastro de múltiplas documentações em uma rotina
- Impedir edição de rotinas para determinados usuários
- Corrigir exibição incorreta de tarefas vencidas (problema com a data de "abertura")

---

### Features para uma Próxima Versão

- Desenvolver um portal especial para clientes solicitarem e acompanharem suas OS
- Criar uma aba de chamados para solicitações emergenciais dos clientes
- Desenvolver tela de orçamentos
- Implementar funcionalidade para envio via WhatsApp
- Integrar envio de orçamentos por e-mail e WhatsApp

---

## Contribuições e Contato

Para dúvidas, sugestões ou contribuições, por favor, abra uma _issue_ ou entre em contato com a equipe responsável.

---

_Este documento será atualizado conforme novas implementações e atualizações forem realizadas._
