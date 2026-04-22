# Guía de Contribución — ParkinsonTap-GP

## Primeros pasos

1. Sigue la sección **Inicio rápido** del `README.md`
2. Verifica que los servicios levantan con `docker compose ps`
3. Pide al Scrum Master que te asigne una historia de usuario

---

## Flujo de trabajo

**Nunca hagas push directo a `main` o `develop`.**  
Todo cambio entra por Pull Request.

```bash
# 1. Siempre parte desde develop actualizado
git checkout develop
git pull origin develop

# 2. Crea tu rama
git checkout -b feature/US-03-registro-paciente

# 3. Trabaja, commitea frecuentemente
git add .
git commit -m "feat(backend): agregar entidad Paciente"

# 4. Push y abre PR hacia develop
git push origin feature/US-03-registro-paciente
```

---

## Convención de commits

```
tipo(alcance): descripción corta
```

| Tipo | Cuándo |
|------|--------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `refactor` | Refactor sin nueva funcionalidad |
| `test` | Agregar o corregir tests |
| `chore` | Mantenimiento (deps, config) |

**Ejemplos:**
```bash
git commit -m "feat(backend): agregar endpoint POST /api/tests"
git commit -m "fix(frontend): corregir navegación en móvil"
git commit -m "chore: actualizar dependencias npm"
```

---

## Pull Requests

Título: `[US-03] Registro de paciente`

Descripción debe incluir:
- ¿Qué hace este PR?
- ¿Cómo probarlo?
- Capturas si aplica

---

## Estándares por módulo

### Backend (Java)
- Usa Lombok para reducir boilerplate
- Todos los endpoints tienen su DTO correspondiente
- No expongas entidades JPA directamente en los controladores

### Frontend (React)
- Componentes funcionales con hooks
- No pongas lógica de negocio en componentes de UI

### ESP32
- No hardcodees credenciales (usa `secrets.h`)
- Comenta cualquier cambio en el filtro complementario
