import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GCS DevOps API",
      version: "1.0.0",
      description: "API de gerenciamento de usuários, tarefas e relatórios",
      contact: {
        name: "API Support",
        email: "support@gcs-devops.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Endpoints de gerenciamento de usuários",
      },
      {
        name: "Tasks",
        description: "Endpoints de gerenciamento de tarefas",
      },
      {
        name: "Reports",
        description: "Endpoints de geração e gerenciamento de relatórios",
      },
      {
        name: "Health",
        description: "Verificação de saúde da API",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único do usuário",
              example: "user_123456789",
            },
            name: {
              type: "string",
              description: "Nome completo do usuário",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "joao@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "manager"],
              description: "Papel do usuário no sistema",
              example: "user",
            },
            isActive: {
              type: "boolean",
              description: "Status de ativação do usuário",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        CreateUserDTO: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              description: "Nome completo do usuário",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "joao@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "manager"],
              description: "Papel do usuário",
              example: "user",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único da tarefa",
            },
            title: {
              type: "string",
              description: "Título da tarefa",
              example: "Implementar API de autenticação",
            },
            description: {
              type: "string",
              description: "Descrição detalhada",
              example: "Criar endpoints de login e registro",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done", "cancelled"],
              description: "Status atual da tarefa",
              example: "in_progress",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Prioridade da tarefa",
              example: "high",
            },
            assignedTo: {
              type: "string",
              description: "ID do usuário responsável",
            },
            createdBy: {
              type: "string",
              description: "ID do criador da tarefa",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Data de vencimento",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Report: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único do relatório",
            },
            title: {
              type: "string",
              description: "Título do relatório",
            },
            type: {
              type: "string",
              enum: ["daily", "weekly", "monthly", "custom"],
              description: "Tipo do relatório",
            },
            generatedBy: {
              type: "string",
              description: "ID do usuário que gerou",
            },
            dateRange: {
              type: "object",
              properties: {
                start: {
                  type: "string",
                  format: "date-time",
                },
                end: {
                  type: "string",
                  format: "date-time",
                },
              },
            },
            data: {
              type: "object",
              properties: {
                totalUsers: { type: "number" },
                totalTasks: { type: "number" },
                tasksByStatus: { type: "object" },
                tasksByPriority: { type: "object" },
                completionRate: { type: "number" },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indica se a requisição foi bem-sucedida",
            },
            data: {
              description: "Dados retornados pela API",
            },
            error: {
              type: "string",
              description: "Mensagem de erro (se houver)",
            },
            message: {
              type: "string",
              description: "Mensagem adicional",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Timestamp da resposta",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Erro ao processar requisição",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
