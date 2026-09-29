/**
 * Testes de integração - Platzi Fake Store API
 * Docs: https://api.escuelajs.co/docs
 * Padrão: AAA (Arrange, Act, Assert)
 *
 * Requer Node 18+ (fetch nativo) e Jest.
 */

const BASE_URL = 'https://api.escuelajs.co/api/v1';

// A API pública pode ser lenta; damos mais tempo que os 5s padrão do Jest
jest.setTimeout(20000);

describe('Escuela JS API - Testes de integração', () => {
  test('GET /products deve retornar 200 e uma lista de produtos', async () => {
    // Arrange
    const url = `${BASE_URL}/products`;

    // Act
    const response = await fetch(url);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('title');
    expect(body[0]).toHaveProperty('price');
  });

  test('GET /products/:id deve retornar o produto correspondente ao id', async () => {
    // Arrange
    const listResponse = await fetch(`${BASE_URL}/products?offset=0&limit=1`);
    const [firstProduct] = await listResponse.json();
    const url = `${BASE_URL}/products/${firstProduct.id}`;

    // Act
    const response = await fetch(url);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.id).toBe(firstProduct.id);
    expect(body.title).toBe(firstProduct.title);
    expect(body).toHaveProperty('category');
  });

  test('GET /categories deve retornar uma lista de categorias válidas', async () => {
    // Arrange
    const url = `${BASE_URL}/categories`;

    // Act
    const response = await fetch(url);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((category) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
    });
  });

  test('POST /products deve criar um novo produto e retornar 201', async () => {
    // Arrange
    const newProduct = {
      title: 'Produto de Teste Jest',
      price: 99,
      description: 'Produto criado pelo teste de integração',
      categoryId: 1,
      images: ['https://placehold.co/600x400'],
    };

    // Act
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    const body = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body.title).toBe(newProduct.title);
    expect(body.price).toBe(newProduct.price);
    expect(body.description).toBe(newProduct.description);
  });

  test('GET /products/:id com id inexistente deve retornar erro 4xx', async () => {
    // Arrange
    const nonExistentId = 999999999;
    const url = `${BASE_URL}/products/${nonExistentId}`;

    // Act
    const response = await fetch(url);

    // Assert
    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
  });
});
