# Backend architecture

The backend uses Clean Architecture dependency direction:

```text
api (FastAPI routes and request models)
                 |
                 v
application (use cases and framework-neutral DTOs)
                 |
                 v
domain (entities, rules, exceptions and ports)
                 ^
                 |
infrastructure (in-memory session and static-data adapters)
```

`api` is the presentation adapter. Routes translate HTTP concerns into DTOs,
call a use case, and translate expected domain errors to HTTP responses. They
must not access data modules, the game singleton, or game entities directly.

`application` contains the orchestration for character, battle, and catalog
use cases. It depends only on domain contracts. DTOs in this layer are plain
dataclasses; Pydantic models remain in `api/models`.

`domain` exposes the framework-independent game model and its errors. The
existing combat engine (`core`), cards (`models`), deck, and player modules are
the established game-rule implementation. Domain facades expose them to the
new layers while preserving the tested legacy imports used by the game.

`infrastructure` provides adapters. `InMemoryGameSessionRepository` is the
current persistence choice, while `StaticCatalogRepository` adapts the current
Python catalog data. A database or external catalog can replace either by
implementing the same small method surface and changing only `container.py`.

## Adding a feature

1. Put a game rule or entity in the domain-facing game model.
2. Add a framework-neutral input/output DTO and use case under `application`.
3. Define a port when the use case needs storage or an external service.
4. Implement the port in `infrastructure` and wire it in `container.py`.
5. Keep FastAPI-specific validation and status codes in `api`.

This keeps business rules independent of FastAPI, Pydantic, and a future
database implementation.
