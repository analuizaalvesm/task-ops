import { test, expect } from "@playwright/test";

/**
 * Teste de Aceitação E2E - Validações e Casos de Erro
 *
 * Este teste valida o comportamento da API em cenários de erro:
 * - Validação de dados de entrada
 * - Tratamento de recursos não encontrados
 * - Validação de campos obrigatórios
 */

test.describe("E2E: Validações e Tratamento de Erros", () => {
  const baseURL = "http://localhost:3000/api";

  test("Deve rejeitar criação de usuário com email inválido", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/users`, {
      data: {
        name: "Teste",
        email: "email-invalido",
        role: "user",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("email");
    console.log(`✅ Email inválido rejeitado corretamente`);
  });

  test("Deve rejeitar criação de usuário sem campos obrigatórios", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/users`, {
      data: {
        name: "Teste Incompleto",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(`✅ Campos obrigatórios validados corretamente`);
  });

  test("Deve retornar 404 para usuário inexistente", async ({ request }) => {
    const response = await request.get(`${baseURL}/users/id-inexistente-12345`);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(`✅ Erro 404 retornado corretamente para usuário inexistente`);
  });

  test("Deve rejeitar criação de tarefa sem campos obrigatórios", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/tasks`, {
      data: {
        title: "Tarefa Incompleta",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(`✅ Tarefa sem campos obrigatórios rejeitada`);
  });

  test("Deve retornar 404 para tarefa inexistente", async ({ request }) => {
    const response = await request.get(
      `${baseURL}/tasks/task-inexistente-99999`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(`✅ Erro 404 retornado corretamente para tarefa inexistente`);
  });

  test("Deve rejeitar geração de relatório sem campos obrigatórios", async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/reports`, {
      data: {
        type: "monthly",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("required");
    console.log(`✅ Relatório sem campos obrigatórios rejeitado`);
  });

  test("Deve retornar 404 para relatório inexistente", async ({ request }) => {
    const response = await request.get(
      `${baseURL}/reports/report-inexistente-88888`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    console.log(
      `✅ Erro 404 retornado corretamente para relatório inexistente`
    );
  });

  test("Deve validar health check da API", async ({ request }) => {
    const response = await request.get(`${baseURL}/health`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("status");
    expect(body.data.status).toBe("healthy");
    console.log(`✅ Health check passou com sucesso`);
  });
});
