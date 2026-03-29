# Infrastructure Reference

> **One-stop reference for all server, deployment, and credential knowledge.**
> Credentials are never stored here — use variable names that resolve after sourcing:
> ```bash
> source ~/.claude/infrastructure.env
> ```

---

## 1. Credential Sources

| What | Where |
|------|-------|
| Server IPs, SSH key, DB passwords, Cloudflare tokens, Deepgram key, PHYX IDs | `~/.claude/infrastructure.env` |
| VitalSync slug + API key (per project) | Project root `.mcp.json` |
| n8n API key | `~/Projects/n8n-builder/.mcp.json` |
| MUI X Pro license key | `VITE_MUI_LICENSE_KEY` in each app's `.env` |

---

## 2. Deploy Server (OVH)

| Property | Value |
|----------|-------|
| Public IP | `$SERVER_HOST` (15.204.34.114) |
| Private IP | `$SERVER_HOST_PRIVATE` (10.65.65.15) |
| SSH user | `$SERVER_USER` (admin) |
| SSH key | `$SERVER_SSH_KEY` (~/.ssh/id_ed25519) |
| Projects dir | `/srv/projects/{app-name}/` |
| Node.js | via `nvm` |

**SSH to server:**
```bash
source ~/.claude/infrastructure.env
ssh $SERVER_USER@$SERVER_HOST
```

**GitHub Actions use the public IP** — `$SERVER_HOST_PRIVATE` is unreachable from runners.

---

## 3. Deployed Apps

### Port Registry (Server: 15.204.34.114)

| Port | Project | API Port | Tunnel | GitHub Repo | Status |
|------|---------|----------|--------|-------------|--------|
| 3000 | phyx-contact-lookup | — | No | `itmooti/phyx-contact-lookup` | Live |
| 3010 | phyx-nurse-admin | 4000 | Yes | `itmooti/phyx-nurse-dashboard` | Live |
| 3020 | thc-portal | 4020 | Yes | `itmooti/thc-portal` | Live — `my.thehappy.clinic` |
| 3030 | bb-dashboard | 4030 | No | `itmooti/bb-dashboard` | Live |
| 3050 | n8n-onboarding | — | Yes | `itmooti/n8n-onboarding` | Live |
| 3060 | awesomate-admin | 4050 | Yes | `itmooti/awesomate-admin` | Live |
| 3070 | wrkflw | 4060 | Yes | `itmooti/wrkflw` | Live |
| 3080 | property-service-admin-template | 4070 | Yes | (template) | Template / In Progress |
| 3090 | ptpm-admin | 4080 | Yes | `itmooti/ptpm-admin` | In Progress |
| 3306 | MySQL (Percona 8.4) | — | — | — | Always running |

### Next Available Ports
- **Deploy port:** `3100` (app) + `4090` (API)
- **Register every new port** in `~/Projects/PORT-REGISTRY.md` before use

### Local Dev Ports

| Port | Project | Notes |
|------|---------|-------|
| 3002 | phyx-nurse-admin | Vite dev → localhost:4000 |
| 3040 | qa-issues | Vite dev → localhost:4040 |
| 3080 | property-service-admin-template | Vite dev → localhost:4070 |
| 3090 | ptpm-admin | Vite dev → localhost:4080 |
| 4040 | qa-issues | Express API |
| 5173 | thc-portal, wrkflw, phyx-nurse-admin/mobile | Vite default |
| 5174 | awesomate-admin | Vite dev |

---

## 4. MySQL Database (Percona 8.4)

| Property | Value |
|----------|-------|
| Location | `/srv/projects/database` on server |
| Container | `$DB_CONTAINER` (database-db-1) |
| Port | `$DB_PORT` (3306) |
| App user | `$DB_APP_USER` / `$DB_APP_PASSWORD` |
| Root user | `$DB_ROOT_USER` / `$DB_ROOT_PASSWORD` |
| Memory config | `innodb_buffer_pool_size = 512M` |

**From Docker containers** — use `host.docker.internal:3306` with:
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

**SSH tunnel for local dev:**
```bash
source ~/.claude/infrastructure.env
ssh -f -N -L 13306:localhost:${DB_PORT} ${SERVER_USER}@${SERVER_HOST}
# Then connect to: 127.0.0.1:13306
```

**Run SQL on production** (no local mysql client — always SSH + docker exec):
```bash
source ~/.claude/infrastructure.env
ssh ${SERVER_USER}@${SERVER_HOST} \
  "docker exec $DB_CONTAINER mysql -u $DB_APP_USER -p'$DB_APP_PASSWORD' my_db_name -e 'SELECT 1'"
```

**Provision a new database:**
```bash
source ~/.claude/infrastructure.env
ssh ${SERVER_USER}@${SERVER_HOST} \
  "docker exec $DB_CONTAINER mysql -u $DB_ROOT_USER -p'$DB_ROOT_PASSWORD' -e \
  'CREATE DATABASE IF NOT EXISTS my_new_app; GRANT ALL ON my_new_app.* TO app@\"%\";'"
```

**Naming convention:** underscores, no hyphens (e.g. `ptpm_admin`, `thc_portal`)

---

## 5. Cloudflare

| Property | Env Var |
|----------|---------|
| Account ID | `$CF_ACCOUNT_ID` |
| API Token | `$CF_API_TOKEN` |
| Zone ID (awesomate.ai) | `$CF_ZONE_AWESOMATE` |

**API token permissions required:** `Zone:DNS (Edit)` + `Account:Cloudflare Tunnel (Edit)`
> When adding a new domain, you MUST add the new zone to the token's scope in the Cloudflare dashboard.

**Tunnel architecture — CRITICAL:**
- Each app gets its own **dedicated `cloudflare/cloudflared` Docker container**
- The shared K8s tunnel `vitalstats-kc1` **cannot reach the deploy server** — do NOT use it
- Ingress: `http://app:80` (Docker service name, HTTP internally)
- DNS: CNAME `{tunnel_id}.cfargotunnel.com` in Cloudflare

**Full procedure:** `docs/deployment-procedure.md`

**Use Python `urllib.request`** for Cloudflare API calls — curl has shell escaping issues with complex JSON.

---

## 6. n8n Automation

| Property | Value |
|----------|-------|
| Instance URL | `https://automations.vitalstats.app` |
| API key location | `~/Projects/n8n-builder/.mcp.json` |
| Local project | `~/Projects/n8n-builder/` |

**Saved credential IDs (in n8n instance):**

| Credential | ID |
|------------|-----|
| OpenRouter AI | `qFReBx2QAju9Hxcz` |
| Gmail OAuth2 | `rsZT0xFSx7lmzRPo` |
| GitHub PAT | `Bzlg7BpZbbOainQl` |

**OpenRouter model ID (CRITICAL):** `anthropic/claude-sonnet-4.5`
❌ NOT: `anthropic/claude-sonnet-4-5-20250929`

**Key gotchas:**
- PUT requires the **full** workflow payload — partial updates silently fail
- Always POST to `/activate` after creating or updating a workflow
- Deactivate workflow before PUT update
- Webhook data path: `$json.body.fieldName` (NOT `$json.fieldName`)

---

## 7. GitHub

**Organization:** `itmooti` (private repositories)

**Required GitHub secrets per app:**

| Secret | Source |
|--------|--------|
| `SERVER_HOST` | `$SERVER_HOST` from infra.env |
| `SERVER_USER` | `$SERVER_USER` from infra.env |
| `SSH_PRIVATE_KEY` | `cat ~/.ssh/id_ed25519` |
| `GH_PAT` | `gh auth token` (OAuth token for git clone on server) |
| `VITE_VITALSYNC_API_KEY` | App-specific VitalSync key |
| `VITE_VITALSYNC_SLUG` | App-specific VitalSync slug |
| `VITE_MUI_LICENSE_KEY` | MUI X Pro license key |
| `CLOUDFLARE_TUNNEL_TOKEN` | From Cloudflare API (deployment-procedure.md) |
| `DB_PASSWORD` | `$DB_APP_PASSWORD` from infra.env |
| `DB_NAME` | App database name (e.g. `ptpm_admin`) |
| `JWT_SECRET` | 32+ char random string (`openssl rand -base64 32`) |

**Set SSH key secret:**
```bash
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_ed25519
```

---

## 8. VitalSync / MCP

| Property | Value |
|----------|-------|
| SDK CDN | `https://static-au03.vitalstats.app/static/sdk/v1/latest.js` |
| GraphQL API | `https://{slug}.vitalstats.app/api/v1/graphql` |
| WebSocket | `wss://{slug}.vitalstats.app/api/v1/graphql?apiKey={key}` |
| MCP server | `~/Projects/vitalsync-mcp/` |
| MCP build | `cd ~/Projects/vitalsync-mcp && npm run build` |

**PHYX-specific IDs:**

| Property | Env Var |
|----------|---------|
| DataSource ID | `$PHYX_DATASOURCE_ID` |
| OneSignal App ID | `$PHYX_ONESIGNAL_APP_ID` |

**Per-project MCP config** (`.mcp.json` in project root):
```json
{
  "mcpServers": {
    "vitalsync-mcp": {
      "command": "node",
      "args": ["~/Projects/vitalsync-mcp/build/index.js"],
      "env": {
        "VITALSYNC_SLUG": "your-slug",
        "VITALSYNC_API_KEY": "your-key"
      }
    },
    "n8n-mcp": { ... }
  }
}
```
> Project `.mcp.json` overrides `~/.claude/.mcp.json` — must include **both** vitalsync-mcp AND n8n-mcp.

---

## 9. Deepgram Voice API

| Property | Env Var |
|----------|---------|
| API Key | `$DEEPGRAM_API_KEY` |
| WebSocket | `wss://agent.deepgram.com/v1/agent/converse` |
| Audio format | linear16, 16kHz, mono |

> Settings message **must be first** — send before any audio data.
> Requires Express backend proxy to keep API key server-side (React + Mobile apps only).

---

## 10. New App Checklist

When adding a new app to the server:

- [ ] Claim ports from `~/Projects/PORT-REGISTRY.md` (next: app `3100`, API `4090`)
- [ ] Update `PORT-REGISTRY.md` with new entry
- [ ] Create Cloudflare Tunnel via API (`docs/deployment-procedure.md`)
- [ ] Add DNS CNAME record in Cloudflare
- [ ] Provision MySQL database (see §4 above)
- [ ] Create GitHub repo under `itmooti` org
- [ ] Add all required GitHub secrets (see §7 above)
- [ ] Add app to `KNOWN_APPS` in `scripts/sync-child.sh` to receive doc syncs
- [ ] Run `./scripts/sync-child.sh ../new-app-name` to push docs

---

## 11. Useful One-Liners

```bash
# SSH to server
source ~/.claude/infrastructure.env && ssh $SERVER_USER@$SERVER_HOST

# Check running Docker containers on server
source ~/.claude/infrastructure.env && ssh $SERVER_USER@$SERVER_HOST "docker ps"

# Tail app logs on server
source ~/.claude/infrastructure.env && ssh $SERVER_USER@$SERVER_HOST \
  "cd /srv/projects/my-app && docker compose logs -f --tail=50"

# Local MySQL tunnel
source ~/.claude/infrastructure.env && ssh -f -N -L 13306:localhost:3306 $SERVER_USER@$SERVER_HOST

# Check Cloudflare tunnel status for an app
source ~/.claude/infrastructure.env && ssh $SERVER_USER@$SERVER_HOST \
  "cd /srv/projects/my-app && docker compose logs tunnel --tail=20"

# Generate a JWT secret
openssl rand -base64 32
```
