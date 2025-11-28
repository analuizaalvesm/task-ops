import { test, expect } from "@playwright/test";

/**
 * Teste de Aceitação E2E - Fluxo Completo da API
 *
 * Este teste simula um fluxo real de uso da aplicação:
 * 1. Criar um usuário
 * 2. Validar que o usuário foi criado
 * 3. Criar uma tarefa para esse usuário
 * 4. Validar que a tarefa foi criada
 * 5. Atualizar o status da tarefa
 * 6. Gerar um relatório
 * 7. Validar o relatório gerado
 * 8. Limpar os dados (cleanup)
 */

test.describe("E2E: Fluxo Completo de Usuário → Tarefa → Relatório", () => {
  let userId: string;
  let taskId: string;
  let reportId: string;
  let baseURL: string;

  test.beforeAll(async () => {
    baseURL = "http://localhost:3000/api";
  });

  test("Cenário 1: Deve criar um novo usuário com sucesso", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/users`, {
      data: {
        name: "Maria Silva",
        email: "maria.silva@test.com",
        role: "admin",
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("id");
    expect(body.data.name).toBe("Maria Silva");
    expect(body.data.email).toBe("maria.silva@test.com");
    expect(body.data.role).toBe("admin");
    expect(body.data.isActive).toBe(true);

    // Salvar ID para próximos testes
    userId = body.data.id;
    console.log(`✅ Usuário criado com ID: ${userId}`);
  });

  test("Cenário 2: Deve listar o usuário criado", async ({ request }) => {
    const response = await request.get(`${baseURL}/users`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    // Verificar se o usuário criado está na lista
    const user = body.data.find((u: any) => u.id === userId);
    expect(user).toBeDefined();
    expect(user.name).toBe("Maria Silva");
    console.log(`✅ Usuário encontrado na listagem`);
  });

  test("Cenário 3: Deve buscar o usuário por ID", async ({ request }) => {
    const response = await request.get(`${baseURL}/users/${userId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(userId);
    expect(body.data.name).toBe("Maria Silva");
    expect(body.data.email).toBe("maria.silva@test.com");
    console.log(`✅ Usuário buscado por ID com sucesso`);
  });

  test("Cenário 4: Deve criar uma tarefa para o usuário", async ({
    request,
  }) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 dias no futuro

    const response = await request.post(`${baseURL}/tasks`, {
      data: {
        title: "Implementar testes E2E",
        description: "Criar suite completa de testes end-to-end com Playwright",
        priority: "high",
        assignedTo: userId,
        createdBy: userId,
        dueDate: dueDate.toISOString(),
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("id");
    expect(body.data.title).toBe("Implementar testes E2E");
    expect(body.data.status).toBe("todo");
    expect(body.data.priority).toBe("high");
    expect(body.data.assignedTo).toBe(userId);

    taskId = body.data.id;
    console.log(`✅ Tarefa criada com ID: ${taskId}`);
  });

  test("Cenário 5: Deve listar tarefas do usuário", async ({ request }) => {
    const response = await request.get(`${baseURL}/tasks?userId=${userId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    // Verificar se a tarefa criada está na lista
    const task = body.data.find((t: any) => t.id === taskId);
    expect(task).toBeDefined();
    expect(task.title).toBe("Implementar testes E2E");
    expect(task.assignedTo).toBe(userId);
    console.log(`✅ Tarefa encontrada na listagem do usuário`);
  });

  test("Cenário 6: Deve atualizar o status da tarefa", async ({ request }) => {
    const response = await request.put(`${baseURL}/tasks/${taskId}`, {
      data: {
        status: "in_progress",
        priority: "urgent",
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("in_progress");
    expect(body.data.priority).toBe("urgent");
    console.log(`✅ Status da tarefa atualizado para 'in_progress'`);
  });

  test("Cenário 7: Deve obter estatísticas das tarefas", async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/tasks/statistics`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("total");
    expect(body.data).toHaveProperty("byStatus");
    expect(body.data).toHaveProperty("byPriority");
    expect(body.data.total).toBeGreaterThanOrEqual(1);
    expect(body.data.byStatus.in_progress).toBeGreaterThanOrEqual(1);
    console.log(`✅ Estatísticas obtidas: ${body.data.total} tarefas no total`);
  });

  test("Cenário 8: Deve gerar um relatório do período", async ({ request }) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 dias atrás
    const endDate = new Date();

    const response = await request.post(`${baseURL}/reports`, {
      data: {
        type: "monthly",
        generatedBy: userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("id");
    expect(body.data.type).toBe("monthly");
    expect(body.data.generatedBy).toBe(userId);
    expect(body.data).toHaveProperty("data");
    expect(body.data.data).toHaveProperty("totalUsers");
    expect(body.data.data).toHaveProperty("totalTasks");

    reportId = body.data.id;
    console.log(`✅ Relatório gerado com ID: ${reportId}`);
  });

  test("Cenário 9: Deve listar todos os relatórios", async ({ request }) => {
    const response = await request.get(`${baseURL}/reports`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    // Verificar se o relatório criado está na lista
    const report = body.data.find((r: any) => r.id === reportId);
    expect(report).toBeDefined();
    expect(report.type).toBe("monthly");
    console.log(`✅ Relatório encontrado na listagem`);
  });

  test("Cenário 10: Deve buscar o relatório por ID", async ({ request }) => {
    const response = await request.get(`${baseURL}/reports/${reportId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(reportId);
    expect(body.data.type).toBe("monthly");
    expect(body.data).toHaveProperty("data");
    console.log(`✅ Relatório buscado por ID com sucesso`);
  });

  test("Cenário 11: Deve obter estatísticas dos relatórios", async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/reports/statistics`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("totalReports");
    expect(body.data).toHaveProperty("reportsByType");
    expect(body.data.totalReports).toBeGreaterThanOrEqual(1);
    console.log(
      `✅ Estatísticas: ${body.data.totalReports} relatórios no total`
    );
  });

  test("Cenário 12: Deve completar a tarefa", async ({ request }) => {
    const response = await request.put(`${baseURL}/tasks/${taskId}`, {
      data: {
        status: "done",
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("done");
    console.log(`✅ Tarefa marcada como concluída`);
  });

  test("Cenário 13: Cleanup - Deve deletar o relatório", async ({
    request,
  }) => {
    const response = await request.delete(`${baseURL}/reports/${reportId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    console.log(`✅ Relatório deletado`);
  });

  test("Cenário 14: Cleanup - Deve deletar a tarefa", async ({ request }) => {
    const response = await request.delete(`${baseURL}/tasks/${taskId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    console.log(`✅ Tarefa deletada`);
  });

  test("Cenário 15: Cleanup - Deve deletar o usuário", async ({ request }) => {
    const response = await request.delete(`${baseURL}/users/${userId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    console.log(`✅ Usuário deletado`);
  });

  test("Cenário 16: Deve confirmar que o usuário foi deletado", async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/users/${userId}`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(`✅ Confirmado: usuário não existe mais no sistema`);
  });
});
