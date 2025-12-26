# API Client

## Visão Geral

Cliente HTTP único e tipado para todas as chamadas de API. Centraliza configuração, interceptors, retry e tratamento de erros.

## Configuração Base

```typescript
// api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Interceptors

### Request Interceptor
```typescript
client.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor
```typescript
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(normalizeError(error));
  }
);
```

## Retry Logic

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && isRetryable(error)) {
      await delay(RETRY_DELAY);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

function isRetryable(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 503 || status === 502 || status === 504 || !status;
  }
  return false;
}
```

## Error Handling

### Error Types
```typescript
type ApiErrorCode = 
  | 'validation_error'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'internal_error'
  | 'network_error'
  | 'timeout';

interface ApiError {
  code: ApiErrorCode;
  message: string;
  fields?: Record<string, string>;
  status?: number;
}
```

### Normalizer
```typescript
function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        code: error.code === 'ECONNABORTED' ? 'timeout' : 'network_error',
        message: 'Não foi possível conectar ao servidor',
      };
    }
    
    const { status, data } = error.response;
    
    return {
      code: data?.error || 'internal_error',
      message: data?.message || 'Erro inesperado',
      fields: data?.fields,
      status,
    };
  }
  
  return {
    code: 'internal_error',
    message: 'Erro inesperado',
  };
}
```

## Typed Methods

```typescript
// api/contacts.api.ts
import { client } from './client';
import type { Contact, ContactCreate, ContactUpdate } from '../domains/contacts/contacts.types';

export const contactsApi = {
  list: (filters?: ContactsFilters) =>
    client.get<{ contacts: Contact[] }>('/contacts', { params: filters }),
  
  get: (id: string) =>
    client.get<{ contact: Contact }>(`/contacts/${id}`),
  
  create: (data: ContactCreate) =>
    client.post<{ contact: Contact }>('/contacts', data),
  
  update: (id: string, data: ContactUpdate) =>
    client.put<{ contact: Contact }>(`/contacts/${id}`, data),
  
  delete: (id: string) =>
    client.delete(`/contacts/${id}`),
};
```

## Timeout Configuration

| Operação | Timeout |
|----------|---------|
| GET (lista) | 10s |
| GET (item) | 5s |
| POST | 10s |
| PUT | 10s |
| DELETE | 5s |
| Upload | 60s |

## Headers Padrão

| Header | Valor |
|--------|-------|
| Content-Type | application/json |
| Accept | application/json |
| Accept-Language | pt-BR |

## Uso nos Stores

```typescript
// domains/contacts/contacts.store.ts
import { contactsApi } from '../../api/contacts.api';

export function createContactsStore() {
  return {
    async loadContacts() {
      this.status = 'loading';
      try {
        const { data } = await contactsApi.list();
        this.contacts = data.contacts;
        this.status = 'success';
      } catch (error) {
        this.error = error as ApiError;
        this.status = 'error';
      }
    },
  };
}
```
