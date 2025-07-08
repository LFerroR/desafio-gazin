// app/services/api.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Usar a variável de ambiente

export const apiService = {
    async getNiveis() {
        const res = await fetch(`${API_BASE_URL}/niveis`);
        if (!res.ok) {
            // Lidar com códigos de erro específicos se necessário, por exemplo, 404 para nenhum nível encontrado
            if (res.status === 404) {
                console.warn("Nenhum nível cadastrado.");
                return [];
            }
            throw new Error(`Erro ao buscar níveis: ${res.statusText}`);
        }
        return await res.json();
    },

    async getDesenvolvedores() {
        const res = await fetch(`${API_BASE_URL}/desenvolvedores`);
        if (!res.ok) {
            // Seu backend retorna 400 para lista vazia, vamos tratar isso aqui.
            if (res.status === 400) {
                console.warn("Nenhum desenvolvedor encontrado.");
                return [];
            }
            throw new Error(`Erro ao buscar desenvolvedores: ${res.statusText}`);
        }
        return await res.json();
    },

    async createDesenvolvedor(data: any) {
        console.log("Enviando Desenvolvedor:", data); 
        const response = await fetch(`${API_BASE_URL}/desenvolvedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Erro na resposta de criação de desenvolvedor:", response.status, text);
        }
        return response;
    },

    async updateDesenvolvedor(id: number, data: any) {
        console.log(`Enviando atualização para desenvolvedor ${id}:`, data);
        const response = await fetch(`${API_BASE_URL}/desenvolvedores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`Erro ao atualizar desenvolvedor ${id}:`, response.status, text);
        }
        return response;
    },

    async deleteDesenvolvedor(id: number) {
        console.log(`Deletando desenvolvedor ${id}`);
        const response = await fetch(`${API_BASE_URL}/desenvolvedores/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`Erro ao deletar desenvolvedor ${id}:`, response.status, text);
        }
        return response;
    },

    async createNivel(data: any) {
        console.log("Enviando Nível:", data);
        const response = await fetch(`${API_BASE_URL}/niveis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("Erro ao criar nível:", response.status, text);
        }
        return response;
    },
    
    async updateNivel(id: number, data: any) {
        console.log(`Enviando atualização para nível ${id}:`, data);
        const response = await fetch(`${API_BASE_URL}/niveis/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`Erro ao atualizar nível ${id}:`, response.status, text);
        }
        return response;
    },

    async deleteNivel(id: number) {
        console.log(`Deletando nível ${id}`);
        const response = await fetch(`${API_BASE_URL}/niveis/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`Erro ao deletar nível ${id}:`, response.status, text);
        }
        return response;
    }
};