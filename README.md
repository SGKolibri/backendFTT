# API de Gerenciamento de Reservas

## Descrição
Esta é uma API REST desenvolvida em Node.js utilizando o framework Express e o banco de dados MongoDB. A API gerencia blocos, salas e reservas, permitindo criar, visualizar, editar e cancelar reservas de forma eficiente.

## Funcionalidades Principais
1. **Cadastro de Blocos e Salas**
   - Criar, listar e excluir blocos.
   - Criar salas associadas a blocos, especificando capacidade, recursos e regras de compartilhamento.

2. **Gerenciamento de Reservas**
   - Criar reservas de salas com informações como sala, data, horário, coordenador e motivo.
   - Criar reservas recorrentes (diárias, semanais ou mensais).
   - Verificar disponibilidade de salas.
   - Cancelar reservas.
   - Consultar todas as reservas cadastradas.

3. **Regras de Compartilhamento e Conflitos**
   - Salas podem ser compartilháveis ou restritas a determinados cursos.
   - Prevenção de conflitos de agendamento.

4. **Conflitos de Agendamento**
   - Prevenção de duplicação de reservas no mesmo horário.
   - Algoritmo que verifica conflitos antes da criação de uma nova reserva.   

## Tecnologias Utilizadas
- **Node.js** e **Express**
- **MongoDB**

## Instalação e Configuração
1. Clone o repositório:
   ```bash
   git clone <URL-DO-SEU-REPOSITORIO>
   
2. Instale as dependências:
   ```bash
   npm install
   
3. Configure as variáveis de ambiente no arquivo `.env`:
   env
   MONGO_URL=mongodb://localhost:27017/rhyanDB
   PORT=3000
   NODE_ENV=development
   
4. Inicie o servidor:
   ```bash
   npm start
   

## Endpoints
### **Blocos**
- **Criar:** `POST /api/blocos`
- **Listar:** `GET /api/blocos?page=1&limit=10`
- **Deletar:** `DELETE /api/blocos/:id`

### **Reservas**
- **Criar:** `POST /api/reservas`
- **Criar Recorrente:** `POST /api/reservas/recorrente`
- **Verificar Disponibilidade:** `GET /api/reservas/disponibilidade`
- **Cancelar:** `DELETE /api/reservas/:id`
- **Consultar:** `GET /api/reservas`

### **Salas**
- **Criar:** `POST /api/salas`
- **Listar:** `GET /api/salas`
- **Sala específica:** `GET /api/salas/:id`
- **Deletar:** `DELETE /api/salas/:id`
- **Verificar Disponibilidade:** `GET /api/salas/disponiveis`

## Exemplo de Requisição e Resposta
### Criar Sala
 **Endpoint: `POST /api/salas`**
{
  "numero": 101,
  "bloco": "656abc123def",
  "capacidade": 40,
  "tipo": "laboratorio",
  "compartilhavel": true,
  "cursos": ["Engenharia de Software", "Ciência da Computação"],
  "horarioInicial": "08:00",
  "horarioFinal": "22:00"
}

 **Resposta Sucesso (201 Created):**
{
  "message": "Sala criada com sucesso!",
  "salaId": "643f1ed322d5a2bf58c340be"
}

## Tratamento de Erros
A API retorna diferentes códigos de erro para facilitar a identificação de problemas:

 - **400 (Bad Request):** Requisição com parâmetros inválidos.

 - **404 (Not Found):** Registro não encontrado.

 - **409 (Conflict):** Conflito de horários na reserva.

 - **500 (Internal Server Error):** Erro interno do servidor.

## Configuração do Banco de Dados
O banco de dados é configurado no arquivo `db.js`:

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

async function connectDatabase() {
    await mongoose.connect(mongoUrl)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((erro) => console.error("Não foi possível conectar ao MongoDB", erro));
}

export default connectDatabase;


## Inicialização do Servidor
A configuração do servidor está no arquivo `index.js`:

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";

import BlocoRoutes from "./routes/blocoRoutes.js";
import SalaRoutes from "./routes/salaRoutes.js";
import RelatorioRoutes from "./routes/relatorioRoutes.js";
import ReservaRoutes from "./routes/reservaRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/blocos", BlocoRoutes);
app.use("/api/reservas", ReservaRoutes);
app.use("/api/salas", SalaRoutes);
app.use("/api/relatorio", RelatorioRoutes);

connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor aberto na porta ${PORT}. Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
    });
}).catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
});


