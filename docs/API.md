# API

Alles onder `/api/` behalve `/api/login` vereist een geldige sessiecookie.
Zonder cookie: `401`.

| Methode | Pad | Body | Antwoord |
|---|---|---|---|
| POST | `/api/login` | `{gebruiker, wachtwoord}` | `200 {gebruiker}` + `Set-Cookie`, of `401`, of `429` |
| POST | `/api/logout` | — | `200` + cookie gewist |
| GET | `/api/state` | — | `{opdrachten[], specialisatie{}, instellingen{}, motor}` |
| PUT | `/api/opdrachten/:id` | opdrachtvelden | `200 {ok:true}` |
| DELETE | `/api/opdrachten/:id` | — | `200 {ok:true}` |
| PUT | `/api/specialisatie` | `{checked:{id:bool}}` | `200 {ok:true}` |
| PUT | `/api/instellingen` | `{rooster{}, periodes{}}` | `200 {ok:true}` |

`:id` mag alleen `A-Z a-z 0-9 _ -` bevatten, maximaal 64 tekens.

## Opdracht

```json
{
  "titel": "HDD bij maken, Volumes bij maken, Shares maken, Mappings, Profielen",
  "vak": "Server en Cloud",
  "code": "LAB-201N",
  "deadline": "2026-09-22",
  "periode": "P1",
  "status": "todo",
  "link": "https://github.com/ab2054356-star/opdrachtenradar",
  "notitie": "Volumes aangemaakt, shares nog niet getest.",
  "stappen": [{ "t": "HDD bij maken", "d": true }]
}
```

`status` is `todo`, `bezig`, `ingeleverd` of `klaar`. `deadline` is `JJJJ-MM-DD`
of leeg. Onbekende velden worden door de server weggegooid.
