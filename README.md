# Entidades

- Motivation
- Motivational Participant
- React
- Reaction

# Casos de uso:

- [x] Um participante motivacional pode criar varias motivações
- [x] Um participante motivacional pode deletar sua motivação
      -- [x] Somente o participante motivacional pode apagar a sua motivação
- [x] Um participante motivacional pode deletar sua motivação
      -- [x] Somente o participante motivacional pode apagar a sua motivação
- [x] Um participante motivacional pode ver uma motivação
- [ ] Um participante motivacional pode a avaliar uma motivação como "inspiração"
      -- [x] Só pode haver uma avaliação por participante motivacional
      -- [x] Um participante motivacional não pode avaliar a sua própria motivação
- [x] Um participante motivacional pode a avaliar uma motivação como "desinteresse"
      -- [x] Só pode haver uma avaliação por participante motivacional
      -- [x] Um participante motivacional não pode avaliar a sua própria motivação
- [x] Um participante motivacional pode olhar as motivações recentes
      -- [x] Um participante motivacional pode personalizar a quantidade de motivações na listagem
      -- [ ] Um participante motivacional deve saber quantas páginas tem no total
- [x] Um participante motivacional pode olhar as suas motivações recentes
      -- [x] Um participante motivacional pode personalizar a quantidade de motivações na listagem
      -- [ ] Um participante motivacional deve saber quantas páginas tem no total
- [x] Deve exibir uma motivation aleatória por dia
- [x] Um participante motivacional pode criar uma conta
      -- [x] Um participante motivacional pode ter cargos de administrador, moderador ou membro
      -- [x] Por padrão um novo participante motivacional deve ter um cargo de membro
      -- [x] Somente um administrador ou moderador pode promover um membro para moderador
      -- [x] Somente um administrador pode rebaixar um moderador para membro
      -- [x] Um administrador não pode ser rebaixado a moderador
      -- [x] Um administrador pode apagar motivações de um participante motivacional
      -- [x] Um moderador pode apagar motivações de um participante motivacional
      -- [x] A senha deve ser protegia por hash
      -- [x] O email deve ser único
